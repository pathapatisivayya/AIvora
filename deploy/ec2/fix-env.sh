#!/usr/bin/env bash
# Fix common EC2 .env issues: stray "y" lines, old settings module, settings/ folder.
# Usage: bash deploy/ec2/fix-env.sh

set -euo pipefail

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
BACKEND_DIR="$AIVORA_HOME/backend"
ENV_FILE="$BACKEND_DIR/.env"

echo "==> Remove old config/settings/ package (shadows config/settings.py)"
rm -rf "$BACKEND_DIR/config/settings"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Creating $ENV_FILE from .env.example"
  cp "$BACKEND_DIR/.env.example" "$ENV_FILE"
fi

echo "==> Clean .env"
cp "$ENV_FILE" "$ENV_FILE.bak"

grep -v '^[[:space:]]*$' "$ENV_FILE.bak" \
  | grep -v '^[[:space:]]*y[[:space:]]*$' \
  | grep -v 'config\.settings\.production' \
  | grep -v '^DJANGO_SETTINGS_MODULE=' \
  >"$ENV_FILE.tmp"

{
  head -n 2 "$ENV_FILE.tmp" 2>/dev/null || true
  echo "DJANGO_SETTINGS_MODULE=config.settings"
  tail -n +3 "$ENV_FILE.tmp" 2>/dev/null || true
} >"$ENV_FILE"

unset DJANGO_SETTINGS_MODULE 2>/dev/null || true

echo "==> Verify Django loads"
cd "$BACKEND_DIR"
# shellcheck source=/dev/null
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=config.settings
python -c "import django; django.setup(); print('OK Django settings loaded')"

echo ""
echo "Done. Backup: $ENV_FILE.bak"
echo "Run: cd $BACKEND_DIR && python manage.py migrate"
