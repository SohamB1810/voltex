/**
 * STRIPE TEST PAYMENT CREDENTIALS
 * 
 * Use these test card numbers for development/testing
 * Expiration: Any future date
 * CVC: Any 3 digits
 */

export const STRIPE_TEST_CARDS = {
    success: {
        number: '4242 4242 4242 4242',
        exp: '12/25',
        cvc: '123',
        description: 'Visa - Successful payment'
    },
    decline: {
        number: '4000 0000 0000 0002',
        exp: '12/25',
        cvc: '123',
        description: 'Visa - Card declined'
    },
    require3d: {
        number: '4000 0027 6000 3184',
        exp: '12/25',
        cvc: '123',
        description: 'Visa - Requires 3D Secure authentication'
    },
    amexSuccess: {
        number: '3782 822463 10005',
        exp: '12/25',
        cvc: '1234',
        description: 'American Express - Successful payment'
    },
    amexDecline: {
        number: '3714 496353 98431',
        exp: '12/25',
        cvc: '1234',
        description: 'American Express - Card declined'
    }
}

/**
 * HOW TO TEST STRIPE PAYMENT
 * 
 * 1. At checkout, select "Card" as payment method
 * 2. Enter test card details from above
 * 3. Use any future date for expiration
 * 4. Use any 3+ digits for CVC
 * 5. Click "PLACE ORDER"
 * 6. For successful card: Order is created with status "processing"
 * 7. For declined card: Payment fails and shows error message
 */