mod passes;
mod utils;
use actix_web::{App, HttpResponse, HttpServer, Responder, web};
use dotenv::dotenv;
use log::error;

use serde::Deserialize;

use utils::{log_public_key, public_key_hex};

use passes::generate_pkpass;

use utils::{QrResponse, generate_qr};

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(Deserialize, utoipa::ToSchema)]
struct TokenQuery {
    #[schema(example = "abc123")]
    token: String,
}

#[utoipa::path(
    get,
    path = "/qr",
    params(
        ("token" = String, Query, description = "Authentication token")
    ),
    responses(
        (status = 200, description = "QR code generated successfully with issue and expiration timestamps", body = QrResponse),
        (status = 400, description = "Bad request")
    )
)]
async fn qr_endpoint(query: web::Query<TokenQuery>) -> impl Responder {
    const MAX_AGE_APP: u64 = 60 * 60 * 24 * 3; // 3 days
    match generate_qr(&query.token, "a", MAX_AGE_APP).await {
        Ok(qr_response) => HttpResponse::Ok().json(qr_response),
        Err(e) => {
            error!("QR generation error: {}", e);
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
async fn pkpass_endpoint(query: web::Query<TokenQuery>) -> impl Responder {
    match generate_pkpass(&query.token).await {
        Ok(data) => HttpResponse::Ok()
            .content_type("application/vnd.apple.pkpass")
            .append_header(("Content-Disposition", "attachment; filename=member.pkpass"))
            .body(data),
        Err(e) => {
            error!("PKPASS generation error: {}", e);
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
async fn health() -> impl Responder {
    HttpResponse::Ok().body("OK")
}

#[utoipa::path(
    get,
    path = "/public-key",
    responses(
        (status = 200, description = "Public key in hex format", body = String)
    )
)]
async fn public_key_endpoint() -> impl Responder {
    match public_key_hex() {
        Ok(hex) => HttpResponse::Ok().body(hex),
        Err(e) => {
            error!("Public key error: {}", e);
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}

// Define OpenAPI documentation
#[derive(OpenApi)]
#[openapi(
    paths(qr_endpoint, pkpass_endpoint, health, public_key_endpoint),
    components(schemas(TokenQuery, QrResponse)),
    tags(
        (name = "Member-ID API", description = "Member ID API endpoints")
    ),
    info(
        title = "Member-ID API",
        version = "1.0.0",
        description = "API for generating QR codes and PKPass files"
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    if let Err(e) = dotenv() {
        eprintln!("Failed to load .env file: {}", e);
    }

    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    if let Err(e) = log_public_key() {
        error!("Failed to derive public key: {}", e);
    }

    HttpServer::new(move || {
        App::new()
            .route("/qr", web::get().to(qr_endpoint))
            .route("/pkpass", web::get().to(pkpass_endpoint))
            .route("/public-key", web::get().to(public_key_endpoint))
            .route("/health", web::get().to(health))
            .service(
                SwaggerUi::new("/api/swagger-ui/{_:.*}")
                    .url("/api/api-docs/openapi.json", ApiDoc::openapi()),
            )
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
