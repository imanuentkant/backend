# Auth Service - Clean Architecture

## Tổng Quan

Auth Service đã được refactor hoàn toàn theo chuẩn **Clean Architecture**, tương tự như monolith. Kiến trúc này đảm bảo:

- **Tách biệt rõ ràng các layer**: Core, Application, Infrastructure
- **Dependency Inversion**: Dependencies luôn hướng vào trong (core)
- **Testability**: Dễ dàng test từng layer độc lập
- **Maintainability**: Code dễ đọc, dễ bảo trì và mở rộng
- **Reusability**: Có thể tái sử dụng business logic

## Cấu Trúc Thư Mục

```
src/
├── core/                           # CORE LAYER - Business Logic
│   ├── common/                     # Shared abstractions
│   │   ├── api/                   # API response wrappers
│   │   ├── code/                  # Error codes
│   │   ├── entity/                # Base entities
│   │   ├── enums/                 # Enums
│   │   ├── exception/             # Exception handling
│   │   ├── persistence/           # Repository options
│   │   ├── type/                  # Common types
│   │   ├── usecase/               # UseCase interface
│   │   └── util/                  # Utilities
│   ├── domain/                    # Domain layer
│   │   └── auth/
│   │       ├── entity/           # Domain entities (User, RefreshToken)
│   │       ├── port/             # Interfaces/Contracts
│   │       │   ├── persistence/  # Repository ports
│   │       │   └── usecase/      # Use case ports
│   │       ├── usecase/          # Use case definitions
│   │       └── di/               # DI tokens
│   └── service/                   # Application services
│       └── auth/
│           └── usecase/          # Use case implementations
│
├── infrastructure/                 # INFRASTRUCTURE LAYER
│   ├── adapter/
│   │   └── persistence/
│   │       └── typeorm/
│   │           ├── entity/       # TypeORM entities
│   │           ├── mapper/       # Domain <-> ORM mappers
│   │           └── repository/   # Repository implementations
│   └── config/                   # Configurations
│
├── application/                    # APPLICATION LAYER
│   ├── api/
│   │   └── http-rest/
│   │       ├── auth/             # Auth strategies, guards
│   │       │   ├── decorator/    # Decorators
│   │       │   ├── guard/        # Guards
│   │       │   ├── passport/     # Passport strategies
│   │       │   └── type/         # Types
│   │       ├── controller/       # Controllers
│   │       ├── dto/              # DTOs
│   │       └── exception-filter/ # Exception filters
│   └── di/                       # Dependency injection modules
│
├── AuthAppModule.ts               # Main app module
└── main.ts                        # Bootstrap
```

## Các Layer

### 1. Core Layer

**Nhiệm vụ**: Chứa toàn bộ business logic, không phụ thuộc vào bất kỳ framework hay technology nào.

#### Core/Common
- **Entity**: Base class cho entities với validation
- **UseCase**: Interface định nghĩa use case pattern
- **Exception**: Custom exception handling
- **Code**: Error codes chuẩn hóa
- **Types**: Common types (Optional, Nullable)

#### Core/Domain
- **Entities**: Domain models (User, RefreshToken) với business rules
- **Ports**: Interfaces cho repositories và use cases
- **Use Cases**: Định nghĩa các use cases (CreateUser, Login, RefreshToken, GetUser)
- **DTOs**: Data transfer objects cho use cases

#### Core/Service
- **Use Case Implementations**: Implementation cụ thể của các use cases

### 2. Infrastructure Layer

**Nhiệm vụ**: Implement các technical details (database, external services, etc.)

- **TypeORM Entities**: Database entities
- **Mappers**: Convert giữa domain entities và ORM entities
- **Repository Adapters**: Implement repository ports từ domain
- **Configurations**: Database config, etc.

### 3. Application Layer

**Nhiệm vụ**: Orchestrate use cases, handle HTTP requests, authentication, etc.

- **Controllers**: HTTP endpoints
- **DTOs**: Request/Response DTOs
- **Guards**: Authentication/Authorization guards
- **Strategies**: Passport strategies (JWT, Local)
- **Exception Filters**: Global exception handling
- **DI Modules**: Dependency injection setup

## Use Cases

### 1. Register (CreateUserUseCase)
```typescript
POST /api/auth/auth/register
Body: { firstName, lastName, email, role, password }
```

### 2. Login (LoginUseCase)
```typescript
POST /api/auth/auth/login
Body: { email, password }
Response: { id, accessToken, refreshToken }
```

### 3. Refresh Token (RefreshTokenUseCase)
```typescript
POST /api/auth/auth/refresh
Body: { refreshToken }
Response: { accessToken }
```

### 4. Get User (GetUserUseCase)
```typescript
GET /api/auth/users/profile
Headers: { Authorization: Bearer <token> }
```

## Dependency Flow

```
Controllers → Use Cases → Repositories
     ↓            ↓            ↓
   DTOs     Domain Logic   Entities
```

**Nguyên tắc**: Dependencies luôn point inward. Core không biết gì về Infrastructure hay Application.

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service

# JWT
API_ACCESS_TOKEN_SECRET=your-access-token-secret
API_ACCESS_TOKEN_TTL_IN_MINUTES=15
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false

API_REFRESH_TOKEN_SECRET=your-refresh-token-secret
API_REFRESH_TOKEN_TTL_IN_DAYS=7

# Auth
API_LOGIN_USERNAME_FIELD=email
API_LOGIN_PASSWORD_FIELD=password

# Server
PORT=3007
NODE_ENV=development
CORS_ORIGIN=*
```

## Chạy Service

### Development
```bash
cd apps/microservices/auth-service
npm run start:dev
```

### Production
```bash
cd apps/microservices/auth-service
npm run build
npm run start:prod
```

### Health Check
```
GET http://localhost:3007/health
```

### API Documentation
```
http://localhost:3007/api/docs
```

## Testing

Với Clean Architecture, việc testing trở nên dễ dàng hơn:

### Unit Tests
- Test domain entities với business rules
- Test use cases với mocked repositories
- Test repository adapters với in-memory database

### Integration Tests
- Test controllers với mocked use cases
- Test end-to-end flow

## Best Practices

1. **Domain entities** chứa business logic và validation
2. **Use cases** orchestrate business logic, không chứa technical details
3. **Repositories** chỉ lo persistence, không chứa business logic
4. **Controllers** chỉ lo HTTP handling, delegate work cho use cases
5. **Mappers** convert giữa layers, không chứa logic
6. **DTOs** chỉ carry data, không chứa logic

## So Sánh Với Cấu Trúc Cũ

### Cũ (Basic Layered)
```
src/
├── domain/entities/       # Entities
├── application/services/  # Services
├── infrastructure/        # Guards, strategies
└── presentation/          # Controllers
```

### Mới (Clean Architecture)
```
src/
├── core/                  # Business logic (domain + services)
├── infrastructure/        # Technical implementations
└── application/           # HTTP, DI, orchestration
```

**Lợi ích**:
- Tách biệt rõ ràng business logic và technical details
- Dễ test, dễ maintain
- Có thể swap infrastructure mà không ảnh hưởng business logic
- Chuẩn hóa với monolith

## Migration Notes

Nếu có services khác muốn migrate sang Clean Architecture:

1. Di chuyển entities vào `core/domain/{domain}/entity/`
2. Tạo repository ports trong `core/domain/{domain}/port/persistence/`
3. Tạo use case ports và definitions trong `core/domain/{domain}/port/usecase/` và `usecase/`
4. Implement use cases trong `core/service/{domain}/usecase/`
5. Di chuyển TypeORM entities vào `infrastructure/adapter/persistence/typeorm/entity/`
6. Tạo mappers và repository adapters
7. Update DI modules
8. Update controllers để sử dụng use cases

## Tài Liệu Tham Khảo

- Clean Architecture by Robert C. Martin
- Monolith codebase structure (apps/monolith/src/)

