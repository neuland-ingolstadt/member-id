# AGENTS.md

## Cursor Cloud specific instructions

Full-stack app (Neuland Member-ID): a Rust `backend/` API (signs/validates QR codes, builds
wallet passes) and a Next.js `frontend/` scanner dashboard. See `README.md`, `backend/README.md`,
and `frontend/README.md` for full docs. The update script already refreshes dependencies
(`bun install` for the frontend, `cargo fetch` for the backend); you only need to start services.

### Services & how to run them (dev)
- Backend (Rust / Actix-web, port `8000`): `cd backend && cargo run`. First build is slow;
  `rust-toolchain.toml` pins the stable toolchain (edition 2024, needs Rust >= 1.85 — auto-installed by rustup).
- Frontend (Next.js dev, port `3000`): `cd frontend && bun run dev`. `bun` is on PATH via `~/.bashrc`
  (installed at `~/.bun/bin`).
- Reverse proxy (port `8540`): required for full E2E. `next dev` on `:3000` does NOT proxy `/api`,
  and the frontend fetches `/api/public-key` (and other `/api/*`) relative to its own origin.
  Run nginx proxying `/api/` → `127.0.0.1:8000/` and `/` → `127.0.0.1:3000`, then use
  `http://localhost:8540` (mirrors the production `docker-compose.yml` + `nginx.conf`). Health:
  `http://localhost:8540/api/health`, Swagger: `http://localhost:8540/api/swagger-ui/`.

### Non-obvious gotchas
- The backend reads env via `dotenv`, which loads `backend/.env` — NOT `.env.local`, despite the
  template being named `backend/.env.local.example`. Copy it to `backend/.env`. Both `.env` and
  `.env.local` are gitignored.
- The backend needs `QR_PRIVATE_KEY_HEX` (a 32-byte hex scalar, e.g. `openssl rand -hex 32`) to
  serve `/public-key` and `/qr`. Without it those endpoints error and the frontend scanner renders
  "Scanner Unavailable" (it can't load the public key). Also set `JWKS_URL` and `EXPECTED_AUDIENCE`.
- `/qr`, `/pkpass`, `/gpass` require a real member JWT verified against the external `JWKS_URL`
  (Authentik SSO) with the `mitglieder` group claim — not available locally without real SSO
  credentials. `/health` and `/public-key` work with just `QR_PRIVATE_KEY_HEX`.
- The scanner is camera-only (no file upload / manual entry). To exercise it headlessly, feed a QR
  image via Chrome's fake camera: `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream
  --use-file-for-fake-video-capture=<file.y4m>`. A valid QR is `zlib(CBOR{sub,name,t,iat,exp} ||
  64-byte P-256 ECDSA sig)` then base45-encoded, signed with the same key as `QR_PRIVATE_KEY_HEX`.
- Apple/Google Wallet features are optional and need external certs/credentials.

### Lint / test / build
- Backend: `cargo fmt --all -- --check`, `cargo clippy -- -D warnings`, `cargo test`
  (run inside `backend/`; matches `.github/workflows/backend-ci.yml`).
- Frontend: `bunx tsc --noEmit`, `bunx biome ci .` (run inside `frontend/`; matches
  `.github/workflows/frontend-ci.yml`). `bun run build` produces a static export (`output: 'export'`).
