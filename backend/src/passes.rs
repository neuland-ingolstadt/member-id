use crate::utils::{Claims, current_semester, generate_qr, verify_token};
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

    let groups_text = token_data.claims.groups.join(", ");

    let groups_label = if token_data.claims.groups.len() > 3 {
        let first_groups = token_data.claims.groups[..3].join(", ");
        let remaining = token_data.claims.groups.len() - 3;
        format!("{} +{}", first_groups, remaining)
    } else {
        groups_text.clone()
    };

    field_type = field_type.add_secondary_field(Content::new(
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
        "Neuland ID für Neuland Ingolstadt e.V.",
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
            label: Some("Neuland ID".into()),
            ..Default::default()
        },
    ));

    field_type = field_type.add_back_field(Content::new(
        "groups",
        &token_data.claims.groups.join(", "),
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
    .logo_text("Neuland ID".into())
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
    if Path::new(&icon_path).exists() {
        let file = File::open(Path::new(&icon_path))?;
        package.add_resource(resource::Type::Icon(resource::Version::Standard), file)?;
    }

    let logo_path = "./resources/logo.png";
    if Path::new(logo_path).exists() {
        let logo_file = File::open(Path::new(logo_path))?;
        package.add_resource(resource::Type::Logo(resource::Version::Standard), logo_file)?;
    }

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
