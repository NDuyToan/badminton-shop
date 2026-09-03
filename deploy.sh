#!/bin/bash

set -e

# Go to project root
cd "$(dirname "$0")"

echo "=========================================="
echo "🚀 Starting deployment..."
echo "=========================================="

# 1. Pull latest code
echo ""
echo "📥 Pulling latest code..."
git checkout develop
git pull origin develop

# 2. API
echo ""
echo "📦 Installing API dependencies..."
cd ./apps/api
npm install

echo ""
echo "🗄️ Running Prisma migrations..."
npx prisma migrate deploy

echo ""
echo "🔨 Building API..."
npm run build

# 3. Admin
echo ""
echo "📦 Installing Admin dependencies..."
cd ../admin
npm install

echo ""
echo "🔨 Building Admin..."
npm run build

# 4. Go back to project root
cd ../..

# 5. Reload PM2 applications
echo ""
echo "♻️ Reloading PM2 applications..."
pm2 reload ecosystem.config.js

echo ""
echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="

pm2 status