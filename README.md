# QR Code Generator

A production-ready QR code generator application with dual deployment strategy.

## Deployments

### Public Version (GitHub Pages)
- **URL**: https://crispstrobe.github.io/qrgen
- **Branch**: `main`
- **Features**: Generic QR code generator (no default logo)
- **Use Case**: Public-facing, general audience

### Akademie Version (Vercel)
- **URL**: Deployed via Vercel
- **Branch**: `akademie`
- **Features**: Akademie-A branded QR codes
- **Use Case**: Internal/branded use

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

### Vercel (Manual)
```bash
# Switch to akademie branch
git checkout akademie

# Deploy to Vercel
vercel --prod
```

## Branch Structure

- `main` - Public version (GitHub Pages)
- `akademie` - Akademie-branded version (Vercel)

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
