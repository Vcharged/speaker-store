#!/bin/bash

# 🚀 Music Store Quick Deploy Script
# Run this script on your Digital Ocean VPS

set -e

echo "🎵 Music Store Deployment Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    print_warning "Docker already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    print_warning "Docker Compose already installed"
fi

# Install Git
print_status "Installing Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
else
    print_warning "Git already installed"
fi

# Install Caddy
print_status "Installing Caddy..."
if ! command -v caddy &> /dev/null; then
    apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    echo 'deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt update
    apt install caddy -y
else
    print_warning "Caddy already installed"
fi

# Configure Firewall
print_status "Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Clone repository
print_status "Cloning project..."
cd /var
if [ -d "speaker-store" ]; then
    print_warning "Directory exists, removing..."
    rm -rf speaker-store
fi

git clone https://github.com/Vcharged/speaker-store.git
cd speaker-store

# Create environment files
print_status "Setting up environment files..."

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 16)
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=$(openssl rand -base64 12)

print_status "Generated secure passwords:"
print_warning "DATABASE PASSWORD: $DB_PASSWORD"
print_warning "JWT SECRET: $JWT_SECRET"
print_warning "ADMIN PASSWORD: $ADMIN_PASSWORD"

# Create .env files
cat > .env << EOF
POSTGRES_DB=music_store
POSTGRES_USER=music_store
DOMAIN=speaker-store.ru
ACME_EMAIL=admin@speaker-store.ru
EOF

cat > backend/.env << EOF
DATABASE_URL=postgresql://music_store:$DB_PASSWORD@db:5432/music_store
JWT_SECRET=$JWT_SECRET
ADMIN_SEED_EMAIL=admin@speaker-store.ru
ADMIN_SEED_PASSWORD=$ADMIN_PASSWORD
EOF

# Build and start services
print_status "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
docker-compose exec backend npm run prisma:migrate

# Seed database
print_status "Seeding database with sample data..."
docker-compose exec backend npm run prisma:seed

# Check service status
print_status "Checking service status..."
docker-compose ps

# Display final information
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
print_status "Services Status:"
docker-compose ps
echo ""
print_status "Important URLs:"
echo "  - Website: http://167.172.169.150"
echo "  - API: http://167.172.169.150/api"
echo "  - API Docs: http://167.172.169.150/api/docs"
echo ""
print_status "Admin Login:"
echo "  - Email: admin@speaker-store.ru"
echo "  - Password: $ADMIN_PASSWORD"
echo ""
print_warning "Next Steps:"
echo "1. Buy domain: speaker-store.ru"
echo "2. Set DNS A record: @ -> 167.172.169.150"
echo "3. Update DOMAIN in .env file"
echo "4. Restart: docker-compose restart caddy"
echo ""
print_warning "Save these credentials securely!"
echo "Database Password: $DB_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo "Admin Password: $ADMIN_PASSWORD"
echo ""
print_status "To view logs: docker-compose logs -f"
print_status "To restart: docker-compose restart"
echo ""
echo "🎵 Your Music Store is ready!"
