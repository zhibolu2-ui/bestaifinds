#!/bin/bash
set -euo pipefail

echo "=== BestAIFinds.com VPS Setup ==="

# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# Install FFmpeg for video processing
if ! command -v ffmpeg &> /dev/null; then
  apt-get install -y ffmpeg
fi

# Install LibreOffice headless for document conversion
if ! command -v libreoffice &> /dev/null; then
  apt-get install -y libreoffice-core libreoffice-writer libreoffice-calc libreoffice-impress --no-install-recommends
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
  apt-get install -y certbot python3-certbot-nginx
fi

# Create app directory
APP_DIR="/var/www/bestaifinds"
mkdir -p $APP_DIR

echo ""
echo "=== System Setup Complete ==="
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "FFmpeg: $(ffmpeg -version 2>&1 | head -1)"
echo ""
echo "Next steps:"
echo "1. Copy your project files to $APP_DIR"
echo "2. Run: cd $APP_DIR && npm install && npm run build"
echo "3. Create .env.local with your OPENAI_API_KEY"
echo "4. Copy deploy/nginx.conf to /etc/nginx/sites-available/bestaifinds.com"
echo "5. ln -s /etc/nginx/sites-available/bestaifinds.com /etc/nginx/sites-enabled/"
echo "6. Setup SSL: certbot --nginx -d bestaifinds.com -d www.bestaifinds.com"
echo "7. Start app: pm2 start npm --name bestaifinds -- start"
echo "8. pm2 save && pm2 startup"
