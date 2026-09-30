# Neuland Member-ID

<div align="center">

![Rust](https://img.shields.io/badge/Rust-black?style=for-the-badge&logo=rust)

**API for cryptographically signed member QR codes and Apple / Google Wallet passes**

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🔧 API](#-api) • [🤝 Contributing](#-contributing)

</div>

---

## Overview

Neuland Member-ID is an Actix-web API that issues and signs member credentials. It verifies member JWTs against a JWKS endpoint, then produces signed QR payloads and optional Apple Wallet / Google Wallet passes.

### What it does

- **Secure QR generation** — cryptographically signed QR codes from JWT tokens
- **Apple Wallet** — downloadable `.pkpass` files
- **Google Wallet** — save-to-wallet URLs
- **Public key endpoint** — clients can verify QR signatures offline

---

## Quick Start

### Prerequisites

- [Rust](https://rust-lang.org/) (>= 1.85, see `rust-toolchain.toml`)
- [Docker](https://docker.com/) (optional, for deployment)

### Local development

```bash
cp .env.local.example .env
# Edit .env — at minimum set QR_PRIVATE_KEY_HEX, JWKS_URL, EXPECTED_AUDIENCE
# Generate a signing key with: openssl rand -hex 32

cargo run
```

The server listens on port `8000`.

- Health: http://localhost:8000/health
- Swagger UI: http://localhost:8000/swagger-ui/
- OpenAPI: http://localhost:8000/api-docs/openapi.json

### Docker deployment

```bash
git clone https://github.com/neuland-ingolstadt/member-id.git
cd member-id
cp .env.local.example .env
# Edit .env with your configuration
docker compose up -d
```

API: http://localhost:8000

---

## Features

### Security & authentication

- JWT validation via JWKS
- ECDSA P-256 signatures on QR payloads
- Token expiration and group membership checks (`mitglieder`)

### QR code format

Payload is `zlib(CBOR{sub,name,t,iat,exp} || 64-byte P-256 ECDSA sig)`, then Base45-encoded. The `t` field indicates type (`a` for app, `wi` for Wallet on iOS). Expiration defaults to one week.

### Wallet passes

- **Apple Wallet**: PKPass with member name, roles, and QR (requires Apple developer certs)
- **Google Wallet**: save URL via service account credentials

---

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/qr` | GET | Generate signed QR code (Bearer JWT) |
| `/pkpass` | GET | Create Apple Wallet pass (`?token=`) |
| `/gpass` | GET | Create Google Wallet pass link (`?token=`) |
| `/public-key` | GET | Hex-encoded public key for verification |
| `/health` | GET | Health check (`OK`) |
| `/swagger-ui/` | GET | Interactive API docs |

### QR code generation

```bash
curl -H "Authorization: Bearer <jwt_token>" "http://localhost:8000/qr"
```

```json
{
  "qr_data": "base45_encoded_string",
  "iat": 1719436800,
  "exp": 1719436800,
  "t": "a"
}
```

### Apple Wallet pass

Set `PKPASS_SIGN_CERT_PATH`, `PKPASS_SIGN_KEY_PATH`, `PKPASS_ORGANIZATION_NAME`, `PKPASS_PASS_TYPE_IDENTIFIER`, and `PKPASS_TEAM_IDENTIFIER`, then:

```bash
curl -o member.pkpass "http://localhost:8000/pkpass?token=<jwt_token>"
```

### Google Wallet pass

Set `GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`, and optionally `GOOGLE_WALLET_LOGO_URL`, then:

```bash
curl "http://localhost:8000/gpass?token=<jwt_token>"
```

### QR verification (client-side)

```rust
let bytes = base45::decode(qr_string)?;
let decompressed = flate2::read::ZlibDecoder::new(&bytes[..])
    .bytes()
    .collect::<Result<Vec<_>, _>>()?;
let (cbor, sig_bytes) = decompressed.split_at(decompressed.len() - 64);
let verify_key = /* load from /public-key */;
verify_key.verify(cbor, &p256::ecdsa::Signature::from_slice(sig_bytes)?)?;
let profile: QrPayload = serde_cbor::from_slice(cbor)?;
```

---

## Environment

See [`.env.local.example`](.env.local.example). Copy to `.env` (dotenv loads `.env`, not `.env.local`).

| Variable | Required | Purpose |
|----------|----------|---------|
| `QR_PRIVATE_KEY_HEX` | Yes | 32-byte hex ECDSA signing key |
| `JWKS_URL` | Yes* | JWKS endpoint for JWT verification |
| `EXPECTED_AUDIENCE` | Yes* | Expected JWT `aud` claim |
| `RUST_LOG` | No | Log level (default `info`) |
| `PKPASS_*` | No | Apple Wallet signing config |
| `GOOGLE_*` | No | Google Wallet service account config |

\*Required for `/qr`, `/pkpass`, and `/gpass`. `/health` and `/public-key` work with only `QR_PRIVATE_KEY_HEX`.

---

## Technology stack

| Component | Technology |
|-----------|------------|
| API | Rust, Actix-web |
| Cryptography | ECDSA (P-256), JWT |
| Data format | CBOR, Base45, zlib |
| Docs | utoipa / Swagger UI |
| Deployment | Docker, Nix flake |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit with Conventional Commits (`feat: …`, `fix: …`)
4. Open a Pull Request

### Lint / test

```bash
cargo fmt --all -- --check
cargo clippy -- -D warnings
cargo test
```

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE).

---

<div align="center">

**Made by [Robert Eggl](https://eggl.dev) for Neuland Ingolstadt e.V.**

</div>
