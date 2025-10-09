# RUNBOOK - XỬ LÝ SỰ CỐ VÀ VẬN HÀNH

## 🚨 COMMON INCIDENTS & SOLUTIONS

### 1. API KHÔNG PHẢN HỒI / TIMEOUT

#### Triệu chứng:
- Health check endpoint không phản hồi
- 504 Gateway Timeout errors
- Load balancer báo unhealthy instances

#### Nguyên nhân có thể:
- Application crashed
- Database connection pool exhausted
- Memory leak
- CPU spike

#### Cách xử lý:

**Bước 1: Kiểm tra application status**
```bash
# Kubernetes
kubectl get pods -l app=backend
kubectl describe pod [POD_NAME]
kubectl logs [POD_NAME] --tail=100

# Docker
docker ps | grep backend
docker logs backend --tail=100
```

**Bước 2: Kiểm tra resources**
```bash
# Kubernetes
kubectl top pod [POD_NAME]

# Docker
docker stats backend
```

**Bước 3: Quick fix**
```bash
# Restart pod (Kubernetes)
kubectl delete pod [POD_NAME]

# Restart container (Docker)
docker restart backend
```

**Bước 4: Investigate**
- Check logs cho error messages
- Check database connections
- Check memory usage
- Check slow queries

---

### 2. DATABASE CONNECTION ERRORS

#### Triệu chứng:
- "Connection pool exhausted"
- "Too many connections"
- "Connection timeout"

#### Nguyên nhân:
- Connection leak
- Too many concurrent requests
- Database overloaded
- Network issues

#### Cách xử lý:

**Bước 1: Kiểm tra database**
```sql
-- PostgreSQL
SELECT count(*) FROM pg_stat_activity;
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Kill hanging queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE state = 'idle in transaction' AND query_start < NOW() - INTERVAL '5 minutes';
```

**Bước 2: Tăng connection pool (temporary)**
```bash
# Update environment variable
DB_POOL_SIZE=30  # Increase from 20
```

**Bước 3: Restart application**
```bash
kubectl rollout restart deployment/backend
```

**Bước 4: Monitor**
- Watch connection count
- Check for connection leaks in code
- Review slow queries

---

### 3. HIGH MEMORY USAGE / MEMORY LEAK

#### Triệu chứng:
- Memory usage tăng liên tục
- OOMKilled errors
- Application restart frequently

#### Cách xử lý:

**Bước 1: Identify memory leak**
```bash
# Get heap snapshot
curl http://localhost:3005/debug/heapdump > heapdump.heapsnapshot

# Analyze with Chrome DevTools
```

**Bước 2: Check for common causes**
- Large objects not being garbage collected
- Event listeners not removed
- Caching without limits
- Circular references

**Bước 3: Quick mitigation**
```bash
# Increase memory limit (temporary)
kubectl set resources deployment backend --limits=memory=1Gi

# Enable automatic restart on high memory
```

**Bước 4: Long-term fix**
- Fix memory leak in code
- Implement proper cache eviction
- Review large object usage
- Add memory profiling

---

### 4. HIGH CPU USAGE

#### Triệu chứng:
- CPU usage > 80%
- Slow response times
- Requests queuing up

#### Cách xử lý:

**Bước 1: Identify cause**
```bash
# Check CPU usage
kubectl top pods

# Get CPU profile
curl http://localhost:3005/debug/cpuprofile > cpu.prof
```

**Bước 2: Common causes**
- Inefficient queries (N+1 problem)
- Heavy computation in request handler
- Synchronous operations blocking event loop
- Regex performance issues

**Bước 3: Quick fix**
```bash
# Scale horizontally
kubectl scale deployment backend --replicas=10
```

**Bước 4: Optimize**
- Add indexes to database
- Move heavy computation to background jobs
- Implement caching
- Optimize algorithms

---

### 5. REDIS CONNECTION ISSUES

#### Triệu chứng:
- Cache miss rate 100%
- Redis connection errors in logs
- Slow response times

#### Cách xử lý:

**Bước 1: Check Redis**
```bash
# Kubernetes
kubectl exec -it redis-pod -- redis-cli ping

# Docker
docker exec redis redis-cli ping

# Check memory
redis-cli info memory
```

**Bước 2: Common issues**
- Redis out of memory
- Network connectivity
- Redis maxclients reached

**Bước 3: Fix**
```bash
# Flush cache if needed
redis-cli FLUSHDB

# Increase maxmemory
redis-cli CONFIG SET maxmemory 2gb

# Check and kill long-running commands
redis-cli CLIENT LIST
```

---

### 6. DATABASE SLOW QUERIES

#### Triệu chứng:
- API response time > 2s
- Database CPU high
- Slow query log entries

#### Cách xử lý:

**Bước 1: Identify slow queries**
```sql
-- PostgreSQL
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

**Bước 2: Analyze query plan**
```sql
EXPLAIN ANALYZE [YOUR_SLOW_QUERY];
```

**Bước 3: Quick fixes**
- Kill long-running query: `SELECT pg_terminate_backend(pid);`
- Add missing index
- Rewrite query to be more efficient

**Bước 4: Long-term**
- Add proper indexes
- Optimize query
- Implement pagination
- Add caching layer

---

### 7. DEPLOYMENT FAILURES

#### Triệu chứng:
- New pods not starting
- ImagePullBackOff
- CrashLoopBackOff

#### Cách xử lý:

**Bước 1: Check deployment status**
```bash
kubectl get deployment backend
kubectl describe deployment backend
kubectl get pods -l app=backend
```

**Bước 2: Check pod events**
```bash
kubectl describe pod [POD_NAME]
kubectl logs [POD_NAME] --previous
```

**Bước 3: Common issues & fixes**

**ImagePullBackOff:**
```bash
# Check image exists
docker pull [IMAGE_NAME]

# Check credentials
kubectl get secret regcred
```

**CrashLoopBackOff:**
```bash
# Check application logs
kubectl logs [POD_NAME]

# Check configuration
kubectl get configmap backend-config -o yaml
kubectl get secret backend-secrets -o yaml
```

**Bước 4: Rollback if needed**
```bash
kubectl rollout undo deployment/backend
kubectl rollout status deployment/backend
```

---

### 8. RATE LIMITING ISSUES

#### Triệu chứng:
- Users getting 429 Too Many Requests
- Legitimate traffic being blocked

#### Cách xử lý:

**Bước 1: Check rate limit config**
```bash
# Current settings
echo $RATE_LIMIT_TTL  # Should be 60
echo $RATE_LIMIT_MAX  # Should be 100
```

**Bước 2: Temporary increase**
```bash
# Update config
kubectl set env deployment/backend RATE_LIMIT_MAX=200
```

**Bước 3: Check for abuse**
```bash
# Check top IPs
kubectl logs -l app=backend | grep "429" | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

**Bước 4: Block abusive IPs**
```bash
# Add to WAF or load balancer
# Or update rate limit per IP
```

---

### 9. DISK SPACE FULL

#### Triệu chứng:
- "No space left on device"
- Logs not writing
- Database write failures

#### Cách xử lý:

**Bước 1: Check disk usage**
```bash
# Kubernetes node
kubectl get nodes
kubectl describe node [NODE_NAME]
df -h

# Docker
docker system df
```

**Bước 2: Clean up**
```bash
# Docker
docker system prune -a
docker volume prune

# Logs
find /var/log -type f -name "*.log" -mtime +7 -delete

# Kubernetes
kubectl delete pods --field-selector=status.phase=Failed
```

**Bước 3: Prevent**
- Setup log rotation
- Implement log retention policy
- Monitor disk usage
- Alert on > 80% usage

---

### 10. SSL/TLS CERTIFICATE EXPIRING

#### Triệu chứng:
- Certificate expiration warnings
- SSL errors in browser
- API calls failing with SSL error

#### Cách xử lý:

**Bước 1: Check certificate expiry**
```bash
# Check domain
echo | openssl s_client -servername api.yourdomain.com -connect api.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Check certificate file
openssl x509 -in /path/to/cert.pem -noout -dates
```

**Bước 2: Renew certificate**
```bash
# Let's Encrypt
certbot renew

# AWS Certificate Manager
# Auto-renews, check status in console

# Manual renewal
# Get new certificate from CA
# Update load balancer/ingress
```

**Bước 3: Update**
```bash
# Kubernetes ingress
kubectl create secret tls backend-tls \
  --cert=tls.crt \
  --key=tls.key \
  --dry-run=client -o yaml | kubectl apply -f -
```

---

## 🔧 ROUTINE MAINTENANCE TASKS

### Daily Checks
```bash
#!/bin/bash
# daily-check.sh

echo "=== Health Check ==="
curl https://api.yourdomain.com/health

echo "\n=== Pod Status ==="
kubectl get pods -l app=backend

echo "\n=== Error Rate (last hour) ==="
kubectl logs -l app=backend --since=1h | grep -i error | wc -l

echo "\n=== Database Connections ==="
psql -c "SELECT count(*) FROM pg_stat_activity;"

echo "\n=== Redis Memory ==="
redis-cli info memory | grep used_memory_human

echo "\n=== Backup Status ==="
aws s3 ls s3://backups/database/ --recursive | tail -1
```

### Weekly Tasks
- Review monitoring dashboards
- Check slow query logs
- Update dependencies (if safe)
- Review error logs
- Check disk usage trends

### Monthly Tasks
- Security updates
- Performance review
- Cost optimization
- Disaster recovery test
- Update documentation

---

## 📊 MONITORING QUERIES

### Check API Performance
```bash
# Average response time (last hour)
kubectl logs -l app=backend --since=1h | grep "SpentTime" | awk '{print $NF}' | sed 's/ms//' | awk '{sum+=$1; count++} END {print sum/count "ms"}'
```

### Check Error Rate
```bash
# Error percentage (last hour)
TOTAL=$(kubectl logs -l app=backend --since=1h | wc -l)
ERRORS=$(kubectl logs -l app=backend --since=1h | grep -i error | wc -l)
echo "scale=2; $ERRORS * 100 / $TOTAL" | bc
```

### Check Resource Usage
```bash
# Top memory consumers
kubectl top pods --sort-by=memory | head -10

# Top CPU consumers
kubectl top pods --sort-by=cpu | head -10
```

---

## 🆘 EMERGENCY CONTACTS

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| SEV1 (Service Down) | On-call Engineer | < 15 min |
| Database Issues | DBA Team | < 30 min |
| Infrastructure | DevOps Team | < 30 min |
| Security Incident | Security Team | Immediate |
| Application Bug | Backend Team Lead | < 1 hour |

---

## 📱 ESCALATION PROCEDURE

1. **Level 1**: On-call engineer attempts to resolve (30 min)
2. **Level 2**: Escalate to team lead (60 min)
3. **Level 3**: Escalate to CTO/VP Engineering (90 min)
4. **Level 4**: Executive team notification (Critical only)

---

## 🔍 DEBUGGING TIPS

### Enable Debug Logging
```bash
# Temporarily enable debug logs
kubectl set env deployment/backend LOG_LEVEL=debug

# Revert after debugging
kubectl set env deployment/backend LOG_LEVEL=info
```

### Get Thread Dump
```bash
# Node.js
kill -USR1 [PID]
# Check logs for thread dump
```

### Profile Application
```bash
# CPU profiling
node --prof dist/Main.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

---

**Lưu ý**: Update runbook này khi có incident mới hoặc giải pháp mới.

