'use client'
import { getInventory, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'

export default function InventoryPage() {
  const { data, loading, error } = useFetch(getInventory)

  const rawInventory = data?.data ?? data
  const inventory = Array.isArray(rawInventory) ? rawInventory : []

  const getStatus = qty => {
    if (qty === 0) return { label:'Out of Stock', cls:'v-badge-danger' }
    if (qty < 10) return { label:'Low Stock', cls:'v-badge-warn' }
    return { label:'In Stock', cls:'v-badge-success' }
  }

  const updateQty = async (id, qty) => {
    const newQty = prompt('Enter new quantity:', qty)
    if (newQty === null) return
    try {
      await request('/api/inventory/' + id + '?quantity=' + newQty, { method:'PUT' })
      window.location.reload()
    } catch(err) { alert(err.message) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div>
        <div className="v-label" style={{ marginBottom:12 }}>Stock Control</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>INVENTORY</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[
          ['Total SKUs', inventory.length],
          ['In Stock', inventory.filter(i=>i.stockQuantity>0).length],
          ['Out of Stock', inventory.filter(i=>i.stockQuantity===0).length],
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
            <thead><tr><th>Product</th><th>Category</th><th>Quantity</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {inventory.length === 0
                ? <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO INVENTORY DATA</td></tr>
                : inventory.map(i => {
                  const { label, cls } = getStatus(i.stockQuantity)
                  return (
                    <tr key={i.id}>
                      <td className="bright">{i.product?.name ?? 'N/A'}</td>
                      <td style={{ color:'var(--muted)' }}>{i.product?.category ?? 'N/A'}</td>
                      <td style={{ color: i.stockQuantity===0?'#e07070':i.stockQuantity<10?'#d4785a':'var(--cream)', fontFamily:'var(--font-mono)', fontSize:13 }}>{i.stockQuantity}</td>
                      <td><span className={'v-badge ' + cls}>{label}</span></td>
                      <td>
                        <button onClick={() => updateQty(i.id, i.stockQuantity)}
                          style={{ background:'none', border:'1px solid rgba(201,168,76,0.3)', padding:'4px 10px', cursor:'pointer', color:'var(--gold)', fontFamily:'var(--font-mono)', fontSize:9 }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background='none'}>
                          EDIT
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
