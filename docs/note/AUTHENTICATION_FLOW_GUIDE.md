# 🔐 AUTHENTICATION FLOW - HƯỚNG DẪN CHI TIẾT

## 📅 Ngày: October 9, 2025

---

## 🎯 TÓM TẮT

Hệ thống microservices sử dụng **JWT (JSON Web Token)** để xác thực người dùng:
1. **API Gateway** validate JWT và extract user info
2. **API Gateway** forward user info qua HTTP headers
3. **Microservices** đọc headers và validate user

---

## 🌊 AUTHENTICATION FLOW HOÀN CHỈNH

```
┌─────────────────────────────────────────────────────────────┐
│  1. Client Login                                            │
│     POST /api/auth/login                                    │
│     { email, password }                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Auth Service (hoặc Monolith)                            │
│     • Validate credentials                                  │
│     • Generate JWT token                                    │
│     • Return: { accessToken, refreshToken }                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Client lưu token và gửi requests                        │
│     Authorization: Bearer <JWT_TOKEN>                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. API Gateway (Port 3000)                                 │
│     • JwtStrategy validate token signature                  │
│     • Extract payload: { id, email, role }                  │
│     • Attach to request.user                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Proxy Middleware                                        │
│     • Read request.user                                     │
│     • Forward via headers:                                  │
│       x-user-id: user.id                                    │
│       x-user-email: user.email                              │
│       x-user-role: user.role                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Dating Service (Port 3001)                              │
│     • HttpJwtAuthGuard reads headers                        │
│     • Validate userId exists                                │
│     • Attach to request.user                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Business Logic (Use Cases)                              │
│     • Access customerId from request.user.id                │
│     • Process request                                       │
│     • Return response                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 IMPLEMENTATION CHI TIẾT

### 1. **API Gateway - JWT Validation**

#### File: `apps/api-gateway/src/auth/passport/JwtStrategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('API_ACCESS_TOKEN_SECRET'),
    });
  }

  // Passport tự động gọi method này sau khi verify JWT signature
  async validate(payload: JwtPayload): Promise<UserPayload> {
    if (!payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return user info sẽ được attach vào request.user
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'USER',
    };
  }
}
```

**Trách nhiệm:**
- ✅ Verify JWT signature với SECRET_KEY
- ✅ Check expiration time
- ✅ Extract user payload từ token
- ✅ Throw error nếu token invalid

---

#### File: `apps/api-gateway/src/auth/guard/JwtAuthGuard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Call JwtStrategy để validate token
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}
```

**Cách sử dụng:**
```typescript
// Protect toàn bộ route
@Controller('dating')
@UseGuards(JwtAuthGuard)
export class DatingController {
  // Tất cả endpoints cần JWT
}

// Hoặc protect từng endpoint
@Get('profiles')
@UseGuards(JwtAuthGuard)
async getProfiles(@Req() request) {
  const userId = request.user.id; // ✅ Available
}
```

---

### 2. **API Gateway - Forward User Info**

#### File: `apps/api-gateway/src/main.ts`

```typescript
app.use('/api/dating', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  onProxyReq: (proxyReq: any, req: any) => {
    // Forward user info từ request.user (đã được JwtStrategy set)
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id || '');
      proxyReq.setHeader('x-user-email', req.user.email || '');
      proxyReq.setHeader('x-user-role', req.user.role || '');
    }
  },
} as Options));
```

**Lưu ý:**
- Headers này chỉ được set nếu `req.user` tồn tại (đã qua JWT validation)
- Public routes (login, register) không có `req.user` → không có headers

---

### 3. **Dating Service - Read User Info từ Headers**

#### File: `apps/microservices/dating-service/src/application/auth/guard/HttpJwtAuthGuard.ts`

```typescript
@Injectable()
export class HttpJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Đọc user info từ headers (forwarded từ Gateway)
    const userId = request.headers['x-user-id'];
    const userEmail = request.headers['x-user-email'];
    
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    // Attach user object vào request
    request.user = {
      id: userId,
      email: userEmail,
    };
    
    return true;
  }
}
```

**Trách nhiệm:**
- ✅ Read headers: `x-user-id`, `x-user-email`
- ✅ Validate userId tồn tại
- ✅ Attach user object vào `request.user`
- ✅ Throw UnauthorizedException nếu không có user

---

### 4. **Dating Service - Sử dụng User Info**

#### File: `apps/microservices/dating-service/src/application/controller/DatingController.ts`

```typescript
@Controller('dating')
@UseGuards(HttpJwtAuthGuard) // ✅ Apply guard
export class DatingController {
  
  @Post('profiles')
  async createProfile(
    @Body() dto: CreateProfileDto,
    @Req() request: Request
  ) {
    // ✅ Get customerId từ request.user (đã được Guard set)
    const customerId = (request as any).user.id;
    
    await this.createDatingProfileUseCase.execute({
      customerId,
      displayName: dto.displayName,
      bio: dto.bio,
      // ...
    });
    
    return { success: true };
  }
}
```

---

## 🔑 JWT TOKEN FORMAT

### Token Structure:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk5NTU1NTU1LCJleHAiOjE2OTk2NDE5NTV9.signature
```

### Decoded Payload:
```json
{
  "id": "12345",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1699555555,  // Issued At
  "exp": 1699641955   // Expiration
}
```

---

## 🛠️ CONFIGURATION

### File: `apps/api-gateway/.env`

```env
# JWT Configuration
API_ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
API_ACCESS_TOKEN_EXPIRATION=1d
API_ACCESS_TOKEN_IGNORE_EXPIRATION=false
```

**⚠️ QUAN TRỌNG:**
- `API_ACCESS_TOKEN_SECRET` phải **GIỐNG NHAU** giữa Auth Service và API Gateway
- Minimum 32 characters cho production
- NEVER commit secret vào Git

---

## 🧪 TESTING AUTHENTICATION

### 1. **Login để lấy Token**

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response:
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

### 2. **Dùng Token để gọi Protected API**

```bash
GET http://localhost:3000/api/dating/profiles
Authorization: Bearer eyJhbGci...

# ✅ Success: 200 OK
# ❌ No token: 401 Unauthorized
# ❌ Invalid token: 401 Unauthorized
```

### 3. **Test với cURL**

```bash
# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# Call protected API
curl http://localhost:3000/api/dating/profiles \
  -H "Authorization: Bearer $TOKEN"
```

### 4. **Test với Postman**

1. Create request: `GET http://localhost:3000/api/dating/profiles`
2. Go to **Authorization** tab
3. Select **Type: Bearer Token**
4. Paste your JWT token
5. Send request

---

## 🔒 SECURITY BEST PRACTICES

### ✅ Đang làm tốt:
1. **Centralized Auth** - API Gateway validate tất cả
2. **Stateless JWT** - Không cần session storage
3. **Header Forwarding** - Microservices trust Gateway

### ⚠️ Cần cải thiện (Production):

#### 1. **Network Isolation**
```yaml
# Docker Compose
services:
  api-gateway:
    ports:
      - "3000:3000"  # ✅ Public
    networks:
      - frontend
      - backend

  dating-service:
    # ❌ NO ports exposed
    networks:
      - backend  # ✅ Private network only
```

#### 2. **Header Signature Validation**
```typescript
// API Gateway
const signature = createHmac('sha256', SECRET_KEY)
  .update(`${userId}:${timestamp}`)
  .digest('hex');
proxyReq.setHeader('x-signature', signature);
proxyReq.setHeader('x-timestamp', timestamp);

// Microservice
const expectedSignature = createHmac('sha256', SECRET_KEY)
  .update(`${userId}:${timestamp}`)
  .digest('hex');
if (signature !== expectedSignature) {
  throw new UnauthorizedException();
}
```

#### 3. **Rate Limiting**
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requests per minute
    }),
  ],
})
```

#### 4. **Refresh Token Rotation**
```typescript
// Implement refresh token endpoint
POST /api/auth/refresh
Authorization: Bearer <REFRESH_TOKEN>

// Response: new access token
```

---

## 🚨 TROUBLESHOOTING

### ❌ "401 Unauthorized"

**Nguyên nhân:**
1. Không có token trong header
2. Token expired
3. Token signature invalid
4. SECRET_KEY không khớp

**Giải pháp:**
```bash
# Check token expiration
jwt.io # Paste token và check "exp" field

# Check SECRET_KEY
# apps/api-gateway/.env
API_ACCESS_TOKEN_SECRET=xxx

# Auth Service .env (phải giống nhau)
API_ACCESS_TOKEN_SECRET=xxx
```

---

### ❌ "request.user is undefined" ở Service

**Nguyên nhân:**
- Microservice không có `HttpJwtAuthGuard`
- Header không được forward từ Gateway

**Giải pháp:**
```typescript
// 1. Add guard to controller
@Controller('dating')
@UseGuards(HttpJwtAuthGuard)
export class DatingController {}

// 2. Check Gateway proxy config
onProxyReq: (proxyReq, req) => {
  if (req.user) {
    proxyReq.setHeader('x-user-id', req.user.id);
  }
}
```

---

### ❌ "Cannot read property 'id' of undefined"

**Nguyên nhân:**
- `request.user` chưa được set bởi Guard

**Giải pháp:**
```typescript
// Always check user exists
const customerId = (request as any).user?.id;
if (!customerId) {
  throw new UnauthorizedException('User not found');
}
```

---

## 📊 SUMMARY

### API Gateway (Port 3000):
- ✅ **JwtStrategy**: Validate JWT signature
- ✅ **JwtAuthGuard**: Protect routes
- ✅ **Proxy Middleware**: Forward user info

### Microservices (Port 3001, 3002, ...):
- ✅ **HttpJwtAuthGuard**: Read user từ headers
- ✅ **Controllers**: Access `request.user.id`

### Flow:
```
Client → [JWT Token] → API Gateway → [Validate] → [Forward Headers] → Service → [Read Headers] → Business Logic
```

**Status:** ✅ **AUTHENTICATION SYSTEM COMPLETE!**

---

## 📞 NEXT STEPS

1. **Install dependencies:**
   ```bash
   cd apps/api-gateway
   npm install
   ```

2. **Start services:**
   ```bash
   # Terminal 1: Start Dating Service
   cd apps/microservices/dating-service
   npm run start:dev

   # Terminal 2: Start API Gateway
   cd apps/api-gateway
   npm run start:dev
   ```

3. **Test authentication:**
   - Login để lấy token
   - Call protected APIs với token
   - Verify user info trong services

---

**Created by:** AI Assistant 🤖  
**Date:** October 9, 2025  
**For:** Trung Tâm Trợ Chơi - Microservices Architecture

