'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function AuthModal() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!form.name) throw new Error('Please enter your name.')
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Registration failed')
      }
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) throw new Error('Invalid email or password')
      // Get session to read role for redirect
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role
      if (role === 'ADMIN') router.push('/dashboard')
      else if (role === 'WORKER') router.push('/warehouse')
      else router.push('/shop')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => signIn('google', { callbackUrl: '/auth/redirect' })

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    padding: '13px 16px', fontFamily: 'var(--font-serif)', fontSize: 16,
    color: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box',
  }
  const labelStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8,
  }

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: 4, borderRadius: 4, marginBottom: 32 }}>
        {['login', 'signup'].map(m => (
          <button key={m} onClick={() => { setMode(m); setError('') }}
            style={{ flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, transition: 'all 0.3s', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--muted)' }}>
            {m === 'login' ? 'SIGN IN' : 'REGISTER'}
          </button>
        ))}
      </div>

      {/* Google Button */}
      <button onClick={handleGoogle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20, transition: 'all 0.25s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-2.9-11.3-7H6.2C9.6 39.5 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.8l6.2 5.2C40.9 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)' }}>OR</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'signup' && (
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handle} placeholder="John Doe" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
        )}
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@domain.com" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        {mode === 'signup' && (
          <div>
            <label style={labelStyle}>Account Role</label>
            <select name="role" value={form.role} onChange={handle}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="CUSTOMER" style={{ background: '#0e0d0b' }}>Customer</option>
              <option value="WORKER" style={{ background: '#0e0d0b' }}>Worker</option>
              <option value="ADMIN" style={{ background: '#0e0d0b' }}>Admin</option>
            </select>
          </div>
        )}
        {error && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e07070', background: 'rgba(180,40,40,0.1)', border: '1px solid rgba(180,40,40,0.2)', padding: '10px 14px', margin: 0 }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="v-btn-gold"
          style={{ padding: '15px 24px', fontSize: 13, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.65 : 1 }}>
          {loading
            ? <span style={{ width: 18, height: 18, border: '2px solid rgba(14,13,11,0.3)', borderTopColor: 'var(--ink)', borderRadius: '50%', display: 'block', animation: 'spin 0.8s linear infinite' }} />
            : <>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}<ArrowRight size={15} /></>}
        </button>
      </form>
    </div>
  )
}
