#!/usr/bin/env bash
# Start / restart Gunicorn + ensure nginx is running (EC2).
# Usage: bash deploy/ec2/start-aivora.sh

set -euo pipefail

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
BACKEND_DIR="$AIVORA_HOME/backend"
LOG_DIR="$AIVORA_HOME/logs"
VENV="$BACKEND_DIR/.venv"

mkdir -p "$LOG_DIR"

if [[ ! -d "$VENV" ]]; then
  echo "Missing venv at $VENV — run: cd $BACKEND_DIR && python3 -m venv .venv && pip install -r requirements.txt"
  exit 1
fi

# shellcheck source=/dev/null
source "$VENV/bin/activate"
export DJANGO_SETTINGS_MODULE=config.settings

cd "$BACKEND_DIR"

echo "Stopping old Gunicorn (if any)..."
pkill -f "gunicorn.*config.wsgi" 2>/dev/null || true
sleep 1

echo "Starting Gunicorn (logs in $LOG_DIR)..."
nohup gunicorn -c gunicorn.conf.py config.wsgi:application \
  >>"$LOG_DIR/gunicorn-error.log" 2>&1 &

sleep 2
if curl -sf http://127.0.0.1:8000/ >/dev/null; then
  echo "API OK: http://127.0.0.1:8000/"
else
  echo "API not responding — check: tail -50 $LOG_DIR/gunicorn-error.log"
  exit 1
fi

echo "Reloading nginx..."
sudo nginx -t
sudo systemctl reload nginx || sudo systemctl start nginx

echo "Done."
echo "  Site:  https://aivora.duckdns.org/"
echo "  Admin: https://aivora.duckdns.org/admin/"
echo "  Logs:  tail -f $LOG_DIR/gunicorn-error.log"
