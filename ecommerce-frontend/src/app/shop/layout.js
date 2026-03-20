'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, Suspense } from 'react'
import { ShoppingBag, ShoppingCart, Package, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const nav = [
    { href: '/shop', label: 'Home', icon: ShoppingBag },
    { href: '/shop/products', label: 'Products', icon: ShoppingBag },
    { href: '/shop/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/shop/orders', label: 'Orders', icon: Package },
    { href: '/shop/profile', label: 'Profile', icon: User },
]

function ShopLayoutContent({ children }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()
    const isDemo = searchParams.get('demo') === 'true'
    const mx = useRef(0),
        my = useRef(0),
        rx = useRef(0),
        ry = useRef(0)

    useEffect(() => {
        if (status === 'loading') return
        if (!session) { router.push('/'); return }
        if (!isDemo) {
            if (session.user.role === 'ADMIN') { router.push('/dashboard'); return }
            if (session.user.role === 'WORKER') { router.push('/warehouse'); return }
        }
    }, [session, status, isDemo])

    useEffect(() => {
        const dot = document.getElementById('v-cursor-dot')
        const ring = document.getElementById('v-cursor-ring')
        if (!dot || !ring) return
        const onMove = e => {
            mx.current = e.clientX;
            my.current = e.clientY;
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px'
        }
        document.addEventListener('mousemove', onMove)
        let raf
        const animRing = () => {
            rx.current += (mx.current - rx.current) * 0.12;
            ry.current += (my.current - ry.current) * 0.12;
            ring.style.left = rx.current + 'px';
            ring.style.top = ry.current + 'px';
            raf = requestAnimationFrame(animRing)
        }
        animRing()
        return () => {
            document.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf)
        }
    }, [])

    if (status === 'loading' || !session) {
        return ( <
            div style = {
                { minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
            <
            p style = {
                { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em' } } > LOADING... < /p> <
            /div>
        )
    }

    return ( <
        div style = {
            { minHeight: '100vh', background: 'var(--ink)' } } >
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
                background: 'rgba(14,13,11,0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)',
            }
        } >
        <
        Link href = "/shop"
        style = {
            { textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 } } >
        <
        span style = {
            { fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.15em', color: 'var(--cream)' } } >
        VŌ < span style = {
            { color: 'var(--gold)' } } > LT < /span>EX <
        /span> <
        span style = {
            { fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase' } } >
        Shop <
        /span> <
        /Link>

        <
        div style = {
            { display: 'flex', gap: 4 } } > {
            nav.map(({ href, label }) => {
                const active = path === href
                return ( <
                    Link key = { href }
                    href = { href }
                    style = {
                        {
                            padding: '6px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            color: active ? 'var(--gold)' : 'var(--muted)',
                            borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
                            transition: 'all 0.2s',
                        }
                    } > { label } <
                    /Link>
                )
            })
        } <
        /div>

        <
        div style = {
            { display: 'flex', alignItems: 'center', gap: 16 } } > {
            isDemo && ( <
                span style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--gold)', letterSpacing: '0.1em', background: 'rgba(201,168,76,0.1)', padding: '4px 8px', borderRadius: 2 } } >
                DEMO <
                /span>
            )
        } <
        span style = {
            { fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' } } > { session.user.name } < /span> <
        button onClick = {
            () => signOut({ callbackUrl: '/' }) }
        style = {
            {
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: 0,
                transition: 'color 0.2s',
            }
        }
        onMouseEnter = { e => e.currentTarget.style.color = '#f87171' }
        onMouseLeave = { e => e.currentTarget.style.color = 'var(--muted)' } >
        <
        LogOut size = { 12 }
        /> Logout <
        /button> <
        /div> <
        /nav>

        <
        main style = {
            { paddingTop: 64, minHeight: '100vh' } }
        className = "v-page-enter" > { children } <
        /main> <
        /div>
    )
}

export default function ShopLayout({ children }) {
    return ( <
        Suspense fallback = { <
            div style = {
                { minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
            <
            p style = {
                { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' } } > LOADING... < /p> <
            /div>
        } >
        <
        ShopLayoutContent > { children } < /ShopLayoutContent> <
        /Suspense>
    )
}