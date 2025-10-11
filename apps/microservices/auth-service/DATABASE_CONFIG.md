# ✅ Database Configuration - Đã Cập Nhật

## Thay Đổi

Auth Service đã được cập nhật để **kết nối database giống hệt với monolith**!

## Cách Config Database (Giống Monolith)

### Before ❌
```typescript
// DatabaseConfig.ts (hardcoded)
export class DatabaseConfig {
  public static getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      // ...
    };
  }
}

// DatabaseModule.ts
TypeOrmModule.forRoot(DatabaseConfig.getTypeOrmConfig())
```

### After ✅ (Giống Monolith)
```typescript
// DatabaseModule.ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: Number(configService.get('DB_PORT')) || 5432,
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_NAME') || 'auth_service',
    logging: configService.get('DB_LOG_ENABLE') === 'true' ? 'all' : false,
    entities: [TypeOrmUser, TypeOrmRefreshToken],
    synchronize: configService.get('NODE_ENV') !== 'production',
  }),
})
```

## Environment Variables

### Cần có trong `.env`:

```env
# Database Configuration (giống monolith)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service
DB_LOG_ENABLE=false  # NEW: enable database query logging

# JWT Configuration
API_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
API_ACCESS_TOKEN_TTL_IN_MINUTES=15
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false

API_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
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

### 1. ✅ Consistent với Monolith
- Dùng ConfigService thay vì process.env trực tiếp
- forRootAsync cho dependency injection đúng cách
- Cùng pattern với monolith

### 2. ✅ Flexible
- Dễ dàng thêm config mới
- Support DB_LOG_ENABLE giống monolith
- Có thể inject ConfigService vào factory

### 3. ✅ Better Defaults
```typescript
host: configService.get('DB_HOST') || 'localhost',
port: Number(configService.get('DB_PORT')) || 5432,
username: configService.get('DB_USERNAME') || 'postgres',
```

### 4. ✅ Database Query Logging
```typescript
logging: configService.get('DB_LOG_ENABLE') === 'true' ? 'all' : false,
```

Enable logging để debug:
```env
DB_LOG_ENABLE=true
```

## So Sánh với Monolith

### Monolith
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME') || '5432',
    password: configService.get('DB_PASSWORD') || '5432',
    database: configService.get('DB_NAME') || '5432',
    logging: configService.get('DB_LOG_ENABLE') == 'true' ? 'all' : false,
    entities: [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
    migrations: [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
  })
})
```

### Auth Service (Now)
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: Number(configService.get('DB_PORT')) || 5432,
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_NAME') || 'auth_service',
    logging: configService.get('DB_LOG_ENABLE') === 'true' ? 'all' : false,
    entities: [TypeOrmUser, TypeOrmRefreshToken],
    synchronize: configService.get('NODE_ENV') !== 'production',
  }),
})
```

**Khác biệt:**
- Monolith: Dùng glob pattern cho entities (nhiều entity hơn)
- Auth Service: List entities trực tiếp (chỉ 2 entities)
- Monolith: Có migrations support
- Auth Service: Dùng synchronize (đơn giản hơn cho microservice)

## Testing

### 1. Chạy với logging
```bash
# .env
DB_LOG_ENABLE=true

# Start service
npm run start:dev

# Bạn sẽ thấy tất cả SQL queries in ra console
```

### 2. Connect database khác
```bash
# .env
DB_HOST=your-db-host
DB_PORT=5433
DB_USERNAME=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
```

### 3. Production mode
```bash
# .env
NODE_ENV=production
DB_LOG_ENABLE=false

# synchronize sẽ tự động tắt
```

## Files Changed

- ✅ `src/application/di/DatabaseModule.ts` - Updated to use ConfigService
- ❌ `src/infrastructure/config/DatabaseConfig.ts` - Deleted (không cần nữa)
- ✅ `.env.example` - Added DB_LOG_ENABLE

## Build Status

```bash
npm run build
# ✅ Success - No errors
```

---

**Status**: ✅ COMPLETE

**Giống Monolith**: ✅ YES

**Build**: ✅ PASSING

