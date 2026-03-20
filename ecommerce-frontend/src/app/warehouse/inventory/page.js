'use client'
import { useState, useEffect } from 'react'

export default function WorkerInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/inventory').then(r => r.json()).then(d => setInventory(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateQty = async (id, current) => {
    const qty = prompt(`Update stock quantity (current: ${current}):`, current)
    if (qty === null) return
    await fetch(`/api/proxy/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stockQuantity: parseInt(qty) }) })
    load()
  }

  const getS = qty => qty === 0 ? { label: 'Out of Stock', cls: 'v-badge-danger' } : qty < 10 ? { label: 'Low', cls: 'v-badge-warn' } : { label: 'OK', cls: 'v-badge-success' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Worker · Stock View</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>INVENTORY</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Status</th><th>Update After Packing</th></tr></thead>
            <tbody>
              {inventory.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO INVENTORY DATA</td></tr>
                : inventory.map(i => {
                  const { label, cls } = getS(i.stockQuantity)
                  return (
                    <tr key={i._id}>
                      <td className="bright">{i.productName || i.name || '—'}</td>
                      <td style={{ color: 'var(--muted)' }}>{i.category || '—'}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: i.stockQuantity === 0 ? '#f87171' : i.stockQuantity < 10 ? '#d4785a' : 'var(--cream)' }}>{i.stockQuantity ?? '—'}</td>
                      <td><span className={`v-badge ${cls}`}>{label}</span></td>
                      <td>
                        <button onClick={() => updateQty(i._id, i.stockQuantity)} style={{ background: 'none', border: '1px solid var(--border)', padding: '4px 12px', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em' }}>
                          UPDATE QTY
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
