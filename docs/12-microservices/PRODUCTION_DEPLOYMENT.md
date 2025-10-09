# 🚀 MICROSERVICES - PRODUCTION DEPLOYMENT GUIDE

## 📅 Version: 1.0 | October 9, 2025

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Docker Compose (Quick Start) ⚡
**Best for:** Development, Small deployments  
**Complexity:** Low  
**Time:** 30 minutes

### Option 2: Kubernetes (Production) 🏆
**Best for:** Production, High availability  
**Complexity:** Medium  
**Time:** 2-4 hours

### Option 3: Cloud Services (AWS/GCP) ☁️
**Best for:** Enterprise, Auto-scaling  
**Complexity:** High  
**Time:** 1 day

---

## 🐳 OPTION 1: DOCKER COMPOSE DEPLOYMENT

### Prerequisites:
```bash
- Docker 24.0+
- Docker Compose 2.20+
- 8GB RAM minimum
- 50GB disk space
```

### Step 1: Clone & Setup
```bash
# Clone repository
git clone https://github.com/your-repo/trungtamtrochoi-backend.git
cd trungtamtrochoi-backend

# Create environment file
cp .env.example .env
# Edit .env with production values
```

### Step 2: Configure Services
```bash
# Update secrets in docker-compose.microservices.production.yml
# CHANGE THESE:
- JWT_SECRET=...
- POSTGRES_PASSWORD=...
- RABBITMQ_USER/PASS=...
```

### Step 3: Build Services
```bash
# Build all Docker images
docker-compose -f docker-compose.microservices.production.yml build

# This will build:
- api-gateway
- dating-service
- auth-service
- property-service
- postgres, redis, rabbitmq
```

### Step 4: Run Migrations
```bash
# Start database first
docker-compose -f docker-compose.microservices.production.yml up -d postgres

# Wait for postgres to be ready
sleep 10

# Run migrations for each service
docker exec dating-service npm run migration:run
docker exec auth-service npm run migration:run
docker exec property-service npm run migration:run
```

### Step 5: Start All Services
```bash
# Start all services
docker-compose -f docker-compose.microservices.production.yml up -d

# Verify all running
docker ps

# Should see:
- api-gateway (port 3000)
- dating-service (port 3001)
- auth-service (port 3007)
- postgres
- redis
- rabbitmq
```

### Step 6: Verify Health
```bash
# Check API Gateway
curl http://localhost:3000/health

# Check Dating Service
curl http://localhost:3001/health

# Check Auth Service
curl http://localhost:3007/health

# Expected: All return {"status": "healthy"}
```

### Step 7: Test APIs
```bash
# Access Swagger
open http://localhost:3000/api/docs

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# Test dating API (with token)
curl http://localhost:3000/api/dating/discover \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Monitoring:
```bash
# View logs
docker-compose -f docker-compose.microservices.production.yml logs -f

# View specific service
docker logs dating-service -f

# RabbitMQ Management
open http://localhost:15672  # admin/admin
```

---

## ☸️ OPTION 2: KUBERNETES DEPLOYMENT

### Prerequisites:
```bash
- Kubernetes cluster (GKE, EKS, AKS, or local Minikube)
- kubectl installed
- Helm 3.0+ (optional)
- Docker Hub or private registry
```

### Step 1: Build & Push Images
```bash
# Build images
docker build -t your-registry/dating-service:latest services/dating-service
docker build -t your-registry/auth-service:latest services/auth-service
docker build -t your-registry/api-gateway:latest api-gateway

# Push to registry
docker push your-registry/dating-service:latest
docker push your-registry/auth-service:latest
docker push your-registry/api-gateway:latest
```

### Step 2: Create Namespace
```bash
kubectl create namespace trungtamtrochoi
kubectl config set-context --current --namespace=trungtamtrochoi
```

### Step 3: Deploy Secrets
```bash
# Update k8s/microservices/secrets.yaml with real values
# Then apply
kubectl apply -f k8s/microservices/secrets.yaml
```

### Step 4: Deploy Infrastructure
```bash
# PostgreSQL
kubectl apply -f k8s/microservices/postgres-statefulset.yaml

# Redis
kubectl apply -f k8s/microservices/redis-deployment.yaml

# RabbitMQ
kubectl apply -f k8s/microservices/rabbitmq-deployment.yaml

# Wait for infrastructure
kubectl get pods -w
```

### Step 5: Deploy Services
```bash
# Auth Service (must be first)
kubectl apply -f k8s/microservices/auth-service-deployment.yaml

# Wait for Auth to be ready
kubectl wait --for=condition=ready pod -l app=auth-service --timeout=300s

# Dating Service
kubectl apply -f k8s/microservices/dating-service-deployment.yaml

# API Gateway
kubectl apply -f k8s/microservices/api-gateway-deployment.yaml
```

### Step 6: Deploy Ingress
```bash
# Setup ingress controller (if not exists)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# Deploy ingress
kubectl apply -f k8s/microservices/ingress.yaml
```

### Step 7: Setup Auto-scaling
```bash
# Deploy HPA (Horizontal Pod Autoscaler)
kubectl apply -f k8s/microservices/hpa.yaml

# Verify HPA
kubectl get hpa
```

### Step 8: Verify Deployment
```bash
# Check all pods
kubectl get pods

# Check services
kubectl get svc

# Check ingress
kubectl get ingress

# Check logs
kubectl logs -l app=dating-service -f
```

### Step 9: Access Services
```bash
# Get external IP
kubectl get ingress microservices-ingress

# Access via domain
curl https://api.trungtamtrochoi.com/health

# Or port-forward for testing
kubectl port-forward svc/api-gateway 3000:3000
curl http://localhost:3000/health
```

---

## ☁️ OPTION 3: CLOUD DEPLOYMENT (AWS/GCP/Azure)

### AWS (ECS + Fargate):
```bash
# 1. Create ECS cluster
aws ecs create-cluster --cluster-name trungtamtrochoi-cluster

# 2. Create task definitions
aws ecs register-task-definition --cli-input-json file://aws/dating-task.json

# 3. Create services
aws ecs create-service --cluster trungtamtrochoi-cluster \
  --service-name dating-service \
  --task-definition dating-service:1 \
  --desired-count 3
```

### GCP (Cloud Run):
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/dating-service

# Deploy
gcloud run deploy dating-service \
  --image gcr.io/PROJECT_ID/dating-service \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

---

## 🔍 VERIFICATION CHECKLIST

### Infrastructure:
- [ ] PostgreSQL running & accessible
- [ ] Redis running
- [ ] RabbitMQ running
- [ ] Network connectivity between services

### Services:
- [ ] Auth Service healthy
- [ ] Dating Service healthy
- [ ] API Gateway healthy
- [ ] All services registered

### APIs:
- [ ] Can login through Gateway
- [ ] Can access Dating APIs
- [ ] gRPC calls working
- [ ] Events publishing

### Performance:
- [ ] Response time < 200ms
- [ ] No errors in logs
- [ ] Database connections stable
- [ ] Memory usage normal

---

## 📊 MONITORING & LOGGING

### Prometheus + Grafana:
```bash
# Install Prometheus
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Install Grafana
helm install grafana grafana/grafana

# Add Dashboards
- CPU/Memory per service
- Request rate
- Error rate
- Response time (p50, p95, p99)
```

### Centralized Logging (ELK):
```bash
# Deploy Elasticsearch
kubectl apply -f k8s/monitoring/elasticsearch.yaml

# Deploy Logstash
kubectl apply -f k8s/monitoring/logstash.yaml

# Deploy Kibana
kubectl apply -f k8s/monitoring/kibana.yaml
```

---

## 🚨 TROUBLESHOOTING

### Service Won't Start:
```bash
# Check logs
docker logs dating-service
# or
kubectl logs -l app=dating-service

# Common issues:
- Database connection failed → Check DB_HOST
- Port already in use → Change PORT
- Out of memory → Increase resources
```

### gRPC Connection Failed:
```bash
# Test gRPC endpoint
grpcurl -plaintext localhost:50051 list

# Check service discovery
nslookup auth-service  # Should resolve

# Verify firewall rules
```

### Database Migration Failed:
```bash
# Run manually
docker exec -it dating-service bash
npm run migration:run

# Check migration status
npm run migration:show
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Change all default passwords
- [ ] Use secrets management (Kubernetes Secrets/AWS Secrets Manager)
- [ ] Enable HTTPS/TLS
- [ ] Setup firewall rules
- [ ] Enable rate limiting
- [ ] Setup API authentication
- [ ] Regular security updates
- [ ] Backup database daily

---

## 💰 COST ESTIMATION

### Docker Compose (Small VPS):
```
1 VPS (8GB RAM, 4 CPU): $40/month
Total: ~$40/month
```

### Kubernetes (Managed):
```
3 Worker Nodes (4GB each): $120/month
Load Balancer: $30/month
Managed Database (PostgreSQL): $100/month
Redis: $30/month
Total: ~$280/month
```

### Cloud Run (GCP):
```
Dating Service (high traffic): $150/month
Other services: $100/month
Database: $100/month
Total: ~$350/month
```

---

## 📈 SCALING GUIDE

### Vertical Scaling (More Resources):
```bash
# Docker Compose
# Edit docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '2.0'      # Increased
      memory: 2G       # Increased
```

### Horizontal Scaling (More Instances):
```bash
# Kubernetes
kubectl scale deployment dating-service --replicas=10

# Or use HPA (auto-scaling)
kubectl apply -f k8s/microservices/hpa.yaml
```

---

## 🎯 PRODUCTION CHECKLIST

### Before Go-Live:
- [ ] All services deployed
- [ ] Migrations run successfully
- [ ] Health checks passing
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Monitoring setup
- [ ] Backup configured
- [ ] DNS configured
- [ ] SSL certificates installed
- [ ] Documentation updated

### Go-Live:
- [ ] Point domain to API Gateway
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Have rollback plan ready
- [ ] Team on standby

### Post-Launch:
- [ ] Monitor metrics 24/7
- [ ] Scale as needed
- [ ] Optimize performance
- [ ] Collect feedback

---

## 🎊 SUCCESS!

**Microservices deployed and operational!**

**Access:**
- API Gateway: https://api.trungtamtrochoi.com
- Dating Service: https://api.trungtamtrochoi.com/api/dating
- Swagger: https://api.trungtamtrochoi.com/api/docs

---

**🚀 Production Deployment Complete! 🎊**

