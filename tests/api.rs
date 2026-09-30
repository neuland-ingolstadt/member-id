mod support;

use actix_web::{App, test};
use member_id::api::configure_routes;
use serial_test::serial;
use support::set_qr_private_key_env;

#[actix_web::test]
async fn health_returns_ok() {
    let app = test::init_service(App::new().configure(configure_routes)).await;
    let req = test::TestRequest::get().uri("/health").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body = test::read_body(resp).await;
    assert_eq!(body, "OK");
}

#[actix_web::test]
async fn qr_requires_authorization_header() {
    let app = test::init_service(App::new().configure(configure_routes)).await;
    let req = test::TestRequest::get().uri("/qr").to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), 400);
    let body = test::read_body(resp).await;
    assert_eq!(body, "Missing Authorization header");
}

#[actix_web::test]
async fn qr_rejects_non_bearer_authorization() {
    let app = test::init_service(App::new().configure(configure_routes)).await;
    let req = test::TestRequest::get()
        .uri("/qr")
        .insert_header(("Authorization", "Token abc"))
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), 400);
    let body = test::read_body(resp).await;
    assert_eq!(body, "Invalid Authorization header");
}

#[actix_web::test]
#[serial]
async fn public_key_endpoint_returns_hex() {
    set_qr_private_key_env();
    let app = test::init_service(App::new().configure(configure_routes)).await;
    let req = test::TestRequest::get().uri("/public-key").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body = test::read_body(resp).await;
    assert_eq!(body.len(), 130);
}

#[actix_web::test]
async fn pkpass_rejects_invalid_token_without_network_setup() {
    let app = test::init_service(App::new().configure(configure_routes)).await;
    let req = test::TestRequest::get()
        .uri("/pkpass?token=not-a-jwt")
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), 400);
    let body = test::read_body(resp).await;
    assert_eq!(body, "Invalid request");
}
