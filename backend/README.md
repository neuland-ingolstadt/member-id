# Member ID Server

This project provides a small Actix-Web server exposing an endpoint to
generate signed QR codes from a JWT. The QR code can be retrieved via a simple
HTTP GET request:

```bash
curl -H "Authorization: Bearer <jwt>" "http://localhost:8000/qr"
```

The token is verified against the JWKS endpoint
`https://sso.informatik.sexy/application/o/neulandnextpanel/jwks/` and checked
for membership in the `mitglied` group.

The QR code data contains the token's `sub` and `given_name` claims plus a `t`
field indicating the type (`a` for the app or `wi` for Wallet on iOS),
as well as `iat` (issued-at) and `exp` (expiry) timestamps. The expiration
defaults to one week after generation. Before running the server, set an ECDSA
signing key via
the `QR_PRIVATE_KEY_HEX` environment variable:

```bash
export QR_PRIVATE_KEY_HEX="<32-byte-hex>"
cargo run
```

On startup the server derives and logs the matching public key in hexadecimal
format. This key can also be retrieved via `GET /public-key` and used by
clients to verify QR code signatures.

The server also exposes a simple `GET /health` endpoint that returns `OK` for
basic health checks.

## API Documentation

The server includes OpenAPI documentation accessible through Swagger UI. Once the server is running, you can visit the following URL to explore and test the API interactively:

```
http://localhost:8000/swagger-ui/
```

This provides a user-friendly interface to:
- See all available endpoints
- Try out API calls directly from the browser
- View request parameters and response formats
- Access detailed API documentation

The OpenAPI schema is also available at:

```
http://localhost:8000/api-docs/openapi.json
```

## QR Code Verification

To verify a QR code, reverse the encoding steps and verify the signature using
the corresponding public key:

```rust
let bytes = base45::decode(qr_string)?;
let decompressed = flate2::read::ZlibDecoder::new(&bytes[..])
    .bytes()
    .collect::<Result<Vec<_>, _>>()?;
let (cbor, sig_bytes) = decompressed.split_at(decompressed.len() - 64);
let private_hex = std::env::var("QR_PRIVATE_KEY_HEX")?;
let verify_key = SigningKey::from_bytes(&hex::decode(private_hex)?).unwrap().verifying_key();
verify_key.verify(cbor, &p256::ecdsa::Signature::from_slice(sig_bytes)?)?;
let profile: QrPayload = serde_cbor::from_slice(cbor)?;
// QrPayload contains sub, given_name, t, iat and exp fields
```

## Running the Server

Run the server with:

```bash
cargo run
```

The server listens on port `8000`. Send GET requests to `/qr` with the
`Authorization` header set to `Bearer <jwt>` to obtain the QR code data.

## Apple Wallet Pass

The server can also create an Apple Wallet pass containing the same QR code. Set
the following environment variables with your Apple developer credentials:

```
export PKPASS_SIGN_CERT_PATH=/path/to/developer_cert.pem
export PKPASS_SIGN_KEY_PATH=/path/to/developer_key.pem
export PKPASS_ORGANIZATION_NAME="Example Org"
export PKPASS_PASS_TYPE_IDENTIFIER="com.example.pass"
export PKPASS_TEAM_IDENTIFIER="ABCDE12345"
```

Retrieve the pass via:

```bash
curl -o member.pkpass "http://localhost:8000/pkpass?token=<jwt>"
```

The pass shows the member name, a short summary of the user's roles and encodes
the QR code valid for the current semester. Up to three roles are listed on the
front of the pass followed by a "+N" suffix when more roles exist. The complete
list is available on the back of the pass.

## Google Wallet Pass

You can also create a Google Wallet pass. Configure your service account credentials:

```
export GOOGLE_WALLET_ISSUER_ID="<issuer-id>"
export GOOGLE_WALLET_CLASS_ID="member"
export GOOGLE_SERVICE_ACCOUNT_EMAIL="example@project.iam.gserviceaccount.com"
export GOOGLE_SERVICE_ACCOUNT_KEY="$(cat service-account-private-key.pem)"
export GOOGLE_WALLET_LOGO_URL="https://your-domain.com/path/to/logo.png"
```

Retrieve the pass link via:

```bash
curl "http://localhost:8000/gpass?token=<jwt>"
```

The endpoint returns a `https://pay.google.com/gp/v/save/<jwt>` URL which users can open to save the pass to their Google Wallet.
