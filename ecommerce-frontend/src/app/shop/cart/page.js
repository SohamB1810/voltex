'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function ShopCart() {
  const { data: session } = useSession()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/cart').then(r => r.json()).then(d => setCart(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async id => {
    await fetch(`/api/proxy/cart/${id}`, { method: 'DELETE' }); load()
  }

  const updateQty = async (id, qty) => {
    if (qty < 1) { remove(id); return }
    await fetch(`/api/proxy/cart/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: qty }) }); load()
  }

  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Shop · Basket</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'var(--cream)', letterSpacing: '0.04em' }}>CART</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && cart.length === 0 && (
        <div style={{ padding: 64, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <ShoppingBag size={32} style={{ color: 'var(--muted)' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.2em' }}>YOUR CART IS EMPTY</p>
          <Link href="/shop/products" style={{ display: 'inline-flex', padding: '10px 20px', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700 }}>BROWSE PRODUCTS</Link>
        </div>
      )}

      {!loading && cart.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--cream)', marginBottom: 4 }}>{item.productName}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)' }}>₹{(item.price || 0).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(item._id, (item.quantity || 1) - 1)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--cream)', width: 24, textAlign: 'center' }}>{item.quantity || 1}</span>
                  <button onClick={() => updateQty(item._id, (item.quantity || 1) + 1)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold)', minWidth: 80, textAlign: 'right' }}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                <button onClick={() => remove(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', display: 'flex' }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.08em', color: 'var(--cream)' }}>ORDER SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--muted)' }}>
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--muted)' }}>
              <span>Shipping</span><span style={{ color: '#4ade80' }}>Free</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--cream)' }}>
              <span>TOTAL</span><span style={{ color: 'var(--gold)' }}>₹{total.toLocaleString()}</span>
            </div>
            <Link href="/shop/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 700, marginTop: 8 }}>
              CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}