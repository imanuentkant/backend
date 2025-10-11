@echo off
echo ========================================
echo  Auth Service - Starting...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking .env file...
if not exist .env (
    echo Creating .env file...
    (
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_USERNAME=postgres
        echo DB_PASSWORD=postgres
        echo DB_NAME=auth_service
        echo API_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-in-production
        echo API_ACCESS_TOKEN_TTL_IN_MINUTES=15
        echo API_ACCESS_TOKEN_IGNORE_EXPIRATION=false
        echo API_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-in-production
        echo API_REFRESH_TOKEN_TTL_IN_DAYS=7
        echo API_LOGIN_USERNAME_FIELD=email
        echo API_LOGIN_PASSWORD_FIELD=password
        echo PORT=3007
        echo NODE_ENV=development
        echo CORS_ORIGIN=*
    ) > .env
    echo .env file created!
) else (
    echo .env file exists!
)
echo.

echo [2/3] Installing dependencies...
call npm install
echo.

echo [3/3] Starting service...
echo ========================================
echo  Service URLs:
echo  - Swagger UI: http://localhost:3007/api/docs
echo  - Health Check: http://localhost:3007/health
echo  - Base URL: http://localhost:3007/api/auth
echo ========================================
echo.
echo Starting in 3 seconds...
timeout /t 3 /nobreak >nul

call npm run start:dev

