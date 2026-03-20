'use client'
import { useEffect, useRef, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import WorkerSidebar from '@/components/WorkerSidebar'

function WarehouseLayoutContent({ children }) {
    const { data: session, status } = useSession()
    const router = useRouter()
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
            if (session.user.role === 'CUSTOMER') { router.push('/shop'); return }
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

    if (status === 'loading' || !session || (!isDemo && session.user.role !== 'WORKER')) {
        return ( <
            div style = {
                { minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
            <
            p style = {
                { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em' } } > VERIFYING ACCESS... < /p> <
            /div>
        )
    }

    return ( <
        div style = {
            { minHeight: '100vh', background: 'var(--ink)', display: 'flex' } } >
        <
        WorkerSidebar userName = { session.user.name }
        /> <
        main style = {
            { marginLeft: 220, flex: 1, padding: '40px', minHeight: '100vh' } }
        className = "v-grid-bg" > {
            isDemo && ( <
                div style = {
                    {
                        padding: 12,
                        marginBottom: 24,
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--gold)',
                        borderRadius: 4,
                    }
                } > 📺Demo Mode: Viewing as { session.user.role } | < a href = "/panels"
                style = {
                    { color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' } } > Back to Panels < /a> <
                /div>
            )
        } <
        div className = "v-page v-page-enter" > { children } < /div> <
        /main> <
        /div>
    )
}

export default function WarehouseLayout({ children }) {
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
        WarehouseLayoutContent > { children } < /WarehouseLayoutContent> <
        /Suspense>
    )
}