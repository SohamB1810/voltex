'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// This page handles OAuth redirects — reads role from session and redirects
export default function AuthRedirect() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return
        if (!session) { router.push('/'); return }
        const role = session?.user?.role
        if (role === 'ADMIN') router.push('/dashboard')
        else if (role === 'WORKER') router.push('/warehouse')
        else router.push('/shop')
    }, [session, status])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>REDIRECTING...</p>
        </div>
    )
}
