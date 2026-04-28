import { useState, useEffect } from 'react'

const DISPLAY = "'Cormorant Garamond', 'Cormorant', Georgia, serif"
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif"

const SALES_CLIENTS = [
  { id:1,  name:'Aaliyah James',    initials:'AJ', segment:'hot_lead',   label:'Hot Lead',      context:'Filled out enquiry form 6 days ago — no follow-up sent yet.',                                    service:'Mega Volume Fullset',     source:'Website form', days:6,   priority:'high' },
  { id:2,  name:'Esther Bakare',    initials:'EB', segment:'hot_lead',   label:'Hot Lead',      context:"DM'd asking about fullset pricing 3 days ago. Saved your pinned post.",                          service:'Fullset consultation',    source:'Instagram',    days:3,   priority:'high' },
  { id:3,  name:'Fatima Al-Hassan', initials:'FA', segment:'gone_quiet', label:'Gone Quiet',    context:'Was actively in conversation about booking. Last message 9 days ago, no response since.',         service:'Mega Volume Fullset',     source:'WhatsApp',     days:9,   priority:'high' },
  { id:4,  name:'Bianca Osei',      initials:'BO', segment:'gone_quiet', label:'Gone Quiet',    context:'Replied to your story asking about availability 11 days ago. No follow-up from either side.',     service:'Wispy Hybrid Set',        source:'Story reply',  days:11,  priority:'high' },
  { id:5,  name:'Nadia Campbell',   initials:'NC', segment:'gone_quiet', label:'Gone Quiet',    context:'Was referred by a current client. Sent one enquiry DM 14 days ago, no response sent.',           service:'Classic Fullset',         source:'Referral',     days:14,  priority:'medium' },
  { id:6,  name:'Grace Nwosu',      initials:'GN', segment:'lapsed',     label:'Lapsed Client', context:'5-star reviewer. Used to book mega volume every 6 weeks. Last visit 5 months ago.',              service:'Mega Volume Infill',      source:'Regular client',days:152, priority:'medium' },
  { id:7,  name:'Claudette Moore',  initials:'CM', segment:'lapsed',     label:'Lapsed Client', context:'Regular classic infill every 8 weeks for 18 months. Went quiet after last appointment.',         service:'Classic Infill',          source:'Regular client',days:118, priority:'medium' },
  { id:8,  name:'Destiny Okonkwo',  initials:'DO', segment:'promo',      label:'Promo Target',  context:'Past client, 3 visits. Stopped booking around the time of your March price increase.',           service:'Volume Infill',           source:'Past client',  days:92,  priority:'medium' },
  { id:9,  name:'Helena Costa',     initials:'HC', segment:'promo',      label:'Promo Target',  context:'First-time client 2 months ago, left a glowing Google review, never rebooked.',                 service:'Classic Fullset',         source:'Google Review',days:68,  priority:'low' },
]

const MOCK_CALLS = [
  { time:'9:14 AM',  caller:'Sophie M.', type:'inbound',  duration:'2m 18s', outcome:'Booked',      detail:'Mega volume — 14 Nov, 10:00 AM',    ok:true  },
  { time:'9:41 AM',  caller:'Unknown',   type:'inbound',  duration:'0m 52s', outcome:'FAQ',         detail:'Aftercare & parking questions',      ok:false },
  { time:'10:05 AM', caller:'Jade R.',   type:'inbound',  duration:'3m 04s', outcome:'Booked',      detail:'Classic infill — 16 Nov, 2:30 PM',  ok:true  },
  { time:'10:33 AM', caller:'Priya K.',  type:'inbound',  duration:'1m 41s', outcome:'Rescheduled', detail:'Moved 12 Nov → 19 Nov 11 AM',       ok:false },
  { time:'11:02 AM', caller:'Outbound',  type:'outbound', duration:'0m 38s', outcome:'Confirmed',   detail:'Reminder to Layla B. — tomorrow 10 AM',ok:true},
  { time:'11:19 AM', caller:'Mia T.',    type:'inbound',  duration:'2m 55s', outcome:'Booked',      detail:'Wispy hybrid — 20 Nov, 3:00 PM',    ok:true  },
]

const PRICING = [
  { tier:'Solo',           price:'£39',  period:'/month', desc:'For the one-woman studio juggling everything.',           features:['Up to 150 inbound calls/month','24h outbound reminders','10 FAQ answers','Booking integration','Call summary emails','Email support'],                                                     cta:'Start Free Trial', highlight:false },
  { tier:'Studio',         price:'£69',  period:'/month', desc:'For growing studios ready to run like a business.',       features:['Unlimited inbound calls','24h + 2h reminders','Unlimited FAQ answers','Custom agent name & voice','Call recordings & transcripts','Analytics dashboard','Priority support'],               cta:'Start Free Trial', highlight:true, badge:'Most Popular' },
  { tier:'Multi-Location', price:'£120', period:'/month', desc:'Runs multiple chairs or locations under one roof.',       features:['Up to 3 locations','Multiple agents','Team access','All Studio features','Booking analytics','Dedicated onboarding'],                                                                     cta:'Book a Demo',    highlight:false },
]

const FAQS = [
  { q:'Can I keep my existing phone number?',       a:'Yes. We set up call forwarding so your number stays the same. AURA answers on your behalf.' },
  { q:'What booking systems does it connect to?',   a:'Acuity, Fresha, Timely, Google Calendar, and Calendly. More integrations added monthly.' },
  { q:'Can clients still reach a human?',           a:'Absolutely. AURA hands off to you via text alert if a client specifically asks or if she genuinely cannot resolve something.' },
  { q:'How long does setup take?',                  a:'Most clients are fully live within 24 hours. Our setup wizard walks you through it step by step.' },
]

export default function AURAApp() {
  const [view, setView] = useState('landing')

  useEffect(() => {
    const fonts = [
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/400.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/500.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.17/600.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/400.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/500.css',
    ]
    fonts.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement('link')
        l.rel = 'stylesheet'
        l.href = href
        document.head.appendChild(l)
      }
    })
  }, [])

  if (view === 'dashboard') return <Dashboard setView={setView} />
  return <Landing setView={setView} />
}

// ── LANDING ───────────────────────────────────────────────────────────────
function Landing({ setView }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ fontFamily:DISPLAY, background:'#000', color:'#fff', overflowX:'hidden' }}>
      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-22px) scale(1.05)} }
        @keyframes hueShift { 0%{filter:hue-rotate(0deg) brightness(1.1)} 100%{filter:hue-rotate(360deg) brightness(1.1)} }
        @keyframes ringOut  { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
        @keyframes ringOut2 { 0%{transform:scale(1);opacity:.3} 100%{transform:scale(2.8);opacity:0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideAcc { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        .fu{animation:fadeUp .7s ease both}
        .d1{animation-delay:.1s} .d2{animation-delay:.22s} .d3{animation-delay:.36s} .d4{animation-delay:.52s}
        .orb{animation:orbFloat 3.4s ease-in-out infinite,hueShift 7s linear infinite;border-radius:50%;background:conic-gradient(from 0deg,hsl(0,100%,62%),hsl(45,100%,60%),hsl(90,100%,58%),hsl(150,100%,55%),hsl(200,100%,60%),hsl(250,100%,65%),hsl(300,100%,60%),hsl(330,100%,62%),hsl(360,100%,62%))}
        .r1{animation:ringOut  2.8s ease-out infinite}
        .r2{animation:ringOut2 2.8s ease-out infinite;animation-delay:.85s}
        .r3{animation:ringOut  2.8s ease-out infinite;animation-delay:1.7s}
        .wbtn{transition:background .18s,color .18s;cursor:pointer}
        .wbtn:hover{background:#ddd!important}
        .gbtn:hover{background:rgba(255,255,255,.06)!important;cursor:pointer}
        .hlift{transition:transform .2s}.hlift:hover{transform:translateY(-3px)}
        .fq:hover{color:#aaa!important}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(0,0,0,.92)',backdropFilter:'blur(14px)',borderBottom:'1px solid #1c1c1c',padding:'0 52px',height:58,display:'flex',alignItems:'center' }}>
        <div style={{ fontFamily:DISPLAY,fontSize:22,letterSpacing:'.12em',color:'#fff',flex:1 }}>
          AURA <span style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.18em',color:'#555',verticalAlign:'middle',marginLeft:10 }}>BY PSC AGENT</span>
        </div>
        <div style={{ display:'flex',gap:8,fontFamily:SANS }}>
          <button onClick={() => setView('dashboard')} className="gbtn" style={{ background:'transparent',border:'none',color:'#666',fontSize:13,padding:'8px 16px',borderRadius:6 }}>Dashboard Demo</button>
          <button className="wbtn" style={{ background:'#fff',color:'#000',border:'none',padding:'10px 22px',borderRadius:6,fontSize:13,fontWeight:600,letterSpacing:'.04em' }}>Start Free Trial</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'96vh',display:'flex',alignItems:'center',padding:'60px 52px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 45% 70% at 72% 50%,rgba(255,255,255,.025) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ maxWidth:1200,margin:'0 auto',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }}>

          <div>
            <div className="fu" style={{ display:'inline-flex',alignItems:'center',gap:8,border:'1px solid #252525',borderRadius:100,padding:'6px 16px',marginBottom:30,fontFamily:SANS }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'#fff',opacity:.8,display:'inline-block' }} />
              <span style={{ fontSize:10,color:'#666',letterSpacing:'.2em',textTransform:'uppercase' }}>AI Receptionist for Beauty Businesses</span>
            </div>
            <h1 className="fu d1" style={{ fontSize:64,lineHeight:1.06,fontWeight:400,marginBottom:24,letterSpacing:'-.01em',fontFamily:DISPLAY }}>
              Your clients call.<br />
              <span style={{ color:'#888',fontStyle:'italic' }}>AURA answers.</span>
            </h1>
            <p className="fu d2" style={{ fontFamily:SANS,fontSize:16,color:'#777',lineHeight:1.82,marginBottom:40,maxWidth:410 }}>
              The AI receptionist built for solo lash techs and beauty studios. Books appointments, handles FAQs, and calls clients before they no-show — 24/7.
            </p>
            <div className="fu d3" style={{ display:'flex',gap:12 }}>
              <button className="wbtn" style={{ background:'#fff',color:'#000',border:'none',padding:'14px 30px',borderRadius:7,fontSize:15,fontFamily:SANS,fontWeight:600,letterSpacing:'.04em' }}>Start 14-Day Free Trial</button>
              <button onClick={() => setView('dashboard')} className="gbtn" style={{ background:'transparent',color:'#666',border:'1px solid #252525',padding:'14px 22px',borderRadius:7,fontSize:15,fontFamily:SANS,border:'1px solid #252525' }}>See Dashboard →</button>
            </div>
            <p className="fu d4" style={{ fontFamily:SANS,fontSize:11,color:'#444',marginTop:14,letterSpacing:'.08em' }}>No card required · Cancel any time · Live in 24 hours</p>
          </div>

          {/* ORB */}
          <div className="fu d2" style={{ display:'flex',justifyContent:'center',alignItems:'center',position:'relative',height:460 }}>
            <div className="r1" style={{ position:'absolute',width:210,height:210,borderRadius:'50%',background:'conic-gradient(from 0deg,hsl(0,100%,62%),hsl(90,100%,58%),hsl(180,100%,60%),hsl(270,100%,62%),hsl(360,100%,62%))',opacity:.55,filter:'blur(2px)' }} />
            <div className="r2" style={{ position:'absolute',width:210,height:210,borderRadius:'50%',background:'conic-gradient(from 60deg,hsl(60,100%,60%),hsl(160,100%,56%),hsl(240,100%,62%),hsl(310,100%,60%),hsl(360,100%,62%))',opacity:.35,filter:'blur(4px)' }} />
            <div className="r3" style={{ position:'absolute',width:210,height:210,borderRadius:'50%',background:'conic-gradient(from 120deg,hsl(120,100%,58%),hsl(200,100%,60%),hsl(280,100%,64%),hsl(0,100%,62%),hsl(60,100%,60%))',opacity:.22,filter:'blur(5px)' }} />
            <div style={{ position:'absolute',width:300,height:300,borderRadius:'50%',background:'conic-gradient(from 0deg,hsl(0,100%,60%),hsl(60,100%,60%),hsl(180,100%,55%),hsl(270,100%,65%),hsl(360,100%,60%))',filter:'blur(55px)',opacity:.18,animation:'orbFloat 3.4s ease-in-out infinite,hueShift 7s linear infinite' }} />
            <div className="orb" style={{ width:200,height:200,position:'relative',zIndex:2,boxShadow:'0 0 0 1px rgba(255,255,255,.07),0 20px 60px rgba(0,0,0,.6)' }} />
            <div style={{ position:'absolute',bottom:36,fontFamily:SANS,fontSize:10,color:'#3a3a3a',letterSpacing:'.18em',textTransform:'uppercase' }}>Always on · Always listening</div>
          </div>
        </div>
      </section>

      <div style={{ height:1,background:'linear-gradient(90deg,transparent,#282828,transparent)' }} />

      {/* STATS */}
      <section style={{ background:'#070707',padding:'60px 52px' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr 1fr' }}>
          {[
            { val:'£320', lbl:'Average monthly revenue lost to no-shows per solo tech' },
            { val:'67%',  lbl:'Of missed calls from new clients who never call back' },
            { val:'94%',  lbl:'Client satisfaction rate after switching to AURA' },
          ].map((s,i) => (
            <div key={i} style={{ padding:'28px 40px',borderRight:i<2?'1px solid #181818':'none',textAlign:'center' }}>
              <div style={{ fontFamily:DISPLAY,fontSize:52,fontWeight:400,color:'#fff',marginBottom:10 }}>{s.val}</div>
              <div style={{ fontFamily:SANS,fontSize:12,color:'#555',lineHeight:1.65,maxWidth:180,margin:'0 auto' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height:1,background:'linear-gradient(90deg,transparent,#222,transparent)' }} />

      {/* HOW IT WORKS */}
      <section style={{ padding:'100px 52px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.24em',color:'#555',textTransform:'uppercase',marginBottom:14 }}>How It Works</div>
            <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#fff',lineHeight:1.2 }}>Up and running before your next client walks in</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:52 }}>
            {[
              { n:'01', t:'Connect in minutes',  b:'Link your booking system — Acuity, Fresha, Timely, or Google Calendar. AURA reads your availability in real time.' },
              { n:'02', t:'AURA takes the calls', b:'Clients call your existing number. AURA answers, books them in, handles FAQs and reschedules — 24/7, no days off.' },
              { n:'03', t:'Zero no-shows',        b:"AURA calls every client before their appointment. If they can't make it, she reschedules on the spot and fills the slot." },
            ].map((h,i) => (
              <div key={i} style={{ position:'relative' }}>
                <div style={{ fontFamily:DISPLAY,fontSize:80,fontWeight:400,color:'#181818',marginBottom:14,lineHeight:1 }}>{h.n}</div>
                <h3 style={{ fontFamily:DISPLAY,fontSize:24,fontWeight:400,color:'#fff',marginBottom:12 }}>{h.t}</h3>
                <p style={{ fontFamily:SANS,fontSize:14,color:'#666',lineHeight:1.88 }}>{h.b}</p>
                {i < 2 && <div style={{ position:'absolute',top:38,right:-30,color:'#252525',fontSize:22,fontFamily:SANS }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1,background:'linear-gradient(90deg,transparent,#222,transparent)' }} />

      {/* PRICING */}
      <section style={{ background:'#070707',padding:'100px 52px' }}>
        <div style={{ textAlign:'center',marginBottom:60 }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.24em',color:'#555',textTransform:'uppercase',marginBottom:14 }}>Pricing</div>
          <h2 style={{ fontFamily:DISPLAY,fontSize:44,fontWeight:400,color:'#fff' }}>Straightforward. No surprises.</h2>
          <p style={{ fontFamily:SANS,color:'#555',marginTop:12,fontSize:14 }}>14-day free trial on all plans. Cancel anytime.</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,maxWidth:960,margin:'0 auto',border:'1px solid #1c1c1c',borderRadius:16,overflow:'hidden' }}>
          {PRICING.map((p,idx) => (
            <div key={p.tier} className="hlift" style={{ background:p.highlight?'#111':'#090909',padding:'38px 32px',borderRight:idx<2?'1px solid #1c1c1c':'none',position:'relative' }}>
              {p.badge && <div style={{ position:'absolute',top:20,right:20,background:'#fff',color:'#000',fontFamily:SANS,fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:100,letterSpacing:'.08em' }}>{p.badge}</div>}
              <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.2em',color:'#555',textTransform:'uppercase',marginBottom:10 }}>{p.tier}</div>
              <div style={{ marginBottom:8 }}>
                <span style={{ fontFamily:DISPLAY,fontSize:46,fontWeight:400,color:'#fff' }}>{p.price}</span>
                <span style={{ fontFamily:SANS,fontSize:13,color:'#555' }}>{p.period}</span>
              </div>
              <p style={{ fontFamily:SANS,fontSize:13,color:'#555',lineHeight:1.65,marginBottom:24 }}>{p.desc}</p>
              <div style={{ marginBottom:28 }}>
                {p.features.map((f,i) => (
                  <div key={i} style={{ fontFamily:SANS,fontSize:13,color:'#777',padding:'7px 0',borderBottom:'1px solid #161616',display:'flex',gap:10 }}>
                    <span style={{ color:'#fff',flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button className="wbtn" style={{ width:'100%',background:p.highlight?'#fff':'transparent',color:p.highlight?'#000':'#fff',border:'1px solid #2e2e2e',padding:'13px 0',borderRadius:7,fontSize:13,fontFamily:SANS,fontWeight:p.highlight?600:400,letterSpacing:'.04em' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height:1,background:'linear-gradient(90deg,transparent,#222,transparent)' }} />

      {/* FAQ */}
      <section style={{ padding:'80px 52px' }}>
        <div style={{ maxWidth:640,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:52 }}>
            <h2 style={{ fontFamily:DISPLAY,fontSize:40,fontWeight:400,color:'#fff' }}>Questions</h2>
          </div>
          {FAQS.map((f,i) => (
            <div key={i} style={{ borderBottom:'1px solid #1a1a1a' }}>
              <button className="fq" onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:'100%',background:'none',border:'none',color:'#ccc',padding:'20px 0',textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',gap:16,fontFamily:DISPLAY,fontSize:19,transition:'color .2s' }}>
                {f.q}
                <span style={{ color:'#555',fontSize:22,flexShrink:0,display:'inline-block',transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'none' }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontFamily:SANS,fontSize:14,color:'#666',lineHeight:1.88,paddingBottom:20,animation:'slideAcc .3s ease' }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'130px 52px',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:500,borderRadius:'50%',background:'conic-gradient(from 0deg,hsl(0,100%,60%),hsl(120,100%,55%),hsl(240,100%,65%),hsl(360,100%,60%))',filter:'blur(100px)',opacity:.055,pointerEvents:'none',animation:'hueShift 12s linear infinite' }} />
        <h2 style={{ fontFamily:DISPLAY,fontSize:60,fontWeight:400,color:'#fff',lineHeight:1.1,marginBottom:20,position:'relative' }}>
          You do the lashes.<br /><span style={{ color:'#666',fontStyle:'italic' }}>AURA does the rest.</span>
        </h2>
        <p style={{ fontFamily:SANS,color:'#555',fontSize:15,marginBottom:42,lineHeight:1.8 }}>Join beauty professionals who stopped losing money to missed calls and no-shows.</p>
        <button className="wbtn" style={{ background:'#fff',color:'#000',border:'none',padding:'16px 48px',borderRadius:7,fontSize:16,fontFamily:SANS,fontWeight:600,letterSpacing:'.05em' }}>Start Your Free Trial Today</button>
        <p style={{ fontFamily:SANS,fontSize:11,color:'#3a3a3a',marginTop:16 }}>14 days free · No card required · Cancel anytime</p>
      </section>

      <footer style={{ borderTop:'1px solid #111',padding:'36px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
        <div style={{ fontFamily:DISPLAY,fontSize:16,color:'#444',letterSpacing:'.08em' }}>AURA <span style={{ fontFamily:SANS,fontSize:9,letterSpacing:'.14em' }}>BY PSC AGENT</span></div>
        <div style={{ fontFamily:SANS,fontSize:11,color:'#3a3a3a' }}>© 2025 R and G Enterprise Solutions. All rights reserved.</div>
        <div style={{ fontFamily:SANS,fontSize:12,display:'flex',gap:20 }}>
          {['Privacy','Terms','Contact'].map(l=><span key={l} style={{ color:'#3a3a3a',cursor:'pointer' }}>{l}</span>)}
        </div>
      </footer>
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ setView }) {
  const [tab, setTab] = useState('sales')

  const NAV = [
    { id:'today',    icon:'◈', label:'Today' },
    { id:'calls',    icon:'◉', label:'Call Log' },
    { id:'reminders',icon:'◎', label:'Reminders' },
    { id:'sales',    icon:'◆', label:'Sales Agent', badge:9 },
    { id:'settings', icon:'◇', label:'Settings' },
  ]

  return (
    <div style={{ fontFamily:SANS,background:'#f7f7f5',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <style>{`
        .db-item{transition:all .15s;cursor:pointer}
        .db-item:hover{background:rgba(0,0,0,.06)!important}
        .si{transition:background .15s,color .15s;cursor:pointer;border-radius:8px}
        .si:hover{background:rgba(0,0,0,.04)!important}
        @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
        .loading{animation:shimmer 1.4s ease-in-out infinite}
        @keyframes slideMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .msg-in{animation:slideMsg .35s ease both}
        .hovbtn:hover{background:#333!important}
      `}</style>

      <div style={{ background:'#fff',borderBottom:'1px solid #ebebeb',height:56,padding:'0 24px',display:'flex',alignItems:'center',gap:16 }}>
        <button onClick={() => setView('landing')} style={{ background:'none',border:'none',fontFamily:DISPLAY,fontSize:20,cursor:'pointer',color:'#111',letterSpacing:'.08em' }}>AURA</button>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex',alignItems:'center',gap:8,background:'#f2f2f2',borderRadius:100,padding:'5px 14px' }}>
          <div style={{ width:6,height:6,borderRadius:'50%',background:'#111' }} />
          <span style={{ fontFamily:SANS,fontSize:11,color:'#333',fontWeight:500 }}>AURA Online</span>
        </div>
        <div style={{ width:30,height:30,borderRadius:'50%',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:SANS,fontSize:12,fontWeight:600 }}>R</div>
      </div>

      <div style={{ display:'flex',flex:1,overflow:'hidden' }}>
        <div style={{ width:196,background:'#fff',borderRight:'1px solid #ebebeb',padding:'16px 10px',display:'flex',flexDirection:'column',gap:2 }}>
          {NAV.map(n => (
            <div key={n.id} className="db-item si" onClick={() => setTab(n.id)} style={{ display:'flex',gap:10,alignItems:'center',padding:'9px 12px',background:tab===n.id?'#000':'transparent',color:tab===n.id?'#fff':'#555' }}>
              <span style={{ fontSize:13 }}>{n.icon}</span>
              <span style={{ fontSize:13,fontWeight:tab===n.id?500:400 }}>{n.label}</span>
              {n.badge && <span style={{ marginLeft:'auto',background:tab===n.id?'rgba(255,255,255,.2)':'#111',color:'#fff',fontSize:10,fontWeight:600,padding:'1px 7px',borderRadius:100 }}>{n.badge}</span>}
            </div>
          ))}
          <div style={{ flex:1 }} />
          <div style={{ padding:'8px 12px',fontSize:10,color:'#bbb',letterSpacing:'.1em',textTransform:'uppercase' }}>Studio Plan</div>
          <div style={{ padding:'2px 12px 12px',fontSize:11,color:'#888',fontWeight:500 }}>✓ Active</div>
        </div>

        <div style={{ flex:1,overflow:'auto',padding:28 }}>
          {tab==='today'     && <TodayTab />}
          {tab==='calls'     && <CallsTab />}
          {tab==='reminders' && <RemindersTab />}
          {tab==='sales'     && <SalesAgentTab />}
          {tab==='settings'  && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

// ── SALES AGENT ───────────────────────────────────────────────────────────
function SalesAgentTab() {
  const [segment, setSegment] = useState('all')
  const [drafts,  setDrafts]  = useState({})
  const [loading, setLoading] = useState({})
  const [sent,    setSent]    = useState({})
  const [skipped, setSkipped] = useState({})
  const [expanded,setExpanded]= useState(null)

  const filtered = SALES_CLIENTS
    .filter(c => segment==='all' || c.segment===segment)
    .filter(c => !skipped[c.id])

  const segColor = s => ({ hot_lead:'#111',gone_quiet:'#444',lapsed:'#666',promo:'#888' }[s]||'#999')

  const draftMessage = async (client) => {
    setLoading(l=>({...l,[client.id]:true}))
    setExpanded(client.id)
    try {
      const res = await fetch('/api/draft', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          clientName: client.name,
          context:    client.context,
          service:    client.service,
          source:     client.source,
          segment:    client.label,
          studioName: 'Glow Studio',
          ownerName:  'Rachel',
        })
      })
      const data = await res.json()
      setDrafts(d=>({...d,[client.id]:data.message||'Could not generate — please try again.'}))
    } catch {
      setDrafts(d=>({...d,[client.id]:'Error connecting to server. Try again.'}))
    }
    setLoading(l=>({...l,[client.id]:false}))
  }

  const segs = [
    { id:'all',        label:'All',            count:SALES_CLIENTS.length },
    { id:'hot_lead',   label:'Hot Leads',      count:SALES_CLIENTS.filter(c=>c.segment==='hot_lead').length },
    { id:'gone_quiet', label:'Gone Quiet',     count:SALES_CLIENTS.filter(c=>c.segment==='gone_quiet').length },
    { id:'lapsed',     label:'Lapsed Clients', count:SALES_CLIENTS.filter(c=>c.segment==='lapsed').length },
    { id:'promo',      label:'Promo Targets',  count:SALES_CLIENTS.filter(c=>c.segment==='promo').length },
  ]

  const sentCount = Object.values(sent).filter(Boolean).length

  return (
    <div>
      <div style={{ marginBottom:24,display:'flex',alignItems:'flex-start',justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4,letterSpacing:'.02em' }}>Sales Agent</h1>
          <p style={{ fontFamily:SANS,fontSize:13,color:'#999',lineHeight:1.6 }}>AURA identifies clients to re-engage and drafts personalised outreach for you to approve.</p>
        </div>
        <div style={{ display:'flex',gap:10 }}>
          {[{val:sentCount,label:'Sent today'},{val:filtered.length,label:'In queue'},{val:'—',label:'Replies'}].map(s=>(
            <div key={s.label} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'10px 16px',textAlign:'center',minWidth:72 }}>
              <div style={{ fontFamily:DISPLAY,fontSize:22,fontWeight:400,color:'#111' }}>{s.val}</div>
              <div style={{ fontFamily:SANS,fontSize:10,color:'#aaa' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'180px 1fr',gap:16 }}>
        {/* Segment sidebar */}
        <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:12,height:'fit-content' }}>
          <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.14em',color:'#bbb',textTransform:'uppercase',padding:'4px 8px 10px' }}>Segments</div>
          {segs.map(s=>(
            <button key={s.id} className="si" onClick={()=>setSegment(s.id)} style={{ width:'100%',background:segment===s.id?'#000':'transparent',color:segment===s.id?'#fff':'#555',border:'none',padding:'9px 10px',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:SANS,fontSize:13,fontWeight:segment===s.id?500:400,marginBottom:2 }}>
              {s.label}
              <span style={{ fontSize:11,background:segment===s.id?'rgba(255,255,255,.2)':'#f0f0f0',color:segment===s.id?'#fff':'#888',padding:'1px 7px',borderRadius:100,fontWeight:600 }}>{s.count}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {filtered.length===0 && (
            <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:40,textAlign:'center' }}>
              <div style={{ fontFamily:DISPLAY,fontSize:28,color:'#ccc',marginBottom:8 }}>◎</div>
              <div style={{ fontFamily:SANS,fontSize:14,color:'#bbb' }}>All clients in this segment have been handled.</div>
            </div>
          )}

          {filtered.map(client=>(
            <div key={client.id} style={{ background:'#fff',border:`1px solid ${sent[client.id]?'#d8d8d8':'#ebebeb'}`,borderRadius:12,overflow:'hidden',opacity:sent[client.id]?.75:1,transition:'opacity .3s' }}>
              <div style={{ padding:'16px 20px',display:'flex',alignItems:'center',gap:14 }}>
                <div style={{ width:40,height:40,borderRadius:'50%',background:sent[client.id]?'#f0f0f0':'#111',display:'flex',alignItems:'center',justifyContent:'center',color:sent[client.id]?'#aaa':'#fff',fontFamily:SANS,fontSize:12,fontWeight:600,flexShrink:0 }}>
                  {sent[client.id]?'✓':client.initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:3 }}>
                    <span style={{ fontFamily:SANS,fontSize:14,fontWeight:600,color:sent[client.id]?'#aaa':'#111' }}>{client.name}</span>
                    <span style={{ fontFamily:SANS,fontSize:10,background:segColor(client.segment),color:'#fff',padding:'2px 9px',borderRadius:100,fontWeight:500,letterSpacing:'.06em',textTransform:'uppercase' }}>{client.label}</span>
                    {client.priority==='high'&&!sent[client.id]&&<span style={{ fontFamily:SANS,fontSize:10,color:'#bbb' }}>↑ Priority</span>}
                    {sent[client.id]&&<span style={{ fontFamily:SANS,fontSize:11,color:'#bbb' }}>Message sent</span>}
                  </div>
                  <div style={{ fontFamily:SANS,fontSize:12,color:'#999',lineHeight:1.6 }}>{client.context}</div>
                  <div style={{ fontFamily:SANS,fontSize:11,color:'#c0c0c0',marginTop:4 }}>
                    Interested in: <span style={{ color:'#999' }}>{client.service}</span> · Source: <span style={{ color:'#999' }}>{client.source}</span>
                  </div>
                </div>
                {!sent[client.id]&&(
                  <div style={{ display:'flex',gap:8,flexShrink:0 }}>
                    <button className="hovbtn" onClick={()=>draftMessage(client)} style={{ background:'#111',color:'#fff',border:'none',padding:'9px 16px',borderRadius:7,fontSize:12,cursor:'pointer',fontFamily:SANS,fontWeight:500,whiteSpace:'nowrap',transition:'background .15s' }}>
                      {loading[client.id]?'Drafting…':drafts[client.id]?'Re-draft':'Draft Message'}
                    </button>
                    <button onClick={()=>setSkipped(s=>({...s,[client.id]:true}))} style={{ background:'transparent',color:'#ccc',border:'1px solid #eee',padding:'9px 14px',borderRadius:7,fontSize:12,cursor:'pointer',fontFamily:SANS }}>Skip</button>
                  </div>
                )}
              </div>

              {expanded===client.id&&(loading[client.id]||drafts[client.id])&&!sent[client.id]&&(
                <div style={{ borderTop:'1px solid #f0f0f0',padding:'16px 20px 20px',background:'#fafafa' }}>
                  <div style={{ fontFamily:SANS,fontSize:10,letterSpacing:'.14em',color:'#bbb',textTransform:'uppercase',marginBottom:10 }}>Drafted Outreach · WhatsApp / SMS</div>
                  {loading[client.id]?(
                    <div className="loading" style={{ fontFamily:SANS,fontSize:14,color:'#ccc',background:'#f0f0f0',borderRadius:8,padding:'14px 16px',lineHeight:1.8 }}>
                      Writing a personalised message for {client.name.split(' ')[0]}…
                    </div>
                  ):(
                    <div className="msg-in">
                      <textarea
                        value={drafts[client.id]}
                        onChange={e=>setDrafts(d=>({...d,[client.id]:e.target.value}))}
                        style={{ width:'100%',border:'1px solid #e0e0e0',borderRadius:8,padding:'14px 16px',fontSize:14,color:'#333',lineHeight:1.75,resize:'vertical',minHeight:80,fontFamily:SANS,background:'#fff',boxSizing:'border-box',outline:'none' }}
                      />
                      <div style={{ display:'flex',gap:10,marginTop:12,alignItems:'center' }}>
                        <button className="hovbtn" onClick={()=>{setSent(s=>({...s,[client.id]:true}));setExpanded(null)}} style={{ background:'#111',color:'#fff',border:'none',padding:'10px 22px',borderRadius:7,fontSize:13,cursor:'pointer',fontFamily:SANS,fontWeight:500,transition:'background .15s' }}>Approve & Send</button>
                        <button onClick={()=>draftMessage(client)} style={{ background:'transparent',color:'#999',border:'1px solid #e0e0e0',padding:'10px 18px',borderRadius:7,fontSize:13,cursor:'pointer',fontFamily:SANS }}>Regenerate</button>
                        <button onClick={()=>setExpanded(null)} style={{ background:'transparent',color:'#ccc',border:'none',padding:'10px 12px',fontSize:13,cursor:'pointer',fontFamily:SANS }}>Collapse</button>
                        <div style={{ marginLeft:'auto',fontFamily:SANS,fontSize:11,color:'#ccc' }}>Edit before sending</div>
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

// ── OTHER TABS ────────────────────────────────────────────────────────────
function TodayTab() {
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Good morning, Rachel</h1>
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:24 }}>Tuesday, 28 April · AURA has handled 8 calls today</div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20 }}>
        {[{v:'8',l:'Calls today'},{v:'5',l:'Bookings made'},{v:'3',l:'Reminders sent'},{v:'9',l:'Sales queue'}].map(s=>(
          <div key={s.l} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'16px 18px' }}>
            <div style={{ fontFamily:DISPLAY,fontSize:32,fontWeight:400,color:'#111',marginBottom:4 }}>{s.v}</div>
            <div style={{ fontFamily:SANS,fontSize:12,color:'#aaa' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid #f0f0f0',fontFamily:SANS,fontSize:13,fontWeight:600,color:'#111' }}>Today's Calls</div>
        {MOCK_CALLS.map((c,i)=>(
          <div key={i} style={{ display:'flex',gap:12,alignItems:'center',padding:'13px 20px',borderBottom:i<MOCK_CALLS.length-1?'1px solid #f5f5f5':'none',background:i%2===0?'#fff':'#fafafa' }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:c.ok?'#222':'#ddd',flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:SANS,fontSize:13,fontWeight:500,color:'#111' }}>{c.caller} <span style={{ fontSize:11,color:'#ccc',fontWeight:400 }}>· {c.time}</span></div>
              <div style={{ fontFamily:SANS,fontSize:11,color:'#bbb' }}>{c.detail}</div>
            </div>
            <span style={{ fontFamily:SANS,fontSize:11,background:c.ok?'#f0f0f0':'#f8f8f8',color:c.ok?'#444':'#bbb',padding:'3px 10px',borderRadius:100,fontWeight:500 }}>{c.outcome}</span>
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
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:20 }}>All inbound and outbound calls handled by AURA</div>
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
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:4 }}>Outbound Reminders</h1>
      <div style={{ fontFamily:SANS,fontSize:13,color:'#999',marginBottom:20 }}>AURA calls every client before their appointment.</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20 }}>
        {[{v:'14',l:'Reminders this week'},{v:'11',l:'Confirmed'},{v:'2',l:'No-shows prevented'}].map(s=>(
          <div key={s.l} style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:10,padding:'16px 20px' }}>
            <div style={{ fontFamily:DISPLAY,fontSize:32,fontWeight:400,color:'#111' }}>{s.v}</div>
            <div style={{ fontFamily:SANS,fontSize:12,color:'#aaa',marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,overflow:'hidden' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid #f0f0f0',fontFamily:SANS,fontSize:13,fontWeight:600,color:'#111' }}>Upcoming this week</div>
        {[
          { name:'Layla B.',  appt:'Tomorrow, 10:00 AM', svc:'Mega Volume Fullset', status:'Sent',       ok:true  },
          { name:'Chloe W.',  appt:'Tomorrow, 1:30 PM',  svc:'Classic Infill',      status:'Retry queued',ok:false },
          { name:'Nia O.',    appt:'Tomorrow, 3:00 PM',  svc:'Brow Lamination',     status:'Scheduled',  ok:null  },
          { name:'Fatima A.', appt:'Wednesday, 11:00 AM',svc:'Wispy Hybrid',        status:'Scheduled',  ok:null  },
          { name:'Grace L.',  appt:'Wednesday, 4:30 PM', svc:'Classic Fullset',     status:'Scheduled',  ok:null  },
        ].map((r,i)=>(
          <div key={i} style={{ display:'flex',gap:14,alignItems:'center',padding:'14px 20px',borderBottom:'1px solid #f5f5f5',fontFamily:SANS }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,color:'#999',fontSize:12,flexShrink:0 }}>{r.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500,color:'#111' }}>{r.name}</div>
              <div style={{ fontSize:12,color:'#bbb' }}>{r.svc} · {r.appt}</div>
            </div>
            <span style={{ fontSize:11,background:r.ok===true?'#f0f0f0':r.ok===false?'#f8f5f0':'#f8f8f8',color:r.ok===true?'#444':r.ok===false?'#999':'#bbb',padding:'3px 10px',borderRadius:100,fontWeight:500 }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h1 style={{ fontFamily:DISPLAY,fontSize:26,fontWeight:400,color:'#111',marginBottom:20 }}>Agent Settings</h1>
      <div style={{ background:'#fff',border:'1px solid #ebebeb',borderRadius:12,padding:28,maxWidth:520 }}>
        {[{l:'Agent Name',v:'AURA'},{l:'Business Name',v:'Glow Studio'},{l:'Your Booking Link',v:'https://fresha.com/glow-studio'}].map(f=>(
          <div key={f.l} style={{ marginBottom:18 }}>
            <label style={{ display:'block',fontFamily:SANS,fontSize:11,fontWeight:500,color:'#bbb',marginBottom:6,letterSpacing:'.08em',textTransform:'uppercase' }}>{f.l}</label>
            <input defaultValue={f.v} style={{ width:'100%',border:'1px solid #e8e8e8',borderRadius:7,padding:'10px 12px',fontSize:14,color:'#333',boxSizing:'border-box',outline:'none',fontFamily:SANS }} />
          </div>
        ))}
        <div style={{ marginBottom:22 }}>
          <label style={{ display:'block',fontFamily:SANS,fontSize:11,fontWeight:500,color:'#bbb',marginBottom:6,letterSpacing:'.08em',textTransform:'uppercase' }}>Greeting Script</label>
          <textarea defaultValue="Hi, you've reached Glow Studio! I'm AURA. I can book appointments, answer questions, or connect you with Rachel. How can I help?" style={{ width:'100%',border:'1px solid #e8e8e8',borderRadius:7,padding:'10px 12px',fontSize:14,color:'#333',resize:'vertical',minHeight:80,boxSizing:'border-box',fontFamily:SANS,outline:'none' }} />
        </div>
        <button style={{ background:'#111',color:'#fff',border:'none',padding:'11px 26px',borderRadius:7,fontSize:14,cursor:'pointer',fontFamily:SANS,fontWeight:500 }}>Save Changes</button>
      </div>
    </div>
  )
}
