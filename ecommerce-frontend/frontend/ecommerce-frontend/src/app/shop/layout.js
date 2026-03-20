'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, LogOut, Package } from 'lucide-react'

export default function ShopLayout({ children }) {
    const router = useRouter()
    const mx = useRef(0),
        my = useRef(0),
        rx = useRef(0),
        ry = useRef(0)

    useEffect(() => {
        const dot = document.getElementById('v-cursor-dot')
        const ring = document.getElementById('v-cursor-ring')
        if (!dot || !ring) return
        const onMove = e => { mx.current = e.clientX;
            my.current = e.clientY;
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px' }
        document.addEventListener('mousemove', onMove)
        let raf
        const animRing = () => { rx.current += (mx.current - rx.current) * 0.12;
            ry.current += (my.current - ry.current) * 0.12;
            ring.style.left = rx.current + 'px';
            ring.style.top = ry.current + 'px';
            raf = requestAnimationFrame(animRing) }
        animRing()
        return () => { document.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf) }
    }, [])

    const handleLogout = async() => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/')
    }

    return ( <
        div style = {
            { minHeight: '100vh', background: 'var(--ink)' } } >
        <
        nav style = {
            { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(14,13,11,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' } } >
        <
        Link href = "/shop"
        style = {
            { fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.15em', color: 'var(--cream)', textDecoration: 'none' } } >
        VO < span style = {
            { color: 'var(--gold)' } } > LT < /span>EX <
        /Link> <
        div style = {
            { display: 'flex', alignItems: 'center', gap: 6 } } >
        <
        Link href = "/shop"
        style = {
            { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.6)', textDecoration: 'none' } } >
        <
        Package size = { 12 }
        /> Shop <
        /Link> <
        Link href = "/shop/cart"
        style = {
            { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.6)', textDecoration: 'none' } } >
        <
        ShoppingCart size = { 12 }
        /> Cart <
        /Link> <
        /div> <
        button onClick = { handleLogout }
        style = {
            { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' } } >
        <
        LogOut size = { 13 }
        /> Logout <
        /button> <
        /nav> <
        main style = {
            { paddingTop: 72 } } > { children } < /main> <
        /div>
    )
}