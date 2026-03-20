'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

const empty = { name: '', category: '', price: '', description: '', stock: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/products').then(r => r.json()).then(d => { setProducts(Array.isArray(d) ? d : []) }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = p => { setEditing(p._id); setForm({ name: p.name, category: p.category, price: p.price, description: p.description, stock: p.stock }); setShowModal(true) }

  const save = async () => {
    setSaving(true)
    const body = { name: form.name, category: form.category, price: Number(form.price), description: form.description, stock: Number(form.stock) }
    if (editing) {
      await fetch(`/api/proxy/products/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch('/api/proxy/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setSaving(false); setShowModal(false); load()
  }

  const del = async id => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/proxy/products/${id}`, { method: 'DELETE' }); load()
  }

  const iS = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '10px 14px', color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Catalogue</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>PRODUCTS</h1>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--gold)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 700 }}>
          <Plus size={13} />Add Product
        </button>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO PRODUCTS — Click Add to create one</td></tr>
                : products.map(p => (
                  <tr key={p._id}>
                    <td className="bright">{p.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{p.category || '—'}</td>
                    <td className="mono" style={{ color: 'var(--gold)' }}>₹{(p.price || 0).toLocaleString()}</td>
                    <td>
                      <span className={`v-badge ${p.stock === 0 ? 'v-badge-danger' : p.stock < 10 ? 'v-badge-warn' : 'v-badge-success'}`}>{p.stock ?? '—'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid var(--border)', padding: '4px 10px', cursor: 'pointer', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 4 }}><Edit2 size={10} />Edit</button>
                        <button onClick={() => del(p._id)} style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', padding: '4px 10px', cursor: 'pointer', color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={10} />Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0e0d0b', border: '1px solid var(--border)', padding: 32, width: 480, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.08em', color: 'var(--cream)' }}>{editing ? 'EDIT' : 'ADD'} PRODUCT</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['name', 'category', 'price', 'stock', 'description'].map(f => (
                <div key={f}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{f}</label>
                  {f === 'description'
                    ? <textarea value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} rows={3} style={{ ...iS, resize: 'vertical' }} />
                    : <input type={['price', 'stock'].includes(f) ? 'number' : 'text'} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} style={iS} />
                  }
                </div>
              ))}
              <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', background: 'var(--gold)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 700, marginTop: 8 }}>
                <Check size={13} />{saving ? 'SAVING...' : 'SAVE PRODUCT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
