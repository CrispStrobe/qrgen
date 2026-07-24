# Deployment Setup Guide

## GitHub Pages Setup (Main Branch - Public Version)

The workflow is already configured! Just need to enable GitHub Pages:

1. Go to repository settings: https://github.com/CrispStrobe/qrgen/settings/pages
2. Under "Source", select "GitHub Actions"
3. The deployment will start automatically

**Live URL**: https://crispstrobe.github.io/qrgen

## Vercel Setup (Akademie Branch - Branded Version)

The Vercel project already exists (prj_cRSshT3WG1sD1nxVho8SQL7Q2C9y). Need to configure it to deploy the `akademie` branch:

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Find your qrgen project
3. Go to Settings → Git
4. Under "Production Branch", change from `main` to `akademie`
5. Save changes

### Option 2: Via Vercel CLI
```bash
cd qr-generator
git checkout akademie
vercel --prod
```

### Configure Branch Production Deployment
If Vercel is still pointing to main:
1. In Vercel dashboard, go to Settings → Git
2. Find "Production Branch" setting
3. Set it to `akademie`
4. Trigger a new deployment

## Branch Strategy

- `main` → GitHub Pages (public, no logo)
- `akademie` → Vercel (Akademie-A branded)

## Making Changes

### Public Version (No Logo)
```bash
git checkout main
# Make changes
git add .
git commit -m "Update public version"
git push origin main
# Automatically deploys to GitHub Pages
```

### Akademie Version (With Logo)
```bash
git checkout akademie
# Make changes
git add .
git commit -m "Update branded version"
git push origin akademie
# Manually deploy to Vercel: vercel --prod
```

## Verification

After setup, verify both deployments:
- Public: https://crispstrobe.github.io/qrgen (no logo)
- Akademie: [Vercel URL] (with Akademie-A logo)

## Current Status

- ✅ Main branch pushed to GitHub
- ✅ Akademie branch created and pushed
- ✅ GitHub Actions workflow configured
- ⏳ GitHub Pages needs to be enabled in settings
- ⏳ Vercel needs to be configured for akademie branch
