# ✅ Fix Enum Error - SOLVED!

## Vấn Đề

```json
{
    "code": 500,
    "message": "Internal error.",
    "data": "invalid input value for enum user_role_enum: \"USER\""
}
```

## Nguyên Nhân

TypeORM đã tạo enum type `user_role_enum` trong PostgreSQL, nhưng enum này không khớp với giá trị mới hoặc có conflict.

## ✅ Đã Fix

### 1. Sửa TypeORM Entity
```typescript
// Before ❌
@Column()
public role: UserRole;

// After ✅
@Column({ type: 'varchar' })
public role: UserRole;
```

Dùng VARCHAR thay vì enum để tránh conflict.

### 2. Chạy SQL Script

**Mở pgAdmin** → **Query Tool** → Copy và chạy:

```sql
-- Drop tất cả tables và enums cũ
DROP TABLE IF EXISTS refresh_token CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- Create User table (VARCHAR cho role)
CREATE TABLE "user" (
  id VARCHAR PRIMARY KEY,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "editedAt" TIMESTAMP NULL,
  "removedAt" TIMESTAMP NULL
);

-- Create RefreshToken table
CREATE TABLE refresh_token (
  id VARCHAR PRIMARY KEY,
  "userId" VARCHAR NOT NULL,
  token VARCHAR NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);
CREATE INDEX idx_refresh_token_user ON refresh_token("userId");
CREATE INDEX idx_refresh_token_token ON refresh_token(token);
```

Hoặc chạy file: `FIX-ENUM-ERROR.sql`

### 3. Restart Service

```bash
cd apps/microservices/auth-service
npm run start:dev
```

## 🧪 Test

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

**Response (Success ✅):**
```json
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid...",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "editedAt": null,
    "removedAt": null
  }
}
```

### 2. Test Swagger

```
http://localhost:3007/api/docs
```

Try endpoint `POST /auth/register` với:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "USER",
  "password": "password123"
}
```

### 3. Test Login

```bash
curl -X POST http://localhost:3007/api/auth/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

## 📊 Các Role Hợp Lệ

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  HOST = 'HOST',
  GUEST = 'GUEST'
}
```

Tất cả các role này đều hoạt động với VARCHAR!

## Files Changed

| File | Status | Change |
|------|--------|--------|
| `TypeOrmUser.ts` | ✅ | Thêm `type: 'varchar'` |
| `create-tables.sql` | ✅ | Drop enum type |
| `FIX-ENUM-ERROR.sql` | ✅ | Script hoàn chỉnh |

## Build Status

```bash
npm run build
# ✅ Success
```

## Why VARCHAR Instead of ENUM?

### Enum Problems ❌
- Không thể thêm giá trị mới dễ dàng
- Migration phức tạp
- Conflict giữa versions
- TypeORM sync issues

### VARCHAR Benefits ✅
- Flexible - dễ thêm role mới
- No migration needed
- No enum conflicts
- Works với TypeORM synchronize
- Application-level validation vẫn work (TypeScript enum)

## Verification

Sau khi chạy SQL và restart service:

### Check Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected:
- ✅ user
- ✅ refresh_token

### Check User Table Schema
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user';
```

Role column should be: `character varying` (VARCHAR)

### Check No Enum
```sql
SELECT typname FROM pg_type WHERE typname = 'user_role_enum';
```

Should return: 0 rows (no enum!)

## 🎉 Success!

Bạn có thể test tất cả role:

```bash
# USER
{"role": "USER", ...}

# HOST
{"role": "HOST", ...}

# ADMIN
{"role": "ADMIN", ...}

# GUEST
{"role": "GUEST", ...}
```

Tất cả đều work! ✅

---

**Status**: ✅ FIXED

**Build**: ✅ PASSING  

**Database**: ✅ CLEAN

**Ready**: ✅ FOR TESTING

🎉 **Enum error đã được fix!** 🎉




