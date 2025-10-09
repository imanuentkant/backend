# 🔐 MICROSERVICES AUTHENTICATION STRATEGY

## 📅 Ngày: October 9, 2025

---

## 🎯 OVERVIEW

Chiến lược authentication cho microservices architecture:
- **API Gateway** validate JWT và forward user info qua HTTP headers
- **Microservices** trust Gateway và sử dụng headers để authenticate

---

## 🔧 IMPLEMENTATION

### 1. API Gateway (Port 3000)

**File:** `apps/api-gateway/src/main.ts`

```typescript
// Forward user info to microservices via headers
app.use('/api/dating', createProxyMiddleware({
  target: services.dating,
  changeOrigin: true,
  onProxyReq: (proxyReq, req: any) => {
    // Forward user info from JWT to microservice
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id || '');
      proxyReq.setHeader('x-user-email', req.user.email || '');
      proxyReq.setHeader('x-user-role', req.user.role || '');
    }
  },
}));
```

**Trách nhiệm:**
- ✅ Validate JWT token (via Passport.js)
- ✅ Extract user info từ token
- ✅ Forward user info qua headers: `x-user-id`, `x-user-email`, `x-user-role`
- ✅ Route requests đến đúng microservice

---

### 2. Dating Service (Port 3001)

**File:** `apps/microservices/dating-service/src/application/auth/guard/HttpJwtAuthGuard.ts`

```typescript
@Injectable()
export class HttpJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user info exists (forwarded from API Gateway)
    const userId = request.headers['x-user-id'];
    const userEmail = request.headers['x-user-email'];
    
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    // Attach user to request
    request.user = {
      id: userId,
      email: userEmail,
    };
    
    return true;
  }
}
```

**Trách nhiệm:**
- ✅ Read user info từ headers
- ✅ Validate userId tồn tại
- ✅ Attach user object vào request
- ✅ Throw UnauthorizedException nếu không có user

---

## 🌊 REQUEST FLOW

```
Client Request (with JWT)
      ↓
API Gateway (Port 3000)
      ↓ [Validate JWT]
      ↓ [Extract user info]
      ↓ [Add headers: x-user-id, x-user-email]
      ↓
Dating Service (Port 3001)
      ↓ [Read headers]
      ↓ [Validate user exists]
      ↓ [Attach to request.user]
      ↓
Business Logic (Use Cases)
      ↓
Response
```

---

## 🔒 SECURITY CONSIDERATIONS

### ✅ Hiện tại (Development)
- API Gateway validate JWT
- Microservices trust Gateway headers
- **Đơn giản, dễ debug**

### ⚠️ Cần cải thiện (Production)

1. **Network Security:**
   - ✅ Deploy Gateway và Services trong **private network**
   - ✅ Chỉ Gateway có public endpoint
   - ✅ Services không expose ra internet

2. **Header Validation:**
   ```typescript
   // Add signature validation
   const signature = createHmac('sha256', SECRET_KEY)
     .update(`${userId}:${timestamp}`)
     .digest('hex');
   proxyReq.setHeader('x-signature', signature);
   ```

3. **Service-to-Service Auth (future):**
   - Implement **mTLS** (mutual TLS) giữa các services
   - Hoặc dùng **Service Mesh** (Istio, Linkerd)

---

## 📊 CURRENT STATUS

### ✅ Đã hoàn thành:
- [x] API Gateway forward user info qua headers
- [x] Dating Service có HttpJwtAuthGuard
- [x] Fix import paths trong DatingModule
- [x] All routes có user forwarding

### 🔄 Kế hoạch tiếp theo:
- [ ] Implement Auth Service với JWT validation API
- [ ] Add gRPC auth validation (optional)
- [ ] Add header signature validation
- [ ] Setup network isolation (Docker/K8s)

---

## 🚀 USAGE

### Controller sử dụng Auth Guard:

```typescript
@Controller('dating')
@UseGuards(HttpJwtAuthGuard) // Apply to all routes
export class DatingController {
  
  @Post('profiles')
  async createProfile(@Req() request: Request) {
    const customerId = (request as any).user.id; // ✅ Available
    // ...
  }
}
```

---

## 🔗 RELATED FILES

- `apps/api-gateway/src/main.ts` - Gateway routing & user forwarding
- `apps/microservices/dating-service/src/application/auth/guard/HttpJwtAuthGuard.ts` - Service auth guard
- `apps/microservices/dating-service/src/application/controller/DatingController.ts` - Controller usage
- `apps/microservices/dating-service/src/application/di/DatingModule.ts` - Module config

---

## 📝 NOTES

1. **Tại sao không dùng JWT validation trong mỗi service?**
   - ❌ Duplicate code
   - ❌ Mỗi service cần JWT secret
   - ❌ Phức tạp khi rotate keys
   - ✅ Centralize auth logic ở Gateway

2. **Khi nào nên dùng gRPC auth?**
   - Service-to-service calls (không qua Gateway)
   - Internal admin APIs
   - Background jobs cần auth

3. **Testing:**
   - Unit tests: Mock `request.user`
   - Integration tests: Add headers manually
   ```typescript
   await request(app.getHttpServer())
     .get('/api/dating/profiles')
     .set('x-user-id', 'test-user-123')
     .set('x-user-email', 'test@example.com');
   ```

---

## ✅ CONCLUSION

Authentication strategy:
- ✅ **Simple & Effective** cho development
- ✅ **Easy to debug** với HTTP headers
- ✅ **Centralized** auth logic ở Gateway
- ⚠️ Cần thêm security layers cho production (mTLS, network isolation)

**Status:** ✅ **IMPLEMENTED & WORKING**

