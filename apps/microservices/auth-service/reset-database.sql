-- Reset Auth Service Database
-- WARNING: This will delete all data!

-- Drop database if exists
DROP DATABASE IF EXISTS auth_service;

-- Create fresh database
CREATE DATABASE auth_service;

-- Connect to new database
\c auth_service

-- Verify (optional)
SELECT 'Database auth_service created successfully!' AS status;

