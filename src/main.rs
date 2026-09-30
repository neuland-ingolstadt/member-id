use actix_cors::Cors;
use actix_governor::{Governor, GovernorConfigBuilder};
use actix_web::http::header;
use actix_web::{App, HttpServer};
use dotenv::dotenv;
use log::error;
use member_id::api::{ApiDoc, configure_routes};
use member_id::utils::log_public_key;
use utoipa::OpenApi;
use utoipa_swagger_ui::{Config, SwaggerUi};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    if let Err(e) = dotenv() {
        eprintln!("Failed to load .env file: {e}");
    }

    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    if let Err(e) = log_public_key() {
        error!("Failed to derive public key: {e}");
    }

    let governor_conf = GovernorConfigBuilder::default()
        .requests_per_second(10)
        .burst_size(15)
        .finish()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Governor::new(&governor_conf))
            .wrap(
                Cors::default()
                    .allowed_origin("https://dev.neuland.app")
                    .allowed_origin("https://web.neuland.app")
                    .allowed_origin("http://localhost:8081")
                    .allowed_origin("http://localhost:8540")
                    .allowed_methods(vec!["GET", "OPTIONS"])
                    .allowed_headers(vec![
                        header::AUTHORIZATION,
                        header::ACCEPT,
                        header::CONTENT_TYPE,
                    ])
                    .max_age(3600),
            )
            .configure(configure_routes)
            .service(
                SwaggerUi::new("/swagger-ui/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::openapi())
                    .config(Config::new(["/api/api-docs/openapi.json"])),
            )
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
