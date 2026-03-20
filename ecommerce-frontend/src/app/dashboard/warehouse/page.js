'use client'
import { useState, useEffect } from 'react'

const STATUSES = ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']
const shipBadge = s => s === 'DELIVERED' ? 'v-badge-success' : s === 'IN_TRANSIT' ? 'v-badge-info' : s === 'DISPATCHED' ? 'v-badge-warn' : 'v-badge-neutral'

export default function AdminWarehouse() {
  const [shipments, setShipments] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.allSettled([
      fetch('/api/proxy/shipments').then(r => r.json()),
      fetch('/api/proxy/users').then(r => r.json()),
    ]).then(([s, u]) => {
      setShipments(Array.isArray(s.value) ? s.value : [])
      setWorkers(Array.isArray(u.value) ? u.value.filter(u => u.role === 'WORKER') : [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateShipment = async (id, data) => {
    await fetch(`/api/proxy/shipments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Logistics</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>WAREHOUSE</h1>
      </div>

      {/* Worker list */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: 'var(--cream)', marginBottom: 12 }}>ACTIVE WORKERS</div>
        {workers.length === 0
          ? <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>No workers found. Assign WORKER role to users in the Users page.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {workers.map(w => (
              <div key={w._id || w.id} style={{ padding: '8px 14px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.1em' }}>
                {w.name} · {w.email}
              </div>
            ))}
          </div>}
      </div>

      {/* Shipments */}
      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}
      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--cream)' }}>ALL SHIPMENTS</div>
          </div>
          <table className="v-table">
            <thead><tr><th>Shipment ID</th><th>Order</th><th>Tracking</th><th>Carrier</th><th>Destination</th><th>Status</th><th>Assign Status</th></tr></thead>
            <tbody>
              {shipments.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO SHIPMENTS YET</td></tr>
                : shipments.map(s => (
                  <tr key={s._id}>
                    <td className="mono gold">SHP-{(s._id || '').slice(-6).toUpperCase()}</td>
                    <td className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>#{(s.orderId || '').slice(-6).toUpperCase()}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.trackingNumber || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.carrier || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.destination || '—'}</td>
                    <td><span className={`v-badge ${shipBadge(s.shipmentStatus)}`}>{s.shipmentStatus || 'PENDING'}</span></td>
                    <td>
                      <select value={s.shipmentStatus || 'PENDING'} onChange={e => updateShipment(s._id, { shipmentStatus: e.target.value })}
                        style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                        {STATUSES.map(st => <option key={st} value={st} style={{ background: '#1a1812' }}>{st}</option>)}
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
