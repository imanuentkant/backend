# 🗄️ HƯỚNG DẪN THIẾT LẬP SHARED DATABASE

## 📊 TỔNG QUAN

Khi chạy nhiều nodes, **TẤT CẢ nodes phải kết nối đến CÙNG databases**:

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│Node 1│  │Node 2│  │Node 3│  │Node 4│
└───┬──┘  └───┬──┘  └───┬──┘  └───┬──┘
    │         │         │         │
    └────┬────┴────┬────┴────┬────┘
         │         │         │
    ┌────▼─────────▼─────────▼────┐
    │   PostgreSQL (Shared)        │
    │   - All application data     │
    └──────────────────────────────┘
    
    ┌────▼─────────▼─────────▼────┐
    │   Redis (Shared)             │
    │   - Cache, sessions, queues  │
    └──────────────────────────────┘
    
    ┌────▼─────────▼─────────▼────┐
    │   MongoDB (Shared)           │
    │   - Audit logs               │
    └──────────────────────────────┘
```

---

## 🎯 3 DATABASES CẦN SETUP

1. **PostgreSQL** - Primary database (properties, bookings, reviews, users)
2. **Redis** - Caching, sessions, message queues
3. **MongoDB** - Audit logs (optional)

---

## 1️⃣ POSTGRESQL - PRIMARY DATABASE

### Option A: Local Development (Docker)

#### docker-compose.yaml (Đã có sẵn)
```yaml
services:
  postgresql_local:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: iposter
      POSTGRES_PASSWORD: souQu6ienug0ash9eeY9
      POSTGRES_DB: iposter
    ports:
      - '5454:5432'  # Expose to all nodes
    volumes:
      - pg_data_local:/var/lib/postgresql/data
    networks:
      - iposter_network_local
    command:
      - "postgres"
      - "-c"
      - "max_connections=200"  # Increase for multi-node
      - "-c"
      - "shared_buffers=256MB"
```

#### Start PostgreSQL
```bash
# Start
docker-compose up -d postgresql_local

# Check
docker ps | grep postgres

# Test connection
psql -h localhost -p 5454 -U iposter -d iposter
```

#### Configure Application
```bash
# env/production.env
DB_HOST=localhost        # Hoặc IP server
DB_PORT=5454
DB_USERNAME=iposter
DB_PASSWORD=souQu6ienug0ash9eeY9
DB_NAME=iposter
DB_POOL_SIZE=20          # Connection pool per node
DB_POOL_TIMEOUT=30000
DB_SSL=false             # Set true in production
```

**Connection Pool**:
- Mỗi node: 20 connections
- 4 nodes: 80 connections total
- PostgreSQL max_connections phải > 100

---

### Option B: Production (Managed Database)

#### AWS RDS PostgreSQL
```bash
# 1. Create RDS instance via AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier airbnb-production-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password [STRONG_PASSWORD] \
  --allocated-storage 100 \
  --storage-type gp3 \
  --backup-retention-period 7 \
  --multi-az \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name production-subnet-group

# 2. Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier airbnb-production-db \
  --query 'DBInstances[0].Endpoint.Address'

# Output: airbnb-production-db.xxx.us-east-1.rds.amazonaws.com
```

#### Configure Application
```bash
# Production environment
DB_HOST=airbnb-production-db.xxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=[FROM_SECRETS_MANAGER]
DB_NAME=airbnb_production
DB_POOL_SIZE=20
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

**Features**:
- ✅ Auto backups (7 days)
- ✅ Multi-AZ (high availability)
- ✅ Auto scaling storage
- ✅ Monitoring (CloudWatch)
- ✅ Point-in-time recovery

**Cost**: ~$50-150/month

---

#### Google Cloud SQL
```bash
# Create instance
gcloud sql instances create airbnb-db \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=us-central1 \
  --backup \
  --availability-type=REGIONAL

# Get connection name
gcloud sql instances describe airbnb-db --format="value(connectionName)"

# Create database
gcloud sql databases create airbnb_production --instance=airbnb-db
```

**Cost**: ~$40-120/month

---

#### DigitalOcean Managed Database
```bash
# Via UI hoặc doctl
doctl databases create airbnb-db \
  --engine postgres \
  --region nyc1 \
  --size db-s-1vcpu-1gb \
  --version 15

# Get connection details
doctl databases connection airbnb-db
```

**Cost**: ~$15-60/month

---

### Option C: Self-Hosted (Own Server)

#### Setup PostgreSQL Server
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user và database
sudo -u postgres psql
CREATE USER iposter WITH PASSWORD 'your_password';
CREATE DATABASE iposter OWNER iposter;
GRANT ALL PRIVILEGES ON DATABASE iposter TO iposter;

# Configure for remote access
sudo nano /etc/postgresql/15/main/postgresql.conf
# Uncomment và edit:
listen_addresses = '*'
max_connections = 200

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Add:
host    all             all             0.0.0.0/0               md5

# Restart
sudo systemctl restart postgresql
```

#### Configure Application
```bash
DB_HOST=10.0.0.100    # IP của PostgreSQL server
DB_PORT=5432
DB_USERNAME=iposter
DB_PASSWORD=your_password
DB_NAME=iposter
DB_POOL_SIZE=20
```

---

## 2️⃣ REDIS - CACHING & QUEUES

### Option A: Local Development (Docker)

#### docker-compose.yaml (Đã có)
```yaml
services:
  redis_local:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass your_redis_password
    ports:
      - '6380:6379'  # Expose to all nodes
    volumes:
      - redis_data_local:/data
    networks:
      - iposter_network_local
```

#### Start Redis
```bash
# Start
docker-compose up -d redis_local

# Test connection
redis-cli -h localhost -p 6380 -a your_redis_password ping
# Response: PONG
```

#### Configure Application
```bash
# env/production.env
REDIS_URL=redis://:your_redis_password@localhost:6380
CACHE_TTL=3600
```

---

### Option B: Production (Managed Redis)

#### AWS ElastiCache
```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id airbnb-redis \
  --replication-group-description "Airbnb Redis Cluster" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled

# Get endpoint
aws elasticache describe-replication-groups \
  --replication-group-id airbnb-redis \
  --query 'ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.Address'
```

#### Configure Application
```bash
REDIS_URL=rediss://airbnb-redis.xxx.cache.amazonaws.com:6379
REDIS_PASSWORD=[FROM_SECRETS_MANAGER]
REDIS_TLS=true
```

**Features**:
- ✅ Auto failover
- ✅ Replication (master-slave)
- ✅ Encryption in transit
- ✅ Automatic backups

**Cost**: ~$50-200/month

---

#### Google Cloud Memorystore
```bash
gcloud redis instances create airbnb-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=standard
```

**Cost**: ~$40-150/month

---

### Option C: Self-Hosted Redis

#### Single Redis Server
```bash
# Install
sudo apt install redis-server

# Configure
sudo nano /etc/redis/redis.conf
# Edit:
bind 0.0.0.0
requirepass your_strong_password
maxmemory 2gb
maxmemory-policy allkeys-lru

# Restart
sudo systemctl restart redis
```

#### Redis Cluster (High Availability)
```bash
# Create 6 Redis nodes (3 master, 3 slave)
# On each server:
redis-server --port 7000 --cluster-enabled yes \
  --cluster-config-file nodes.conf \
  --cluster-node-timeout 5000 \
  --appendonly yes

# Create cluster
redis-cli --cluster create \
  10.0.0.1:7000 10.0.0.2:7000 10.0.0.3:7000 \
  10.0.0.4:7000 10.0.0.5:7000 10.0.0.6:7000 \
  --cluster-replicas 1
```

---

## 3️⃣ MONGODB - AUDIT LOGS

### Option A: Local Development (Docker)

#### docker-compose.yaml (Đã có)
```yaml
services:
  mongo_local:
    image: mongo:6
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your_mongo_password
    volumes:
      - mongo_data_local:/data/db
    networks:
      - iposter_network_local
```

#### Configure Application
```bash
MONGO_URI=mongodb://admin:your_mongo_password@localhost:27017
MONGO_DB=iposter_audit
```

---

### Option B: Production (MongoDB Atlas - Recommended)

#### MongoDB Atlas (Free tier available!)
```bash
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create cluster (M0 free tier hoặc M10+ for production)
# 3. Get connection string

# Example connection string:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/airbnb_audit?retryWrites=true&w=majority
```

#### Configure Application
```bash
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
MONGO_DB=airbnb_audit
MONGO_OPTIONS=retryWrites=true&w=majority
```

**Features**:
- ✅ Free tier (512MB)
- ✅ Auto backups
- ✅ Auto scaling
- ✅ Multi-region replication
- ✅ Monitoring dashboard

**Cost**: Free - $60/month

---

### Option C: AWS DocumentDB
```bash
aws docdb create-db-cluster \
  --db-cluster-identifier airbnb-audit \
  --engine docdb \
  --master-username admin \
  --master-user-password [PASSWORD]
```

---

## 🔧 CONNECTION POOLING

### PostgreSQL Connection Pool (Đã configured)

```typescript
// src/application/di/InfrastructureModule.ts
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    
    // Connection Pool Settings
    extra: {
      max: 20,                    // Max connections per node
      min: 5,                     // Min connections
      idleTimeoutMillis: 30000,   // Close idle connections after 30s
      connectionTimeoutMillis: 2000,
    },
    
    // SSL for production
    ssl: configService.get('DB_SSL') === 'true' ? {
      rejectUnauthorized: false
    } : false,
  })
})
```

### Tính toán Connection Pool:

```
Formula: Nodes × Pool Size < Database Max Connections

Example:
- 4 nodes × 20 connections = 80 connections
- Database max_connections = 200
- Safe margin: 200 - 80 = 120 connections available
```

### Recommended Pool Sizes:

| Nodes | Pool Size/Node | Total Connections | DB Max Connections |
|-------|----------------|-------------------|-------------------|
| 1 | 20 | 20 | 100 |
| 3 | 20 | 60 | 100 |
| 5 | 15 | 75 | 100 |
| 10 | 10 | 100 | 200 |
| 20 | 10 | 200 | 300 |

---

## 📋 COMPLETE SETUP GUIDE

### Scenario 1: Tất Cả Trên Docker (Development)

#### docker-compose.yaml (Enhanced)
```yaml
version: '3.8'

services:
  # PostgreSQL - Shared across all backend nodes
  postgres:
    image: postgres:15-alpine
    container_name: shared-postgres
    environment:
      POSTGRES_USER: iposter
      POSTGRES_PASSWORD: souQu6ienug0ash9eeY9
      POSTGRES_DB: iposter
    ports:
      - '5432:5432'  # Expose to host và other containers
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - app-network
    command:
      - "postgres"
      - "-c"
      - "max_connections=200"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "effective_cache_size=1GB"
      - "-c"
      - "work_mem=16MB"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U iposter"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis - Shared cache và queues
  redis:
    image: redis:7-alpine
    container_name: shared-redis
    command: redis-server --appendonly yes --requirepass redis_password --maxmemory 2gb --maxmemory-policy allkeys-lru
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # MongoDB - Shared audit logs
  mongo:
    image: mongo:6
    container_name: shared-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: mongo_password
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Node 1
  backend-1:
    build:
      context: .
      dockerfile: Dockerfile.production
    container_name: backend-node-1
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_URL=redis://:redis_password@redis:6379
      - MONGO_URI=mongodb://admin:mongo_password@mongo:27017
    depends_on:
      - postgres
      - redis
      - mongo
    networks:
      - app-network

  # Backend Node 2
  backend-2:
    build:
      context: .
      dockerfile: Dockerfile.production
    container_name: backend-node-2
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_URL=redis://:redis_password@redis:6379
      - MONGO_URI=mongodb://admin:mongo_password@mongo:27017
    depends_on:
      - postgres
      - redis
      - mongo
    networks:
      - app-network

  # Backend Node 3
  backend-3:
    build:
      context: .
      dockerfile: Dockerfile.production
    container_name: backend-node-3
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_URL=redis://:redis_password@redis:6379
      - MONGO_URI=mongodb://admin:mongo_password@mongo:27017
    depends_on:
      - postgres
      - redis
      - mongo
    networks:
      - app-network

  # NGINX Load Balancer
  nginx:
    image: nginx:alpine
    container_name: load-balancer
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend-1
      - backend-2
      - backend-3
    networks:
      - app-network

volumes:
  pg_data:
  redis_data:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

#### Start All
```bash
# Start tất cả services
docker-compose up -d

# Check
docker-compose ps

# Logs
docker-compose logs -f backend-1
docker-compose logs -f backend-2
docker-compose logs -f backend-3
```

---

### Scenario 2: PM2 Multi-Node + Shared Databases

#### Setup Databases (Separate Server)

**Server 1** (10.0.0.100) - Databases:
```bash
# PostgreSQL
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=iposter \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=iposter \
  -v pg_data:/var/lib/postgresql/data \
  postgres:15-alpine \
  -c max_connections=200

# Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --requirepass redis_password --maxmemory 2gb

# MongoDB
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=mongo_password \
  mongo:6
```

#### Configure Backend Nodes

**Server 2** (10.0.0.101) - Backend Node 1:
```bash
# env/production.env
DB_HOST=10.0.0.100
DB_PORT=5432
DB_USERNAME=iposter
DB_PASSWORD=password
DB_NAME=iposter
DB_POOL_SIZE=15

REDIS_URL=redis://:redis_password@10.0.0.100:6379

MONGO_URI=mongodb://admin:mongo_password@10.0.0.100:27017
MONGO_DB=iposter_audit

# Start với PM2
pm2 start ecosystem.config.js
```

**Server 3** (10.0.0.102) - Backend Node 2:
```bash
# Same env file
DB_HOST=10.0.0.100  # Point to same database server
# ... rest same

pm2 start ecosystem.config.js
```

**Server 4** (10.0.0.103) - Backend Node 3:
```bash
# Same env file
pm2 start ecosystem.config.js
```

---

### Scenario 3: Kubernetes + Managed Databases

#### Production Setup

**Databases**: Managed services (RDS, ElastiCache, DocumentDB)

**Application**: Kubernetes

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
data:
  DB_HOST: "airbnb-db.xxx.rds.amazonaws.com"
  DB_PORT: "5432"
  DB_NAME: "airbnb_production"
  DB_POOL_SIZE: "15"
  
  REDIS_HOST: "airbnb-redis.xxx.cache.amazonaws.com"
  REDIS_PORT: "6379"
  
  MONGO_DB: "airbnb_audit"

---
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
type: Opaque
stringData:
  DB_PASSWORD: "your_db_password"
  REDIS_PASSWORD: "your_redis_password"
  MONGO_URI: "mongodb://user:pass@cluster.mongodb.net"
```

#### Deploy
```bash
# Apply configs
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml

# Kubernetes sẽ:
# - Start 3 pods (min)
# - Tất cả connect đến cùng databases
# - Auto-scale lên 10 pods khi load cao
# - Load balance requests
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Network Security
```bash
# PostgreSQL
- Chỉ cho phép connections từ backend nodes
- Use private network/VPC
- Firewall rules

# Security Group (AWS example)
Inbound Rules:
- PostgreSQL (5432): Allow from backend security group
- Redis (6379): Allow from backend security group
- MongoDB (27017): Allow from backend security group
```

### 2. SSL/TLS Encryption
```bash
# PostgreSQL with SSL
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false  # Set true with proper certs

# Redis with TLS
REDIS_TLS=true

# MongoDB with TLS
MONGO_URI=mongodb+srv://...  # srv = TLS enabled
```

### 3. Connection Limits
```bash
# Per Node
DB_POOL_SIZE=15  # Conservative

# Total = Nodes × Pool Size
# 10 nodes × 15 = 150 connections
# Database should support 200+ connections
```

### 4. Credentials Management
```bash
# Use Secrets Manager
# AWS Secrets Manager
# HashiCorp Vault
# Kubernetes Secrets

# Never commit credentials to git!
```

---

## 📊 MONITORING SHARED DATABASES

### PostgreSQL Monitoring
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Connections per node/application
SELECT application_name, count(*) 
FROM pg_stat_activity 
GROUP BY application_name;

-- Long running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- Database size
SELECT pg_size_pretty(pg_database_size('iposter'));

-- Table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Redis Monitoring
```bash
# Info
redis-cli info

# Memory usage
redis-cli info memory

# Connected clients
redis-cli client list

# Monitor commands in real-time
redis-cli monitor

# Stats
redis-cli info stats
```

### MongoDB Monitoring
```javascript
// In mongosh
db.serverStatus()
db.stats()

// Current operations
db.currentOp()

// Connection stats
db.serverStatus().connections
```

---

## 🔄 HIGH AVAILABILITY SETUP

### PostgreSQL Master-Slave Replication

#### Master (Write)
```bash
# postgresql.conf
wal_level = replica
max_wal_senders = 3
```

#### Slave (Read - for read queries)
```bash
# Setup replication
pg_basebackup -h master-ip -D /var/lib/postgresql/data -U replicator -P -v

# standby.signal
touch standby.signal

# Configure application
DB_MASTER=master-ip  # For writes
DB_SLAVE=slave-ip    # For reads
```

### Redis Sentinel (Auto Failover)
```bash
# Setup Redis Sentinel for automatic failover
# 3 Redis servers: 1 master, 2 slaves
# 3 Sentinel instances

redis-sentinel sentinel.conf
```

### MongoDB Replica Set
```bash
# Already configured in MongoDB Atlas
# Or self-hosted:
mongod --replSet rs0

# Initialize
mongosh --eval 'rs.initiate()'
mongosh --eval 'rs.add("mongodb2:27017")'
mongosh --eval 'rs.add("mongodb3:27017")'
```

---

## 🔧 CONFIGURATION EXAMPLES

### Environment Variables (All Nodes Same)

```bash
# env/production.env - SHARED CONFIG FOR ALL NODES

# PostgreSQL (Shared)
DB_HOST=postgres.internal.com
DB_PORT=5432
DB_USERNAME=iposter
DB_PASSWORD=[FROM_VAULT]
DB_NAME=airbnb_production
DB_POOL_SIZE=15
DB_SSL=true

# Redis (Shared)
REDIS_URL=redis://:password@redis.internal.com:6379
REDIS_TLS=false
CACHE_TTL=3600

# MongoDB (Shared)
MONGO_URI=mongodb://admin:password@mongo.internal.com:27017
MONGO_DB=airbnb_audit

# Application
NODE_ENV=production
API_PORT=3005

# Stripe
STRIPE_API_KEY=[FROM_VAULT]

# SendGrid
SENDGRID_API_KEY=[FROM_VAULT]
```

### Docker Compose với External Databases
```yaml
# docker-compose-app-only.yaml
version: '3.8'

services:
  backend:
    image: airbnb-backend:latest
    deploy:
      replicas: 5
    environment:
      # Point to external databases
      - DB_HOST=10.0.0.100
      - DB_PORT=5432
      - REDIS_URL=redis://10.0.0.100:6379
      - MONGO_URI=mongodb://10.0.0.100:27017
    env_file:
      - env/production.env
```

---

## 🧪 TESTING SHARED DATABASE

### Test Connection từ Multiple Nodes

#### Node 1:
```bash
psql -h shared-db.com -U iposter -d iposter -c "INSERT INTO test (value) VALUES ('node1')"
```

#### Node 2:
```bash
psql -h shared-db.com -U iposter -d iposter -c "INSERT INTO test (value) VALUES ('node2')"
```

#### Verify:
```bash
psql -h shared-db.com -U iposter -d iposter -c "SELECT * FROM test"
# Should see both inserts
```

### Test Cache Sharing (Redis)

#### Node 1:
```bash
redis-cli -h shared-redis.com SET test:key "value-from-node1"
```

#### Node 2:
```bash
redis-cli -h shared-redis.com GET test:key
# Should return: "value-from-node1"
```

**Cache is shared! ✅**

---

## 📊 PERFORMANCE TUNING

### PostgreSQL Optimization
```bash
# postgresql.conf
shared_buffers = 256MB           # 25% of RAM
effective_cache_size = 1GB       # 50-75% of RAM
work_mem = 16MB                  # Per operation
maintenance_work_mem = 128MB
max_connections = 200
checkpoint_completion_target = 0.9

# Enable query logging (for optimization)
log_min_duration_statement = 1000  # Log queries > 1s
```

### Redis Optimization
```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru    # Evict least recently used
appendonly yes                  # Persistence
save 900 1                      # Save after 900s if 1 key changed
save 300 10                     # Save after 300s if 10 keys changed
save 60 10000                   # Save after 60s if 10000 keys changed
```

### MongoDB Optimization
```bash
# mongod.conf
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1

net:
  maxIncomingConnections: 200
```

---

## 🔄 BACKUP STRATEGY

### PostgreSQL Backups

#### Automated Daily Backups
```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="airbnb_backup_$DATE.sql.gz"

# Backup
pg_dump -h postgres-host -U iposter iposter | gzip > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

#### Cron Job
```bash
# Add to crontab
0 2 * * * /usr/local/bin/backup-postgres.sh
```

#### AWS RDS (Auto Backups)
- ✅ Automatic daily backups
- ✅ 7-35 days retention
- ✅ Point-in-time recovery
- ✅ Snapshots

### Redis Backups
```bash
# Redis auto-saves to dump.rdb
# Backup RDB file
cp /var/lib/redis/dump.rdb /backups/redis/dump_$(date +%Y%m%d).rdb

# Or use BGSAVE command
redis-cli BGSAVE
```

### MongoDB Backups
```bash
# Dump database
mongodump --uri="mongodb://admin:password@mongo:27017" --out=/backups/mongo/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://admin:password@mongo:27017" /backups/mongo/20251008
```

---

## ⚡ QUICK START COMMANDS

### Local Development (Docker)
```bash
# Start shared databases
docker-compose up -d postgres redis mongo

# Start backend nodes (PM2 cluster)
npm run build
pm2 start ecosystem.config.js

# Or Docker scaling
docker-compose up --scale backend=5 -d
```

### Production (Managed Databases)
```bash
# 1. Create RDS PostgreSQL (via AWS Console)
# 2. Create ElastiCache Redis (via AWS Console)
# 3. Create MongoDB Atlas (via mongodb.com)

# 4. Update env/production.env với endpoints

# 5. Deploy với Kubernetes
kubectl apply -f k8s/
```

---

## 🎯 CONNECTION STRING EXAMPLES

### PostgreSQL
```bash
# Local
postgresql://iposter:password@localhost:5432/iposter

# RDS
postgresql://admin:password@airbnb-db.xxx.rds.amazonaws.com:5432/airbnb

# With SSL
postgresql://admin:password@host:5432/db?sslmode=require

# Connection Pool
postgresql://user:pass@host:5432/db?max=20&min=5
```

### Redis
```bash
# Local
redis://localhost:6379

# With password
redis://:password@localhost:6379

# ElastiCache (with TLS)
rediss://:password@redis.cache.amazonaws.com:6379

# Cluster mode
redis://node1:7000,node2:7000,node3:7000
```

### MongoDB
```bash
# Local
mongodb://localhost:27017/airbnb_audit

# With auth
mongodb://admin:password@localhost:27017/airbnb_audit

# Atlas (cloud)
mongodb+srv://user:pass@cluster0.mongodb.net/airbnb_audit

# Replica set
mongodb://host1:27017,host2:27017,host3:27017/db?replicaSet=rs0
```

---

## 🔍 TROUBLESHOOTING

### Problem: "Too many connections"

**PostgreSQL**:
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND query_start < NOW() - INTERVAL '5 minutes';
```

**Solution**:
- Reduce DB_POOL_SIZE per node
- Increase max_connections in PostgreSQL
- Use connection pooler (PgBouncer)

### Problem: "Redis out of memory"

```bash
# Check memory
redis-cli INFO memory

# Flush if needed (careful!)
redis-cli FLUSHDB

# Or increase maxmemory
redis-cli CONFIG SET maxmemory 4gb
```

### Problem: "Connection timeout"

**Causes**:
- Firewall blocking
- Network issue
- Database not ready
- Wrong credentials

**Debug**:
```bash
# Test network
telnet db-host 5432

# Test PostgreSQL
psql -h db-host -U user -d db

# Test Redis
redis-cli -h redis-host ping

# Check application logs
pm2 logs
kubectl logs pod-name
```

---

## 📈 SCALING RECOMMENDATIONS

### Start Small:
```
1 PostgreSQL instance (db.t3.small)
1 Redis instance (cache.t3.micro)
1 MongoDB (M0 free tier)
3 Backend nodes
```

### Medium Scale (10k-50k users):
```
1 PostgreSQL (db.t3.medium) + 1 read replica
1 Redis cluster (2 nodes)
1 MongoDB (M10)
5-10 Backend nodes
```

### Large Scale (100k+ users):
```
PostgreSQL cluster (master + 2-3 read replicas)
Redis cluster (3-6 nodes)
MongoDB Atlas (M30+)
10-50 Backend nodes
Multi-region deployment
```

---

## 🎊 SUMMARY

### Shared Database = Requirement cho Multi-Node

**Tất cả nodes PHẢI share:**
- ✅ PostgreSQL - Application data
- ✅ Redis - Cache & queues
- ✅ MongoDB - Audit logs

**Setup Options:**
1. **Docker** (Development) - Đơn giản nhất
2. **Managed Services** (Production) - Recommended
3. **Self-hosted** (Cost-effective) - Requires expertise

**Your System**:
- ✅ Already configured for shared databases
- ✅ Connection pooling implemented
- ✅ Health checks ready
- ✅ SSL support ready
- ✅ Works with any setup option

---

## 🚀 START NOW!

### Development:
```bash
docker-compose up -d
pm2 start ecosystem.config.js
```

### Production:
```bash
# Setup managed databases
# Deploy với Kubernetes
kubectl apply -f k8s/
```

**DONE! Multi-node với shared databases! 🎉**

---

**System sẵn sàng scale đến millions of users!** 🚀

