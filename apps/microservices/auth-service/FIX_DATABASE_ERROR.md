# 🔧 Fix Database Error - "column id contains null values"

## Vấn Đề

```
QueryFailedError: column "id" contains null values
```

Lỗi này xảy ra vì:
- Database có bảng `user` cũ từ version trước
- Schema cũ không khớp với schema mới
- TypeORM synchronize không thể update được

## ✅ Giải Pháp

### Cách 1: Drop Database và Tạo Lại (Khuyến nghị)

```bash
# 1. Kết nối PostgreSQL
psql -U postgres

# 2. Drop database cũ
DROP DATABASE auth_service;

# 3. Tạo database mới
CREATE DATABASE auth_service;

# 4. Thoát
\q

# 5. Chạy lại service
cd apps/microservices/auth-service
npm run start:dev
```

### Cách 2: Drop Tables (Nếu không muốn drop database)

```sql
-- Connect to database
psql -U postgres -d auth_service

-- Drop tables
DROP TABLE IF EXISTS refresh_token CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Exit
\q
```

### Cách 3: Sử dụng Script Tự Động

Chạy script sau trong PowerShell:

```powershell
# Drop và tạo lại database
psql -U postgres -c "DROP DATABASE IF EXISTS auth_service;"
psql -U postgres -c "CREATE DATABASE auth_service;"

# Chạy lại service
cd apps/microservices/auth-service
npm run start:dev
```

### Cách 4: Tạo Script SQL

Tạo file `reset-database.sql`:
```sql
-- Drop database
DROP DATABASE IF EXISTS auth_service;

-- Create database
CREATE DATABASE auth_service;
```

Chạy script:
```bash
psql -U postgres -f reset-database.sql
```

## 🎯 Script Tự Động (Khuyến nghị)

Tôi đã tạo file `reset-database.bat` cho bạn:

```bash
cd apps/microservices/auth-service
.\reset-database.bat
```

## Sau Khi Fix

1. Database sẽ sạch hoàn toàn
2. TypeORM sẽ tự tạo tables mới
3. Schema sẽ đúng với entities hiện tại

## Verify

Sau khi chạy lại service, bạn sẽ thấy:

```
[Nest] INFO  [InstanceLoader] TypeOrmCoreModule dependencies initialized
[Nest] INFO  [RoutesResolver] AuthController {/api/auth/auth}
[Nest] INFO  [RoutesResolver] UserController {/api/auth/users}

╔════════════════════════════════════════════╗
║  🔐 AUTH SERVICE - CLEAN ARCHITECTURE     ║
║  Status: READY ✅                          ║
╚════════════════════════════════════════════╝
```

## Test

```bash
# Health check
curl http://localhost:3007/health

# Swagger
http://localhost:3007/api/docs
```

---

**Note**: Cách này sẽ xóa tất cả data trong database. Trong production, cần dùng migrations thay vì synchronize!

