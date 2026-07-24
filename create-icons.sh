#!/bin/bash

# Create QR Tool Icons
# This script generates simple SVG icons that can be converted to PNG

# Create icon directory
mkdir -p public/icons

# 192x192 icon (SVG)
cat > public/icons/icon-192.svg << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#0E2136"/>
  <rect x="32" y="32" width="48" height="48" fill="white"/>
  <rect x="40" y="40" width="32" height="32" fill="#0E2136"/>
  <rect x="48" y="48" width="16" height="16" fill="white"/>
  <rect x="112" y="32" width="48" height="48" fill="white"/>
  <rect x="120" y="40" width="32" height="32" fill="#0E2136"/>
  <rect x="128" y="48" width="16" height="16" fill="white"/>
  <rect x="32" y="112" width="48" height="48" fill="white"/>
  <rect x="40" y="120" width="32" height="32" fill="#0E2136"/>
  <rect x="48" y="128" width="16" height="16" fill="white"/>
  <rect x="96" y="96" width="64" height="64" fill="white"/>
  <rect x="104" y="104" width="48" height="48" fill="#0E2136"/>
  <rect x="112" y="112" width="32" height="32" fill="white"/>
  <rect x="120" y="120" width="16" height="16" fill="#0E2136"/>
</svg>
EOF

# 512x512 icon (SVG)
cat > public/icons/icon-512.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0E2136"/>
  <rect x="85" y="85" width="128" height="128" fill="white"/>
  <rect x="107" y="107" width="84" height="84" fill="#0E2136"/>
  <rect x="128" y="128" width="42" height="42" fill="white"/>
  <rect x="299" y="85" width="128" height="128" fill="white"/>
  <rect x="321" y="107" width="84" height="84" fill="#0E2136"/>
  <rect x="342" y="128" width="42" height="42" fill="white"/>
  <rect x="85" y="299" width="128" height="128" fill="white"/>
  <rect x="107" y="321" width="84" height="84" fill="#0E2136"/>
  <rect x="128" y="342" width="42" height="42" fill="white"/>
  <rect x="256" y="256" width="171" height="171" fill="white"/>
  <rect x="277" y="277" width="128" height="128" fill="#0E2136"/>
  <rect x="299" y="299" width="85" height="85" fill="white"/>
  <rect x="320" y="320" width="42" height="42" fill="#0E2136"/>
</svg>
EOF

echo "Icons created in public/icons/"
echo "To convert SVG to PNG, use a tool like:"
echo "  - Online: https://cloudconvert.com/svg-to-png"
echo "  - CLI: npx svgexport public/icons/icon-192.svg public/logo192.png"
EOF
