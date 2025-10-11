# 🚀 Start Auth Service Local

## Bước 1: Setup Environment Variables

```bash
cd apps/microservices/auth-service
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service

# JWT Access Token
API_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-in-production
API_ACCESS_TOKEN_TTL_IN_MINUTES=15
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false

# JWT Refresh Token
API_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-in-production
API_REFRESH_TOKEN_TTL_IN_DAYS=7

# Auth
API_LOGIN_USERNAME_FIELD=email
API_LOGIN_PASSWORD_FIELD=password

# Server
PORT=3007
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

## Bước 2: Tạo Database

```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Tạo database (nếu chưa có)
createdb auth_service
```

Hoặc dùng SQL:
```sql
CREATE DATABASE auth_service;
```

## Bước 3: Install Dependencies (nếu chưa)

```bash
cd apps/microservices/auth-service
npm install
```

## Bước 4: Start Service

```bash
npm run start:dev
```

## Bước 5: Truy Cập Swagger

Mở browser và truy cập:
```
http://localhost:3007/api/docs
```

## Bước 6: Test APIs

### Health Check
```
http://localhost:3007/health
```

### Swagger UI
```
http://localhost:3007/api/docs
```

## Quick Test Flow

### 1. Register User
```bash
curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "role": "USER",
    "password": "123456"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3007/api/auth/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

Copy `accessToken` từ response.

### 3. Get Profile (Protected)
```bash
curl -X GET http://localhost:3007/api/auth/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Port đã được sử dụng
```bash
# Đổi PORT trong .env
PORT=3008
```

### Database connection error
- Kiểm tra PostgreSQL đang chạy: `pg_isready`
- Kiểm tra credentials trong `.env`
- Tạo database: `createdb auth_service`

### Module not found
```bash
npm install
```

### Build errors
```bash
npm run build
```

## Swagger Features

1. **Try it out** - Test APIs trực tiếp
2. **Authorize** - Click để thêm Bearer token
3. **Schemas** - Xem request/response models
4. **Examples** - Xem example data

---

**Swagger URL**: http://localhost:3007/api/docs

**Health Check**: http://localhost:3007/health

