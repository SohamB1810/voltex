'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Package, MapPin } from 'lucide-react'

const statusCls = s => s === 'delivered' ? 'v-badge-success' : s === 'shipped' || s === 'out_for_delivery' ? 'v-badge-info' : s === 'processing' || s === 'packed' ? 'v-badge-warn' : 'v-badge-neutral'

const STEPS = ['pending', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered']

export default function ShopOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch('/api/proxy/orders').then(r => r.json())
      .then(d => setOrders(Array.isArray(d) ? [...d].filter(o => o.userId === session?.user?.email).reverse() : []))
      .finally(() => setLoading(false))
  }, [session])

  const stepIdx = status => STEPS.indexOf(status)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Shop · History</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'var(--cream)', letterSpacing: '0.04em' }}>MY ORDERS</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LOADING...</p>}

      {!loading && orders.length === 0 && (
        <div style={{ padding: 64, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Package size={32} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.2em' }}>NO ORDERS YET</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map(o => (
            <div key={o._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {/* Header */}
              <button onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}>
                <Package size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--cream)' }}>{o.productName}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', marginTop: 2 }}>ORDER #{(o._id || '').slice(-8).toUpperCase()} · {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)' }}>₹{(o.amount || 0).toLocaleString()}</div>
                <span className={`v-badge ${statusCls(o.status)}`}>{o.status || 'pending'}</span>
              </button>

              {/* Expanded tracking */}
              {expanded === o._id && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
                  {/* Progress */}
                  <div style={{ paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      {STEPS.map((step, idx) => {
                        const current = stepIdx(o.status)
                        const done = idx <= current
                        const isLast = idx === STEPS.length - 1
                        return (
                          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: done ? 'var(--gold)' : 'rgba(255,255,255,0.1)', border: `2px solid ${done ? 'var(--gold)' : 'var(--border)'}`, flexShrink: 0 }} />
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: done ? 'var(--gold)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{step.replace('_', ' ')}</span>
                            </div>
                            {!isLast && <div style={{ flex: 1, height: 1, background: idx < current ? 'var(--gold)' : 'var(--border)', margin: '0 8px', marginBottom: 18 }} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {o.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--muted)' }}>
                      <MapPin size={13} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                      {o.address}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
