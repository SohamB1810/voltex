'use client'
import { useState, useEffect } from 'react'
import { Edit2, RefreshCw } from 'lucide-react'

export default function AdminInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/inventory').then(r => r.json()).then(d => setInventory(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const restock = async (id, current) => {
    const qty = prompt(`Restock quantity (current: ${current}):`, current)
    if (qty === null) return
    await fetch(`/api/proxy/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stockQuantity: parseInt(qty) }) })
    load()
  }

  const getS = qty => qty === 0 ? { label: 'Out of Stock', cls: 'v-badge-danger', color: '#f87171' } : qty < 10 ? { label: 'Low Stock', cls: 'v-badge-warn', color: '#d4785a' } : { label: 'In Stock', cls: 'v-badge-success', color: '#4ade80' }

  const outOfStock = inventory.filter(i => i.stockQuantity === 0).length
  const lowStock = inventory.filter(i => i.stockQuantity > 0 && i.stockQuantity < 10).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Stock Control</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>INVENTORY</h1>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <RefreshCw size={11} />Refresh
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {[['Total SKUs', inventory.length, 'var(--gold)'], ['Low Stock', lowStock, '#d4785a'], ['Out of Stock', outOfStock, '#f87171']].map(([l, v, c]) => (
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
            <thead><tr><th>Product</th><th>Category</th><th>Quantity</th><th>Status</th><th>Restock</th></tr></thead>
            <tbody>
              {inventory.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO INVENTORY DATA</td></tr>
                : inventory.map(i => {
                  const { label, cls, color } = getS(i.stockQuantity)
                  return (
                    <tr key={i._id}>
                      <td className="bright">{i.productName || i.name || '—'}</td>
                      <td style={{ color: 'var(--muted)' }}>{i.category || '—'}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color }}>{i.stockQuantity ?? '—'}</td>
                      <td><span className={`v-badge ${cls}`}>{label}</span></td>
                      <td>
                        <button onClick={() => restock(i._id, i.stockQuantity)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', cursor: 'pointer', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>
                          <Edit2 size={9} />Restock
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
