#!/usr/bin/env bash
# Quick health check: API + nginx + frontend files.
# Usage: bash deploy/ec2/status-aivora.sh

AIVORA_HOME="${AIVORA_HOME:-$HOME/AIvora}"
WEB_ROOT="${WEB_ROOT:-/var/www/aivora}"

echo "=== API (Gunicorn / systemd) ==="
systemctl is-active aivora-api 2>/dev/null && sudo systemctl status aivora-api --no-pager -l | head -12 || echo "aivora-api service not installed"
curl -sf http://127.0.0.1:8000/ && echo "" || echo "API not responding on :8000"

echo ""
echo "=== Nginx ==="
systemctl is-active nginx 2>/dev/null || echo "nginx not running"
curl -sf -o /dev/null -w "Homepage HTTP %{http_code}\n" http://127.0.0.1/ || echo "nginx homepage failed"

echo ""
echo "=== Frontend files ==="
ls -la "$WEB_ROOT/index.html" 2>/dev/null || echo "Missing $WEB_ROOT/index.html — run: bash deploy/ec2/build-frontend.sh"

echo ""
echo "=== Logs ==="
echo "  tail -f $AIVORA_HOME/logs/gunicorn-error.log"
echo "  sudo journalctl -u aivora-api -f"
