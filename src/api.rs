use actix_web::{HttpRequest, HttpResponse, Responder, web};
use log::error;
use serde::Deserialize;
use utoipa::OpenApi;

use crate::passes::{generate_gpass, generate_pkpass};
use crate::utils::{QrResponse, generate_qr, public_key_hex};

#[derive(Deserialize, utoipa::ToSchema)]
pub struct TokenQuery {
    #[schema(example = "abc123")]
    pub token: String,
}

#[utoipa::path(
    get,
    path = "/qr",
    params(
        ("Authorization" = String, Header, description = "Bearer token")
    ),
    responses(
        (status = 200, description = "QR code generated successfully with issue and expiration timestamps", body = QrResponse),
        (status = 400, description = "Bad request")
    )
)]
pub async fn qr_endpoint(req: HttpRequest) -> impl Responder {
    const MAX_AGE_APP: u64 = 60 * 60 * 24 * 3; // 3 days
    let token = match extract_token(&req) {
        Ok(t) => t,
        Err(resp) => return resp,
    };
    match generate_qr(&token, "a", MAX_AGE_APP).await {
        Ok(qr_response) => HttpResponse::Ok().json(qr_response),
        Err(e) => {
            error!("QR generation error: {e}");
            HttpResponse::BadRequest().body("Invalid request")
        }
    }
}

#[utoipa::path(
    get,
    path = "/pkpass",
    params(
        ("token" = String, Query, description = "Authentication token")
    ),
    responses(
        (status = 200, description = "PKPass generated successfully", content_type = "application/vnd.apple.pkpass"),
        (status = 400, description = "Bad request")
    )
)]
pub async fn pkpass_endpoint(query: web::Query<TokenQuery>) -> impl Responder {
    match generate_pkpass(&query.token).await {
        Ok(data) => HttpResponse::Ok()
            .content_type("application/vnd.apple.pkpass")
            .append_header(("Content-Disposition", "attachment; filename=member.pkpass"))
            .body(data),
        Err(e) => {
            error!("PKPASS generation error: {e}");
            HttpResponse::BadRequest().body("Invalid request")
        }
    }
}

#[utoipa::path(
    get,
    path = "/gpass",
    params(
        ("token" = String, Query, description = "Authentication token")
    ),
    responses(
        (status = 200, description = "Google Wallet pass jwt", body = String),
        (status = 400, description = "Bad request")
    )
)]
pub async fn gpass_endpoint(query: web::Query<TokenQuery>) -> impl Responder {
    match generate_gpass(&query.token).await {
        Ok(url) => HttpResponse::Ok().body(url),
        Err(e) => {
            error!("GPASS generation error: {e}");
            HttpResponse::BadRequest().body("Invalid request")
        }
    }
}

#[utoipa::path(
    get,
    path = "/health",
    responses(
        (status = 200, description = "API is healthy", body = String)
    )
)]
pub async fn health() -> impl Responder {
    HttpResponse::Ok().body("OK")
}

#[utoipa::path(
    get,
    path = "/public-key",
    responses(
        (status = 200, description = "Public key in hex format", body = String)
    )
)]
pub async fn public_key_endpoint() -> impl Responder {
    match public_key_hex() {
        Ok(hex) => HttpResponse::Ok().body(hex),
        Err(e) => {
            error!("Public key error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}

pub fn extract_token(req: &HttpRequest) -> Result<String, HttpResponse> {
    let auth = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| HttpResponse::BadRequest().body("Missing Authorization header"))?;
    if let Some(token) = auth.strip_prefix("Bearer ") {
        Ok(token.to_string())
    } else {
        Err(HttpResponse::BadRequest().body("Invalid Authorization header"))
    }
}

#[derive(OpenApi)]
#[openapi(
    paths(qr_endpoint, pkpass_endpoint, gpass_endpoint, health, public_key_endpoint),
    components(schemas(TokenQuery, QrResponse)),
    tags(
        (name = "Member-ID API", description = "Member ID API endpoints")
    ),
    servers(
        (url = "/api", description = "API behind nginx reverse proxy")
    ),
    info(
        title = "Member-ID API",
        version = "1.0.0",
        description = "API for generating QR codes and Wallet passes"
    )
)]
pub struct ApiDoc;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/qr", web::get().to(qr_endpoint))
        .route("/pkpass", web::get().to(pkpass_endpoint))
        .route("/gpass", web::get().to(gpass_endpoint))
        .route("/public-key", web::get().to(public_key_endpoint))
        .route("/health", web::get().to(health));
}
