'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Shield, Clock, User, Bot, Calendar, Zap, TrendingUp } from 'lucide-react';

/* ── Animated counter ── */
function Counter({ end, suffix = '', prefix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      const dur = 1800, fps = 60;
      let t = 0;
      const tick = setInterval(() => {
        t += 1000 / fps;
        const p = Math.min(t / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setN(Math.round(ease * end));
        if (p >= 1) clearInterval(tick);
      }, 1000 / fps);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

/* ── Cycling headline words ── */
const WORDS = ['AI chatbots', 'automation', 'SEO rankings', 'lead capture', 'booking systems'];

function CyclingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } }}
        exit={{   y: -20, opacity: 0, transition: { duration: 0.25 } }}
        style={{ display:'inline-block', background:'linear-gradient(135deg,#2AA5A0,#33BDB8,#7dd3c8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
      >
        {WORDS[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── Live AI feed mockup ── */
const FEED = [
  { icon: Bot,         label: 'Lead captured',    detail: 'After-hours inquiry → AI responded',  ago: 'just now', c: '#34d399' },
  { icon: Calendar,    label: 'Call booked',       detail: 'Qualified lead → 3:00 PM Thursday',    ago: '4m ago',   c: '#60a5fa' },
  { icon: Zap,         label: 'FAQ answered',      detail: 'Pricing question → handled by AI',      ago: '9m ago',   c: '#a78bfa' },
  { icon: TrendingUp,  label: 'Lead scored',       detail: 'High-intent visitor → flagged hot',     ago: '14m ago',  c: '#f59e0b' },
  { icon: Bot,         label: 'Intake complete',   detail: 'Form filled → added to CRM auto',       ago: '22m ago',  c: '#34d399' },
];

function AIDashboard() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => v === 3 ? 4 : v === 4 ? 5 : 3), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background:'rgba(8,13,24,.9)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:'20px 22px', backdropFilter:'blur(24px)', boxShadow:'0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(42,165,160,.15)', width:'100%', maxWidth:380 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px #34d399', animation:'hpPulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)', letterSpacing:.5 }}>Your Business · AI Active</span>
        </div>
        <span style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>Live</span>
      </div>

      {/* Metrics row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }}>
        {[
          { label:'Leads today',    val:<Counter end={47} />,  c:'#34d399' },
          { label:'Response time',  val:<><Counter end={3} />s</>, c:'#60a5fa' },
          { label:'Calls booked',   val:<Counter end={12} />,  c:'#a78bfa' },
        ].map(({ label, val, c }) => (
          <div key={label} style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:c, lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:4, fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>Recent Activity</div>
        <AnimatePresence>
          {FEED.slice(0, visible).map(({ icon: Icon, label, detail, ago, c }, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity:0, x:10, height:0 }}
              animate={{ opacity:1, x:0, height:'auto', transition:{ duration:.35, ease:[0.22,1,0.36,1], delay: i * 0.04 } }}
              exit={{ opacity:0, height:0 }}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'rgba(255,255,255,.035)', borderRadius:10, border:'1px solid rgba(255,255,255,.05)', overflow:'hidden' }}
            >
              <div style={{ width:28, height:28, borderRadius:8, background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={13} color={c} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{label}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{detail}</div>
              </div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.25)', flexShrink:0, fontWeight:600 }}>{ago}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Hero() {
  const reduced = useReducedMotion();
  const f = (delay = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 32 },
    whileInView: { opacity:1, y:0, transition:{ duration:.75, ease:[0.22,1,0.36,1], delay } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="p0" aria-label="AIandWEBservices — AI Automation, Web Development and SEO for Small Business">
      {/* Layered background */}
      <div className="hp-hero-bg">
        <div className="hp-orb hp-orb1" />
        <div className="hp-orb hp-orb2" />
        <div className="hp-orb hp-orb3" />
        <div className="hp-grid" />
      </div>

      <div className="hero-inner hp-hero-inner">
        <div className="hp-hero-cols">

          {/* LEFT */}
          <div className="hp-hero-left">
            <motion.div {...f(0)}>
              <div className="hp-eyebrow">
                <span className="hp-dot" />
                AI · WEB · AUTOMATION · SEO
              </div>
            </motion.div>

            <motion.h1 {...f(0.07)} className="hp-h1">
              Stop losing leads<br />
              to businesses with<br />
              <span style={{ display:'inline-flex', alignItems:'baseline', gap:12, flexWrap:'wrap' }}>
                better&nbsp;<CyclingWord />.
              </span>
            </motion.h1>

            <motion.p {...f(0.15)} className="hp-sub">
              <strong>Custom AI systems, high-converting websites, and automation pipelines</strong> built personally
              for small businesses — so you capture every lead and stop doing things manually.
            </motion.p>

            <motion.div {...f(0.22)} style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:8 }}>
              <button className="hp-btn-primary" onClick={() => window.go && window.go(7)} aria-label="Get a free AI audit">
                Get Your Free Audit
              </button>
              <button className="hp-btn-ghost" onClick={() => window.go && window.go(3)} aria-label="See services and pricing">
                See Services &amp; Pricing
              </button>
            </motion.div>

            <motion.div {...f(0.30)} className="hp-trust-row">
              {[
                { icon: Shield, t: 'No contracts',     s: 'Cancel anytime'    },
                { icon: Clock,  t: '6-hour response',  s: 'Guaranteed'        },
                { icon: User,   t: 'Direct to David',  s: 'No middlemen'      },
              ].map(({ icon: I, t, s }) => (
                <div key={t} className="hp-trust-badge">
                  <I size={13} color="#2AA5A0" />
                  <span className="hp-trust-t">{t}</span>
                  <span className="hp-trust-s">· {s}</span>
                </div>
              ))}
            </motion.div>

            {/* Mini stat strip */}
            <motion.div {...f(0.38)} className="hp-stats-strip">
              {[
                { n: 24, s: '/7',  label: 'AI availability'   },
                { n: 7,  s: '-14d', label: 'Avg delivery'     },
                { n: 0,  s: ' contracts', label: 'Required'   },
              ].map(({ n, s, label }) => (
                <div key={label} className="hp-stat">
                  <span className="hp-stat-n"><Counter end={n} suffix={s} /></span>
                  <span className="hp-stat-l">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div {...f(0.12)} className="hp-hero-right">
            <AIDashboard />
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes hpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes hpOrb   { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.15) translate(20px,-20px)} }
        @keyframes hpOrb2  { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(-15px,25px)} }

        .hp-hero-bg { position:absolute;inset:0;background:#080d18;overflow:hidden;z-index:0; }
        .hp-grid {
          position:absolute;inset:0;
          background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
        }
        .hp-orb { position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none; }
        .hp-orb1 { width:600px;height:600px;top:-100px;left:-100px;background:radial-gradient(circle,rgba(42,165,160,.18) 0%,transparent 70%);animation:hpOrb 12s ease-in-out infinite; }
        .hp-orb2 { width:500px;height:500px;bottom:-80px;right:-80px;background:radial-gradient(circle,rgba(96,165,250,.12) 0%,transparent 70%);animation:hpOrb2 15s ease-in-out infinite; }
        .hp-orb3 { width:300px;height:300px;top:50%;right:30%;background:radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%); }

        .hp-hero-inner {
          position:relative;z-index:2;
          height:100%;display:flex;align-items:center;justify-content:center;
          padding:0 6vw;
        }
        .hp-hero-cols {
          display:flex;align-items:center;gap:56px;width:100%;max-width:1200px;
        }
        .hp-hero-left  { flex:1;min-width:0; }
        .hp-hero-right { flex:0 0 380px;display:flex;align-items:center;justify-content:center; }

        .hp-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(42,165,160,.12);border:1px solid rgba(42,165,160,.25);
          border-radius:50px;padding:5px 16px;
          font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
          color:rgba(255,255,255,.65);margin-bottom:22px;
        }
        .hp-dot { width:6px;height:6px;border-radius:50%;background:#2AA5A0;box-shadow:0 0 8px #2AA5A0;animation:hpPulse 2s ease-in-out infinite;flex-shrink:0; }

        .hp-h1 {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:clamp(38px,4.8vw,68px);
          font-weight:800;line-height:1.08;letter-spacing:-1.5px;
          color:#fff;margin-bottom:20px;
        }
        .hp-sub {
          font-size:16px;color:rgba(255,255,255,.5);line-height:1.8;
          max-width:520px;margin-bottom:28px;
        }
        .hp-sub strong { color:rgba(255,255,255,.8);font-weight:600; }

        .hp-btn-primary {
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#2AA5A0,#33BDB8);
          color:#fff;border:none;border-radius:50px;
          padding:14px 28px;font-size:15px;font-weight:700;
          cursor:pointer;font-family:'Inter',sans-serif;
          box-shadow:0 8px 28px rgba(42,165,160,.45);
          transition:all .25s;
        }
        .hp-btn-primary:hover { transform:translateY(-2px);box-shadow:0 14px 36px rgba(42,165,160,.55); }

        .hp-btn-ghost {
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(255,255,255,.05);
          color:rgba(255,255,255,.7);
          border:1px solid rgba(255,255,255,.15);border-radius:50px;
          padding:14px 24px;font-size:15px;font-weight:600;
          cursor:pointer;font-family:'Inter',sans-serif;transition:all .22s;
        }
        .hp-btn-ghost:hover { background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.3);color:#fff; }

        .hp-trust-row { display:flex;gap:16px;flex-wrap:wrap;margin-top:24px;margin-bottom:0; }
        .hp-trust-badge {
          display:flex;align-items:center;gap:6px;
          font-size:12px;color:rgba(255,255,255,.5);
        }
        .hp-trust-t { color:rgba(255,255,255,.8);font-weight:600; }
        .hp-trust-s { color:rgba(255,255,255,.35); }

        .hp-stats-strip {
          display:flex;gap:32px;margin-top:28px;
          padding-top:24px;border-top:1px solid rgba(255,255,255,.07);
        }
        .hp-stat { display:flex;flex-direction:column;gap:2px; }
        .hp-stat-n {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:22px;font-weight:800;
          background:linear-gradient(135deg,#2AA5A0,#7dd3c8);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .hp-stat-l { font-size:11px;color:rgba(255,255,255,.35);font-weight:500; }

        @media (max-width:900px) {
          .hp-hero-cols  { flex-direction:column;gap:32px;text-align:center; }
          .hp-hero-right { display:none; }
          .hp-hero-left  { display:flex;flex-direction:column;align-items:center; }
          .hp-sub        { text-align:center;max-width:100%; }
          .hp-trust-row  { justify-content:center; }
          .hp-stats-strip{ justify-content:center; }
        }
        @media (max-width:560px) {
          .hp-hero-inner { padding:80px 5vw 40px; }
          .hp-h1         { font-size:clamp(30px,9vw,48px); }
          .hp-stats-strip{ display:none; }
          .hp-trust-row  { gap:10px; }
        }
      `}</style>
    </section>
  );
}
