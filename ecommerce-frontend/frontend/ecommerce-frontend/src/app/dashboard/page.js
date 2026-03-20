'use client'
import { useEffect } from 'react'
import { ShoppingBag, Users, ClipboardList, TrendingUp, Package, ArrowUpRight, Activity } from 'lucide-react'

const stats = [
  { label:'Total Orders', value:'1,284', change:'+12.5%', icon:ClipboardList },
  { label:'Revenue',      value:'₹8.4L', change:'+8.2%',  icon:TrendingUp  },
  { label:'Active Users', value:'3,621', change:'+5.1%',  icon:Users       },
  { label:'Products',     value:'847',   change:'+3.4%',  icon:Package     },
]
const orders = [
  { id:'#ORD-9821', customer:'Rahul Sharma',  product:'Running Shoes',    amount:'₹2,499', status:'delivered' },
  { id:'#ORD-9820', customer:'Priya Mehta',   product:'Wireless Earbuds', amount:'₹1,899', status:'shipped' },
  { id:'#ORD-9819', customer:'Amit Gupta',    product:'Laptop Stand',     amount:'₹899',   status:'processing' },
  { id:'#ORD-9818', customer:'Sneha Patel',   product:'Yoga Mat',         amount:'₹649',   status:'delivered' },
  { id:'#ORD-9817', customer:'Vikram Singh',  product:'Coffee Maker',     amount:'₹3,299', status:'pending' },
]
const services = [
  { label:'Auth Service',      endpoint:'POST /api/auth/login',   icon:'🔐' },
  { label:'Product Service',   endpoint:'GET /api/products',      icon:'📦' },
  { label:'Order Service',     endpoint:'POST /api/orders',       icon:'🧾' },
  { label:'Cart Service',      endpoint:'GET /api/cart/{id}',     icon:'🛒' },
  { label:'Payment Service',   endpoint:'POST /api/payments',     icon:'💳' },
  { label:'Inventory Service', endpoint:'GET /api/inventory',     icon:'📊' },
  { label:'Shipment Service',  endpoint:'GET /api/shipments',     icon:'🚚' },
  { label:'Warehouse Service', endpoint:'GET /api/warehouse',     icon:'🏭' },
  { label:'Kafka Events',      endpoint:'order-created topic',    icon:'⚡' },
]
const statusCls = s => s==='delivered'?'v-badge-success':s==='shipped'?'v-badge-info':s==='processing'?'v-badge-warn':'v-badge-danger'

export default function DashboardPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('v-in') }), { threshold:0.1 })
    document.querySelectorAll('.v-reveal,.v-reveal-l').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:40 }}>

      {/* Header */}
      <div className="v-reveal" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--muted)', marginBottom:8 }}>Good morning</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,64px)', letterSpacing:'0.04em', color:'var(--cream)', lineHeight:0.95 }}>DASHBOARD<br/><span style={{ color:'var(--gold)', fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:300, fontSize:'0.65em' }}>overview</span></h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', background:'rgba(255,255,255,0.025)', border:'1px solid var(--border)' }}>
          <Activity size={12} style={{ color:'#4ade80' }}/>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>All systems operational</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }} className="v-reveal v-d1">
        {stats.map(({ label, value, change, icon:Icon }) => (
          <div key={label} className="v-card-hover" style={{ padding:'28px 24px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, var(--gold), transparent)', opacity:0.4 }} />
            <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ padding:10, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)' }}>
                <Icon size={16} style={{ color:'var(--gold)' }}/>
              </div>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.08em', color:'#4ade80', display:'flex', alignItems:'center', gap:2 }}>
                <ArrowUpRight size={10}/>{change}
              </span>
            </div>
            <div className="v-stat">{value}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginTop:8 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:2 }} className="v-reveal v-d2">

        {/* Orders table */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, letterSpacing:'0.06em', color:'var(--cream)' }}>RECENT ORDERS</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--muted)', marginTop:2 }}>Last 5 transactions</div>
            </div>
            <button style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gold)', background:'none', border:'1px solid rgba(201,168,76,0.2)', padding:'5px 12px', cursor:'none', transition:'all 0.25s ease' }}>View all</button>
          </div>
          <table className="v-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="mono gold">{o.id}</td>
                  <td className="bright">{o.customer}</td>
                  <td>{o.product}</td>
                  <td className="bright">{o.amount}</td>
                  <td><span className={`v-badge ${statusCls(o.status)}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Services */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, letterSpacing:'0.06em', color:'var(--cream)' }}>API SERVICES</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--muted)', marginTop:2 }}>Spring Boot · port 8080</div>
          </div>
          <div>
            {services.map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 20px', borderBottom:'1px solid rgba(240,235,224,0.03)', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:14 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.1em', color:'rgba(240,235,224,0.7)' }}>{s.label}</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)', marginTop:2 }}>{s.endpoint}</div>
                  </div>
                </div>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'block', flexShrink:0 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
