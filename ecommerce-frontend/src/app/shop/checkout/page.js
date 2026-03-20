'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Check } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function ShopCheckout() {
    const { data: session } = useSession()
    const router = useRouter()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')
    const [stripe, setStripe] = useState(null)
    const [elements, setElements] = useState(null)
    const cardElementRef = useRef(null)
    const [form, setForm] = useState({ address: '', city: '', pincode: '', phone: '', paymentMethod: 'COD' })

    useEffect(() => {
        fetch('/api/proxy/cart').then(r => r.json()).then(d => setCart(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const initStripe = async() => {
            const stripeInstance = await stripePromise
            setStripe(stripeInstance)
            const elementsInstance = stripeInstance.elements()
            setElements(elementsInstance)

            if (cardElementRef.current && form.paymentMethod === 'Card') {
                const cardElement = elementsInstance.create('card')
                cardElement.mount(cardElementRef.current)
            }
        }

        if (form.paymentMethod === 'Card' && !stripe) {
            initStripe()
        }
    }, [form.paymentMethod, stripe])

    useEffect(() => {
        if (elements && form.paymentMethod === 'Card' && cardElementRef.current && cardElementRef.current.innerHTML === '') {
            const cardElement = elements.create('card')
            cardElement.mount(cardElementRef.current)
        }
    }, [elements, form.paymentMethod])

    const total = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)

    const placeOrder = async() => {
        if (!form.address || !form.city || !form.pincode || !form.phone) { alert('Please fill all fields.'); return }
        setError('')
        setPlacing(true)

        try {
            // Step 1: Process payment (only for Card payment method)
            let paymentVerified = false
            if (form.paymentMethod === 'Card') {
                if (!stripe || !elements) {
                    setError('Payment system not loaded. Please try again.')
                    setPlacing(false)
                    return
                }

                // Create payment intent
                const intentRes = await fetch('/api/payments/create-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total, email: session?.user?.email, description: `Order for ${session?.user?.name}` }),
                })

                if (!intentRes.ok) {
                    throw new Error('Failed to create payment intent')
                }

                const { clientSecret, paymentIntentId } = await intentRes.json()

                // Confirm payment
                const cardElement = elements.getElement('card')
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: { card: cardElement, billing_details: { email: session?.user?.email, name: session?.user?.name } },
                })

                if (result.error) {
                    throw new Error(result.error.message)
                }

                if (result.paymentIntent.status !== 'succeeded') {
                    throw new Error('Payment failed. Please try again.')
                }

                paymentVerified = true
            }

            // Step 2: Create orders
            for (const item of cart) {
                await fetch('/api/proxy/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session?.user?.email,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        amount: item.price * item.quantity,
                        status: form.paymentMethod === 'Card' ? 'processing' : 'pending',
                        address: `${form.address}, ${form.city} - ${form.pincode}`,
                        phone: form.phone,
                        paymentMethod: form.paymentMethod,
                        paymentStatus: form.paymentMethod === 'Card' ? 'completed' : 'pending',
                    }),
                })
            }

            // Step 3: Clear cart
            for (const item of cart) {
                await fetch(`/api/proxy/cart/${item._id}`, { method: 'DELETE' })
            }

            setDone(true)
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.')
            console.error(err)
        } finally {
            setPlacing(false)
        }
    }

    if (done) return ( <
        div style = {
            { maxWidth: 560, margin: '80px auto', padding: '40px', textAlign: 'center', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }
        } >
        <
        div style = {
            { width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
        } >
        <
        Check size = { 24 }
        style = {
            { color: '#4ade80' }
        }
        /> < /
        div > <
        h2 style = {
            { fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '0.08em', color: 'var(--cream)' }
        } > ORDER PLACED! < /h2> <
        p style = {
            { fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--muted)' }
        } > Your order has been confirmed and will be dispatched soon. < /p> <
        button onClick = {
            () => router.push('/shop/orders')
        }
        style = {
            { padding: '12px 28px', background: 'var(--gold)', border: 'none', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em', cursor: 'pointer' }
        } > VIEW ORDERS < /button> < /
        div >
    )

    const iS = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '12px 14px', color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }
    const lS = { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }

    return ( <
        div style = {
            { maxWidth: 1280, margin: '0 auto', padding: '40px' }
        } >
        <
        div style = {
            { marginBottom: 32 }
        } >
        <
        p style = {
            { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }
        } > Shop· Purchase < /p> <
        h1 style = {
            { fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'var(--cream)', letterSpacing: '0.04em' }
        } > CHECKOUT < /h1> < /
        div >

        {
            loading ? ( <
                p style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }
                } > LOADING... < /p>
            ) : ( <
                div style = {
                    { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }
                } > { /* Form */ } <
                div style = {
                    { display: 'flex', flexDirection: 'column', gap: 20 }
                } >
                <
                div style = {
                    { padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }
                } >
                <
                div style = {
                    { fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: 4 }
                } > DELIVERY ADDRESS < /div> <
                div >
                <
                label style = { lS } > Street Address < /label> <
                input value = { form.address }
                onChange = { e => setForm({...form, address: e.target.value }) }
                style = { iS }
                /> < /
                div > <
                div style = {
                    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
                } >
                <
                div >
                <
                label style = { lS } > City < /label> <
                input value = { form.city }
                onChange = { e => setForm({...form, city: e.target.value }) }
                style = { iS }
                /> < /
                div > <
                div >
                <
                label style = { lS } > PIN Code < /label> <
                input value = { form.pincode }
                onChange = { e => setForm({...form, pincode: e.target.value }) }
                style = { iS }
                /> < /
                div > <
                /div> <
                div >
                <
                label style = { lS } > Phone < /label> <
                input value = { form.phone }
                onChange = { e => setForm({...form, phone: e.target.value }) }
                style = { iS }
                /> < /
                div > <
                /div>

                <
                div style = {
                    { padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }
                } >
                <
                div style = {
                    { fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: 4 }
                } > PAYMENT METHOD < /div> { ['COD', 'UPI', 'Card'].map(m => ( <
                label key = { m }
                style = {
                    { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 16, color: form.paymentMethod === m ? 'var(--cream)' : 'var(--muted)' }
                } >
                <
                input type = "radio"
                name = "payment"
                value = { m }
                checked = { form.paymentMethod === m }
                onChange = {
                    () => {
                        setForm({...form, paymentMethod: m });
                        setError('');
                    }
                }
                style = {
                    { accentColor: 'var(--gold)' }
                }
                /> { m === 'COD' ? 'Cash on Delivery' : m } < /
                label >
            ))
    }

    { /* Stripe Card Element */ } {
        form.paymentMethod === 'Card' && ( <
            div style = {
                { marginTop: 16 }
            } >
            <
            label style = { lS } > Card Details < /label> <
            div ref = { cardElementRef }
            style = {
                { padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 4 }
            }
            /> < /
            div >
        )
    } <
    /div>

    {
        error && ( <
            div style = {
                { padding: 16, background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.3)', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e07070', borderRadius: 4 }
            } > ⚠️{ error } <
            /div>
        )
    } <
    /div>

    { /* Summary */ } <
    div style = {
            { padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }
        } >
        <
        div style = {
            { fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.08em', color: 'var(--cream)' }
        } > ORDER SUMMARY < /div> {
    cart.map(i => ( <
        div key = { i._id }
        style = {
            { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--muted)' }
        } >
        <
        span > { i.productName }× { i.quantity } < /span> <
        span > ₹{
            ((i.price || 0) * (i.quantity || 1)).toLocaleString()
        } < /span> < /
        div >
    ))
} <
div style = {
    { height: 1, background: 'var(--border)' }
}
/> <
div style = {
        { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--cream)' }
    } >
    <
    span > TOTAL < /span> <
span style = {
    { color: 'var(--gold)' }
} > ₹{ total.toLocaleString() } < /span> < /
div > <
    button onClick = { placeOrder }
disabled = { placing || cart.length === 0 }
style = {
        { padding: '16px', background: 'var(--gold)', border: 'none', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.1em', cursor: 'pointer', marginTop: 8, opacity: placing ? 0.7 : 1 }
    } > { placing ? 'PLACING...' : 'PLACE ORDER' } <
    /button> < /
div > <
    /div>
)
} <
/div>
)
}
