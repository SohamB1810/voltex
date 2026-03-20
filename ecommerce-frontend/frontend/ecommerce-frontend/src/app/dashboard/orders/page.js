'use client'
import { useState } from 'react'
import { getOrders, getProducts, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'
import { Plus, X } from 'lucide-react'

const statusColor = s => {
  if (s === 'DELIVERED') return 'v-badge-success'
  if (s === 'SHIPPED') return 'v-badge-info'
  if (s === 'PROCESSING') return 'v-badge-warn'
  if (s === 'CANCELLED') return 'v-badge-danger'
  return 'v-badge-neutral'
}

export default function OrdersPage() {
  const { data, loading, error } = useFetch(getOrders)
  const { data: pd } = useFetch(getProducts)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')

  const orders = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
  const products = pd?.content ?? pd ?? []
  const selectedProduct = products.find(p => p.id == productId)
  const orderTotal = selectedProduct ? selectedProduct.price * parseInt(quantity || 1) : 0

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await request('/orders/place?userId=1&productId=' + productId + '&quantity=' + quantity, { method: 'POST' })
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

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <div className="v-label" style={{ marginBottom:12 }}>Fulfilment</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>ORDERS</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{orders.length} total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="v-btn-gold" style={{ padding:'12px 22px', fontSize:13, letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14} /> PLACE ORDER
        </button>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#111008', border:'1px solid rgba(201,168,76,0.2)', padding:40, width:'100%', maxWidth:480, position:'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--cream)', marginBottom:32 }}>PLACE ORDER</h2>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>Product</label>
                <select value={productId} onChange={e => setProductId(e.target.value)} required style={{ width:'100%', background:'#1a1812', border:'1px solid var(--border)', padding:'11px 14px', color: productId ? 'var(--cream)' : 'var(--muted)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }}>
                  <option value="" disabled>Select a product</option>
                  {products.filter(p => p.stock > 0).map(p => (
                    <option key={p.id} value={p.id} style={{ background:'#1a1812', color:'var(--cream)' }}>{p.name} - Rs.{p.price?.toLocaleString()} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>Quantity</label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'11px 14px', color:'var(--cream)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }} />
              </div>
              {productId && (
                <div style={{ padding:14, background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.15)' }}>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)', marginBottom:4 }}>TOTAL</p>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:24, color:'var(--gold)' }}>Rs.{orderTotal.toLocaleString()}</p>
                </div>
              )}
              {formError && <p style={{ color:'#e07070', fontFamily:'var(--font-mono)', fontSize:10 }}>{formError}</p>}
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} className="v-btn-gold" style={{ flex:1, padding:13, fontSize:13, opacity: saving ? 0.65 : 1 }}>{saving ? 'PLACING...' : 'CONFIRM ORDER'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="v-btn-ghost" style={{ padding:'13px 20px', fontSize:13 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
        {[['Total',orders.length],['Created',orders.filter(o=>o.orderStatus==='CREATED').length],['Processing',orders.filter(o=>o.orderStatus==='PROCESSING').length],['Delivered',orders.filter(o=>o.orderStatus==='DELIVERED').length]].map(([l,v]) => (
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
            <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO ORDERS YET</td></tr>
                : orders.map(o => (
                  <tr key={o.id}>
                    <td className="mono gold">#{o.id}</td>
                    <td className="bright">{o.product?.name ?? 'N/A'}</td>
                    <td>{o.quantity}</td>
                    <td className="bright">Rs.{o.totalPrice?.toLocaleString()}</td>
                    <td><span className={'v-badge ' + statusColor(o.orderStatus)}>{o.orderStatus}</span></td>
                    <td>
                      <select defaultValue={o.orderStatus} onChange={async e => { try { await request('/orders/' + o.id + '/status?status=' + e.target.value, { method:'PUT' }); window.location.reload() } catch(err) { alert(err.message) } }} style={{ background:'#1a1812', border:'1px solid var(--border)', color:'var(--muted)', padding:'4px 8px', fontFamily:'var(--font-mono)', fontSize:9, cursor:'pointer' }}>
                        {['CREATED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => <option key={s} value={s} style={{ background:'#1a1812' }}>{s}</option>)}
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
