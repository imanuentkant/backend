#!/bin/bash

echo "🚀 Starting Full Stack Monorepo..."
echo ""

# Check if Docker is running
echo "📦 Checking Docker services..."
docker-compose up -d

echo ""
echo "✅ PostgreSQL: localhost:5432"
echo "✅ MinIO: localhost:9000"
echo "✅ MinIO Console: localhost:9001"
echo ""

# Start backend
echo "🔧 Starting Backend API..."
echo "   Backend will run on: http://localhost:3000"
echo "   Swagger docs: http://localhost:3000/api/docs"
echo ""

# Instructions for frontends
echo "📱 To start frontends (in separate terminals):"
echo ""
echo "   Terminal 2 - Client Frontend:"
echo "   cd client-frontend && npm run dev"
echo "   → http://localhost:3001"
echo ""
echo "   Terminal 3 - Host/Admin Frontend:"
echo "   cd host-admin-frontend && npm run dev -- -p 3002"
echo "   → http://localhost:3002"
echo ""

# Start backend
npm run start:dev
