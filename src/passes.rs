use crate::utils::filter_groups;
use crate::utils::{Claims, current_semester, format_groups_label, generate_qr, verify_token};
use chrono::Utc;
use google_walletobjects1::api::{
    Barcode as GBarcode, CardRowTemplateInfo, CardRowTwoItems, CardTemplateOverride,
    ClassTemplateInfo, DateTime, FieldReference, FieldSelector, GenericClass, GenericObject, Image,
    ImageUri, LocalizedString, TemplateItem, TextModuleData, TimeInterval, TranslatedString,
};
use log::debug;
use passes::beacon;
use passes::manifest::Manifest;
use passes::sign;
use passes::visual_appearance;
use passes::{
    Package, PassBuilder, PassConfig,
    barcode::{Barcode, BarcodeFormat},
    fields::{self, Content, ContentOptions, Type as FieldType},
    resource,
    sign::WWDR,
};
use serde_json::json;
use std::env;
use std::io::{Cursor, Seek, Write};

pub fn remove_nulls(value: &mut serde_json::Value) {
    match value {
        serde_json::Value::Object(map) => {
            let keys: Vec<String> = map.keys().cloned().collect();
            for k in keys {
                if let Some(v) = map.get_mut(&k) {
                    if v.is_null() {
                        map.remove(&k);
                    } else {
                        remove_nulls(v);
                    }
                }
            }
        }
        serde_json::Value::Array(arr) => {
            for v in arr.iter_mut() {
                remove_nulls(v);
            }
        }
        _ => {}
    }
}

/// iOS 27+ featured actions. Injected into pass.json because upstream `passes`
/// does not model this field yet.
fn featured_actions() -> serde_json::Value {
    let connect_url = env::var("PKPASS_FEATURED_CONNECT_URL")
        .unwrap_or_else(|_| "https://connect.neuland.ing".into());
    let place_id =
        env::var("PKPASS_FEATURED_PLACE_IDENTIFIER").unwrap_or_else(|_| "IDE6D929DA63F7A57".into());
    json!([
        {
            "identifier": "connect",
            "type": "membershipBenefits",
            "url": connect_url,
        },
        {
            "identifier": "office",
            "type": "place",
            "placeIdentifier": place_id,
        }
    ])
}

/// Write a signed .pkpass, injecting `featuredActions` into pass.json.
fn write_pkpass_with_featured_actions<W: Write + Seek>(
    package: &Package,
    writer: W,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut pass_value: serde_json::Value = serde_json::from_str(&package.pass.make_json()?)?;
    pass_value["featuredActions"] = featured_actions();
    let pass_json = serde_json::to_string_pretty(&pass_value)?;

    let mut manifest = Manifest::new();
    let mut zip = zip::ZipWriter::new(writer);
    let options =
        zip::write::FileOptions::default().compression_method(zip::CompressionMethod::Stored);

    zip.start_file("pass.json", options)?;
    zip.write_all(pass_json.as_bytes())?;
    manifest.add_item("pass.json", pass_json.as_bytes());

    for resource in &package.resources {
        zip.start_file(resource.filename(), options)?;
        zip.write_all(resource.as_bytes())?;
        manifest.add_item(resource.filename().as_str(), resource.as_bytes());
    }

    zip.start_file("manifest.json", options)?;
    let manifest_json = manifest.make_json()?;
    zip.write_all(manifest_json.as_bytes())?;

    if let Some(sign_config) = &package.sign_config {
        let flags = openssl::pkcs7::Pkcs7Flags::DETACHED;
        let mut certs = openssl::stack::Stack::new()?;
        certs.push(sign_config.cert.clone())?;
        let pkcs7 = openssl::pkcs7::Pkcs7::sign(
            &sign_config.sign_cert,
            &sign_config.sign_key,
            &certs,
            manifest_json.as_bytes(),
            flags,
        )?;
        let signature_data = pkcs7.to_der()?;
        zip.start_file("signature", options)?;
        zip.write_all(&signature_data)?;
    }

    zip.finish()?;
    Ok(())
}

pub async fn generate_pkpass(token: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let (semester_name, semester_end, semester_name_long) = current_semester();
    let max_age_wallet = (semester_end.timestamp() - Utc::now().timestamp()) as u64;

    let qr = generate_qr(token, "wi", max_age_wallet).await?.qr;

    let organization_name = env::var("PKPASS_ORGANIZATION_NAME")?;
    let pass_type_identifier = env::var("PKPASS_PASS_TYPE_IDENTIFIER")?;
    let team_identifier = env::var("PKPASS_TEAM_IDENTIFIER")?;
    let cert_path = env::var("PKPASS_SIGN_CERT_PATH")?;
    let key_path = env::var("PKPASS_SIGN_KEY_PATH")?;
    let beacon_proximity_uuid = env::var("PKPASS_BEACON_PROXIMITY_UUID")?;

    let expiration_date = semester_end;

    let mut field_type = FieldType::Generic {
        pass_fields: fields::Fields::default(),
    };

    field_type = field_type.add_primary_field(Content::new(
        "name",
        &token_data.claims.given_name,
        ContentOptions {
            label: Some("NAME".into()),
            ..Default::default()
        },
    ));

    let username = format!("@{}", token_data.claims.preferred_username.to_lowercase());

    field_type = field_type.add_secondary_field(Content::new(
        "username",
        &username,
        ContentOptions {
            label: Some("BENUTZERNAME".into()),
            ..Default::default()
        },
    ));

    let groups: Vec<String> = token_data.claims.groups.clone();
    let front_groups = filter_groups(&groups);
    let groups_label = format_groups_label(&groups);

    field_type = field_type.add_auxiliary_field(Content::new(
        "groups_label",
        &groups_label,
        ContentOptions {
            label: Some("GRUPPEN".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_header_field(Content::new(
        "semester",
        &semester_name,
        ContentOptions {
            label: Some("Semester".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "description",
        "Der digitale Mitgliedsausweis von Neuland Ingolstadt e.V.",
        ContentOptions {
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "organization",
        "Neuland Ingolstadt e.V.",
        ContentOptions {
            label: Some("Organisation".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "member_id",
        &token_data.claims.sub,
        ContentOptions {
            label: Some("Mitgliedsnummer ID".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "groups",
        &front_groups.join(", "),
        ContentOptions {
            label: Some("Gruppen".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "semester_name_long",
        &semester_name_long,
        ContentOptions {
            label: Some("Semester".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "valid_until",
        &expiration_date.format("%Y-%m-%d").to_string(),
        ContentOptions {
            label: Some("Gültig bis".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "support",
        "info@neuland-ingolstadt.de",
        ContentOptions {
            label: Some("Support".into()),
            ..Default::default()
        },
    ));

    let barcode = Barcode {
        message: qr,
        format: BarcodeFormat::QR,
        alt_text: None,
        message_encoding: "iso-8859-1".into(),
    };

    let pass = PassBuilder::new(PassConfig {
        organization_name,
        description: "Neuland Mitgliedsausweis".into(),
        pass_type_identifier,
        team_identifier,
        serial_number: format!("{}.{}", token_data.claims.sub, semester_name),
    })
    .expiration_date(expiration_date)
    .fields(field_type)
    .set_sharing_prohibited(true)
    .add_barcode(barcode)
    .logo_text("Neuland Ingolstadt".into())
    .appearance(visual_appearance::VisualAppearance {
        label_color: visual_appearance::Color::new(0x23, 0xff, 0x88),
        foreground_color: visual_appearance::Color::white(),
        background_color: visual_appearance::Color::black(),
    })
    .add_associated_store_identifier(1617096811)
    .app_launch_url("https://web.neuland.app/member".into())
    .add_beacon(beacon::Beacon {
        proximity_uuid: beacon_proximity_uuid,
        major: Some(1),
        minor: Some(10),
        relevant_text: Some("Willkommen bei Neuland!".to_string()),
    })
    .build();

    let mut package = Package::new(pass);

    let icon_path = "./resources/icon.png";
    let icon_path_2x = "./resources/icon@2x.png";
    let icon_path_3x = "./resources/icon@3x.png";

    package.add_resource(
        resource::Type::Icon(resource::Version::Standard),
        Cursor::new(tokio::fs::read(icon_path).await?),
    )?;
    package.add_resource(
        resource::Type::Icon(resource::Version::Size2X),
        Cursor::new(tokio::fs::read(icon_path_2x).await?),
    )?;
    package.add_resource(
        resource::Type::Icon(resource::Version::Size3X),
        Cursor::new(tokio::fs::read(icon_path_3x).await?),
    )?;

    let logo_path = "./resources/logo.png";
    let logo_path_2x = "./resources/logo@2x.png";
    let logo_path_3x = "./resources/logo@3x.png";

    package.add_resource(
        resource::Type::Logo(resource::Version::Standard),
        Cursor::new(tokio::fs::read(logo_path).await?),
    )?;
    package.add_resource(
        resource::Type::Logo(resource::Version::Size2X),
        Cursor::new(tokio::fs::read(logo_path_2x).await?),
    )?;
    package.add_resource(
        resource::Type::Logo(resource::Version::Size3X),
        Cursor::new(tokio::fs::read(logo_path_3x).await?),
    )?;

    let sign_cert_data = tokio::fs::read(&cert_path).await?;
    let sign_key_data = tokio::fs::read(&key_path).await?;

    let sign_config = sign::SignConfig::new(WWDR::G4, &sign_cert_data, &sign_key_data)?;
    package.add_certificates(sign_config);

    let mut cursor = std::io::Cursor::new(Vec::new());
    write_pkpass_with_featured_actions(&package, &mut cursor)?;
    debug!("PKPASS issued.");
    Ok(cursor.into_inner())
}

pub async fn generate_gpass(token: &str) -> Result<String, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let (semester_name, semester_end, _semester_name_long) = current_semester();
    let max_age_wallet = (semester_end.timestamp() - Utc::now().timestamp()) as u64;

    let qr = generate_qr(token, "wa", max_age_wallet).await?.qr;

    let issuer_id = env::var("GOOGLE_WALLET_ISSUER_ID")?;
    let class_id = env::var("GOOGLE_WALLET_CLASS_ID")?;
    let service_account_email = env::var("GOOGLE_SERVICE_ACCOUNT_EMAIL")?;
    let private_key_path = env::var("GOOGLE_SERVICE_ACCOUNT_KEY_PATH")?;
    let private_key_pem = tokio::fs::read_to_string(&private_key_path).await?;
    let logo_url = "https://id.neuland-ingolstadt.de/gpass-logo.png".to_string();
    let hero_image_url = "https://id.neuland-ingolstadt.de/gpass-hero.png".to_string();

    let encoding_key = jsonwebtoken::EncodingKey::from_rsa_pem(private_key_pem.as_bytes())?;

    let object_id = format!(
        "{}.{}.{}.10",
        issuer_id, token_data.claims.sub, semester_name
    );

    let groups = filter_groups(&token_data.claims.groups).join(", ");

    let card_title = LocalizedString {
        default_value: Some(TranslatedString {
            language: Some("de".into()),
            value: Some("Neuland Ingolstadt e.V.".into()),
            ..Default::default()
        }),
        ..Default::default()
    };

    let header = LocalizedString {
        default_value: Some(TranslatedString {
            language: Some("de".into()),
            value: Some(token_data.claims.given_name.clone()),
            ..Default::default()
        }),
        ..Default::default()
    };

    let subheader = LocalizedString {
        default_value: Some(TranslatedString {
            language: Some("de".into()),
            value: Some(format!(
                "@{}",
                token_data.claims.preferred_username.to_lowercase()
            )),
            ..Default::default()
        }),
        ..Default::default()
    };

    let logo = Image {
        source_uri: Some(ImageUri {
            uri: Some(logo_url),
            ..Default::default()
        }),
        content_description: Some(LocalizedString {
            default_value: Some(TranslatedString {
                language: Some("de".into()),
                value: Some("Neuland Ingolstadt e.V. Logo".into()),
                ..Default::default()
            }),
            ..Default::default()
        }),
        ..Default::default()
    };

    let barcode = GBarcode {
        type_: Some("QR_CODE".into()),
        value: Some(qr),
        ..Default::default()
    };

    let valid_time_interval = TimeInterval {
        start: Some(DateTime {
            date: Some(Utc::now().to_rfc3339()),
        }),
        end: Some(DateTime {
            date: Some(semester_end.to_rfc3339()),
        }),
        ..Default::default()
    };

    let text_modules = vec![
        TextModuleData {
            header: Some("Name".into()),
            body: Some(token_data.claims.given_name),
            id: Some("NAME".into()),
            ..Default::default()
        },
        TextModuleData {
            header: Some("Benutzername".into()),
            body: Some(token_data.claims.preferred_username.to_lowercase()),
            id: Some("USERNAME".into()),
            ..Default::default()
        },
        TextModuleData {
            header: Some("Semester".into()),
            body: Some(semester_name),
            id: Some("SEMESTER".into()),
            ..Default::default()
        },
        TextModuleData {
            header: Some("Gruppen".into()),
            body: Some(groups),
            id: Some("GROUPS".into()),
            ..Default::default()
        },
        TextModuleData {
            header: Some("Gültig bis".into()),
            body: Some(semester_end.format("%Y-%m-%d").to_string()),
            id: Some("VALID_UNTIL".into()),
            ..Default::default()
        },
        TextModuleData {
            header: Some("Mitgliedsnummer".into()),
            body: Some(token_data.claims.sub),
            id: Some("MEMBER_ID".into()),
            ..Default::default()
        },
    ];

    let hero_image = Image {
        source_uri: Some(ImageUri {
            uri: Some(hero_image_url),
            ..Default::default()
        }),
        ..Default::default()
    };

    let object = GenericObject {
        id: Some(object_id),
        class_id: Some(format!("{issuer_id}.{class_id}")),
        state: Some("ACTIVE".into()),
        card_title: Some(card_title),
        header: Some(header),
        hero_image: Some(hero_image),
        subheader: Some(subheader),
        logo: Some(logo),
        hex_background_color: Some("#031c07".into()),
        barcode: Some(barcode),
        valid_time_interval: Some(valid_time_interval),
        text_modules_data: Some(text_modules),
        ..Default::default()
    };

    let mut object_value = serde_json::to_value(object)?;
    remove_nulls(&mut object_value);

    let groups_selector = FieldSelector {
        fields: Some(vec![FieldReference {
            field_path: Some("object.textModulesData['GROUPS']".into()),
            ..Default::default()
        }]),
    };
    let semester_selector = FieldSelector {
        fields: Some(vec![FieldReference {
            field_path: Some("object.textModulesData['SEMESTER']".into()),
            ..Default::default()
        }]),
    };

    let card_rows = vec![CardRowTemplateInfo {
        two_items: Some(CardRowTwoItems {
            start_item: Some(TemplateItem {
                first_value: Some(groups_selector),
                ..Default::default()
            }),
            end_item: Some(TemplateItem {
                first_value: Some(semester_selector),
                ..Default::default()
            }),
        }),
        ..Default::default()
    }];

    let class = GenericClass {
        id: Some(format!("{issuer_id}.{class_id}")),
        class_template_info: Some(ClassTemplateInfo {
            card_template_override: Some(CardTemplateOverride {
                card_row_template_infos: Some(card_rows),
            }),
            ..Default::default()
        }),
        ..Default::default()
    };

    let mut class_value = serde_json::to_value(class)?;
    remove_nulls(&mut class_value);

    let claims = json!({
        "iss": service_account_email,
        "iat": Utc::now().timestamp(),
        "aud": "google",
        "typ": "savetowallet",
        "payload": {"genericObjects": [object_value], "genericClasses": [class_value]},
    });

    let jwt = jsonwebtoken::encode(
        &jsonwebtoken::Header::new(jsonwebtoken::Algorithm::RS256),
        &claims,
        &encoding_key,
    )?;
    debug!("GPASS issued.");
    Ok(jwt)
}
