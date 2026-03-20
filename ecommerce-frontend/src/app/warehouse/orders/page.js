'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const PACK_STATUSES = ['pending', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered']
const statusCls = s => s === 'delivered' ? 'v-badge-success' : ['shipped', 'out_for_delivery'].includes(s) ? 'v-badge-info' : s === 'packed' ? 'v-badge-warn' : 'v-badge-neutral'

export default function WorkerOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/orders').then(r => r.json())
      .then(d => {
        const all = Array.isArray(d) ? d : []
        // Workers see orders not yet delivered (their work queue)
        setOrders(all.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status)).reverse())
      }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`/api/proxy/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Worker · Fulfilment Queue</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>MY ORDERS</h1>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {[['To Pack', orders.filter(o => o.status === 'pending' || o.status === 'processing').length, 'var(--gold)'],
          ['Packed', orders.filter(o => o.status === 'packed').length, '#60a5fa'],
          ['Shipped', orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery').length, '#4ade80']
        ].map(([l, v, c]) => (
          <div key={l} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: c }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Customer</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>ALL CAUGHT UP — No pending orders</td></tr>
                : orders.map(o => (
                  <tr key={o._id}>
                    <td className="mono gold">#{(o._id || '').slice(-6).toUpperCase()}</td>
                    <td className="bright">{o.productName || '—'}</td>
                    <td className="mono">{o.quantity || '—'}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{o.userId || '—'}</td>
                    <td><span className={`v-badge ${statusCls(o.status)}`}>{o.status || 'pending'}</span></td>
                    <td>
                      <select value={o.status || 'pending'} onChange={e => updateStatus(o._id, e.target.value)}
                        style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                        {PACK_STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1812' }}>{s}</option>)}
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
