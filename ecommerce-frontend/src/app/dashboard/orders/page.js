'use client'
import { useState, useEffect } from 'react'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const statusCls = s => s === 'delivered' ? 'v-badge-success' : s === 'shipped' ? 'v-badge-info' : s === 'processing' ? 'v-badge-warn' : s === 'cancelled' || s === 'refunded' ? 'v-badge-danger' : 'v-badge-neutral'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/orders').then(r => r.json()).then(d => setOrders(Array.isArray(d) ? [...d].reverse() : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`/api/proxy/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    load()
  }

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Fulfilment</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>ORDERS</h1>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: 0 }}>
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: filter === s ? '2px solid var(--gold)' : '2px solid transparent', color: filter === s ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', marginBottom: -1 }}>
            {s}
          </button>
        ))}
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
            <tbody>
              {displayed.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO ORDERS</td></tr>
                : displayed.map(o => (
                  <tr key={o._id}>
                    <td className="mono gold">#{(o._id || '').slice(-6).toUpperCase()}</td>
                    <td className="bright">{o.userId || '—'}</td>
                    <td>{o.productName || o.productId || '—'}</td>
                    <td className="mono">{o.quantity || '—'}</td>
                    <td className="mono" style={{ color: 'var(--gold)' }}>{o.amount ? `₹${o.amount.toLocaleString()}` : '—'}</td>
                    <td><span className={`v-badge ${statusCls(o.status)}`}>{o.status || 'pending'}</span></td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      <select value={o.status || 'pending'} onChange={e => updateStatus(o._id, e.target.value)}
                        style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1812' }}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
