# Low-memory defaults for small EC2 (e.g. t2.micro ~1 GiB RAM).
# Run from backend/: gunicorn -c gunicorn.conf.py config.wsgi:application
# Logs: ../logs/gunicorn-error.log and gunicorn-access.log

from pathlib import Path

LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

bind = "0.0.0.0:8000"
workers = 1
threads = 1
worker_class = "sync"
timeout = 120
graceful_timeout = 30
max_requests = 300
max_requests_jitter = 50
limit_request_line = 8190

accesslog = str(LOG_DIR / "gunicorn-access.log")
errorlog = str(LOG_DIR / "gunicorn-error.log")
loglevel = "info"
capture_output = True
