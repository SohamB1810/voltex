'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { BarChart2, ShoppingBag, Warehouse } from 'lucide-react'

export default function PanelsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return
        if (!session) router.push('/')
    }, [session, status])

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

    const panels = [{
            title: 'Admin Dashboard',
            description: 'Manage products, users, payments, and inventory',
            icon: BarChart2,
            href: '/dashboard?demo=true',
            role: 'ADMIN',
            color: '#c9a84c',
        },
        {
            title: 'Customer Shop',
            description: 'Browse products, manage cart and orders',
            icon: ShoppingBag,
            href: '/shop?demo=true',
            role: 'CUSTOMER',
            color: '#4ade80',
        },
        {
            title: 'Worker Warehouse',
            description: 'Manage inventory, shipments and orders',
            icon: Warehouse,
            href: '/warehouse?demo=true',
            role: 'WORKER',
            color: '#60a5fa',
        },
    ]

    return ( <
        div style = {
            { minHeight: '100vh', background: 'var(--ink)', padding: '80px 40px' } } >
        <
        div style = {
            { maxWidth: 1200, margin: '0 auto' } } >
        <
        div style = {
            { marginBottom: 80 } } >
        <
        h1 style = {
            { fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: '0.05em', color: 'var(--cream)', marginBottom: 16 } } >
        PANEL ACCESS <
        /h1> <
        p style = {
            { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' } } >
        Your current role: < span style = {
            { color: 'var(--gold)' } } > { session.user.role } < /span> <
        /p> <
        /div>

        <
        div style = {
            { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginBottom: 80 } } > {
            panels.map(({ title, description, icon: Icon, href, role, color }) => ( <
                Link key = { role }
                href = { href }
                style = {
                    { textDecoration: 'none' } } >
                <
                div style = {
                    {
                        padding: 32,
                        border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                    }
                }
                onMouseEnter = {
                    (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.borderColor = color
                        e.currentTarget.style.transform = 'translateY(-4px)'
                    }
                }
                onMouseLeave = {
                    (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.transform = 'translateY(0)'
                    }
                } >
                <
                div style = {
                    { marginBottom: 24 } } >
                <
                Icon size = { 32 }
                color = { color }
                /> <
                /div>

                <
                h3 style = {
                    {
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        letterSpacing: '0.05em',
                        color: 'var(--cream)',
                        marginBottom: 12,
                    }
                } > { title } <
                /h3>

                <
                p style = {
                    {
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.1em',
                        color: 'var(--muted)',
                        lineHeight: 1.6,
                        marginBottom: 24,
                    }
                } > { description } <
                /p>

                <
                div style = {
                    {
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: color,
                    }
                } > { role === session.user.role ? '✓ Your Role' : `Demo: ${role}` } <
                /div>

                <
                div style = {
                    {
                        position: 'absolute',
                        top: 32,
                        right: 32,
                        opacity: 0.6,
                    }
                } > →
                <
                /div> <
                /div> <
                /Link>
            ))
        } <
        /div>

        <
        div style = {
            {
                padding: 24,
                border: '1px solid var(--border)',
                background: 'rgba(201,168,76,0.05)',
                borderRadius: 4,
            }
        } >
        <
        p style = {
            {
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                color: 'var(--muted)',
                lineHeight: 1.8,
            }
        } > 💡 < span style = {
            { color: 'var(--gold)', fontWeight: 500 } } > How it works: < /span> Use the demo mode with the ?demo=true parameter to view all 3 panels with your current role. In production, each user sees only their assigned panel based on their role. <
        /p> <
        /div> <
        /div> <
        /div>
    )
}