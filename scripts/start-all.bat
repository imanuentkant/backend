@echo off
echo 🚀 Starting Full Stack Monorepo...
echo.

echo 📦 Starting Docker services...
docker-compose up -d

echo.
echo ✅ PostgreSQL: localhost:5432
echo ✅ MinIO: localhost:9000
echo ✅ MinIO Console: localhost:9001
echo.

echo 🔧 Starting Backend API...
echo    Backend: http://localhost:3000
echo    Swagger: http://localhost:3000/api/docs
echo.

echo 📱 To start frontends (in separate terminals):
echo.
echo    Terminal 2 - Client:
echo    cd client-frontend ^&^& npm run dev
echo    → http://localhost:3001
echo.
echo    Terminal 3 - Host/Admin:
echo    cd host-admin-frontend ^&^& npm run dev -- -p 3002
echo    → http://localhost:3002
echo.

npm run start:dev
