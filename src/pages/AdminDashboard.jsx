import { useState } from 'react'

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const SANS = "'DM Sans', system-ui, sans-serif"

const PLAN_COLOR  = { trial:'#555', solo:'#333', studio:'#111', multi:'#000' }
const PLAN_BG     = { trial:'#f5f5f5', solo:'#e8e8e8', studio:'#d0d0d0', multi:'#111' }
const PLAN_TEXT   = { trial:'#888', solo:'#555', studio:'#333', multi:'#fff' }
const STATUS_COLOR= { active:'#3a8a52', trial:'#a07230', paused:'#888', cancelled:'#c04040' }
const STATUS_BG   = { active:'rgba(58,138,82,.1)', trial:'rgba(160,114,48,.1)', paused:'rgba(136,136,136,.1)', cancelled:'rgba(192,64,64,.08)' }

const MOCK_SUBSCRIBERS = [
  { id:'s1', business:'Aura Lash Studio',      owner:'Zara Ahmed',     email:'zara@auralash.co.uk',    plan:'studio',  status:'active',    joined:'12 Oct 2025', calls:127, bookings:43, mrr:69,  location:'London, UK' },
  { id:'s2', business:'Glow by Nia',           owner:'Nia Thompson',   email:'nia@glowbynow.com',       plan:'solo',    status:'active',    joined:'18 Oct 2025', calls:84,  bookings:31, mrr:39,  location:'Manchester, UK' },
  { id:'s3', business:'Lash Lab Amsterdam',    owner:'Fleur de Boer',  email:'fleur@lashlabams.nl',     plan:'multi',   status:'active',    joined:'2 Nov 2025',  calls:298, bookings:112,mrr:120, location:'Amsterdam, NL' },
  { id:'s4', business:'Velvet Beauty Studio',  owner:'Amara Osei',     email:'amara@velvetbeauty.com',  plan:'studio',  status:'active',    joined:'9 Nov 2025',  calls:103, bookings:38, mrr:69,  location:'Birmingham, UK' },
  { id:'s5', business:'The Lash Room',         owner:'Sophie Clarke',  email:'sophie@thelashroom.co.uk',plan:'solo',    status:'trial',     joined:'21 Jan 2026', calls:22,  bookings:9,  mrr:0,   location:'Bristol, UK' },
  { id:'s6', business:'Brow & Co.',            owner:'Priya Kapoor',   email:'priya@browandco.com',     plan:'solo',    status:'active',    joined:'5 Dec 2025',  calls:61,  bookings:22, mrr:39,  location:'Leeds, UK' },
  { id:'s7', business:'Mink Lash Bar',         owner:'Jade Williams',  email:'jade@minklashbar.com',    plan:'studio',  status:'paused',    joined:'14 Nov 2025', calls:0,   bookings:0,  mrr:0,   location:'Glasgow, UK' },
  { id:'s8', business:'Studio Sèche',          owner:'Camille Moreau', email:'camille@studiosech.fr',   plan:'studio',  status:'active',    joined:'1 Dec 2025',  calls:88,  bookings:29, mrr:69,  location:'Paris, FR' },
  { id:'s9', business:'Elite Lash & Brow',     owner:'Fatima Hassan',  email:'fatima@elitelb.ae',       plan:'multi',   status:'active',    joined:'20 Nov 2025', calls:341, bookings:128,mrr:120, location:'Dubai, UAE' },
  { id:'s10',business:'Bloom Beauty Lounge',   owner:'Grace Nwosu',    email:'grace@bloombeauty.co.uk', plan:'solo',    status:'trial',     joined:'25 Jan 2026', calls:8,   bookings:3,  mrr:0,   location:'London, UK' },
  { id:'s11',business:'Wisp & Wink Studio',    owner:'Layla Barnes',   email:'layla@wispwink.com',      plan:'studio',  status:'cancelled', joined:'1 Oct 2025',  calls:0,   bookings:0,  mrr:0,   location:'Liverpool, UK' },
  { id:'s12',business:'Glam & Grace',          owner:'Destiny Osei',   email:'destiny@glamgrace.com',   plan:'solo',    status:'active',    joined:'8 Jan 2026',  calls:44,  bookings:16, mrr:39,  location:'Nottingham, UK' },
]

export default function AdminDashboard({ user, onLogout }) {
  const [search,  setSearch]  = useState('')
  const [planFlt, setPlanFlt] = useState('all')
  const [statFlt, setStatFlt] = useState('all')
  const [selected,setSelected]= useState(null)
  const [tab,     setTab]     = useState('subscribers') // subscribers | revenue | settings

  const filtered = MOCK_SUBSCRIBERS.filter(s => {
    const matchSearch = s.business.toLowerCase().includes(search.toLowerCase()) ||
                        s.owner.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan   = planFlt==='all' || s.plan===planFlt
    const matchStatus = statFlt==='all' || s.status===statFlt
    return matchSearch && matchPlan && matchStatus
  })

  const active = MOCK_SUBSCRIBERS.filter(s=>s.status==='active')
  const mrr    = active.reduce((a,s)=>a+s.mrr,0)
  const trials = MOCK_SUBSCRIBERS.filter(s=>s.status==='trial').length
  const paused = MOCK_SUBSCRIBERS.filter(s=>s.status==='paused').length

  if (selected) return <SubscriberDetail sub={selected} onBack={()=>setSelected(null)} />

  return (
    <div style={{ fontFamily:SANS, background:'#f5f4f2', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <style>{`
        .row-hover:hover { background: #f8f8f6 !important; cursor: pointer; }
        .si:hover { background: rgba(0,0,0,.05) !important; cursor:pointer; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp .4s ease both; }
        input:focus, select:focus { outline:none; border-color:#333 !important; }
      `}</style>

      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e8e8e8', height:56, padding:'0 28px', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ fontFamily:DISPLAY, fontSize:20, letterSpacing:'.08em', color:'#111' }}>AURA</div>
        <div style={{ width:1, height:20, background:'#e0e0e0' }} />
        <div style={{ fontSize:12, color:'#999', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500 }}>Admin</div>
        <div style={{ flex:1 }} />
        <div style={{ fontSize:13, color:'#888' }}>{user?.email}</div>
        <button onClick={onLogout} style={{ background:'transparent', border:'1px solid #e0e0e0', color:'#888', padding:'6px 14px', borderRadius:6, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Sign out</button>
      </div>

      <div style={{ display:'flex', flex:1 }}>
        {/* Sidebar */}
        <div style={{ width:190, background:'#fff', borderRight:'1px solid #e8e8e8', padding:'16px 10px' }}>
          {[
            { id:'subscribers', icon:'◈', label:'Subscribers' },
            { id:'revenue',     icon:'◉', label:'Revenue' },
            { id:'settings',    icon:'◇', label:'Settings' },
          ].map(n => (
            <div key={n.id} className="si" onClick={()=>setTab(n.id)} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 12px', borderRadius:8, background:tab===n.id?'#000':'transparent', color:tab===n.id?'#fff':'#555', marginBottom:2 }}>
              <span style={{ fontSize:13 }}>{n.icon}</span>
              <span style={{ fontSize:13, fontWeight:tab===n.id?500:400 }}>{n.label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex:1, overflow:'auto', padding:28 }}>

          {tab==='subscribers' && (
            <div className="fu">
              <div style={{ marginBottom:24 }}>
                <h1 style={{ fontFamily:DISPLAY, fontSize:26, fontWeight:400, color:'#111', marginBottom:4 }}>Subscribers</h1>
                <p style={{ fontSize:13, color:'#999' }}>All AURA clients across every plan.</p>
              </div>

              {/* KPI row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
                {[
                  { val:`£${mrr}`, label:'Monthly Recurring Revenue', sub:`£${mrr*12} ARR` },
                  { val:active.length, label:'Active Subscribers', sub:`${MOCK_SUBSCRIBERS.length} total` },
                  { val:trials, label:'Active Trials', sub:'14-day window' },
                  { val:paused, label:'Paused', sub:'Not billed' },
                  { val:MOCK_SUBSCRIBERS.filter(s=>s.status==='cancelled').length, label:'Churned', sub:'All time' },
                ].map(k => (
                  <div key={k.label} style={{ background:'#fff', border:'1px solid #eee', borderRadius:10, padding:'14px 16px' }}>
                    <div style={{ fontFamily:DISPLAY, fontSize:28, fontWeight:400, color:'#111', marginBottom:2 }}>{k.val}</div>
                    <div style={{ fontSize:11, fontWeight:500, color:'#888', marginBottom:1 }}>{k.label}</div>
                    <div style={{ fontSize:10, color:'#bbb' }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, owner, or email..." style={{ flex:1, border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 13px', fontSize:13, fontFamily:SANS, color:'#333', background:'#fff' }} />
                <select value={planFlt} onChange={e=>setPlanFlt(e.target.value)} style={{ border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 13px', fontSize:13, fontFamily:SANS, color:'#333', background:'#fff' }}>
                  <option value="all">All plans</option>
                  <option value="trial">Trial</option>
                  <option value="solo">Solo £39</option>
                  <option value="studio">Studio £69</option>
                  <option value="multi">Multi £120</option>
                </select>
                <select value={statFlt} onChange={e=>setStatFlt(e.target.value)} style={{ border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 13px', fontSize:13, fontFamily:SANS, color:'#333', background:'#fff' }}>
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div style={{ fontSize:12, color:'#bbb', whiteSpace:'nowrap' }}>{filtered.length} result{filtered.length!==1?'s':''}</div>
              </div>

              {/* Table */}
              <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1.4fr 90px 80px 70px 70px 90px 80px', padding:'10px 18px', background:'#f9f9f7', fontSize:10, fontWeight:600, color:'#bbb', letterSpacing:'.1em', textTransform:'uppercase' }}>
                  {['Business','Owner / Email','Plan','Status','Calls','Booked','Joined',''].map(h=><div key={h}>{h}</div>)}
                </div>

                {filtered.length===0 && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#bbb' }}>No subscribers match your filters.</div>
                )}

                {filtered.map((s,i) => (
                  <div key={s.id} className="row-hover" onClick={()=>setSelected(s)} style={{ display:'grid', gridTemplateColumns:'2fr 1.4fr 90px 80px 70px 70px 90px 80px', padding:'13px 18px', borderTop:'1px solid #f0f0f0', alignItems:'center', background:i%2===0?'#fff':'#fafafa', transition:'background .15s' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500, color:'#111' }}>{s.business}</div>
                      <div style={{ fontSize:11, color:'#bbb' }}>{s.location}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:12, color:'#555' }}>{s.owner}</div>
                      <div style={{ fontSize:11, color:'#bbb' }}>{s.email}</div>
                    </div>
                    <div>
                      <span style={{ fontSize:10, background:PLAN_BG[s.plan], color:PLAN_TEXT[s.plan], padding:'3px 9px', borderRadius:100, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{s.plan}</span>
                    </div>
                    <div>
                      <span style={{ fontSize:11, background:STATUS_BG[s.status], color:STATUS_COLOR[s.status], padding:'3px 9px', borderRadius:100, fontWeight:500 }}>{s.status}</span>
                    </div>
                    <div style={{ fontSize:13, color:'#555', fontWeight:500 }}>{s.calls}</div>
                    <div style={{ fontSize:13, color:'#555', fontWeight:500 }}>{s.bookings}</div>
                    <div style={{ fontSize:11, color:'#bbb' }}>{s.joined}</div>
                    <div style={{ fontSize:11, color:'#bbb' }}>View →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='revenue' && (
            <div className="fu">
              <h1 style={{ fontFamily:DISPLAY, fontSize:26, fontWeight:400, color:'#111', marginBottom:24 }}>Revenue</h1>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
                {[
                  { label:'MRR', val:`£${mrr}`, sub:'Monthly recurring' },
                  { label:'ARR', val:`£${mrr*12}`, sub:'Annualised' },
                  { label:'Avg Revenue / Sub', val:`£${active.length>0?Math.round(mrr/active.length):0}`, sub:'Active only' },
                ].map(k=>(
                  <div key={k.label} style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:'24px 24px' }}>
                    <div style={{ fontSize:11, color:'#bbb', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{k.label}</div>
                    <div style={{ fontFamily:DISPLAY, fontSize:40, fontWeight:400, color:'#111', marginBottom:4 }}>{k.val}</div>
                    <div style={{ fontSize:12, color:'#bbb' }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid #f0f0f0', fontSize:13, fontWeight:600, color:'#111' }}>Plan breakdown</div>
                {[
                  { plan:'Solo',           price:39,  count:MOCK_SUBSCRIBERS.filter(s=>s.plan==='solo'&&s.status==='active').length },
                  { plan:'Studio',         price:69,  count:MOCK_SUBSCRIBERS.filter(s=>s.plan==='studio'&&s.status==='active').length },
                  { plan:'Multi-Location', price:120, count:MOCK_SUBSCRIBERS.filter(s=>s.plan==='multi'&&s.status==='active').length },
                ].map(p=>(
                  <div key={p.plan} style={{ display:'flex', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid #f5f5f5' }}>
                    <div style={{ flex:1, fontSize:13, fontWeight:500, color:'#111' }}>{p.plan}</div>
                    <div style={{ fontSize:12, color:'#bbb', marginRight:24 }}>£{p.price}/month × {p.count} subscribers</div>
                    <div style={{ fontFamily:DISPLAY, fontSize:22, color:'#111', minWidth:80, textAlign:'right' }}>£{p.price*p.count}</div>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', padding:'16px 20px', background:'#f9f9f7' }}>
                  <div style={{ flex:1, fontSize:13, fontWeight:600, color:'#111' }}>Total MRR</div>
                  <div style={{ fontFamily:DISPLAY, fontSize:26, color:'#111' }}>£{mrr}</div>
                </div>
              </div>
            </div>
          )}

          {tab==='settings' && (
            <div className="fu">
              <h1 style={{ fontFamily:DISPLAY, fontSize:26, fontWeight:400, color:'#111', marginBottom:20 }}>Admin Settings</h1>
              <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:28, maxWidth:480 }}>
                <div style={{ fontSize:13, color:'#999', marginBottom:20 }}>Platform configuration for AURA PSC Agent.</div>
                {[
                  { label:'Admin Email',       val:'rachel@pscagent.com' },
                  { label:'Default Agent Name',val:'AURA' },
                  { label:'Support Email',     val:'support@pscagent.com' },
                ].map(f=>(
                  <div key={f.label} style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontSize:11, color:'#bbb', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>{f.label}</label>
                    <input defaultValue={f.val} style={{ width:'100%', border:'1px solid #e8e8e8', borderRadius:7, padding:'10px 12px', fontSize:14, color:'#333', boxSizing:'border-box', fontFamily:SANS, outline:'none' }} />
                  </div>
                ))}
                <button style={{ background:'#111', color:'#fff', border:'none', padding:'10px 24px', borderRadius:7, fontSize:13, cursor:'pointer', fontFamily:SANS, fontWeight:500 }}>Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Individual subscriber detail view ─────────────────────────────────────
function SubscriberDetail({ sub, onBack }) {
  const [action, setAction] = useState('')

  return (
    <div style={{ fontFamily:SANS, background:'#f5f4f2', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e8e8e8', height:56, padding:'0 28px', display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'#888', cursor:'pointer', fontFamily:SANS, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>← All subscribers</button>
        <div style={{ flex:1 }} />
        <div style={{ fontFamily:DISPLAY, fontSize:18, color:'#111' }}>{sub.business}</div>
      </div>

      <div style={{ padding:28, maxWidth:960, margin:'0 auto' }}>
        {/* Header card */}
        <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:'24px 28px', marginBottom:20, display:'flex', gap:24, alignItems:'flex-start' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:DISPLAY, fontSize:22, flexShrink:0 }}>
            {sub.business[0]}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
              <h2 style={{ fontFamily:DISPLAY, fontSize:24, fontWeight:400, color:'#111' }}>{sub.business}</h2>
              <span style={{ fontSize:10, background:PLAN_BG[sub.plan], color:PLAN_TEXT[sub.plan], padding:'3px 10px', borderRadius:100, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{sub.plan}</span>
              <span style={{ fontSize:11, background:STATUS_BG[sub.status], color:STATUS_COLOR[sub.status], padding:'3px 10px', borderRadius:100, fontWeight:500 }}>{sub.status}</span>
            </div>
            <div style={{ fontSize:13, color:'#888' }}>{sub.owner} · {sub.email} · {sub.location}</div>
            <div style={{ fontSize:12, color:'#bbb', marginTop:3 }}>Joined {sub.joined}</div>
          </div>
          {/* Quick actions */}
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            {sub.status==='active' && <button onClick={()=>setAction('paused')} style={{ background:'transparent', border:'1px solid #e0e0e0', color:'#888', padding:'8px 16px', borderRadius:7, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Pause Account</button>}
            {sub.status==='paused' && <button onClick={()=>setAction('active')} style={{ background:'#111', color:'#fff', border:'none', padding:'8px 16px', borderRadius:7, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Reactivate</button>}
            <button style={{ background:'transparent', border:'1px solid #e0e0e0', color:'#555', padding:'8px 16px', borderRadius:7, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Upgrade Plan</button>
            <button style={{ background:'transparent', border:'1px solid #f0d0d0', color:'#c04040', padding:'8px 16px', borderRadius:7, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Cancel</button>
          </div>
        </div>

        {action && <div style={{ background:'rgba(58,138,82,.08)', border:'1px solid rgba(58,138,82,.2)', borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#3a8a52' }}>Account status updated to <strong>{action}</strong> (demo only — connect Supabase to persist).</div>}

        {/* Usage stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { val:sub.calls,    label:'Calls this month' },
            { val:sub.bookings, label:'Bookings made' },
            { val:sub.mrr>0?`£${sub.mrr}`:'-', label:'Monthly billing' },
            { val:sub.status==='trial'?'Trial':'Active', label:'Account status' },
          ].map(k=>(
            <div key={k.label} style={{ background:'#fff', border:'1px solid #eee', borderRadius:10, padding:'16px 18px' }}>
              <div style={{ fontFamily:DISPLAY, fontSize:28, fontWeight:400, color:'#111', marginBottom:4 }}>{k.val}</div>
              <div style={{ fontSize:11, color:'#bbb' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Agent config */}
        <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#111', marginBottom:16 }}>Agent Configuration</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { label:'Agent Name', val:'AURA' },
              { label:'Booking URL', val:sub.business.toLowerCase().replace(/\s+/g,'-')+'.fresha.com' },
              { label:'Vapi Agent ID', val:'vapi_'+sub.id.slice(0,8)+'...' },
              { label:'Plan', val:sub.plan.charAt(0).toUpperCase()+sub.plan.slice(1) },
            ].map(f=>(
              <div key={f.label}>
                <div style={{ fontSize:10, color:'#bbb', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>{f.label}</div>
                <div style={{ fontSize:13, color:'#555', fontFamily: f.label==='Vapi Agent ID'?'monospace':SANS }}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
