'use client'
import { useState, useEffect } from 'react'

export default function AdminReports() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/proxy/orders').then(r => r.json()),
      fetch('/api/proxy/products').then(r => r.json()),
    ]).then(([o, p]) => {
      setOrders(Array.isArray(o.value) ? o.value : [])
      setProducts(Array.isArray(p.value) ? p.value : [])
    }).finally(() => setLoading(false))
  }, [])

  // Product performance
  const productSales = products.map(p => {
    const sold = orders.filter(o => o.productId === p._id || o.productName === p.name)
    const revenue = sold.reduce((s, o) => s + (o.amount || 0), 0)
    return { ...p, sold: sold.length, revenue }
  }).sort((a, b) => b.revenue - a.revenue)

  // Status breakdown
  const statusBreakdown = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => ({
    status: s, count: orders.filter(o => o.status === s).length
  }))

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.amount || 0), 0)
  const statusCls = s => s === 'delivered' ? '#4ade80' : s === 'shipped' ? '#60a5fa' : s === 'processing' ? 'var(--gold)' : '#f87171'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Analytics</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>REPORTS</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && <>
        {/* Revenue */}
        <div style={{ padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Total Revenue (Delivered Orders)</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: '#4ade80', letterSpacing: '0.04em' }}>₹{totalRevenue.toLocaleString()}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginTop: 8 }}>{orders.length} total orders · {orders.filter(o => o.status === 'delivered').length} delivered</div>
        </div>

        {/* Order Status Breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: 20 }}>ORDER STATUS BREAKDOWN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {statusBreakdown.map(({ status, count }) => {
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: statusCls(status) }}>{status}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{count} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: statusCls(status), borderRadius: 2, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Product Performance */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--cream)' }}>PRODUCT PERFORMANCE</div>
          </div>
          <table className="v-table">
            <thead><tr><th>Product</th><th>Category</th><th>Orders</th><th>Revenue</th></tr></thead>
            <tbody>
              {productSales.length === 0
                ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO DATA YET</td></tr>
                : productSales.map(p => (
                  <tr key={p._id}>
                    <td className="bright">{p.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{p.category || '—'}</td>
                    <td className="mono">{p.sold}</td>
                    <td className="mono" style={{ color: '#4ade80' }}>₹{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  )
}
