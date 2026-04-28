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
const PRICING = [
  { tier:'Solo',           price:'£39',  period:'/month', desc:'For the one-woman studio juggling everything.',     features:['Up to 150 inbound calls/month','24h outbound reminders','10 FAQ answers','Booking integration','Call summary emails','Email support'],                                                     cta:'Start Free Trial', highlight:false },
  { tier:'Studio',         price:'£69',  period:'/month', desc:'For growing studios ready to run like a business.', features:['Unlimited inbound calls','24h + 2h reminders','Unlimited FAQ answers','Custom agent name & voice','Call recordings & transcripts','Analytics dashboard','Priority support'],               cta:'Start Free Trial', highlight:true, badge:'Most Popular' },
  { tier:'Multi-Location', price:'£120', period:'/month', desc:'Runs multiple chairs or locations under one roof.',  features:['Up to 3 locations','Multiple agents','Team access','All Studio features','Booking analytics','Dedicated onboarding'],                                                                     cta:'Book a Demo',    highlight:false },
]
const FAQS = [
  { q:'Can I keep my existing phone number?',     a:'Yes. We set up call forwarding so your number stays the same. AURA answers on your behalf.' },
  { q:'What booking systems does it connect to?', a:'Acuity, Fresha, Timely, Google Calendar, and Calendly. More integrations added monthly.' },
  { q:'Can clients still reach a human?',         a:'Absolutely. AURA hands off to you via text alert if a client specifically asks or if she cannot resolve something.' },
  { q:'How long does setup take?',                a:'Most clients are fully live within 24 hours. Our setup wizard walks you through every step.' },
]


      <style>{`
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 25%{transform:translate(80px,-60px) scale(1.12) rotate(8deg)} 50%{transform:translate(-40px,80px) scale(0.95) rotate(-5deg)} 75%{transform:translate(60px,30px) scale(1.08) rotate(3deg)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 25%{transform:translate(-70px,50px) scale(1.1) rotate(-6deg)} 50%{transform:translate(90px,-50px) scale(1.05) rotate(10deg)} 75%{transform:translate(-30px,-70px) scale(0.92) rotate(-4deg)} }
        @keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,70px) scale(1.15)} 66%{transform:translate(-80px,-30px) scale(0.9)} }
        @keyframes drift4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-60px,60px) scale(1.2)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideAcc { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes hueRotate { 0%{filter:hue-rotate(0deg) brightness(1.1) saturate(1.3)} 100%{filter:hue-rotate(360deg) brightness(1.1) saturate(1.3)} }
        .fu{animation:fadeUp .8s ease both}
        .d1{animation-delay:.1s}.d2{animation-delay:.25s}.d3{animation-delay:.4s}.d4{animation-delay:.58s}
        .wbtn{transition:all .2s;cursor:pointer}.wbtn:hover{background:rgba(255,255,255,.9)!important;transform:translateY(-1px)}
        .gbtn{cursor:pointer;transition:all .2s}.gbtn:hover{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.3)!important}
        .hlift{transition:transform .25s,box-shadow .25s}.hlift:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(80,40,255,.2)}
        .fq{transition:color .2s;cursor:pointer}.fq:hover{color:#a0a0ff!important}
        .stat-card:hover{border-color:rgba(100,80,255,.3)!important}
        .stat-card{transition:border-color .3s}
        .nav-btn:hover{color:#c0b8ff!important}
        .nav-btn{transition:color .2s}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(4,3,15,.6)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'0 52px',height:58,display:'flex',alignItems:'center' }}>
        <div style={{ fontFamily:DISPLAY,fontSize:22,letterSpacing:'.12em',color:'#fff',flex:1,background:'linear-gradient(135deg,#fff 0%,#c0b0ff 50%,#80d4ff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
          AURA <span style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.18em',WebkitTextFillColor:'rgba(255,255,255,.35)',verticalAlign:'middle',marginLeft:10 }}>BY PSC AGENT</span>
        </div>
        <div style={{ display:'flex',gap:8,fontFamily:SANS,alignItems:'center' }}>
          <button onClick={() => setView('login')} className="nav-btn" style={{ background:'transparent',border:'none',color:'rgba(255,255,255,.5)',fontSize:13,padding:'8px 18px',borderRadius:8,cursor:'pointer' }}>Client Login</button>
          <button onClick={() => setView('login')} className="wbtn" style={{ background:'#fff',color:'#0a0820',border:'none',padding:'10px 22px',borderRadius:8,fontSize:13,fontWeight:700,letterSpacing:'.04em' }}>Start Free Trial</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight:'100vh',display:'flex',alignItems:'center',padding:'100px 52px 80px',position:'relative',overflow:'hidden' }}>

        {/* Aurora background layers */}
        <div style={{ position:'absolute',inset:0,background:'#04030f',zIndex:0 }} />

        {/* Blob 1 — deep blue */}
        <div style={{ position:'absolute',width:900,height:900,borderRadius:'50%',background:'radial-gradient(circle at 40% 40%, #2a0aff 0%, #0a0aff 30%, transparent 70%)',filter:'blur(90px)',opacity:.55,top:'-20%',left:'-15%',animation:'drift1 18s ease-in-out infinite',zIndex:1 }} />
        {/* Blob 2 — cyan teal */}
        <div style={{ position:'absolute',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, #00e5ff 0%, #0077ff 40%, transparent 70%)',filter:'blur(80px)',opacity:.45,top:'10%',right:'-10%',animation:'drift2 22s ease-in-out infinite',zIndex:1 }} />
        {/* Blob 3 — magenta purple */}
        <div style={{ position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, #cc00ff 0%, #7700cc 40%, transparent 70%)',filter:'blur(100px)',opacity:.4,bottom:'-10%',left:'20%',animation:'drift3 26s ease-in-out infinite',zIndex:1 }} />
        {/* Blob 4 — electric indigo */}
        <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, #4400ff 0%, #2200aa 50%, transparent 70%)',filter:'blur(70px)',opacity:.5,bottom:'5%',right:'15%',animation:'drift4 20s ease-in-out infinite',zIndex:1 }} />
        {/* Blob 5 — hot pink accent */}
        <div style={{ position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, #ff00aa 0%, #aa0066 50%, transparent 70%)',filter:'blur(90px)',opacity:.3,top:'40%',left:'40%',animation:'drift2 30s ease-in-out infinite reverse',zIndex:1 }} />
        {/* Blob 6 — deep teal */}
        <div style={{ position:'absolute',width:550,height:550,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, #00ffcc 0%, #007755 50%, transparent 70%)',filter:'blur(100px)',opacity:.25,top:'5%',left:'45%',animation:'drift1 24s ease-in-out infinite reverse',zIndex:1 }} />

        {/* Grain overlay */}
        <div style={{ position:'absolute',inset:0,zIndex:2,opacity:.04,backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',backgroundRepeat:'repeat',backgroundSize:'128px' }} />

        {/* Vignette */}
        <div style={{ position:'absolute',inset:0,zIndex:2,background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(4,3,15,.8) 100%)',pointerEvents:'none' }} />

        {/* Content */}
        <div style={{ maxWidth:1200,margin:'0 auto',width:'100%',position:'relative',zIndex:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }}>

          {/* Left text */}
          <div>
            <div className="fu" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:100,padding:'7px 18px',marginBottom:32,fontFamily:SANS,backdropFilter:'blur(10px)' }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'linear-gradient(135deg,#00e5ff,#cc00ff)',display:'inline-block',animation:'pulseGlow 2s ease-in-out infinite' }} />
              <span style={{ fontSize:10,color:'rgba(255,255,255,.7)',letterSpacing:'.2em',textTransform:'uppercase' }}>AI Receptionist for Beauty Businesses</span>
            </div>

            <h1 className="fu d1" style={{ fontSize:64,lineHeight:1.06,fontWeight:400,marginBottom:24,letterSpacing:'-.015em' }}>
              Your clients call.<br />
              <span style={{ background:'linear-gradient(135deg, #80d4ff 0%, #c084ff 40%, #ff80d4 80%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>
                AURA answers.
              </span>
            </h1>

            <p className="fu d2" style={{ fontFamily:SANS,fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.85,marginBottom:40,maxWidth:420 }}>
              The AI receptionist built for solo lash techs and beauty studios. Books appointments, handles FAQs, and calls clients before they no-show — 24/7.
            </p>

            <div className="fu d3" style={{ display:'flex',gap:12 }}>
              <button onClick={() => setView('login')} className="wbtn" style={{ background:'#fff',color:'#0a0820',border:'none',padding:'15px 32px',borderRadius:9,fontSize:15,fontFamily:SANS,fontWeight:700,letterSpacing:'.04em' }}>
                Start 14-Day Free Trial
              </button>
              <button onClick={() => setView('login')} className="gbtn" style={{ background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.7)',border:'1px solid rgba(255,255,255,.15)',padding:'15px 24px',borderRadius:9,fontSize:15,fontFamily:SANS,backdropFilter:'blur(10px)' }}>
                Client Login →
              </button>
            </div>

            <p className="fu d4" style={{ fontFamily:SANS,fontSize:11,color:'rgba(255,255,255,.25)',marginTop:16,letterSpacing:'.08em' }}>
              No card required · Cancel any time · Live in 24 hours
            </p>
          </div>

          {/* Right — aurora orb */}
          <div className="fu d2" style={{ display:'flex',justifyContent:'center',alignItems:'center',position:'relative',height:500 }}>
            {/* Outer glow rings */}
            <div style={{ position:'absolute',width:380,height:380,borderRadius:'50%',background:'conic-gradient(from 0deg,#2a0aff,#00e5ff,#cc00ff,#ff00aa,#00ffcc,#4400ff,#2a0aff)',filter:'blur(60px)',opacity:.25,animation:'floatOrb 4s ease-in-out infinite, hueRotate 10s linear infinite' }} />
            <div style={{ position:'absolute',width:300,height:300,borderRadius:'50%',background:'conic-gradient(from 90deg,#00e5ff,#cc00ff,#ff00aa,#2a0aff,#00ffcc,#00e5ff)',filter:'blur(30px)',opacity:.4,animation:'floatOrb 4s ease-in-out infinite, hueRotate 8s linear infinite reverse' }} />

            {/* Main orb */}
            <div style={{ width:220,height:220,borderRadius:'50%',position:'relative',zIndex:5,animation:'floatOrb 4s ease-in-out infinite, hueRotate 6s linear infinite',background:'conic-gradient(from 0deg,hsl(240,100%,60%),hsl(180,100%,60%),hsl(300,100%,60%),hsl(200,100%,65%),hsl(270,100%,65%),hsl(240,100%,60%))',boxShadow:'0 0 80px rgba(100,50,255,.6), 0 0 160px rgba(0,200,255,.3)' }} />

            {/* Floating stat pills */}
            <div style={{ position:'absolute',top:'12%',right:'0%',background:'rgba(255,255,255,.07)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'12px 16px',fontFamily:SANS,animation:'floatOrb 5s ease-in-out infinite',animationDelay:'1s' }}>
              <div style={{ fontSize:18,fontWeight:700,color:'#fff',marginBottom:2 }}>8</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.08em' }}>Calls today</div>
            </div>
            <div style={{ position:'absolute',bottom:'18%',left:'-5%',background:'rgba(255,255,255,.07)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'12px 16px',fontFamily:SANS,animation:'floatOrb 6s ease-in-out infinite',animationDelay:'.5s' }}>
              <div style={{ fontSize:18,fontWeight:700,color:'#fff',marginBottom:2 }}>5</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.08em' }}>Bookings made</div>
            </div>
            <div style={{ position:'absolute',bottom:'35%',right:'-8%',background:'linear-gradient(135deg,rgba(0,229,255,.15),rgba(204,0,255,.15))',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,.15)',borderRadius:12,padding:'12px 16px',fontFamily:SANS,animation:'floatOrb 4.5s ease-in-out infinite',animationDelay:'2s' }}>
              <div style={{ fontSize:12,fontWeight:600,color:'#00e5ff',marginBottom:2 }}>✓ Booking confirmed</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,.45)' }}>Mega Volume — 14 Nov 10:00</div>
            </div>

            <div style={{ position:'absolute',bottom:30,fontFamily:SANS,fontSize:10,color:'rgba(255,255,255,.2)',letterSpacing:'.2em',textTransform:'uppercase' }}>Always on · Always listening</div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ background:'rgba(255,255,255,.02)',borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'60px 52px' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr 1fr' }}>
          {[
            {val:'£320',lbl:'Average monthly revenue lost to no-shows per solo tech'},
            {val:'67%', lbl:'Of missed calls from new clients who never call back'},
            {val:'94%', lbl:'Client satisfaction rate after switching to AURA'},
          ].map((s,i)=>(
            <div key={i} className="stat-card" style={{ padding:'28px 40px',borderRight:i<2?'1px solid rgba(255,255,255,.06)':'none',textAlign:'center' }}>
              <div style={{ fontFamily:DISPLAY,fontSize:52,fontWeight:400,marginBottom:10,background:'linear-gradient(135deg,#80d4ff,#c084ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{s.val}</div>
              <div style={{ fontFamily:SANS,fontSize:12,color:'rgba(255,255,255,.4)',lineHeight:1.65,maxWidth:180,margin:'0 auto' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding:'100px 52px',position:'relative',overflow:'hidden' }}>
        {/* subtle aurora accent */}
        <div style={{ position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,#4400ff 0%,transparent 70%)',filter:'blur(120px)',opacity:.12,top:'-20%',right:'-10%',pointerEvents:'none' }} />
        <div style={{ maxWidth:1100,margin:'0 auto',position:'relative' }}>
          <div style={{ textAlign:'center',marginBottom:72 }}>
            <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'rgba(140,110,255,.8)',textTransform:'uppercase',marginBottom:14 }}>How It Works</div>
            <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#fff',lineHeight:1.2 }}>Up and running before your next client walks in</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:40 }}>
            {[
              {n:'01',t:'Connect in minutes',b:'Link your booking system — Acuity, Fresha, Timely, or Google Calendar. AURA reads your live availability.',color:'#80d4ff'},
              {n:'02',t:'AURA takes the calls',b:'Clients call your existing number. AURA answers, books them in, handles FAQs and reschedules — 24/7.',color:'#c084ff'},
              {n:'03',t:'Zero no-shows',b:"AURA calls every client before their appointment. If they can't make it, she reschedules and fills the slot.",color:'#ff84d4'},
            ].map((h,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:'32px 28px',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${h.color},transparent)` }} />
                <div style={{ fontFamily:DISPLAY,fontSize:64,fontWeight:400,color:'rgba(255,255,255,.06)',marginBottom:16,lineHeight:1 }}>{h.n}</div>
                <h3 style={{ fontFamily:DISPLAY,fontSize:22,fontWeight:400,color:'#fff',marginBottom:12 }}>{h.t}</h3>
                <p style={{ fontFamily:SANS,fontSize:14,color:'rgba(255,255,255,.45)',lineHeight:1.88 }}>{h.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section style={{ background:'rgba(255,255,255,.015)',borderTop:'1px solid rgba(255,255,255,.06)',padding:'100px 52px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,#0044ff 0%,transparent 70%)',filter:'blur(130px)',opacity:.1,bottom:'-30%',left:'-10%',pointerEvents:'none' }} />
        <div style={{ textAlign:'center',marginBottom:60 }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.25em',color:'rgba(140,110,255,.8)',textTransform:'uppercase',marginBottom:14 }}>Pricing</div>
          <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#fff' }}>Straightforward. No surprises.</h2>
          <p style={{ fontFamily:SANS,color:'rgba(255,255,255,.35)',marginTop:12,fontSize:14 }}>14-day free trial on all plans. Cancel anytime.</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,maxWidth:960,margin:'0 auto' }}>
          {PRICING.map((p)=>(
            <div key={p.tier} className="hlift" style={{ background: p.highlight ? 'linear-gradient(135deg,rgba(80,40,200,.25),rgba(0,150,255,.15))' : 'rgba(255,255,255,.03)', border:`1px solid ${p.highlight?'rgba(140,100,255,.5)':'rgba(255,255,255,.07)'}`,borderRadius:16,padding:'36px 28px',position:'relative',backdropFilter:'blur(10px)' }}>
              {p.highlight && <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#4400ff,#00e5ff,#cc00ff)',borderRadius:'16px 16px 0 0' }} />}
              {p.badge && <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#4400ff,#cc00ff)',color:'#fff',fontFamily:SANS,fontSize:10,fontWeight:700,padding:'4px 14px',borderRadius:100,letterSpacing:'.08em',whiteSpace:'nowrap' }}>{p.badge}</div>}
              <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.2em',color:'rgba(255,255,255,.4)',textTransform:'uppercase',marginBottom:10 }}>{p.tier}</div>
              <div style={{ marginBottom:8 }}>
                <span style={{ fontFamily:DISPLAY,fontSize:46,fontWeight:400,color:'#fff' }}>{p.price}</span>
                <span style={{ fontFamily:SANS,fontSize:13,color:'rgba(255,255,255,.3)' }}>{p.period}</span>
              </div>
              <p style={{ fontFamily:SANS,fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.65,marginBottom:24 }}>{p.desc}</p>
              <div style={{ marginBottom:28 }}>
                {p.features.map((f,i)=>(
                  <div key={i} style={{ fontFamily:SANS,fontSize:13,color:'rgba(255,255,255,.55)',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',gap:10 }}>
                    <span style={{ background:'linear-gradient(135deg,#80d4ff,#c084ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => setView('login')} className="wbtn" style={{ width:'100%',background:p.highlight?'linear-gradient(135deg,#4400ff,#0088ff)':'rgba(255,255,255,.06)',color:'#fff',border:`1px solid ${p.highlight?'transparent':'rgba(255,255,255,.12)'}`,padding:'13px 0',borderRadius:9,fontSize:13,fontFamily:SANS,fontWeight:600,letterSpacing:'.04em',cursor:'pointer' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding:'80px 52px' }}>
        <div style={{ maxWidth:640,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:52 }}>
            <h2 style={{ fontFamily:DISPLAY,fontSize:40,fontWeight:400,color:'#fff' }}>Questions</h2>
          </div>
          {FAQS.map((f,i)=>(
            <div key={i} style={{ borderBottom:'1px solid rgba(255,255,255,.07)' }}>
              <button className="fq" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%',background:'none',border:'none',color:'rgba(255,255,255,.75)',padding:'20px 0',textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',gap:16,fontFamily:DISPLAY,fontSize:19 }}>
                {f.q}
                <span style={{ color:'rgba(140,110,255,.8)',fontSize:22,flexShrink:0,display:'inline-block',transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'none' }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontFamily:SANS,fontSize:14,color:'rgba(255,255,255,.4)',lineHeight:1.88,paddingBottom:20,animation:'slideAcc .3s ease' }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding:'130px 52px',textAlign:'center',position:'relative',overflow:'hidden' }}>
        {/* aurora bg */}
        <div style={{ position:'absolute',width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,#4400ff 0%,#00e5ff 40%,transparent 70%)',filter:'blur(120px)',opacity:.12,top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',animation:'hueRotate 15s linear infinite' }} />
        <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,#cc00ff 0%,transparent 70%)',filter:'blur(100px)',opacity:.1,top:'50%',left:'30%',transform:'translate(-50%,-50%)',pointerEvents:'none' }} />

        <h2 style={{ fontFamily:DISPLAY,fontSize:60,fontWeight:400,color:'#fff',lineHeight:1.1,marginBottom:20,position:'relative' }}>
          You do the lashes.<br />
          <span style={{ background:'linear-gradient(135deg,#80d4ff 0%,#c084ff 50%,#ff84d4 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontStyle:'italic' }}>AURA does the rest.</span>
        </h2>
        <p style={{ fontFamily:SANS,color:'rgba(255,255,255,.4)',fontSize:15,marginBottom:44,lineHeight:1.8,position:'relative' }}>
          Join beauty professionals who stopped losing money to missed calls and no-shows.
        </p>
        <button onClick={() => setView('login')} className="wbtn" style={{ background:'linear-gradient(135deg,#4400ff,#0088ff,#00e5ff)',color:'#fff',border:'none',padding:'17px 52px',borderRadius:9,fontSize:16,fontFamily:SANS,fontWeight:700,letterSpacing:'.05em',position:'relative',boxShadow:'0 0 60px rgba(68,0,255,.4)' }}>
          Start Your Free Trial Today
        </button>
        <p style={{ fontFamily:SANS,fontSize:11,color:'rgba(255,255,255,.2)',marginTop:18,position:'relative' }}>14 days free · No card required · Cancel anytime</p>
      </section>

      <footer style={{ borderTop:'1px solid rgba(255,255,255,.06)',padding:'36px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
        <div style={{ fontFamily:DISPLAY,fontSize:16,letterSpacing:'.08em',background:'linear-gradient(135deg,#80d4ff,#c084ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>AURA <span style={{ fontFamily:SANS,fontSize:9,letterSpacing:'.14em' }}>BY PSC AGENT</span></div>
        <div style={{ fontFamily:SANS,fontSize:11,color:'rgba(255,255,255,.2)' }}>© 2025 R and G Enterprise Solutions. All rights reserved.</div>
        <div style={{ display:'flex',gap:20,fontFamily:SANS,fontSize:12 }}>
          {['Privacy','Terms','Contact'].map(l=><span key={l} style={{ color:'rgba(255,255,255,.2)',cursor:'pointer' }}>{l}</span>)}
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
