#!/bin/bash
set -euo pipefail

VPS_IP="103.53.81.188"
VPS_USER="root"
APP_DIR="/var/www/bestaifinds"
KEY_FILE="../../_vps_key.pem"

echo "=== Deploying BestAIFinds to VPS ==="

# Build locally
echo "Building..."
npm run build

# Sync files to VPS (exclude node_modules, .next cache)
echo "Syncing files..."
rsync -avz --delete \
  -e "ssh -i $KEY_FILE -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.next/cache' \
  --exclude '.env.local' \
  --exclude '.git' \
  ./ ${VPS_USER}@${VPS_IP}:${APP_DIR}/

# Install and restart on VPS
echo "Installing dependencies and restarting..."
ssh -i $KEY_FILE -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} << 'EOF'
  cd /var/www/bestaifinds
  npm install --production
  npm run build
  
  # Restart with PM2
  if pm2 list | grep -q bestaifinds; then
    pm2 restart bestaifinds
  else
    pm2 start npm --name bestaifinds -- start
    pm2 save
  fi
  
  echo "Deploy complete!"
  pm2 status bestaifinds
EOF

echo "=== Deployment finished ==="
echo "Site: https://bestaifinds.com"
