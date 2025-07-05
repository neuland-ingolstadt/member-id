use chrono::{Datelike, NaiveDate, TimeZone, Utc};
use flate2::{Compression, write::ZlibEncoder};
use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode, decode_header};
use log::info;
use p256::ecdsa::SigningKey;
use p256::ecdsa::signature::Signer;
use serde::{Deserialize, Serialize};
use std::{
    env,
    time::{SystemTime, UNIX_EPOCH},
};

#[derive(Serialize)]
struct QrPayload {
    sub: String,
    name: String,
    t: String,
    iat: u64,
    exp: u64,
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct QrResponse {
    #[schema(example = "HELLOWORLD123")]
    pub qr: String,
    #[schema(example = "1719322624")]
    pub iat: u64,
    #[schema(example = "1720187424")]
    pub exp: u64,
}

#[derive(Deserialize)]
pub struct Claims {
    pub sub: String,
    pub given_name: String,
    pub preferred_username: String,
    pub groups: Vec<String>,
}

#[derive(Deserialize)]
struct Jwk {
    kid: String,
    n: String,
    e: String,
}

#[derive(Deserialize)]
struct Jwks {
    keys: Vec<Jwk>,
}

pub fn log_public_key() -> Result<(), Box<dyn std::error::Error>> {
    let hex = public_key_hex()?;
    info!("QR public key: {}", hex);
    Ok(())
}

pub fn public_key_hex() -> Result<String, Box<dyn std::error::Error>> {
    let key_hex = env::var("QR_PRIVATE_KEY_HEX").map_err(|_| "QR_PRIVATE_KEY_HEX not set")?;
    let key_bytes = hex::decode(key_hex)?;
    if key_bytes.len() != 32 {
        return Err("QR_PRIVATE_KEY_HEX must decode to 32 bytes".into());
    }
    let arr: [u8; 32] = key_bytes.try_into().map_err(|_| "invalid key length")?;
    let signing_key = SigningKey::from_bytes((&arr).into())?;
    let verifying_key = signing_key.verifying_key();
    let encoded = verifying_key.to_encoded_point(false);
    Ok(hex::encode(encoded.as_bytes()))
}

pub fn current_semester() -> (String, chrono::DateTime<Utc>) {
    let today = Utc::now().date_naive();
    let year = today.year();

    let summer_start = NaiveDate::from_ymd_opt(year, 3, 15).unwrap();
    let summer_end = NaiveDate::from_ymd_opt(year, 9, 30).unwrap();

    if today >= summer_start && today <= summer_end {
        let end = Utc
            .with_ymd_and_hms(year, 9, 30, 23, 59, 59)
            .single()
            .unwrap();
        (format!("SS{:02}", year % 100), end)
    } else if today > summer_end {
        let end = Utc
            .with_ymd_and_hms(year + 1, 3, 14, 23, 59, 59)
            .single()
            .unwrap();
        (format!("WS{:02}", year % 100), end)
    } else {
        let end = Utc
            .with_ymd_and_hms(year, 3, 14, 23, 59, 59)
            .single()
            .unwrap();
        (format!("WS{:02}", (year - 1) % 100), end)
    }
}

pub async fn verify_token<C>(token: &str) -> Result<TokenData<C>, Box<dyn std::error::Error>>
where
    C: for<'de> Deserialize<'de>,
{
    let jwks_url = env::var("JWKS_URL").map_err(|_| "JWKS_URL not set")?;
    let expected_audience =
        env::var("EXPECTED_AUDIENCE").map_err(|_| "EXPECTED_AUDIENCE not set")?;

    let header = decode_header(token)?;
    let kid = header.kid.ok_or("kid missing")?;

    let jwks: Jwks = reqwest::get(&jwks_url).await?.json().await?;
    let jwk = jwks
        .keys
        .iter()
        .find(|k| k.kid == kid)
        .ok_or("kid not found")?;

    let decoding_key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)?;

    let mut validation = Validation::new(Algorithm::RS256);
    validation.validate_exp = true;
    validation.validate_aud = true;
    validation.set_audience(&[expected_audience]);

    Ok(decode::<C>(token, &decoding_key, &validation)?)
}

pub async fn generate_qr(
    token: &str,
    qr_type: &str,
    max_age: u64,
) -> Result<QrResponse, Box<dyn std::error::Error>> {
    let token_data = verify_token::<Claims>(token).await?;

    if !token_data.claims.groups.iter().any(|g| g == "mitglieder") {
        return Err("token missing required 'mitglieder' group".into());
    }

    let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();
    let payload = QrPayload {
        sub: token_data.claims.sub,
        name: token_data.claims.given_name,
        t: qr_type.to_string(),
        iat: now,
        exp: now + max_age,
    };

    let cbor = serde_cbor::to_vec(&payload)?;

    let key_hex = env::var("QR_PRIVATE_KEY_HEX").map_err(|_| "QR_PRIVATE_KEY_HEX not set")?;
    let key_bytes = hex::decode(key_hex)?;
    if key_bytes.len() != 32 {
        return Err("QR_PRIVATE_KEY_HEX must decode to 32 bytes".into());
    }
    let arr: [u8; 32] = key_bytes.try_into().map_err(|_| "invalid key length")?;
    let signing_key = SigningKey::from_bytes((&arr).into())?;
    let signature: p256::ecdsa::Signature = signing_key.sign(&cbor);

    let mut combined = Vec::new();
    combined.extend_from_slice(&cbor);
    combined.extend_from_slice(&signature.to_bytes());

    use std::io::Write;
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(&combined)?;
    let compressed = encoder.finish()?;

    Ok(QrResponse {
        qr: base45::encode(compressed),
        iat: payload.iat,
        exp: payload.exp,
    })
}

pub fn capitalize_groups(groups: &[String]) -> Vec<String> {
    groups
        .iter()
        .map(|group| {
            let mut chars: Vec<char> = group.chars().collect();
            if let Some(first_char) = chars.first_mut() {
                *first_char = first_char.to_uppercase().next().unwrap_or(*first_char);
            }
            chars.into_iter().collect()
        })
        .collect()
}
