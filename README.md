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
   python manage.py migrate
   python manage.py collectstatic --noinput
   gunicorn config.wsgi:application --bind 0.0.0.0:8000
   ```

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
