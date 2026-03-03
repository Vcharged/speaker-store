# Car Rental

Production-ready full-stack car rental app.

## Services
- Backend: NestJS + Prisma
- Frontend: React (Vite) + TailwindCSS
- Database: PostgreSQL
- Reverse proxy: Nginx

## Quick Start
1. Copy root and backend env files and edit secrets.
2. Start services with Docker Compose.

## Environment
Create .env and backend/.env from the examples and update values.

Root .env keys:
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- DOMAIN
- CERTBOT_EMAIL

## Run
```bash
docker compose up --build
```

Backend runs on port 3000 (proxied via Nginx).
Frontend runs on port 80 via Nginx.

## HTTPS (Let's Encrypt)
1. Point your domain to the VPS public IP.
2. Ensure ports 80 and 443 are open.
3. First-time certificate issue:
```bash
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
	-d $DOMAIN --email $CERTBOT_EMAIL --agree-tos --no-eff-email
```
4. Restart Nginx after issuing:
```bash
docker compose restart nginx
```
The certbot service will handle renewals every 12 hours.
