#!/usr/bin/env bash
# Install Gunicorn as systemd service (auto-start on reboot + error logs).
# Usage: bash deploy/ec2/install-systemd.sh

set -euo pipefail

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
SERVICE_FILE="$AIVORA_HOME/deploy/ec2/aivora-api.service"

if [[ ! -f "$SERVICE_FILE" ]]; then
  echo "Not found: $SERVICE_FILE"
  exit 1
fi

# Stop manual/nohup Gunicorn before systemd takes over
pkill -f "gunicorn.*config.wsgi" 2>/dev/null || true
sleep 1

sudo cp "$SERVICE_FILE" /etc/systemd/system/aivora-api.service
sudo systemctl daemon-reload
sudo systemctl enable aivora-api
sudo systemctl restart aivora-api

echo "aivora-api service status:"
sudo systemctl status aivora-api --no-pager || true

echo ""
echo "Useful commands:"
echo "  sudo systemctl status aivora-api"
echo "  sudo systemctl restart aivora-api"
echo "  sudo journalctl -u aivora-api -f"
echo "  tail -f $AIVORA_HOME/logs/gunicorn-error.log"
echo "  bash $AIVORA_HOME/deploy/ec2/deploy-aivora.sh"
