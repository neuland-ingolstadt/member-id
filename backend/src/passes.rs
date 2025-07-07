use crate::utils::{Claims, capitalize_groups, current_semester, generate_qr, verify_token};
use chrono::Utc;
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
use std::env;
use std::fs::File;
use std::io::Read;
use std::path::Path;

pub async fn generate_pkpass(token: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let (semester_name, semester_end) = current_semester();
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
        description: "Neuland ID".into(),
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

    let (semester_name, semester_end) = current_semester();
    let max_age_wallet = (semester_end.timestamp() - Utc::now().timestamp()) as u64;

    let qr = generate_qr(token, "wi", max_age_wallet).await?.qr;

    let issuer_id = env::var("GOOGLE_WALLET_ISSUER_ID")?;
    let class_id = env::var("GOOGLE_WALLET_CLASS_ID")?;
    let service_account_email = env::var("GOOGLE_SERVICE_ACCOUNT_EMAIL")?;
    let private_key_path = env::var("GOOGLE_SERVICE_ACCOUNT_KEY_PATH")?;
    let mut private_key_file = std::fs::File::open(&private_key_path)?;
    let mut private_key_pem = String::new();
    private_key_file.read_to_string(&mut private_key_pem)?;
    let logo_url = env::var("GOOGLE_WALLET_LOGO_URL")?;

    let encoding_key = jsonwebtoken::EncodingKey::from_rsa_pem(private_key_pem.as_bytes())?;

    let object_id = format!("{}.member-{}", issuer_id, token_data.claims.sub);

    let groups = capitalize_groups(&token_data.claims.groups).join(", ");

    let object = serde_json::json!({
        "id": object_id,
        "classId": format!("{}.{}", issuer_id, class_id),
        "state": "ACTIVE",
        "cardTitle": {
            "defaultValue": {
                "language": "de",
                "value": "Neuland ID"
            }
        },
        "header": {
            "defaultValue": {
                "language": "de",
                "value": semester_name
            }
        },
        "logo": {
            "sourceUri": {
                "uri": logo_url
            },
            "contentDescription": {
                "defaultValue": {
                    "language": "de",
                    "value": "Neuland Ingolstadt e.V. Logo"
                }
            }
        },
        "hexBackgroundColor": "#000000",
        "barcode": {
            "type": "QR_CODE",
            "value": qr
        },
        "validTimeInterval": {
            "start": Utc::now().to_rfc3339(),
            "end": semester_end.to_rfc3339()
        },
        "textModulesData": [
            {
                "header": "Name",
                "body": token_data.claims.given_name,
                "id": "NAME"
            },
            {
                "header": "Benutzername",
                "body": token_data.claims.preferred_username.to_lowercase(),
                "id": "USERNAME"
            },
            {
                "header": "Gruppen",
                "body": groups,
                "id": "GROUPS"
            },
            {
                "header": "Gültig",
                "body": semester_end.format("%Y-%m-%d").to_string(),
                "id": "VALID_UNTIL"
            }
        ]
    });

    let claims = serde_json::json!({
        "iss": service_account_email,
        "aud": "google",
        "typ": "savetowallet",
        "payload": {"genericObjects": [object]}
    });

    let jwt = jsonwebtoken::encode(
        &jsonwebtoken::Header::new(jsonwebtoken::Algorithm::RS256),
        &claims,
        &encoding_key,
    )?;
    Ok(format!("https://pay.google.com/gp/v/save/{jwt}"))
}
