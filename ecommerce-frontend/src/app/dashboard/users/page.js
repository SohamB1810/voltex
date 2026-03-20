'use client'
import { useState, useEffect } from 'react'
import { UserX, Shield } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/proxy/users').then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateRole = async (id, role) => {
    await fetch(`/api/proxy/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) })
    load()
  }

  const deleteUser = async id => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/proxy/users/${id}`, { method: 'DELETE' }); load()
  }

  const roleBadge = r => r === 'ADMIN' ? 'v-badge-warn' : r === 'WORKER' ? 'v-badge-info' : 'v-badge-neutral'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Admin · Access Control</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 0.95 }}>USERS</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <table className="v-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Provider</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10 }}>NO USERS YET</td></tr>
                : users.map(u => (
                  <tr key={u._id || u.id}>
                    <td className="bright">{u.name}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{u.email}</td>
                    <td><span className={`v-badge ${roleBadge(u.role)}`}>{u.role || 'CUSTOMER'}</span></td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>{u.provider || 'credentials'}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <select defaultValue={u.role || 'CUSTOMER'} onChange={e => updateRole(u._id || u.id, e.target.value)}
                          style={{ background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="WORKER">WORKER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button onClick={() => deleteUser(u._id || u.id)} style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', padding: '4px 8px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 9 }}>
                          <UserX size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
