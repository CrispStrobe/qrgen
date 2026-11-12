# QR Code Generator

A production-ready QR code generator application with dual deployment strategy.

## Deployments

### Public Version (GitHub Pages)
- **URL**: https://crispstrobe.github.io/qrgen
- **Branch**: `main`
- **Features**: Generic QR code generator (no default logo)
- **Use Case**: Public-facing, general audience

### Akademie Version (Vercel)
- **URL**: https://qr.akademie-rs.de
- **Source**: `main`
- **Project**: `qr-generator` in the `crispstrobes-projects` Vercel scope

## Development

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## Deployment

### GitHub Pages (Automatic)
Push to `main` branch triggers automatic deployment.

### Vercel (manual production deployment)

The `qr-generator` Vercel project is not linked to a Git repository, so pushing
`main` does not deploy it. From a clean checkout of the intended `main` commit,
link the directory to the existing project and deploy it with the Vercel CLI:

```bash
vercel link --yes --scope crispstrobes-projects --project qr-generator
vercel deploy --prod --scope crispstrobes-projects
```

`vercel.json` builds for the root domain. The GitHub Pages build retains the
`/qrgen/` subpath from `package.json`.

## Features

- QR code generation with customizable colors
- Configurable size and error correction levels
- Optional logo/branding support
- Download generated QR codes as PNG
- Modern, responsive UI

## Technology Stack

- React 19
- QRCode.js library
- Tailwind CSS
- GitHub Actions for CI/CD
