'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ShoppingCart, Truck, Archive, Warehouse, LogOut } from 'lucide-react'

const nav = [
  { href: '/warehouse',              label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/warehouse/orders',       label: 'My Orders',  icon: ShoppingCart },
  { href: '/warehouse/shipments',    label: 'Shipments',  icon: Truck },
  { href: '/warehouse/inventory',    label: 'Inventory',  icon: Archive },
]

export default function WorkerSidebar({ userName }) {
  const path = usePathname()

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: 'rgba(10,9,7,0.98)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 400,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.15em', color: 'var(--cream)' }}>
          VŌ<span style={{ color: 'var(--gold)' }}>LT</span>EX
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 4 }}>
          Worker Panel
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s',
              color: active ? 'var(--gold)' : 'var(--muted)',
              background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
              borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              <Icon size={14} />{label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase' }}>
          {userName || 'Worker'}
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e07070'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          <LogOut size={12} />Logout
        </button>
      </div>
    </aside>
  )
}
