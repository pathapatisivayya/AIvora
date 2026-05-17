#!/usr/bin/env bash
# Build React frontend and publish to nginx web root.
# Usage: bash deploy/ec2/build-frontend.sh

set -euo pipefail

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
FRONTEND_DIR="$AIVORA_HOME/frontend"
WEB_ROOT="${WEB_ROOT:-/var/www/aivora}"

echo "==> npm install + build"
cd "$FRONTEND_DIR"
npm ci --silent 2>/dev/null || npm install --silent
npm run build

echo "==> Copy to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "==> Reload nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "Done. Open: https://aivora.duckdns.org/"
