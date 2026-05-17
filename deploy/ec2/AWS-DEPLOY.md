# Aivora — AWS EC2 deployment guide

Complete steps for **Ubuntu EC2**: Git, Django API (Gunicorn), React build, nginx, SSL (HTTPS).

**Live example:** `https://aivora.duckdns.org`  
**Repo:** `https://github.com/pathapatisivayya/AIvora.git`

---

## Security first

- Never commit `backend/.env` (it is in `.gitignore`).
- Use a **Gmail App Password** (16 characters, **no spaces**, no quotes in `.env`).
- If a password was shared in chat or Git, **revoke it** in Google Account → Security → App passwords and create a new one.

---

## 1. EC2 preparation

### Security group (inbound)

| Type        | Port | Source     |
|-------------|------|------------|
| SSH         | 22   | Your IP    |
| HTTP        | 80   | 0.0.0.0/0  |
| HTTPS       | 443  | 0.0.0.0/0  |
| Custom TCP  | 8000 | Optional (direct API test only) |

### Duck DNS

Point `aivora.duckdns.org` → your EC2 **public IP** (e.g. `107.23.239.129`).

### System packages

```bash
sudo apt update
sudo apt install -y git python3-pip python3-venv build-essential nginx certbot python3-certbot-nginx
sudo mkdir -p /var/lib/aivora /var/www/aivora
sudo chown $USER:$USER /var/lib/aivora
```

---

## 2. Clone project (first time only)

```bash
cd ~
git clone https://github.com/pathapatisivayya/AIvora.git
cd AIvora
```

---

## 3. Backend setup

```bash
cd ~/AIvora/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
nano .env
```

### Important `.env` rules

- Use **`DJANGO_SETTINGS_MODULE=config.settings`** (NOT `config.settings.production`).
- No stray lines (e.g. a lone `y` from Certbot).
- Gmail password: **one line, no spaces, no quotes**  
  `EMAIL_HOST_PASSWORD=your16charapppassword`

### Example production `.env`

```env
DJANGO_SETTINGS_MODULE=config.settings
DJANGO_SECRET_KEY=your-long-random-secret-key-here
DJANGO_DEBUG=False

DJANGO_ALLOWED_HOSTS=aivora.duckdns.org,107.23.239.129,172.31.38.134,localhost,127.0.0.1
USE_SQLITE=True
SQLITE_PATH=/var/lib/aivora/db.sqlite3

CORS_ALLOWED_ORIGINS=https://aivora.duckdns.org,http://aivora.duckdns.org
DJANGO_CSRF_TRUSTED_ORIGINS=https://aivora.duckdns.org

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

CONTACT_EMAIL_TO=krupaworship@gmail.com
WHATSAPP_NUMBER=9195532000352

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your16charapppassword
DEFAULT_FROM_EMAIL=Aivora Solutions <your-gmail@gmail.com>
```

### Remove old settings folder (if migrate fails)

```bash
rm -rf ~/AIvora/backend/config/settings
```

### Migrate & admin

```bash
cd ~/AIvora/backend
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=config.settings
python manage.py migrate
python manage.py seed_aivora
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### Static file permissions (admin CSS)

```bash
chmod 711 /home/ubuntu
chmod 755 /home/ubuntu/AIvora
chmod 755 /home/ubuntu/AIvora/backend
chmod -R 755 /home/ubuntu/AIvora/backend/staticfiles
```

---

## 4. Frontend build

```bash
cd ~/AIvora/frontend
npm install
npm run build
sudo rsync -a --delete dist/ /var/www/aivora/
sudo chown -R www-data:www-data /var/www/aivora
```

Or use script:

```bash
bash ~/AIvora/deploy/ec2/build-frontend.sh
```

---

## 5. nginx configuration

Create site file:

```bash
sudo nano /etc/nginx/sites-available/aivora
```

```nginx
server {
    listen 80;
    server_name aivora.duckdns.org 107.23.239.129;

    root /var/www/aivora;
    index index.html;

    location /static/ {
        alias /home/ubuntu/AIvora/backend/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/AIvora/backend/media/;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:

```bash
sudo ln -sf /etc/nginx/sites-available/aivora /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

If **500 Permission denied** on homepage:

```bash
chmod 711 /home/ubuntu
chmod -R 755 /home/ubuntu/AIvora/frontend/dist
# or use /var/www/aivora only (recommended)
```

---

## 6. SSL (HTTPS) with Let's Encrypt

```bash
sudo certbot --nginx -d aivora.duckdns.org
```

Choose **redirect HTTP → HTTPS** (option 2).

Test renewal:

```bash
sudo certbot renew --dry-run
```

Open: **https://aivora.duckdns.org/**

---

## 7. Gunicorn — auto-start (systemd)

```bash
cd ~/AIvora
chmod +x deploy/ec2/*.sh
bash deploy/ec2/install-systemd.sh
```

Useful commands:

```bash
sudo systemctl status aivora-api
sudo systemctl restart aivora-api
sudo journalctl -u aivora-api -f
tail -f ~/AIvora/logs/gunicorn-error.log
```

Manual start (without systemd):

```bash
bash ~/AIvora/deploy/ec2/start-aivora.sh
```

---

## 8. Git workflow (your PC → GitHub → EC2)

### On Windows (your PC)

```powershell
cd E:\Aivora
git add -A
git status
git commit -m "Describe your change"
git push origin main
```

Do **not** commit `backend/.env`.

### On EC2 (update server)

```bash
cd ~/AIvora
git pull origin main
bash deploy/ec2/fix-env.sh
bash deploy/ec2/deploy-aivora.sh
```

`deploy-aivora.sh` does: pull, migrate, collectstatic, build frontend, restart API, reload nginx.

Frontend only:

```bash
bash deploy/ec2/build-frontend.sh
```

Status check:

```bash
bash deploy/ec2/status-aivora.sh
```

---

## 9. URLs to test

| URL | Expected |
|-----|----------|
| https://aivora.duckdns.org/ | React homepage |
| https://aivora.duckdns.org/api/offerings/services/ | JSON API |
| https://aivora.duckdns.org/admin/ | Django admin (styled) |
| http://127.0.0.1:8000/ (on server) | `{"ok": true, ...}` |

---

## 10. Contact info (website)

Set in `backend/.env` (shown on Contact page via API):

| Field | Example |
|-------|---------|
| `WHATSAPP_NUMBER` | `9195532000352` (country code, no `+`) |
| `CONTACT_EMAIL_TO` | `krupaworship@gmail.com` |

**Office hours** (Mon–Sat 10:00–18:00 IST): edit `frontend/src/pages/Contact.jsx` if you want it on the page.

---

## 11. Common errors

| Error | Fix |
|-------|-----|
| `Invalid line: y` | Remove stray `y` line in `.env` → `bash deploy/ec2/fix-env.sh` |
| `config.settings.production` | Use `config.settings`; `rm -rf backend/config/settings` |
| nginx 500 Permission denied | Use `/var/www/aivora` or fix `chmod` on `/home/ubuntu` |
| Admin has no CSS | `collectstatic` + nginx `location /static/` |
| `https://...:8000` fails | Use **https://domain/** (port 443), not :8000 |
| Email not sending | App password without spaces; `EMAIL_HOST_USER` matches Gmail |

---

## 12. Script reference

| Script | Purpose |
|--------|---------|
| `deploy/ec2/fix-env.sh` | Fix `.env` + remove old `config/settings/` |
| `deploy/ec2/install-systemd.sh` | Gunicorn auto-start on boot |
| `deploy/ec2/start-aivora.sh` | Start API + reload nginx |
| `deploy/ec2/build-frontend.sh` | Build + publish React to `/var/www/aivora` |
| `deploy/ec2/deploy-aivora.sh` | Full deploy (pull + backend + frontend) |
| `deploy/ec2/status-aivora.sh` | Health check |

---

## Wrong commands (do not use)

```bash
# WRONG — old settings module
export DJANGO_SETTINGS_MODULE=config.settings.production

# WRONG — Gmail password with spaces/quotes in .env
EMAIL_HOST_PASSWORD="cqtm ufzt mpwn cifp"

# WRONG — HTTPS on Gunicorn port without SSL cert
https://107.23.239.129:8000/
```

Use instead:

```bash
export DJANGO_SETTINGS_MODULE=config.settings
EMAIL_HOST_PASSWORD=cqtmufztmpwncifp
http://127.0.0.1:8000/
https://aivora.duckdns.org/
```
