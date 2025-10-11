@echo off
echo ========================================
echo  Reset Auth Service Database
echo ========================================
echo.
echo WARNING: This will DELETE all data in auth_service database!
echo.
pause

echo.
echo [1/3] Stopping any running service...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Dropping and recreating database...
psql -U postgres -c "DROP DATABASE IF EXISTS auth_service;"
psql -U postgres -c "CREATE DATABASE auth_service;"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to reset database!
    echo Make sure PostgreSQL is running and you have correct credentials.
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Database reset successfully!
echo.
echo ========================================
echo  Ready to start service
echo ========================================
echo.
echo Run: npm run start:dev
echo.
pause

