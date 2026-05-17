#!/usr/bin/env bash
# Pull latest code, build frontend, migrate DB, collectstatic, restart services.
# Usage: bash deploy/ec2/deploy-aivora.sh

set -euo pipefail

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
BACKEND_DIR="$AIVORA_HOME/backend"
FRONTEND_DIR="$AIVORA_HOME/frontend"
WEB_ROOT="${WEB_ROOT:-/var/www/aivora}"
LOG_DIR="$AIVORA_HOME/logs"
VENV="$BACKEND_DIR/.venv"

mkdir -p "$LOG_DIR"

echo "==> Git pull"
cd "$AIVORA_HOME"
git pull origin main

echo "==> Backend: install, migrate, collectstatic"
# shellcheck source=/dev/null
source "$VENV/bin/activate"
export DJANGO_SETTINGS_MODULE=config.settings
cd "$BACKEND_DIR"
pip install -r requirements.txt -q
python manage.py migrate --noinput
python manage.py collectstatic --noinput
chmod -R a+rX staticfiles 2>/dev/null || true

echo "==> Frontend: build + copy to $WEB_ROOT"
cd "$FRONTEND_DIR"
npm ci --silent 2>/dev/null || npm install --silent
npm run build
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "==> Restart API"
if systemctl is-enabled aivora-api &>/dev/null; then
  sudo systemctl restart aivora-api
else
  bash "$AIVORA_HOME/deploy/ec2/start-aivora.sh"
  exit 0
fi

echo "==> Reload nginx"
sudo nginx -t
sudo systemctl reload nginx

sleep 2
curl -sf http://127.0.0.1:8000/ >/dev/null && echo "API OK" || echo "WARN: API check failed"
echo "Deploy complete: https://aivora.duckdns.org/"
