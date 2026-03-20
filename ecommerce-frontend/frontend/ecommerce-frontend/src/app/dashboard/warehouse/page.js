'use client'
import { useState } from 'react'
import { getWarehouses, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'
import { Plus, X } from 'lucide-react'

export default function WarehousePage() {
  const { data, loading, error } = useFetch(getWarehouses)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ name:'', location:'' })

  const rawWarehouses = data?.data ?? data
  const warehouses = Array.isArray(rawWarehouses) ? rawWarehouses : []

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await request('/api/warehouse', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, location: form.location }),
      })
      setShowForm(false)
      setForm({ name:'', location:'' })
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
          <div className="v-label" style={{ marginBottom:12 }}>Facilities</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>WAREHOUSE</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{warehouses.length} facilities</p>
        </div>
        <button onClick={() => setShowForm(true)} className="v-btn-gold" style={{ padding:'12px 22px', fontSize:13, letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14} /> ADD WAREHOUSE
        </button>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#111008', border:'1px solid rgba(201,168,76,0.2)', padding:40, width:'100%', maxWidth:480, position:'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--cream)', marginBottom:32 }}>ADD WAREHOUSE</h2>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[['Name','name','e.g. WH-Chennai'],['Location','location','e.g. Chennai']].map(([label, key, ph]) => (
                <div key={key}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})} placeholder={ph} required
                    style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'11px 14px', color:'var(--cream)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }}
                    onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
              ))}
              {formError && <p style={{ color:'#e07070', fontFamily:'var(--font-mono)', fontSize:10 }}>{formError}</p>}
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} className="v-btn-gold" style={{ flex:1, padding:13, fontSize:13, opacity: saving ? 0.65 : 1 }}>{saving ? 'SAVING...' : 'CREATE WAREHOUSE'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="v-btn-ghost" style={{ padding:'13px 20px', fontSize:13 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[['Total',warehouses.length],['Active',warehouses.length],['Locations', new Set(warehouses.map(w=>w.location)).size]].map(([l,v]) => (
          <div key={l} style={{ padding:20, background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
            <div className="v-stat" style={{ fontSize:36 }}>{v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)' }}>LOADING...</p>}
      {error && <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#e07070' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {warehouses.length === 0
            ? <div style={{ gridColumn:'1/-1', textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO WAREHOUSES FOUND</div>
            : warehouses.map(w => (
              <div key={w.id} style={{ padding:24, background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, var(--gold), transparent)', opacity:0.4 }} />
                <div style={{ fontFamily:'var(--font-display)', fontSize:20, letterSpacing:'0.08em', color:'var(--cream)', marginBottom:4 }}>{w.name}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.18em', color:'var(--muted)', marginBottom:20 }}>{w.location}</div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)' }}>ID</span>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:14, color:'var(--gold)' }}>WH-{String(w.id).padStart(3,'0')}</span>
                </div>
                <div style={{ marginTop:16 }}>
                  <span className="v-badge v-badge-success">operational</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
