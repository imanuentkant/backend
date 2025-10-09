# 🐳 DOCKER DEPLOYMENT GUIDE

## 📅 Ngày: October 9, 2025

---

## 🎯 OVERVIEW

Complete guide để deploy tất cả microservices bằng Docker & Docker Compose.

---

## 📦 DOCKER STRUCTURE

### All Services có Dockerfile:

```
✅ apps/api-gateway/Dockerfile
✅ apps/microservices/dating-service/Dockerfile
✅ apps/microservices/property-service/Dockerfile
✅ apps/microservices/auth-service/Dockerfile
✅ apps/microservices/message-service/Dockerfile
✅ apps/microservices/payment-service/Dockerfile
✅ apps/microservices/vehicle-service/Dockerfile
```

---

## 🚀 QUICK START

### 1. Build & Start All Services

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Services Running

```
✅ PostgreSQL          → localhost:5432
✅ Redis               → localhost:6379
✅ Zookeeper           → localhost:2181
✅ Kafka               → localhost:19092
✅ Kafka UI            → localhost:8080
✅ API Gateway         → localhost:3000
✅ Dating Service      → localhost:3001
✅ Property Service    → localhost:3002
✅ Vehicle Service     → localhost:3003
✅ Message Service     → localhost:3006
✅ Auth Service        → localhost:3007
✅ Payment Service     → localhost:3008
```

### 3. Verify All Services

```bash
# Check health endpoints
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Dating
curl http://localhost:3002/health  # Property
curl http://localhost:3003/health  # Vehicle
curl http://localhost:3006/health  # Message
curl http://localhost:3007/health  # Auth
curl http://localhost:3008/health  # Payment

# All should return: {"status":"healthy"}
```

---

## 📊 DOCKER COMPOSE SERVICES

### Infrastructure Services:

#### PostgreSQL
```yaml
postgres:
  image: postgres:15-alpine
  ports: ["5432:5432"]
  databases:
    - dating_db
    - property_db
    - auth_db
    - message_db
    - payment_db
    - vehicle_db
```

#### Kafka Cluster
```yaml
zookeeper:
  image: confluentinc/cp-zookeeper:7.5.0
  ports: ["2181:2181"]

kafka:
  image: confluentinc/cp-kafka:7.5.0
  ports: ["9092:9092", "19092:19092"]
  
kafka-ui:
  image: provectuslabs/kafka-ui
  ports: ["8080:8080"]
```

#### Redis
```yaml
redis:
  image: redis:7-alpine
  ports: ["6379:6379"]
```

---

### Application Services:

#### API Gateway (Port 3000)
```yaml
api-gateway:
  build: ./apps/api-gateway
  ports: ["3000:3000"]
  environment:
    - DATING_SERVICE_URL=http://dating-service:3001
    - PROPERTY_SERVICE_URL=http://property-service:3002
    - AUTH_SERVICE_URL=http://auth-service:3007
```

#### Dating Service (Port 3001)
```yaml
dating-service:
  build: ./apps/microservices/dating-service
  ports: ["3001:3001"]
  environment:
    - DB_HOST=postgres
    - DB_DATABASE=dating_db
    - KAFKA_BROKERS=kafka:9092
```

#### Property Service (Port 3002)
```yaml
property-service:
  build: ./apps/microservices/property-service
  ports: ["3002:3002"]
  environment:
    - DB_HOST=postgres
    - DB_DATABASE=property_db
    - KAFKA_BROKERS=kafka:9092
```

---

## 🔧 DOCKERFILE STRUCTURE

### Multi-stage Build (Tất cả services dùng pattern này)

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:PORT/health', ...)"

EXPOSE PORT
CMD ["node", "dist/main"]
```

**Benefits:**
- ✅ Small image size (multi-stage)
- ✅ Production dependencies only
- ✅ Built-in health checks
- ✅ Alpine Linux (minimal)

---

## 🛠️ COMMON COMMANDS

### Development:

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d dating-service

# Rebuild after code changes
docker-compose up -d --build dating-service

# View logs
docker-compose logs -f dating-service

# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production:

```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale dating-service=3
```

### Debugging:

```bash
# Enter container shell
docker exec -it dating-service sh

# Check logs
docker logs dating-service

# Inspect container
docker inspect dating-service

# Check network
docker network inspect backend_app-network
```

---

## 🔍 MONITORING

### Container Stats:

```bash
# Real-time stats
docker stats

# Specific service
docker stats dating-service
```

### Logs:

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100 dating-service

# Since timestamp
docker-compose logs --since="2025-10-09T10:00:00" dating-service
```

### Health Checks:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' dating-service

# Should return: healthy
```

---

## 📊 DATABASE MANAGEMENT

### Connect to PostgreSQL:

```bash
# Using docker exec
docker exec -it postgres-dev psql -U postgres

# List databases
\l

# Connect to dating_db
\c dating_db

# List tables
\dt

# Query
SELECT * FROM dating_profiles LIMIT 10;
```

### Kafka Management:

```bash
# List topics
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list

# Consume messages
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic dating.swipe.performed \
  --from-beginning
```

### Kafka UI:

```
Open: http://localhost:8080

- View topics
- Monitor messages
- Check consumer groups
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: Service Not Starting

```bash
# Check logs
docker-compose logs dating-service

# Common causes:
- Port already in use
- Database not ready
- Kafka not ready

# Solution: Check dependencies
docker-compose ps
```

### Issue 2: Cannot Connect to Database

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection from service
docker exec -it dating-service sh
nc -zv postgres 5432

# Should connect successfully
```

### Issue 3: Kafka Connection Failed

```bash
# Check Kafka is running
docker ps | grep kafka

# Test Kafka connection
docker exec -it kafka kafka-broker-api-versions \
  --bootstrap-server localhost:9092
```

### Issue 4: Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory: 4GB+

# Or specify in docker-compose.yml
services:
  dating-service:
    mem_limit: 512m
```

---

## 🔐 SECURITY

### Environment Variables:

```bash
# NEVER commit secrets to git!

# Use .env file
cp .env.example .env
# Edit .env with real secrets

# Docker Compose will automatically load .env
```

### .env Example:

```env
# PostgreSQL
POSTGRES_PASSWORD=strong-password-here

# JWT
API_ACCESS_TOKEN_SECRET=your-256-bit-secret-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# AWS (for S3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## 📦 PRODUCTION DEPLOYMENT

### Build Images:

```bash
# Build all images with tags
docker build -t trungtamtrochoi/api-gateway:1.0.0 ./apps/api-gateway
docker build -t trungtamtrochoi/dating-service:1.0.0 ./apps/microservices/dating-service
docker build -t trungtamtrochoi/property-service:1.0.0 ./apps/microservices/property-service
```

### Push to Registry:

```bash
# Login to Docker Hub
docker login

# Push images
docker push trungtamtrochoi/api-gateway:1.0.0
docker push trungtamtrochoi/dating-service:1.0.0
docker push trungtamtrochoi/property-service:1.0.0
```

### Deploy to VPS:

```bash
# SSH to VPS
ssh user@vps-ip

# Pull images
docker pull trungtamtrochoi/dating-service:1.0.0

# Run
docker run -d \
  --name dating-service \
  -p 3001:3001 \
  -e DB_HOST=postgres-host \
  -e KAFKA_BROKERS=kafka1:9092,kafka2:9092 \
  trungtamtrochoi/dating-service:1.0.0
```

---

## 🎯 BEST PRACTICES

### 1. Multi-stage Builds
- ✅ Separate build & runtime stages
- ✅ Smaller final images
- ✅ Faster deployments

### 2. Health Checks
- ✅ All services have health endpoints
- ✅ Docker health checks configured
- ✅ Automatic restarts on failure

### 3. Dependencies
- ✅ Services wait for dependencies (depends_on)
- ✅ Health check conditions
- ✅ Retry logic in code

### 4. Logging
- ✅ Structured logs (JSON)
- ✅ Centralized logging (ELK stack)
- ✅ Log rotation

### 5. Volumes
- ✅ Persistent data in volumes
- ✅ Named volumes
- ✅ Backup strategy

---

## ✅ CHECKLIST

Before deployment:

- [ ] All Dockerfiles created
- [ ] docker-compose.yml configured
- [ ] Environment variables set
- [ ] Secrets secured
- [ ] Health checks working
- [ ] Database migrations run
- [ ] Kafka topics created
- [ ] Services tested locally
- [ ] Images pushed to registry
- [ ] Production environment ready

---

## 📖 RESOURCES

### Docker Commands:
```bash
docker ps                    # List containers
docker images                # List images
docker logs <container>      # View logs
docker exec -it <container> sh  # Enter shell
docker inspect <container>   # Inspect details
docker network ls            # List networks
docker volume ls             # List volumes
```

### Docker Compose Commands:
```bash
docker-compose up            # Start services
docker-compose down          # Stop services
docker-compose build         # Build images
docker-compose logs          # View logs
docker-compose ps            # List services
docker-compose restart       # Restart services
```

---

## 🎉 CONCLUSION

**Docker deployment complete!**

### What We Have:
- ✅ 7 Dockerfiles (all services)
- ✅ 1 docker-compose.yml (orchestration)
- ✅ Multi-stage builds (optimized)
- ✅ Health checks (automatic)
- ✅ Network isolation (secure)
- ✅ Volume persistence (data safe)

### Quick Start:
```bash
docker-compose up -d
# Wait 30 seconds for services to start
curl http://localhost:3000/health
# {"status":"healthy"}
```

**Status:** 🐳 **DOCKER DEPLOYMENT READY!**

---

**Created by:** AI Assistant 🤖  
**Date:** October 9, 2025  
**For:** Trung Tâm Trợ Chơi - Complete Docker Deployment

