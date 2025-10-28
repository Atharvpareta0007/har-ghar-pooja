# 🕉️ Har Ghar Pooja - AsthaSetu for Every Devotee

A complete production-ready full-stack web platform for spiritual services, allowing users to book pujas, consult verified Pandits, make secure payments, and join live virtual pujas.

## 🎯 Features

### User Features
- ✅ Register/Login with phone authentication
- ✅ Browse available pujas with Hindi names
- ✅ Book puja with date, time, and address
- ✅ Secure payment integration (Razorpay/Stripe)
- ✅ View, cancel, or reschedule bookings
- ✅ Join live puja streams
- ✅ Chatbot for spiritual Q&A

### Pandit Features
- ✅ Apply to become a pandit
- ✅ Manage bookings (accept/decline/complete)
- ✅ View earnings and schedule
- ✅ Manage offered pujas and pricing

### Admin Features
- ✅ Approve/Reject Pandits
- ✅ Manage puja catalog (CRUD)
- ✅ View all users, bookings, payments
- ✅ Dashboard with revenue analytics
- ✅ Create virtual puja sessions

## 🏗️ Architecture

```
hgp/
├── backend/          # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── routers/  # API endpoints
│   │   ├── models.py # Database models
│   │   ├── schemas.py # Pydantic schemas
│   │   ├── auth.py   # JWT authentication
│   │   └── main.py   # FastAPI app
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   └── context/  # Auth context
    └── package.json
```

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
cd hgp

# Start backend
cd backend
cp .env.example .env
docker-compose up -d

# Seed database
docker-compose exec backend python -m app.seed_data

# Start frontend (in new terminal)
cd ../frontend
npm install
npm run dev
```

### Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL and update .env
cp .env.example .env

# Run seed script
python -m app.seed_data

# Start server
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: PostgreSQL on localhost:5432

## 🔐 Default Credentials

| Role | Phone | Password |
|------|-------|----------|
| Admin | 919999999999 | Admin@123 |
| User | 919876543210 | User@123 |
| Pandit | 919111111111 | Pandit@123 |

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Pujas
- `GET /api/pujas` - List all pujas
- `POST /api/admin/pujas` - Create puja (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User bookings
- `PATCH /api/bookings/{id}/cancel` - Cancel booking

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/webhook` - Payment webhook

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `PATCH /api/admin/pandits/{id}/approve` - Approve pandit

### Chatbot
- `POST /api/chatbot` - Ask spiritual questions
- `POST /api/chatbot/recommend` - Get puja recommendations

## 💾 Database Schema

### Tables
- **users** - User accounts (user, pandit, admin)
- **pandits** - Pandit profiles
- **puja_types** - Puja catalog
- **bookings** - Puja bookings
- **payments** - Payment records
- **consultations** - Pandit consultations
- **virtual_sessions** - Live puja sessions

## 🎨 Frontend Theme

- **Colors**: White + Saffron Orange (#FF9933)
- **Fonts**: Poppins, Nunito
- **Style**: Spiritual + Modern hybrid
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Test API with Postman collection
# Import postman_collection.json
```

## 📦 Deployment

### Backend (Render/Heroku)

```bash
# Deploy using Docker
docker build -t hargharpooja-backend .
docker push your-registry/hargharpooja-backend

# Or use Render/Heroku
# Connect GitHub repo and deploy
```

### Frontend (Netlify/Vercel)

```bash
cd frontend
npm run build

# Deploy dist/ folder to Netlify/Vercel
# Or connect GitHub repo for auto-deploy
```

## 🛠️ Tech Stack

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL
- SQLAlchemy ORM
- JWT Authentication
- Razorpay/Stripe
- Docker

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router
- Framer Motion

## 📄 Puja Catalog

All 15 pujas seeded with Hindi names:
- पितृ शांति (₹5,100)
- नारायण बली (₹21,000)
- काल सर्प दोष (₹4,100)
- रुद्राभिषेक (₹1,100-11,000)
- मंगल शांति (₹3,100)
- भात पूजन (₹2,100)
- ग्रहण दोष शांति (₹2,100)
- नवग्रह शांति (₹2,500)
- चांडाल दोष शांति (₹2,500)
- कुंभ विवाह (₹3,500)
- अर्क विवाह (₹3,100)
- वास्तु पूजन (₹11,000)
- ग्रह शांति (₹1,100)
- जप (₹1,000-51,000)
- वैवाहिक एवं मांगलिक पूजन (₹11,000)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Built with 🕉️ and ❤️ for devotees everywhere**
