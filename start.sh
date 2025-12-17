#!/bin/bash

# Market Oracle - Quick Start Script
# This script starts both frontend and backend services using PM2

echo "🔮 Market Oracle - Starting Services..."
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
pm2 delete all 2>/dev/null || true

# Kill ports if needed
echo "🔓 Freeing up ports 3000 and 3001..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 3001/tcp 2>/dev/null || true

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found. Creating from example..."
    cp .env.example .env.local
    echo "✏️  Please edit .env.local with your configuration"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start services with PM2
echo ""
echo "🚀 Starting services with PM2..."
pm2 start ecosystem.config.cjs

# Wait a moment for services to start
sleep 3

# Show status
echo ""
echo "📊 Service Status:"
pm2 list

echo ""
echo "✅ Market Oracle is running!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📝 Useful commands:"
echo "   pm2 logs --nostream    # View logs"
echo "   pm2 restart all        # Restart services"
echo "   pm2 stop all           # Stop services"
echo "   pm2 delete all         # Remove services"
echo ""
