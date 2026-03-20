'use client'
import { getShipments, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'

const statusBadge = s => s==='DELIVERED'?'v-badge-success':s==='IN_TRANSIT'?'v-badge-info':s==='DISPATCHED'?'v-badge-warn':'v-badge-neutral'

export default function ShipmentsPage() {
  const { data, loading, error } = useFetch(getShipments)

  const rawShipments = data?.data ?? data
  const shipments = Array.isArray(rawShipments) ? rawShipments : []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div>
        <div className="v-label" style={{ marginBottom:12 }}>Logistics</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>SHIPMENTS</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[
          ['Total', shipments.length],
          ['Dispatched', shipments.filter(s=>s.shipmentStatus==='DISPATCHED').length],
          ['Delivered', shipments.filter(s=>s.shipmentStatus==='DELIVERED').length],
        ].map(([l,v]) => (
          <div key={l} style={{ padding:20, background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
            <div className="v-stat" style={{ fontSize:36 }}>{v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)' }}>LOADING...</p>}
      {error && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#e07070' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <table className="v-table">
            <thead><tr><th>ID</th><th>Order</th><th>Tracking</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {shipments.length === 0
                ? <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO SHIPMENTS FOUND</td></tr>
                : shipments.map(s => (
                  <tr key={s.id}>
                    <td className="mono gold">SHP-{s.id}</td>
                    <td className="mono" style={{ color:'var(--muted)', fontSize:10 }}>#{s.order?.id ?? 'N/A'}</td>
                    <td className="mono" style={{ color:'var(--muted)', fontSize:10 }}>{s.trackingNumber ?? 'N/A'}</td>
                    <td><span className={'v-badge ' + statusBadge(s.shipmentStatus)}>{s.shipmentStatus ?? 'N/A'}</span></td>
                    <td>
                      <select defaultValue={s.shipmentStatus}
                        onChange={async e => {
                          try { await request('/api/shipments/' + s.id + '/status?status=' + e.target.value, { method:'PUT' }); window.location.reload() }
                          catch(err) { alert(err.message) }
                        }}
                        style={{ background:'#1a1812', border:'1px solid var(--border)', color:'var(--muted)', padding:'4px 8px', fontFamily:'var(--font-mono)', fontSize:9, cursor:'pointer' }}>
                        {['PENDING','DISPATCHED','IN_TRANSIT','DELIVERED','CANCELLED'].map(st => <option key={st} value={st} style={{ background:'#1a1812' }}>{st}</option>)}
                      </select>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
