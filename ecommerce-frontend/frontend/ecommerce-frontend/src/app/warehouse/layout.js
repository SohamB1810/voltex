'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function WarehouseLayout({ children }) {
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
        div style = {
            { fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.15em', color: 'var(--cream)' } } >
        VO < span style = {
            { color: 'var(--gold)' } } > LT < /span>EX <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--muted)', marginLeft:8 }}>WAREHOUSE</span >
        <
        /div> <
        button onClick = { handleLogout }
        style = {
            { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' } }
        onMouseEnter = { e => e.currentTarget.style.color = '#e07070' }
        onMouseLeave = { e => e.currentTarget.style.color = 'var(--muted)' } >
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