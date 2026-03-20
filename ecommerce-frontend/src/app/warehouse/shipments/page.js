'use client'
import { useState, useEffect } from 'react'
import { Truck } from 'lucide-react'

const STATUSES = ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']
const shipBadge = s => s === 'DELIVERED' ? 'v-badge-success' : s === 'IN_TRANSIT' ? 'v-badge-info' : s === 'DISPATCHED' ? 'v-badge-warn' : 'v-badge-neutral'

export default function WorkerShipments() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/shipments').then(r => r.json()).then(d => setShipments(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateTracking = async (id, current) => {
    const tracking = prompt('Enter tracking number:', current || '')
    if (tracking === null) return
    await fetch(`/api/proxy/shipments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingNumber: tracking }) })
    load()
  }

  const updateStatus = async (id, status) => {
    await fetch(`/api/proxy/shipments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shipmentStatus: status }) })
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Worker · Logistics</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>SHIPMENTS</h1>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
        {STATUSES.slice(0, 4).map(s => (
          <div key={s} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--cream)' }}>{shipments.filter(sh => sh.shipmentStatus === s).length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>Shipment ID</th><th>Order</th><th>Tracking #</th><th>Carrier</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {shipments.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO SHIPMENTS YET</td></tr>
                : shipments.map(s => (
                  <tr key={s._id}>
                    <td className="mono gold">SHP-{(s._id || '').slice(-6).toUpperCase()}</td>
                    <td className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>#{(s.orderId || '').slice(-6).toUpperCase()}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.trackingNumber || <span style={{ color: 'rgba(255,255,255,0.2)' }}>not set</span>}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.carrier || '—'}</td>
                    <td><span className={`v-badge ${shipBadge(s.shipmentStatus)}`}>{s.shipmentStatus || 'PENDING'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => updateTracking(s._id, s.trackingNumber)} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 8px', cursor: 'pointer', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Truck size={9} />Tracking
                        </button>
                        <select value={s.shipmentStatus || 'PENDING'} onChange={e => updateStatus(s._id, e.target.value)}
                          style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                          {STATUSES.map(st => <option key={st} value={st} style={{ background: '#1a1812' }}>{st}</option>)}
                        </select>
                      </div>
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
