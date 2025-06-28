# Neuland Member-ID

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Rust](https://img.shields.io/badge/Rust-black?style=for-the-badge&logo=rust)
![TypeScript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript)


**A modern, full-stack member identification system with QR code generation, verification, and Apple Wallet integration**

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [📦 Technology Stack](#-technology-stack) • [🔧 API](#-api) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

Neuland Member-ID is a comprehensive digital identity solution that combines the power of modern web technologies with cryptographic security. It provides a complete ecosystem for generating, distributing, and verifying member credentials through QR codes and Apple Wallet passes.

### 🎯 What It Does

- **🔐 Secure QR Generation**: Creates cryptographically signed QR codes from JWT tokens
- **📱 Real-time Verification**: Instant QR code scanning and validation with live camera feed
- **🍎 Apple Wallet Integration**: Generate downloadable Apple Wallet passes
- **📊 Dashboard**: Track scan history, statistics, and verification results
- **🎨 Modern UI/UX**: Beautiful, responsive interface with dark/light theme support
- **🔒 Enterprise Security**: JWT validation, ECDSA signatures, and comprehensive audit trails

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) (for development)
- [Rust](https://rust-lang.org/) (for backend development)

### 🐳 Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/neuland-ingolstadt/member-id.git
   cd member-id
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:8540
   - API Documentation: http://localhost:8540/api/swagger-ui/
   - Health Check: http://localhost:8540/api/health

### 🛠️ Development Setup

#### Frontend (Next.js)
```bash
cd frontend
bun install
bun run dev
```

#### Backend (Rust)
```bash
cd backend
cargo run
```

---

## 📋 Features

### 🔐 **Security & Authentication**
- **JWT Token Validation**: Secure authentication via JWKS endpoints
- **ECDSA Signatures**: Cryptographically signed QR codes
- **Public Key Verification**: Client-side signature validation
- **Token Expiration**: Configurable expiration times
- **Audit Trail**: Complete scan history and verification logs

### 📱 **QR Code System**
- **Live Camera Scanning**: Real-time QR code detection
- **Multiple QR Types**: Support for app, Apple Wallet, and Android Wallet
- **Base45 Encoding**: Industry-standard QR code format
- **Compression**: Efficient data storage with zlib compression
- **CBOR Serialization**: Compact binary data representation

### 🍎 **Apple Wallet Integration**
- **PKPass Generation**: Create downloadable Apple Wallet passes
- **Custom Branding**: Organization name and pass type configuration
- **Role Display**: Show member roles and permissions
- **Automatic Updates**: Pass content updates via Apple's infrastructure

### 📊 **Analytics & Management**
- **Scan Statistics**: Real-time counters for valid, invalid, and duplicate scans
- **History Management**: Complete scan history with timestamps
- **Export Functionality**: CSV export for data analysis
- **Duplicate Detection**: Intelligent duplicate scan handling
- **Performance Metrics**: Response times and verification statistics

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first, tablet, and desktop support
- **Theme Support**: Light, dark, and system theme modes
- **Accessibility**: WCAG compliant with keyboard navigation
- **Sound Feedback**: Audio cues for scan results
- **Auto-close**: Configurable result display timing

---

## 📦 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript | Modern web application with SSR |
| **UI Framework** | Tailwind CSS, Radix UI | Responsive, accessible components |
| **QR Processing** | jsQR, base45, pako | QR code scanning and decoding |
| **Backend** | Rust, Actix-web | High-performance API server |
| **Cryptography** | ECDSA (P-256), JWT | Secure signature generation |
| **Data Format** | CBOR, Base45 | Efficient binary serialization |
| **Deployment** | Docker, Nginx | Containerized, scalable deployment |

---

## 🔧 API

### **Core Endpoints**

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/qr` | GET | Generate signed QR code | JSON with QR data |
| `/api/pkpass` | GET | Create Apple Wallet pass | PKPass file |
| `/api/public-key` | GET | Get public key for verification | Hex string |
| `/api/health` | GET | Health check | "OK" |
| `/api/swagger-ui` | GET | Swagger UI | HTML |

### **QR Code Generation**
```bash
curl "http://localhost:8000/qr?token=<jwt_token>"
```

**Response:**
```json
{
  "qr_data": "base45_encoded_string",
  "iat": 1719436800,
  "exp": 1719436800,
  "t": "a"
}
```

### **Apple Wallet Pass**
```bash
curl -o member.pkpass "http://localhost:8000/pkpass?token=<jwt_token>"
```

### **OpenAPI Documentation**
Visit `http://localhost:8540/api/swagger-ui/` for interactive API documentation.

---

## 🔐 Security Features

### **Cryptographic Security**
- **ECDSA P-256**: Industry-standard elliptic curve cryptography
- **JWT Validation**: Secure token verification via JWKS
- **Signature Verification**: Client-side signature validation
- **Token Expiration**: Configurable time-based access control

### **Data Protection**
- **Base45 Encoding**: Secure QR code data representation
- **Zlib Compression**: Efficient data storage
- **CBOR Serialization**: Compact, secure binary format
- **Audit Logging**: Complete verification trail

### **Access Control**
- **JWT Claims**: Role-based access control
- **Group Membership**: Organization-specific permissions
- **Token Validation**: Real-time authentication checks
- **Rate Limiting**: Protection against abuse

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(backend): add an amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- **Frontend**: Biome configuration
- **Backend**: Rustfmt + Clippy linting
- **Commits**: Conventional Commits format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made by [Robert Eggl](https://eggl.dev) for Neuland Ingolstadt e.V.**

[![GitHub stars](https://img.shields.io/github/stars/neuland-ingolstadt/member-id?style=social)](https://github.com/neuland-ingolstadt/member-id)
[![GitHub forks](https://img.shields.io/github/forks/neuland-ingolstadt/member-id?style=social)](https://github.com/neuland-ingolstadt/member-id)
[![GitHub issues](https://img.shields.io/github/issues/neuland-ingolstadt/member-id)](https://github.com/neuland-ingolstadt/member-id/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/neuland-ingolstadt/member-id)](https://github.com/neuland-ingolstadt/member-id/pulls)

</div>
