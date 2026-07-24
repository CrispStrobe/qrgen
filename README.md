# QR Code Generator - Akademie Version

Akademie-A branded QR code generator for internal use.

## Deployment

This branch deploys to Vercel with Akademie-A branding.

**Live URL**: Deployed via Vercel (see Vercel dashboard)

## Features

- QR code generation with customizable colors
- **Akademie-A logo embedded by default**
- Configurable size and error correction levels
- Download generated QR codes as PNG
- Modern, responsive UI

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

```bash
# Deploy to Vercel
vercel --prod
```

## Branch Information

This is the `akademie` branch - DO NOT merge into `main`.

- `main` branch = Public version (GitHub Pages, no logo)
- `akademie` branch = Branded version (Vercel, with logo)

## Branding

This version includes the Akademie-A logo by default on all generated QR codes.
