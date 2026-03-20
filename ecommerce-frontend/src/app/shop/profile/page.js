'use client'
import { useSession } from 'next-auth/react'

export default function ShopProfile() {
  const { data: session } = useSession()
  const u = session?.user

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Shop · Account</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'var(--cream)', letterSpacing: '0.04em' }}>PROFILE</h1>
      </div>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        {u?.image
          ? <img src={u.image} alt={u.name} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--gold)' }} />
          : <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)' }}>{(u?.name || 'U')[0].toUpperCase()}</div>}
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--cream)', marginBottom: 4 }}>{u?.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em' }}>{u?.email}</div>
          <span className="v-badge v-badge-neutral" style={{ marginTop: 8 }}>{u?.role || 'CUSTOMER'}</span>
        </div>
      </div>

      {/* Info cards */}
      {[
        { label: 'Full Name', value: u?.name },
        { label: 'Email Address', value: u?.email },
        { label: 'Account Role', value: u?.role || 'CUSTOMER' },
        { label: 'Sign-in Method', value: u?.image ? 'Google OAuth' : 'Email & Password' },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--cream)' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
