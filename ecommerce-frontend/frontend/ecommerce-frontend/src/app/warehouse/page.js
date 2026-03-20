'use client'
import { useEffect, useState } from 'react'
import { request } from '@/lib/api'

export default function WarehousePage() {
    const [inventory, setInventory] = useState([])
    const [shipments, setShipments] = useState([])
    const [warehouseInfo, setWarehouseInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const getWarehouseId = () => document.cookie.split('; ').find(r => r.startsWith('warehouseId=')) ? .split('=')[1]

    useEffect(() => {
        const warehouseId = getWarehouseId()
        if (!warehouseId) { setError('No warehouse assigned to your account');
            setLoading(false); return }
        Promise.all([request('/api/inventory'), request('/api/shipments'), request('/api/warehouse')])
            .then(([inv, ship, wh]) => {
                const invData = inv ? .data ? ? inv ? ? []
                const shipData = ship ? .data ? ? ship ? ? []
                const whData = wh ? .data ? ? wh ? ? []
                setInventory(Array.isArray(invData) ? invData : [])
                setShipments(Array.isArray(shipData) ? shipData.filter(s => s.warehouseId == warehouseId) : [])
                setWarehouseInfo(Array.isArray(whData) ? whData.find(w => w.id == warehouseId) : null)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const updateShipmentStatus = async(id, status) => {
        try { await request('/api/shipments/' + id + '/status?status=' + status, { method: 'PUT' });
            window.location.reload() } catch (err) { alert(err.message) }
    }

    const updateInventory = async(id, currentQty) => {
        const newQty = prompt('Enter new quantity:', currentQty)
        if (newQty === null) return
        try { await request('/api/inventory/' + id + '?quantity=' + newQty, { method: 'PUT' });
            window.location.reload() } catch (err) { alert(err.message) }
    }

    const getStatus = qty => {
        if (qty === 0) return { label: 'Out of Stock', cls: 'v-badge-danger' }
        if (qty < 10) return { label: 'Low Stock', cls: 'v-badge-warn' }
        return { label: 'In Stock', cls: 'v-badge-success' }
    }

    const shipBadge = s => s === 'DELIVERED' ? 'v-badge-success' : s === 'IN_TRANSIT' ? 'v-badge-info' : s === 'DISPATCHED' ? 'v-badge-warn' : 'v-badge-neutral'

    return ( <
            div style = {
                { padding: '40px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 } } >
            <
            div >
            <
            div className = "v-label"
            style = {
                { marginBottom: 12 } } > Warehouse Panel < /div> <
            h1 style = {
                { fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--cream)', lineHeight: 0.95 } } > { warehouseInfo ? warehouseInfo.name : 'WAREHOUSE' } <
            /h1> {
                warehouseInfo && < p style = {
                        { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)', marginTop: 8 } } > { warehouseInfo.location } < /p>} <
                    /div>

                <
                div style = {
                        { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 } } > {
                        [
                            ['Total SKUs', inventory.length],
                            ['Low Stock', inventory.filter(i => i.stockQuantity > 0 && i.stockQuantity < 10).length],
                            ['My Shipments', shipments.length]
                        ].map(([l, v]) => ( <
                            div key = { l }
                            style = {
                                { padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' } } >
                            <
                            div className = "v-stat"
                            style = {
                                { fontSize: 36 } } > { v } < /div> <
                            div style = {
                                { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 } } > { l } < /div> <
                            /div>
                        ))
                    } <
                    /div>

                {
                    loading && < p style = {
                            { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' } } > LOADING... < /p>} {
                            error && < p style = {
                                { fontFamily: 'var(--font-mono)', fontSize: 11, color: '#e07070' } } > { error } < /p>}

                            {
                                !loading && !error && ( <
                                    >
                                    <
                                    div >
                                    <
                                    h2 style = {
                                        { fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: 16 } } > INVENTORY < /h2> <
                                    div style = {
                                        { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' } } >
                                    <
                                    table className = "v-table" >
                                    <
                                    thead > < tr > < th > Product < /th><th>Category</th > < th > Quantity < /th><th>Status</th > < th > Update < /th></tr > < /thead> <
                                    tbody > {
                                        inventory.length === 0 ?
                                        < tr > < td colSpan = { 5 }
                                        style = {
                                            { textAlign: 'center', color: 'var(--muted)', padding: 32, fontFamily: 'var(--font-mono)', fontSize: 10 } } > NO INVENTORY < /td></tr >
                                        :
                                            inventory.map(i => {
                                            const { label, cls } = getStatus(i.stockQuantity)
                                            return ( <
                                                tr key = { i.id } >
                                                <
                                                td className = "bright" > { i.product ? .name ? ? 'N/A' } < /td> <
                                                td style = {
                                                    { color: 'var(--muted)' } } > { i.product ? .category ? ? 'N/A' } < /td> <
                                                td style = {
                                                    { color: i.stockQuantity === 0 ? '#e07070' : i.stockQuantity < 10 ? '#d4785a' : 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 13 } } > { i.stockQuantity } < /td> <
                                                td > < span className = { 'v-badge ' + cls } > { label } < /span></td >
                                                <
                                                td >
                                                <
                                                button onClick = {
                                                    () => updateInventory(i.id, i.stockQuantity) }
                                                style = {
                                                    { background: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', cursor: 'pointer', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 9 } } >
                                                EDIT <
                                                /button> <
                                                /td> <
                                                /tr>
                                            )
                                        })
                                    } <
                                    /tbody> <
                                    /table> <
                                    /div> <
                                    /div>

                                    <
                                    div >
                                    <
                                    h2 style = {
                                        { fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: 16 } } > MY SHIPMENTS < /h2> <
                                    div style = {
                                        { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' } } >
                                    <
                                    table className = "v-table" >
                                    <
                                    thead > < tr > < th > Shipment < /th><th>Order</th > < th > Tracking < /th><th>Status</th > < th > Update < /th></tr > < /thead> <
                                    tbody > {
                                        shipments.length === 0 ?
                                        < tr > < td colSpan = { 5 }
                                        style = {
                                            { textAlign: 'center', color: 'var(--muted)', padding: 32, fontFamily: 'var(--font-mono)', fontSize: 10 } } > NO SHIPMENTS FOR THIS WAREHOUSE < /td></tr >
                                        :
                                            shipments.map(s => ( <
                                                tr key = { s.id } >
                                                <
                                                td className = "mono gold" > SHP - { s.id } < /td> <
                                                td className = "mono"
                                                style = {
                                                    { color: 'var(--muted)', fontSize: 10 } } > #{ s.order ? .id ? ? 'N/A' } < /td> <
                                                td className = "mono"
                                                style = {
                                                    { color: 'var(--muted)', fontSize: 10 } } > { s.trackingNumber ? ? 'N/A' } < /td> <
                                                td > < span className = { 'v-badge ' + shipBadge(s.shipmentStatus) } > { s.shipmentStatus ? ? 'N/A' } < /span></td >
                                                <
                                                td >
                                                <
                                                select defaultValue = { s.shipmentStatus }
                                                onChange = { e => updateShipmentStatus(s.id, e.target.value) }
                                                style = {
                                                    { background: '#1a1812', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' } } > {
                                                    ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map(st => < option key = { st }
                                                        value = { st }
                                                        style = {
                                                            { background: '#1a1812' } } > { st } < /option>)} <
                                                        /select> <
                                                        /td> <
                                                        /tr>
                                                    ))
                                            } <
                                            /tbody> <
                                            /table> <
                                            /div> <
                                            /div> <
                                            />
                                        )
                                    } <
                                    /div>
                                )
                            }