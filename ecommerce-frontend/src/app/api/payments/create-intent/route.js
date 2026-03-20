import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        const { amount, email, orderId, description } = await req.json()

        if (!amount || !email) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Amount in cents
            currency: 'inr',
            description: description || `Order ${orderId}`,
            receipt_email: email,
            metadata: {
                email,
                orderId,
            },
        })

        return Response.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error) {
        console.error('Stripe error:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}