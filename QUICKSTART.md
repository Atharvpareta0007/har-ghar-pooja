# ⚡ Quick Start Guide

Get Har Ghar Pooja running in under 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ installed
- Terminal/Command Prompt

## 🚀 One-Command Startup

### macOS/Linux

```bash
chmod +x start.sh
./start.sh
```

### Windows

```bash
# Start backend
cd backend
copy .env.example .env
docker-compose up -d
timeout /t 10
docker-compose exec backend python -m app.seed_data

# Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📍 Access Points

Once started, access:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Login

Use these pre-seeded accounts:

| Role | Phone | Password |
|------|-------|----------|
| **Admin** | 919999999999 | Admin@123 |
| **User** | 919876543210 | User@123 |
| **Pandit** | 919111111111 | Pandit@123 |

## 🎯 Quick Test Flow

1. **Visit** http://localhost:3000
2. **Click** "Login" button
3. **Login as Admin** (919999999999 / Admin@123)
4. **View** admin dashboard with stats
5. **Try User account** (919876543210 / User@123)
6. **Browse** available pujas
7. **Check** pricing section

## 🛑 Stopping Services

### macOS/Linux
```bash
chmod +x stop.sh
./stop.sh
```

### Windows
```bash
cd backend
docker-compose down
# Close frontend terminal (Ctrl+C)
```

## 📊 What's Included

After startup, you'll have:

- ✅ PostgreSQL database with seeded data
- ✅ 15 pre-configured pujas with Hindi names
- ✅ 1 admin, 1 user, 3 pandits
- ✅ FastAPI backend with Swagger docs
- ✅ React frontend with spiritual theme
- ✅ All API endpoints functional

## 🔍 Verify Everything Works

### Test API
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}

curl http://localhost:8000/api/pujas
# Expected: JSON array of 15 pujas
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919999999999","password":"Admin@123"}'
# Expected: JSON with access_token
```

## 🐛 Troubleshooting

**Port 8000 already in use:**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
# Then: taskkill /PID <PID> /F
```

**Port 3000 already in use:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

**Database not connecting:**
```bash
cd backend
docker-compose down -v
docker-compose up -d
sleep 10
docker-compose exec backend python -m app.seed_data
```

## 📚 Next Steps

- Read [SETUP.md](SETUP.md) for manual setup
- Check [README.md](README.md) for features
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production

## 🎉 You're Ready!

Start building your spiritual services platform!

Need help? Check the documentation or open an issue.
