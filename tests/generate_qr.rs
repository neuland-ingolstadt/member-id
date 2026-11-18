mod support;

use member_id::utils::generate_qr;
use serial_test::serial;
use support::{JwksEnv, mint_member_jwt, set_qr_private_key_env};

#[tokio::test]
#[serial]
async fn generate_qr_signs_for_member_token() {
    let _jwks = JwksEnv::start().await;
    set_qr_private_key_env();

    let token = mint_member_jwt(&["mitglieder", "engineering"]);
    let qr = generate_qr(&token, "a", 3600).await.expect("generate qr");

    assert!(!qr.qr.is_empty());
    assert!(qr.exp > qr.iat);
    assert_eq!(qr.exp - qr.iat, 3600);
}

#[tokio::test]
#[serial]
async fn generate_qr_rejects_token_without_mitglieder_group() {
    let _jwks = JwksEnv::start().await;
    set_qr_private_key_env();

    let token = mint_member_jwt(&["engineering"]);
    let err = match generate_qr(&token, "a", 3600).await {
        Ok(_) => panic!("expected missing mitglieder error"),
        Err(e) => e,
    };
    assert!(err.to_string().contains("mitglieder"));
}
