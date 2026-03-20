'use client'
import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Package, Clock, AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState({ orders: [], products: [], inventory: [], shipments: [] })
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.allSettled([
      fetch('/api/proxy/orders').then(r => r.json()),
      fetch('/api/proxy/products').then(r => r.json()),
      fetch('/api/proxy/inventory').then(r => r.json()),
      fetch('/api/proxy/shipments').then(r => r.json()),
    ]).then(([o, p, i, s]) => {
      setData({
        orders: Array.isArray(o.value) ? o.value : [],
        products: Array.isArray(p.value) ? p.value : [],
        inventory: Array.isArray(i.value) ? i.value : [],
        shipments: Array.isArray(s.value) ? s.value : [],
      })
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const today = new Date().toDateString()
  const ordersToday = data.orders.filter(o => new Date(o.createdAt).toDateString() === today).length
  const pendingShipments = data.shipments.filter(s => s.shipmentStatus === 'PENDING' || s.shipmentStatus === 'DISPATCHED').length
  const lowStock = data.inventory.filter(i => i.stockQuantity >= 0 && i.stockQuantity < 10).length
  const revenue = data.orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.amount || 0), 0)

  const stats = [
    { label: 'Total Revenue', value: `₹${(revenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: '#4ade80' },
    { label: 'Orders Today', value: ordersToday, icon: Package, color: 'var(--gold)' },
    { label: 'Pending Shipments', value: pendingShipments, icon: Clock, color: '#60a5fa' },
    { label: 'Low Stock Alerts', value: lowStock, icon: AlertTriangle, color: '#f87171' },
  ]

  const statusCls = s => s === 'delivered' ? 'v-badge-success' : s === 'shipped' ? 'v-badge-info' : s === 'processing' ? 'v-badge-warn' : 'v-badge-danger'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Welcome back, {session?.user?.name}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.95 }}>
            DASHBOARD<br /><span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.6em' }}>overview</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}>
            <Activity size={11} style={{ color: '#4ade80' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Live</span>
          </div>
          <button onClick={load} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 14px', cursor: 'pointer', color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <RefreshCw size={12} />Refresh
          </button>
        </div>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && <>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.5 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ padding: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}><Icon size={14} style={{ color }} /></div>
                <ArrowUpRight size={12} style={{ color: 'var(--muted)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--cream)', letterSpacing: '0.04em' }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--cream)' }}>RECENT ORDERS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{data.orders.length} total</div>
          </div>
          <table className="v-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {data.orders.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO ORDERS YET</td></tr>
                : [...data.orders].reverse().slice(0, 8).map(o => (
                  <tr key={o._id}>
                    <td className="mono gold">#{(o._id || '').slice(-6).toUpperCase()}</td>
                    <td className="bright">{o.userId || '—'}</td>
                    <td>{o.productName || o.productId || '—'}</td>
                    <td className="mono" style={{ color: 'var(--gold)' }}>{o.amount ? `₹${o.amount.toLocaleString()}` : '—'}</td>
                    <td><span className={`v-badge ${statusCls(o.status)}`}>{o.status || 'pending'}</span></td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock */}
        {lowStock > 0 && (
          <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: '#f87171' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: '#f87171' }}>LOW STOCK ALERTS</span>
            </div>
            <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {data.inventory.filter(i => i.stockQuantity >= 0 && i.stockQuantity < 10).map(i => (
                <div key={i._id} style={{ padding: '8px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', fontFamily: 'var(--font-mono)', fontSize: 9, color: '#f87171', letterSpacing: '0.1em' }}>
                  {i.productName} — {i.stockQuantity} left
                </div>
              ))}
            </div>
          </div>
        )}
      </>}
    </div>
  )
}
