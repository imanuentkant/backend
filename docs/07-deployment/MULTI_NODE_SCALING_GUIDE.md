# 🚀 HƯỚNG DẪN CHẠY NHIỀU NODES - HORIZONTAL SCALING

## 📊 TỔNG QUAN

Hệ thống của bạn đã được thiết kế **STATELESS** và sẵn sàng cho horizontal scaling!

```
Before (Single Node):
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │
│  (1 node)   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │
└─────────────┘

After (Multi-Node):
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────────────┐
│  Load Balancer      │
└──────┬──────────────┘
       │
   ┌───┴───┬────┬────┐
   │       │    │    │
┌──▼──┐ ┌─▼─┐ ┌▼─┐ ┌▼──┐
│Node1│ │N2 │ │N3│ │N4 │
└──┬──┘ └─┬─┘ └┬─┘ └┬──┘
   │      │    │    │
   └──┬───┴────┴────┘
      │
┌─────▼──────┐
│  Database  │
│  (Shared)  │
└────────────┘
```

---

## 🎯 5 CÁCH CHẠY NHIỀU NODES

### 1. PM2 Cluster Mode ⭐ (Đơn giản nhất - 1 Server)
### 2. Docker Compose Scale (Đơn giản - Multi-container)
### 3. Kubernetes HPA (Tự động scale - Cloud)
### 4. Load Balancer + Manual Nodes (Traditional)
### 5. Docker Swarm (Container orchestration)

---

## 1️⃣ PM2 CLUSTER MODE (Recommended cho 1 server)

### Cài đặt PM2
```bash
npm install -g pm2
```

### Tạo PM2 Config
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'airbnb-backend',
    script: './dist/Main.js',
    instances: 'max', // Hoặc số cụ thể: 4
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      API_PORT: 3005,
    },
    env_production: {
      NODE_ENV: 'production',
      API_PORT: 3005,
    },
    // Advanced options
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
  }]
};
```

### Start với PM2
```bash
# Build application
npm run build

# Start cluster (auto-detect số CPU cores)
pm2 start ecosystem.config.js --env production

# Hoặc chỉ định số instances
pm2 start ecosystem.config.js -i 4

# Check status
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit

# Reload (zero-downtime)
pm2 reload airbnb-backend

# Stop
pm2 stop airbnb-backend
```

**Ưu điểm**:
- ✅ Rất đơn giản
- ✅ Auto-restart khi crash
- ✅ Load balancing tự động
- ✅ Zero-downtime reload
- ✅ Built-in monitoring

**Nhược điểm**:
- ⚠️ Chỉ trên 1 server
- ⚠️ Không scale cross-server

**Best For**: 1 server với nhiều CPU cores

---

## 2️⃣ DOCKER COMPOSE SCALE (Multi-container trên 1 server)

### docker-compose.yaml (đã có)
```yaml
version: '3.8'

services:
  backend:
    image: your-registry/backend:latest
    build:
      context: .
      dockerfile: Dockerfile.production
    env_file:
      - env/production.env
    ports:
      - "3005-3009:3005"  # Map multiple ports
    depends_on:
      - postgres
      - redis
      - mongo
    deploy:
      replicas: 5  # 5 nodes
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend

  postgres:
    image: postgres:15-alpine
    # ... existing config

  redis:
    image: redis:7-alpine
    # ... existing config
```

### Start Multiple Instances
```bash
# Build
docker-compose build

# Start với 5 replicas
docker-compose up --scale backend=5 -d

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f backend

# Scale up/down
docker-compose up --scale backend=10 -d  # Scale to 10
docker-compose up --scale backend=3 -d   # Scale down to 3

# Stop
docker-compose down
```

**Ưu điểm**:
- ✅ Dễ setup
- ✅ NGINX load balancing
- ✅ Scale nhanh
- ✅ Isolated containers

**Nhược điểm**:
- ⚠️ Vẫn trên 1 server
- ⚠️ Không tự động scale

**Best For**: Development/Small production

---

## 3️⃣ KUBERNETES HPA (Auto-scaling - Production)

### Đã có sẵn trong k8s/deployment.yaml!

```yaml
# k8s/deployment.yaml (already configured)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3  # Initial replicas
  ...

---
# HPA - Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3    # Minimum nodes
  maxReplicas: 10   # Maximum nodes
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Scale when CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80  # Scale when Memory > 80%
```

### Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace production

# Apply configs
kubectl apply -f k8s/configmap.yaml -n production
kubectl apply -f k8s/deployment.yaml -n production
kubectl apply -f k8s/ingress.yaml -n production

# HPA sẽ tự động scale based on CPU/Memory
# Min: 3 nodes, Max: 10 nodes

# Check pods
kubectl get pods -n production

# Check HPA status
kubectl get hpa -n production

# Watch scaling in action
kubectl get hpa backend-hpa -n production --watch

# Manual scale
kubectl scale deployment backend --replicas=5 -n production

# Check logs from all pods
kubectl logs -f deployment/backend -n production
```

**Auto-scaling Example**:
```
Normal load:     3 pods running
CPU > 70%:       Scale up to 5 pods
CPU > 80%:       Scale up to 8 pods
CPU drops:       Scale down to 3 pods (after 5 mins)
```

**Ưu điểm**:
- ✅ Tự động scale
- ✅ Multi-server support
- ✅ Self-healing
- ✅ Rolling updates
- ✅ Production-grade

**Nhược điểm**:
- ⚠️ Cần K8s cluster
- ⚠️ Phức tạp hơn

**Best For**: Production, Enterprise

---

## 4️⃣ NGINX LOAD BALANCER + MANUAL NODES

### Setup Multiple Nodes Manually

#### Server 1:
```bash
# Start on port 3005
API_PORT=3005 npm start
```

#### Server 2:
```bash
# Start on port 3006
API_PORT=3006 npm start
```

#### Server 3:
```bash
# Start on port 3007
API_PORT=3007 npm start
```

### NGINX Load Balancer Config
```nginx
# nginx-lb.conf
upstream backend_cluster {
    least_conn;  # Load balancing algorithm
    
    # List all nodes
    server backend-node1:3005 max_fails=3 fail_timeout=30s weight=1;
    server backend-node2:3005 max_fails=3 fail_timeout=30s weight=1;
    server backend-node3:3005 max_fails=3 fail_timeout=30s weight=1;
    server backend-node4:3005 max_fails=3 fail_timeout=30s weight=1;
    
    # Keep-alive connections
    keepalive 32;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Health check
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        
        # WebSocket sticky sessions (important!)
        ip_hash;
    }
}
```

### Start NGINX
```bash
# Test config
nginx -t

# Start/Reload
nginx -s reload

# Or with Docker
docker run -d -p 80:80 \
  -v $(pwd)/nginx-lb.conf:/etc/nginx/nginx.conf \
  nginx:alpine
```

**Load Balancing Algorithms**:
- `least_conn` - Ít connections nhất (recommended)
- `ip_hash` - Sticky sessions (cho WebSocket)
- `round_robin` - Luân phiên (default)

---

## 5️⃣ DOCKER SWARM (Container Orchestration)

### Initialize Swarm
```bash
# On manager node
docker swarm init

# Get join token
docker swarm join-token worker

# On worker nodes
docker swarm join --token [TOKEN] [MANAGER-IP]:2377
```

### Deploy Stack
```yaml
# docker-stack.yml
version: '3.8'

services:
  backend:
    image: your-registry/backend:latest
    deploy:
      replicas: 5
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    networks:
      - app-network
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    deploy:
      replicas: 2
    ports:
      - "80:80"
    networks:
      - app-network

networks:
  app-network:
    driver: overlay
```

### Deploy
```bash
# Deploy stack
docker stack deploy -c docker-stack.yml airbnb

# List services
docker service ls

# Scale service
docker service scale airbnb_backend=10

# Check logs
docker service logs -f airbnb_backend

# Remove stack
docker stack rm airbnb
```

---

## 🔧 CODE CHANGES CẦN THIẾT

### ✅ Hệ Thống Của Bạn Đã Sẵn Sàng!

Không cần thay đổi code! Hệ thống đã stateless:

- ✅ **No in-memory session** - Dùng JWT
- ✅ **No local file storage** - Dùng MinIO/S3
- ✅ **Shared Redis** - Cache shared giữa nodes
- ✅ **Shared Database** - PostgreSQL shared
- ✅ **Audit logs** - MongoDB shared
- ✅ **Health checks** - Sẵn sàng cho load balancer

### Optional: WebSocket Sticky Sessions

Nếu dùng WebSocket messaging, cần sticky sessions:

```javascript
// src/infrastructure/adapter/messaging/WebSocketGateway.ts (đã có)
// Thêm Redis adapter cho multi-node WebSocket

import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
```

---

## 📋 PRODUCTION DEPLOYMENT OPTIONS

### Option A: AWS Deployment (Recommended)

#### 1. AWS ECS (Fargate) - Serverless Containers
```bash
# Build và push image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com

docker build -f Dockerfile.production -t backend:latest .
docker tag backend:latest [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker push [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com/backend:latest

# Create ECS Service với desired count = 5
aws ecs create-service \
  --cluster production-cluster \
  --service-name backend-service \
  --task-definition backend:1 \
  --desired-count 5 \
  --launch-type FARGATE \
  --load-balancers targetGroupArn=[ARN],containerName=backend,containerPort=3005
```

**Auto-scaling với ECS**:
```bash
# Setup auto-scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/production-cluster/backend-service \
  --min-capacity 3 \
  --max-capacity 10

# Scale on CPU
aws application-autoscaling put-scaling-policy \
  --policy-name backend-cpu-scaling \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/production-cluster/backend-service \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

#### 2. AWS EKS (Kubernetes)
```bash
# Deploy to EKS
kubectl apply -f k8s/

# HPA sẽ tự động scale từ 3 đến 10 pods
```

#### 3. AWS Elastic Beanstalk (Easiest)
```bash
# Deploy
eb init
eb create production-env --scale 5
eb deploy

# Auto-scaling
eb scale 10
```

---

### Option B: Google Cloud Platform

#### GKE (Google Kubernetes Engine)
```bash
# Create cluster
gcloud container clusters create airbnb-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# Deploy
kubectl apply -f k8s/

# HPA tự động scale
```

---

### Option C: DigitalOcean

#### Kubernetes on DO
```bash
# Create cluster (via UI hoặc doctl)
doctl kubernetes cluster create airbnb-cluster --count 3

# Deploy
kubectl apply -f k8s/

# Auto-scaling enabled
```

---

### Option D: Self-Hosted (Own Servers)

#### Multiple Servers với PM2
```bash
# Server 1 (10.0.0.1)
pm2 start ecosystem.config.js

# Server 2 (10.0.0.2)
pm2 start ecosystem.config.js

# Server 3 (10.0.0.3)
pm2 start ecosystem.config.js

# Load Balancer (separate server)
# NGINX config pointing to all servers
```

---

## 🔄 SESSION MANAGEMENT

### ✅ Hệ Thống Đã Stateless

**JWT Tokens** thay vì sessions:
- ✅ Token stored ở client
- ✅ Mỗi request tự contained
- ✅ Không cần shared session storage
- ✅ Scale thoải mái

### Shared Resources (Đã configured)
- ✅ **Redis** - Shared cache
- ✅ **PostgreSQL** - Shared database
- ✅ **MongoDB** - Shared audit logs
- ✅ **MinIO/S3** - Shared file storage

---

## 📊 MONITORING MULTI-NODE

### PM2 Monitoring
```bash
# View all nodes
pm2 list

# Monitor all nodes
pm2 monit

# Logs from all instances
pm2 logs

# CPU/Memory per node
pm2 status
```

### Kubernetes Monitoring
```bash
# View all pods
kubectl get pods -n production

# Resource usage
kubectl top pods -n production

# Logs from specific pod
kubectl logs [POD-NAME] -n production

# Logs from all pods
kubectl logs -f deployment/backend -n production

# Dashboard
kubectl proxy
# Visit http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Metrics Collection
```bash
# Prometheus scrapes từ tất cả nodes
# Grafana dashboard shows:
- Total requests across all nodes
- CPU/Memory per node
- Error rate per node
- Response time distribution
- Node health status
```

---

## 🔐 IMPORTANT CONSIDERATIONS

### 1. WebSocket Connections
**Problem**: WebSocket cần sticky sessions

**Solution**:
```nginx
# NGINX config
upstream backend {
    ip_hash;  # Sticky sessions cho WebSocket
    server node1:3005;
    server node2:3005;
    server node3:3005;
}
```

**Or**: Use Redis Adapter (recommended)
```bash
npm install @socket.io/redis-adapter
```

### 2. Rate Limiting
**Problem**: Rate limit per node không accurate

**Solution**: Use Redis-based rate limiting
```typescript
// Already configured in ThrottlerModule
// Uses Redis to share rate limit across nodes
```

### 3. File Uploads
**Problem**: Files chỉ lưu trên 1 node

**Solution**: ✅ Đã dùng MinIO/S3 (shared storage)

### 4. Scheduled Jobs
**Problem**: Cron jobs chạy trên tất cả nodes

**Solution**: Use distributed lock (Redis)
```typescript
// Before running cron
const lock = await redis.set('cron:job1', 'locked', 'EX', 60, 'NX');
if (lock) {
  // Run job
  await job();
  await redis.del('cron:job1');
}
```

---

## 🎯 RECOMMENDED SETUP

### For Development/Staging:
```bash
# PM2 cluster mode
pm2 start ecosystem.config.js -i 4
```

### For Small Production (< 10,000 users):
```bash
# Docker Compose
docker-compose up --scale backend=5 -d
```

### For Medium Production (10,000 - 100,000 users):
```bash
# Kubernetes với 3-10 nodes
kubectl apply -f k8s/
```

### For Large Production (> 100,000 users):
```bash
# Kubernetes multi-region
# Auto-scaling 10-50 nodes
# Load balancer per region
# CDN for static assets
```

---

## 📊 SCALING GUIDELINES

| Users | Nodes | CPU/Node | Memory/Node | Database |
|-------|-------|----------|-------------|----------|
| < 1,000 | 1-2 | 1 core | 512MB | Single |
| 1,000 - 10,000 | 2-5 | 2 cores | 1GB | Single |
| 10,000 - 50,000 | 5-10 | 2 cores | 2GB | Replica |
| 50,000 - 100,000 | 10-20 | 4 cores | 4GB | Cluster |
| > 100,000 | 20-50+ | 4+ cores | 8GB+ | Sharded |

---

## 🚀 QUICK START MULTI-NODE

### Option 1: PM2 (Fastest - 2 phút)
```bash
# Install PM2
npm install -g pm2

# Create config (file đã tạo ở trên)
nano ecosystem.config.js

# Build
npm run build

# Start cluster
pm2 start ecosystem.config.js

# Check
pm2 status
# Sẽ thấy 4-8 nodes đang chạy (depending on CPU cores)
```

### Option 2: Docker Compose (5 phút)
```bash
# Build
docker-compose build

# Start 5 nodes
docker-compose up --scale backend=5 -d

# Check
docker-compose ps
# Sẽ thấy 5 backend containers
```

### Option 3: Kubernetes (10 phút)
```bash
# Assumes you have K8s cluster
kubectl apply -f k8s/

# Check
kubectl get pods
# Sẽ thấy 3 pods (min), auto-scale đến 10
```

---

## 💡 BEST PRACTICES

### 1. Health Checks
```yaml
# Already configured in deployment.yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3005
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3005
```

### 2. Graceful Shutdown
```typescript
// Already implemented in ServerApplication.ts
process.on('SIGTERM', async () => {
  await app.close();
  process.exit(0);
});
```

### 3. Connection Pooling
```typescript
// Already configured in InfrastructureModule.ts
// Database connection pool shared across requests
```

### 4. Distributed Caching
```typescript
// Already using Redis
// Cache shared across all nodes
```

---

## 🎯 TESTING MULTI-NODE

### Test Load Balancing
```bash
# Send requests và check which node responds
for i in {1..100}; do
  curl -H "X-Request-ID: req-$i" http://localhost/health
done

# Check logs to see requests distributed
pm2 logs
```

### Load Testing
```bash
# Apache Bench
ab -n 10000 -c 100 http://localhost:3005/api/properties

# k6
k6 run --vus 100 --duration 30s load-test.js

# Artillery
artillery quick --count 100 --num 1000 http://localhost:3005/api/properties
```

---

## 📈 EXPECTED PERFORMANCE

### Single Node:
- **Throughput**: 1,000 req/s
- **Response Time**: 50-100ms (p95)
- **Max Users**: 10,000 concurrent

### 5 Nodes:
- **Throughput**: 5,000 req/s
- **Response Time**: 50-100ms (p95)
- **Max Users**: 50,000 concurrent

### 10 Nodes (with HPA):
- **Throughput**: 10,000+ req/s
- **Response Time**: 50-100ms (p95)
- **Max Users**: 100,000+ concurrent

---

## 🎊 TẠO PM2 CONFIG NGAY!

Tôi sẽ tạo file PM2 config cho bạn:

