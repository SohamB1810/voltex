# Stripe Payment Gateway Setup

## Setup Instructions

### 1. Get Stripe API Keys
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Copy your **Test Secret Key** (starts with `sk_test_`)
- Copy your **Test Publishable Key** (starts with `pk_test_`)

### 2. Update Environment Variables
Add to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
```

### 3. Restart the Development Server
```bash
npm run dev
```

---

## Payment Methods

### 1. **Card Payment** (Stripe)
- Select "Card" at checkout
- Enter test card details:
  - **Success**: 4242 4242 4242 4242
  - **Decline**: 4000 0000 0000 0002
  - **3D Secure**: 4000 0027 6000 3184
  - Expiry: Any future date
  - CVC: Any 3 digits
- Status: Order moves to **"processing"**

### 2. **UPI Payment**
- Select "UPI" at checkout
- Currently for demo (no actual processing)
- Status: Order stays **"pending"**

### 3. **Cash on Delivery (COD)**
- Select "COD" at checkout
- No payment required
- Status: Order stays **"pending"**

---

## Order Status Flow

**Card Payment:**
- Order created with `status: "processing"` and `paymentStatus: "completed"`
- Admin can update to "shipped" → "delivered" in dashboard

**COD/UPI:**
- Order created with `status: "pending"` and `paymentStatus: "pending"`
- Payment verified later when delivery happens

---

## Testing the Payment Flow

1. Create a customer account or login
2. Add products to cart
3. Go to checkout
4. Fill in delivery address and phone
5. Select "Card" payment method
6. Enter test card: **4242 4242 4242 4242**
7. Enter any future date and any CVC (e.g., 12/26, 123)
8. Click "PLACE ORDER"
9. Payment processes and order is created
10. View order in Shop → Orders

---

## Webhook Setup (For Production)

For production, you should set up Stripe webhooks to handle:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

This is optional for development but recommended for production.

---

## Database Schema Update

Orders now include:
```javascript
{
  paymentMethod: "Card", // or "UPI", "COD"
  paymentStatus: "completed", // or "pending"
  status: "processing", // or "pending"
}
```

---

## Implementation Details

### Checkout Flow
1. User selects payment method
2. If Card selected:
   - Creates Stripe PaymentIntent on backend
   - Displays Stripe Card element
   - Confirms payment via stripe.confirmCardPayment()
3. If payment succeeds or COD/UPI selected:
   - Creates order(s) for each cart item
   - Clears shopping cart
   - Shows success confirmation

### Files Modified/Added
- `/src/app/shop/checkout/page.js` - Added Stripe integration
- `/src/app/api/payments/create-intent/route.js` - Backend payment intent creation
- `.env.local` - Added Stripe keys

---

## Error Handling

- Invalid card: Shows error message
- Network issues: Displays error with retry option
- Missing fields: Validates address, city, pincode, phone before processing
