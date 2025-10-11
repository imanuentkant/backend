# 🔐 Protected APIs - Auth Service

## Tổng Quan

Auth Service đã được implement với **JWT Authentication** và **Role-Based Authorization** sử dụng Clean Architecture pattern.

## Authentication & Authorization

### Authentication
- **JWT Token**: Sử dụng Bearer token trong header
- **Token Types**: 
  - Access Token (15 phút)
  - Refresh Token (7 ngày)
- **Strategy**: Passport JWT + Local

### Authorization
- **Role-Based**: ADMIN, HOST, USER, GUEST
- **Guard**: HttpRoleAuthGuard
- **Decorator**: @HttpRoles()

## API Endpoints

### 🔓 Public Endpoints (Không cần authentication)

#### 1. Register
```http
POST /api/auth/auth/register
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "USER",
  "password": "password123"
}

Response 201:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "editedAt": null,
    "removedAt": null
  }
}
```

#### 2. Login
```http
POST /api/auth/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/auth/refresh
Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🔒 Protected Endpoints (Cần JWT Token)

#### 4. Get Profile
```http
GET /api/auth/auth/profile
Authorization: Bearer <access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "editedAt": null,
    "removedAt": null
  }
}

Response 401:
{
  "code": 401,
  "message": "Unauthorized access",
  "timestamp": 1234567890
}
```

#### 5. Get Current User (từ token)
```http
GET /api/auth/auth/me
Authorization: Bearer <access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### 6. Get My Profile (từ /users)
```http
GET /api/auth/users/me
Authorization: Bearer <access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "editedAt": null,
    "removedAt": null
  }
}
```

### 👑 ADMIN Only Endpoints

#### 7. Get User by ID
```http
GET /api/auth/users/:id
Authorization: Bearer <admin_access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "HOST",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "editedAt": null,
    "removedAt": null
  }
}

Response 403:
{
  "code": 403,
  "message": "Access denied.",
  "timestamp": 1234567890
}
```

#### 8. Admin Get Users
```http
GET /api/auth/auth/admin/users
Authorization: Bearer <admin_access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "message": "Admin john@example.com accessed user list"
  }
}
```

### 🏠 HOST/ADMIN Endpoints

#### 9. Host Dashboard
```http
GET /api/auth/auth/host/dashboard
Authorization: Bearer <host_or_admin_access_token>

Response 200:
{
  "code": 200,
  "message": "Success.",
  "timestamp": 1234567890,
  "data": {
    "message": "Host john@example.com accessed dashboard"
  }
}

Response 403 (nếu không phải HOST hoặc ADMIN):
{
  "code": 403,
  "message": "Access denied.",
  "timestamp": 1234567890
}
```

## Authorization Matrix

| Endpoint | PUBLIC | USER | HOST | ADMIN |
|----------|--------|------|------|-------|
| POST /auth/register | ✅ | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ | ✅ |
| POST /auth/refresh | ✅ | ✅ | ✅ | ✅ |
| GET /auth/profile | ❌ | ✅ | ✅ | ✅ |
| GET /auth/me | ❌ | ✅ | ✅ | ✅ |
| GET /users/me | ❌ | ✅ | ✅ | ✅ |
| GET /users/:id | ❌ | ❌ | ❌ | ✅ |
| GET /auth/admin/users | ❌ | ❌ | ❌ | ✅ |
| GET /auth/host/dashboard | ❌ | ❌ | ✅ | ✅ |

## Guards Implementation

### 1. HttpJwtAuthGuard
```typescript
@UseGuards(HttpJwtAuthGuard)
```
- Validates JWT token
- Extracts user info from token
- Attaches user to request

### 2. HttpLocalAuthGuard
```typescript
@UseGuards(HttpLocalAuthGuard)
```
- Validates email/password
- Used for login endpoint

### 3. HttpRoleAuthGuard
```typescript
@UseGuards(HttpJwtAuthGuard, HttpRoleAuthGuard)
@HttpRoles(UserRole.ADMIN)
```
- Checks user roles
- Must be used with HttpJwtAuthGuard
- Requires @HttpRoles decorator

## Decorators

### @HttpUser()
```typescript
public async getProfile(@HttpUser() user: HttpUserPayload) {
  // user contains: { id, email, role }
}
```

### @HttpRoles()
```typescript
@HttpRoles(UserRole.ADMIN)
@HttpRoles(UserRole.HOST, UserRole.ADMIN)
```

## Testing with cURL

### 1. Register
```bash
curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3007/api/auth/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (with token)
```bash
curl -X GET http://localhost:3007/api/auth/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Admin Endpoint
```bash
# Tạo admin user trước
curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "password": "admin123"
  }'

# Login với admin
curl -X POST http://localhost:3007/api/auth/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Access admin endpoint
curl -X GET http://localhost:3007/api/auth/auth/admin/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## Testing with Postman

### Setup
1. Import collection từ `postman-collection.json`
2. Tạo environment với variables:
   - `base_url`: http://localhost:3007
   - `access_token`: (sẽ tự động set sau khi login)
   - `refresh_token`: (sẽ tự động set sau khi login)

### Flow Test
1. **Register**: Tạo user mới
2. **Login**: Lấy tokens
3. **Get Profile**: Test protected endpoint
4. **Get Admin Users**: Test role-based access (sẽ fail nếu không phải admin)
5. **Refresh Token**: Lấy access token mới

## Error Responses

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Unauthorized error.",
  "timestamp": 1234567890
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Access denied.",
  "timestamp": 1234567890
}
```

### 404 Not Found
```json
{
  "code": 1000,
  "message": "Entity not found.",
  "timestamp": 1234567890
}
```

### 409 Conflict
```json
{
  "code": 1004,
  "message": "Entity already exists.",
  "timestamp": 1234567890,
  "data": {
    "overrideMessage": "User already exists."
  }
}
```

## Swagger Documentation

Access full API documentation at:
```
http://localhost:3007/api/docs
```

Features:
- Interactive API testing
- Request/Response examples
- Schema definitions
- Try it out functionality
- Bearer token authorization

## Security Best Practices

1. **Token Storage**
   - Store access token in memory
   - Store refresh token in httpOnly cookie (recommended) or localStorage
   - Never expose tokens in URL

2. **Token Refresh**
   - Refresh access token before expiry
   - Implement automatic token refresh in client

3. **Password Security**
   - Minimum 6 characters (có thể tăng)
   - Hashed với bcrypt
   - Never return password in responses

4. **CORS**
   - Configure allowed origins
   - Don't use `*` in production

5. **Rate Limiting**
   - Implement rate limiting (TODO)
   - Especially for login endpoint

## Development Tips

### Test Different Roles
```bash
# Create users with different roles
curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"User","lastName":"Test","email":"user@test.com","role":"USER","password":"123456"}'

curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Host","lastName":"Test","email":"host@test.com","role":"HOST","password":"123456"}'

curl -X POST http://localhost:3007/api/auth/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"Test","email":"admin@test.com","role":"ADMIN","password":"123456"}'
```

### Debug Token
```bash
# Decode JWT token at https://jwt.io
# Paste your access token to see payload
```

## Next Steps

- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add 2FA
- [ ] Add OAuth providers (Google, Facebook)
- [ ] Add rate limiting
- [ ] Add API versioning
- [ ] Add audit logs
- [ ] Add user management CRUD (for admin)

---

**Status**: ✅ COMPLETE
**Build**: ✅ PASSING
**Documentation**: ✅ COMPLETE

