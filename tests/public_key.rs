mod support;

use member_id::utils::public_key_hex;
use serial_test::serial;
use support::{clear_qr_private_key_env, set_qr_private_key_env, set_qr_private_key_hex};

#[test]
#[serial]
fn derives_uncompressed_public_key_hex() {
    set_qr_private_key_env();
    let hex = public_key_hex().expect("valid test key");
    assert_eq!(hex.len(), 130);
    assert!(hex.starts_with("04"));
}

#[test]
#[serial]
fn rejects_missing_env() {
    clear_qr_private_key_env();
    let err = public_key_hex().unwrap_err().to_string();
    assert!(err.contains("QR_PRIVATE_KEY_HEX"));
}

#[test]
#[serial]
fn rejects_wrong_key_length() {
    set_qr_private_key_hex("abcd");
    let err = public_key_hex().unwrap_err().to_string();
    assert!(err.contains("32 bytes"));
}
