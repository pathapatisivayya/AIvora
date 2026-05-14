# Low-memory defaults for small EC2 (e.g. t2.micro ~1 GiB RAM).
# Default Gunicorn worker count is high enough to trigger OOM kills; use one worker.
# Run from backend/: gunicorn -c gunicorn.conf.py config.wsgi:application

bind = "0.0.0.0:8000"
workers = 1
threads = 1
worker_class = "sync"
timeout = 120
graceful_timeout = 30
max_requests = 300
max_requests_jitter = 50
limit_request_line = 8190
