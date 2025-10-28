# 🛠️ Complete Setup Guide

Step-by-step instructions to get Har Ghar Pooja running on your local machine.

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ and npm installed
- PostgreSQL 15+ installed
- Git installed
- Docker (optional, but recommended)

---

## 🐳 Method 1: Docker Setup (Easiest)

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd hgp
```

### Step 2: Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env if needed (defaults work for Docker)
```

### Step 3: Start Services
```bash
# Start PostgreSQL and Backend
docker-compose up -d

# Wait 10 seconds for database to be ready
sleep 10

# Seed the database
docker-compose exec backend python -m app.seed_data
```

### Step 4: Start Frontend
```bash
# Open new terminal
cd frontend
npm install
npm run dev
```

### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 💻 Method 2: Manual Setup

### Backend Setup

#### Step 1: Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```

#### Step 2: Create Database
```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE hargharpooja;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE hargharpooja TO postgres;
\q
```

#### Step 3: Setup Python Environment
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 4: Configure Environment
```bash
cp .env.example .env

# Edit .env file
# Update DATABASE_URL if needed:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hargharpooja
```

#### Step 5: Seed Database
```bash
python -m app.seed_data
```

#### Step 6: Start Backend
```bash
uvicorn app.main:app --reload
```

Backend should be running on http://localhost:8000

### Frontend Setup

#### Step 1: Install Dependencies
```bash
# Open new terminal
cd frontend
npm install
```

#### Step 2: Start Development Server
```bash
npm run dev
```

Frontend should be running on http://localhost:3000

---

## ✅ Verify Installation

### 1. Check Backend Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### 2. Test Database
```bash
curl http://localhost:8000/api/pujas
# Expected: JSON array of pujas
```

### 3. Test Login
Visit http://localhost:3000/login
- Phone: 919999999999
- Password: Admin@123

---

## 🎯 Default Accounts

After seeding, these accounts are available:

| Role | Phone | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | 919999999999 | Admin@123 | /admin |
| User | 919876543210 | User@123 | /dashboard |
| Pandit | 919111111111 | Pandit@123 | /pandit |

Additional Pandits:
- 919222222222 / Pandit@123
- 919333333333 / Pandit@123

---

## 🔧 Common Issues

### Issue: Port Already in Use

**Backend (8000):**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (3000):**
```bash
# Change port in vite.config.js
server: {
  port: 3001  // or any available port
}
```

### Issue: Database Connection Failed

```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Restart if needed
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql     # Linux
```

### Issue: Module Not Found (Python)

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: npm Install Errors

```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors

Update `backend/.env`:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Restart backend after changes.

---

## 🧪 Testing the Application

### Test User Flow
1. Register new user at /register
2. Login at /login
3. Browse pujas on homepage
4. View dashboard at /dashboard

### Test Admin Flow
1. Login with admin credentials
2. Go to /admin
3. View statistics
4. Approve/reject pandits

### Test Pandit Flow
1. Login with pandit credentials
2. Go to /pandit
3. View and manage bookings

### Test API Endpoints
```bash
# Get all pujas
curl http://localhost:8000/api/pujas

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919999999999","password":"Admin@123"}'

# Get stats (needs token)
curl http://localhost:8000/api/admin/stats \
  -H "Authorization: Bearer <your-token>"
```

---

## 📱 Mobile Testing

```bash
# Find your local IP
# macOS/Linux
ifconfig | grep "inet "

# Update CORS in backend/.env
CORS_ORIGINS=http://localhost:3000,http://192.168.x.x:3000

# Access from mobile
http://192.168.x.x:3000
```

---

## 🔄 Updating Code

```bash
# Pull latest changes
git pull origin main

# Update backend
cd backend
pip install -r requirements.txt
# Restart backend

# Update frontend
cd frontend
npm install
# Restart frontend
```

---

## 🧹 Clean Installation

If you need to start fresh:

```bash
# Stop all services
docker-compose down -v  # If using Docker

# Delete database
psql postgres
DROP DATABASE hargharpooja;
CREATE DATABASE hargharpooja;
\q

# Delete Python cache
cd backend
rm -rf __pycache__ app/__pycache__
deactivate
rm -rf venv

# Delete Node modules
cd ../frontend
rm -rf node_modules package-lock.json

# Start setup from scratch
```

---

## 📚 Next Steps

- Read [README.md](README.md) for project overview
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- View API docs at http://localhost:8000/docs
- Customize pujas in database or via admin panel

---

## 🆘 Getting Help

If you encounter issues:
1. Check error logs in terminal
2. Review this troubleshooting section
3. Verify all prerequisites are installed
4. Check database connection
5. Ensure ports are not blocked

Happy coding! 🕉️
