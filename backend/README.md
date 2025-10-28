# Har Ghar Pooja - Backend API

AsthaSetu for Every Devotee - Full-stack spiritual services platform

## Quick Start

### Using Docker (Recommended)

```bash
# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# Run seed script
docker-compose exec backend python -m app.seed_data

# Access API at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL database
# Update DATABASE_URL in .env

# Run migrations
python -m app.seed_data

# Start server
uvicorn app.main:app --reload
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token

### Pujas
- GET `/api/pujas` - List all pujas
- POST `/api/admin/pujas` - Create puja (admin)

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - User bookings

### Payments
- POST `/api/payments/create` - Create payment
- POST `/api/payments/webhook` - Payment webhook

### Admin
- GET `/api/admin/stats` - Dashboard stats
- PATCH `/api/admin/pandits/{id}/approve` - Approve pandit

## Default Credentials

**Admin:** 919999999999 / Admin@123
**User:** 919876543210 / User@123
**Pandit:** 919111111111 / Pandit@123
