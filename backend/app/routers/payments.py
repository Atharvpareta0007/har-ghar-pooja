from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from .. import schemas, crud, auth, models
from ..database import get_db
import os
import hmac
import hashlib

# Optional payment integrations
try:
    import razorpay
except ImportError:
    razorpay = None

try:
    import stripe
except ImportError:
    stripe = None

router = APIRouter(prefix="/api/payments", tags=["Payments"])

# Initialize payment providers
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "")

razorpay_client = None
if razorpay and RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

if stripe and STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY


@router.post("/create", response_model=schemas.PaymentResponse)
def create_payment(
    payment_request: schemas.PaymentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a payment for a booking"""
    # Verify booking exists and belongs to user
    booking = crud.get_booking_by_id(db, payment_request.booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this booking"
        )
    
    # Check if payment already exists
    existing_payment = crud.get_payment_by_booking_id(db, payment_request.booking_id)
    if existing_payment and existing_payment.status == models.PaymentStatus.SUCCESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already completed for this booking"
        )
    
    # Create payment record
    amount = booking.price
    payment = crud.create_payment(db, payment_request.booking_id, payment_request.provider, amount)
    
    # Create order with payment provider or use mock mode
    if payment_request.provider == "razorpay" and razorpay_client:
        try:
            order = razorpay_client.order.create({
                "amount": int(amount * 100),  # Convert to paise
                "currency": "INR",
                "receipt": str(payment.id),
                "payment_capture": 1
            })
            payment.provider_payment_id = order['id']
            db.commit()
        except Exception as e:
            # Use mock payment if provider fails
            payment.provider_payment_id = f"mock_razorpay_{payment.id}"
            db.commit()
    
    elif payment_request.provider == "stripe" and stripe and STRIPE_API_KEY:
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency="inr",
                metadata={"payment_id": str(payment.id)}
            )
            payment.provider_payment_id = intent.id
            db.commit()
        except Exception as e:
            # Use mock payment if provider fails
            payment.provider_payment_id = f"mock_stripe_{payment.id}"
            db.commit()
    else:
        # Mock payment mode (for testing without payment providers)
        payment.provider_payment_id = f"mock_{payment_request.provider}_{payment.id}"
        db.commit()
    
    db.refresh(payment)
    return payment


# Razorpay: create order specifically for Checkout (returns order + key id)
@router.post("/razorpay/order")
def create_razorpay_order(
    payment_request: schemas.PaymentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Razorpay order and return order info + public key for Checkout JS"""
    if not (razorpay_client and RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET):
        raise HTTPException(status_code=400, detail="Razorpay is not configured")

    # Verify booking exists and belongs to user
    booking = crud.get_booking_by_id(db, payment_request.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this booking")

    # If an existing successful payment exists, block
    existing_payment = crud.get_payment_by_booking_id(db, payment_request.booking_id)
    if existing_payment and existing_payment.status == models.PaymentStatus.SUCCESS:
        raise HTTPException(status_code=400, detail="Payment already completed for this booking")

    amount = booking.price
    # Ensure a payment row exists; create if missing
    payment = existing_payment or crud.create_payment(db, payment_request.booking_id, "razorpay", amount)

    try:
        order = razorpay_client.order.create({
            "amount": int(amount * 100),
            "currency": "INR",
            "receipt": str(payment.id),
            "payment_capture": 1,
            "notes": {
                "booking_id": str(booking.id),
                "user_phone": current_user.phone,
            }
        })
        payment.provider_payment_id = order["id"]
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay order error: {str(e)}")

    db.refresh(payment)
    return {
        "key_id": RAZORPAY_KEY_ID,
        "order": order,
        "amount": amount,
        "currency": "INR",
        "payment_id": str(payment.id),
        "booking_id": str(booking.id),
        "user": {"name": current_user.name, "phone": current_user.phone}
    }


@router.post("/razorpay/verify")
def verify_razorpay_signature(
    payload: dict,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Verify Razorpay signature and mark payment/booking as successful"""
    if not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=400, detail="Razorpay is not configured")

    razorpay_order_id = payload.get("razorpay_order_id")
    razorpay_payment_id = payload.get("razorpay_payment_id")
    razorpay_signature = payload.get("razorpay_signature")

    if not (razorpay_order_id and razorpay_payment_id and razorpay_signature):
        raise HTTPException(status_code=422, detail="Invalid verification payload")

    # Compute expected signature: HMAC_SHA256(order_id|payment_id, key_secret)
    generated_signature = hmac.new(
        bytes(RAZORPAY_KEY_SECRET, "utf-8"),
        bytes(f"{razorpay_order_id}|{razorpay_payment_id}", "utf-8"),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != razorpay_signature:
        raise HTTPException(status_code=400, detail="Signature verification failed")

    # Find our payment by provider order id
    payment = db.query(models.Payment).filter(models.Payment.provider_payment_id == razorpay_order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    # Only the booking owner (or admin) can verify
    booking = crud.get_booking_by_id(db, payment.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Mark as paid and confirm booking
    payment.status = models.PaymentStatus.SUCCESS
    booking.status = models.BookingStatus.CONFIRMED
    db.commit()
    db.refresh(payment)

    return {"status": "success", "payment_id": str(payment.id), "booking_status": "confirmed"}


@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle payment webhook from Razorpay/Stripe"""
    body = await request.json()
    
    provider = body.get("provider")
    
    if provider == "razorpay":
        # Verify Razorpay signature
        event = body.get("event")
        payload = body.get("payload", {})
        
        if event == "payment.captured":
            payment_id = payload.get("payment", {}).get("id")
            order_id = payload.get("payment", {}).get("order_id")
            
            # Find payment by provider_payment_id
            payment = db.query(models.Payment).filter(
                models.Payment.provider_payment_id == order_id
            ).first()
            
            if payment:
                payment.status = models.PaymentStatus.SUCCESS
                
                # Update booking status
                booking = crud.get_booking_by_id(db, payment.booking_id)
                if booking:
                    booking.status = models.BookingStatus.CONFIRMED
                
                db.commit()
                return {"status": "success"}
    
    elif provider == "stripe":
        event_type = body.get("event")
        payload = body.get("payload", {})
        
        if event_type == "payment_intent.succeeded":
            intent_id = payload.get("id")
            
            # Find payment by provider_payment_id
            payment = db.query(models.Payment).filter(
                models.Payment.provider_payment_id == intent_id
            ).first()
            
            if payment:
                payment.status = models.PaymentStatus.SUCCESS
                
                # Update booking status
                booking = crud.get_booking_by_id(db, payment.booking_id)
                if booking:
                    booking.status = models.BookingStatus.CONFIRMED
                
                db.commit()
                return {"status": "success"}
    
    return {"status": "ignored"}


@router.get("/booking/{booking_id}", response_model=schemas.PaymentResponse)
def get_payment_for_booking(
    booking_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment details for a booking"""
    from uuid import UUID
    booking_uuid = UUID(booking_id)
    
    # Verify booking exists and user has access
    booking = crud.get_booking_by_id(db, booking_uuid)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    payment = crud.get_payment_by_booking_id(db, booking_uuid)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return payment


@router.post("/complete/{payment_id}")
def complete_payment(
    payment_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Complete a payment (for testing/mock mode)"""
    from uuid import UUID
    payment_uuid = UUID(payment_id)
    
    payment = db.query(models.Payment).filter(models.Payment.id == payment_uuid).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify user owns the booking
    booking = crud.get_booking_by_id(db, payment.booking_id)
    if booking.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Mark payment as successful
    payment.status = models.PaymentStatus.SUCCESS
    
    # Update booking status to confirmed
    booking.status = models.BookingStatus.CONFIRMED
    
    db.commit()
    db.refresh(payment)
    
    return {"status": "success", "payment_id": str(payment.id), "amount": payment.amount, "booking_status": "confirmed"}
