#![allow(dead_code)]

use jsonwebtoken::{Algorithm, EncodingKey, Header, encode};
use serde::Serialize;
use serde_json::json;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

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

/// PKCS#8 RSA private key used only in tests (not a production secret).
const TEST_RSA_PEM: &str = "-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBxl9LEhBoexL8
VPk822iEQCIJjRZSSNKWPTl9Wvi+8LJ16urBORgeuKhlyPYvc4rHLsmEpKGcWk1F
k/8xIqZDtNISnQv23+1UhBeLCshok28VTO29RMC9UASNYGu1W14IeuCl6EQ0jHPN
cGPmF3aIUosTKV+laKrhmnCp4t1rwxWe1COSSXIeLtc12b+WiEnBBii4d1WwzeSb
8Sop5VZpwingKnky1rNIxyCuP6txuRQtQ5lsTwTwJuWkewGCj1fAdL94fCGkgA4J
CFORyc0oevcZOQgkgqqm7bvk4/qvkKysfnItXosvQ1HtZwSgN+SEresRF6x1ITd3
Qm7gsYbXAgMBAAECggEAEo6xQPA+8AfxXocIw4JDtSlV2SemM+/Tcx3z69m9fr5w
aN3m6OWoi1tQjUbnWiNXmWcVV4WouzTkDOjKhLshGdTZqtIC0PwgWiVjAnw1izEA
xL/Jo4RPwmbvuKu7mke2GVvN4zWmP94U7QokFxIM1lYJXvwUXolH7DPX3FKPYAAe
dusWaZwltsFwUZwdDevBosPkAD901UpOGQCBAJt1norJQsIgpGOpaL0pxZVowm6C
oJQl451QNtD6PTeJpFkyDOEymYsTNLImG4IKd/SD1a4Xz0JlDrvKApDVImigZ728
HK5S2BqCIgr0xbbB8Pm26R8AIx5bFMPEzAkU0k1z2QKBgQDsue1QKvVfbluYIZGk
vJ1mdJJuTKgBoyy52nsmQsTzaXo3vgAacQYtf/wleJZLAXwp8Xw6yrA0NkuhUxAW
FwmPs/YdUBCoDIE/3KpylP8Ul3IQaZzPTVir6fTL5Nb2WAGo9cEfLWnK1yZgwG5c
V0EOdfF0ff02f+iWi0BBn14EqwKBgQDRjTY6EO4Mcz+hja0++XtPQdbaWkQTBSPW
HxKL31Sq+n/xQTP61Q3c0tEpBmhxC7KgjYp+oezBP5fQii05+41aDb+9K5Li9Xeg
vFfC97GsCWBYMtg1XkY0J/rP+L70vvbobFZ504l4CBHJiwVQ1SBWAMpOmO33Yyo8
Eww3bEdOhQKBgQCG4v59Iq1EHl7klaQmiS7q9VuGq/lDTZYrpHlteLg+tohkgMgQ
SPyrKnUjaM3CmWsFf0s5OMskRRfdKbZNz/yrvHBtjXSgPNfc6sDYn1ulgRIGlhc6
7CitdJb/Izr1jXoMq1PKjxbr9KIymROJXFJ+ief2Z9/DkSiXt2r6uXNaFwKBgE5E
bgKWHDNuQE/4+MJSsGnT74myuUZZXx80j9rKWXdbBLp5Xg7L0NevrguipxPCCL/K
3fWaSTGMrQlo8qd7ezotdHYVdlFq2Xmhny3lEeltvxxyMSsNwS7t19Ih2EDVqqb4
//uUtP2uFeavFBcy41b8CJP+rrL9yOKTQrbYrHF5AoGAaRn1i96LZH2VpJ5q1Lcd
AcypI6rBouPDeYpSWMvfl5fQ1ZH6w4CSsSyi+YN9hgu8Od+ss9M+4BPDtHFRkk5+
mRlRvZYO6FBoZ9Emjw2nxpWw7Ld3r+nihHgPFh8ra7sU2fXN4zv1+9Uf3h7widOh
otfSjHOqTXeu9NlwBaOrL5E=
-----END PRIVATE KEY-----
";

const TEST_JWK_N: &str = "wcZfSxIQaHsS_FT5PNtohEAiCY0WUkjSlj05fVr4vvCyderqwTkYHrioZcj2L3OKxy7JhKShnFpNRZP_MSKmQ7TSEp0L9t_tVIQXiwrIaJNvFUztvUTAvVAEjWBrtVteCHrgpehENIxzzXBj5hd2iFKLEylfpWiq4ZpwqeLda8MVntQjkklyHi7XNdm_lohJwQYouHdVsM3km_EqKeVWacIp4Cp5MtazSMcgrj-rcbkULUOZbE8E8CblpHsBgo9XwHS_eHwhpIAOCQhTkcnNKHr3GTkIJIKqpu275OP6r5CsrH5yLV6LL0NR7WcEoDfkhK3rEResdSE3d0Ju4LGG1w";
const TEST_JWK_E: &str = "AQAB";
const TEST_KID: &str = "test-kid";
pub const TEST_AUDIENCE: &str = "member-id-tests";

#[derive(Serialize)]
struct TestClaims<'a> {
    sub: &'a str,
    given_name: &'a str,
    family_name: &'a str,
    preferred_username: &'a str,
    groups: &'a [&'a str],
    aud: &'a str,
    exp: usize,
}

pub struct JwksEnv {
    pub server: MockServer,
}

impl JwksEnv {
    pub async fn start() -> Self {
        let server = MockServer::start().await;
        Mock::given(method("GET"))
            .and(path("/"))
            .respond_with(ResponseTemplate::new(200).set_body_json(json!({
                "keys": [{
                    "kid": TEST_KID,
                    "kty": "RSA",
                    "alg": "RS256",
                    "use": "sig",
                    "n": TEST_JWK_N,
                    "e": TEST_JWK_E,
                }]
            })))
            .mount(&server)
            .await;

        // SAFETY: tests that touch env are serialized with `serial_test`.
        unsafe {
            std::env::set_var("JWKS_URL", server.uri());
            std::env::set_var("EXPECTED_AUDIENCE", TEST_AUDIENCE);
        }

        Self { server }
    }
}

pub fn mint_member_jwt(groups: &[&str]) -> String {
    let mut header = Header::new(Algorithm::RS256);
    header.kid = Some(TEST_KID.into());
    let claims = TestClaims {
        sub: "user-1",
        given_name: "Ada",
        family_name: "Lovelace",
        preferred_username: "ada",
        groups,
        aud: TEST_AUDIENCE,
        exp: 4_102_444_800, // far future
    };
    encode(
        &header,
        &claims,
        &EncodingKey::from_rsa_pem(TEST_RSA_PEM.as_bytes()).expect("test rsa pem"),
    )
    .expect("mint jwt")
}
