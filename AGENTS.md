# AGENTS.md

## Cursor Cloud specific instructions

Rust API (Neuland Member-ID): signs/validates QR codes and builds wallet passes.
See `README.md` for full docs. The update script already runs `cargo fetch`; you
only need to start the service.

### Services & how to run them (dev)
- API (Rust / Actix-web, port `8000`): `cargo run`. First build is slow;
  `rust-toolchain.toml` pins the stable toolchain (edition 2024, needs Rust >= 1.85 —
  auto-installed by rustup).
- Health: `http://localhost:8000/health`, Swagger: `http://localhost:8000/swagger-ui/`.

### Non-obvious gotchas
- Env is loaded via `dotenv`, which reads `.env` — NOT `.env.local`, despite the
  template being named `.env.local.example`. Copy it to `.env`. Both `.env` and
  `.env.local` are gitignored.
- Needs `QR_PRIVATE_KEY_HEX` (a 32-byte hex scalar, e.g. `openssl rand -hex 32`) to
  serve `/public-key` and `/qr`. Also set `JWKS_URL` and `EXPECTED_AUDIENCE`.
- `/qr`, `/pkpass`, `/gpass` require a real member JWT verified against the external
  `JWKS_URL` (Authentik SSO) with the `mitglieder` group claim — not available
  locally without real SSO credentials. `/health` and `/public-key` work with just
  `QR_PRIVATE_KEY_HEX`.
- A valid QR is `zlib(CBOR{sub,name,t,iat,exp} || 64-byte P-256 ECDSA sig)` then
  base45-encoded, signed with the same key as `QR_PRIVATE_KEY_HEX`.
- Apple/Google Wallet features are optional and need external certs/credentials.

### Lint / test / build
- `cargo fmt --all -- --check`, `cargo clippy -- -D warnings`, `cargo test`
  (matches `.github/workflows/ci.yml`).
- Coverage for SonarQube: `cargo llvm-cov --lcov --output-path coverage/lcov.info`
  (needs `llvm-tools-preview` + `cargo-llvm-cov`). CI uploads via `SONAR_TOKEN`.
