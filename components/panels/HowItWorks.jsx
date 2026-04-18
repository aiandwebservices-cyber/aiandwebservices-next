'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

/* ── Chat simulation ── */
const CHAT = [
  { from:'user', text:'Hi, I need a quote for a new roof',                  delay:500  },
  { from:'bot',  text:"Hey! Happy to help 👋 What's your zip code?",       delay:1800 },
  { from:'user', text:'33142 — Miami',                                      delay:3100 },
  { from:'bot',  text:'Got it. Flat or pitched?',                           delay:4300 },
  { from:'user', text:'Pitched, about 2,200 sq ft',                         delay:5700 },
  { from:'bot',  text:'Want to book a free inspection this week?',           delay:7100 },
  { from:'user', text:'Yes please',                                          delay:8300 },
  { from:'book', text:'📅 Booked — Fri 10am · CRM updated · Owner notified',delay:9500 },
];

function ChatMockup() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (shown >= CHAT.length) {
      const t = setTimeout(() => setShown(0), 4000);
      return () => clearTimeout(t);
    }
    const msg = CHAT[shown];
    const prev = CHAT[shown - 1];
    const gap = shown === 0 ? msg.delay : msg.delay - prev.delay;
    const t = setTimeout(() => {
      if (msg.from === 'bot') {
        setTyping(true);
        setTimeout(() => { setTyping(false); setShown(v => v + 1); }, 900);
      } else {
        setShown(v => v + 1);
      }
    }, gap);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, [shown, typing]);

  const msgs = CHAT.slice(0, shown);

  return (
    <div className="hiw-phone">
      <div className="hiw-phone-bar">
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#2AA5A0,#33BDB8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:'#fff',lineHeight:1.2 }}>Your AI Assistant</div>
            <div style={{ fontSize:9,color:'#34d399',fontWeight:600,display:'flex',alignItems:'center',gap:4,marginTop:2 }}>
              <span style={{ width:5,height:5,borderRadius:'50%',background:'#34d399',display:'inline-block',animation:'hiwBlink 1.5s ease-in-out infinite' }}/>
              Online 24/7
            </div>
          </div>
        </div>
        <div style={{ fontSize:9,color:'rgba(255,255,255,.2)',fontWeight:600 }}>AIandWEBservices</div>
      </div>

      <div className="hiw-msgs">
        <AnimatePresence>
          {msgs.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:8, scale:.96 }}
              animate={{ opacity:1, y:0, scale:1, transition:{ duration:.28, ease:[0.22,1,0.36,1] } }}
              className={`hiw-msg hiw-msg-${m.from}`}
            >
              {m.from === 'book'
                ? <div className="hiw-book">{m.text}</div>
                : <div className={`hiw-bubble hiw-bubble-${m.from}`}>{m.text}</div>
              }
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="hiw-msg hiw-msg-bot">
              <div className="hiw-bubble hiw-bubble-bot hiw-typing"><span/><span/><span/></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef}/>
      </div>

      <div className="hiw-phone-foot">
        <div style={{ flex:1,background:'rgba(255,255,255,.06)',borderRadius:20,padding:'8px 14px',fontSize:11,color:'rgba(255,255,255,.25)' }}>Type a message…</div>
        <div style={{ width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#2AA5A0,#33BDB8)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <span style={{ fontSize:12,transform:'rotate(90deg)',display:'block',color:'#fff' }}>➤</span>
        </div>
      </div>
    </div>
  );
}

/* ── Steps ── */
const STEPS = [
  {
    n:'01', color:'#2AA5A0',
    title:'Free AI Audit',
    body:'30 min call. I map your biggest gaps and tell you exactly where AI wins you time and money.',
    micro:'No pitch · No obligation',
    stat:'30 min',
  },
  {
    n:'02', color:'#60a5fa',
    title:'Build',
    body:'I handle everything — website, AI chatbot, automations, CRM. You get a live preview first.',
    micro:'7–14 day delivery',
    stat:'7–14 days',
  },
  {
    n:'03', color:'#a78bfa',
    title:'Launch Together',
    body:"We go live side by side. I'm on-call 48 hours post-launch. Nothing handed off cold.",
    micro:'48hr on-call included',
    stat:'48hr support',
  },
  {
    n:'04', color:'#34d399',
    title:'Grow Every Month',
    body:'Monthly retainer keeps your AI improving — smarter responses, new automations, better rankings.',
    micro:'Compounding results',
    stat:'Ongoing',
  },
];

/* ── Animated counter ── */
function Counter({ value, suffix, color }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(value / 35));
    const t = setInterval(() => {
      n += step;
      if (n >= value) { setCount(value); clearInterval(t); }
      else setCount(n);
    }, 28);
    return () => clearInterval(t);
  }, [value]);
  return <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:800, color, lineHeight:1 }}>{count}{suffix}</span>;
}

const METRICS = [
  { label:'Leads today',   value:47, suffix:'',  color:'#2AA5A0' },
  { label:'Response time', value:3,  suffix:'s', color:'#60a5fa' },
  { label:'Calls booked',  value:12, suffix:'',  color:'#a78bfa' },
  { label:'Open rate',     value:94, suffix:'%', color:'#34d399' },
];

const FEED = [
  { dot:'#34d399', text:'New lead — Maria S., Miami FL',    time:'Just now' },
  { dot:'#60a5fa', text:'Appointment booked — Thu 2pm',      time:'4m ago'   },
  { dot:'#2AA5A0', text:'FAQ answered — pricing inquiry',    time:'11m ago'  },
  { dot:'#a78bfa', text:'Lead qualified — roofing estimate', time:'23m ago'  },
];

export default function HowItWorks() {
  const reduced = useReducedMotion();

  const f = (d = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 22 },
    whileInView: { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="p2" aria-label="How AIandWEBservices works — AI audit, build, launch and grow in 4 steps">
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'#f8fafc', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(42,165,160,.055) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:600, height:500, background:'radial-gradient(circle,rgba(42,165,160,.09) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:0, width:500, height:400, background:'radial-gradient(circle,rgba(96,165,250,.06) 0%,transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }} />
      </div>

      <div className="hiw-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* ── CENTERED HEADER ── */}
          <motion.div {...f(0)} style={{ textAlign:'center', marginBottom:20 }}>
            <div className="hiw-eyebrow">How It Works</div>
            <h2 className="hiw-h2">Four steps.<br/><span className="hiw-h2-accent">Fully automated.</span></h2>
            <p className="hiw-sub">No tech knowledge required. Most clients are live in under 2 weeks.</p>
          </motion.div>

          {/* ── MAIN 3-COL ── */}
          <div className="hiw-layout">

            {/* LEFT: Chat mockup */}
            <motion.div {...f(0.08)} className="hiw-col-chat">
              <div className="hiw-col-label">Watch your AI capture a real lead</div>
              <ChatMockup/>
              <div className="hiw-insight">
                <span style={{ fontSize:13 }}>💡</span>
                <p style={{ fontSize:11, color:'#6b7280', lineHeight:1.6, margin:0 }}>
                  <strong style={{ color:'#374151' }}>This is what your customers see.</strong>{' '}
                  Trained on your business. Books real appointments 24/7.
                </p>
              </div>
              <div style={{ marginTop:'auto', paddingTop:16 }}>
                <button className="hiw-cta" onClick={() => window.go && window.go(7)}>
                  Get Your Free Audit
                </button>
                <p style={{ fontSize:10, color:'#9ca3af', marginTop:6 }}>30 minutes · No obligation · Honest answer</p>
              </div>
            </motion.div>

            {/* CENTER: Steps 2×2 grid */}
            <motion.div {...f(0.04)} className="hiw-col-steps">
              <div className="hiw-steps-grid">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity:0, y: reduced ? 0 : 18 }}
                    whileInView={{ opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1], delay: 0.06 + i * 0.08 } }}
                    viewport={{ once:true, amount:.05 }}
                    className="hiw-step-card"
                    style={{ borderColor:`${s.color}25`, borderLeft:`3px solid ${s.color}` }}
                  >
                    {/* Number — large, prominent */}
                    <div className="hiw-step-n" style={{ color:`${s.color}30` }}>{s.n}</div>
                    {/* Connector arrow between cards */}
                    {i % 2 === 0 && i < 2 && (
                      <div className="hiw-connector-h" style={{ color:`${s.color}50` }}>→</div>
                    )}
                    <div className="hiw-step-title" style={{ color:'#111827' }}>{s.title}</div>
                    <div className="hiw-step-body">{s.body}</div>
                    <div className="hiw-step-micro" style={{ color:s.color }}>
                      <span style={{ width:5,height:5,borderRadius:'50%',background:s.color,display:'inline-block',marginRight:5,verticalAlign:'middle' }}/>
                      {s.micro}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Connector between rows */}
              <div className="hiw-connector-v">
                <div style={{ width:2,flex:1,background:'linear-gradient(to bottom,rgba(42,165,160,.3),rgba(96,165,250,.3))',borderRadius:99 }}/>
              </div>
            </motion.div>

            {/* RIGHT: Compact dashboard */}
            <motion.div {...f(0.14)} className="hiw-col-metrics">
              <div className="hiw-col-label">Sample client dashboard</div>
              <div className="hiw-metrics-card">
                <div className="hiw-metrics-header">
                  <span style={{ width:6,height:6,borderRadius:'50%',background:'#34d399',display:'inline-block',animation:'hiwBlink 1.5s ease-in-out infinite' }}/>
                  <span style={{ fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>Live — Demo Data</span>
                </div>

                {/* 2×2 metrics */}
                <div className="hiw-metrics-grid">
                  {METRICS.map(m => (
                    <div key={m.label} className="hiw-metric">
                      <Counter value={m.value} suffix={m.suffix} color={m.color} />
                      <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', fontWeight:600, textTransform:'uppercase', letterSpacing:.4, marginTop:3 }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Compact activity feed */}
                <div style={{ fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'rgba(255,255,255,.2)', marginBottom:7 }}>Recent activity</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {FEED.map(({ dot, text, time }, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 7px', background:'rgba(255,255,255,.03)', borderRadius:7 }}>
                      <div style={{ width:5,height:5,borderRadius:'50%',background:dot,flexShrink:0 }}/>
                      <div style={{ flex:1, fontSize:10, color:'rgba(255,255,255,.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{text}</div>
                      <div style={{ fontSize:8, color:'rgba(255,255,255,.2)', flexShrink:0 }}>{time}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.05)', fontSize:9, color:'rgba(255,255,255,.2)', textAlign:'center', lineHeight:1.5 }}>
                  Your clients see this from day 1<br/>
                  <span style={{ color:'rgba(42,165,160,.5)' }}>Real data · Coming soon</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Bottom chips ── */}
          <motion.div {...f(0.3)} className="hiw-chips">
            <button className="hiw-chip hiw-chip-primary" onClick={() => window.go && window.go(7)}>
              🎯 Get Your Free Audit
            </button>
            <a href="mailto:david@aiandwebservices.com" className="hiw-chip">
              ✉️ Contact David Directly
            </a>
            <a href="/blog" className="hiw-chip">
              📖 Read the Blog
            </a>
            <button className="hiw-chip" onClick={() => window.go && window.go(3)}>
              💰 See Pricing
            </button>
          </motion.div>

        </div>
      </div>

      <style>{`
        .hiw-inner { position:relative;height:100%;display:flex;flex-direction:column;padding:74px 5vw 28px;background:#f8fafc;overflow-y:auto; }

        /* Centered header */
        .hiw-eyebrow { display:block;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:8px; }
        @keyframes hiwBlink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .hiw-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3vw,42px);font-weight:800;letter-spacing:-1.5px;line-height:1.1;color:#111827;margin-bottom:6px; }
        .hiw-h2-accent { color:#2AA5A0; }
        .hiw-sub { font-size:13px;color:#6b7280;line-height:1.6; }

        /* 3-col layout */
        .hiw-layout { display:grid;grid-template-columns:260px 1fr 220px;gap:20px;flex:1;align-items:start;min-height:0; }

        /* Column labels */
        .hiw-col-label { font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:9px; }

        /* LEFT: chat */
        .hiw-col-chat { display:flex;flex-direction:column;height:100%; }
        .hiw-insight { display:flex;align-items:flex-start;gap:8px;background:rgba(42,165,160,.06);border:1px solid rgba(42,165,160,.14);border-radius:10px;padding:10px 11px;margin-top:9px; }
        .hiw-cta { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border:none;border-radius:50px;padding:11px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 6px 20px rgba(42,165,160,.3);transition:all .25s;width:100%;justify-content:center; }
        .hiw-cta:hover { transform:translateY(-2px);box-shadow:0 12px 28px rgba(42,165,160,.45); }

        /* Phone */
        .hiw-phone { background:#111827;border-radius:14px;overflow:hidden;box-shadow:0 20px 56px rgba(0,0,0,.16),0 0 0 1px rgba(255,255,255,.05); }
        .hiw-phone-bar { display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06); }
        .hiw-msgs { padding:10px;display:flex;flex-direction:column;gap:6px;min-height:160px;max-height:210px;overflow:hidden; }
        .hiw-phone-foot { display:flex;align-items:center;gap:7px;padding:8px 10px;border-top:1px solid rgba(255,255,255,.05); }
        .hiw-msg { display:flex; }
        .hiw-msg-user { justify-content:flex-end; }
        .hiw-msg-bot,.hiw-msg-book { justify-content:flex-start; }
        .hiw-bubble { padding:7px 11px;border-radius:12px;font-size:11px;line-height:1.5;max-width:85%; }
        .hiw-bubble-user { background:#2AA5A0;color:#fff;border-bottom-right-radius:3px; }
        .hiw-bubble-bot { background:rgba(255,255,255,.08);color:rgba(255,255,255,.82);border-bottom-left-radius:3px; }
        .hiw-book { background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);border-radius:9px;padding:6px 10px;font-size:10px;font-weight:700;color:#34d399; }
        .hiw-typing span { display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.35);margin:0 2px;animation:hiwDot 1.2s ease-in-out infinite; }
        .hiw-typing span:nth-child(2){animation-delay:.2s} .hiw-typing span:nth-child(3){animation-delay:.4s}
        @keyframes hiwDot { 0%,80%,100%{transform:scale(1);opacity:.35} 40%{transform:scale(1.4);opacity:1} }

        /* CENTER: 2×2 step cards */
        .hiw-col-steps { display:flex;flex-direction:column;position:relative; }
        .hiw-steps-grid { display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;flex:1; }
        .hiw-step-card {
          position:relative;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:16px 16px 14px;
          overflow:hidden;
          transition:box-shadow .25s,transform .25s;
        }
        .hiw-step-card:hover { transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.09); }
        .hiw-step-n {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:52px;font-weight:900;line-height:1;
          position:absolute;top:6px;right:10px;
          letter-spacing:-2px;
          pointer-events:none;
          transition:color .25s;
        }
        .hiw-step-card:hover .hiw-step-n { opacity:.5; }
        .hiw-step-title { font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:800;color:#111827;margin-bottom:6px;position:relative;z-index:1; }
        .hiw-step-body { font-size:11px;color:#6b7280;line-height:1.65;margin-bottom:10px;position:relative;z-index:1; }
        .hiw-step-micro { font-size:10px;font-weight:700;position:relative;z-index:1; }

        /* Connector between rows (decorative) */
        .hiw-connector-h { position:absolute;font-size:16px;right:-18px;top:50%;transform:translateY(-50%);z-index:2; }
        .hiw-connector-v { display:none; }

        /* RIGHT: compact metrics */
        .hiw-col-metrics { display:flex;flex-direction:column; }
        .hiw-metrics-card { background:#111827;border-radius:14px;padding:14px 13px;border:1px solid rgba(255,255,255,.06);flex:1; }
        .hiw-metrics-header { display:flex;align-items:center;gap:6px;margin-bottom:12px; }
        .hiw-metrics-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px; }
        .hiw-metric { background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:9px;padding:9px 10px; }

        /* Bottom chips */
        .hiw-chips { display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:14px; }
        .hiw-chip { display:inline-flex;align-items:center;gap:6px;background:rgba(42,165,160,.07);border:1px solid rgba(42,165,160,.18);border-radius:50px;padding:7px 14px;font-size:11px;font-weight:700;color:#2AA5A0;cursor:pointer;font-family:'Inter',sans-serif;text-decoration:none;transition:all .2s; }
        .hiw-chip:hover { background:rgba(42,165,160,.14);border-color:rgba(42,165,160,.38);transform:translateY(-1px); }
        .hiw-chip-primary { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(42,165,160,.28); }
        .hiw-chip-primary:hover { box-shadow:0 8px 22px rgba(42,165,160,.44); }

        @media (max-width:1100px) {
          .hiw-layout { grid-template-columns:260px 1fr; }
          .hiw-col-metrics { display:none; }
        }
        @media (max-width:800px) {
          .hiw-layout { grid-template-columns:1fr; }
          .hiw-col-chat { display:none; }
          .hiw-steps-grid { grid-template-columns:1fr 1fr; }
        }
        @media (max-width:480px) {
          .hiw-steps-grid { grid-template-columns:1fr; }
          .hiw-inner { padding:74px 5vw 28px; }
        }
      `}</style>
    </section>
  );
}
