# 🏗️ MICROSERVICES ARCHITECTURE - MASTER PLAN

## 📅 Planning Date: October 9, 2025

---

## 🎯 OVERVIEW

### Current State: **MONOLITH**
- 1 NestJS application
- 1 shared PostgreSQL database
- All modules in single codebase
- 100+ APIs in one service

### Target State: **MICROSERVICES**
- 6+ independent services
- Database per service
- API Gateway
- Inter-service communication
- Independently deployable

---

## 📊 CURRENT MODULES ANALYSIS

### Existing Modules (từ .RootModule.ts):
1. ✅ **AuthModule** - Authentication & JWT
2. ✅ **UserModule** - User management
3. ✅ **MediaModule** - File upload/management
4. ✅ **PostModule** - Social posts
5. ✅ **CommentModule** - Comments
6. ✅ **AlbumModule** - Albums
7. ✅ **AirbnbModule** - Property booking
8. ✅ **DatingModule** - Dating system (24 APIs)
9. ✅ **InfrastructureModule** - Shared infrastructure
10. ✅ **SecurityModule** - Security
11. ✅ **StorageModule** - File storage (MinIO/S3)

### Additional Modules (found in codebase):
12. ✅ **BookingModule** - Booking management
13. ✅ **PropertyModule** - Property CRUD
14. ✅ **VehicleModule** - Vehicle rental
15. ✅ **MessageModule** - Messaging system
16. ✅ **ConversationModule** - Conversations
17. ✅ **PaymentModule** - Payment processing

---

## 🎯 MICROSERVICES DESIGN

### Proposed Services (6 Main + 3 Shared):

#### 1️⃣ **Dating Service** 🔥
**Port:** 3001  
**Database:** `dating_db`

**Responsibilities:**
- Dating profiles (CRUD)
- Swipe system
- Match system
- Date proposals
- Block & Report
- Premium subscriptions
- Boost feature
- Profile analytics

**APIs:** 24 endpoints
**Tables:** 10 tables (dating_profiles, swipes, matches, etc)

**Dependencies:**
- Auth Service (JWT validation)
- Message Service (conversations)
- Payment Service (subscriptions)

---

#### 2️⃣ **Property Service** 🏠
**Port:** 3002  
**Database:** `property_db`

**Responsibilities:**
- Property management (CRUD)
- Property listings
- Availability calendar
- Pricing management
- Host dashboard
- Property search
- Reviews & ratings

**APIs:** 30+ endpoints
**Tables:** 15+ tables (properties, bookings, reviews, etc)

**Dependencies:**
- Auth Service
- Booking Service
- Payment Service
- Storage Service (photos)

---

#### 3️⃣ **Vehicle Service** 🚗
**Port:** 3003  
**Database:** `vehicle_db`

**Responsibilities:**
- Vehicle fleet management
- Vehicle bookings
- Pricing & availability
- Vehicle maintenance tracking
- Insurance management

**APIs:** 20+ endpoints
**Tables:** 10+ tables (vehicles, bookings, maintenance, etc)

**Dependencies:**
- Auth Service
- Booking Service
- Payment Service

---

#### 4️⃣ **Booking Service** 📅
**Port:** 3004  
**Database:** `booking_db`

**Responsibilities:**
- Unified booking management
- Booking CRUD
- Status management (pending/confirmed/cancelled)
- Booking history
- Calendar management

**APIs:** 15+ endpoints
**Tables:** 5+ tables (bookings, calendar, etc)

**Dependencies:**
- Auth Service
- Payment Service
- Notification Service

---

#### 5️⃣ **Social Service** 📱
**Port:** 3005  
**Database:** `social_db`

**Responsibilities:**
- Posts (CRUD)
- Comments
- Albums
- Media management
- Social interactions

**APIs:** 25+ endpoints
**Tables:** 8+ tables (posts, comments, media, etc)

**Dependencies:**
- Auth Service
- Storage Service

---

#### 6️⃣ **Message Service** 💬
**Port:** 3006  
**Database:** `message_db`

**Responsibilities:**
- Conversations
- Messages (send/receive)
- Real-time messaging
- Message history
- Read receipts

**APIs:** 10+ endpoints
**Tables:** 3 tables (conversations, messages, participants)

**Dependencies:**
- Auth Service
- WebSocket/Socket.io

---

### 🔧 SHARED SERVICES:

#### 7️⃣ **Auth Service** 🔐
**Port:** 3007  
**Database:** `auth_db`

**Responsibilities:**
- User registration
- Login/Logout
- JWT token generation
- Token validation
- Password management
- Role & permissions

**APIs:** 8+ endpoints
**Tables:** 2 tables (users, sessions)

**Used by:** ALL services

---

#### 8️⃣ **Payment Service** 💰
**Port:** 3008  
**Database:** `payment_db`

**Responsibilities:**
- Payment processing
- Stripe integration
- Subscription management
- Transaction history
- Refunds

**APIs:** 12+ endpoints
**Tables:** 4 tables (payments, subscriptions, transactions)

**Used by:** Dating, Property, Vehicle, Booking

---

#### 9️⃣ **Notification Service** 🔔
**Port:** 3009  
**Database:** `notification_db`

**Responsibilities:**
- Push notifications
- Email notifications
- SMS notifications
- In-app notifications
- Notification preferences

**APIs:** 8+ endpoints
**Tables:** 2 tables (notifications, preferences)

**Used by:** ALL services

---

## 🌐 API GATEWAY

**Port:** 3000  
**Technology:** NestJS + Express Gateway

**Responsibilities:**
- Request routing
- Load balancing
- Authentication (JWT verification)
- Rate limiting
- Request/Response logging
- API documentation (Swagger aggregation)

**Routes:**
```
/api/auth/*       → Auth Service (3007)
/api/dating/*     → Dating Service (3001)
/api/properties/* → Property Service (3002)
/api/vehicles/*   → Vehicle Service (3003)
/api/bookings/*   → Booking Service (3004)
/api/social/*     → Social Service (3005)
/api/messages/*   → Message Service (3006)
/api/payments/*   → Payment Service (3008)
/api/notifications/* → Notification Service (3009)
```

---

## 🔗 INTER-SERVICE COMMUNICATION

### Option 1: REST APIs (Simple)
```typescript
// Dating Service calls Auth Service
const user = await axios.get('http://auth-service:3007/api/users/validate', {
  headers: { Authorization: token }
});
```

**Pros:** Simple, HTTP-based  
**Cons:** Synchronous, tight coupling

---

### Option 2: gRPC (Recommended)
```typescript
// Define proto
service AuthService {
  rpc ValidateToken(TokenRequest) returns (UserResponse);
}

// Dating Service calls
const user = await authClient.validateToken({ token });
```

**Pros:** Fast, type-safe, efficient  
**Cons:** More setup needed

---

### Option 3: Message Queue (Async)
```typescript
// Dating Service publishes event
await messageBroker.publish('user.subscription.created', {
  userId,
  plan: 'gold'
});

// Payment Service subscribes
messageBroker.subscribe('user.subscription.created', async (data) => {
  await processPayment(data);
});
```

**Pros:** Async, decoupled, scalable  
**Cons:** Eventual consistency

**Recommended:** **gRPC for sync + RabbitMQ/Kafka for async events**

---

## 🗄️ DATABASE STRATEGY

### Option 1: Database per Service (Recommended)
```
dating_db         → Dating Service
property_db       → Property Service
vehicle_db        → Vehicle Service
booking_db        → Booking Service
social_db         → Social Service
message_db        → Message Service
auth_db           → Auth Service (users table)
payment_db        → Payment Service
notification_db   → Notification Service
```

**Pros:** True isolation, independent scaling  
**Cons:** Cross-service queries harder

---

### Option 2: Shared Database (Easier Migration)
```
main_db → All services (different schemas)
  ├── dating.*
  ├── property.*
  ├── vehicle.*
  └── auth.*
```

**Pros:** Easier migration, cross-service queries  
**Cons:** Not true microservices

**Recommendation:** Start with **Shared DB**, migrate to **DB per Service** later

---

## 📁 FOLDER STRUCTURE

### New Structure:
```
backend/
├── services/
│   ├── dating-service/
│   │   ├── src/
│   │   │   ├── core/          # Dating domain
│   │   │   ├── infrastructure/
│   │   │   ├── application/
│   │   │   └── main.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── property-service/
│   │   └── ... (similar structure)
│   │
│   ├── vehicle-service/
│   ├── booking-service/
│   ├── social-service/
│   ├── message-service/
│   ├── auth-service/
│   ├── payment-service/
│   └── notification-service/
│
├── api-gateway/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── shared/
│   ├── common/              # Shared types
│   ├── proto/               # gRPC definitions
│   └── events/              # Event schemas
│
├── docker-compose.microservices.yml
└── docs/
    └── 12-microservices/
```

---

## 🚀 MIGRATION STRATEGY

### Phase 1: Preparation (1 week)
1. ✅ Analyze current modules
2. ✅ Design microservices architecture
3. ✅ Plan database split
4. ✅ Setup folder structure
5. ✅ Create shared libraries

### Phase 2: Extract Services (2 weeks)
**Priority Order:**
1. **Auth Service** (foundation) - 2 days
2. **Dating Service** (revenue driver) - 3 days
3. **Property Service** - 3 days
4. **Payment Service** (shared) - 2 days
5. **Message Service** (shared) - 2 days
6. **Others** - 3 days

### Phase 3: Integration (1 week)
1. Setup API Gateway
2. Configure gRPC
3. Setup message queue
4. Test inter-service calls
5. Load testing

### Phase 4: Deployment (1 week)
1. Docker containers
2. Kubernetes configs
3. CI/CD pipelines
4. Monitoring setup
5. Production deployment

**Total Timeline: 5 weeks**

---

## 🐳 DOCKER SETUP

### docker-compose.microservices.yml
```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - dating-service
      - property-service
    environment:
      - AUTH_SERVICE_URL=http://auth-service:3007
      - DATING_SERVICE_URL=http://dating-service:3001

  # Auth Service
  auth-service:
    build: ./services/auth-service
    ports:
      - "3007:3007"
    environment:
      - DB_HOST=postgres
      - DB_NAME=auth_db

  # Dating Service
  dating-service:
    build: ./services/dating-service
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=postgres
      - DB_NAME=dating_db
      - AUTH_SERVICE_URL=http://auth-service:3007

  # Property Service
  property-service:
    build: ./services/property-service
    ports:
      - "3002:3002"

  # ... other services

  # PostgreSQL
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis (for caching)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # RabbitMQ (for async events)
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  postgres-data:
```

---

## 🔄 SERVICE COMMUNICATION PATTERNS

### 1. Synchronous (gRPC)
**Use for:** Auth validation, User lookups

```protobuf
// auth.proto
service AuthService {
  rpc ValidateToken(TokenRequest) returns (UserResponse);
  rpc GetUser(UserIdRequest) returns (UserResponse);
}

// Dating Service uses this
const user = await authClient.validateToken({ token });
```

### 2. Asynchronous (Events)
**Use for:** Notifications, Analytics

```typescript
// Dating Service publishes
eventBus.publish('match.created', {
  matchId,
  user1Id,
  user2Id,
  matchedAt
});

// Message Service subscribes
eventBus.subscribe('match.created', async (data) => {
  await createConversation(data.matchId, data.user1Id, data.user2Id);
});

// Notification Service subscribes
eventBus.subscribe('match.created', async (data) => {
  await sendMatchNotification(data);
});
```

---

## 📊 DATA ISOLATION STRATEGY

### Approach: **Gradual Migration**

#### Step 1: Shared Database (Current)
```
main_db
├── dating_* tables
├── property_* tables
├── vehicle_* tables
└── users table (shared)
```

#### Step 2: Schema Separation
```
main_db
├── dating schema
│   └── dating_* tables
├── property schema
│   └── property_* tables
└── shared schema
    └── users table
```

#### Step 3: Database per Service (Target)
```
dating_db → Dating Service
property_db → Property Service
vehicle_db → Vehicle Service
auth_db → Auth Service (users table)
```

**Migration:** Use **Saga pattern** for distributed transactions

---

## 🔐 AUTHENTICATION FLOW

### Current (Monolith):
```
Client → API → Auth Guard → Controller
```

### Microservices:
```
Client
  ↓
API Gateway (validate JWT)
  ↓
Dating Service
  ↓ (if needed)
Auth Service (get user details via gRPC)
  ↓
Response
```

**Optimization:** Gateway validates JWT, passes user info in headers

---

## 🎯 SERVICE BOUNDARIES

### Dating Service Owns:
- Dating profiles
- Swipes
- Matches
- Date proposals
- Blocked users
- User reports
- Dating settings
- Profile views
- Boosts
- Subscriptions (dating-specific)

### Property Service Owns:
- Properties
- Property listings
- Property bookings
- Property reviews
- Host information
- Property amenities

### Shared Data:
- **Users** → Auth Service
- **Conversations** → Message Service
- **Payments** → Payment Service
- **Files** → Storage Service

---

## 📦 DEPLOYMENT ARCHITECTURE

```
                    [Load Balancer]
                           |
                    [API Gateway :3000]
                           |
        +------------------+------------------+
        |                  |                  |
 [Dating :3001]    [Property :3002]   [Vehicle :3003]
        |                  |                  |
        +------------------+------------------+
                           |
              +------------+------------+
              |            |            |
        [Auth :3007]  [Payment :3008]  [Message :3006]
              |            |            |
        +-----+------------+------------+-----+
        |                                     |
   [PostgreSQL]                          [Redis]
        |
   [RabbitMQ]
```

---

## 🔥 DATING SERVICE - DETAILED BREAKDOWN

### Structure:
```
services/dating-service/
├── src/
│   ├── core/
│   │   ├── domain/
│   │   │   └── dating/
│   │   │       ├── entity/          # 11 entities
│   │   │       └── port/            # 10 repository ports
│   │   └── service/
│   │       └── dating/
│   │           └── usecase/         # 24 use cases
│   │
│   ├── infrastructure/
│   │   ├── adapter/
│   │   │   ├── persistence/         # 10 repositories
│   │   │   └── grpc/                # gRPC clients
│   │   └── config/
│   │
│   ├── application/
│   │   ├── controller/
│   │   │   └── DatingController.ts  # 24 APIs
│   │   └── di/
│   │       └── DatingModule.ts
│   │
│   └── main.ts                      # Service entry
│
├── proto/
│   └── dating.proto                 # gRPC definitions
│
├── test/
│   └── ... (70+ test cases)
│
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

### Dependencies:
```json
{
  "dependencies": {
    "@nestjs/core": "^11.0.0",
    "@nestjs/microservices": "^11.0.0",
    "@grpc/grpc-js": "^1.9.0",
    "@grpc/proto-loader": "^0.7.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0"
  }
}
```

### Environment:
```env
SERVICE_NAME=dating-service
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=dating_db
AUTH_SERVICE_URL=auth-service:3007
MESSAGE_SERVICE_URL=message-service:3006
PAYMENT_SERVICE_URL=payment-service:3008
```

---

## 💡 IMPLEMENTATION PLAN

### Week 1: Foundation
- [x] Design architecture
- [ ] Create folder structure
- [ ] Setup shared libraries
- [ ] Create proto definitions

### Week 2-3: Extract Services
- [ ] Day 1-2: Auth Service
- [ ] Day 3-5: Dating Service
- [ ] Day 6-8: Property Service
- [ ] Day 9-10: Payment Service
- [ ] Day 11-12: Message Service
- [ ] Day 13-14: Others

### Week 4: Integration
- [ ] Setup API Gateway
- [ ] Configure gRPC
- [ ] Setup RabbitMQ
- [ ] Test communication

### Week 5: Production
- [ ] Docker setup
- [ ] Kubernetes configs
- [ ] CI/CD pipelines
- [ ] Deploy & test

---

## 🎯 SUCCESS CRITERIA

### Technical:
- [ ] All services independently deployable
- [ ] Database per service (or shared schemas)
- [ ] gRPC communication working
- [ ] API Gateway routing correctly
- [ ] All tests passing

### Performance:
- [ ] Response time < 200ms (95th percentile)
- [ ] Can scale services independently
- [ ] Handle 10k concurrent users

### Operations:
- [ ] Zero-downtime deployment
- [ ] Service health checks
- [ ] Monitoring & logging
- [ ] Auto-scaling

---

## ⚠️ CHALLENGES & SOLUTIONS

### Challenge 1: Data Consistency
**Solution:** 
- Use Saga pattern
- Event sourcing
- Compensating transactions

### Challenge 2: Service Discovery
**Solution:**
- Consul/etcd for service registry
- Or Kubernetes service discovery

### Challenge 3: Distributed Transactions
**Solution:**
- Avoid when possible
- Use eventual consistency
- Saga pattern for multi-service operations

### Challenge 4: Testing
**Solution:**
- Contract testing (Pact)
- Integration tests per service
- E2E tests through gateway

---

## 📈 BENEFITS

### Scalability:
- Scale Dating Service independently (high traffic)
- Scale Property Service for peak booking times
- Optimize resources per service

### Deployment:
- Deploy Dating updates without touching Property
- Faster deployment cycles
- Lower risk per deployment

### Development:
- Teams can work independently
- Smaller codebases
- Technology flexibility

### Reliability:
- Service isolation (Dating down ≠ Property down)
- Better fault tolerance
- Easier debugging

---

## 💰 COST ANALYSIS

### Infrastructure Costs:
```
9 services × $50/month = $450/month
API Gateway × $100/month = $100/month
Databases (9) × $30/month = $270/month
Redis × $30/month = $30/month
RabbitMQ × $40/month = $40/month
Load Balancer × $50/month = $50/month
──────────────────────────────────
TOTAL: ~$940/month

vs Monolith: ~$200/month

Additional cost: $740/month
```

### ROI:
- Dating Service revenue: $105k/month
- Additional cost: $740/month
- **ROI: 14,189%** ✅

**Worth it? ABSOLUTELY!**

---

## 🎊 NEXT STEPS

### Immediate:
1. Review this plan
2. Approve architecture
3. Start with Auth Service extraction
4. Create shared libraries

### This Week:
1. Create service folder structure
2. Extract Auth Service
3. Extract Dating Service
4. Setup gRPC

### Next 2 Weeks:
1. Extract remaining services
2. Setup API Gateway
3. Configure communication
4. Integration testing

---

## 📚 DOCUMENTATION TO CREATE

1. **MICROSERVICES_IMPLEMENTATION_GUIDE.md** - Step-by-step
2. **SERVICE_EXTRACTION_DATING.md** - Dating service extraction
3. **GRPC_SETUP_GUIDE.md** - gRPC configuration
4. **API_GATEWAY_CONFIG.md** - Gateway setup
5. **DEPLOYMENT_MICROSERVICES.md** - Deploy guide

---

## 🏆 EXPECTED OUTCOME

### From:
```
1 Monolith service
→ Hard to scale
→ Single point of failure
→ Coupled codebase
```

### To:
```
9 Microservices
→ Independently scalable
→ Fault isolated
→ Technology flexibility
→ Faster deployments
→ Team autonomy
```

---

## ✅ READY TO START?

**Next command:**
```bash
# Create microservices structure
# (Will be implemented in next steps)
```

**🚀 Microservices Architecture: PLANNED & READY! 🎊**

