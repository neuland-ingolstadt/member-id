use crate::utils::{Claims, capitalize_groups, current_semester, generate_qr, verify_token};
use chrono::Utc;
use google_walletobjects1::api::{
    Barcode as GBarcode, CardRowOneItem, CardRowTemplateInfo, CardTemplateOverride,
    ClassTemplateInfo, DateTime, FieldReference, FieldSelector, GenericClass, GenericObject, Image,
    ImageUri, LocalizedString, TemplateItem, TextModuleData, TimeInterval, TranslatedString,
};
use passes::beacon;
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
use std::fs::File;
use std::io::Read;
use std::path::Path;

fn remove_nulls(value: &mut serde_json::Value) {
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

pub async fn generate_pkpass(token: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let (_, semester_end, semester_name_long) = current_semester();
    let max_age_wallet = (semester_end.timestamp() - Utc::now().timestamp()) as u64;

    let qr = generate_qr(token, "wi", max_age_wallet).await?.qr;

    let organization_name = env::var("PKPASS_ORGANIZATION_NAME")?;
    let pass_type_identifier = env::var("PKPASS_PASS_TYPE_IDENTIFIER")?;
    let team_identifier = env::var("PKPASS_TEAM_IDENTIFIER")?;
    let cert_path = env::var("PKPASS_SIGN_CERT_PATH")?;
    let key_path = env::var("PKPASS_SIGN_KEY_PATH")?;
    let beacon_proximity_uuid = env::var("PKPASS_BEACON_PROXIMITY_UUID")?;

    let mut file_sign_cert = std::fs::File::open(std::path::Path::new(&cert_path))?;
    let mut sign_cert_data = Vec::new();
    std::io::Read::read_to_end(&mut file_sign_cert, &mut sign_cert_data)?;

    let mut file_sign_key = std::fs::File::open(std::path::Path::new(&key_path))?;
    let mut sign_key_data = Vec::new();
    std::io::Read::read_to_end(&mut file_sign_key, &mut sign_key_data)?;

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

    let capitalized_groups = capitalize_groups(&token_data.claims.groups);
    let groups_text = capitalized_groups.join(", ");

    let groups_label = if capitalized_groups.len() > 3 {
        let first_groups = capitalized_groups[..3].join(", ");
        let remaining = capitalized_groups.len() - 3;
        format!("{first_groups} +{remaining}")
    } else {
        groups_text.clone()
    };

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
        &semester_name_long,
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
        &capitalized_groups.join(", "),
        ContentOptions {
            label: Some("Gruppen".into()),
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
        serial_number: token_data.claims.sub,
    })
    .expiration_date(expiration_date)
    .fields(field_type)
    .set_sharing_prohibited(true)
    .add_barcode(barcode)
    .logo_text("Neuland Ingolstadt".into())
    .appearance(visual_appearance::VisualAppearance {
        label_color: visual_appearance::Color::new(0, 221, 0),
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

    let icon_file = File::open(Path::new(&icon_path))?;
    package.add_resource(resource::Type::Icon(resource::Version::Standard), icon_file)?;
    let icon_file_2x = File::open(Path::new(&icon_path_2x))?;
    package.add_resource(
        resource::Type::Icon(resource::Version::Size2X),
        icon_file_2x,
    )?;
    let icon_file_3x = File::open(Path::new(&icon_path_3x))?;
    package.add_resource(
        resource::Type::Icon(resource::Version::Size3X),
        icon_file_3x,
    )?;

    let logo_path = "./resources/logo.png";
    let logo_path_2x = "./resources/logo@2x.png";
    let logo_path_3x = "./resources/logo@3x.png";

    let logo_file = File::open(Path::new(logo_path))?;
    package.add_resource(resource::Type::Logo(resource::Version::Standard), logo_file)?;
    let logo_file_2x = File::open(Path::new(logo_path_2x))?;
    package.add_resource(
        resource::Type::Logo(resource::Version::Size2X),
        logo_file_2x,
    )?;
    let logo_file_3x = File::open(Path::new(logo_path_3x))?;
    package.add_resource(
        resource::Type::Logo(resource::Version::Size3X),
        logo_file_3x,
    )?;

    let mut file_sign_cert = File::open(Path::new(&cert_path))?;
    let mut sign_cert_data = Vec::new();
    std::io::Read::read_to_end(&mut file_sign_cert, &mut sign_cert_data)?;

    let mut file_sign_key = File::open(Path::new(&key_path))?;
    let mut sign_key_data = Vec::new();
    std::io::Read::read_to_end(&mut file_sign_key, &mut sign_key_data)?;

    let sign_config = sign::SignConfig::new(WWDR::G4, &sign_cert_data, &sign_key_data)?;
    package.add_certificates(sign_config);

    let mut cursor = std::io::Cursor::new(Vec::new());
    package.write(&mut cursor)?;
    Ok(cursor.into_inner())
}

pub async fn generate_gpass(token: &str) -> Result<String, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let (semester_name, semester_end, semester_name_long) = current_semester();
    let max_age_wallet = (semester_end.timestamp() - Utc::now().timestamp()) as u64;

    let qr = generate_qr(token, "wi", max_age_wallet).await?.qr;

    let issuer_id = env::var("GOOGLE_WALLET_ISSUER_ID")?;
    let class_id = env::var("GOOGLE_WALLET_CLASS_ID")?;
    let service_account_email = env::var("GOOGLE_SERVICE_ACCOUNT_EMAIL")?;
    let private_key_path = env::var("GOOGLE_SERVICE_ACCOUNT_KEY_PATH")?;
    let mut private_key_file = std::fs::File::open(&private_key_path)?;
    let mut private_key_pem = String::new();
    private_key_file.read_to_string(&mut private_key_pem)?;
    let logo_url = "https://raw.githubusercontent.com/neuland-ingolstadt/member-id/9548e607dc2c3da786b82d26b585d2a539f9197c/backend/resources/logo@3x.png".to_string();

    let encoding_key = jsonwebtoken::EncodingKey::from_rsa_pem(private_key_pem.as_bytes())?;

    let object_id = format!("{}.{}.{}", issuer_id, token_data.claims.sub, semester_name);

    let groups = capitalize_groups(&token_data.claims.groups).join(", ");

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
            body: Some(semester_name_long),
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

    let object = GenericObject {
        id: Some(object_id),
        class_id: Some(format!("{issuer_id}.{class_id}")),
        state: Some("ACTIVE".into()),
        card_title: Some(card_title),
        header: Some(header),
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

    let card_rows = vec![
        CardRowTemplateInfo {
            one_item: Some(CardRowOneItem {
                item: Some(TemplateItem {
                    first_value: Some(groups_selector),
                    ..Default::default()
                }),
            }),
            ..Default::default()
        },
        CardRowTemplateInfo {
            one_item: Some(CardRowOneItem {
                item: Some(TemplateItem {
                    first_value: Some(semester_selector),
                    ..Default::default()
                }),
            }),
            ..Default::default()
        },
    ];

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
    Ok(jwt)
}
