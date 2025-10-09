# 🚀 DEPLOYMENT & OPERATIONS

## 📊 Overview

**Production deployment guides & operational docs**

---

## 📁 FILES (10 documents)

### Essential Guides:
1. **DEPLOYMENT_GUIDE.md** - Complete deployment
2. **RUNBOOK.md** - Operations manual
3. **PRODUCTION_ASSESSMENT.md** - Readiness check

### Process Management:
4. **PM2_QUICK_START.md** - PM2 setup

### Scaling:
5. **MULTI_NODE_SCALING_GUIDE.md** - Scale horizontally

### Database:
6. **MIGRATIONS_GUIDE.md** - DB migrations
7. **SHARED_DATABASE_SETUP.md** - DB setup
8. **UUID_V7_MIGRATION_GUIDE.md** - UUID migration

### Storage & Git:
9. **STORAGE_SWITCHING_GUIDE.md** - Storage options
10. **GIT_PUSH_GUIDE.md** - Git workflow

---

## 🚀 QUICK DEPLOY

```bash
# 1. Build
npm run build

# 2. Migrations
npm run typeorm migration:run

# 3. Start
pm2 start ecosystem.config.js

# 4. Monitor
pm2 monit
```

---

**See DEPLOYMENT_GUIDE.md for complete instructions**

