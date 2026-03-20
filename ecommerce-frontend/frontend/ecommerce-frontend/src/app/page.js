'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login, register } from '@/lib/api'

export default function HomePage() {
    const router = useRouter()
    const [mode, setMode] = useState('login')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [preloaderDone, setPreloaderDone] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const heroRef = useRef(null)
    const wheelRef = useRef(null)
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
        const hover = e => document.body.classList.toggle('cursor-hover', ['A', 'BUTTON', 'INPUT'].includes(e.target.tagName))
        document.addEventListener('mouseover', hover)
        return () => { document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', hover);
            cancelAnimationFrame(raf) }
    }, [])

    useEffect(() => {
        let count = 0
        const el = document.getElementById('v-preloader-pct')
        const iv = setInterval(() => {
            count = Math.min(count + Math.floor(Math.random() * 18) + 4, 100)
            if (el) el.textContent = count + '%'
            if (count >= 100) {
                clearInterval(iv)
                setTimeout(() => {
                    const pl = document.getElementById('v-preloader')
                    if (pl) { pl.classList.add('v-exit');
                        setTimeout(() => { pl.style.display = 'none';
                            setPreloaderDone(true) }, 900) }
                }, 350)
            }
        }, 75)
        return () => clearInterval(iv)
    }, [])

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            if (heroRef.current) heroRef.current.style.transform = `translateY(${y * 0.22}px)`
            if (wheelRef.current) wheelRef.current.style.transform = `translateY(calc(-50% + ${y*0.14}px)) rotate(${y*0.04}deg)`
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!preloaderDone) return
        const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v-in') }), { threshold: 0.1 })
        document.querySelectorAll('.v-reveal, .v-reveal-l').forEach(el => obs.observe(el))
        return () => obs.disconnect()
    }, [preloaderDone])

    const handle = e => setForm({...form, [e.target.name]: e.target.value })

    const submit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (!form.email || !form.password) throw new Error('Please fill all fields.')
            if (mode === 'signup') {
                if (!form.name) throw new Error('Please enter your name.')
                await register(form.name, form.email, form.password)
            }
            const result = await login(form.email, form.password)
            const role = result.role
            if (role === 'ADMIN') router.push('/dashboard')
            else if (role === 'WAREHOUSE') router.push('/warehouse')
            else router.push('/shop')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return ( <
            >
            <
            div id = "v-preloader" >
            <
            div id = "v-preloader-logo" > VŌLTEX < /div> <
            div id = "v-preloader-track" > < div id = "v-preloader-fill" / > < /div> <
            div id = "v-preloader-pct" > 0 % < /div> <
            /div>

            <
            section style = {
                { height: '100vh', minHeight: 600, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '0 48px 64px', background: 'radial-gradient(ellipse 75% 60% at 58% 38%, #1a160e 0%, #0e0d0b 70%)' } } >
            <
            div style = {
                { position: 'absolute', top: 0, left: 48, width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, #c9a84c 40%, transparent)', opacity: 0.2, zIndex: 1 } }
            />

            <
            div ref = { wheelRef }
            style = {
                { position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', width: 340, height: 340, zIndex: 1, opacity: 0.07, animation: 'spin 25s linear infinite' } } >
            <
            svg viewBox = "0 0 300 300"
            width = "340"
            height = "340" >
            <
            path id = "cpath"
            fill = "none"
            d = "M 150,150 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0" / >
            <
            text fontFamily = "monospace"
            fontSize = "11"
            fill = "#c9a84c"
            letterSpacing = "10" >
            <
            textPath href = "#cpath" > NEW CURRENT· VŌLTEX· NEW CURRENT· VŌLTEX· < /textPath> <
            /text> <
            /svg> <
            /div>

            <
            div style = {
                { position: 'absolute', top: 100, left: 48, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, opacity: preloaderDone ? 1 : 0, transform: preloaderDone ? 'none' : 'translateX(-20px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s' } } >
            <
            div style = {
                { width: 40, height: 1, background: '#c9a84c' } }
            /> <
            span style = {
                { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c' } } > SS26— New Current < /span> <
            /div>

            <
            div ref = { heroRef }
            style = {
                { position: 'relative', zIndex: 10, maxWidth: '65%' } } > {
                [
                    ['THE', 'new'],
                    ['CURRENT', null],
                    ['IS HERE', null]
                ].map(([a, b], ri) => ( <
                        div key = { ri }
                        style = {
                            { display: 'flex', alignItems: 'baseline', gap: 16, overflow: 'hidden' } } >
                        <
                        span style = {
                            { fontFamily: 'var(--font-display)', fontSize: 'clamp(70px,12vw,160px)', lineHeight: 0.92, letterSpacing: '0.02em', color: 'var(--cream)', display: 'block', opacity: preloaderDone ? 1 : 0, transform: preloaderDone ? 'none' : 'translateY(110%)', transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${0.1+ri*0.15}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${0.1+ri*0.15}s` } } > { a } < /span> {
                            b && < span style = {
                                    { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(50px,9vw,120px)', lineHeight: 0.92, color: '#c9a84c', opacity: preloaderDone ? 1 : 0, transform: preloaderDone ? 'none' : 'translateY(110%)', transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${0.25}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${0.25}s` } } > { b } < /span>} <
                                /div>
                        ))
                } <
                p style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 28, opacity: preloaderDone ? 1 : 0, transform: preloaderDone ? 'none' : 'translateY(14px)', transition: 'all 0.7s ease 0.55s' } } >
                Commerce Platform & nbsp;· & nbsp;Spring Boot API & nbsp;· & nbsp;VŌLTEX 2026 <
                /p> <
                /div>

                <
                div style = {
                    { position: 'absolute', right: 48, bottom: 64, zIndex: 10, opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.7s ease 0.7s' } } >
                <
                div style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', writingMode: 'vertical-rl', display: 'flex', alignItems: 'center', gap: 10 } } >
                <
                span style = {
                    { display: 'block', width: 1, height: 50, background: 'linear-gradient(to bottom, #c9a84c, transparent)' } }
                />
                Scroll to explore <
                /div> <
                /div> <
                /section>

                <
                div className = "v-marquee" >
                <
                div className = "v-marquee-inner" > {
                    ['VŌLTEX', 'NEW CURRENT', 'ECOMMERCE PLATFORM', 'SPRING BOOT API', 'POWERED BY KAFKA'].flatMap((t, i) => [ <
                        span key = { t + i } > { t } < span className = "v-dot" > ◆ < /span></span > , <
                        span key = { t + i + 'b' } > { t } < span className = "v-dot" > ◆ < /span></span >
                    ])
                } <
                /div> <
                /div>

                <
                section style = {
                    { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', background: 'var(--ink)' } } >
                <
                div style = {
                    { padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 48, borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' } } >
                <
                div style = {
                    { position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', filter: 'blur(60px)', pointerEvents: 'none' } }
                /> <
                div className = "v-reveal" >
                <
                div className = "v-label"
                style = {
                    { marginBottom: 24 } } > Commerce Platform < /div> <
                h2 style = {
                    { fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,6vw,80px)', lineHeight: 0.92, letterSpacing: '0.04em', color: 'var(--cream)', marginBottom: 20 } } >
                MANAGE < br / >
                <
                span style = {
                    { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--gold)' } } > every < /span><br/ >
                SERVICE <
                /h2> <
                p style = {
                    { fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300, lineHeight: 1.75, color: 'var(--muted)', maxWidth: 380 } } >
                A full - stack dashboard
                for your Spring Boot ecommerce API— products,
                orders,
                payments,
                inventory,
                Kafka events,
                and more. <
                /p> <
                /div> <
                div className = "v-reveal v-d2"
                style = {
                    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 } } > {
                    [
                        ['9+', 'Services'],
                        ['REST', 'API Ready'],
                        ['JWT', 'Secured'],
                        ['Kafka', 'Events']
                    ].map(([v, l]) => ( <
                        div key = { l }
                        style = {
                            { padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' } } >
                        <
                        div style = {
                            { fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.05em', color: 'var(--gold)' } } > { v } < /div> <
                        div style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 } } > { l } < /div> <
                        /div>
                    ))
                } <
                /div> <
                div className = "v-reveal v-d3"
                style = {
                    { display: 'flex', flexDirection: 'column', gap: 10 } } > {
                    ['POST /api/auth/login', 'GET /api/products', 'POST /api/orders', 'GET /api/inventory'].map(ep => ( <
                        div key = { ep }
                        style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 10 } } >
                        <
                        span style = {
                            { width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', opacity: 0.6, flexShrink: 0 } }
                        /> { ep } <
                        /div>
                    ))
                } <
                /div> <
                /div>

                <
                div style = {
                    { padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' } } >
                <
                div style = {
                    { position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,168,76,0.05)', filter: 'blur(60px)', pointerEvents: 'none' } }
                /> <
                div className = "v-reveal"
                style = {
                    { maxWidth: 400, width: '100%' } } >
                <
                div style = {
                    { display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: 4, borderRadius: 4, marginBottom: 40 } } > {
                    ['login', 'signup'].map(m => ( <
                        button key = { m }
                        onClick = {
                            () => { setMode(m);
                                setError('') } }
                        style = {
                            { flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.1em', borderRadius: 2, transition: 'all 0.3s ease', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--muted)' } } > { m === 'login' ? 'SIGN IN' : 'REGISTER' } <
                        /button>
                    ))
                } <
                /div> <
                div style = {
                    { marginBottom: 32 } } >
                <
                h2 style = {
                    { fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '0.05em', color: 'var(--cream)', lineHeight: 0.95 } } > { mode === 'login' ? 'WELCOME BACK' : 'GET STARTED' } <
                /h2> <
                p style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 10 } } > { mode === 'login' ? 'Enter your credentials' : 'Create your account' } <
                /p> <
                /div> <
                form onSubmit = { submit }
                style = {
                    { display: 'flex', flexDirection: 'column', gap: 18 } } > {
                    mode === 'signup' && ( <
                        div >
                        <
                        label style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 } } > Full Name < /label> <
                        input type = "text"
                        name = "name"
                        value = { form.name }
                        onChange = { handle }
                        placeholder = "John Doe"
                        style = {
                            { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 16px', fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s' } }
                        onFocus = { e => e.target.style.borderColor = 'rgba(201,168,76,0.4)' }
                        onBlur = { e => e.target.style.borderColor = 'var(--border)' }
                        /> <
                        /div>
                    )
                } <
                div >
                <
                label style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 } } > Email < /label> <
                input type = "email"
                name = "email"
                value = { form.email }
                onChange = { handle }
                placeholder = "you@domain.com"
                style = {
                    { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 16px', fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s' } }
                onFocus = { e => e.target.style.borderColor = 'rgba(201,168,76,0.4)' }
                onBlur = { e => e.target.style.borderColor = 'var(--border)' }
                /> <
                /div> <
                div >
                <
                label style = {
                    { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 } } > Password < /label> <
                div style = {
                    { position: 'relative' } } >
                <
                input type = { showPass ? 'text' : 'password' }
                name = "password"
                value = { form.password }
                onChange = { handle }
                placeholder = "••••••••"
                style = {
                    { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '13px 44px 13px 16px', fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s' } }
                onFocus = { e => e.target.style.borderColor = 'rgba(201,168,76,0.4)' }
                onBlur = { e => e.target.style.borderColor = 'var(--border)' }
                /> <
                button type = "button"
                onClick = {
                    () => setShowPass(!showPass) }
                style = {
                    { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' } } > { showPass ? < EyeOff size = { 15 } /> : <Eye size={15}/ > } <
                /button> <
                /div> <
                /div> {
                    error && < p style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: '#e07070', background: 'rgba(180,40,40,0.1)', border: '1px solid rgba(180,40,40,0.2)', padding: '10px 14px' } } > { error } < /p>} <
                        button type = "submit"
                    disabled = { loading }
                    className = "v-btn-gold"
                    style = {
                            { padding: '15px 24px', fontSize: 15, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, opacity: loading ? 0.65 : 1 } } > {
                            loading ?
                            < span style = {
                                { width: 18, height: 18, border: '2px solid rgba(14,13,11,0.3)', borderTopColor: 'var(--ink)', borderRadius: '50%', display: 'block', animation: 'spin 0.8s linear infinite' } }
                            /> :
                                < > { mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT' } < ArrowRight size = { 15 }
                            /></ >
                        } <
                        /button> <
                        /form> <
                        div style = {
                            { display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' } } >
                        <
                        div style = {
                            { flex: 1, height: 1, background: 'var(--border)' } }
                    /> <
                    span style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)' } } > OR < /span> <
                        div style = {
                            { flex: 1, height: 1, background: 'var(--border)' } }
                    /> <
                    /div> <
                    button onClick = {
                        () => router.push('/dashboard') }
                    className = "v-btn-ghost"
                    style = {
                            { width: '100%', padding: '13px', fontSize: 11, letterSpacing: '0.14em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } } > ⚡ENTER DEMO DASHBOARD <
                        /button> <
                        /div> <
                        /div> <
                        /section> <
                        style > { `@keyframes spin{to{transform:rotate(360deg);}}` } < /style> <
                        />
                )
            }