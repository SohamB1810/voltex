'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function ShopHome() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/proxy/products').then(r => r.json()),
      fetch('/api/proxy/orders').then(r => r.json()),
    ]).then(([p, o]) => {
      setProducts(Array.isArray(p.value) ? p.value.slice(0, 4) : [])
      setOrders(Array.isArray(o.value) ? o.value.filter(ord => ord.userId === session?.user?.email).slice(-3).reverse() : [])
    }).finally(() => setLoading(false))
  }, [session])

  const statusCls = s => s === 'delivered' ? 'v-badge-success' : s === 'shipped' ? 'v-badge-info' : s === 'processing' ? 'v-badge-warn' : 'v-badge-neutral'

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: 56 }}>
      {/* Hero */}
      <div style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="v-label" style={{ marginBottom: 20 }}>Welcome back</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.9, marginBottom: 24 }}>
          HELLO,<br /><span style={{ color: 'var(--gold)' }}>{session?.user?.name?.split(' ')[0]?.toUpperCase()}</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--muted)', fontWeight: 300, maxWidth: 480, marginBottom: 32 }}>
          Discover curated products, track your orders, and manage your account all in one place.
        </p>
        <Link href="/shop/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em', textDecoration: 'none' }}>
          BROWSE STORE <ArrowRight size={16} />
        </Link>
      </div>

      {/* Featured Products */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.06em', color: 'var(--cream)' }}>FEATURED</h2>
          <Link href="/shop/products" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>View All <ArrowRight size={10} /></Link>
        </div>
        {loading
          ? <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {products.map(p => (
              <div key={p._id} className="v-card-hover" style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>{p.category}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--cream)', fontWeight: 400, lineHeight: 1.2 }}>{p.name}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--gold)' }}>₹{(p.price || 0).toLocaleString()}</p>
                <Link href={`/shop/products`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', marginTop: 'auto', width: 'fit-content' }}>
                  Shop <ArrowRight size={9} />
                </Link>
              </div>
            ))}
          </div>}
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.06em', color: 'var(--cream)' }}>RECENT ORDERS</h2>
          <Link href="/shop/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>All Orders <ArrowRight size={10} /></Link>
        </div>
        {orders.length === 0
          ? <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.15em' }}>NO ORDERS YET</p>
            <Link href="/shop/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '8px 18px', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textDecoration: 'none' }}>START SHOPPING</Link>
          </div>
          : <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <table className="v-table">
              <thead><tr><th>Order ID</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td className="mono gold">#{(o._id || '').slice(-6).toUpperCase()}</td>
                    <td className="bright">{o.productName || '—'}</td>
                    <td className="mono" style={{ color: 'var(--gold)' }}>{o.amount ? `₹${o.amount.toLocaleString()}` : '—'}</td>
                    <td><span className={`v-badge ${statusCls(o.status)}`}>{o.status || 'pending'}</span></td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  )
}