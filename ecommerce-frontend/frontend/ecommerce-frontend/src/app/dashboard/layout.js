'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { logout } from '@/lib/api'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => {
        if (!res.ok) router.push('/')
        else setChecking(false)
      })
      .catch(() => router.push('/'))
  }, [])

  useEffect(() => {
    const dot = document.getElementById('v-cursor-dot')
    const ring = document.getElementById('v-cursor-ring')
    if (!dot || !ring) return
    const onMove = e => {
      mx.current = e.clientX
      my.current = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }
    document.addEventListener('mousemove', onMove)
    let raf
    const animRing = () => {
      rx.current += (mx.current - rx.current) * 0.12
      ry.current += (my.current - ry.current) * 0.12
      ring.style.left = rx.current + 'px'
      ring.style.top = ry.current + 'px'
      raf = requestAnimationFrame(animRing)
    }
    animRing()
    const hover = e => document.body.classList.toggle('cursor-hover', ['A','BUTTON','INPUT'].includes(e.target.tagName))
    document.addEventListener('mouseover', hover)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', hover)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (checking) return (
    <div style={{ minHeight:'100vh', background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.15em' }}>LOADING...</p>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--ink)' }}>
      <Navbar onLogout={handleLogout} />
      <main className="v-main v-grid-bg">
        <div className="v-page v-page-enter">
          {children}
        </div>
      </main>
    </div>
  )
}
