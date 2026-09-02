#!/bin/bash

# GrowSmart Full-Stack Setup Script
set -e

echo "🌾 GrowSmart Setup"
echo "==================="

# 1. Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# 2. Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# 3. Generate Prisma client
echo ""
echo "⚙️  Generating Prisma client..."
npx prisma generate

# 4. Create uploads directory
mkdir -p uploads

# 5. Check for Docker
if command -v docker &> /dev/null; then
  echo ""
  echo "🐳 Docker detected."
  echo "   Starting PostgreSQL and Redis..."
  cd ..
  docker-compose up -d postgres redis

  echo ""
  echo "   Waiting for database to be ready..."
  sleep 8
else
  echo ""
  echo "⚠️  Docker not found."
  echo "   Please make sure PostgreSQL and Redis are running locally."
  cd ..
fi

# 6. Run database migrations
echo ""
echo "🗄️  Running database migrations..."
cd backend
npx prisma db push

# 7. Seed database
echo ""
echo "🌱 Seeding database with demo data..."
npx tsx prisma/seed.ts

# 8. Done
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "  1. Terminal 1: cd backend && npm run dev   (API on :4000)"
echo "  2. Terminal 2: npm run dev                 (Frontend on :3000)"
echo ""
echo "Demo accounts (login via mobile + OTP, or 4-digit PIN):"
echo "  Farmer 1: 9876543210 / PIN 1234"
echo "  Farmer 2: 9876543211 / PIN 1234"
echo "  Admin:    9000000001 / PIN 0001"
echo "  Officer:  9000000002 / PIN 0002"
echo ""
echo "Mock OTP: Check terminal console for the OTP code in dev mode."

cd ..