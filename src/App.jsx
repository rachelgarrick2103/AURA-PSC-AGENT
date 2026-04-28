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
  const [topRow, setTopRow] = useState({ color:'#1a1a1a', ch:'Call', msg:'Sophie M. — Mega Volume booked', time:'now' })
  const [fade, setFade] = useState(true)
  const [spotsLeft] = useState(14)

  const liveMessages = [
    { color:'#1a1a1a', ch:'Call',      msg:'Sophie M. — Mega Volume booked',   time:'now' },
    { color:'#22c55e', ch:'WhatsApp',  msg:'Jade R. — infill pricing enquiry',  time:'2m'  },
    { color:'#d946ef', ch:'Instagram', msg:'New enquiry — fullset consultation', time:'5m'  },
    { color:'#3b82f6', ch:'SMS',       msg:'Reminder sent — Layla B. tomorrow', time:'12m' },
    { color:'#f97316', ch:'Email',     msg:'Priya K. — rescheduled to Nov 19',  time:'18m' },
    { color:'#22c55e', ch:'WhatsApp',  msg:'Mia T. — booking wispy hybrid set', time:'now' },
    { color:'#1a1a1a', ch:'Call',      msg:'Aisha B. — classic infill booked',  time:'now' },
    { color:'#d946ef', ch:'Instagram', msg:'DM — brow lamination enquiry',       time:'3m'  },
  ]

  useEffect(() => {
    let idx = 1
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => { setTopRow(liveMessages[idx % liveMessages.length]); setFade(true); idx++ }, 220)
    }, 2600)
    return () => clearInterval(t)
  }, [])

  const staticRows = [
    { color:'#22c55e', ch:'WhatsApp',  msg:'Jade R. — infill pricing enquiry',  time:'2m'  },
    { color:'#d946ef', ch:'Instagram', msg:'New enquiry — fullset',              time:'5m'  },
    { color:'#3b82f6', ch:'SMS',       msg:'Reminder sent — Layla B.',           time:'12m' },
    { color:'#f97316', ch:'Email',     msg:'Priya K. — rescheduled',            time:'18m' },
  ]

  const comparison = [
    { label:'Monthly cost',                 human:'£1,500 – £2,500',  aura:'£149' },
    { label:'Available hours',              human:'9–5, Mon–Fri',      aura:'24 / 7 / 365' },
    { label:'Sick days',                    human:'Up to 8 per year',  aura:'Zero. Ever.' },
    { label:'Answers calls mid-appointment',human:'No',                aura:'Always' },
    { label:'Replies to WhatsApp at midnight',human:'No',              aura:'Instantly' },
    { label:'Follows up cold leads',        human:'Inconsistently',    aura:'Every single one' },
    { label:'Sends reminders automatically',human:'Needs reminding',   aura:'Never misses' },
    { label:'Re-engages lapsed clients',    human:'Rarely',            aura:'Built in' },
    { label:'Handles Instagram DMs',        human:'Maybe',             aura:'Every time' },
    { label:'Bad days',                     human:'Yes',               aura:'No' },
    { label:'Notice period',                human:'4 weeks minimum',   aura:'Cancel anytime' },
    { label:'Double bookings',              human:'Human error',        aura:'Never' },
    { label:'Training time',               human:'Weeks',              aura:'24 hours' },
  ]

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
        @keyframes countBlink{0%,100%{opacity:1}50%{opacity:.6}}
        .fu{animation:fadeUp .7s ease both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
        .b1{animation:a1 8s ease-in-out infinite}
        .b2{animation:a2 10s ease-in-out infinite}
        .b3{animation:a3 7s ease-in-out infinite}
        .b4{animation:a4 9s ease-in-out infinite}
        .b5{animation:a5 11s ease-in-out infinite}
        .fcard{animation:fadeUp .8s .3s ease both,floatY 5s 1s ease-in-out infinite}
        .pdot{animation:pulse 2s ease-in-out infinite}
        .tkr{animation:ticker 14s linear infinite}
        .cmp-row:hover{background:rgba(255,255,255,.7)!important}
        .cmp-row{transition:background .2s}
        .spots{animation:countBlink 3s ease-in-out infinite}
        .btn-main:hover{background:#333!important}
        .btn-ghost:hover{background:rgba(255,255,255,.9)!important}
        .nav-cta:hover{background:#333!important}
        .nav-gh:hover{background:rgba(255,255,255,.85)!important}
      `}</style>

      {/* Grain */}
      <div style={{ position:'fixed',inset:0,zIndex:3,pointerEvents:'none',opacity:.55,backgroundImage:grain,backgroundRepeat:'repeat',backgroundSize:'200px' }} />

      {/* Gradient blobs */}
      <div style={{ position:'fixed',top:0,left:0,width:'100%',height:'100vh',pointerEvents:'none',zIndex:1,overflow:'hidden' }}>
        <div className="b1" style={{ position:'absolute',width:580,height:580,background:'radial-gradient(circle,#f03e00 0%,#ff5500 35%,#ff8c00 60%,transparent 75%)',filter:'blur(75px)',opacity:.75,top:-160,left:-100,borderRadius:'50%' }} />
        <div className="b2" style={{ position:'absolute',width:520,height:520,background:'radial-gradient(circle,#6600cc 0%,#8b00ff 35%,#a855f7 60%,transparent 75%)',filter:'blur(80px)',opacity:.7,top:-120,right:-80,borderRadius:'50%' }} />
        <div className="b3" style={{ position:'absolute',width:440,height:440,background:'radial-gradient(circle,#0044cc 0%,#2563eb 35%,#60a5fa 60%,transparent 75%)',filter:'blur(78px)',opacity:.65,top:220,right:40,borderRadius:'50%' }} />
        <div className="b4" style={{ position:'absolute',width:360,height:360,background:'radial-gradient(circle,#cc0066 0%,#ec4899 40%,#f472b6 60%,transparent 75%)',filter:'blur(72px)',opacity:.6,top:260,left:80,borderRadius:'50%' }} />
        <div className="b5" style={{ position:'absolute',width:300,height:300,background:'radial-gradient(circle,#d97706 0%,#f59e0b 40%,transparent 70%)',filter:'blur(70px)',opacity:.55,top:80,left:240,borderRadius:'50%' }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'relative',zIndex:10,display:'flex',alignItems:'center',padding:'22px 52px',background:'transparent' }}>
        <div style={{ fontFamily:D,fontSize:20,letterSpacing:'.12em',color:'#1a1a1a',flex:1 }}>
          AURA <span style={{ fontFamily:S,fontSize:8,letterSpacing:'.2em',color:'rgba(0,0,0,.35)',verticalAlign:'middle',marginLeft:8 }}>BY PSC AGENT</span>
        </div>
        <button className="nav-gh" onClick={() => setView('login')} style={{ fontFamily:S,fontSize:11,letterSpacing:'.05em',color:'rgba(0,0,0,.55)',background:'rgba(255,255,255,.62)',border:'0.5px solid rgba(0,0,0,.12)',borderRadius:100,padding:'8px 18px',marginRight:8,cursor:'pointer',backdropFilter:'blur(12px)',transition:'background .2s' }}>Client Login</button>
        <button className="nav-cta" onClick={() => setView('login')} style={{ fontFamily:S,fontSize:11,fontWeight:500,letterSpacing:'.08em',background:'#1a1a1a',color:'#fff',border:'none',padding:'9px 22px',borderRadius:100,cursor:'pointer',transition:'background .2s' }}>Start Free Trial</button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'32px 52px 72px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:52,alignItems:'center',minHeight:'90vh' }}>
        <div>
          <div className="fu" style={{ fontFamily:S,fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(0,0,0,.42)',marginBottom:20,display:'flex',alignItems:'center',gap:8 }}>
            <span style={{ width:5,height:5,borderRadius:'50%',background:'#f03e00',display:'inline-block' }} />
            AI Receptionist for Beauty Businesses
          </div>
          <h1 className="fu d1" style={{ fontSize:72,lineHeight:.95,fontWeight:400,letterSpacing:'-.022em',marginBottom:20 }}>
            Your clients call.<br />
            <em style={{ fontStyle:'italic',WebkitTextStroke:'1.5px #1a1a1a',color:'transparent' }}>AURA answers.</em>
          </h1>
          <p className="fu d2" style={{ fontFamily:S,fontSize:15,color:'rgba(0,0,0,.55)',lineHeight:1.8,maxWidth:400,marginBottom:16 }}>
            Your AI receptionist and assistant. Always on. Never sick.
          </p>
          <p className="fu d2" style={{ fontFamily:S,fontSize:14,color:'rgba(0,0,0,.45)',lineHeight:1.8,maxWidth:400,marginBottom:32 }}>
            AURA handles your calls, WhatsApp, Instagram DMs, SMS and email — so every client gets a reply, on every channel, 24/7.
          </p>
          <div className="fu d3" style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:32 }}>
            {['Phone Calls','WhatsApp','Instagram DMs','SMS','Email'].map(c => (
              <span key={c} style={{ fontFamily:S,fontSize:10,letterSpacing:'.04em',color:'rgba(0,0,0,.6)',background:'rgba(255,255,255,.75)',border:'0.5px solid rgba(0,0,0,.12)',borderRadius:100,padding:'5px 12px',backdropFilter:'blur(10px)' }}>{c}</span>
            ))}
          </div>
          <div className="fu d4" style={{ display:'flex',gap:12,marginBottom:16 }}>
            <button className="btn-main" onClick={() => setView('login')} style={{ fontFamily:S,fontSize:13,fontWeight:500,letterSpacing:'.07em',background:'#1a1a1a',color:'#fff',border:'none',padding:'14px 30px',borderRadius:100,cursor:'pointer',transition:'background .2s' }}>Join the Beta — £149/month</button>
            <button className="btn-ghost" onClick={() => setView('login')} style={{ fontFamily:S,fontSize:13,letterSpacing:'.05em',color:'rgba(0,0,0,.6)',background:'rgba(255,255,255,.65)',border:'0.5px solid rgba(0,0,0,.15)',padding:'14px 20px',borderRadius:100,cursor:'pointer',backdropFilter:'blur(10px)',transition:'background .2s' }}>Client Login →</button>
          </div>
          <div className="fu d4 spots" style={{ fontFamily:S,fontSize:11,color:'rgba(0,0,0,.45)',letterSpacing:'.04em' }}>
            <span style={{ color:'#f03e00',fontWeight:500 }}>{spotsLeft} beta spots remaining.</span> Price goes up at launch.
          </div>
        </div>

        {/* Live card */}
        <div className="fcard" style={{ background:'rgba(255,255,255,.85)',backdropFilter:'blur(28px)',border:'0.5px solid rgba(255,255,255,.95)',borderRadius:20,overflow:'hidden' }}>
          <div style={{ padding:'16px 20px',borderBottom:'0.5px solid rgba(0,0,0,.06)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:D,fontSize:16,color:'#1a1a1a' }}>AURA is active</div>
              <div style={{ fontFamily:S,fontSize:9,color:'rgba(0,0,0,.35)',marginTop:2 }}>Monitoring all 5 channels</div>
            </div>
            <div className="pdot" style={{ width:8,height:8,borderRadius:'50%',background:'#22c55e' }} />
          </div>

          {/* Animated top row */}
          <div style={{ padding:'10px 20px',borderBottom:'0.5px solid rgba(0,0,0,.04)',display:'grid',gridTemplateColumns:'8px 1fr auto',gap:10,alignItems:'center',opacity:fade?1:0,transform:fade?'translateY(0)':'translateY(-6px)',transition:'opacity .3s ease,transform .3s ease' }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:topRow.color }} />
            <div>
              <div style={{ fontFamily:S,fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(0,0,0,.3)',marginBottom:2 }}>{topRow.ch}</div>
              <div style={{ fontFamily:S,fontSize:11,color:'#1a1a1a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{topRow.msg}</div>
            </div>
            <div style={{ fontFamily:S,fontSize:9,color:'rgba(0,0,0,.28)' }}>{topRow.time}</div>
          </div>

          {staticRows.map((r,i) => (
            <div key={i} style={{ padding:'10px 20px',borderBottom:i<3?'0.5px solid rgba(0,0,0,.04)':'none',display:'grid',gridTemplateColumns:'8px 1fr auto',gap:10,alignItems:'center' }}>
              <div style={{ width:7,height:7,borderRadius:'50%',background:r.color }} />
              <div>
                <div style={{ fontFamily:S,fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(0,0,0,.3)',marginBottom:2 }}>{r.ch}</div>
                <div style={{ fontFamily:S,fontSize:11,color:'#1a1a1a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{r.msg}</div>
              </div>
              <div style={{ fontFamily:S,fontSize:9,color:'rgba(0,0,0,.28)' }}>{r.time}</div>
            </div>
          ))}

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:'rgba(0,0,0,.02)' }}>
            {[{n:'8',l:'Handled today'},{n:'5',l:'Booked today'},{n:'0',l:'Missed'}].map((s,i) => (
              <div key={i} style={{ padding:'14px 8px',textAlign:'center',borderRight:i<2?'0.5px solid rgba(0,0,0,.05)':'none' }}>
                <div style={{ fontFamily:D,fontSize:24,color:'#1a1a1a' }}>{s.n}</div>
                <div style={{ fontFamily:S,fontSize:8,color:'rgba(0,0,0,.32)',letterSpacing:'.06em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ position:'relative',zIndex:10,borderTop:'0.5px solid rgba(0,0,0,.07)',borderBottom:'0.5px solid rgba(0,0,0,.07)',padding:'10px 0',overflow:'hidden',background:'rgba(255,255,255,.5)',backdropFilter:'blur(8px)' }}>
        <div className="tkr" style={{ display:'flex',width:'max-content' }}>
          {['Phone Calls','—','WhatsApp','—','Instagram DMs','—','SMS','—','Email','—','Phone Calls','—','WhatsApp','—','Instagram DMs','—','SMS','—','Email','—'].map((t,i) => (
            <span key={i} style={{ fontFamily:S,fontSize:9,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(0,0,0,.38)',padding:'0 22px',whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ═══ PROBLEM SECTION ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'80px 52px',background:'rgba(255,255,255,.4)',backdropFilter:'blur(12px)',borderBottom:'0.5px solid rgba(0,0,0,.07)' }}>
        <div style={{ maxWidth:720,margin:'0 auto',textAlign:'center' }}>
          <div style={{ fontFamily:S,fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,0,0,.32)',marginBottom:20 }}>The Problem</div>
          <h2 style={{ fontFamily:D,fontSize:52,fontWeight:400,lineHeight:1.08,letterSpacing:'-.015em',marginBottom:32,color:'#1a1a1a' }}>
            You are losing money<br />
            <em style={{ fontStyle:'italic',WebkitTextStroke:'1px #1a1a1a',color:'transparent' }}>every single day.</em>
          </h2>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,background:'rgba(0,0,0,.06)',borderRadius:16,overflow:'hidden',marginBottom:48 }}>
            {[
              { stat:'Every missed call',   impact:'is a booking that went to someone else.' },
              { stat:'Every unanswered DM', impact:'is a client who found another studio.' },
              { stat:'Every forgotten reminder', impact:'is a no-show you didn\'t get paid for.' },
            ].map((p,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.88)',padding:'32px 24px',textAlign:'center' }}>
                <div style={{ fontFamily:D,fontSize:20,color:'#1a1a1a',marginBottom:10 }}>{p.stat}</div>
                <div style={{ fontFamily:S,fontSize:13,color:'rgba(0,0,0,.45)',lineHeight:1.7 }}>{p.impact}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:S,fontSize:15,color:'rgba(0,0,0,.5)',lineHeight:1.85,marginBottom:20,maxWidth:560,margin:'0 auto 20px' }}>
            You built this business with your hands. You cannot also be the receptionist, the assistant, the follow-up machine and the person behind the chair — all at once.
          </p>
          <p style={{ fontFamily:S,fontSize:15,color:'rgba(0,0,0,.5)',lineHeight:1.85,marginBottom:32 }}>
            Something has to give. And right now, it's revenue.
          </p>
          <div style={{ fontFamily:D,fontSize:28,color:'#1a1a1a',fontStyle:'italic',letterSpacing:'-.01em' }}>
            AURA fixes this. Completely.
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'80px 52px',borderBottom:'0.5px solid rgba(0,0,0,.07)',background:'rgba(255,255,255,.35)',backdropFilter:'blur(10px)' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <div style={{ fontFamily:S,fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,0,0,.32)',marginBottom:20 }}>The Comparison</div>
          <h2 style={{ fontFamily:D,fontSize:52,fontWeight:400,lineHeight:1.08,letterSpacing:'-.015em',marginBottom:48 }}>
            What you're paying<br />
            <em style={{ fontStyle:'italic',WebkitTextStroke:'1px #1a1a1a',color:'transparent' }}>for silence.</em>
          </h2>

          {/* Table */}
          <div style={{ border:'0.5px solid rgba(0,0,0,.08)',borderRadius:16,overflow:'hidden' }}>
            {/* Header */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:'rgba(0,0,0,.03)',padding:'14px 24px',gap:0 }}>
              <div style={{ fontFamily:S,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(0,0,0,.32)' }}></div>
              <div style={{ fontFamily:S,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(0,0,0,.32)',textAlign:'center' }}>Human Receptionist</div>
              <div style={{ fontFamily:S,fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',color:'#1a1a1a',textAlign:'center',fontWeight:500 }}>AURA</div>
            </div>

            {comparison.map((row,i) => (
              <div key={i} className="cmp-row" style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'14px 24px',borderTop:'0.5px solid rgba(0,0,0,.06)',background:i%2===0?'rgba(255,255,255,.75)':'rgba(255,255,255,.55)',alignItems:'center',gap:0 }}>
                <div style={{ fontFamily:S,fontSize:12,color:'rgba(0,0,0,.55)' }}>{row.label}</div>
                <div style={{ fontFamily:S,fontSize:13,color:'rgba(0,0,0,.4)',textAlign:'center' }}>{row.human}</div>
                <div style={{ fontFamily:S,fontSize:13,color:'#1a1a1a',textAlign:'center',fontWeight:500 }}>{row.aura}</div>
              </div>
            ))}

            {/* Price highlight row */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'20px 24px',borderTop:'1px solid rgba(0,0,0,.1)',background:'#1a1a1a',alignItems:'center' }}>
              <div style={{ fontFamily:S,fontSize:12,color:'rgba(255,255,255,.6)' }}>Monthly cost</div>
              <div style={{ fontFamily:D,fontSize:28,color:'rgba(255,255,255,.4)',textAlign:'center' }}>£1,500+</div>
              <div style={{ fontFamily:D,fontSize:36,color:'#fff',textAlign:'center' }}>£149</div>
            </div>
          </div>

          {/* Below table statement */}
          <div style={{ marginTop:40,textAlign:'center' }}>
            <p style={{ fontFamily:D,fontSize:26,color:'#1a1a1a',lineHeight:1.4,marginBottom:8 }}>
              A part-time receptionist costs over £1,500 a month.
            </p>
            <p style={{ fontFamily:D,fontSize:26,color:'#1a1a1a',lineHeight:1.4,marginBottom:8,fontStyle:'italic' }}>
              AURA costs £149.
            </p>
            <p style={{ fontFamily:S,fontSize:14,color:'rgba(0,0,0,.45)',marginTop:12,letterSpacing:'.04em' }}>
              Same job. Every channel. Every hour.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ position:'relative',zIndex:10,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderBottom:'0.5px solid rgba(0,0,0,.07)',background:'rgba(255,255,255,.45)',backdropFilter:'blur(8px)' }}>
        {[
          { val:'£1,500+', lbl:'What a receptionist costs per month' },
          { val:'24 / 7',  lbl:'Hours AURA works vs 9–5 for a human' },
          { val:'£149',    lbl:'AURA. All in. Every channel.' },
        ].map((s,i) => (
          <div key={i} style={{ padding:'44px 28px',textAlign:'center',borderRight:i<2?'0.5px solid rgba(0,0,0,.07)':'none' }}>
            <div style={{ fontFamily:D,fontSize:52,color:'#1a1a1a',lineHeight:1,marginBottom:12 }}>{s.val}</div>
            <div style={{ fontFamily:S,fontSize:12,color:'rgba(0,0,0,.38)',lineHeight:1.6,maxWidth:160,margin:'0 auto' }}>{s.lbl}</div>
          </div>
        ))}
      </section>

      {/* ═══ CHANNELS ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'72px 52px',borderBottom:'0.5px solid rgba(0,0,0,.07)',background:'rgba(255,255,255,.4)',backdropFilter:'blur(14px)' }}>
        <div style={{ fontFamily:S,fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,0,0,.32)',marginBottom:28 }}>Every Channel. One Agent.</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:1,background:'rgba(0,0,0,.06)',border:'0.5px solid rgba(0,0,0,.06)',borderRadius:16,overflow:'hidden' }}>
          {[
            { n:'01', name:'Phone Calls',   desc:'Answers every call, books appointments and handles FAQs live.' },
            { n:'02', name:'WhatsApp',       desc:'Clients message your number. AURA replies and books instantly.' },
            { n:'03', name:'SMS',            desc:'Automated reminders with two-way reply handling.' },
            { n:'04', name:'Instagram DMs',  desc:'Every inbox enquiry gets an instant, intelligent response.' },
            { n:'05', name:'Email',          desc:'Professional replies to every email. Zero backlog.' },
          ].map(c => (
            <div key={c.n} style={{ background:'rgba(255,255,255,.9)',padding:'24px 18px' }}>
              <div style={{ fontSize:32,color:'rgba(0,0,0,.05)',marginBottom:8,lineHeight:1 }}>{c.n}</div>
              <div style={{ fontFamily:D,fontSize:16,color:'#1a1a1a',marginBottom:6 }}>{c.name}</div>
              <div style={{ fontFamily:S,fontSize:10,color:'rgba(0,0,0,.38)',lineHeight:1.65 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'80px 52px',borderBottom:'0.5px solid rgba(0,0,0,.07)',background:'rgba(255,255,255,.35)',backdropFilter:'blur(8px)' }}>
        <div style={{ maxWidth:560,margin:'0 auto',textAlign:'center' }}>
          <div style={{ fontFamily:S,fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,0,0,.32)',marginBottom:20 }}>Pricing</div>
          <h2 style={{ fontFamily:D,fontSize:52,fontWeight:400,lineHeight:1.08,letterSpacing:'-.015em',marginBottom:16 }}>
            One price.<br /><em style={{ fontStyle:'italic',WebkitTextStroke:'1px #1a1a1a',color:'transparent' }}>No surprises.</em>
          </h2>

          <div style={{ background:'rgba(255,255,255,.88)',border:'1px solid rgba(0,0,0,.1)',borderRadius:20,padding:'44px 40px',marginBottom:24,backdropFilter:'blur(16px)' }}>
            <div style={{ fontFamily:S,fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(0,0,0,.35)',marginBottom:12 }}>Beta Access</div>
            <div style={{ fontFamily:D,fontSize:80,color:'#1a1a1a',lineHeight:1,marginBottom:4 }}>£149</div>
            <div style={{ fontFamily:S,fontSize:14,color:'rgba(0,0,0,.4)',marginBottom:28 }}>per month · cancel anytime</div>

            <div style={{ borderTop:'0.5px solid rgba(0,0,0,.08)',paddingTop:24,marginBottom:28 }}>
              {['Every channel included — calls, WhatsApp, Instagram, SMS, email','Unlimited inbound calls and messages','Outbound reminders sent automatically','AI sales agent — re-engages lapsed clients and leads','Full dashboard — call logs, reminders, sales queue','Cancel anytime. No contracts. No commitment.'].map((f,i) => (
                <div key={i} style={{ fontFamily:S,fontSize:13,color:'rgba(0,0,0,.6)',padding:'8px 0',borderBottom:'0.5px solid rgba(0,0,0,.05)',display:'flex',gap:12,alignItems:'center',textAlign:'left' }}>
                  <span style={{ color:'#1a1a1a',fontWeight:500,flexShrink:0 }}>—</span>{f}
                </div>
              ))}
            </div>

            <button onClick={() => setView('login')} style={{ width:'100%',fontFamily:S,fontSize:14,fontWeight:500,letterSpacing:'.08em',background:'#1a1a1a',color:'#fff',border:'none',padding:'16px 0',borderRadius:100,cursor:'pointer' }}>
              Join the Beta
            </button>
          </div>

          <p style={{ fontFamily:S,fontSize:13,color:'rgba(0,0,0,.45)',lineHeight:1.8 }}>
            When we open publicly, the price goes up.<br />
            The studios who joined first will always pay less.
          </p>
          <p className="spots" style={{ fontFamily:S,fontSize:12,color:'#f03e00',marginTop:12,fontWeight:500 }}>
            {spotsLeft} beta spots remaining.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'72px 52px',borderBottom:'0.5px solid rgba(0,0,0,.07)',background:'rgba(255,255,255,.3)',backdropFilter:'blur(8px)' }}>
        <div style={{ maxWidth:640,margin:'0 auto' }}>
          <h2 style={{ fontFamily:D,fontSize:44,fontWeight:400,color:'#1a1a1a',textAlign:'center',marginBottom:44 }}>Questions</h2>
          {FAQS.map((f,i) => (
            <div key={i} style={{ borderBottom:'0.5px solid rgba(0,0,0,.08)' }}>
              <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:'100%',background:'none',border:'none',color:'rgba(0,0,0,.7)',padding:'20px 0',textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',gap:16,fontFamily:D,fontSize:19,lineHeight:1.3 }}>
                {f.q}
                <span style={{ color:'rgba(0,0,0,.3)',fontSize:22,flexShrink:0,display:'inline-block',transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'none' }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontFamily:S,fontSize:13,color:'rgba(0,0,0,.45)',lineHeight:1.85,paddingBottom:20 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ position:'relative',zIndex:10,padding:'100px 52px',textAlign:'center',background:'rgba(255,255,255,.25)',backdropFilter:'blur(8px)' }}>
        <div style={{ fontFamily:D,fontSize:180,color:'rgba(0,0,0,.025)',lineHeight:1,position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',letterSpacing:'-.05em' }}>A</div>
        <div style={{ position:'relative' }}>
          <h2 style={{ fontFamily:D,fontSize:60,fontWeight:400,lineHeight:1.06,letterSpacing:'-.02em',marginBottom:16 }}>
            Stop doing their job.<br />
            <em style={{ fontStyle:'italic',WebkitTextStroke:'1px #1a1a1a',color:'transparent' }}>Let AURA do it for you.</em>
          </h2>
          <p style={{ fontFamily:S,fontSize:15,color:'rgba(0,0,0,.42)',marginBottom:36,maxWidth:420,margin:'0 auto 36px',lineHeight:1.8 }}>
            Join the beta. Limited to 20 studios. Price goes up at launch.
          </p>
          <button onClick={() => setView('login')} style={{ fontFamily:S,fontSize:14,fontWeight:500,letterSpacing:'.08em',background:'#1a1a1a',color:'#fff',border:'none',padding:'17px 44px',borderRadius:100,cursor:'pointer',marginBottom:14 }}>
            Join the Beta — £149/month
          </button>
          <p style={{ fontFamily:S,fontSize:11,color:'rgba(0,0,0,.3)',letterSpacing:'.06em' }}>No card required to start · Cancel anytime</p>
          <p className="spots" style={{ fontFamily:S,fontSize:12,color:'#f03e00',marginTop:10,fontWeight:500 }}>{spotsLeft} spots remaining</p>
        </div>
      </section>

      <footer style={{ position:'relative',zIndex:10,borderTop:'0.5px solid rgba(0,0,0,.07)',padding:'24px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,.6)',backdropFilter:'blur(8px)',flexWrap:'wrap',gap:12 }}>
        <div style={{ fontFamily:D,fontSize:16,letterSpacing:'.1em',color:'#1a1a1a' }}>AURA <span style={{ fontFamily:S,fontSize:8,letterSpacing:'.18em',color:'rgba(0,0,0,.3)',verticalAlign:'middle',marginLeft:6 }}>BY PSC AGENT</span></div>
        <div style={{ fontFamily:S,fontSize:10,color:'rgba(0,0,0,.28)' }}>© 2025 R and G Enterprise Solutions. All rights reserved.</div>
        <div style={{ fontFamily:S,fontSize:10,color:'rgba(0,0,0,.28)',display:'flex',gap:20 }}>
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
