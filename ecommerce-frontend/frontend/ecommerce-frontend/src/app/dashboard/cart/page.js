'use client'
import { useState } from 'react'
import { getCart, getProducts, addToCart, removeFromCart } from '@/lib/api'
import useFetch from '@/lib/useFetch'
import { Plus, X, ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const { data, loading, error } = useFetch(getCart)
  const { data: pd } = useFetch(getProducts)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [formError, setFormError] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')

  const cart = data?.data ?? null
  const items = cart?.cartItems ?? []
  const products = pd?.content ?? pd ?? []
  const total = items.reduce((sum, item) => sum + ((item.product?.price ?? 0) * item.quantity), 0)

  const handleAddToCart = async e => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await addToCart(productId, quantity)
      setShowForm(false)
      setProductId('')
      setQuantity('1')
      window.location.reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async itemId => {
    setRemoving(itemId)
    try {
      await removeFromCart(itemId)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <div className="v-label" style={{ marginBottom:12 }}>My Cart</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>CART</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{items.length} items</p>
        </div>
        <button onClick={() => setShowForm(true)} className="v-btn-gold" style={{ padding:'12px 22px', fontSize:13, letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14} /> ADD TO CART
        </button>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#111008', border:'1px solid rgba(201,168,76,0.2)', padding:40, width:'100%', maxWidth:480, position:'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--cream)', marginBottom:32 }}>ADD TO CART</h2>
            <form onSubmit={handleAddToCart} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>Product</label>
                <select value={productId} onChange={e => setProductId(e.target.value)} required style={{ width:'100%', background:'#1a1812', border:'1px solid var(--border)', padding:'11px 14px', color: productId ? 'var(--cream)' : 'var(--muted)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }}>
                  <option value="" disabled>Select a product</option>
                  {products.filter(p => p.stock > 0).map(p => (
                    <option key={p.id} value={p.id} style={{ background:'#1a1812', color:'var(--cream)' }}>{p.name} - Rs.{p.price?.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>Quantity</label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'11px 14px', color:'var(--cream)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }} />
              </div>
              {formError && <p style={{ color:'#e07070', fontFamily:'var(--font-mono)', fontSize:10 }}>{formError}</p>}
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} className="v-btn-gold" style={{ flex:1, padding:13, fontSize:13, opacity: saving ? 0.65 : 1 }}>{saving ? 'ADDING...' : 'ADD TO CART'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="v-btn-ghost" style={{ padding:'13px 20px', fontSize:13 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[['Items', items.length],['Total Value', 'Rs.' + total.toLocaleString()],['Products', new Set(items.map(i => i.product?.id)).size]].map(([l,v]) => (
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
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Remove</th></tr></thead>
            <tbody>
              {items.length === 0
                ? <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                      <ShoppingCart size={24} style={{ opacity:0.3 }} />
                      CART IS EMPTY
                    </div>
                  </td></tr>
                : items.map(item => (
                  <tr key={item.id}>
                    <td className="bright">{item.product?.name ?? 'Product'}</td>
                    <td style={{ color:'var(--muted)' }}>{item.product?.category ?? 'N/A'}</td>
                    <td>Rs.{item.product?.price?.toLocaleString() ?? 'N/A'}</td>
                    <td className="bright">{item.quantity}</td>
                    <td className="bright">Rs.{((item.product?.price ?? 0) * item.quantity).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleRemove(item.id)} disabled={removing === item.id}
                        style={{ background:'none', border:'1px solid rgba(224,112,112,0.3)', padding:'4px 10px', cursor:'pointer', color:'#e07070', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.1em', opacity: removing === item.id ? 0.5 : 1 }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(224,112,112,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        {removing === item.id ? '...' : 'REMOVE'}
                      </button>
                    </td>
                  </tr>
                ))
              }
              {items.length > 0 && (
                <tr style={{ borderTop:'1px solid var(--border)' }}>
                  <td colSpan={4} style={{ textAlign:'right', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.15em', color:'var(--muted)', padding:'16px 20px' }}>TOTAL</td>
                  <td className="bright" style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold)' }}>Rs.{total.toLocaleString()}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button className="v-btn-gold" style={{ padding:'14px 32px', fontSize:14, letterSpacing:'0.12em' }}>
            CHECKOUT - Rs.{total.toLocaleString()}
          </button>
        </div>
      )}
    </div>
  )
}
