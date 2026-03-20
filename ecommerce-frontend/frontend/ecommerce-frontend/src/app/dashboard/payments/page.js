'use client'
import { getPayments, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'

const statusBadge = s => s==='SUCCESS'?'v-badge-success':s==='REFUNDED'?'v-badge-warn':s==='FAILED'?'v-badge-danger':'v-badge-neutral'

export default function PaymentsPage() {
  const { data, loading, error } = useFetch(getPayments)

  const rawPayments = data?.data ?? data
  const payments = Array.isArray(rawPayments) ? rawPayments : []
  const total = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0)
  const success = payments.filter(p => p.paymentStatus === 'SUCCESS').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div>
        <div className="v-label" style={{ marginBottom:12 }}>Transactions</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>PAYMENTS</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
        {[
          ['Total', payments.length],
          ['Success', success],
          ['Pending', payments.filter(p=>p.paymentStatus==='PENDING').length],
          ['Revenue', 'Rs.' + total.toLocaleString()],
        ].map(([l,v]) => (
          <div key={l} style={{ padding:20, background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
            <div className="v-stat" style={{ fontSize:32 }}>{v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)' }}>LOADING...</p>}
      {error && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#e07070' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <table className="v-table">
            <thead><tr><th>ID</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {payments.length === 0
                ? <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO PAYMENTS FOUND</td></tr>
                : payments.map(p => (
                  <tr key={p.id}>
                    <td className="mono gold">PAY-{p.id}</td>
                    <td className="mono" style={{ color:'var(--muted)', fontSize:10 }}>#{p.order?.id ?? 'N/A'}</td>
                    <td className="bright">Rs.{p.amount?.toLocaleString()}</td>
                    <td>{p.paymentMethod ?? 'N/A'}</td>
                    <td><span className={'v-badge ' + statusBadge(p.paymentStatus)}>{p.paymentStatus}</span></td>
                    <td>
                      <select defaultValue={p.paymentStatus}
                        onChange={async e => {
                          try { await request('/api/payments/' + p.id + '/status?status=' + e.target.value, { method:'PUT' }); window.location.reload() }
                          catch(err) { alert(err.message) }
                        }}
                        style={{ background:'#1a1812', border:'1px solid var(--border)', color:'var(--muted)', padding:'4px 8px', fontFamily:'var(--font-mono)', fontSize:9, cursor:'pointer' }}>
                        {['PENDING','SUCCESS','FAILED','REFUNDED'].map(s => <option key={s} value={s} style={{ background:'#1a1812' }}>{s}</option>)}
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
