'use client'
import { useState } from 'react'
import { Package, Search, Plus, X } from 'lucide-react'
import { getProducts, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'

export default function ProductsPage() {
  const { data, loading, error } = useFetch(getProducts)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ name:'', description:'', price:'', stock:'', category:'' })

  const products = data?.content ?? data ?? []
  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatus = p => {
    if (p.stock === 0) return 'out_of_stock'
    if (p.stock < 10) return 'low_stock'
    return 'active'
  }

  const statusBadge = s => {
    if (s === 'active') return 'v-badge-success'
    if (s === 'low_stock') return 'v-badge-warn'
    return 'v-badge-danger'
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await request('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category,
        }),
      })
      setShowForm(false)
      setForm({ name:'', description:'', price:'', stock:'', category:'' })
      window.location.reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    padding: '11px 14px',
    fontFamily: 'var(--font-serif)',
    fontSize: 15,
    color: 'var(--cream)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    display: 'block',
    marginBottom: 8,
  }

  const categories = ['Outerwear','Footwear','Knitwear','Accessories','Bottoms','Shirts','Dresses','Bags','Other']

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <div className="v-label" style={{ marginBottom:12 }}>Catalogue</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>PRODUCTS</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{products.length} items</p>
        </div>
        <button onClick={() => setShowForm(true)} className="v-btn-gold"
          style={{ padding:'12px 22px', fontSize:13, letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14}/> ADD PRODUCT
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#111008', border:'1px solid rgba(201,168,76,0.2)', padding:40, width:'100%', maxWidth:520, position:'relative', maxHeight:'90vh', overflowY:'auto' }}>
            <button onClick={() => setShowForm(false)}
              style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:4 }}>
              <X size={18}/>
            </button>

            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, letterSpacing:'0.06em', color:'var(--cream)', marginBottom:8 }}>ADD PRODUCT</h2>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.18em', color:'var(--muted)', marginBottom:32 }}>Fill in the details below</p>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name:e.target.value})}
                  placeholder="e.g. Obsidian Trench Coat"
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm({...form, description:e.target.value})}
                  placeholder="Short product description"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Category *</label>
                <div style={{ position:'relative' }}>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category:e.target.value})}
                    required
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      cursor: 'pointer',
                      paddingRight: 40,
                      background: '#1a1812',
                      color: form.category ? 'var(--cream)' : 'var(--muted)',
                    }}
                  >
                    <option value="" disabled style={{ background:'#1a1812', color:'var(--muted)' }}>Select a category</option>
                    {categories.map(c => (
                      <option key={c} value={c} style={{ background:'#1a1812', color:'var(--cream)' }}>{c}</option>
                    ))}
                  </select>
                  <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--muted)', fontSize:10 }}>?</div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label style={labelStyle}>Price (Rs.) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={e => setForm({...form, price:e.target.value})}
                    placeholder="e.g. 9999"
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => setForm({...form, stock:e.target.value})}
                    placeholder="e.g. 100"
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'}
                  />
                </div>
              </div>

              {formError && (
                <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#e07070', background:'rgba(180,40,40,0.1)', border:'1px solid rgba(180,40,40,0.2)', padding:'10px 14px' }}>
                  {formError}
                </p>
              )}

              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <button type="submit" disabled={saving} className="v-btn-gold"
                  style={{ flex:1, padding:'13px', fontSize:13, letterSpacing:'0.1em', opacity: saving ? 0.65 : 1 }}>
                  {saving ? 'SAVING...' : 'CREATE PRODUCT'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="v-btn-ghost"
                  style={{ padding:'13px 20px', fontSize:13 }}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[['Total',products.length],['In Stock',products.filter(p=>p.stock>0).length],['Out of Stock',products.filter(p=>p.stock===0).length]].map(([l,v]) => (
          <div key={l} style={{ padding:'20px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
            <div className="v-stat" style={{ fontSize:36 }}>{v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative' }}>
        <Search size={13} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'11px 14px 11px 38px', fontFamily:'var(--font-serif)', fontSize:15, color:'var(--cream)', outline:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
          onBlur={e => e.target.style.borderColor='var(--border)'}
        />
      </div>

      {loading && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.15em' }}>LOADING...</p>}
      {error   && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#e07070' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <table className="v-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--muted)', padding:'32px', fontFamily:'var(--font-mono)', fontSize:10 }}>NO PRODUCTS FOUND</td></tr>
                : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:34, height:34, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Package size={14} style={{ color:'var(--gold)' }}/>
                        </div>
                        <span className="bright" style={{ fontFamily:'var(--font-serif)', fontSize:15 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td className="bright">Rs.{p.price?.toLocaleString()}</td>
                    <td style={{ color:p.stock===0?'#e07070':p.stock<10?'#d4785a':'var(--cream)', fontFamily:'var(--font-mono)', fontSize:13 }}>{p.stock}</td>
                    <td><span className={`v-badge ${statusBadge(getStatus(p))}`}>{getStatus(p).replace('_',' ')}</span></td>
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
