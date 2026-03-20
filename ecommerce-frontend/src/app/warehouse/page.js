'use client'
import { useEffect, useState } from 'react'
import { request } from '@/lib/api'

export default function WarehousePage() {
  const [inventory, setInventory] = useState([])
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.allSettled([
      request('/inventory'),
      request('/shipments'),
    ])
      .then(([inv, ship]) => {
        const invData = inv.value ?? []
        const shipData = ship.value ?? []
        setInventory(Array.isArray(invData) ? invData : [])
        setShipments(Array.isArray(shipData) ? shipData : [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getStatus = qty => {
    if (!qty || qty === 0) return { label: 'Out of Stock', cls: 'v-badge-danger' }
    if (qty < 10) return { label: 'Low Stock', cls: 'v-badge-warn' }
    return { label: 'In Stock', cls: 'v-badge-success' }
  }

  const shipBadge = s =>
    s === 'DELIVERED' ? 'v-badge-success' :
    s === 'IN_TRANSIT' ? 'v-badge-info' :
    s === 'DISPATCHED' ? 'v-badge-warn' : 'v-badge-neutral'

  const updateInventory = async (id, currentQty) => {
    const newQty = prompt('Enter new quantity:', currentQty)
    if (newQty === null) return
    try {
      await request('/inventory/' + id, {
        method: 'PUT',
        body: JSON.stringify({ stockQuantity: parseInt(newQty) }),
      })
      window.location.reload()
    } catch (err) { alert(err.message) }
  }

  const updateShipmentStatus = async (id, status) => {
    try {
      await request('/shipments/' + id, {
        method: 'PUT',
        body: JSON.stringify({ shipmentStatus: status }),
      })
      window.location.reload()
    } catch (err) { alert(err.message) }
  }

  return (
    <div style={{ padding: '40px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <div className="v-label" style={{ marginBottom: 12 }}>Worker Panel</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.95 }}>
          WAREHOUSE<br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.55em', color: 'var(--gold)' }}>operations</span>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {[
          ['Total SKUs', inventory.length],
          ['Low Stock', inventory.filter(i => i.stockQuantity > 0 && i.stockQuantity < 10).length],
          ['Shipments', shipments.length],
        ].map(([l, v]) => (
          <div key={l} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <div className="v-stat" style={{ fontSize: 36 }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}
      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#e07070' }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* Inventory */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: 16 }}>INVENTORY</h2>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table className="v-table">
                <thead><tr><th>ID</th><th>Product</th><th>Category</th><th>Quantity</th><th>Status</th><th>Update</th></tr></thead>
                <tbody>
                  {inventory.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO INVENTORY DATA</td></tr>
                    : inventory.map(i => {
                      const { label, cls } = getStatus(i.stockQuantity)
                      return (
                        <tr key={i._id}>
                          <td className="mono gold">#{i._id?.slice(-6)?.toUpperCase()}</td>
                          <td className="bright">{i.productName || i.name || 'N/A'}</td>
                          <td style={{ color: 'var(--muted)' }}>{i.category || '—'}</td>
                          <td style={{ color: i.stockQuantity === 0 ? '#e07070' : i.stockQuantity < 10 ? '#d4785a' : 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{i.stockQuantity ?? '—'}</td>
                          <td><span className={`v-badge ${cls}`}>{label}</span></td>
                          <td>
                            <button onClick={() => updateInventory(i._id, i.stockQuantity)}
                              style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', cursor: 'pointer', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>
                              EDIT
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipments */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: 16 }}>SHIPMENTS</h2>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table className="v-table">
                <thead><tr><th>ID</th><th>Order</th><th>Tracking</th><th>Status</th><th>Update</th></tr></thead>
                <tbody>
                  {shipments.length === 0
                    ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO SHIPMENTS</td></tr>
                    : shipments.map(s => (
                      <tr key={s._id}>
                        <td className="mono gold">SHP-{s._id?.slice(-6)?.toUpperCase()}</td>
                        <td className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>#{s.orderId || s.order?._id || 'N/A'}</td>
                        <td className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.trackingNumber || 'N/A'}</td>
                        <td><span className={`v-badge ${shipBadge(s.shipmentStatus)}`}>{s.shipmentStatus || 'N/A'}</span></td>
                        <td>
                          <select defaultValue={s.shipmentStatus}
                            onChange={e => updateShipmentStatus(s._id, e.target.value)}
                            style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                            {['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map(st => (
                              <option key={st} value={st} style={{ background: '#1a1812' }}>{st}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}