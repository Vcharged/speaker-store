# 🚀 Music Store Deployment Guide
## Digital Ocean VPS + Docker + Caddy + SSL

### 📋 Prerequisites
- Digital Ocean VPS (IP: 167.172.169.150)
- Domain name (speaker-store.ru recommended)
- GitHub repository: https://github.com/Vcharged/speaker-store

---

## 🗂️ Step 1: Prepare Local Project

### 1.1 Update Environment Files
```bash
# Root .env
POSTGRES_DB=music_store
POSTGRES_USER=music_store
DOMAIN=speaker-store.ru
ACME_EMAIL=admin@speaker-store.ru

# Backend .env
DATABASE_URL=postgresql://music_store:your_secure_password@db:5432/music_store
JWT_SECRET=your_very_secure_jwt_secret_here
ADMIN_SEED_EMAIL=admin@speaker-store.ru
ADMIN_SEED_PASSWORD=your_secure_admin_password
```

### 1.2 Rename Project Folder
```bash
# Close IDE first, then rename:
mv car-rental music-store
cd music-store
```

---

## 🔐 Step 2: Connect to VPS via SSH

```bash
ssh root@167.172.169.150
# Password: f8Q3i=q.Xz&e.qR
```

---

## 🛠️ Step 3: Server Setup

### 3.1 Update System
```bash
apt update && apt upgrade -y
```

### 3.2 Install Required Software
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
apt install git -y

# Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy -y

# Install Node.js (for build processes)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install UFW Firewall
apt install ufw -y
```

### 3.3 Configure Firewall
```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

---

## 🐙 Step 4: Clone & Setup Project

### 4.1 Clone Repository
```bash
cd /var
git clone https://github.com/Vcharged/speaker-store.git
cd speaker-store
```

### 4.2 Create Environment Files
```bash
# Create root .env
cp .env.example .env
nano .env
# Update with your values

# Create backend .env
cp backend/.env.example backend/.env
nano backend/.env
# Update with secure values
```

### 4.3 Generate Secure Secrets
```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Database Password
openssl rand -base64 16
```

---

## 🐳 Step 5: Deploy with Docker

### 5.1 Build and Start Services
```bash
docker-compose up --build -d
```

### 5.2 Check Services Status
```bash
docker-compose ps
docker-compose logs -f
```

### 5.3 Initialize Database
```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

---

## 🌐 Step 6: Domain Setup

### 6.1 Buy Domain
- Recommended registrar: reg.ru, nic.ru, or namecheap.com
- Buy domain: `speaker-store.ru`

### 6.2 Configure DNS
```
A Record: @ -> 167.172.169.150
A Record: www -> 167.172.169.150
```

### 6.3 Update Caddy Configuration
```bash
nano caddy/Caddyfile
# Ensure DOMAIN is set correctly
```

### 6.4 Restart Caddy
```bash
docker-compose restart caddy
```

---

## 🔒 Step 7: SSL Certificate

Caddy automatically handles SSL certificates via Let's Encrypt:
- Certificates will be auto-generated when domain points to VPS
- Auto-renewal is handled by Caddy
- Certs stored in `/var/lib/caddy`

---

## ✅ Step 8: Final Verification

### 8.1 Check Website
```bash
curl -I https://speaker-store.ru
```

### 8.2 Check API
```bash
curl https://speaker-store.ru/api/products
```

### 8.3 Check SSL
```bash
openssl s_client -connect speaker-store.ru:443
```

---

## 📊 Step 9: Monitoring

### 9.1 Setup Monitoring Script
```bash
# Create monitoring script
nano /root/monitor.sh
```

```bash
#!/bin/bash
docker-compose ps
docker-compose logs --tail=50
```

### 9.2 Setup Auto-restart
```bash
# Add to crontab
crontab -e

# Add lines:
*/5 * * * * cd /var/speaker-store && docker-compose restart backend
0 2 * * * cd /var/speaker-store && docker-compose pull && docker-compose up -d
```

---

## 🚨 Troubleshooting

### Common Issues:
1. **Port 80/443 blocked**: Check UFW firewall
2. **DNS not propagated**: Wait 24-48 hours
3. **SSL not working**: Check domain DNS and Caddy logs
4. **Database connection failed**: Check .env files

### Useful Commands:
```bash
# View logs
docker-compose logs -f [service_name]

# Restart services
docker-compose restart

# Rebuild services
docker-compose up --build -d

# Access database
docker-compose exec db psql -U music_store -d music_store
```

---

## 🎯 Success Checklist

- [ ] Project renamed to music-store
- [ ] Code pushed to GitHub
- [ ] VPS configured with Docker/Git/Caddy
- [ ] Environment files configured
- [ ] Docker containers running
- [ ] Database seeded
- [ ] Domain purchased and DNS configured
- [ ] SSL certificate active
- [ ] Website accessible via HTTPS
- [ ] Admin panel working
- [ ] User registration working

---

## 📞 Support

If you encounter issues:
1. Check Docker logs: `docker-compose logs`
2. Verify DNS propagation: `nslookup speaker-store.ru`
3. Check SSL status: `curl -I https://speaker-store.ru`
4. Review firewall: `ufw status`

Your Music Store should now be live at https://speaker-store.ru! 🎵
