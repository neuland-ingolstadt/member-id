#![allow(dead_code)]

/// 32-byte test scalar for QR signing (deterministic, not a production secret).
pub fn test_qr_private_key_hex() -> String {
    hex::encode([0x11u8; 32])
}

pub fn set_qr_private_key_env() {
    // SAFETY: tests that touch env are serialized with `serial_test`.
    unsafe {
        std::env::set_var("QR_PRIVATE_KEY_HEX", test_qr_private_key_hex());
    }
}

pub fn clear_qr_private_key_env() {
    // SAFETY: tests that touch env are serialized with `serial_test`.
    unsafe {
        std::env::remove_var("QR_PRIVATE_KEY_HEX");
    }
}

pub fn set_qr_private_key_hex(hex: &str) {
    // SAFETY: tests that touch env are serialized with `serial_test`.
    unsafe {
        std::env::set_var("QR_PRIVATE_KEY_HEX", hex);
    }
}
