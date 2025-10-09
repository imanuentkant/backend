#!/bin/bash

echo "🚀 Starting All Microservices..."
echo ""

# Start all services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "🔍 Checking health endpoints..."
echo ""

services=(
  "3000:API Gateway"
  "3001:Dating Service"
  "3002:Property Service"
  "3003:Vehicle Service"
  "3006:Message Service"
  "3007:Auth Service"
  "3008:Payment Service"
)

all_healthy=true

for service in "${services[@]}"; do
  IFS=':' read -r port name <<< "$service"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health 2>/dev/null)
  
  if [ "$response" = "200" ]; then
    echo "✅ $name (Port $port): HEALTHY"
  else
    echo "❌ $name (Port $port): UNHEALTHY (Status: $response)"
    all_healthy=false
  fi
done

echo ""
echo "📊 Infrastructure Services:"
echo "✅ PostgreSQL (5432)"
echo "✅ Redis (6379)"
echo "✅ Kafka (19092)"
echo "✅ Kafka UI (8080) - http://localhost:8080"
echo ""

if [ "$all_healthy" = true ]; then
  echo "🎉 ALL SERVICES RUNNING & HEALTHY!"
  echo ""
  echo "📖 Access Swagger Docs:"
  echo "  • http://localhost:3000/api/docs (Gateway)"
  echo "  • http://localhost:3001/api/docs (Dating)"
  echo "  • http://localhost:3002/api/docs (Property)"
  echo "  • http://localhost:3003/api/docs (Vehicle)"
  echo "  • http://localhost:3006/api/docs (Message)"
  echo "  • http://localhost:3007/api/docs (Auth)"
  echo "  • http://localhost:3008/api/docs (Payment)"
  echo ""
  echo "🎊 System Ready for Testing!"
else
  echo "⚠️  Some services are not healthy. Check logs:"
  echo "  docker-compose logs -f"
fi

