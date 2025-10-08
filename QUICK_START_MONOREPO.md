# 🚀 QUICK START - MONOREPO

## ✅ CÀI ĐẶT LẦN ĐẦU

### 1. Install All Dependencies:
```bash
# Backend (root folder)
npm install

# Client Frontend
cd client-frontend
npm install
cd ..

# Host/Admin Frontend
cd host-admin-frontend
npm install
cd ..
```

### 2. Setup Environment:
```bash
# Backend
cp env/development.env .env

# Client Frontend
cd client-frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
cd ..

# Host/Admin Frontend
cd host-admin-frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
cd ..
```

### 3. Start Docker Services:
```bash
docker-compose up -d
```

### 4. Run Database Migrations:
```bash
npm run migration:run
```

---

## 🚀 CHẠY HỆ THỐNG (4 Terminals)

### Terminal 1 - Backend:
```bash
npm run start:dev
# ✅ http://localhost:3000
# ✅ http://localhost:3000/api/docs
```

### Terminal 2 - Database (Optional, if not using Docker):
```bash
docker-compose up
# ✅ PostgreSQL: 5432
# ✅ MinIO: 9000
```

### Terminal 3 - Client Frontend:
```bash
cd client-frontend
npm run dev
# ✅ http://localhost:3001
```

### Terminal 4 - Host/Admin Frontend:
```bash
cd host-admin-frontend
npm run dev -- -p 3002
# ✅ http://localhost:3002
```

---

## 🎯 ACCESS URLS

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:3000 | RESTful APIs |
| Swagger Docs | http://localhost:3000/api/docs | API documentation |
| Client App | http://localhost:3001 | Guest booking |
| Host Dashboard | http://localhost:3002 | Property management |
| MinIO Console | http://localhost:9001 | File storage admin |
| PostgreSQL | localhost:5432 | Database |

---

## 🔐 DEFAULT CREDENTIALS

### MinIO:
- Username: `minioadmin`
- Password: `minioadmin`
- Console: http://localhost:9001

### PostgreSQL:
- Host: `localhost`
- Port: `5432`
- Database: `trungtamtrochoi`
- Username: `postgres`
- Password: `postgres`

---

## ✅ VERIFY INSTALLATION

### 1. Check Backend:
```bash
curl http://localhost:3000/api/docs
# Should return Swagger UI
```

### 2. Check Client Frontend:
```bash
curl http://localhost:3001
# Should return Next.js page
```

### 3. Check Host/Admin:
```bash
curl http://localhost:3002
# Should return Next.js page
```

### 4. Check Database:
```bash
psql -h localhost -U postgres -d trungtamtrochoi -c "SELECT COUNT(*) FROM users;"
# Should return count
```

---

## 🐛 TROUBLESHOOTING

### Backend won't start:
- Check PostgreSQL is running: `docker ps`
- Check .env file exists
- Check port 3000 is free

### Frontend build errors:
- Run `npm install` in each frontend
- Check Node.js version: `node -v` (should be 18+)
- Delete `.next` folder and rebuild

### Database connection errors:
- Check docker-compose up
- Check DATABASE_HOST in .env
- Check PostgreSQL logs: `docker logs <container-id>`

---

## 📝 DEVELOPMENT TIPS

### Hot Reload:
- ✅ Backend: Auto-reload on file change
- ✅ Client: Auto-reload on file change
- ✅ Host: Auto-reload on file change

### API Testing:
- Use Swagger UI: http://localhost:3000/api/docs
- Or use Postman/Insomnia

### Database GUI:
- pgAdmin: http://localhost:5050 (if added to docker-compose)
- Or use DBeaver, TablePlus

---

## 🎊 STATUS

**Backend:** ✅ Running  
**Client:** ✅ Running  
**Host:** ✅ Running  
**Database:** ✅ Connected  
**Storage:** ✅ Ready

**🎉 ALL SYSTEMS GO!** 🚀
