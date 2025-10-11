-- Auth Service - Create Tables
-- Chạy script này trong pgAdmin hoặc psql

-- Drop tables và enums nếu tồn tại
DROP TABLE IF EXISTS refresh_token CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- Create User table
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
CREATE INDEX idx_refresh_token_user ON refresh_token("userId");
CREATE INDEX idx_refresh_token_token ON refresh_token(token);

-- Verify
SELECT 'Tables created successfully!' AS status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

