# ✅ Database Configuration - Đã Fix Giống Monolith!

## 🎯 Vấn Đề Đã Fix

Auth service **đã được cập nhật** để kết nối database **giống hệt với monolith**!

## Thay Đổi Chính

### Before ❌
```typescript
// Dùng DatabaseConfig class riêng
DatabaseConfig.getTypeOrmConfig()
```

### After ✅
```typescript
// Dùng ConfigService giống monolith
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    // ... same pattern as monolith
  })
})
```

## Environment Variables

**Cần thêm vào file `.env`:**

```env
# Database (giống monolith)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service
DB_LOG_ENABLE=false  # ← MỚI: Enable SQL query logging

# JWT
API_ACCESS_TOKEN_SECRET=your-secret
API_ACCESS_TOKEN_TTL_IN_MINUTES=15
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false
API_REFRESH_TOKEN_SECRET=your-refresh-secret
API_REFRESH_TOKEN_TTL_IN_DAYS=7

# Auth
API_LOGIN_USERNAME_FIELD=email
API_LOGIN_PASSWORD_FIELD=password

# Server
PORT=3007
NODE_ENV=development
CORS_ORIGIN=*
```

## Lợi Ích

### ✅ Consistency
- Pattern giống hệt monolith
- Dùng ConfigService chính xác
- forRootAsync cho proper DI

### ✅ Database Logging
```bash
# Enable SQL query logging để debug
DB_LOG_ENABLE=true
```

Bạn sẽ thấy tất cả SQL queries trong console!

### ✅ Flexible
- Dễ dàng đổi database
- Support nhiều môi trường
- Better error handling

## So Sánh Code

### Monolith
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    host: configService.get('DB_HOST') || 'localhost',
    logging: configService.get('DB_LOG_ENABLE') == 'true' ? 'all' : false,
    // ...
  })
})
```

### Auth Service (Now)
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    host: configService.get('DB_HOST') || 'localhost',
    logging: configService.get('DB_LOG_ENABLE') === 'true' ? 'all' : false,
    // ... SAME PATTERN!
  })
})
```

## Files Changed

| File | Status |
|------|--------|
| `src/application/di/DatabaseModule.ts` | ✅ Updated |
| `src/infrastructure/config/DatabaseConfig.ts` | ❌ Deleted |
| `.env` | 📝 Cần thêm `DB_LOG_ENABLE` |

## Test

### 1. Build
```bash
npm run build
# ✅ Success
```

### 2. Run Service
```bash
npm run start:dev
```

### 3. Enable Logging (Optional)
Sửa `.env`:
```env
DB_LOG_ENABLE=true
```

Restart service, bạn sẽ thấy SQL queries:
```
query: SELECT * FROM "user" WHERE "email" = $1
```

### 4. Test Connection
```
http://localhost:3007/health
```

Response:
```json
{
  "service": "auth-service",
  "status": "healthy",
  "architecture": "Clean Architecture",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Swagger Testing

Service đang chạy tại:
```
http://localhost:3007/api/docs
```

Test các APIs như bình thường! Database đã connect đúng cách rồi.

## Troubleshooting

### Nếu báo lỗi connection
1. Kiểm tra PostgreSQL đang chạy:
```bash
pg_isready
```

2. Kiểm tra credentials trong `.env`

3. Tạo database:
```bash
createdb auth_service
```

### Nếu muốn xem SQL queries
```env
DB_LOG_ENABLE=true
```

---

**Status**: ✅ FIXED

**Giống Monolith**: ✅ YES  

**Build**: ✅ PASSING

**Service**: ✅ RUNNING

🎉 **Database configuration đã giống monolith!** 🎉

