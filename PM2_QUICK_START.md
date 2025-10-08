# 🚀 PM2 QUICK START - CHẠY NHIỀU NODES NGAY!

## ⚡ CÁCH NHANH NHẤT (2 phút)

### Bước 1: Install PM2
```bash
npm install -g pm2
```

### Bước 2: Build Application
```bash
npm run build
```

### Bước 3: Start Cluster
```bash
# Auto-detect CPU cores và chạy tương ứng số nodes
pm2 start ecosystem.config.js --env production

# Hoặc chỉ định số nodes (ví dụ: 4 nodes)
pm2 start ecosystem.config.js -i 4
```

### Bước 4: Check Status
```bash
pm2 status
```

**Output mẫu**:
```
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ airbnb-back… │ cluster │ 0       │ online  │ 15%      │
│ 1   │ airbnb-back… │ cluster │ 0       │ online  │ 12%      │
│ 2   │ airbnb-back… │ cluster │ 0       │ online  │ 18%      │
│ 3   │ airbnb-back… │ cluster │ 0       │ online  │ 14%      │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

**Bạn vừa có 4 nodes chạy song song!** 🎉

---

## 📊 PM2 COMMANDS

### Quản lý
```bash
# Start cluster
pm2 start ecosystem.config.js

# Stop all
pm2 stop all

# Restart all (zero-downtime)
pm2 reload all

# Delete all
pm2 delete all

# Logs
pm2 logs

# Monitor real-time
pm2 monit
```

### Scaling
```bash
# Scale to 8 nodes
pm2 scale airbnb-backend 8

# Scale down to 2 nodes
pm2 scale airbnb-backend 2

# Reset to max (CPU cores)
pm2 delete airbnb-backend
pm2 start ecosystem.config.js
```

### Monitoring
```bash
# Status overview
pm2 status

# Detailed info
pm2 info airbnb-backend

# CPU/Memory per node
pm2 monit

# Web dashboard (optional)
pm2 web
```

---

## 🎯 LOAD BALANCING

PM2 tự động load balance requests giữa các nodes:
- ✅ Round-robin distribution
- ✅ Auto-restart crashed nodes
- ✅ Zero-downtime reload
- ✅ Memory limit enforcement

---

## 💡 ADVANCED USAGE

### Zero-Downtime Deployment
```bash
# Update code
git pull
npm install
npm run build

# Reload (zero-downtime)
pm2 reload airbnb-backend

# PM2 sẽ:
# 1. Start new nodes
# 2. Wait for new nodes ready
# 3. Stop old nodes
# 4. No downtime!
```

### Auto-start on Reboot
```bash
# Generate startup script
pm2 startup

# Save current configuration
pm2 save

# PM2 sẽ tự động start khi server reboot
```

### Logs Management
```bash
# View logs
pm2 logs

# Flush logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

---

## 🔧 TROUBLESHOOTING

### Node không start
```bash
# Check logs
pm2 logs airbnb-backend --lines 50

# Check errors
pm2 logs airbnb-backend --err

# Restart specific node
pm2 restart airbnb-backend
```

### High Memory Usage
```bash
# Check memory
pm2 status

# Node sẽ tự động restart nếu > 1GB (configured)
# max_memory_restart: '1G'
```

### Node keeps crashing
```bash
# Check detailed logs
pm2 logs --lines 100

# Check if all dependencies installed
npm install

# Check if build successful
npm run build
```

---

## 📈 PERFORMANCE

### 1 Node:
- Handles ~1,000 req/s
- Good for development

### 4 Nodes (PM2 Cluster):
- Handles ~4,000 req/s
- Good for small-medium production

### Load Balancing Works:
```bash
# Test
ab -n 10000 -c 100 http://localhost:3005/health

# PM2 logs sẽ show requests distributed:
# Node 0: 2500 requests
# Node 1: 2500 requests  
# Node 2: 2500 requests
# Node 3: 2500 requests
```

---

## 🎊 SUMMARY

**PM2 = Cách đơn giản nhất để chạy nhiều nodes!**

### Ưu điểm:
- ✅ Cực kỳ đơn giản (3 commands)
- ✅ Auto load balancing
- ✅ Auto restart on crash
- ✅ Zero-downtime reload
- ✅ Built-in monitoring
- ✅ Production battle-tested

### Khi nào dùng:
- ✅ Single server với nhiều CPU cores
- ✅ Quick production deployment
- ✅ Cost-effective scaling
- ✅ Simple operations

### Khi nào không dùng:
- ❌ Cần scale across multiple servers → Use Kubernetes
- ❌ Need auto-scaling based on load → Use Kubernetes HPA
- ❌ Complex orchestration → Use Kubernetes

---

## 🚀 START NOW!

```bash
# 1. Install PM2
npm install -g pm2

# 2. Build
npm run build

# 3. Start cluster (file ecosystem.config.js đã có sẵn)
pm2 start ecosystem.config.js

# 4. Check
pm2 status

# 5. Monitor
pm2 monit
```

**DONE! Bạn đã có multi-node system! 🎉**

---

## 📞 PM2 Help

```bash
# Full command list
pm2 help

# PM2 documentation
https://pm2.keymetrics.io/docs/usage/quick-start/

# PM2 monitoring (cloud)
https://pm2.io/
```

**Hệ thống của bạn giờ có thể handle nhiều lần traffic hơn! 🚀**

