# 📝 CODE EXTRACTION SCRIPTS

## 🎯 Automated Scripts để Extract Code

---

## 🚀 DATING SERVICE EXTRACTION

### Script: extract-dating-service.sh

```bash
#!/bin/bash

echo "🚀 Extracting Dating Service..."

SERVICE_DIR="services/dating-service/src"

# Create directories
mkdir -p $SERVICE_DIR/core/domain/dating
mkdir -p $SERVICE_DIR/core/service/dating
mkdir -p $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/entity/dating
mkdir -p $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository
mkdir -p $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper
mkdir -p $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/migration
mkdir -p $SERVICE_DIR/infrastructure/adapter/grpc
mkdir -p $SERVICE_DIR/application/controller
mkdir -p $SERVICE_DIR/application/di

echo "✅ Directories created"

# Copy domain entities
echo "📦 Copying domain entities..."
cp -r src/core/domain/dating/* $SERVICE_DIR/core/domain/dating/

# Copy service use cases
echo "📦 Copying use cases..."
cp -r src/core/service/dating/* $SERVICE_DIR/core/service/dating/

# Copy TypeORM entities
echo "📦 Copying TypeORM entities..."
cp -r src/infrastructure/adapter/persistence/typeorm/entity/dating/* \
      $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/entity/dating/

# Copy repositories
echo "📦 Copying repositories..."
cp src/infrastructure/adapter/persistence/typeorm/repository/DatingProfileRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/SwipeRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/MatchRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/DateProposalRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/BlockedUserRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/UserReportRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/DatingSettingsRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/ProfileViewRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/BoostRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

cp src/infrastructure/adapter/persistence/typeorm/repository/SubscriptionRepositoryAdapter.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/

# Copy mappers
echo "📦 Copying mappers..."
cp src/infrastructure/adapter/persistence/typeorm/mapper/DatingProfileMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/SwipeMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/MatchMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/DateProposalMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/BlockedUserMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/UserReportMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/DatingSettingsMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/ProfileViewMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/BoostMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

cp src/infrastructure/adapter/persistence/typeorm/mapper/SubscriptionMapper.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/

# Copy migrations
echo "📦 Copying migrations..."
cp src/infrastructure/adapter/persistence/typeorm/migration/*Block* \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/migration/ 2>/dev/null || true

cp src/infrastructure/adapter/persistence/typeorm/migration/*Dating* \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/migration/ 2>/dev/null || true

# Copy controller
echo "📦 Copying controller..."
cp src/application/api/http-rest/controller/DatingController.ts \
   $SERVICE_DIR/application/controller/

# Copy module
echo "📦 Copying module..."
cp src/application/di/DatingModule.ts \
   $SERVICE_DIR/application/di/

# Copy common code
echo "📦 Copying common code..."
mkdir -p $SERVICE_DIR/core/common
cp -r src/core/common/* $SERVICE_DIR/core/common/

echo "✅ Dating Service extraction complete!"
echo "📁 Files copied to: $SERVICE_DIR"
echo ""
echo "Next steps:"
echo "1. cd services/dating-service"
echo "2. npm install"
echo "3. Update imports to use @shared/*"
echo "4. npm run start:dev"
```

**Save as:** `scripts/extract-dating-service.sh`

---

## 🏠 PROPERTY SERVICE EXTRACTION

### Script: extract-property-service.sh

```bash
#!/bin/bash

echo "🏠 Extracting Property Service..."

SERVICE_DIR="services/property-service/src"

# Create directories
mkdir -p $SERVICE_DIR/core/domain/{property,booking}
mkdir -p $SERVICE_DIR/core/service/{property,booking}
mkdir -p $SERVICE_DIR/infrastructure
mkdir -p $SERVICE_DIR/application

# Copy property domain
cp -r src/core/domain/property/* $SERVICE_DIR/core/domain/property/
cp -r src/core/domain/booking/* $SERVICE_DIR/core/domain/booking/

# Copy property services
cp -r src/core/service/property/* $SERVICE_DIR/core/service/property/
cp -r src/core/service/booking/* $SERVICE_DIR/core/service/booking/

# Copy controllers
cp src/application/api/http-rest/controller/PropertyController.ts \
   $SERVICE_DIR/application/controller/

cp src/application/api/http-rest/controller/BookingController.ts \
   $SERVICE_DIR/application/controller/

# Copy modules
cp src/application/di/PropertyModule.ts $SERVICE_DIR/application/di/
cp src/application/di/BookingModule.ts $SERVICE_DIR/application/di/

echo "✅ Property Service extraction complete!"
```

---

## 🚗 VEHICLE SERVICE EXTRACTION

### Script: extract-vehicle-service.sh

```bash
#!/bin/bash

echo "🚗 Extracting Vehicle Service..."

SERVICE_DIR="services/vehicle-service/src"

# Create directories
mkdir -p $SERVICE_DIR/core/domain/vehicle
mkdir -p $SERVICE_DIR/core/service/vehicle
mkdir -p $SERVICE_DIR/infrastructure
mkdir -p $SERVICE_DIR/application

# Copy vehicle domain
cp -r src/core/domain/vehicle/* $SERVICE_DIR/core/domain/vehicle/

# Copy vehicle services
cp -r src/core/service/vehicle/* $SERVICE_DIR/core/service/vehicle/

# Copy controller
cp src/application/api/http-rest/controller/VehicleController.ts \
   $SERVICE_DIR/application/controller/

# Copy module
cp src/application/di/VehicleModule.ts $SERVICE_DIR/application/di/

echo "✅ Vehicle Service extraction complete!"
```

---

## 🎯 QUICK EXTRACTION (All Services)

### Master Script: extract-all-services.sh

```bash
#!/bin/bash

echo "🚀 Extracting ALL Services..."

# Run individual extraction scripts
./scripts/extract-dating-service.sh
./scripts/extract-property-service.sh
./scripts/extract-vehicle-service.sh
./scripts/extract-auth-service.sh
./scripts/extract-message-service.sh
./scripts/extract-payment-service.sh

echo ""
echo "✅ All services extracted!"
echo ""
echo "Next steps:"
echo "1. Update imports in each service"
echo "2. Install dependencies: cd services/[service] && npm install"
echo "3. Test each service independently"
echo "4. Run docker-compose -f docker-compose.microservices.yml up"
```

---

## 🔧 POST-EXTRACTION TASKS

### 1. Update Imports
```typescript
// Find and replace in each service
// OLD:
import { Entity } from '@core/common/entity/Entity';
import { UseCase } from '@core/common/usecase/UseCase';

// NEW:
import { Entity } from '@shared/common/entity/Entity';
import { UseCase } from '@shared/common/usecase/UseCase';
```

### 2. Remove Dependencies on Other Domains
```typescript
// BAD (coupling):
import { User } from '@core/domain/user/entity/User';

// GOOD (via gRPC):
const user = await authClient.getUserById(userId);
```

### 3. Setup gRPC Clients
```typescript
// Add to each service's module
providers: [
  AuthGrpcClient,
  MessageGrpcClient,
  PaymentGrpcClient,
]
```

---

## 📊 VERIFICATION

### After Extraction:
```bash
# 1. Build each service
cd services/dating-service && npm run build
cd services/property-service && npm run build
cd services/vehicle-service && npm run build

# 2. Run tests
cd services/dating-service && npm test

# 3. Start services
docker-compose -f docker-compose.microservices.yml up

# 4. Test APIs through gateway
curl http://localhost:3000/api/dating/discover
```

---

## 🎊 EXTRACTION COMPLETE CHECKLIST

- [ ] Dating Service extracted
- [ ] Property Service extracted
- [ ] Vehicle Service extracted
- [ ] Auth Service extracted
- [ ] Message Service extracted
- [ ] Payment Service extracted
- [ ] All imports updated
- [ ] gRPC clients setup
- [ ] Docker images built
- [ ] Services start successfully
- [ ] APIs working through gateway
- [ ] Tests passing

---

**🔧 Ready to extract! Run scripts and migrate! 🚀**

