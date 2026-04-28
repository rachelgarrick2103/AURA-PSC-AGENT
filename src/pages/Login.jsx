import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const SANS = "'DM Sans', system-ui, sans-serif"
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'rachel@pscagent.com'

export default function LoginPage({ onLogin, setView }) {
  const [mode, setMode]       = useState('login')   // login | forgot
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const isAdmin = data.user.email === ADMIN_EMAIL
    onLogin(data.user, isAdmin ? 'admin' : 'subscriber')
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
    } else {
      setMessage('Check your email for a password reset link.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:SANS }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .login-card { animation: fadeUp .5s ease both; }
        .inp:focus { border-color: #444 !important; outline: none; }
        .inp { transition: border-color .2s; }
        .orb-bg {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: conic-gradient(from 0deg,hsl(0,100%,60%),hsl(90,100%,55%),hsl(180,100%,58%),hsl(270,100%,62%),hsl(360,100%,60%));
          filter: blur(120px); opacity: .04; pointer-events: none;
          animation: spin 20s linear infinite;
        }
        @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
      `}</style>

      <div className="orb-bg" />

      {/* Logo */}
      <div onClick={() => setView('landing')} style={{ fontFamily:DISPLAY, fontSize:26, letterSpacing:'.1em', color:'#fff', marginBottom:40, cursor:'pointer', position:'relative' }}>
        AURA <span style={{ fontFamily:SANS, fontSize:10, letterSpacing:'.18em', color:'#444', verticalAlign:'middle', marginLeft:8 }}>BY PSC AGENT</span>
      </div>

      <div className="login-card" style={{ background:'#0d0d0d', border:'1px solid #1e1e1e', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:400, position:'relative' }}>

        <h2 style={{ fontFamily:DISPLAY, fontSize:28, fontWeight:400, color:'#fff', marginBottom:6, letterSpacing:'.02em' }}>
          {mode==='login' ? 'Sign in to your dashboard' : 'Reset your password'}
        </h2>
        <p style={{ fontSize:13, color:'#555', marginBottom:28, lineHeight:1.6 }}>
          {mode==='login' ? 'Enter your credentials to access your AURA account.' : "We'll send a reset link to your email."}
        </p>

        <form onSubmit={mode==='login' ? handleLogin : handleForgot}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, color:'#666', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:7 }}>Email</label>
            <input
              className="inp"
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="hello@yourstudio.com"
              style={{ width:'100%', background:'#111', border:'1px solid #2a2a2a', borderRadius:8, padding:'12px 14px', color:'#fff', fontSize:14, boxSizing:'border-box', fontFamily:SANS }}
            />
          </div>

          {mode==='login' && (
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:11, color:'#666', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:7 }}>Password</label>
              <input
                className="inp"
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width:'100%', background:'#111', border:'1px solid #2a2a2a', borderRadius:8, padding:'12px 14px', color:'#fff', fontSize:14, boxSizing:'border-box', fontFamily:SANS }}
              />
            </div>
          )}

          {error   && <div style={{ fontSize:13, color:'#e87070', marginBottom:16, padding:'10px 14px', background:'rgba(232,112,112,.08)', borderRadius:8, border:'1px solid rgba(232,112,112,.2)' }}>{error}</div>}
          {message && <div style={{ fontSize:13, color:'#7acf96', marginBottom:16, padding:'10px 14px', background:'rgba(122,207,150,.08)', borderRadius:8, border:'1px solid rgba(122,207,150,.2)' }}>{message}</div>}

          <button type="submit" disabled={loading} style={{ width:'100%', background:'#fff', color:'#000', border:'none', padding:'13px 0', borderRadius:8, fontSize:14, fontWeight:600, fontFamily:SANS, cursor:loading?'not-allowed':'pointer', opacity:loading?.6:1, letterSpacing:'.04em', transition:'background .2s' }}
            onMouseOver={e=>{if(!loading)e.target.style.background='#ddd'}}
            onMouseOut={e=>e.target.style.background='#fff'}>
            {loading ? 'Please wait...' : mode==='login' ? 'Sign In' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop:20, display:'flex', justifyContent:'space-between', fontSize:13 }}>
          {mode==='login' ? (
            <button onClick={() => { setMode('forgot'); setError(''); }} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontFamily:SANS, fontSize:13 }}>Forgot password?</button>
          ) : (
            <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontFamily:SANS, fontSize:13 }}>← Back to sign in</button>
          )}
        </div>
      </div>

      <p style={{ marginTop:24, fontSize:12, color:'#333', fontFamily:SANS }}>
        Need access?{' '}
        <button onClick={() => setView('landing')} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontFamily:SANS, fontSize:12, textDecoration:'underline' }}>
          Visit AURA to subscribe
        </button>
      </p>
    </div>
  )
}
