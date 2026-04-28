import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LoginPage from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif"
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'rachel@pscagent.com'

export default function AURAApp() {
  const [view,  setView]  = useState('landing')
  const [user,  setUser]  = useState(null)
  const [role,  setRole]  = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const fonts = [
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/400.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/500.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/400.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/500.css',
    ]
    fonts.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement('link')
        l.rel = 'stylesheet'; l.href = href
        document.head.appendChild(l)
      }
    })
  }, [])

  // Restore session on page load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = session.user.email === ADMIN_EMAIL
        setUser(session.user)
        setRole(isAdmin ? 'admin' : 'subscriber')
        setView(isAdmin ? 'admin' : 'dashboard')
      }
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null); setRole(null); setView('landing')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = (authedUser, authedRole) => {
    setUser(authedUser)
    setRole(authedRole)
    setView(authedRole === 'admin' ? 'admin' : 'dashboard')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null); setRole(null); setView('landing')
  }

  if (!ready) {
    return (
      <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontFamily:DISPLAY, fontSize:22, letterSpacing:'.1em', color:'#333' }}>AURA</div>
      </div>
    )
  }

  if (view === 'login')     return <LoginPage onLogin={handleLogin} setView={setView} />
  if (view === 'admin')     return role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} setView={setView} />
  if (view === 'dashboard') return user ? <SubscriberDashboard user={user} onLogout={handleLogout} setView={setView} /> : <LoginPage onLogin={handleLogin} setView={setView} />
  return <Landing setView={setView} />
}

// ── LANDING ───────────────────────────────────────────────────────────────
const CHANNELS = [
  { name:'Phone Calls',   desc:'Answers every inbound call, books appointments, handles FAQs in real time.' },
  { name:'WhatsApp',      desc:'Clients message your WhatsApp number. AURA replies instantly and books them in.' },
  { name:'SMS',           desc:'Automated text reminders before every appointment with two-way reply handling.' },
  { name:'Instagram DMs', desc:'Every enquiry in your Instagram inbox gets an instant, intelligent response.' },
  { name:'Email',         desc:'Every email gets a professional reply. Bookings confirmed, questions answered.' },
]

const PRICING = [
  { tier:'Solo',           price:'£39',  period:'/mo', desc:'For the one-woman studio juggling everything.',     features:['Up to 150 inbound calls/month','WhatsApp & SMS included','10 FAQ answers','Booking integration','Daily call summaries','Email support'],                                                     cta:'Start Free Trial', highlight:false },
  { tier:'Studio',         price:'£69',  period:'/mo', desc:'For growing studios ready to run like a business.', features:['Unlimited calls & messages','All 5 channels included','Unlimited FAQ answers','Custom agent name & voice','Full conversation transcripts','Analytics dashboard','Priority support'],       cta:'Start Free Trial', highlight:true, badge:'Most Popular' },
  { tier:'Multi-Location', price:'£120', period:'/mo', desc:'Runs multiple chairs or locations under one roof.',  features:['Up to 3 locations','Multiple agents','All channels per location','Team access','Booking analytics','Dedicated onboarding call'],                                                          cta:'Book a Demo',    highlight:false },
]

const FAQS = [
  { q:'Can I keep my existing phone number?',      a:'Yes. We set up call forwarding so your number stays the same. AURA answers on your behalf.' },
  { q:'Which booking systems does it connect to?', a:'Acuity, Fresha, Timely, Google Calendar, and Calendly. More integrations added monthly.' },
  { q:'Can clients still reach a human?',          a:'Absolutely. AURA hands off to you via text alert if a client specifically asks or cannot resolve something.' },
  { q:'Do all 5 channels work simultaneously?',    a:'Yes — AURA monitors every active channel at the same time. A client can call while another messages on WhatsApp and both are handled instantly.' },
  { q:'How long does setup take?',                 a:'Most clients are fully live within 24 hours. Our setup wizard walks you through every step.' },
]

const TESTIMONIALS = [
  { quote:'I used to lose at least two bookings a week to missed calls. AURA has paid for itself ten times over.', name:'Zara Ahmed', studio:'Aura Lash Studio, London' },
  { quote:'My clients love that they can just WhatsApp and get a reply immediately. It feels personal but it\'s all AURA.', name:'Nia Thompson', studio:'Glow by Nia, Manchester' },
  { quote:'Setting it up took less than a day. Now I\'m fully booked three weeks ahead and I didn\'t change anything else.', name:'Fleur de Boer', studio:'Lash Lab Amsterdam' },
]


function Landing({ setView }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [msgIdx, setMsgIdx] = useState(5)

  const liveMessages = [
    { color:'#1a1a1a', ch:'Call',      msg:'Sophie M. — Mega Volume booked',    time:'now' },
    { color:'#22c55e', ch:'WhatsApp',  msg:'Jade R. — infill pricing enquiry',   time:'2m'  },
    { color:'#d946ef', ch:'Instagram', msg:'New enquiry — fullset',               time:'5m'  },
    { color:'#3b82f6', ch:'SMS',       msg:'Reminder sent — Layla B.',            time:'12m' },
    { color:'#f97316', ch:'Email',     msg:'Priya K. — rescheduled',             time:'18m' },
    { color:'#22c55e', ch:'WhatsApp',  msg:'Mia T. — booking wispy hybrid',       time:'now' },
    { color:'#1a1a1a', ch:'Call',      msg:'Aisha B. — classic infill booked',   time:'now' },
    { color:'#d946ef', ch:'Instagram', msg:'DM — brow lamination enquiry',        time:'3m'  },
    { color:'#3b82f6', ch:'SMS',       msg:'Chloe W. — confirmed tomorrow',       time:'1m'  },
    { color:'#f97316', ch:'Email',     msg:'New enquiry — mega volume set',       time:'now' },
  ]

  const [topRow, setTopRow] = useState(liveMessages[0])
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setMsgIdx(i => {
          const next = (i + 1) % liveMessages.length
          setTopRow(liveMessages[next])
          return next
        })
        setFade(true)
      }, 200)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  const rows = [
    { color:'#1a1a1a', ch:'Call',      msg:'Sophie M. — Mega Volume booked',  time:'now' },
    { color:'#22c55e', ch:'WhatsApp',  msg:'Jade R. — infill pricing',         time:'2m'  },
    { color:'#d946ef', ch:'Instagram', msg:'New enquiry — fullset',             time:'5m'  },
    { color:'#3b82f6', ch:'SMS',       msg:'Reminder sent — Layla B.',          time:'12m' },
    { color:'#f97316', ch:'Email',     msg:'Priya K. — rescheduled',           time:'18m' },
  ]
  rows[0] = topRow

  const D = "'Cormorant Garamond', Georgia, serif"
  const S = "'DM Sans', system-ui, sans-serif"
  const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

  return (
    <div style={{ background:'#faf8f5', fontFamily:D, color:'#1a1a1a', overflowX:'hidden', position:'relative' }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/400.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/400.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/500.css');
        @keyframes a1{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(75px,55px) scale(1.1)}60%{transform:translate(-35px,85px) scale(0.93)}85%{transform:translate(55px,-25px) scale(1.06)}}
        @keyframes a2{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(-65px,45px) scale(1.13)}55%{transform:translate(45px,75px) scale(0.9)}80%{transform:translate(-35px,-35px) scale(1.09)}}
        @keyframes a3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-75px,-45px) scale(1.16)}70%{transform:translate(55px,55px) scale(0.87)}}
        @keyframes a4{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(65px,-65px) scale(1.14)}}
        @keyframes a5{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-55px,65px) scale(1.2)}70%{transform:translate(65px,-35px) scale(0.88)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(0.7)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .fu{animation:fadeUp .7s ease both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
        .blob1{animation:a1 8s ease-in-out infinite}
        .blob2{animation:a2 10s ease-in-out infinite}
        .blob3{animation:a3 7s ease-in-out infinite}
        .blob4{animation:a4 9s ease-in-out infinite}
        .blob5{animation:a5 11s ease-in-out infinite}
        .float-card{animation:fadeUp .8s .3s ease both,floatY 5s 1s ease-in-out infinite}
        .pulse-dot{animation:pulse 2s ease-in-out infinite}
        .ticker-track{animation:ticker 14s linear infinite}
        .nav-ghost:hover{background:rgba(255,255,255,.85)!important}
        .nav-cta:hover{background:#333!important}
        .btn-dark:hover{background:#333!important}
        .btn-soft:hover{background:rgba(255,255,255,.85)!important}
        .ch-cell:hover{background:rgba(255,255,255,.98)!important}
        .pc-card:hover{transform:translateY(-3px)}
        .pc-card{transition:transform .25s}
      `}</style>

      {/* Grain overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:3, pointerEvents:'none', opacity:0.55, backgroundImage:grain, backgroundRepeat:'repeat', backgroundSize:'200px' }} />

      {/* Gradient canvas — behind everything, starts at very top */}
      <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100vh', pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
        {/* Burnt orange */}
        <div className="blob1" style={{ position:'absolute', width:580, height:580, background:'radial-gradient(circle at center,#f03e00 0%,#ff5500 35%,#ff8c00 60%,transparent 75%)', filter:'blur(75px)', opacity:.75, top:-160, left:-100, borderRadius:'50%' }} />
        {/* Deep violet */}
        <div className="blob2" style={{ position:'absolute', width:520, height:520, background:'radial-gradient(circle at center,#6600cc 0%,#8b00ff 35%,#a855f7 60%,transparent 75%)', filter:'blur(80px)', opacity:.7, top:-120, right:-80, borderRadius:'50%' }} />
        {/* Rich cobalt blue */}
        <div className="blob3" style={{ position:'absolute', width:440, height:440, background:'radial-gradient(circle at center,#0044cc 0%,#2563eb 35%,#60a5fa 60%,transparent 75%)', filter:'blur(78px)', opacity:.65, top:220, right:40, borderRadius:'50%' }} />
        {/* Hot magenta */}
        <div className="blob4" style={{ position:'absolute', width:360, height:360, background:'radial-gradient(circle at center,#cc0066 0%,#ec4899 40%,#f472b6 60%,transparent 75%)', filter:'blur(72px)', opacity:.6, top:260, left:80, borderRadius:'50%' }} />
        {/* Deep amber */}
        <div className="blob5" style={{ position:'absolute', width:300, height:300, background:'radial-gradient(circle at center,#d97706 0%,#f59e0b 40%,transparent 70%)', filter:'blur(70px)', opacity:.55, top:80, left:240, borderRadius:'50%' }} />
      </div>

      {/* NAV — transparent, no border */}
      <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', padding:'22px 52px', background:'transparent' }}>
        <div style={{ fontFamily:D, fontSize:20, letterSpacing:'.12em', color:'#1a1a1a', flex:1 }}>
          AURA <span style={{ fontFamily:S, fontSize:8, letterSpacing:'.2em', color:'rgba(0,0,0,.35)', verticalAlign:'middle', marginLeft:8 }}>BY PSC AGENT</span>
        </div>
        <button className="nav-ghost" onClick={() => setView('login')} style={{ fontFamily:S, fontSize:11, letterSpacing:'.05em', color:'rgba(0,0,0,.55)', background:'rgba(255,255,255,.62)', border:'0.5px solid rgba(0,0,0,.12)', borderRadius:100, padding:'8px 18px', marginRight:8, cursor:'pointer', backdropFilter:'blur(12px)', transition:'background .2s' }}>Client Login</button>
        <button className="nav-cta" onClick={() => setView('login')} style={{ fontFamily:S, fontSize:11, fontWeight:500, letterSpacing:'.08em', background:'#1a1a1a', color:'#fff', border:'none', padding:'9px 22px', borderRadius:100, cursor:'pointer', transition:'background .2s' }}>Start Free Trial</button>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:10, padding:'32px 52px 64px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center', minHeight:'88vh' }}>
        <div>
          <div className="fu" style={{ fontFamily:S, fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(0,0,0,.42)', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#f03e00', display:'inline-block' }} />
            AI Receptionist for Beauty Businesses
          </div>
          <h1 className="fu d1" style={{ fontSize:68, lineHeight:.96, fontWeight:400, letterSpacing:'-.022em', marginBottom:24 }}>
            Your clients call.<br />
            <em style={{ fontStyle:'italic', WebkitTextStroke:'1.5px #1a1a1a', color:'transparent' }}>AURA answers.</em>
          </h1>
          <p className="fu d2" style={{ fontFamily:S, fontSize:14, color:'rgba(0,0,0,.5)', lineHeight:1.85, maxWidth:380, marginBottom:28 }}>
            AURA handles your calls, WhatsApp, Instagram DMs, SMS and email — so every client gets a reply, on every channel, 24/7.
          </p>
          <div className="fu d3" style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:28 }}>
            {['Phone Calls','WhatsApp','Instagram DMs','SMS','Email'].map(c => (
              <span key={c} style={{ fontFamily:S, fontSize:10, letterSpacing:'.04em', color:'rgba(0,0,0,.6)', background:'rgba(255,255,255,.75)', border:'0.5px solid rgba(0,0,0,.12)', borderRadius:100, padding:'5px 12px', backdropFilter:'blur(10px)' }}>{c}</span>
            ))}
          </div>
          <div className="fu d4" style={{ display:'flex', gap:10 }}>
            <button className="btn-dark" onClick={() => setView('login')} style={{ fontFamily:S, fontSize:12, fontWeight:500, letterSpacing:'.07em', background:'#1a1a1a', color:'#fff', border:'none', padding:'13px 26px', borderRadius:100, cursor:'pointer', transition:'background .2s' }}>Start 14-Day Free Trial</button>
            <button className="btn-soft" onClick={() => setView('login')} style={{ fontFamily:S, fontSize:12, letterSpacing:'.05em', color:'rgba(0,0,0,.6)', background:'rgba(255,255,255,.65)', border:'0.5px solid rgba(0,0,0,.15)', padding:'13px 20px', borderRadius:100, cursor:'pointer', backdropFilter:'blur(10px)', transition:'background .2s' }}>Client Login →</button>
          </div>
          <p style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.3)', marginTop:14, letterSpacing:'.06em' }}>No card required · Cancel any time · Live in 24 hours</p>
        </div>

        {/* Live card */}
        <div className="float-card" style={{ background:'rgba(255,255,255,.85)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', border:'0.5px solid rgba(255,255,255,.95)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'0.5px solid rgba(0,0,0,.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:D, fontSize:15, color:'#1a1a1a' }}>AURA is active</div>
              <div style={{ fontFamily:S, fontSize:9, color:'rgba(0,0,0,.35)', marginTop:2 }}>Monitoring all channels</div>
            </div>
            <div className="pulse-dot" style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e' }} />
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ padding:'10px 20px', borderBottom: i < 4 ? '0.5px solid rgba(0,0,0,.04)' : 'none', display:'grid', gridTemplateColumns:'8px 1fr auto', gap:10, alignItems:'center', opacity: i === 0 ? (fade ? 1 : 0) : 1, transform: i === 0 ? (fade ? 'translateY(0)' : 'translateY(-6px)') : 'none', transition: i === 0 ? 'opacity .35s ease, transform .35s ease' : 'none' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:r.color }} />
              <div>
                <div style={{ fontFamily:S, fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(0,0,0,.3)', marginBottom:2 }}>{r.ch}</div>
                <div style={{ fontFamily:S, fontSize:11, color:'#1a1a1a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.msg}</div>
              </div>
              <div style={{ fontFamily:S, fontSize:9, color:'rgba(0,0,0,.28)' }}>{r.time}</div>
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', background:'rgba(0,0,0,.02)' }}>
            {[{n:'8',l:'Handled'},{n:'5',l:'Booked'},{n:'0',l:'Missed'}].map((s,i) => (
              <div key={i} style={{ padding:'12px 8px', textAlign:'center', borderRight: i < 2 ? '0.5px solid rgba(0,0,0,.05)' : 'none' }}>
                <div style={{ fontFamily:D, fontSize:22, color:'#1a1a1a' }}>{s.n}</div>
                <div style={{ fontFamily:S, fontSize:8, color:'rgba(0,0,0,.32)', letterSpacing:'.06em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ position:'relative', zIndex:10, borderTop:'0.5px solid rgba(0,0,0,.07)', borderBottom:'0.5px solid rgba(0,0,0,.07)', padding:'10px 0', overflow:'hidden', background:'rgba(255,255,255,.5)', backdropFilter:'blur(8px)' }}>
        <div className="ticker-track" style={{ display:'flex', width:'max-content' }}>
          {['Phone Calls','—','WhatsApp','—','Instagram DMs','—','SMS','—','Email','—','Phone Calls','—','WhatsApp','—','Instagram DMs','—','SMS','—','Email','—'].map((t,i) => (
            <span key={i} style={{ fontFamily:S, fontSize:9, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(0,0,0,.4)', padding:'0 24px', whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* CHANNELS */}
      <section style={{ position:'relative', zIndex:10, padding:'52px 52px', borderBottom:'0.5px solid rgba(0,0,0,.07)', background:'rgba(255,255,255,.4)', backdropFilter:'blur(14px)' }}>
        <div style={{ fontFamily:S, fontSize:9, letterSpacing:'.26em', textTransform:'uppercase', color:'rgba(0,0,0,.32)', marginBottom:28 }}>Every Channel. One Agent.</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:'rgba(0,0,0,.06)', border:'0.5px solid rgba(0,0,0,.06)', borderRadius:16, overflow:'hidden' }}>
          {[
            { n:'01', name:'Phone Calls',   desc:'Answers every call, books appointments and handles FAQs live.' },
            { n:'02', name:'WhatsApp',       desc:'Clients message your number. AURA replies and books instantly.' },
            { n:'03', name:'SMS',            desc:'Automated reminders with two-way reply handling.' },
            { n:'04', name:'Instagram DMs',  desc:'Every inbox enquiry gets an instant intelligent response.' },
            { n:'05', name:'Email',          desc:'Professional replies to every email. Zero backlog.' },
          ].map(c => (
            <div key={c.n} className="ch-cell" style={{ background:'rgba(255,255,255,.9)', padding:'22px 16px', transition:'background .2s' }}>
              <div style={{ fontSize:32, color:'rgba(0,0,0,.05)', marginBottom:6, lineHeight:1 }}>{c.n}</div>
              <div style={{ fontFamily:D, fontSize:15, color:'#1a1a1a', marginBottom:5 }}>{c.name}</div>
              <div style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.38)', lineHeight:1.65 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ position:'relative', zIndex:10, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'0.5px solid rgba(0,0,0,.07)', background:'rgba(255,255,255,.45)', backdropFilter:'blur(8px)' }}>
        {[{v:'£320',l:'Average monthly revenue lost to no-shows per solo tech'},{v:'67%',l:'Of missed messages that never get a reply'},{v:'94%',l:'Client satisfaction after switching to AURA'}].map((s,i) => (
          <div key={i} style={{ padding:'36px 28px', textAlign:'center', borderRight: i < 2 ? '0.5px solid rgba(0,0,0,.07)' : 'none' }}>
            <div style={{ fontFamily:D, fontSize:56, color:'#1a1a1a', lineHeight:1, marginBottom:10 }}>{s.v}</div>
            <div style={{ fontFamily:S, fontSize:11, color:'rgba(0,0,0,.38)', lineHeight:1.6, maxWidth:160, margin:'0 auto' }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* PRICING */}
      <section style={{ position:'relative', zIndex:10, padding:'52px 52px', borderBottom:'0.5px solid rgba(0,0,0,.07)', background:'rgba(255,255,255,.35)', backdropFilter:'blur(8px)' }}>
        <div style={{ fontFamily:S, fontSize:9, letterSpacing:'.26em', textTransform:'uppercase', color:'rgba(0,0,0,.32)', marginBottom:14 }}>Pricing</div>
        <h2 style={{ fontFamily:D, fontSize:44, fontWeight:400, color:'#1a1a1a', marginBottom:28, letterSpacing:'-.01em' }}>
          Straightforward.<br /><em style={{ fontStyle:'italic', WebkitTextStroke:'1px #1a1a1a', color:'transparent' }}>No surprises.</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
          {PRICING.map(p => (
            <div key={p.tier} className="pc-card" style={{ background:'rgba(255,255,255,.85)', border: p.highlight ? '1px solid #1a1a1a' : '0.5px solid rgba(0,0,0,.09)', borderRadius:16, padding:'24px 20px', backdropFilter:'blur(16px)', position:'relative' }}>
              {p.badge && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:'#1a1a1a', color:'#fff', fontFamily:S, fontSize:9, fontWeight:600, padding:'3px 14px', borderRadius:100, letterSpacing:'.08em', whiteSpace:'nowrap' }}>{p.badge}</div>}
              <div style={{ fontFamily:S, fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(0,0,0,.32)', marginBottom:8 }}>{p.tier}</div>
              <div style={{ marginBottom:8 }}>
                <span style={{ fontFamily:D, fontSize:44, color:'#1a1a1a', lineHeight:1 }}>{p.price}</span>
                <span style={{ fontFamily:S, fontSize:11, color:'rgba(0,0,0,.32)' }}>{p.period}</span>
              </div>
              <p style={{ fontFamily:S, fontSize:11, color:'rgba(0,0,0,.42)', lineHeight:1.6, marginBottom:14, paddingBottom:12, borderBottom:'0.5px solid rgba(0,0,0,.07)' }}>{p.desc}</p>
              {p.features.map((f,i) => (
                <div key={i} style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.55)', padding:'5px 0', borderBottom:'0.5px solid rgba(0,0,0,.05)', display:'flex', gap:8 }}><span>—</span>{f}</div>
              ))}
              <button onClick={() => setView('login')} style={{ width:'100%', marginTop:16, padding:'11px 0', borderRadius:100, fontFamily:S, fontSize:11, fontWeight:500, letterSpacing:'.06em', cursor:'pointer', background: p.highlight ? '#1a1a1a' : 'transparent', color: p.highlight ? '#fff' : '#1a1a1a', border: p.highlight ? 'none' : '0.5px solid rgba(0,0,0,.2)' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position:'relative', zIndex:10, padding:'52px 52px', borderBottom:'0.5px solid rgba(0,0,0,.07)', background:'rgba(255,255,255,.3)', backdropFilter:'blur(8px)' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <h2 style={{ fontFamily:D, fontSize:40, fontWeight:400, color:'#1a1a1a', textAlign:'center', marginBottom:40 }}>Questions</h2>
          {FAQS.map((f,i) => (
            <div key={i} style={{ borderBottom:'0.5px solid rgba(0,0,0,.08)' }}>
              <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', background:'none', border:'none', color:'rgba(0,0,0,.7)', padding:'18px 0', textAlign:'left', cursor:'pointer', display:'flex', justifyContent:'space-between', gap:16, fontFamily:D, fontSize:18, lineHeight:1.3 }}>
                {f.q}
                <span style={{ color:'rgba(0,0,0,.3)', fontSize:20, flexShrink:0, display:'inline-block', transition:'transform .2s', transform: openFaq===i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontFamily:S, fontSize:13, color:'rgba(0,0,0,.45)', lineHeight:1.85, paddingBottom:18 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', zIndex:10, padding:'90px 52px', textAlign:'center', background:'rgba(255,255,255,.25)', backdropFilter:'blur(8px)' }}>
        <div style={{ fontFamily:D, fontSize:200, color:'rgba(0,0,0,.02)', lineHeight:1, position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', letterSpacing:'-.05em' }}>A</div>
        <h2 style={{ fontFamily:D, fontSize:56, fontWeight:400, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:16, position:'relative' }}>
          You do the lashes.<br />
          <em style={{ fontStyle:'italic', WebkitTextStroke:'1px #1a1a1a', color:'transparent' }}>AURA does the rest.</em>
        </h2>
        <p style={{ fontFamily:S, fontSize:14, color:'rgba(0,0,0,.42)', marginBottom:32, maxWidth:380, margin:'0 auto 32px', lineHeight:1.8, position:'relative' }}>
          Join beauty professionals who stopped losing money to missed bookings across every channel.
        </p>
        <button onClick={() => setView('login')} style={{ fontFamily:S, fontSize:14, fontWeight:500, letterSpacing:'.07em', background:'#1a1a1a', color:'#fff', border:'none', padding:'16px 40px', borderRadius:100, cursor:'pointer', position:'relative' }}>
          Start Your Free Trial Today
        </button>
        <p style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.28)', marginTop:14, letterSpacing:'.06em', position:'relative' }}>14 days free · No card required · Cancel anytime</p>
      </section>

      <footer style={{ position:'relative', zIndex:10, borderTop:'0.5px solid rgba(0,0,0,.07)', padding:'24px 52px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,.6)', backdropFilter:'blur(8px)', flexWrap:'wrap', gap:12 }}>
        <div style={{ fontFamily:D, fontSize:16, letterSpacing:'.1em', color:'#1a1a1a' }}>AURA <span style={{ fontFamily:S, fontSize:8, letterSpacing:'.18em', color:'rgba(0,0,0,.3)', verticalAlign:'middle', marginLeft:6 }}>BY PSC AGENT</span></div>
        <div style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.28)' }}>© 2025 R and G Enterprise Solutions. All rights reserved.</div>
        <div style={{ fontFamily:S, fontSize:10, color:'rgba(0,0,0,.28)', display:'flex', gap:20 }}>
          {['Privacy','Terms','Contact'].map(l => <span key={l} style={{ cursor:'pointer' }}>{l}</span>)}
        </div>
      </footer>
    </div>
  )
}

// ── SUBSCRIBER DASHBOARD ──────────────────────────────────────────────────
const SALES_CLIENTS = [
  { id:1, name:'Aaliyah James',    initials:'AJ', segment:'hot_lead',   label:'Hot Lead',      context:'Filled out enquiry form 6 days ago — no follow-up sent yet.',                              service:'Mega Volume Fullset',  source:'Website form',  priority:'high'   },
  { id:2, name:'Esther Bakare',    initials:'EB', segment:'hot_lead',   label:'Hot Lead',      context:"DM'd asking about fullset pricing 3 days ago. Saved your pinned post.",                    service:'Fullset consultation', source:'Instagram',     priority:'high'   },
  { id:3, name:'Fatima Al-Hassan', initials:'FA', segment:'gone_quiet', label:'Gone Quiet',    context:'Was actively in conversation about booking. Last message 9 days ago, no response since.',   service:'Mega Volume Fullset',  source:'WhatsApp',      priority:'high'   },
  { id:4, name:'Bianca Osei',      initials:'BO', segment:'gone_quiet', label:'Gone Quiet',    context:'Replied to your story asking about availability 11 days ago.',                              service:'Wispy Hybrid Set',     source:'Story reply',   priority:'high'   },
  { id:5, name:'Grace Nwosu',      initials:'GN', segment:'lapsed',     label:'Lapsed Client', context:'5-star reviewer. Used to book mega volume every 6 weeks. Last visit 5 months ago.',         service:'Mega Volume Infill',   source:'Regular client',priority:'medium' },
  { id:6, name:'Destiny Okonkwo',  initials:'DO', segment:'promo',      label:'Promo Target',  context:'Past client, 3 visits. Stopped booking around the time of your March price increase.',      service:'Volume Infill',        source:'Past client',   priority:'medium' },
]
const MOCK_CALLS = [
  { time:'9:14 AM',  caller:'Sophie M.', type:'inbound',  duration:'2m 18s', outcome:'Booked',      detail:'Mega volume — 14 Nov, 10:00 AM',      ok:true  },
  { time:'9:41 AM',  caller:'Unknown',   type:'inbound',  duration:'0m 52s', outcome:'FAQ',         detail:'Aftercare & parking questions',        ok:false },
  { time:'10:05 AM', caller:'Jade R.',   type:'inbound',  duration:'3m 04s', outcome:'Booked',      detail:'Classic infill — 16 Nov, 2:30 PM',    ok:true  },
  { time:'10:33 AM', caller:'Priya K.',  type:'inbound',  duration:'1m 41s', outcome:'Rescheduled', detail:'Moved 12 Nov → 19 Nov 11 AM',         ok:false },
  { time:'11:02 AM', caller:'Outbound',  type:'outbound', duration:'0m 38s', outcome:'Confirmed',   detail:'Reminder to Layla B. — tomorrow 10 AM',ok:true  },
  { time:'11:19 AM', caller:'Mia T.',    type:'inbound',  duration:'2m 55s', outcome:'Booked',      detail:'Wispy hybrid — 20 Nov, 3:00 PM',      ok:true  },
]

function SubscriberDashboard({ user, onLogout, setView }) {
  const [tab, setTab] = useState('today')
  const NAV = [
    { id:'today',    icon:'◈', label:'Today' },
    { id:'calls',    icon:'◉', label:'Call Log' },
    { id:'reminders',icon:'◎', label:'Reminders' },
    { id:'sales',    icon:'◆', label:'Sales Agent', badge:SALES_CLIENTS.length },
    { id:'settings', icon:'◇', label:'Settings' },
  ]
  return (
    <div style={{ fontFamily:SANS, background:'#f7f7f5', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <style>{`
        .si{transition:background .15s,color .15s;cursor:pointer;border-radius:8px}.si:hover{background:rgba(0,0,0,.05)!important}
        @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
        .loading{animation:shimmer 1.4s ease-in-out infinite}
        @keyframes slideMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .msg-in{animation:slideMsg .35s ease both}
        .hbtn:hover{background:#333!important}
      `}</style>

      {/* Topbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebeb', height:56, padding:'0 24px', display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={() => setView('landing')} style={{ background:'none', border:'none', fontFamily:DISPLAY, fontSize:20, cursor:'pointer', color:'#111', letterSpacing:'.08em' }}>AURA</button>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f2f2f2', borderRadius:100, padding:'5px 14px' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#111' }} />
          <span style={{ fontSize:11, color:'#333', fontWeight:500 }}>AURA Online</span>
        </div>
        <div style={{ fontSize:12, color:'#bbb' }}>{user?.email}</div>
        <button onClick={onLogout} style={{ background:'transparent', border:'1px solid #e0e0e0', color:'#888', padding:'6px 14px', borderRadius:6, fontSize:12, cursor:'pointer', fontFamily:SANS }}>Sign out</button>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Sidebar */}
        <div style={{ width:196, background:'#fff', borderRight:'1px solid #ebebeb', padding:'16px 10px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(n => (
            <div key={n.id} className="si" onClick={() => setTab(n.id)} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 12px', background:tab===n.id?'#000':'transparent', color:tab===n.id?'#fff':'#555' }}>
              <span style={{ fontSize:13 }}>{n.icon}</span>
              <span style={{ fontSize:13, fontWeight:tab===n.id?500:400 }}>{n.label}</span>
              {n.badge && <span style={{ marginLeft:'auto', background:tab===n.id?'rgba(255,255,255,.2)':'#111', color:'#fff', fontSize:10, fontWeight:600, padding:'1px 7px', borderRadius:100 }}>{n.badge}</span>}
            </div>
          ))}
          <div style={{ flex:1 }} />
          <div style={{ padding:'8px 12px', fontSize:10, color:'#bbb', letterSpacing:'.1em', textTransform:'uppercase' }}>Studio Plan</div>
          <div style={{ padding:'2px 12px 12px', fontSize:11, color:'#888', fontWeight:500 }}>✓ Active</div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:'auto', padding:28 }}>
          {tab==='today'     && <TodayTab />}
          {tab==='calls'     && <CallsTab />}
          {tab==='reminders' && <RemindersTab />}
          {tab==='sales'     && <SalesTab />}
          {tab==='settings'  && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function TodayTab() {
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Good morning</h1>
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:24 }}>AURA has handled 8 calls today</div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20 }}>
        {[{v:'8',l:'Calls today'},{v:'5',l:'Bookings made'},{v:'3',l:'Reminders sent'},{v:'6',l:'Sales queue'}].map(s=>(
          <div key={s.l} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'16px 18px' }}>
            <div style={{ fontFamily:DISPLAY,fontSize:32,fontWeight:400,color:'#111',marginBottom:4 }}>{s.v}</div>
            <div style={{ fontFamily:SANS,fontSize:12,color:'#aaa' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid #f0f0f0',fontFamily:SANS,fontSize:13,fontWeight:600,color:'#111' }}>Today's Calls</div>
        {MOCK_CALLS.map((c,i)=>(
          <div key={i} style={{ display:'flex',gap:12,alignItems:'center',padding:'13px 20px',borderBottom:i<MOCK_CALLS.length-1?'1px solid #f5f5f5':'none',background:i%2===0?'#fff':'#fafafa',fontFamily:SANS }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:c.ok?'#222':'#ddd',flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500,color:'#111' }}>{c.caller} <span style={{ fontSize:11,color:'#ccc',fontWeight:400 }}>· {c.time}</span></div>
              <div style={{ fontSize:11,color:'#bbb' }}>{c.detail}</div>
            </div>
            <span style={{ fontSize:11,background:c.ok?'#f0f0f0':'#f8f8f8',color:c.ok?'#444':'#bbb',padding:'3px 10px',borderRadius:100,fontWeight:500 }}>{c.outcome}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CallsTab() {
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Call Log</h1>
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:20 }}>All calls handled by AURA</div>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden' }}>
        <div style={{ display:'grid',gridTemplateColumns:'80px 140px 100px 80px 100px 1fr',padding:'10px 20px',background:'#f7f7f5',fontFamily:SANS,fontSize:10,fontWeight:600,color:'#bbb',letterSpacing:'.1em',textTransform:'uppercase' }}>
          {['Time','Caller','Type','Duration','Outcome','Detail'].map(h=><div key={h}>{h}</div>)}
        </div>
        {MOCK_CALLS.map((c,i)=>(
          <div key={i} style={{ display:'grid',gridTemplateColumns:'80px 140px 100px 80px 100px 1fr',padding:'13px 20px',borderTop:'1px solid #f0f0f0',background:i%2===0?'#fff':'#fafafa',alignItems:'center',fontFamily:SANS }}>
            <div style={{ fontSize:12,color:'#bbb' }}>{c.time}</div>
            <div style={{ fontSize:13,fontWeight:500,color:'#111' }}>{c.caller}</div>
            <span style={{ fontSize:10,background:c.type==='inbound'?'#111':'#f0f0f0',color:c.type==='inbound'?'#fff':'#888',padding:'3px 9px',borderRadius:100,display:'inline-block' }}>{c.type}</span>
            <div style={{ fontSize:12,color:'#bbb' }}>{c.duration}</div>
            <span style={{ fontSize:11,background:c.ok?'#f0f0f0':'#f8f8f8',color:c.ok?'#444':'#bbb',padding:'3px 9px',borderRadius:100,fontWeight:500,display:'inline-block' }}>{c.outcome}</span>
            <div style={{ fontSize:12,color:'#aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RemindersTab() {
  const reminders = [
    {name:'Layla B.',  appt:'Tomorrow, 10:00 AM', svc:'Mega Volume Fullset', st:'Sent',        ok:true  },
    {name:'Chloe W.',  appt:'Tomorrow, 1:30 PM',  svc:'Classic Infill',      st:'Retry queued',ok:false },
    {name:'Nia O.',    appt:'Tomorrow, 3:00 PM',  svc:'Brow Lamination',     st:'Scheduled',   ok:null  },
    {name:'Fatima A.', appt:'Wednesday, 11:00 AM',svc:'Wispy Hybrid',        st:'Scheduled',   ok:null  },
  ]
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Reminders</h1>
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:20 }}>AURA calls every client before their appointment.</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20 }}>
        {[{v:'14',l:'This week'},{v:'11',l:'Confirmed'},{v:'2',l:'No-shows prevented'}].map(s=>(
          <div key={s.l} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'16px 20px' }}>
            <div style={{ fontFamily:DISPLAY,fontSize:32,fontWeight:400,color:'#111' }}>{s.v}</div>
            <div style={{ fontFamily:SANS,fontSize:12,color:'#aaa',marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden' }}>
        {reminders.map((r,i)=>(
          <div key={i} style={{ display:'flex',gap:14,alignItems:'center',padding:'14px 20px',borderBottom:i<reminders.length-1?'1px solid #f5f5f5':'none',fontFamily:SANS }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,color:'#999',fontSize:12,flexShrink:0 }}>{r.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500,color:'#111' }}>{r.name}</div>
              <div style={{ fontSize:12,color:'#bbb' }}>{r.svc} · {r.appt}</div>
            </div>
            <span style={{ fontSize:11,background:r.ok===true?'#f0f0f0':r.ok===false?'#fff8f0':'#f8f8f8',color:r.ok===true?'#444':r.ok===false?'#999':'#bbb',padding:'3px 10px',borderRadius:100,fontWeight:500 }}>{r.st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SalesTab() {
  const [segment,  setSegment]  = useState('all')
  const [drafts,   setDrafts]   = useState({})
  const [loading,  setLoading]  = useState({})
  const [sent,     setSent]     = useState({})
  const [skipped,  setSkipped]  = useState({})
  const [expanded, setExpanded] = useState(null)

  const segs = [
    {id:'all',        label:'All',           count:SALES_CLIENTS.length},
    {id:'hot_lead',   label:'Hot Leads',     count:SALES_CLIENTS.filter(c=>c.segment==='hot_lead').length},
    {id:'gone_quiet', label:'Gone Quiet',    count:SALES_CLIENTS.filter(c=>c.segment==='gone_quiet').length},
    {id:'lapsed',     label:'Lapsed',        count:SALES_CLIENTS.filter(c=>c.segment==='lapsed').length},
    {id:'promo',      label:'Promo Targets', count:SALES_CLIENTS.filter(c=>c.segment==='promo').length},
  ]
  const segColor = s => ({hot_lead:'#111',gone_quiet:'#444',lapsed:'#666',promo:'#888'}[s]||'#999')
  const filtered = SALES_CLIENTS.filter(c=>(segment==='all'||c.segment===segment)&&!skipped[c.id])

  const draftMessage = async (client) => {
    setLoading(l=>({...l,[client.id]:true}))
    setExpanded(client.id)
    try {
      const res = await fetch('/api/draft', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientName:client.name, context:client.context, service:client.service, source:client.source, segment:client.label, studioName:'Glow Studio', ownerName:'Rachel' })
      })
      const data = await res.json()
      setDrafts(d=>({...d,[client.id]:data.message||'Could not generate — try again.'}))
    } catch {
      setDrafts(d=>({...d,[client.id]:'Connection error. Try again.'}))
    }
    setLoading(l=>({...l,[client.id]:false}))
  }

  return (
    <div>
      <div style={{ marginBottom:24, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Sales Agent</h1>
          <p style={{ fontFamily:SANS,fontSize:13,color:'#999' }}>AURA identifies who to re-engage and drafts the message for you.</p>
        </div>
        <div style={{ display:'flex',gap:10 }}>
          {[{val:Object.values(sent).filter(Boolean).length,label:'Sent'},{val:filtered.length,label:'Queue'}].map(s=>(
            <div key={s.label} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'10px 16px',textAlign:'center',minWidth:64 }}>
              <div style={{ fontFamily:DISPLAY,fontSize:22,color:'#111' }}>{s.val}</div>
              <div style={{ fontFamily:SANS,fontSize:10,color:'#aaa' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'170px 1fr',gap:16 }}>
        <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:12,height:'fit-content' }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.14em',color:'#bbb',textTransform:'uppercase',padding:'4px 8px 10px' }}>Segments</div>
          {segs.map(s=>(
            <button key={s.id} className="si" onClick={()=>setSegment(s.id)} style={{ width:'100%',background:segment===s.id?'#000':'transparent',color:segment===s.id?'#fff':'#555',border:'none',padding:'9px 10px',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:SANS,fontSize:13,fontWeight:segment===s.id?500:400,marginBottom:2 }}>
              {s.label}
              <span style={{ fontSize:11,background:segment===s.id?'rgba(255,255,255,.2)':'#f0f0f0',color:segment===s.id?'#fff':'#888',padding:'1px 7px',borderRadius:100,fontWeight:600 }}>{s.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {filtered.length===0 && <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:40,textAlign:'center',fontFamily:SANS,fontSize:14,color:'#bbb' }}>All clients in this segment handled.</div>}
          {filtered.map(client=>(
            <div key={client.id} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden',opacity:sent[client.id]?.75:1,transition:'opacity .3s' }}>
              <div style={{ padding:'16px 20px',display:'flex',alignItems:'center',gap:14 }}>
                <div style={{ width:40,height:40,borderRadius:'50%',background:sent[client.id]?'#f0f0f0':'#111',display:'flex',alignItems:'center',justifyContent:'center',color:sent[client.id]?'#aaa':'#fff',fontFamily:SANS,fontSize:12,fontWeight:600,flexShrink:0 }}>
                  {sent[client.id]?'✓':client.initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:3 }}>
                    <span style={{ fontFamily:SANS,fontSize:14,fontWeight:600,color:sent[client.id]?'#aaa':'#111' }}>{client.name}</span>
                    <span style={{ fontFamily:SANS,fontSize:10,background:segColor(client.segment),color:'#fff',padding:'2px 9px',borderRadius:100,fontWeight:500,textTransform:'uppercase',letterSpacing:'.06em' }}>{client.label}</span>
                    {sent[client.id] && <span style={{ fontFamily:SANS,fontSize:11,color:'#bbb' }}>Sent</span>}
                  </div>
                  <div style={{ fontFamily:SANS,fontSize:12,color:'#999',lineHeight:1.6 }}>{client.context}</div>
                  <div style={{ fontFamily:SANS,fontSize:11,color:'#c0c0c0',marginTop:3 }}>Interested in: <span style={{ color:'#999' }}>{client.service}</span> · {client.source}</div>
                </div>
                {!sent[client.id] && (
                  <div style={{ display:'flex',gap:8,flexShrink:0 }}>
                    <button className="hbtn" onClick={()=>draftMessage(client)} style={{ background:'#111',color:'#fff',border:'none',padding:'9px 16px',borderRadius:7,fontSize:12,cursor:'pointer',fontFamily:SANS,fontWeight:500,whiteSpace:'nowrap',transition:'background .15s' }}>
                      {loading[client.id]?'Drafting…':drafts[client.id]?'Re-draft':'Draft Message'}
                    </button>
                    <button onClick={()=>setSkipped(s=>({...s,[client.id]:true}))} style={{ background:'transparent',color:'#ccc',border:'1px solid #eee',padding:'9px 14px',borderRadius:7,fontSize:12,cursor:'pointer',fontFamily:SANS }}>Skip</button>
                  </div>
                )}
              </div>
              {expanded===client.id && (loading[client.id]||drafts[client.id]) && !sent[client.id] && (
                <div style={{ borderTop:'1px solid #f0f0f0',padding:'16px 20px 20px',background:'#fafafa' }}>
                  <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.14em',color:'#bbb',textTransform:'uppercase',marginBottom:10 }}>Drafted Outreach · WhatsApp / SMS</div>
                  {loading[client.id] ? (
                    <div className="loading" style={{ fontFamily:SANS,fontSize:14,color:'#ccc',background:'#f0f0f0',borderRadius:8,padding:'14px 16px',lineHeight:1.8 }}>Writing a personalised message for {client.name.split(' ')[0]}…</div>
                  ) : (
                    <div className="msg-in">
                      <textarea value={drafts[client.id]} onChange={e=>setDrafts(d=>({...d,[client.id]:e.target.value}))} style={{ width:'100%',border:'1px solid #e0e0e0',borderRadius:8,padding:'14px 16px',fontSize:14,color:'#333',lineHeight:1.75,resize:'vertical',minHeight:80,fontFamily:SANS,background:'#fff',boxSizing:'border-box',outline:'none' }} />
                      <div style={{ display:'flex',gap:10,marginTop:12,alignItems:'center' }}>
                        <button className="hbtn" onClick={()=>{setSent(s=>({...s,[client.id]:true}));setExpanded(null)}} style={{ background:'#111',color:'#fff',border:'none',padding:'10px 22px',borderRadius:7,fontSize:13,cursor:'pointer',fontFamily:SANS,fontWeight:500,transition:'background .15s' }}>Approve & Send</button>
                        <button onClick={()=>draftMessage(client)} style={{ background:'transparent',color:'#999',border:'1px solid #e0e0e0',padding:'10px 18px',borderRadius:7,fontSize:13,cursor:'pointer',fontFamily:SANS }}>Regenerate</button>
                        <button onClick={()=>setExpanded(null)} style={{ background:'transparent',color:'#ccc',border:'none',fontSize:13,cursor:'pointer',fontFamily:SANS }}>Collapse</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:20 }}>Settings</h1>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:28,maxWidth:520 }}>
        {[{l:'Agent Name',v:'AURA'},{l:'Business Name',v:''},{l:'Booking Link',v:''}].map(f=>(
          <div key={f.l} style={{ marginBottom:18 }}>
            <label style={{ display:'block',fontFamily:SANS,fontSize:11,color:'#bbb',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>{f.l}</label>
            <input defaultValue={f.v} placeholder={f.l} style={{ width:'100%',border:'1px solid #e8e8e8',borderRadius:7,padding:'10px 12px',fontSize:14,color:'#333',boxSizing:'border-box',outline:'none',fontFamily:SANS }} />
          </div>
        ))}
        <div style={{ marginBottom:22 }}>
          <label style={{ display:'block',fontFamily:SANS,fontSize:11,color:'#bbb',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>Greeting Script</label>
          <textarea defaultValue="Hi, you've reached the studio! I'm AURA. I can book appointments, answer questions, or connect you with the team." style={{ width:'100%',border:'1px solid #e8e8e8',borderRadius:7,padding:'10px 12px',fontSize:14,color:'#333',resize:'vertical',minHeight:80,boxSizing:'border-box',fontFamily:SANS,outline:'none' }} />
        </div>
        <button style={{ background:'#111',color:'#fff',border:'none',padding:'11px 26px',borderRadius:7,fontSize:14,cursor:'pointer',fontFamily:SANS,fontWeight:500 }}>Save Changes</button>
      </div>
    </div>
  )
}
