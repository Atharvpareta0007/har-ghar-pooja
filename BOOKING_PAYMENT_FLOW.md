# 🕉️ Complete Booking & Payment Flow - Working!

## ✅ Status: FULLY FUNCTIONAL

The complete booking to payment pipeline is now working end-to-end!

---

## 🚀 Backend Running

**Server**: http://localhost:8001  
**API Docs**: http://localhost:8001/docs  
**Database**: SQLite (hargharpooja.db)

---

## 📋 Complete Flow

### 1️⃣ **User Registration**
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "919998887777",
    "password": "Test@123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "name": "Test User",
    "phone": "919998887777",
    "role": "user"
  }
}
```

---

### 2️⃣ **User Login**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "password": "User@123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": { "name": "Aaryan Kumar", "role": "user" }
}
```

---

### 3️⃣ **Browse Pujas**
```bash
curl http://localhost:8001/api/pujas
```

**Response: 15 Pujas Available**
```json
[
  {
    "name_local": "पितृ शांति",
    "name_en": "Pitru Shanti",
    "default_price": 5100.0,
    "id": "uuid-here"
  },
  {
    "name_local": "नारायण बली",
    "default_price": 21000.0
  }
  // ... 13 more pujas
]
```

---

### 4️⃣ **Get Available Pandits**
```bash
curl http://localhost:8001/api/pandits
```

**Response: 3 Approved Pandits**
```json
[
  {
    "id": "uuid-pandit-1",
    "city": "Delhi",
    "user": { "name": "Pandit Ramesh Sharma" },
    "approved": true
  }
  // ... 2 more pandits
]
```

---

### 5️⃣ **Create Booking**
```bash
TOKEN="your_access_token"
PUJA_ID="uuid-of-puja"
PANDIT_ID="uuid-of-pandit"

curl -X POST http://localhost:8001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"puja_type_id\": \"$PUJA_ID\",
    \"pandit_id\": \"$PANDIT_ID\",
    \"scheduled_at\": \"2025-11-06T10:00:00+05:30\",
    \"address\": \"123 Temple Street, Mumbai\",
    \"is_virtual\": false
  }"
```

**Response:**
```json
{
  "id": "booking-uuid",
  "user_id": "user-uuid",
  "status": "pending",
  "price": 5100.0,
  "puja_type": {
    "name_local": "पितृ शांति",
    "default_price": 5100.0
  },
  "created_at": "2025-10-28T10:00:00"
}
```

---

### 6️⃣ **Create Payment**
```bash
BOOKING_ID="booking-uuid-from-step-5"

curl -X POST http://localhost:8001/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"booking_id\": \"$BOOKING_ID\",
    \"provider\": \"razorpay\"
  }"
```

**Response:**
```json
{
  "id": "payment-uuid",
  "booking_id": "booking-uuid",
  "amount": 5100.0,
  "provider": "razorpay",
  "provider_payment_id": "mock_razorpay_payment-uuid",
  "status": "pending",
  "created_at": "2025-10-28T10:01:00"
}
```

**Note**: Mock mode is used if Razorpay isn't configured with real keys.

---

### 7️⃣ **Complete Payment** (Mock/Testing)
```bash
PAYMENT_ID="payment-uuid-from-step-6"

curl -X POST http://localhost:8001/api/payments/complete/$PAYMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status": "success",
  "payment_id": "payment-uuid",
  "amount": 5100.0,
  "booking_status": "confirmed"
}
```

**What Happens:**
- Payment status → `SUCCESS`
- Booking status → `CONFIRMED`
- Pandit can now see the confirmed booking

---

### 8️⃣ **View My Bookings**
```bash
curl http://localhost:8001/api/bookings/my-bookings \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[
  {
    "id": "booking-uuid",
    "status": "confirmed",  // ✅ Updated!
    "price": 5100.0,
    "scheduled_at": "2025-11-06T10:00:00",
    "puja_type": {
      "name_local": "पितृ शांति"
    }
  }
]
```

---

## 🔄 Complete Automation Script

Save this as `test_booking_flow.sh`:

```bash
#!/bin/bash
set -e

echo "🕉️ Testing Complete Booking & Payment Flow"
echo ""

# 1. Login
echo "Step 1: Logging in..."
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210","password":"User@123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "✅ Logged in successfully"

# 2. Get Puja ID
echo "Step 2: Getting puja..."
PUJA_ID=$(curl -s http://localhost:8001/api/pujas \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "✅ Selected Puja: $PUJA_ID"

# 3. Get Pandit ID
echo "Step 3: Getting pandit..."
PANDIT_ID=$(curl -s http://localhost:8001/api/pandits \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "✅ Selected Pandit: $PANDIT_ID"

# 4. Create Booking
echo "Step 4: Creating booking..."
BOOKING_ID=$(curl -s -X POST http://localhost:8001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"puja_type_id\":\"$PUJA_ID\",\"pandit_id\":\"$PANDIT_ID\",\"scheduled_at\":\"2025-11-10T10:00:00+05:30\",\"address\":\"Test Address\",\"is_virtual\":false}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "✅ Booking created: $BOOKING_ID"

# 5. Create Payment
echo "Step 5: Creating payment..."
PAYMENT_ID=$(curl -s -X POST http://localhost:8001/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"booking_id\":\"$BOOKING_ID\",\"provider\":\"razorpay\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "✅ Payment created: $PAYMENT_ID"

# 6. Complete Payment
echo "Step 6: Completing payment..."
curl -s -X POST http://localhost:8001/api/payments/complete/$PAYMENT_ID \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo "✅ Payment completed!"

echo ""
echo "🎉 Complete flow executed successfully!"
```

Make it executable and run:
```bash
chmod +x test_booking_flow.sh
./test_booking_flow.sh
```

---

## 🔑 Default Test Accounts

| Role | Phone | Password |
|------|-------|----------|
| **Admin** | 919999999999 | Admin@123 |
| **User** | 919876543210 | User@123 |
| **Pandit** | 919111111111 | Pandit@123 |

---

## 🎯 Booking Statuses

| Status | Description |
|--------|-------------|
| `pending` | Booking created, awaiting payment |
| `confirmed` | Payment successful, pandit notified |
| `completed` | Puja performed, booking closed |
| `cancelled` | Booking cancelled by user |

---

## 💳 Payment Modes

### Mock Mode (Current - For Testing)
- No real payment gateway needed
- Instant confirmation
- Use `/payments/complete/{payment_id}` endpoint

### Production Mode (When Configured)
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
- Real Razorpay integration
- Webhook handling for automatic confirmation

---

## 📊 All Available Pujas

1. **पितृ शांति** (Pitru Shanti) - ₹5,100
2. **नारायण बली** (Narayan Bali) - ₹21,000
3. **काल सर्प दोष** (Kaal Sarp Dosh) - ₹4,100
4. **रुद्राभिषेक** (Rudrabhishek) - ₹1,100-11,000
5. **मंगल शांति** (Mangal Shanti) - ₹3,100
6. **भात पूजन** (Bhaat Poojan) - ₹2,100
7. **ग्रहण दोष शांति** (Grahan Dosh Shanti) - ₹2,100
8. **नवग्रह शांति** (Navgraha Shanti) - ₹2,500
9. **चांडाल दोष शांति** (Chandal Dosh Shanti) - ₹2,500
10. **कुंभ विवाह** (Kumbh Vivah) - ₹3,500
11. **अर्क विवाह** (Ark Vivah) - ₹3,100
12. **वास्तु पूजन** (Vastu Poojan) - ₹11,000
13. **ग्रह शांति** (Graha Shanti) - ₹1,100
14. **जप** (Jap) - ₹1,000-51,000
15. **वैवाहिक एवं मांगलिक पूजन** - ₹11,000

---

## 🐛 Troubleshooting

### Backend Not Responding?
```bash
# Check if server is running
curl http://localhost:8001/health

# If not running, restart:
cd /Users/atharvpareta/Desktop/hgp/backend
DATABASE_URL="sqlite:///./hargharpooja.db" JWT_SECRET_KEY="dev-key" python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Invalid Token?
```bash
# Login again to get fresh token
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210","password":"User@123"}'
```

### Booking Fails?
- Ensure puja_id and pandit_id are valid UUIDs
- Check date format: `YYYY-MM-DDTHH:MM:SS+05:30`
- Verify token is included in Authorization header

---

## ✅ Summary

**Complete Pipeline Working:**
1. ✅ User Registration
2. ✅ User Login (JWT Auth)
3. ✅ Browse Pujas (15 seeded)
4. ✅ View Pandits (3 approved)
5. ✅ Create Booking
6. ✅ Create Payment (Mock mode)
7. ✅ Complete Payment
8. ✅ Booking Status Updates

**Ready for Frontend Integration!** 🎉
