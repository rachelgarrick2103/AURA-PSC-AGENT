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
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  return (
    <div style={{ fontFamily:DISPLAY, background:'#FDFCF9', color:'#0E0C0A', overflowX:'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideAcc{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .fu{animation:fadeUp .8s ease both}
        .d1{animation-delay:.1s}.d2{animation-delay:.25s}.d3{animation-delay:.4s}.d4{animation-delay:.55s}
        .nav-cta{transition:all .2s;cursor:pointer}
        .nav-cta:hover{background:#0E0C0A!important;color:#FDFCF9!important}
        .nav-login{transition:color .2s;cursor:pointer}
        .nav-login:hover{color:#0E0C0A!important}
        .ch-row{transition:all .25s;cursor:default}
        .ch-row:hover{background:#F5F0E8!important}
        .ch-row:hover .ch-num{color:#0E0C0A!important}
        .price-card{transition:transform .25s,box-shadow .25s}
        .price-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(14,12,10,.08)!important}
        .fq-btn{transition:color .2s}
        .fq-btn:hover{color:#0E0C0A!important}
        .cta-btn{transition:all .2s;cursor:pointer}
        .cta-btn:hover{background:#2a2520!important}
        .ghost-btn{transition:all .2s;cursor:pointer}
        .ghost-btn:hover{background:#0E0C0A!important;color:#FDFCF9!important}
        .ticker-track{display:flex;animation:marquee 30s linear infinite;width:max-content}
        .ticker-track:hover{animation-play-state:paused}
        footer a{transition:color .2s}
        footer a:hover{color:#0E0C0A!important}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:'sticky',top:0,zIndex:200,background:'rgba(253,252,249,.92)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',borderBottom:'1px solid #E8E2D9',padding:'0 60px',height:62,display:'flex',alignItems:'center' }}>
        <div style={{ fontFamily:DISPLAY,fontSize:21,letterSpacing:'.1em',color:'#0E0C0A',flex:1 }}>
          AURA <span style={{ fontFamily:SANS,fontSize:9,letterSpacing:'.2em',color:'#B0A898',verticalAlign:'middle',marginLeft:10,textTransform:'uppercase' }}>by PSC Agent</span>
        </div>
        <div style={{ display:'flex',gap:6,fontFamily:SANS,alignItems:'center' }}>
          <button onClick={() => setView('login')} className="nav-login" style={{ background:'transparent',border:'none',color:'#B0A898',fontSize:13,padding:'8px 20px',borderRadius:7,letterSpacing:'.04em' }}>Client Login</button>
          <button onClick={() => setView('login')} className="nav-cta" style={{ background:'#0E0C0A',color:'#FDFCF9',border:'none',padding:'10px 24px',borderRadius:7,fontSize:13,fontWeight:500,letterSpacing:'.06em' }}>Start Free Trial</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'92vh',display:'flex',alignItems:'center',padding:'80px 60px',position:'relative',borderBottom:'1px solid #E8E2D9' }}>
        {/* decorative line */}
        <div style={{ position:'absolute',top:0,left:60,bottom:0,width:1,background:'linear-gradient(180deg,transparent,#E8E2D9 20%,#E8E2D9 80%,transparent)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',top:0,right:60,bottom:0,width:1,background:'linear-gradient(180deg,transparent,#E8E2D9 20%,#E8E2D9 80%,transparent)',pointerEvents:'none' }} />

        <div style={{ maxWidth:1100,margin:'0 auto',width:'100%',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:80,alignItems:'center' }}>

          {/* Left */}
          <div>
            <div className="fu" style={{ display:'inline-block',fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'#B0A898',textTransform:'uppercase',marginBottom:28,borderBottom:'1px solid #E8E2D9',paddingBottom:12 }}>
              AI Receptionist · Beauty Businesses
            </div>

            <h1 className="fu d1" style={{ fontSize:72,lineHeight:1.02,fontWeight:400,marginBottom:28,letterSpacing:'-.02em',fontFamily:DISPLAY }}>
              One AI.<br />
              <span style={{ fontStyle:'italic',color:'#6B5E52' }}>Every channel.</span><br />
              Zero missed bookings.
            </h1>

            <p className="fu d2" style={{ fontFamily:SANS,fontSize:16,color:'#7A6E65',lineHeight:1.85,marginBottom:40,maxWidth:420 }}>
              AURA handles your calls, WhatsApp, Instagram DMs, SMS and email — so your clients always get a reply, no matter where they reach out.
            </p>

            <div className="fu d3" style={{ display:'flex',gap:12,marginBottom:40 }}>
              <button onClick={() => setView('login')} className="cta-btn" style={{ background:'#0E0C0A',color:'#FDFCF9',border:'none',padding:'15px 32px',borderRadius:8,fontSize:14,fontFamily:SANS,fontWeight:500,letterSpacing:'.06em' }}>
                Start 14-Day Free Trial
              </button>
              <button onClick={() => setView('login')} className="ghost-btn" style={{ background:'transparent',color:'#0E0C0A',border:'1px solid #D4CCC2',padding:'15px 24px',borderRadius:8,fontSize:14,fontFamily:SANS,letterSpacing:'.04em' }}>
                Client Login →
              </button>
            </div>

            <div className="fu d4" style={{ fontFamily:SANS,fontSize:11,color:'#B0A898',letterSpacing:'.06em' }}>
              No card required · Cancel any time · Live in 24 hours
            </div>
          </div>

          {/* Right — editorial feature block */}
          <div className="fu d2" style={{ position:'relative' }}>
            {/* Main card */}
            <div style={{ background:'#fff',border:'1px solid #E8E2D9',borderRadius:20,overflow:'hidden',boxShadow:'0 8px 40px rgba(14,12,10,.06)' }}>
              {/* Card header */}
              <div style={{ padding:'24px 28px',borderBottom:'1px solid #F0EBE3',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontFamily:DISPLAY,fontSize:16,color:'#0E0C0A',letterSpacing:'.04em' }}>AURA is active</div>
                  <div style={{ fontFamily:SANS,fontSize:11,color:'#B0A898',marginTop:2 }}>Monitoring all channels</div>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:8,background:'#F5F0E8',borderRadius:100,padding:'6px 14px' }}>
                  <div style={{ width:7,height:7,borderRadius:'50%',background:'#4CAF50' }} />
                  <span style={{ fontFamily:SANS,fontSize:11,color:'#5A6B5A',fontWeight:500 }}>Online</span>
                </div>
              </div>

              {/* Live feed */}
              {[
                { ch:'Call',      msg:'Sophie M. — Mega Volume booked for 14 Nov', time:'just now',  dot:'#0E0C0A' },
                { ch:'WhatsApp',  msg:'Jade R. — Asking about infill prices',        time:'2m ago',   dot:'#4CAF50' },
                { ch:'Instagram', msg:'New enquiry — fullset consultation',           time:'5m ago',   dot:'#E040FB' },
                { ch:'SMS',       msg:'Reminder sent — Layla B. tomorrow 10am',      time:'12m ago',  dot:'#2196F3' },
                { ch:'Email',     msg:'Priya K. — Rescheduled to 19 Nov 11am',       time:'18m ago',  dot:'#FF9800' },
              ].map((item,i)=>(
                <div key={i} style={{ padding:'14px 28px',borderBottom:i<4?'1px solid #F5F0E8':'none',display:'flex',alignItems:'center',gap:14 }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:item.dot,flexShrink:0 }} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:SANS,fontSize:11,fontWeight:600,color:'#B0A898',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:2 }}>{item.ch}</div>
                    <div style={{ fontFamily:SANS,fontSize:13,color:'#0E0C0A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.msg}</div>
                  </div>
                  <div style={{ fontFamily:SANS,fontSize:11,color:'#C8C0B6',flexShrink:0 }}>{item.time}</div>
                </div>
              ))}

              {/* Stats footer */}
              <div style={{ padding:'18px 28px',background:'#F9F6F1',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:0 }}>
                {[{val:'8',lbl:'Handled today'},{val:'5',lbl:'Bookings made'},{val:'0',lbl:'Missed'}].map((s,i)=>(
                  <div key={i} style={{ textAlign:'center',borderRight:i<2?'1px solid #E8E2D9':'' }}>
                    <div style={{ fontFamily:DISPLAY,fontSize:26,color:'#0E0C0A',fontWeight:400 }}>{s.val}</div>
                    <div style={{ fontFamily:SANS,fontSize:10,color:'#B0A898',letterSpacing:'.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating label */}
            <div style={{ position:'absolute',bottom:-18,right:24,background:'#0E0C0A',color:'#FDFCF9',fontFamily:SANS,fontSize:11,padding:'10px 18px',borderRadius:100,letterSpacing:'.08em',boxShadow:'0 8px 24px rgba(14,12,10,.15)' }}>
              All 5 channels active
            </div>
          </div>
        </div>
      </section>

      {/* ── CHANNEL TICKER ── */}
      <div style={{ borderBottom:'1px solid #E8E2D9',padding:'18px 0',overflow:'hidden',background:'#FDFCF9' }}>
        <div className="ticker-track">
          {[...CHANNELS,...CHANNELS].map((c,i)=>(
            <span key={i} style={{ fontFamily:SANS,fontSize:12,color:'#B0A898',letterSpacing:'.12em',textTransform:'uppercase',padding:'0 40px',whiteSpace:'nowrap' }}>
              {c.name} <span style={{ color:'#D4CCC2',marginLeft:40 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CHANNELS ── */}
      <section style={{ padding:'100px 60px',borderBottom:'1px solid #E8E2D9' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr',gap:80,alignItems:'start' }}>
            <div style={{ position:'sticky',top:80 }}>
              <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'#B0A898',textTransform:'uppercase',marginBottom:16 }}>The Channels</div>
              <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#0E0C0A',lineHeight:1.15,marginBottom:20 }}>Wherever your clients reach out</h2>
              <p style={{ fontFamily:SANS,fontSize:14,color:'#7A6E65',lineHeight:1.8 }}>AURA monitors every channel simultaneously. No client goes unanswered, no booking gets missed.</p>
            </div>
            <div>
              {CHANNELS.map((ch,i)=>(
                <div key={i} className="ch-row" style={{ display:'grid',gridTemplateColumns:'48px 1fr',gap:24,padding:'28px 24px',borderRadius:12,marginBottom:4,transition:'background .2s' }}>
                  <div className="ch-num" style={{ fontFamily:DISPLAY,fontSize:32,color:'#D4CCC2',lineHeight:1,transition:'color .2s' }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div>
                    <div style={{ fontFamily:DISPLAY,fontSize:22,color:'#0E0C0A',marginBottom:6 }}>{ch.name}</div>
                    <div style={{ fontFamily:SANS,fontSize:14,color:'#7A6E65',lineHeight:1.7 }}>{ch.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'100px 60px',background:'#F5F0E8',borderBottom:'1px solid #E8E2D9' }}>
        <div style={{ maxWidth:800,margin:'0 auto',textAlign:'center' }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'#B0A898',textTransform:'uppercase',marginBottom:52 }}>From Studios Using AURA</div>
          <div style={{ fontFamily:DISPLAY,fontSize:32,fontWeight:400,color:'#0E0C0A',lineHeight:1.4,marginBottom:32,fontStyle:'italic',minHeight:120 }}>
            "{TESTIMONIALS[activeTestimonial].quote}"
          </div>
          <div style={{ fontFamily:SANS,fontSize:13,color:'#7A6E65',marginBottom:36 }}>
            {TESTIMONIALS[activeTestimonial].name} <span style={{ color:'#C8C0B6' }}>·</span> {TESTIMONIALS[activeTestimonial].studio}
          </div>
          <div style={{ display:'flex',gap:10,justifyContent:'center' }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setActiveTestimonial(i)} style={{ width:i===activeTestimonial?28:8,height:8,borderRadius:100,background:i===activeTestimonial?'#0E0C0A':'#D4CCC2',border:'none',cursor:'pointer',transition:'all .3s',padding:0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'100px 60px',borderBottom:'1px solid #E8E2D9' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:72 }}>
            <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'#B0A898',textTransform:'uppercase',marginBottom:16 }}>How It Works</div>
            <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#0E0C0A',lineHeight:1.2 }}>Live before your next client reaches out</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2 }}>
            {[
              {n:'01',t:'Connect your channels',   b:'Link your booking system, WhatsApp Business number, Instagram account, and email. Takes under an hour.' },
              {n:'02',t:'AURA handles everything',  b:'Clients reach out on any channel. AURA replies instantly, books them in, answers FAQs — around the clock.' },
              {n:'03',t:'Zero missed bookings',     b:'Reminders go out automatically before every appointment across every channel. No-shows become a thing of the past.' },
            ].map((h,i)=>(
              <div key={i} style={{ padding:'48px 40px',borderRight:i<2?'1px solid #E8E2D9':'',position:'relative' }}>
                <div style={{ fontFamily:DISPLAY,fontSize:80,fontWeight:400,color:'#F0EBE3',marginBottom:24,lineHeight:1 }}>{h.n}</div>
                <h3 style={{ fontFamily:DISPLAY,fontSize:24,fontWeight:400,color:'#0E0C0A',marginBottom:14 }}>{h.t}</h3>
                <p style={{ fontFamily:SANS,fontSize:14,color:'#7A6E65',lineHeight:1.85 }}>{h.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding:'100px 60px',background:'#F9F6F1',borderBottom:'1px solid #E8E2D9' }}>
        <div style={{ textAlign:'center',marginBottom:64 }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'#B0A898',textTransform:'uppercase',marginBottom:16 }}>Pricing</div>
          <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#0E0C0A' }}>Straightforward. No surprises.</h2>
          <p style={{ fontFamily:SANS,color:'#B0A898',marginTop:12,fontSize:14 }}>14-day free trial on all plans. Cancel anytime.</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,maxWidth:980,margin:'0 auto' }}>
          {PRICING.map((p)=>(
            <div key={p.tier} className="price-card" style={{ background:'#fff',border:`1px solid ${p.highlight?'#0E0C0A':'#E8E2D9'}`,borderRadius:16,padding:'36px 30px',position:'relative',boxShadow:p.highlight?'0 12px 40px rgba(14,12,10,.1)':'0 2px 12px rgba(14,12,10,.04)' }}>
              {p.badge && <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#0E0C0A',color:'#FDFCF9',fontFamily:SANS,fontSize:10,fontWeight:600,padding:'4px 16px',borderRadius:100,letterSpacing:'.1em',whiteSpace:'nowrap' }}>{p.badge}</div>}
              <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.2em',color:'#B0A898',textTransform:'uppercase',marginBottom:12 }}>{p.tier}</div>
              <div style={{ marginBottom:8,display:'flex',alignItems:'baseline',gap:4 }}>
                <span style={{ fontFamily:DISPLAY,fontSize:48,fontWeight:400,color:'#0E0C0A' }}>{p.price}</span>
                <span style={{ fontFamily:SANS,fontSize:13,color:'#B0A898' }}>{p.period}</span>
              </div>
              <p style={{ fontFamily:SANS,fontSize:13,color:'#7A6E65',lineHeight:1.65,marginBottom:24,paddingBottom:24,borderBottom:'1px solid #F0EBE3' }}>{p.desc}</p>
              <div style={{ marginBottom:28 }}>
                {p.features.map((f,i)=>(
                  <div key={i} style={{ fontFamily:SANS,fontSize:13,color:'#4A4440',padding:'8px 0',borderBottom:'1px solid #F5F0E8',display:'flex',gap:12,alignItems:'flex-start' }}>
                    <span style={{ color:'#0E0C0A',flexShrink:0,marginTop:1 }}>—</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => setView('login')} className={p.highlight?'cta-btn':'ghost-btn'} style={{ width:'100%',background:p.highlight?'#0E0C0A':'transparent',color:p.highlight?'#FDFCF9':'#0E0C0A',border:`1px solid ${p.highlight?'#0E0C0A':'#D4CCC2'}`,padding:'13px 0',borderRadius:8,fontSize:13,fontFamily:SANS,fontWeight:500,letterSpacing:'.06em',cursor:'pointer' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:'80px 60px',borderBottom:'1px solid #E8E2D9' }}>
        <div style={{ maxWidth:680,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:52 }}>
            <h2 style={{ fontFamily:DISPLAY,fontSize:40,fontWeight:400,color:'#0E0C0A' }}>Questions</h2>
          </div>
          {FAQS.map((f,i)=>(
            <div key={i} style={{ borderBottom:'1px solid #E8E2D9' }}>
              <button className="fq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%',background:'none',border:'none',color:'#6B5E52',padding:'22px 0',textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',gap:20,fontFamily:DISPLAY,fontSize:20,lineHeight:1.3 }}>
                {f.q}
                <span style={{ color:'#C8C0B6',fontSize:24,flexShrink:0,display:'inline-block',transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'none',marginTop:2 }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontFamily:SANS,fontSize:14,color:'#7A6E65',lineHeight:1.88,paddingBottom:22,animation:'slideAcc .3s ease' }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'140px 60px',textAlign:'center',position:'relative',overflow:'hidden' }}>
        {/* large decorative letter */}
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:DISPLAY,fontSize:480,fontWeight:400,color:'#F5F0E8',lineHeight:1,pointerEvents:'none',userSelect:'none',zIndex:0,letterSpacing:'-.05em' }}>A</div>
        <div style={{ position:'relative',zIndex:1 }}>
          <h2 style={{ fontFamily:DISPLAY,fontSize:64,fontWeight:400,color:'#0E0C0A',lineHeight:1.08,marginBottom:20,letterSpacing:'-.01em' }}>
            You do the lashes.<br />
            <span style={{ fontStyle:'italic',color:'#6B5E52' }}>AURA does the rest.</span>
          </h2>
          <p style={{ fontFamily:SANS,color:'#7A6E65',fontSize:15,marginBottom:44,lineHeight:1.8,maxWidth:460,margin:'0 auto 44px' }}>
            Join beauty professionals who stopped losing money to missed bookings across every channel.
          </p>
          <button onClick={() => setView('login')} className="cta-btn" style={{ background:'#0E0C0A',color:'#FDFCF9',border:'none',padding:'18px 52px',borderRadius:8,fontSize:16,fontFamily:SANS,fontWeight:500,letterSpacing:'.08em',cursor:'pointer' }}>
            Start Your Free Trial Today
          </button>
          <p style={{ fontFamily:SANS,fontSize:11,color:'#C8C0B6',marginTop:18 }}>14 days free · No card required · Cancel anytime</p>
        </div>
      </section>

      <footer style={{ borderTop:'1px solid #E8E2D9',padding:'40px 60px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,background:'#FDFCF9' }}>
        <div style={{ fontFamily:DISPLAY,fontSize:17,color:'#0E0C0A',letterSpacing:'.08em' }}>AURA <span style={{ fontFamily:SANS,fontSize:9,letterSpacing:'.18em',color:'#C8C0B6',verticalAlign:'middle',marginLeft:8 }}>BY PSC AGENT</span></div>
        <div style={{ fontFamily:SANS,fontSize:11,color:'#C8C0B6' }}>© 2025 R and G Enterprise Solutions. All rights reserved.</div>
        <div style={{ display:'flex',gap:24,fontFamily:SANS,fontSize:12 }}>
          {['Privacy','Terms','Contact'].map(l=><a key={l} style={{ color:'#C8C0B6',textDecoration:'none',cursor:'pointer' }}>{l}</a>)}
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
