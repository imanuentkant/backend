# 🔄 MICROSERVICES MIGRATION GUIDE

## 📅 Guide Version: 1.0 | October 9, 2025

---

## 🎯 OVERVIEW

**Mục tiêu:** Chuyển từ Monolith → Microservices architecture

**Thời gian ước tính:** 5 weeks  
**Độ khó:** ⭐⭐⭐⭐ (Advanced)  
**Risk Level:** Medium (có rollback plan)

---

## 📊 MIGRATION STRATEGY

### Approach: **Strangler Fig Pattern**

Thay vì rewrite toàn bộ, chúng ta sẽ:
1. ✅ Tạo services mới song song với monolith
2. ✅ Route traffic từ từ sang services mới
3. ✅ Test kỹ từng service
4. ✅ Decommission monolith sau cùng

**Benefits:**
- Zero downtime
- Gradual migration
- Easy rollback
- Lower risk

---

## 🗓️ MIGRATION TIMELINE

### Week 1: Foundation 🏗️
- [x] Design architecture
- [ ] Create folder structure
- [ ] Setup shared libraries
- [ ] Create proto definitions
- [ ] Setup development environment

### Week 2: Extract Auth + Dating 💘
- [ ] Extract Auth Service (Day 1-2)
- [ ] Extract Dating Service (Day 3-5)
- [ ] Test independently
- [ ] Setup gRPC communication

### Week 3: Extract Property + Vehicle 🏠🚗
- [ ] Extract Property Service (Day 1-3)
- [ ] Extract Vehicle Service (Day 4-5)
- [ ] Integration testing

### Week 4: Shared Services + Gateway 🔧
- [ ] Extract Message Service
- [ ] Extract Payment Service
- [ ] Setup API Gateway
- [ ] Configure routing

### Week 5: Production 🚀
- [ ] Load testing
- [ ] Security audit
- [ ] Deployment
- [ ] Monitoring setup
- [ ] Go live!

---

## 📁 STEP-BY-STEP EXTRACTION

### STEP 1: Extract Dating Service

#### 1.1 Copy Dating Code
```bash
# Copy domain entities
cp -r src/core/domain/dating/ services/dating-service/src/core/domain/

# Copy use cases
cp -r src/core/service/dating/ services/dating-service/src/core/service/

# Copy infrastructure
cp -r src/infrastructure/adapter/persistence/typeorm/entity/dating/ \
      services/dating-service/src/infrastructure/adapter/persistence/typeorm/entity/

cp -r src/infrastructure/adapter/persistence/typeorm/repository/*Dating* \
      services/dating-service/src/infrastructure/adapter/persistence/typeorm/repository/

cp -r src/infrastructure/adapter/persistence/typeorm/mapper/*Dating* \
      services/dating-service/src/infrastructure/adapter/persistence/typeorm/mapper/

# Copy migrations
cp src/infrastructure/adapter/persistence/typeorm/migration/*Dating* \
   services/dating-service/src/infrastructure/migration/

# Copy controller
cp src/application/api/http-rest/controller/DatingController.ts \
   services/dating-service/src/application/controller/

# Copy module
cp src/application/di/DatingModule.ts \
   services/dating-service/src/application/di/
```

#### 1.2 Update Imports
```typescript
// OLD (monolith):
import { Entity } from '@core/common/entity/Entity';

// NEW (service):
import { Entity } from '@shared/common/entity/Entity';
// OR copy common code vào service
```

#### 1.3 Add gRPC Clients
```typescript
// services/dating-service/src/infrastructure/adapter/grpc/AuthGrpcClient.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { join } from 'path';

interface AuthService {
  validateToken(data: { token: string }): Promise<any>;
  getUserById(data: { userId: string }): Promise<any>;
}

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../../../shared/proto/auth.proto'),
      url: `${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}`,
    },
  })
  private client: ClientGrpc;

  private authService: AuthService;

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async validateToken(token: string) {
    return this.authService.validateToken({ token });
  }

  async getUserById(userId: string) {
    return this.authService.getUserById({ userId });
  }
}
```

#### 1.4 Update DatingModule
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthGrpcClient } from '@infrastructure/adapter/grpc/AuthGrpcClient';
import { PaymentGrpcClient } from '@infrastructure/adapter/grpc/PaymentGrpcClient';
import { MessageGrpcClient } from '@infrastructure/adapter/grpc/MessageGrpcClient';

// Import all dating entities, repositories, use cases
// ... (copy từ monolith)

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      database: 'dating_db',
      // ...
    }),
    TypeOrmModule.forFeature([
      // All dating TypeORM entities
    ]),
  ],
  controllers: [DatingController],
  providers: [
    // Repositories
    // Use Cases
    // gRPC Clients
    AuthGrpcClient,
    PaymentGrpcClient,
    MessageGrpcClient,
  ],
})
export class DatingModule {}
```

#### 1.5 Create Dating main.ts
```typescript
// Already created in services/dating-service/src/main.ts
```

#### 1.6 Test Dating Service
```bash
cd services/dating-service
npm install
npm run start:dev

# Should start on port 3001
# Test: http://localhost:3001/api/docs
```

---

### STEP 2: Extract Auth Service

#### 2.1 Copy Auth Code
```bash
# Copy auth domain
cp -r src/core/domain/user/ services/auth-service/src/core/domain/

# Copy auth use cases
cp -r src/core/service/user/ services/auth-service/src/core/service/

# Copy infrastructure
cp -r src/infrastructure/adapter/persistence/typeorm/entity/user/ \
      services/auth-service/src/infrastructure/entity/

# Copy auth module
cp src/application/di/AuthModule.ts \
   services/auth-service/src/application/di/

# Copy auth controller
cp src/application/api/http-rest/controller/AuthController.ts \
   services/auth-service/src/application/controller/
```

#### 2.2 Add gRPC Server
```typescript
// services/auth-service/src/application/grpc/AuthGrpcController.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthGrpcController {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService,
  ) {}

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: { token: string }) {
    try {
      const payload = this.jwtService.verify(data.token);
      const user = await this.getUserService.execute({ userId: payload.id });
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: true,
        createdAt: user.createdAt.toISOString(),
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  @GrpcMethod('AuthService', 'GetUserById')
  async getUserById(data: { userId: string }) {
    const user = await this.getUserService.execute({ userId: data.userId });
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: true,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
```

#### 2.3 Update Auth main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './application/di/AuthModule';
import { join } from 'path';

async function bootstrap() {
  // HTTP Server
  const app = await NestFactory.create(AuthModule);
  await app.listen(3007);

  // gRPC Server
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../../shared/proto/auth.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  await grpcApp.listen();

  console.log('Auth Service: HTTP on 3007, gRPC on 50051');
}

bootstrap();
```

---

### STEP 3: Setup API Gateway

#### 3.1 Create Gateway
```bash
cd api-gateway
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install http-proxy-middleware
```

#### 3.2 Create Gateway main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayModule } from './src/GatewayModule';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  // Route to services
  app.use('/api/dating', createProxyMiddleware({
    target: process.env.DATING_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/dating': '/dating' },
  }));

  app.use('/api/properties', createProxyMiddleware({
    target: process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
  }));

  app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3007',
    changeOrigin: true,
  }));

  await app.listen(3000);
  console.log('API Gateway running on port 3000');
}

bootstrap();
```

---

### STEP 4: Database Migration

#### Option A: Shared Database (Easier)
```sql
-- Keep all tables in one database
-- Use schemas for separation
CREATE SCHEMA dating;
CREATE SCHEMA property;
CREATE SCHEMA vehicle;

-- Move tables
ALTER TABLE dating_profiles SET SCHEMA dating;
ALTER TABLE properties SET SCHEMA property;
-- etc...
```

#### Option B: Separate Databases (True Microservices)
```bash
# Create databases
createdb dating_db
createdb property_db
createdb vehicle_db
createdb auth_db
createdb message_db
createdb payment_db

# Migrate data
pg_dump -t dating_* main_db | psql dating_db
pg_dump -t property_* main_db | psql property_db
# etc...
```

---

### STEP 5: Testing Migration

#### 5.1 Start All Services
```bash
# Using docker-compose
docker-compose -f docker-compose.microservices.yml up -d

# Verify all services running
docker ps
```

#### 5.2 Test Each Service
```bash
# Auth Service
curl http://localhost:3007/health

# Dating Service
curl http://localhost:3001/health

# Property Service
curl http://localhost:3002/health
```

#### 5.3 Test Through Gateway
```bash
# Should route to Dating Service
curl http://localhost:3000/api/dating/discover

# Should route to Auth Service
curl http://localhost:3000/api/auth/login
```

---

## ⚠️ COMMON ISSUES

### Issue 1: Port Conflicts
```bash
# Solution: Check ports
netstat -an | findstr "3001"

# Kill process
npx kill-port 3001
```

### Issue 2: Database Connection Failed
```bash
# Solution: Verify PostgreSQL running
docker ps | findstr postgres

# Check connection
psql -h localhost -U postgres -d dating_db
```

### Issue 3: gRPC Connection Failed
```bash
# Solution: Verify service URLs
echo $AUTH_SERVICE_HOST
echo $AUTH_SERVICE_PORT

# Test gRPC endpoint
grpcurl -plaintext localhost:50051 list
```

---

## 🎯 ROLLBACK PLAN

### If Migration Fails:

#### Quick Rollback:
```bash
# Stop microservices
docker-compose -f docker-compose.microservices.yml down

# Start monolith
docker-compose up -d

# Restore database (if needed)
psql main_db < backup.sql
```

#### Database Rollback:
```sql
-- Merge databases back
pg_dump dating_db | psql main_db
pg_dump property_db | psql main_db
-- etc...
```

---

## ✅ SUCCESS CRITERIA

### Per Service:
- [ ] Service starts successfully
- [ ] Health endpoint responds
- [ ] Database connected
- [ ] All APIs working
- [ ] Tests passing

### Integration:
- [ ] gRPC calls work
- [ ] API Gateway routes correctly
- [ ] Events publish/subscribe
- [ ] End-to-end flows work

### Performance:
- [ ] Response time < 200ms
- [ ] No errors in logs
- [ ] Database queries optimized
- [ ] Memory usage normal

---

## 📊 MONITORING

### Health Checks:
```yaml
# docker-compose.microservices.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 3s
  retries: 3
```

### Logging:
```typescript
// Centralized logging
import { Logger } from '@nestjs/common';

const logger = new Logger('DatingService');
logger.log('Service started');
logger.error('Error occurred', error);
```

### Metrics:
- Prometheus for metrics
- Grafana for dashboards
- Alert on errors

---

## 🎊 POST-MIGRATION

### Cleanup:
1. Remove dating code from monolith
2. Update documentation
3. Archive old code
4. Celebrate! 🎉

### Optimization:
1. Add caching (Redis)
2. Optimize queries
3. Add load balancing
4. Setup auto-scaling

---

**🔄 Migration Guide Complete! Ready to migrate! 🚀**

