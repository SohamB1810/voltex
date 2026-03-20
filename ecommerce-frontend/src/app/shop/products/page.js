'use client'
import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Accessories', 'Sports', 'Appliances']

export default function ShopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [adding, setAdding] = useState(null)

  useEffect(() => {
    fetch('/api/proxy/products').then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }, [])

  const addToCart = async (product) => {
    setAdding(product._id)
    const cartRes = await fetch('/api/proxy/cart').then(r => r.json()).catch(() => [])
    const existing = Array.isArray(cartRes) ? cartRes.find(i => i.productId === product._id) : null
    if (existing) {
      await fetch(`/api/proxy/cart/${existing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: (existing.quantity || 1) + 1 }) })
    } else {
      await fetch('/api/proxy/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product._id, productName: product.name, price: product.price, quantity: 1 }) })
    }
    setAdding(null)
    alert(`"${product.name}" added to cart!`)
  }

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Shop · Catalogue</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>PRODUCTS</h1>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 11, paddingBottom: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: category === c ? 'var(--gold)' : 'rgba(255,255,255,0.03)', border: `1px solid ${category === c ? 'var(--gold)' : 'var(--border)'}`, color: category === c ? 'var(--ink)' : 'var(--muted)', cursor: 'pointer', fontWeight: category === c ? 700 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
          {filtered.length === 0
            ? <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', padding: 32 }}>No products found</p>
            : filtered.map(p => (
              <div key={p._id} className="v-card-hover" style={{ padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>{p.category}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--cream)', fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5 }}>{p.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', letterSpacing: '0.04em' }}>₹{(p.price || 0).toLocaleString()}</span>
                  <button onClick={() => addToCart(p)} disabled={adding === p._id || p.stock === 0}
                    style={{ padding: '8px 16px', background: p.stock === 0 ? 'rgba(255,255,255,0.05)' : 'var(--gold)', border: `1px solid ${p.stock === 0 ? 'var(--border)' : 'var(--gold)'}`, color: p.stock === 0 ? 'var(--muted)' : 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: adding === p._id ? 0.6 : 1 }}>
                    {p.stock === 0 ? 'OUT OF STOCK' : adding === p._id ? 'ADDING...' : 'ADD TO CART'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
