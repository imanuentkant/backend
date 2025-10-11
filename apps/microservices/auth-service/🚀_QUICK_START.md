# 🚀 Auth Service - Quick Start

## ✅ Service Đang Chạy

Auth service đã được khởi động thành công!

## 📡 URLs

### Swagger UI (API Documentation)
```
http://localhost:3007/api/docs
```

### Health Check
```
http://localhost:3007/health
```

### Base URL
```
http://localhost:3007/api/auth
```

## 🧪 Test Flow Trong Swagger

### Bước 1: Register User
1. Mở Swagger UI: http://localhost:3007/api/docs
2. Tìm endpoint `POST /auth/register`
3. Click "Try it out"
4. Sửa request body:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "role": "USER",
  "password": "123456"
}
```
5. Click "Execute"

### Bước 2: Login
1. Tìm endpoint `POST /auth/login`
2. Click "Try it out"
3. Nhập:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
4. Click "Execute"
5. **Copy `accessToken`** từ response

### Bước 3: Authorize với Token
1. Click nút **"Authorize" 🔓** (góc phải trên cùng)
2. Paste access token vào field "Value"
3. Click "Authorize"
4. Click "Close"

### Bước 4: Test Protected APIs
Bây giờ bạn có thể test các protected endpoints:

- ✅ `GET /auth/profile` - Lấy profile
- ✅ `GET /auth/me` - User info từ token
- ✅ `GET /users/me` - User profile

### Bước 5: Test Admin APIs (Optional)

#### Tạo Admin User
```json
{
  "firstName": "Admin",
  "lastName": "User", 
  "email": "admin@example.com",
  "role": "ADMIN",
  "password": "admin123"
}
```

Login với admin account và test:
- 👑 `GET /users/:id` - Get user by ID (ADMIN only)
- 👑 `GET /auth/admin/users` - Admin users list

### Bước 6: Test HOST APIs (Optional)

#### Tạo Host User
```json
{
  "firstName": "Host",
  "lastName": "User",
  "email": "host@example.com", 
  "role": "HOST",
  "password": "host123"
}
```

Login và test:
- 🏠 `GET /auth/host/dashboard` - Host dashboard (HOST/ADMIN only)

## 🎯 API Summary

### Public (3 endpoints)
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token

### Protected (3 endpoints)
- `GET /auth/profile` - Profile user 🔒
- `GET /auth/me` - User info 🔒
- `GET /users/me` - User profile 🔒

### Admin Only (2 endpoints)
- `GET /users/:id` - Get user by ID 👑
- `GET /auth/admin/users` - Admin users list 👑

### HOST/ADMIN (1 endpoint)
- `GET /auth/host/dashboard` - Host dashboard 🏠

## 📊 Authorization Test Matrix

| Role | Có thể test |
|------|-------------|
| USER | Public (3) + Protected (3) |
| HOST | Public (3) + Protected (3) + Host (1) |
| ADMIN | Tất cả (9 endpoints) |

## 💡 Tips

### Copy Token Nhanh
1. Login → Copy `accessToken`
2. Click "Authorize" button
3. Paste token
4. Done!

### Test Different Roles
- Tạo 3 users: USER, HOST, ADMIN
- Login với từng role
- Test các endpoints khác nhau
- Xem response 200 (success) vs 403 (forbidden)

### Xem Response Code
- ✅ 200/201 - Success
- ❌ 400 - Bad Request
- ❌ 401 - Unauthorized (chưa login)
- ❌ 403 - Forbidden (không có quyền)
- ❌ 404 - Not Found

## 🔧 Troubleshooting

### Service không chạy?
```bash
cd apps/microservices/auth-service
npm run start:dev
```

### Database error?
Kiểm tra PostgreSQL đang chạy và database đã tạo:
```sql
CREATE DATABASE auth_service;
```

### Port đã được sử dụng?
Đổi PORT trong `.env`:
```
PORT=3008
```

## 📚 Documentation

- **PROTECTED_APIS.md** - Chi tiết APIs
- **CLEAN_ARCHITECTURE.md** - Architecture overview
- **REFACTOR_COMPLETE.md** - Implementation details

---

## 🎉 Enjoy Testing!

**Swagger UI**: http://localhost:3007/api/docs

**Health Check**: http://localhost:3007/health

**Status**: ✅ RUNNING

