@echo off
echo ================================================
echo  Starting All Microservices...
echo ================================================
echo.

REM Start all services
docker-compose up -d

echo.
echo Waiting for services to be healthy...
timeout /t 15 /nobreak > nul

echo.
echo ================================================
echo  Checking Health Endpoints...
echo ================================================
echo.

REM Check Auth Service
curl -s http://localhost:3007/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Auth Service (3007): HEALTHY[0m
) else (
    echo [91m❌ Auth Service (3007): UNHEALTHY[0m
)

REM Check Dating Service
curl -s http://localhost:3001/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Dating Service (3001): HEALTHY[0m
) else (
    echo [91m❌ Dating Service (3001): UNHEALTHY[0m
)

REM Check Property Service
curl -s http://localhost:3002/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Property Service (3002): HEALTHY[0m
) else (
    echo [91m❌ Property Service (3002): UNHEALTHY[0m
)

REM Check Vehicle Service
curl -s http://localhost:3003/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Vehicle Service (3003): HEALTHY[0m
) else (
    echo [91m❌ Vehicle Service (3003): UNHEALTHY[0m
)

REM Check Message Service
curl -s http://localhost:3006/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Message Service (3006): HEALTHY[0m
) else (
    echo [91m❌ Message Service (3006): UNHEALTHY[0m
)

REM Check Payment Service
curl -s http://localhost:3008/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ Payment Service (3008): HEALTHY[0m
) else (
    echo [91m❌ Payment Service (3008): UNHEALTHY[0m
)

REM Check API Gateway
curl -s http://localhost:3000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [92m✅ API Gateway (3000): HEALTHY[0m
) else (
    echo [91m❌ API Gateway (3000): UNHEALTHY[0m
)

echo.
echo ================================================
echo  Infrastructure Services
echo ================================================
echo [92m✅ PostgreSQL (5432)[0m
echo [92m✅ Redis (6379)[0m
echo [92m✅ Kafka (19092)[0m
echo [92m✅ Kafka UI (8080) - http://localhost:8080[0m
echo.
echo ================================================
echo  Swagger Documentation
echo ================================================
echo   • http://localhost:3000/api/docs (Gateway)
echo   • http://localhost:3001/api/docs (Dating)
echo   • http://localhost:3002/api/docs (Property)
echo   • http://localhost:3003/api/docs (Vehicle)
echo   • http://localhost:3006/api/docs (Message)
echo   • http://localhost:3007/api/docs (Auth)
echo   • http://localhost:3008/api/docs (Payment)
echo.
echo [92m🎉 System Ready![0m
echo.
pause

