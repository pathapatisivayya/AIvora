# Aivora Solutions — Full-stack company website

Django + Django REST Framework + React (Vite, Tailwind, Framer Motion). Deploy on **AWS EC2** (or similar) with **Gunicorn** — **SQLite by default** (no RDS), **no S3 required** (local media + WhiteNoise for static files). Optional S3 only if you enable it later.

## Local development

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
# Local: USE_SQLITE=True (default in development settings)
python manage.py migrate
python manage.py seed_aivora
python manage.py runserver
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:8000`. Set `CORS_ALLOWED_ORIGINS` to include your frontend URL.

Staff dashboard: create a superuser with `python manage.py createsuperuser`, then open `/dashboard`.

## AWS (EC2) — SQLite, no S3 bucket

Good for a **single server**: Django API + SQLite file on **persistent disk** (EBS volume), static files via **WhiteNoise**, uploaded media under `MEDIA_ROOT` on the same disk.

1. **Create an EBS-backed folder for the DB** (example):

   ```bash
   sudo mkdir -p /var/lib/aivora
   sudo chown $USER:$USER /var/lib/aivora
   ```

2. **Environment** (systemd, `.env` next to the app, or Elastic Beanstalk env):

   - `DJANGO_SETTINGS_MODULE=config.settings.production`
   - `DJANGO_SECRET_KEY` — long random string  
   - `DJANGO_DEBUG=False`  
   - `DJANGO_ALLOWED_HOSTS` — include your **hostname** (e.g. Duck DNS `aivora.duckdns.org`), **public IPv4**, **private IPv4** (for internal/VPC or health checks), **public DNS**, and local dev (example: `aivora.duckdns.org,107.23.239.129,172.31.38.134,ec2-107-23-239-129.compute-1.amazonaws.com,localhost,127.0.0.1`) — or `*` behind ALB only if you accept the tradeoffs  
   - **`USE_SQLITE=True`** (default in production settings)  
   - **`SQLITE_PATH=/var/lib/aivora/db.sqlite3`** — must survive reboots (not `/tmp`)  
   - `USE_S3=False` — leave off unless you add a bucket later  
   - `CORS_ALLOWED_ORIGINS` — list every **browser origin** that calls the API (e.g. `http://aivora.duckdns.org`, `https://aivora.duckdns.org`, your EC2 `http://…` URLs, plus local Vite)  
   - `DJANGO_CSRF_TRUSTED_ORIGINS` — same hostnames with scheme for HTTPS (e.g. `https://aivora.duckdns.org`); see `backend/.env.example`  
   - SMTP: `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `CONTACT_EMAIL_TO`, `DEFAULT_FROM_EMAIL`

3. **Deploy**

   ```bash
   export DJANGO_SETTINGS_MODULE=config.settings.production
   python manage.py migrate
   python manage.py collectstatic --noinput
   gunicorn -c gunicorn.conf.py config.wsgi:application
   ```

   **First-time EC2 (Ubuntu) — after Git push**

   ```bash
   # On the server (SSH). Replace YOUR_REPO_URL with your Git remote HTTPS/SSH URL.
   sudo apt update && sudo apt install -y git python3-pip build-essential python3-venv
   # If `python3 -m venv .venv` still says ensurepip is not available, install the matching package, e.g.:
   # sudo apt install -y python3.12-venv
   sudo mkdir -p /var/lib/aivora && sudo chown "$USER:$USER" /var/lib/aivora

   git clone YOUR_REPO_URL aivora && cd aivora/backend
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env && nano .env   # set DJANGO_DEBUG=False, DJANGO_SECRET_KEY, SQLITE_PATH=/var/lib/aivora/db.sqlite3, SMTP, hosts/CORS; see below

   export DJANGO_SETTINGS_MODULE=config.settings.production
   python manage.py migrate
   python manage.py seed_aivora
   python manage.py createsuperuser
   python manage.py collectstatic --noinput
   gunicorn -c gunicorn.conf.py config.wsgi:application
   ```

   **Plain HTTP on port 8000** (security group allows 8000; no nginx/TLS yet): in `.env` set `SECURE_SSL_REDIRECT=False`, `SESSION_COOKIE_SECURE=False`, and `CSRF_COOKIE_SECURE=False`. When you add HTTPS behind nginx, set those back to secure defaults and include `https://…` in `CORS_ALLOWED_ORIGINS` / `DJANGO_CSRF_TRUSTED_ORIGINS`.

   **EC2 troubleshooting**

   - **venv / ensurepip:** run `sudo apt install -y python3-venv` (and if needed `sudo apt install -y python3.12-venv` to match `python3 --version`). Create the venv **inside** `aivora/backend` (`cd …/aivora/backend && python3 -m venv .venv`), not in `$HOME` alone.
   - **Gunicorn must run from `backend/`:** `cd ~/aivora/backend && source .venv/bin/activate` then `gunicorn -c gunicorn.conf.py config.wsgi:application` (uses **one worker** — important on **t2.micro** to avoid OOM / `SIGKILL`).
   - **Worker SIGKILL / “Perhaps out of memory”:** your instance ran out of RAM. Use `gunicorn.conf.py` (single worker), add **swap** (example: `sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`), or upgrade instance type.
   - **Browser check:** `http://aivora.duckdns.org:8000/` returns a small JSON `{"ok": true, …}` (API only — not the React marketing site). Lists: `http://aivora.duckdns.org:8000/api/offerings/services/`.
   - **React site:** requires `npm run build` + nginx (or another host) serving `frontend/dist/`; Gunicorn alone does not serve the Vite homepage at `/`.
   - **Connection refused:** security group inbound **8000**, Gunicorn actually running, Duck DNS IP matches EC2 public IP (`curl -s ifconfig.me` on the instance vs Duck DNS).
   - **DisallowedHost:** add the hostname you use in the browser to `DJANGO_ALLOWED_HOSTS` in `.env`.
   - **Redirect to https / broken cookies over http:** set the three `SECURE_*` / cookie flags to `False` for plain HTTP (see above).

4. **Frontend:** build with `npm run build` and serve `dist/` via **nginx** on the same instance, **or** any static host (Netlify, CloudFront with **origin = your built files** — no S3 bucket required if you upload artifacts elsewhere). If the API is another origin, set `VITE_API_URL` at build time.

**Later upgrades**

- **RDS PostgreSQL:** set `USE_SQLITE=False` and fill `DB_*` in `.env` (see comments in `.env.example`).
- **S3 for media:** set `USE_S3=True` and AWS bucket variables in `.env`.

## Project layout

- `backend/` — Django (`config/`), apps under `apps/`
- `frontend/` — React SPA

## Environment variables

See `backend/.env.example` and `frontend/.env.example`.

### MySQL instead of PostgreSQL

Set `USE_SQLITE=False`, `DB_ENGINE=django.db.backends.mysql`, add a MySQL driver, and set `DB_*` accordingly.
