# Auth Service - Microservice

Authentication & Authorization Microservice cho hệ thống Trung Tâm Trợ Chơi.

## Tính năng

### Đã triển khai
- ✅ Đăng ký tài khoản (Register)
- ✅ Đăng nhập (Login)
- ✅ Refresh token
- ✅ Đăng xuất (Logout)
- ✅ Quản lý profile người dùng
- ✅ Cập nhật thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ JWT Authentication
- ✅ Role-based Authorization (user, host, admin)
- ✅ Swagger Documentation

## Cấu trúc dự án

```
auth-service/
├── src/
│   ├── domain/
│   │   └── entities/           # Entities (User, RefreshToken)
│   ├── application/
│   │   ├── dtos/              # Data Transfer Objects
│   │   └── services/          # Business Logic
│   ├── infrastructure/
│   │   ├── auth/              # JWT Strategy & Guards
│   │   └── decorators/        # Custom Decorators
│   ├── presentation/
│   │   └── controllers/       # REST API Controllers
│   ├── AuthAppModule.ts       # Module chính
│   └── main.ts               # Entry point
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
cd apps/microservices/auth-service
npm install
```

### 2. Cấu hình Database

Tạo database PostgreSQL:

```sql
CREATE DATABASE auth_db;
```

### 3. Cấu hình Environment

Tạo file `.env` trong thư mục `auth-service`:

```env
NODE_ENV=development
PORT=3007

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 4. Chạy service

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Endpoints

Base URL: `http://localhost:3007/api/auth`

### Public Endpoints (không cần token)

#### 1. Đăng ký
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username123",
  "password": "Password@123",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0912345678"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 604800,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "username123",
    "fullName": "Nguyễn Văn A",
    "role": "user",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Đăng nhập
```http
POST /login
Content-Type: application/json

{
  "emailOrUsername": "user@example.com",
  "password": "Password@123"
}
```

Response: Giống như response của đăng ký

#### 3. Refresh Token
```http
POST /refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "660e8400-e29b-41d4-a716-446655440111",
  "expiresIn": 604800
}
```

### Protected Endpoints (cần Bearer Token)

#### 4. Lấy thông tin Profile
```http
GET /profile
Authorization: Bearer <access_token>
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "username": "username123",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0912345678",
  "avatar": null,
  "role": "user",
  "isActive": true,
  "isEmailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 5. Cập nhật Profile
```http
PUT /profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B",
  "phoneNumber": "0987654321",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 6. Đổi mật khẩu
```http
POST /change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@456"
}
```

Response:
```json
{
  "message": "Mật khẩu đã được thay đổi thành công"
}
```

#### 7. Đăng xuất
```http
POST /logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

Response:
```json
{
  "message": "Đăng xuất thành công"
}
```

#### 8. Validate Token (cho các service khác)
```http
GET /validate
Authorization: Bearer <access_token>
```

Response:
```json
{
  "valid": true,
  "user": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "username123",
    "role": "user"
  }
}
```

## Documentation

Sau khi chạy service, truy cập Swagger docs tại:
```
http://localhost:3007/api/docs
```

## Health Check

```http
GET /health
```

Response:
```json
{
  "service": "auth-service",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema

### Users Table
- `id` - UUID primary key
- `email` - Unique email
- `username` - Unique username
- `password` - Hashed password (bcrypt)
- `fullName` - Tên đầy đủ
- `phoneNumber` - Số điện thoại
- `avatar` - URL avatar
- `role` - Enum: user, host, admin
- `isActive` - Boolean
- `isEmailVerified` - Boolean
- `createdAt`, `updatedAt` - Timestamps

### RefreshTokens Table
- `id` - UUID primary key
- `token` - UUID refresh token
- `userId` - Foreign key to Users
- `expiresAt` - Expiration date
- `isRevoked` - Boolean
- `deviceInfo` - User agent
- `ipAddress` - IP address
- `createdAt` - Timestamp

## Testing

Test các endpoints bằng curl:

```bash
# Register
curl -X POST http://localhost:3007/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "Test@123"
  }'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3007/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Architecture

Service này tuân thủ Clean Architecture với các layers:
- **Domain**: Entities và business rules
- **Application**: Use cases và business logic
- **Infrastructure**: External concerns (database, auth)
- **Presentation**: API controllers

## Security

- Passwords được hash bằng bcrypt (10 rounds)
- JWT tokens có thời hạn 7 ngày (configurable)
- Refresh tokens có thời hạn 30 ngày
- Refresh tokens được revoke sau khi sử dụng
- Tất cả refresh tokens bị revoke khi đổi password
- CORS được cấu hình cho security
- Input validation với class-validator

## Integration với các services khác

Các microservices khác có thể validate JWT token bằng cách:
1. Sử dụng endpoint `/validate` 
2. Hoặc tự validate JWT với cùng `JWT_SECRET`

## Tech Stack

- NestJS 11
- TypeORM
- PostgreSQL
- JWT (jsonwebtoken)
- Passport.js
- bcryptjs
- class-validator
- Swagger/OpenAPI

## Troubleshooting

### Lỗi kết nối database
```
Kiểm tra PostgreSQL đã chạy chưa
Kiểm tra credentials trong .env
Đảm bảo database auth_db đã được tạo
```

### JWT token không hợp lệ
```
Kiểm tra JWT_SECRET trong .env
Kiểm tra token chưa hết hạn
Kiểm tra format: Bearer <token>
```


