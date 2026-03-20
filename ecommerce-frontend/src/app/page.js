'use client'
import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'

export default function HomePage() {
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' })
  const [error, setError] = useState('')
  const heroRef = useRef(null)
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  // Custom cursor
  useEffect(() => {
    const dot = document.getElementById('v-cursor-dot')
    const ring = document.getElementById('v-cursor-ring')
    if (!dot || !ring) return
    const onMove = e => {
      mx.current = e.clientX; my.current = e.clientY
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'
    }
    document.addEventListener('mousemove', onMove)
    let raf
    const animRing = () => {
      rx.current += (mx.current - rx.current) * 0.12
      ry.current += (my.current - ry.current) * 0.12
      ring.style.left = rx.current + 'px'; ring.style.top = ry.current + 'px'
      raf = requestAnimationFrame(animRing)
    }
    animRing()
    const hover = e => document.body.classList.toggle('cursor-hover', ['A', 'BUTTON', 'INPUT'].includes(e.target.tagName))
    document.addEventListener('mouseover', hover)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', hover); cancelAnimationFrame(raf) }
  }, [])

  // Preloader
  useEffect(() => {
    let count = 0
    const el = document.getElementById('v-preloader-pct')
    const iv = setInterval(() => {
      count = Math.min(count + Math.floor(Math.random() * 18) + 4, 100)
      if (el) el.textContent = count + '%'
      if (count >= 100) {
        clearInterval(iv)
        setTimeout(() => {
          const pl = document.getElementById('v-preloader')
          if (pl) { pl.classList.add('v-exit'); setTimeout(() => { pl.style.display = 'none'; setPreloaderDone(true) }, 900) }
        }, 350)
      }
    }, 75)
    return () => clearInterval(iv)
  }, [])

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (heroRef.current) heroRef.current.style.transform = `translateY(${y * 0.22}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observer for reveal
  useEffect(() => {
    if (!preloaderDone) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v-in') }), { threshold: 0.1 }
    )
    document.querySelectorAll('.v-reveal, .v-reveal-l').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [preloaderDone])

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/auth/redirect' })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!form.email || !form.password) throw new Error('Please fill all fields.')
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
      // Step 1: try sign-in without redirect so we can catch errors
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) throw new Error('Invalid email or password. Please check your credentials.')
      // Step 2: on success, go to /auth/redirect which reads role from JWT and pushes to correct panel
      window.location.href = '/auth/redirect'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Preloader */}
      <div id="v-preloader" style={{ position: 'fixed', inset: 0, background: 'var(--ink)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '0.08em', color: 'var(--cream)' }}>VÖLTEX</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 180, height: 1, background: 'var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div id="v-preloader-bar" style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'var(--gold)', width: '0%', transition: 'width 0.1s ease' }} />
          </div>
          <span id="v-preloader-pct" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', color: 'var(--muted)' }}>0%</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Verifying Systems...</span>
        </div>
      </div>

      {/* Custom cursor */}
      <div id="v-cursor-dot" style={{ position: 'fixed', width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%,-50%)' }} />
      <div id="v-cursor-ring" style={{ position: 'fixed', width: 28, height: 28, border: '1px solid rgba(201,168,76,0.4)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9997, transform: 'translate(-50%,-50%)', transition: 'width 0.3s,height 0.3s,border-color 0.3s' }} />

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div ref={heroRef} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="v-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', padding: '120px 80px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          {/* Left: Hero text */}
          <div>
            <div className="v-label v-reveal" style={{ marginBottom: 24 }}>SS26— NEW CURRENT</div>
            <h1 className="v-reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(64px,7vw,112px)', letterSpacing: '0.03em', color: 'var(--cream)', lineHeight: 0.88, marginBottom: 40 }}>
              THE<br />
              <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--gold)', fontSize: '0.7em' }}>new</em><br />
              CURRENT<br />
              IS HERE
            </h1>
            <p className="v-reveal" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Commerce Platform · Spring Boot API · Völtex 2026
            </p>
          </div>

          {/* Right: Auth form */}
          <div className="v-reveal" style={{ maxWidth: 400, width: '100%' }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: 4, borderRadius: 4, marginBottom: 32 }}>
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError('') }}
                  style={{ flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', borderRadius: 2, transition: 'all 0.3s ease', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--muted)' }}>
                  {m === 'login' ? 'SIGN IN' : 'REGISTER'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '0.05em', color: 'var(--cream)', lineHeight: 0.95 }}>
                {mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8 }}>
                {mode === 'login' ? 'Enter your credentials' : 'Create your account'}
              </p>
            </div>

            {/* Google button */}
            <button onClick={handleGoogleSignIn}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, transition: 'border-color 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-2.9-11.3-7H6.2C9.6 39.5 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.8l6.2 5.2C40.9 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Form */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Name</label>
                  <input name="name" value={form.name} onChange={handle} autoComplete="name"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 16px', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="Your name" />
                </div>
              )}

              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handle} autoComplete="email"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 16px', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="email@example.com" />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 44px 13px 16px', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14 }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Role</label>
                  <select name="role" value={form.role} onChange={handle}
                    style={{ width: '100%', background: '#1a1812', border: '1px solid var(--border)', padding: '13px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="WORKER">Worker</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              )}

              {error && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e07070', letterSpacing: '0.1em', padding: '10px 14px', background: 'rgba(224,112,112,0.07)', border: '1px solid rgba(224,112,112,0.2)' }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                style={{ padding: '15px', background: loading ? 'rgba(201,168,76,0.4)' : 'var(--gold)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.15em', color: 'var(--ink)', fontWeight: 700, transition: 'all 0.3s', marginTop: 4 }}>
                {loading ? 'SIGNING IN...' : mode === 'login' ? 'ENTER →' : 'CREATE ACCOUNT →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes v-preloader-exit { to { opacity: 0; pointer-events: none } }
        .v-exit { animation: v-preloader-exit 0.9s ease forwards !important; }
        .v-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .v-reveal.v-in { opacity: 1; transform: translateY(0); }
        .v-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 12px; }
        .v-label::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); }
      `}</style>
    </>
  )
}