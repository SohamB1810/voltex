'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Package, ClipboardList, ShoppingCart, Users, CreditCard, Truck, ShoppingBag, Warehouse, Menu, X, LogOut, Zap } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Shipments', href: '/dashboard/shipments', icon: Truck },
    { label: 'Inventory', href: '/dashboard/inventory', icon: ShoppingBag },
    { label: 'Warehouse', href: '/dashboard/warehouse', icon: Warehouse },
]

export default function Navbar({ onLogout }) {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    return ( <
        >
        <
        nav style = {
            {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 500,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                background: scrolled ? 'rgba(14,13,11,0.92)' : 'rgba(14,13,11,0.75)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.4s ease',
            }
        } > { /* Logo */ } <
        Link href = "/dashboard"
        style = {
            { fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.15em', color: 'var(--cream)', textDecoration: 'none', lineHeight: 1 } } >
        VŌ < span style = {
            { color: 'var(--gold)' } } > LT < /span>EX <
        /Link>

        { /* Desktop links */ } <
        div style = {
            { display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' } }
        className = "hidden-mobile" > {
            navItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href
                return ( <
                    Link key = { href }
                    href = { href }
                    style = {
                        {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: active ? 'var(--gold)' : 'rgba(240,235,224,0.4)',
                            textDecoration: 'none',
                            border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                            background: active ? 'rgba(201,168,76,0.06)' : 'transparent',
                            transition: 'all 0.25s ease',
                            position: 'relative',
                        }
                    }
                    onMouseEnter = { e => { if (!active) { e.currentTarget.style.color = 'rgba(240,235,224,0.75)';
                                e.currentTarget.style.borderColor = 'rgba(240,235,224,0.1)' } } }
                    onMouseLeave = { e => { if (!active) { e.currentTarget.style.color = 'rgba(240,235,224,0.4)';
                                e.currentTarget.style.borderColor = 'transparent' } } } >
                    <
                    Icon size = { 12 }
                    /> { label } <
                    /Link>
                )
            })
        } <
        /div>

        { /* Right */ } <
        div style = {
            { display: 'flex', alignItems: 'center', gap: 16 } } >
        <
        div style = {
            { display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' } } >
        <
        span style = {
            { width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'block', animation: 'pulse 2s infinite' } }
        /> <
        span style = {
            { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' } } > Live API < /span> <
        /div> <
        button onClick = { onLogout }
        style = {
            { background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', transition: 'color 0.25s ease' } }
        onMouseEnter = { e => e.currentTarget.style.color = '#e07070' }
        onMouseLeave = { e => e.currentTarget.style.color = 'var(--muted)' } >
        <
        LogOut size = { 13 }
        /> Logout <
        /button> <
        button onClick = {
            () => setOpen(!open) }
        style = {
            { display: 'none', background: 'none', border: 'none', cursor: 'none', color: 'var(--cream)' } }
        className = "show-mobile" > { open ? < X size = { 20 } /> : <Menu size={20}/ > } <
        /button> <
        /div> <
        /nav>

        { /* Mobile menu */ } {
            open && ( <
                div style = {
                    { position: 'fixed', top: 72, left: 0, right: 0, zIndex: 490, background: 'rgba(14,13,11,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 } } > {
                    navItems.map(({ label, href, icon: Icon }) => ( <
                        Link key = { href }
                        href = { href }
                        onClick = {
                            () => setOpen(false) }
                        style = {
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                                padding: '14px 8px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 9,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: pathname === href ? 'var(--gold)' : 'rgba(240,235,224,0.4)',
                                textDecoration: 'none',
                                border: pathname === href ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
                                background: pathname === href ? 'rgba(201,168,76,0.05)' : 'transparent',
                            }
                        } >
                        <
                        Icon size = { 16 }
                        />{label} <
                        /Link>
                    ))
                } <
                /div>
            )
        }

        <
        style > { `
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @media(max-width:900px){
          .hidden-mobile{display:none!important;}
          .show-mobile{display:flex!important;}
        }
      ` } < /style> <
        />
    )
}