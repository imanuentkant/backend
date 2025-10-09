# 📁 PROJECT REORGANIZATION PLAN

## 🎯 Mục tiêu

Tổ chức lại toàn bộ thư mục dự án để:
- ✅ Dễ tìm kiếm
- ✅ Logic rõ ràng
- ✅ Professional structure
- ✅ Dễ maintain

---

## 📊 CURRENT STRUCTURE (Messy)

```
backend/
├── src/                          # Monolith code
├── services/                     # Microservices
├── api-gateway/                  # Gateway
├── shared/                       # Shared code
├── test/                         # Tests
├── docs/                         # Documentation
├── k8s/                          # Kubernetes configs
├── docker/                       # Docker scripts
├── client-frontend/              # Frontend
├── host-admin-frontend/          # Admin frontend
├── scripts/                      # Scripts
├── env/                          # Environment files
├── asset/                        # Assets
├── package.json                  # Root package
├── tsconfig.json                 # TypeScript config
├── docker-compose.yml            # Docker compose
├── docker-compose.test.yaml
├── docker-compose.microservices.yml
├── docker-compose.microservices.production.yml
├── Dockerfile.production
├── ecosystem.config.js           # PM2 config
├── jest.json                     # Jest config
├── eslint.config.mjs             # ESLint config
├── commitlint.config.cjs
├── ormconfig.json
├── nginx.conf
├── sonar-project.properties
├── start-all.bat
├── start-all.sh
├── push.sh
├── yarn.lock
├── package-lock.json
└── ... (many more files)
```

**Problems:**
- ❌ Too many files at root
- ❌ Configs scattered
- ❌ Hard to find specific files
- ❌ No clear separation

---

## 🎯 PROPOSED STRUCTURE (Clean)

```
backend/
│
├── apps/                         🎯 Applications
│   ├── monolith/                 # Current monolith app
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   ├── microservices/            # New microservices
│   │   ├── dating-service/
│   │   ├── auth-service/
│   │   ├── property-service/
│   │   ├── vehicle-service/
│   │   ├── message-service/
│   │   └── payment-service/
│   │
│   ├── api-gateway/              # API Gateway
│   │   └── ...
│   │
│   ├── frontends/                # Frontend apps
│   │   ├── client-app/
│   │   └── host-admin/
│   │
│   └── shared/                   # Shared libraries
│       ├── common/
│       └── proto/
│
├── infrastructure/               🔧 Infrastructure
│   ├── docker/
│   │   ├── postgres/
│   │   ├── nginx/
│   │   └── scripts/
│   │
│   ├── k8s/
│   │   ├── monolith/
│   │   ├── microservices/
│   │   └── shared/
│   │
│   ├── compose/                  # Docker compose files
│   │   ├── dev.yml
│   │   ├── test.yml
│   │   ├── monolith.yml
│   │   ├── microservices.yml
│   │   └── microservices.production.yml
│   │
│   └── nginx/
│       └── nginx.conf
│
├── config/                       ⚙️ Configurations
│   ├── env/
│   │   ├── .env.example
│   │   ├── development.env
│   │   ├── production.env
│   │   └── test.env
│   │
│   ├── jest.json
│   ├── tsconfig.base.json
│   ├── eslint.config.mjs
│   ├── commitlint.config.cjs
│   ├── ormconfig.json
│   └── sonar-project.properties
│
├── scripts/                      📝 Scripts
│   ├── extract-dating-service.sh
│   ├── extract-auth-service.sh
│   ├── start-all.sh
│   ├── seed.ts
│   └── ...
│
├── test/                         🧪 Tests
│   ├── dating/
│   ├── property/
│   └── .common/
│
├── docs/                         📚 Documentation
│   ├── 01-getting-started/
│   ├── 02-dating-system/
│   ├── ... (12 categories)
│   └── 12-microservices/
│
├── assets/                       🎨 Assets
│   └── ... (images, etc)
│
├── .github/                      🔧 GitHub
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── package.json                  📦 Root package (workspace)
├── README.md                     📖 Main README
├── LICENSE
├── .gitignore
└── .dockerignore
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy to find any file
- ✅ Professional structure
- ✅ Scalable organization

---

## 🔄 MIGRATION STEPS

### Step 1: Create New Structure
```bash
mkdir -p apps/{monolith,microservices,frontends}
mkdir -p infrastructure/{docker,k8s,compose,nginx}
mkdir -p config/env
```

### Step 2: Move Applications
```bash
# Move monolith
mv src apps/monolith/
mv package.json apps/monolith/
mv tsconfig.json apps/monolith/

# Move microservices
mv services/* apps/microservices/

# Move gateway
mv api-gateway apps/

# Move frontends
mv client-frontend apps/frontends/client-app
mv host-admin-frontend apps/frontends/host-admin

# Move shared
mv shared apps/
```

### Step 3: Move Infrastructure
```bash
# Docker
mv docker infrastructure/
mv Dockerfile.production infrastructure/docker/

# Kubernetes
mv k8s infrastructure/

# Docker-compose
mkdir infrastructure/compose
mv docker-compose*.yml infrastructure/compose/

# Nginx
mv nginx.conf infrastructure/nginx/
```

### Step 4: Move Configs
```bash
# Environment
mv env config/
mv *.env config/env/

# Config files
mv jest.json config/
mv eslint.config.mjs config/
mv commitlint.config.cjs config/
mv ormconfig.json config/
mv sonar-project.properties config/
mv ecosystem.config.js config/
```

### Step 5: Clean Up
```bash
# Move scripts
# (already in scripts/)

# Move tests
# (already in test/)

# Move docs
# (already in docs/)
```

---

## ✅ RESULT

Clean, organized, professional structure!

**Next:** Execute reorganization

