# 🔐 AUTH SERVICE vs API GATEWAY AUTH - GIẢI THÍCH

## 📅 Ngày: October 9, 2025

---

## ❓ CÂU HỎI: Tại sao đã có Auth Service rồi mà còn thêm Auth trong Gateway?

### ✅ GIẢI ĐÁP:

**Auth Service** và **API Gateway Auth** có **2 trách nhiệm KHÁC NHAU**:

---

## 🏗️ KIẾN TRÚC PHÂN TÁCH TRÁCH NHIỆM

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ├─ Login/Register ─────────────────────────┐
                 │                                           │
                 │                                           ▼
                 │                         ┌─────────────────────────────┐
                 │                         │  AUTH SERVICE (Port 3007)   │
                 │                         │  📝 GENERATE TOKENS         │
                 │                         ├─────────────────────────────┤
                 │                         │ • POST /login               │
                 │                         │ • POST /register            │
                 │                         │ • POST /refresh             │
                 │                         │ • POST /logout              │
                 │                         │ • POST /forgot-password     │
                 │                         │                             │
                 │                         │ ✅ Generate JWT             │
                 │                         │ ✅ Manage users             │
                 │                         │ ✅ Hash passwords           │
                 │                         │ ✅ Store refresh tokens     │
                 │                         └─────────────────────────────┘
                 │                                           │
                 │                                           │
                 │ ◄─────── Return JWT Token ────────────────┘
                 │
                 │
                 ├─ Call Protected APIs ────────────────────┐
                 │  (với JWT trong header)                  │
                 │                                           ▼
                 │                         ┌─────────────────────────────┐
                 │                         │  API GATEWAY (Port 3000)    │
                 │                         │  🔍 VALIDATE TOKENS         │
                 │                         ├─────────────────────────────┤
                 │                         │ JwtStrategy:                │
                 │                         │ ✅ Verify JWT signature     │
                 │                         │ ✅ Check expiration         │
                 │                         │ ✅ Extract user info        │
                 │                         │ ✅ Forward to services      │
                 │                         │                             │
                 │                         │ ❌ KHÔNG generate token     │
                 │                         │ ❌ KHÔNG manage users       │
                 │                         └─────────────┬───────────────┘
                 │                                       │
                 │                                       │ (Forward headers)
                 │                                       ▼
                 │                         ┌─────────────────────────────┐
                 │                         │  DATING SERVICE (3001)      │
                 │                         │  PROPERTY SERVICE (3002)    │
                 │                         │  ...                        │
                 │                         └─────────────────────────────┘
                 │
                 └────────────────────────────────────────────────────────┘
```

---

## 📊 SO SÁNH CHI TIẾT

| Đặc điểm | AUTH SERVICE (3007) | API GATEWAY AUTH (3000) |
|----------|---------------------|-------------------------|
| **Mục đích** | Generate & Manage tokens | Validate tokens |
| **Generate JWT** | ✅ YES | ❌ NO |
| **Validate JWT** | ❌ NO (không cần) | ✅ YES |
| **Manage Users** | ✅ YES | ❌ NO |
| **Hash Passwords** | ✅ YES | ❌ NO |
| **Store Tokens** | ✅ YES (refresh tokens) | ❌ NO |
| **Routes** | `/login`, `/register`, `/refresh` | Tất cả protected routes |
| **Database** | ✅ Connect to User DB | ❌ Không cần DB |
| **Dependencies** | TypeORM, bcrypt, @nestjs/jwt | passport-jwt only |

---

## 🔄 FLOW HOÀN CHỈNH

### 1️⃣ **LOGIN FLOW** (Auth Service làm việc)

```
Client
  │
  │ POST /api/auth/login
  │ { email, password }
  ▼
API Gateway
  │ (không validate, forward thẳng)
  │ Route to Auth Service
  ▼
AUTH SERVICE (Port 3007)
  │
  ├─► Check email/password in DB
  ├─► Hash password & compare
  ├─► Generate JWT with secret
  ├─► Store refresh token
  │
  └─► Return: { accessToken, refreshToken }
       │
       ▼
Client lưu token
```

**AUTH SERVICE TẠO TOKEN**

---

### 2️⃣ **PROTECTED API FLOW** (Gateway Auth làm việc)

```
Client
  │
  │ GET /api/dating/profiles
  │ Authorization: Bearer <JWT>
  ▼
API GATEWAY (Port 3000)
  │
  ├─► JwtStrategy.validate()
  ├─► Verify signature với SECRET
  ├─► Check expiration
  ├─► Extract { id, email, role }
  ├─► Set request.user
  │
  │ Forward to Dating Service
  │ Headers: x-user-id, x-user-email
  ▼
DATING SERVICE (Port 3001)
  │
  ├─► HttpJwtAuthGuard reads headers
  ├─► Validate userId exists
  │
  └─► Process business logic
```

**API GATEWAY VALIDATE TOKEN**

---

## 💡 TẠI SAO THIẾT KẾ NHƯ VẬY?

### ✅ **Lý do 1: Separation of Concerns (Tách biệt trách nhiệm)**

```typescript
// Auth Service - Business Logic
class AuthService {
  async login(email, password) {
    const user = await this.findUser(email);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    
    // GENERATE TOKEN - ĐÚNG CHỖ!
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}

// API Gateway - Validation Logic
class JwtStrategy {
  async validate(payload: JwtPayload) {
    // VALIDATE TOKEN - ĐÚNG CHỖ!
    if (!payload.id) throw new UnauthorizedException();
    return { id: payload.id, email: payload.email };
  }
}
```

---

### ✅ **Lý do 2: Centralized Validation**

Nếu không có auth ở Gateway:
```
❌ Dating Service phải validate JWT
❌ Property Service phải validate JWT
❌ Vehicle Service phải validate JWT
❌ Message Service phải validate JWT
❌ Payment Service phải validate JWT

→ DUPLICATE CODE Ở 6 SERVICES!
→ Phải update SECRET ở 6 nơi!
→ Khó maintain!
```

Với auth ở Gateway:
```
✅ Chỉ Gateway validate JWT
✅ Services chỉ cần đọc headers
✅ SECRET chỉ ở 2 nơi: Auth Service + Gateway
✅ Dễ maintain!
```

---

### ✅ **Lý do 3: Performance**

```
Gateway validates token ONCE
         ↓
    Forward to 5 services
         ↓
Services chỉ đọc headers (fast!)
```

Nếu mỗi service validate:
```
❌ Dating Service validates token
❌ Property Service validates token
❌ Vehicle Service validates token
→ Lặp lại validation 5 lần! (slow!)
```

---

### ✅ **Lý do 4: Security**

```
┌─────────────────────────────────────────────────┐
│  PUBLIC INTERNET                                │
└──────────────────┬──────────────────────────────┘
                   │ JWT Token
                   ▼
         ┌─────────────────────┐
         │  API GATEWAY        │  ✅ Public, có auth
         │  Validate JWT       │
         └──────────┬──────────┘
                    │ (Private Network)
         ┌──────────┴──────────┐
         │                     │
    ┌────▼────┐          ┌────▼────┐
    │ Dating  │          │Property │  ✅ Private, trust Gateway
    │ Service │          │ Service │
    └─────────┘          └─────────┘

❌ Services KHÔNG expose ra internet
✅ Chỉ Gateway có public endpoint
✅ Services trust Gateway (không cần validate lại JWT)
```

---

## 🎯 PATTERN CHUẨN TRONG MICROSERVICES

Đây là **API Gateway Pattern** - một trong những pattern phổ biến nhất:

### Các công ty lớn dùng pattern này:

1. **Netflix** - Zuul Gateway
2. **Amazon** - AWS API Gateway
3. **Google** - Cloud Endpoints
4. **Microsoft** - Azure API Management

### Đặc điểm:
- ✅ Gateway = Single Entry Point
- ✅ Gateway = Authentication & Authorization
- ✅ Gateway = Routing & Load Balancing
- ✅ Services = Business Logic Only

---

## 📝 CODE EXAMPLES

### Auth Service - Generate Token

```typescript
// apps/microservices/auth-service/src/auth/AuthService.ts
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // 1. Find user
    const user = await this.userRepository.findByEmail(email);
    
    // 2. Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException();
    
    // 3. GENERATE TOKEN ✅
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    return { accessToken };
  }
}
```

---

### API Gateway - Validate Token

```typescript
// apps/api-gateway/src/auth/passport/JwtStrategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('API_ACCESS_TOKEN_SECRET'),
    });
  }

  // VALIDATE TOKEN ✅
  async validate(payload: JwtPayload): Promise<UserPayload> {
    // Passport đã verify signature rồi
    // Chỉ cần extract user info
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

---

## 🔑 SECRET KEY MANAGEMENT

**⚠️ QUAN TRỌNG:** SECRET phải GIỐNG NHAU giữa Auth Service và Gateway!

### Auth Service `.env`:
```env
API_ACCESS_TOKEN_SECRET=my-super-secret-key-min-32-characters
```

### API Gateway `.env`:
```env
API_ACCESS_TOKEN_SECRET=my-super-secret-key-min-32-characters  # ← PHẢI GIỐNG!
```

**Lý do:**
- Auth Service dùng SECRET để **SIGN** token
- API Gateway dùng SECRET để **VERIFY** token
- Nếu khác nhau → Gateway không verify được!

---

## 🚀 ALTERNATIVE APPROACHES (Không khuyến nghị)

### ❌ Approach 1: Services tự validate JWT

```
Client → Gateway → Dating Service
                       ↓
                   Validate JWT ❌ (duplicate)
                       ↓
                   Business Logic
```

**Nhược điểm:**
- Duplicate validation code ở mọi service
- Mỗi service cần JWT secret
- Khó maintain
- Slow (validate nhiều lần)

---

### ❌ Approach 2: Gateway gọi Auth Service để validate

```
Client → Gateway
           ↓
       Call Auth Service API: /validate-token ❌
           ↓ (HTTP call, slow!)
       Auth Service validates
           ↓
       Return user info
           ↓
       Forward to Dating Service
```

**Nhược điểm:**
- Extra HTTP call (latency)
- Auth Service bị overload
- Single point of failure
- Slow!

---

### ✅ Approach 3: Current (Gateway validate locally)

```
Client → Gateway
           ↓
       JwtStrategy validates (local, fast!) ✅
           ↓
       Forward to Services
```

**Ưu điểm:**
- Fast (no HTTP calls)
- No extra load on Auth Service
- Gateway can cache validation
- Best performance!

---

## 📊 SUMMARY

| Component | Trách nhiệm | Code |
|-----------|-------------|------|
| **Auth Service** | Generate tokens, Manage users | `jwtService.sign()` |
| **API Gateway** | Validate tokens, Route requests | `JwtStrategy.validate()` |
| **Microservices** | Read user from headers | `request.headers['x-user-id']` |

---

## ✅ CONCLUSION

### TẠI SAO CẦN 2 THÀNH PHẦN?

1. **Auth Service** = Token Generation + User Management
   - Là **Factory** tạo ra tokens
   - Business logic: login, register, password reset
   
2. **API Gateway Auth** = Token Validation + Request Routing
   - Là **Security Guard** kiểm tra tokens
   - Infrastructure logic: validate, route, forward

### ANALOGY (Ví dụ thực tế):

```
Auth Service = Công an cấp CMND/CCCD
             ↓
          (Generate ID)
             ↓
API Gateway = Bảo vệ ở cửa công ty
             ↓
          (Check ID hợp lệ)
             ↓
Services = Các phòng ban trong công ty
          (Không cần check ID lại, tin bảo vệ)
```

---

**Kết luận:** Đây là **CHUẨN** trong microservices architecture, không phải duplicate hay thừa! 🎯

**Status:** ✅ **ARCHITECTURE CORRECT & OPTIMAL!**

---

**Created by:** AI Assistant 🤖  
**Date:** October 9, 2025  
**For:** Trung Tâm Trợ Chơi - Microservices Architecture

