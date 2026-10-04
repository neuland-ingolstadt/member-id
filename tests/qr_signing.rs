mod support;

use member_id::utils::sign_qr_payload;
use serial_test::serial;
use support::{clear_qr_private_key_env, set_qr_private_key_env, set_qr_private_key_hex};

#[test]
#[serial]
fn produces_deterministic_base45_qr_for_fixed_inputs() {
    set_qr_private_key_env();
    let first = sign_qr_payload(
        "user-1".into(),
        "Robert E.".into(),
        "a",
        1_700_000_000,
        1_700_086_400,
    )
    .expect("sign");
    let second = sign_qr_payload(
        "user-1".into(),
        "Robert E.".into(),
        "a",
        1_700_000_000,
        1_700_086_400,
    )
    .expect("sign");
    assert_eq!(first.qr, second.qr);
    assert_eq!(first.iat, 1_700_000_000);
    assert_eq!(first.exp, 1_700_086_400);
    assert!(!first.qr.is_empty());
}

#[test]
#[serial]
fn different_keys_yield_different_qr_strings() {
    set_qr_private_key_env();
    let baseline = sign_qr_payload("u".into(), "N.".into(), "a", 100, 200)
        .expect("sign")
        .qr;

    set_qr_private_key_hex("2222222222222222222222222222222222222222222222222222222222222222");
    let other = sign_qr_payload("u".into(), "N.".into(), "a", 100, 200)
        .expect("sign")
        .qr;

    assert_ne!(baseline, other);
}

#[test]
#[serial]
fn rejects_missing_qr_key_env() {
    clear_qr_private_key_env();
    assert!(sign_qr_payload("u".into(), "n".into(), "a", 1, 2).is_err());
}
