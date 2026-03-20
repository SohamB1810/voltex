'use client'
import Link from 'next/link'
import { getCart, removeFromCart, request } from '@/lib/api'
import useFetch from '@/lib/useFetch'
import { ArrowLeft, Trash2, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ShopCartPage() {
    const { data, loading, error } = useFetch(getCart)
    const [removing, setRemoving] = useState(null)
    const [placing, setPlacing] = useState(false)
    const [toast, setToast] = useState('')

    const items = data ? .data ? .cartItems ? ? data ? .cartItems ? ? []
    const total = items.reduce((sum, item) => sum + ((item.product ? .price ? ? 0) * item.quantity), 0)
    const getUserId = () => document.cookie.split('; ').find(r => r.startsWith('userId=')) ? .split('=')[1] ? ? '1'
    const showToast = msg => { setToast(msg);
        setTimeout(() => setToast(''), 3000) }

    const handleRemove = async id => {
        setRemoving(id)
        try { await removeFromCart(id);
            window.location.reload() } catch (err) { showToast('Error: ' + err.message) } finally { setRemoving(null) }
    }

    const handleCheckout = async() => {
        setPlacing(true)
        try {
            const userId = getUserId()
            for (const item of items) {
                await request('/orders/place?userId=' + userId + '&productId=' + item.product.id + '&quantity=' + item.quantity, { method: 'POST' })
            }
            showToast('Order placed!')
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) { showToast('Error: ' + err.message) } finally { setPlacing(false) }
    }

    return ( <
            div style = {
                { minHeight: '100vh', background: 'var(--ink)', padding: '48px 40px' } } > {
                toast && < div style = {
                    { position: 'fixed', bottom: 32, right: 32, zIndex: 1000, background: '#111008', border: '1px solid rgba(201,168,76,0.3)', padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)' } } > { toast } < /div>} <
                div style = {
                    { maxWidth: 800, margin: '0 auto' } } >
                <
                Link href = "/shop"
                style = {
                    { display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', marginBottom: 40 } } >
                <
                ArrowLeft size = { 14 }
                /> Back to Shop <
                /Link> <
                div className = "v-label"
                style = {
                    { marginBottom: 12 } } > Your Cart < /div> <
                h1 style = {
                    { fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.95, marginBottom: 40 } } > CART < /h1> {
                    loading && < p style = {
                        { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' } } > LOADING... < /p>} {
                        error && < p style = {
                                { fontFamily: 'var(--font-mono)', fontSize: 11, color: '#e07070' } } > Error: { error } < /p>} {
                                !loading && !error && items.length === 0 && ( <
                                    div style = {
                                        { textAlign: 'center', padding: 64 } } >
                                    <
                                    p style = {
                                        { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: 24 } } > YOUR CART IS EMPTY < /p> <
                                    Link href = "/shop"
                                    className = "v-btn-gold"
                                    style = {
                                        { padding: '12px 24px', fontSize: 12, letterSpacing: '0.1em', textDecoration: 'none' } } > BROWSE PRODUCTS < /Link> <
                                    /div>
                                )
                            } {
                                !loading && !error && items.length > 0 && ( <
                                    >
                                    <
                                    div style = {
                                        { display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 32 } } > {
                                        items.map(item => ( <
                                            div key = { item.id }
                                            style = {
                                                { display: 'flex', gap: 20, padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', alignItems: 'center' } } >
                                            <
                                            div style = {
                                                { width: 80, height: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', flexShrink: 0, overflow: 'hidden' } } > {
                                                item.product ? .imageUrl ?
                                                < img src = { item.product.imageUrl }
                                                alt = { item.product.name }
                                                style = {
                                                    { width: '100%', height: '100%', objectFit: 'cover' } }
                                                /> :
                                                < div style = {
                                                    { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
                                                <
                                                span style = {
                                                    { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)', opacity: 0.4 } } > V < /span> <
                                                /div>
                                            } <
                                            /div> <
                                            div style = {
                                                { flex: 1 } } >
                                            <
                                            div style = {
                                                { fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--cream)', marginBottom: 4 } } > { item.product ? .name } < /div> <
                                            div style = {
                                                { fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' } } > { item.product ? .category }
                                            x { item.quantity } < /div> <
                                            /div> <
                                            div style = {
                                                { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold)', marginRight: 16 } } > Rs. {
                                                ((item.product ? .price ? ? 0) * item.quantity).toLocaleString() } < /div> <
                                            button onClick = {
                                                () => handleRemove(item.id) }
                                            disabled = { removing === item.id }
                                            style = {
                                                { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', opacity: removing === item.id ? 0.5 : 1 } }
                                            onMouseEnter = { e => e.currentTarget.style.color = '#e07070' }
                                            onMouseLeave = { e => e.currentTarget.style.color = 'var(--muted)' } >
                                            <
                                            Trash2 size = { 16 }
                                            /> <
                                            /button> <
                                            /div>
                                        ))
                                    } <
                                    /div> <
                                    div style = {
                                        { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: 24 } } >
                                    <
                                    div style = {
                                        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } } >
                                    <
                                    span style = {
                                        { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' } } > Total({ items.length }
                                        items) < /span> <
                                    span style = {
                                        { fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)' } } > Rs. { total.toLocaleString() } < /span> <
                                    /div> <
                                    button onClick = { handleCheckout }
                                    disabled = { placing }
                                    className = "v-btn-gold"
                                    style = {
                                        { width: '100%', padding: 16, fontSize: 14, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: placing ? 0.65 : 1 } } >
                                    <
                                    Zap size = { 16 }
                                    />{placing ? 'PLACING ORDER...' : 'CHECKOUT - Rs.' + total.toLocaleString()} <
                                    /button> <
                                    /div> <
                                    />
                                )
                            } <
                            /div> <
                            /div>
                    )
                }