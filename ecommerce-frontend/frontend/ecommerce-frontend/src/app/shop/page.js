'use client'
import { useState } from 'react'
import { ShoppingCart, Zap } from 'lucide-react'
import { getProducts, addToCart, placeOrder } from '@/lib/api'
import useFetch from '@/lib/useFetch'

export default function ShopPage() {
    const { data, loading, error } = useFetch(getProducts)
    const [adding, setAdding] = useState(null)
    const [buying, setBuying] = useState(null)
    const [toast, setToast] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    const allProducts = (data && data.content) ? data.content : (Array.isArray(data) ? data : [])
    const products = allProducts.filter(function(p) { return p.stock > 0 })
    const categories = ['All'].concat([...new Set(products.map(function(p) { return p.category }))])
    const filtered = products.filter(function(p) {
        const matchSearch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : false
        const matchCat = category === 'All' || p.category === category
        return matchSearch && matchCat
    })

    const getUserId = function() {
        const cookie = document.cookie.split('; ').find(function(r) { return r.startsWith('userId=') })
        return cookie ? cookie.split('=')[1] : '1'
    }

    const showToast = function(msg) {
        setToast(msg);
        setTimeout(function() { setToast('') }, 3000)
    }

    const handleAddToCart = async function(productId) {
        setAdding(productId)
        try {
            await addToCart(productId, 1);
            showToast('Added to cart!')
        } catch (err) { showToast('Error: ' + err.message) } finally { setAdding(null) }
    }

    const handleBuyNow = async function(product) {
        setBuying(product.id)
        try {
            await placeOrder(getUserId(), product.id, 1);
            showToast('Order placed!')
        } catch (err) { showToast('Error: ' + err.message) } finally { setBuying(null) }
    }

    return ( <
        div style = {
            { minHeight: '100vh', background: 'var(--ink)' }
        } > {
            toast && ( <
                div style = {
                    { position: 'fixed', bottom: 32, right: 32, zIndex: 1000, background: '#111008', border: '1px solid rgba(201,168,76,0.3)', padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--gold)' }
                } > { toast } <
                /div>
            )
        } <
        div style = {
            { padding: '48px 40px 32px', borderBottom: '1px solid var(--border)' }
        } >
        <
        div style = {
            { maxWidth: 1400, margin: '0 auto' }
        } >
        <
        p style = {
            { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }
        } > New Collection < /p> <
        h1 style = {
            { fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,8vw,100px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.92, marginBottom: 32 }
        } >
        SHOP <
        /h1> <
        div style = {
            { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }
        } >
        <
        input value = { search }
        onChange = {
            function(e) { setSearch(e.target.value) }
        }
        placeholder = "Search products..."
        style = {
            { flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '10px 16px', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--cream)', outline: 'none' }
        }
        onFocus = {
            function(e) { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }
        }
        onBlur = {
            function(e) { e.target.style.borderColor = 'var(--border)' }
        }
        /> <
        div style = {
            { display: 'flex', gap: 2 }
        } > {
            categories.map(function(cat) {
                return ( <
                    button key = { cat }
                    onClick = {
                        function() { setCategory(cat) }
                    }
                    style = {
                        {
                            padding: '10px 16px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: category === cat ? 'var(--gold)' : 'transparent',
                            color: category === cat ? 'var(--ink)' : 'var(--muted)',
                            borderColor: category === cat ? 'var(--gold)' : 'var(--border)'
                        }
                    } > { cat } <
                    /button>
                )
            })
        } <
        /div> < /
        div > <
        /div> < /
        div > <
        div style = {
            { padding: '40px', maxWidth: 1400, margin: '0 auto' }
        } > {
            loading && < p style = {
                { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }
            } > LOADING... < /p>} {
            error && < p style = {
                { fontFamily: 'var(--font-mono)', fontSize: 11, color: '#e07070' }
            } > Error: { error } < /p>} {!loading && !error && ( <
                div style = {
                    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }
                } > {
                    filtered.length === 0 ?
                    <
                    div style = {
                        { gridColumn: '1/-1', textAlign: 'center', padding: 64, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }
                    } > NO PRODUCTS FOUND < /div> :
                    filtered.map(function(p) {
                        return ( <
                            div key = { p.id }
                            style = {
                                { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.3s' }
                            }
                            onMouseEnter = {
                                function(e) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }
                            }
                            onMouseLeave = {
                                function(e) { e.currentTarget.style.borderColor = 'var(--border)' }
                            } >
                            <
                            div style = {
                                { aspectRatio: '4/3', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', position: 'relative' }
                            } > {
                                p.imageUrl ?
                                <
                                img src = { p.imageUrl }
                                alt = { p.name }
                                style = {
                                    { width: '100%', height: '100%', objectFit: 'cover' }
                                }
                                /> : <
                                div style = {
                                    { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }
                                } >
                                <
                                div style = {
                                    { width: 60, height: 60, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                                } >
                                <
                                span style = {
                                    { fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', opacity: 0.5 }
                                } > V < /span> < /
                                div > <
                                span style = {
                                    { fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }
                                } > No image < /span> < /
                                div >
                            } <
                            div style = {
                                { position: 'absolute', top: 12, right: 12 }
                            } >
                            <
                            span style = {
                                { background: 'rgba(14,13,11,0.85)', border: '1px solid var(--border)', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }
                            } > { p.category } <
                            /span> < /
                            div > <
                            /div> <
                            div style = {
                                { padding: 20 }
                            } >
                            <
                            h3 style = {
                                { fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 300, color: 'var(--cream)', marginBottom: 4, lineHeight: 1.3 }
                            } > { p.name } < /h3> <
                            p style = {
                                { fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }
                            } > { p.description || 'Premium quality product' } < /p> <
                            div style = {
                                { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }
                            } >
                            <
                            span style = {
                                { fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em', color: 'var(--gold)' }
                            } > Rs. { p.price ? p.price.toLocaleString() : 0 } < /span> <
                            span style = {
                                { fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.15em', color: p.stock < 10 ? '#d4785a' : 'var(--muted)', textTransform: 'uppercase' }
                            } > { p.stock < 10 ? 'Only ' + p.stock + ' left' : 'In stock' } <
                            /span> < /
                            div > <
                            div style = {
                                { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }
                            } >
                            <
                            button onClick = {
                                function() { handleAddToCart(p.id) }
                            }
                            disabled = { adding === p.id }
                            style = {
                                { padding: 10, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: adding === p.id ? 0.6 : 1 }
                            } >
                            <
                            ShoppingCart size = { 11 }
                            />{adding===p.id ? '...' : 'Add Cart'} < /
                            button > <
                            button onClick = {
                                function() { handleBuyNow(p) }
                            }
                            disabled = { buying === p.id }
                            style = {
                                { padding: 10, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: buying === p.id ? 0.6 : 1 }
                            } >
                            <
                            Zap size = { 11 }
                            />{buying===p.id ? '...' : 'Buy Now'} < /
                            button > <
                            /div> < /
                            div > <
                            /div>
                        )
                    })
                } <
                /div>
            )
        } <
        /div> < /
        div >
    )
}