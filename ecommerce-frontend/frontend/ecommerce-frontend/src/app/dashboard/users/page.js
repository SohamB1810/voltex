'use client'
import { useState } from 'react'
import { getUsers, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'
import { Plus, X } from 'lucide-react'

export default function UsersPage() {
  const { data, loading, error } = useFetch(getUsers)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'CUSTOMER' })

  const users = Array.isArray(data) ? data : []

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      setShowForm(false)
      setForm({ name:'', email:'', password:'', role:'CUSTOMER' })
      window.location.reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this user?')) return
    try {
      await request('/api/users/' + id, { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <div className="v-label" style={{ marginBottom:12 }}>Accounts</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,60px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>USERS</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{users.length} total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="v-btn-gold" style={{ padding:'12px 22px', fontSize:13, letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14} /> ADD USER
        </button>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#111008', border:'1px solid rgba(201,168,76,0.2)', padding:40, width:'100%', maxWidth:480, position:'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--cream)', marginBottom:32 }}>ADD USER</h2>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[['Name','text','name','John Doe'],['Email','email','email','john@example.com'],['Password','password','password','••••••••']].map(([label, type, key, ph]) => (
                <div key={key}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:8 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})} placeholder={ph} required
                    style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'11px 14px', color:'var(--cream)', fontFamily:'var(--font-serif)', fontSize:15, outline:'none' }}
                    onFocus={e => e.target.style.borderColor='rgba(201,168,76,0.4)'}
                    onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
              ))}
              {formError && <p style={{ color:'#e07070', fontFamily:'var(--font-mono)', fontSize:10 }}>{formError}</p>}
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} className="v-btn-gold" style={{ flex:1, padding:13, fontSize:13, opacity: saving ? 0.65 : 1 }}>{saving ? 'SAVING...' : 'CREATE USER'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="v-btn-ghost" style={{ padding:'13px 20px', fontSize:13 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {[['Total',users.length],['Customers',users.filter(u=>u.role==='CUSTOMER').length],['Admins',users.filter(u=>u.role==='ADMIN').length]].map(([l,v]) => (
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
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {users.length === 0
                ? <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--muted)', padding:32, fontFamily:'var(--font-mono)', fontSize:10 }}>NO USERS FOUND</td></tr>
                : users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, background:'linear-gradient(135deg,var(--gold),#8b3a2a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:13, color:'var(--ink)', flexShrink:0 }}>
                          {u.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span className="bright">{u.name}</span>
                      </div>
                    </td>
                    <td className="mono" style={{ color:'var(--muted)', fontSize:10 }}>{u.email}</td>
                    <td><span className={'v-badge ' + (u.role==='ADMIN'?'v-badge-info':'v-badge-neutral')}>{u.role}</span></td>
                    <td>
                      <button onClick={() => handleDelete(u.id)}
                        style={{ background:'none', border:'1px solid rgba(224,112,112,0.3)', padding:'4px 10px', cursor:'pointer', color:'#e07070', fontFamily:'var(--font-mono)', fontSize:9 }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(224,112,112,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        DELETE
                      </button>
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
