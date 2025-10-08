# HƯỚNG DẪN DEPLOY LÊN PRODUCTION

## 📋 CHECKLIST TRƯỚC KHI DEPLOY

### 1. Security
- [ ] Đã remove tất cả hardcoded secrets
- [ ] Setup secrets manager (AWS Secrets Manager, HashiCorp Vault)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Setup WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Configure security groups properly
- [ ] Setup VPN/bastion host cho database access

### 2. Infrastructure
- [ ] Database có backup strategy
- [ ] Redis có persistence enabled
- [ ] Setup load balancer
- [ ] Configure auto-scaling
- [ ] Setup CDN cho static assets
- [ ] Database có replication (master-slave)
- [ ] Multi-AZ deployment

### 3. Monitoring
- [ ] Setup APM (DataDog, New Relic)
- [ ] Configure log aggregation (ELK, Loki)
- [ ] Setup alerting (PagerDuty, OpsGenie)
- [ ] Create dashboards
- [ ] Configure health checks
- [ ] Setup uptime monitoring

### 4. CI/CD
- [ ] Setup CI/CD pipeline
- [ ] Configure automated testing
- [ ] Setup deployment strategy (blue-green/canary)
- [ ] Configure rollback procedure
- [ ] Setup deployment notifications

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: AWS Deployment

#### Architecture:
```
Internet → CloudFront (CDN) → ALB → ECS/EKS → RDS
                                  ↓
                            ElastiCache (Redis)
                                  ↓
                            DocumentDB (MongoDB)
```

#### Steps:

1. **Setup RDS (PostgreSQL)**
```bash
# Via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier production-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username admin \
  --master-user-password [FROM_SECRETS_MANAGER] \
  --allocated-storage 100 \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted
```

2. **Setup ElastiCache (Redis)**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id production-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 1 \
  --auto-minor-version-upgrade
```

3. **Build & Push Docker Image**
```bash
# Build
docker build -f Dockerfile.production -t backend:latest .

# Tag
docker tag backend:latest [ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/backend:latest

# Push to ECR
aws ecr get-login-password --region [REGION] | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com
docker push [ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/backend:latest
```

4. **Deploy to ECS**
```bash
# Update ECS service
aws ecs update-service \
  --cluster production-cluster \
  --service backend-service \
  --force-new-deployment
```

---

### Option 2: Kubernetes Deployment

#### 1. Create ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
data:
  NODE_ENV: "production"
  API_HOST: "0.0.0.0"
  API_PORT: "3005"
  RATE_LIMIT_TTL: "60"
  RATE_LIMIT_MAX: "100"
```

#### 2. Create Secrets
```bash
# Create secret từ file
kubectl create secret generic backend-secrets \
  --from-literal=DB_PASSWORD=<password> \
  --from-literal=API_ACCESS_TOKEN_SECRET=<secret> \
  --from-literal=API_REFRESH_TOKEN_SECRET=<secret>
```

#### 3. Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/backend:latest
        ports:
        - containerPort: 3005
        envFrom:
        - configMapRef:
            name: backend-config
        - secretRef:
            name: backend-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3005
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3005
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 4. Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3005
```

#### 5. Apply
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

### Option 3: Docker Compose (Smaller Scale)

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  backend:
    image: your-registry/backend:latest
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
    env_file:
      - env/production.env
    depends_on:
      - postgres
      - redis
      - mongo
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  postgres:
    image: postgres:15-alpine
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: always

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: always

volumes:
  pg_data:
  redis_data:
  mongo_data:
```

---

## 🔧 POST-DEPLOYMENT

### 1. Verify Deployment
```bash
# Check health
curl https://api.yourdomain.com/health

# Check readiness
curl https://api.yourdomain.com/health/ready

# Check metrics
curl https://api.yourdomain.com/metrics
```

### 2. Setup Monitoring Alerts

#### DataDog Alert Example:
- API response time > 1s
- Error rate > 1%
- Memory usage > 80%
- CPU usage > 80%
- Database connections > 80% of pool

### 3. Load Testing
```bash
# Using Apache Bench
ab -n 10000 -c 100 https://api.yourdomain.com/health/live

# Using k6
k6 run load-test.js
```

### 4. Database Migrations
```bash
# Run migrations
npm run migration:run

# Verify
npm run migration:show
```

### 5. Setup Backup Verification
```bash
# Test restore from backup
# Verify backup schedule is working
```

---

## 🔄 ROLLBACK PROCEDURE

### AWS ECS:
```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster production-cluster \
  --service backend-service \
  --task-definition backend:[PREVIOUS_VERSION]
```

### Kubernetes:
```bash
# Rollback to previous revision
kubectl rollout undo deployment/backend

# Check rollout status
kubectl rollout status deployment/backend
```

### Docker Compose:
```bash
# Pull previous version
docker pull your-registry/backend:[PREVIOUS_TAG]

# Update and restart
docker-compose up -d
```

---

## 📊 MONITORING DASHBOARDS

### Key Metrics to Monitor:

1. **Application Metrics**
   - Request rate (requests/second)
   - Response time (p50, p95, p99)
   - Error rate (%)
   - Active connections

2. **Infrastructure Metrics**
   - CPU usage (%)
   - Memory usage (%)
   - Disk usage (%)
   - Network I/O

3. **Database Metrics**
   - Query response time
   - Connection pool usage
   - Slow queries
   - Replication lag

4. **Cache Metrics**
   - Hit rate (%)
   - Miss rate (%)
   - Memory usage
   - Eviction rate

---

## 🚨 INCIDENT RESPONSE

### Severity Levels:

**SEV1 (Critical)** - Service down
- Alert: Immediately
- Response: < 15 minutes
- Example: API completely unavailable

**SEV2 (High)** - Major functionality impaired
- Alert: Within 30 minutes
- Response: < 1 hour
- Example: Database slow, affecting all users

**SEV3 (Medium)** - Minor functionality impaired
- Alert: Within 4 hours
- Response: < 4 hours
- Example: Non-critical feature not working

**SEV4 (Low)** - Cosmetic issues
- Alert: Within 24 hours
- Response: Next business day
- Example: Logging issues

### Response Process:
1. Acknowledge incident
2. Assess severity
3. Notify stakeholders
4. Investigate and fix
5. Post-mortem (for SEV1-2)

---

## 📝 MAINTENANCE

### Regular Tasks:

**Daily:**
- Check monitoring dashboards
- Review error logs
- Check backup status

**Weekly:**
- Review performance metrics
- Check security alerts
- Update dependencies (minor versions)

**Monthly:**
- Security audit
- Performance optimization review
- Capacity planning review
- Disaster recovery drill

**Quarterly:**
- Major dependency updates
- Security penetration testing
- Architecture review
- Cost optimization review

---

## 🔐 SECURITY BEST PRACTICES

1. **Secrets Management**
   - Never commit secrets to git
   - Use secrets manager (AWS Secrets Manager, Vault)
   - Rotate secrets regularly (90 days)

2. **Network Security**
   - Use private subnets for databases
   - Configure security groups properly
   - Enable VPN for admin access
   - Use WAF for DDoS protection

3. **Application Security**
   - Keep dependencies updated
   - Regular security audits
   - Enable rate limiting
   - Input validation
   - SQL injection protection

4. **Monitoring & Logging**
   - Centralized logging
   - Audit logging for sensitive operations
   - Real-time alerting
   - Regular log reviews

---

## 📞 SUPPORT CONTACTS

- **On-call Engineer**: [Phone/Slack]
- **DevOps Team**: [Email/Slack]
- **Database Admin**: [Email/Slack]
- **Security Team**: [Email/Slack]

---

## 📚 USEFUL COMMANDS

```bash
# View logs
kubectl logs -f deployment/backend
docker logs -f backend
aws logs tail /aws/ecs/backend --follow

# Check resource usage
kubectl top pods
docker stats

# Scale up/down
kubectl scale deployment backend --replicas=5
docker-compose up -d --scale backend=3

# Database backup
pg_dump -h [HOST] -U [USER] [DB_NAME] > backup.sql

# Redis backup
redis-cli --rdb dump.rdb
```

---

**Lưu ý**: Đây là hướng dẫn tổng quát. Cần customize based on specific infrastructure và requirements.

