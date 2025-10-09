# 🚀 AUTHENTICATION - QUICK START

## Cách xác thực hiện tại

### 📊 FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────┐
│  CLIENT                                                  │
│  Authorization: Bearer <JWT_TOKEN>                       │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  API GATEWAY (Port 3000)                                 │
│  ✅ JwtStrategy: Validate token signature                │
│  ✅ Extract: { id, email, role }                         │
│  ✅ Set request.user                                     │
└────────────────────┬─────────────────────────────────────┘
                     │ Forward headers
                     ▼
┌──────────────────────────────────────────────────────────┐
│  DATING SERVICE (Port 3001)                              │
│  ✅ HttpJwtAuthGuard: Read headers                       │
│     • x-user-id                                          │
│     • x-user-email                                       │
│  ✅ Attach to request.user                               │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  USE CASE / BUSINESS LOGIC                               │
│  const customerId = request.user.id; ✅                  │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTATION

### 1. API Gateway - Validate JWT

**File:** `apps/api-gateway/src/auth/passport/JwtStrategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  async validate(payload: JwtPayload): Promise<UserPayload> {
    // Trả về user info sẽ được attach vào request.user
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'USER',
    };
  }
}
```

### 2. API Gateway - Forward User Info

**File:** `apps/api-gateway/src/main.ts`

```typescript
app.use('/api/dating', createProxyMiddleware({
  target: 'http://localhost:3001',
  onProxyReq: (proxyReq: any, req: any) => {
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id);
      proxyReq.setHeader('x-user-email', req.user.email);
    }
  },
}));
```

### 3. Dating Service - Read Headers

**File:** `apps/microservices/dating-service/src/application/auth/guard/HttpJwtAuthGuard.ts`

```typescript
@Injectable()
export class HttpJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    
    if (!userId) {
      throw new UnauthorizedException();
    }
    
    request.user = { id: userId, email: request.headers['x-user-email'] };
    return true;
  }
}
```

### 4. Controller - Sử dụng User

```typescript
@Controller('dating')
@UseGuards(HttpJwtAuthGuard) // ✅ Bắt buộc có JWT
export class DatingController {
  
  @Post('profiles')
  async createProfile(@Req() request: Request) {
    const customerId = (request as any).user.id; // ✅ Lấy user ID
    // ...
  }
}
```

---

## ⚙️ CONFIGURATION

**File:** `apps/api-gateway/.env`

```env
API_ACCESS_TOKEN_SECRET=your-secret-key-min-32-chars
API_ACCESS_TOKEN_EXPIRATION=1d
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false
```

**⚠️ QUAN TRỌNG:** Secret phải GIỐNG NHAU giữa Auth Service và API Gateway!

---

## 🧪 TESTING

### 1. Login để lấy token

```bash
POST http://localhost:3000/api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response: { "accessToken": "eyJhbGci..." }
```

### 2. Call protected API

```bash
GET http://localhost:3000/api/dating/profiles
Authorization: Bearer eyJhbGci...

# ✅ 200 OK - Success
# ❌ 401 Unauthorized - No/Invalid token
```

---

## 📦 INSTALL & RUN

```bash
# 1. Install dependencies
cd apps/api-gateway
npm install

# 2. Start Dating Service
cd apps/microservices/dating-service
npm run start:dev

# 3. Start API Gateway
cd apps/api-gateway
npm run start:dev
```

---

## ✅ SUMMARY

| Component | Trách nhiệm |
|-----------|-------------|
| **API Gateway** | Validate JWT token, extract user info, forward via headers |
| **Microservices** | Read headers, validate user exists, attach to request |
| **Controllers** | Access `request.user.id` trong business logic |

**Status:** ✅ Authentication system hoàn chỉnh!

Xem chi tiết tại: `docs/note/AUTHENTICATION_FLOW_GUIDE.md`

