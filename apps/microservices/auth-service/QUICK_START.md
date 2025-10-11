# 🚀 Auth Service - Quick Start

## Bắt đầu trong 5 phút

### Bước 1: Cài đặt Dependencies
```bash
cd apps/microservices/auth-service
npm install
```

### Bước 2: Setup Database
```bash
# Tạo database PostgreSQL
createdb auth_db

# Hoặc dùng psql
psql -U postgres
CREATE DATABASE auth_db;
\q
```

### Bước 3: Cấu hình Environment
```bash
# Tạo file .env
cat > .env << EOF
NODE_ENV=development
PORT=3007

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db

JWT_SECRET=my-super-secret-jwt-key
JWT_EXPIRES_IN=7d

CORS_ORIGIN=*
EOF
```

### Bước 4: Chạy Service
```bash
npm run start:dev
```

### Bước 5: Test
```bash
# Health check
curl http://localhost:3007/health

# Swagger docs
open http://localhost:3007/api/docs
```

## Test nhanh với curl

### 1. Đăng ký tài khoản
```bash
curl -X POST http://localhost:3007/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin@123",
    "fullName": "Administrator"
  }'
```

Lưu lại `accessToken` và `refreshToken` từ response.

### 2. Đăng nhập
```bash
curl -X POST http://localhost:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "admin",
    "password": "Admin@123"
  }'
```

### 3. Lấy Profile (thay YOUR_TOKEN)
```bash
curl -X GET http://localhost:3007/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Cập nhật Profile
```bash
curl -X PUT http://localhost:3007/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin Updated",
    "phoneNumber": "0912345678"
  }'
```

### 5. Đổi mật khẩu
```bash
curl -X POST http://localhost:3007/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "Admin@123",
    "newPassword": "NewAdmin@456"
  }'
```

## Sử dụng Postman

1. Import collection từ Swagger: `http://localhost:3007/api/docs-json`
2. Tạo environment với biến `baseUrl` = `http://localhost:3007/api/auth`
3. Tạo biến `accessToken` để lưu token
4. Test các endpoints

## Docker

### Build image
```bash
docker build -t auth-service .
```

### Run container
```bash
docker run -p 3007:3007 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=my-secret \
  auth-service
```

## Troubleshooting

### Port đã được sử dụng
```bash
# Đổi port trong .env
PORT=3008
```

### Không kết nối được database
```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Kiểm tra credentials
psql -h localhost -U postgres -d auth_db
```

### JWT token không hợp lệ
```bash
# Kiểm tra JWT_SECRET đã set chưa
echo $JWT_SECRET

# Kiểm tra format header
Authorization: Bearer <token>
```

## Xong! 🎉

Service đang chạy tại:
- API: http://localhost:3007/api/auth
- Docs: http://localhost:3007/api/docs
- Health: http://localhost:3007/health


