-- ========================================
-- FIX ENUM ERROR - Auth Service
-- Chạy script này trong pgAdmin Query Tool
-- ========================================

-- Bước 1: Drop tất cả tables và enums cũ
DROP TABLE IF EXISTS refresh_token CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- Bước 2: Create User table (dùng VARCHAR cho role, không dùng enum)
CREATE TABLE "user" (
  id VARCHAR PRIMARY KEY,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL, -- VARCHAR thay vì ENUM
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "editedAt" TIMESTAMP NULL,
  "removedAt" TIMESTAMP NULL
);

-- Bước 3: Create RefreshToken table
CREATE TABLE refresh_token (
  id VARCHAR PRIMARY KEY,
  "userId" VARCHAR NOT NULL,
  token VARCHAR NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Bước 4: Create indexes cho performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);
CREATE INDEX idx_refresh_token_user ON refresh_token("userId");
CREATE INDEX idx_refresh_token_token ON refresh_token(token);

-- Bước 5: Verify
SELECT 'Tables created successfully! ✅' AS status;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- Show columns of user table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user'
ORDER BY ordinal_position;

