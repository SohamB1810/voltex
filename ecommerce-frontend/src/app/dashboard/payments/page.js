'use client'
import { useState, useEffect } from 'react'
import { CreditCard, AlertTriangle } from 'lucide-react'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/proxy/payments').then(r => r.json()),
      fetch('/api/proxy/orders').then(r => r.json()),
    ]).then(([p, o]) => {
      setPayments(Array.isArray(p.value) ? p.value : [])
      setOrders(Array.isArray(o.value) ? o.value : [])
    }).finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.amount || 0), 0)
  const failed = payments.filter(p => p.status === 'failed').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Finance</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>PAYMENTS</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CreditCard, color: '#4ade80' },
          { label: 'Transactions', value: orders.length, icon: CreditCard, color: 'var(--gold)' },
          { label: 'Failed / Refunds', value: failed, icon: AlertTriangle, color: '#f87171' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <div style={{ padding: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'inline-flex', marginBottom: 12 }}><Icon size={14} style={{ color }} /></div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--cream)' }}>{value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Payment log from orders */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--cream)' }}>PAYMENT LOG</div>
        </div>
        {loading
          ? <p style={{ padding: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>
          : <table className="v-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Order Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO TRANSACTIONS YET</td></tr>
                : [...orders].reverse().map(o => (
                  <tr key={o._id}>
                    <td className="mono gold">#{(o._id || '').slice(-6).toUpperCase()}</td>
                    <td className="bright">{o.userId || '—'}</td>
                    <td className="mono" style={{ color: '#4ade80' }}>{o.amount ? `₹${o.amount.toLocaleString()}` : '—'}</td>
                    <td><span className={`v-badge ${o.status === 'delivered' ? 'v-badge-success' : o.status === 'cancelled' ? 'v-badge-danger' : 'v-badge-neutral'}`}>{o.status || 'pending'}</span></td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>}
      </div>
    </div>
  )
}
