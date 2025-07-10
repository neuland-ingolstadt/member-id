# QR Validation App

A modern Next.js application for scanning and validating QR codes, designed for member cards, event passes, and more. The app provides real-time QR code verification, scan history, and insightful statistics, all wrapped in a responsive, themeable UI.

## Features

- **QR Code Scanning:** Uses your device camera to scan QR codes with a live preview and targeting frame.
- **Verification:** Validates QR codes using cryptographic checks (public key, signature, etc.) for authenticity.
- **Real-Time Feedback:** Visual overlays for success, error, and duplicate scans.
- **Scan History:** Stores and displays a history of all scans, including details and timestamps.
- **Statistics:** View stats on total, valid, invalid, duplicate, and unique scans.
- **Responsive Design:** Mobile-friendly and accessible, with support for light and dark themes.
- **Theming:** Easily switch between system, light, and dark modes.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), custom components
- **QR Scanning:** [jsQR](https://github.com/cozmo/jsQR) for QR code decoding
- **State/Storage:** React hooks, `sessionStorage` for scan history
- **Validation:** Custom logic in `/lib/qr-verifier.ts`
- **Other:** TypeScript, Zod, date-fns, and more

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)

### Installation

```bash
bun install # or npm install
```

### Running Locally

```bash
bun run dev # or npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
bun run build # or npm run build
```

### Linting & Formatting

```bash
bun run lint      # Lint code
bun run fmt       # Format code
```

## File Structure

```
qr-validation/
├── app/                # Next.js app directory (pages, layout)
├── components/         # UI and feature components
│   ├── qr-scanner/     # QR scanner, overlays, result card, etc.
│   ├── scan-history/   # Scan history list, item, export, utils
│   └── ui/             # Reusable UI primitives (buttons, cards, etc.)
├── hooks/              # Custom React hooks (scan history, mobile detection)
├── lib/                # Core logic (QR verification, utilities)
├── public/             # Static assets (images, icons)
├── README.md           # Project documentation
├── package.json        # Project metadata and scripts
└── ...
```

## How It Works

1. **Scan:** Open the app and point your camera at a QR code.
2. **Verify:** The app checks the QR code's validity using cryptographic methods.
3. **Feedback:** See instant feedback-success, error, or duplicate-with overlays.
4. **History:** View all past scans, including details and statistics.
5. **Manage:** Remove individual scans or clear your scan history.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

MIT

