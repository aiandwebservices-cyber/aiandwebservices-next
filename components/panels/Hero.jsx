'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Shield, Zap, Clock, Bot, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

const ROTATE_WORDS = ['tech', 'AI', 'automation', 'websites', 'SEO', 'systems'];

function RotatingWord({ reduced }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(v => (v + 1) % ROTATE_WORDS.length), 1900);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ display:'inline-block', position:'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ display:'inline-block' }}
        >
          {ROTATE_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Animated counter ── */
function Num({ end, suffix = '', prefix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      let t = 0;
      const id = setInterval(() => {
        t += 16;
        const p = Math.min(t / 1400, 1);
        setN(Math.round((1 - Math.pow(1 - p, 3)) * end));
        if (p >= 1) clearInterval(id);
      }, 16);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

/* ── Live AI Activity Feed ── */
const FEED = [
  { icon: Bot,           label: 'Lead captured',    detail: 'After-hours inquiry → AI responded instantly', ago: 'just now', c: '#34d399' },
  { icon: Calendar,      label: 'Call booked',      detail: 'Qualified lead → Thursday 3:00 PM',           ago: '4m ago',   c: '#60a5fa' },
  { icon: MessageSquare, label: 'FAQ answered',     detail: 'Pricing question → handled automatically',     ago: '9m ago',   c: '#a78bfa' },
  { icon: TrendingUp,    label: 'Lead scored',      detail: 'High-intent visitor → flagged as hot',         ago: '14m ago',  c: '#f59e0b' },
  { icon: Bot,           label: 'Intake complete',  detail: 'Contact form → added to CRM',                  ago: '22m ago',  c: '#34d399' },
];

function AIDashboard() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => v >= 5 ? 3 : v + 1), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-dash">
      {/* Header */}
      <div className="h-dash-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
          <img src="/logo-icon-transparent.png" alt="AIandWEB" style={{ width:20, height:20, borderRadius:5, flexShrink:0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.8)', letterSpacing: .3 }}>Your AI — working right now</span>
          <div className="h-dash-pulse" />
        </div>
      </div>

      {/* Metrics */}
      <div className="h-dash-metrics">
        {[
          { label: 'Leads today', val: <Num end={47} />, c: '#34d399' },
          { label: 'Response', val: <><Num end={3} />s</>, c: '#60a5fa' },
          { label: 'Booked', val: <Num end={12} />, c: '#a78bfa' },
        ].map(({ label, val, c }) => (
          <div key={label} className="h-dash-metric">
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, color: c, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.7)', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>Recent Activity</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: 'clamp(100px, 14vh, 186px)', overflow: 'hidden' }}>
          <AnimatePresence mode="popLayout">
            {FEED.slice(0, visible).map(({ icon: Icon, label, detail, ago, c }, i) => (
              <motion.div
                key={`${label}-${i}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0, transition: { duration: .4, ease: [0.21, 0.47, 0.32, 0.98], delay: i * 0.03 } }}
                exit={{ opacity: 0, x: -12, transition: { duration: .2 } }}
                className="h-dash-row"
              >
                <div className="h-dash-icon" style={{ background: `${c}18` }}>
                  <Icon size={13} color={c} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</div>
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.2)', flexShrink: 0, fontWeight: 600 }}>{ago}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Hero() {
  const reduced = useReducedMotion();
  const ease = [0.21, 0.47, 0.32, 0.98];

  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 36 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section className="panel" id="p0" aria-label="AIandWEBservices — AI automation, web development and SEO for small business">
      {/* ── Background ── */}
      <div className="h-bg" aria-hidden="true">
        <div className="h-orb h-orb-1" />
        <div className="h-orb h-orb-2" />
        <div className="h-orb h-orb-3" />
        <div className="h-dots" />
        <div className="h-ring" />
      </div>

      <div className="hero-inner">
        {/* ── Top: Centered text ── */}
        <div className="h-top">
          <h1 className="h-h1">
            <motion.span {...reveal(0.1)} className="h-line">Stop losing leads</motion.span>
            <motion.span {...reveal(0.22)} className="h-line">to competitors with</motion.span>
            <motion.span {...reveal(0.34)} className="h-line" style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:'0.25em', paddingLeft:'0.25em' }}>
              <span>better</span>
              <span style={{ display:'inline-block', minWidth:'8ch', textAlign:'left', overflow:'hidden' }}>
                <span className="h-line-accent"><RotatingWord reduced={reduced} /></span>
              </span>
            </motion.span>
          </h1>

          <motion.p {...reveal(0.55)} className="h-sub">
            AI automation, a converting website, and SEO that ranks. One person. One price.
          </motion.p>

          <motion.div {...reveal(0.68)} className="h-ctas">
            <a className="h-btn-primary" href="/contact">
              Get Your Free Audit
            </a>
          </motion.div>

          <motion.div {...reveal(0.82)} className="h-trust">
            {[
              { icon: Shield, text: 'No contracts',          color: '#34d399' },
              { icon: Zap,    text: '6-hour response time',  color: '#2AA5A0' },
              { icon: Clock,  text: 'Live in 14 days or less', color: '#f59e0b' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="h-trust-chip">
                <Icon size={14} color={color} strokeWidth={2} />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="h-dashboard-wrap"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
          >
            <AIDashboard />
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.button
          className="h-scroll"
          id="scroll-hint"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          onClick={() => window.go && window.go(1)}
          aria-label="Scroll to next section"
        >
          <span className="h-scroll-label">Explore</span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} color="rgba(255,255,255,.4)" style={{ transform: 'rotate(-90deg)' }} />
          </motion.div>
        </motion.button>
      </div>

      <style>{`
        /* ── Background ── */
        .h-bg { position:absolute;inset:0;background:#080d18;overflow:hidden; }
        .h-dots {
          position:absolute;inset:0;
          background-image:radial-gradient(rgba(42,165,160,.07) 1px,transparent 1px);
          background-size:28px 28px;
        }
        .h-orb {
          position:absolute;border-radius:50%;pointer-events:none;
          will-change:transform;filter:blur(100px);
        }
        .h-orb-1 {
          width:750px;height:750px;top:-22%;right:-12%;
          background:radial-gradient(circle,rgba(42,165,160,.25) 0%,transparent 70%);
          animation:hO1 22s ease-in-out infinite;
        }
        .h-orb-2 {
          width:550px;height:550px;bottom:-18%;left:-8%;
          background:radial-gradient(circle,rgba(42,165,160,.1) 0%,transparent 70%);
          animation:hO2 28s ease-in-out infinite;
        }
        .h-orb-3 {
          width:400px;height:400px;top:35%;left:45%;
          background:radial-gradient(circle,rgba(80,180,220,.05) 0%,transparent 70%);
          animation:hO3 32s ease-in-out infinite;
        }
        .h-ring {
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:600px;height:600px;border-radius:50%;
          border:1px solid rgba(42,165,160,.06);
          animation:hRing 6s ease-in-out infinite;pointer-events:none;
        }
        @keyframes hO1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,35px)} }
        @keyframes hO2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(35px,-25px)} }
        @keyframes hO3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,-18px)} }
        @keyframes hRing { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6} 50%{transform:translate(-50%,-50%) scale(1.08);opacity:.3} }

        /* ── Layout ── */
        .hero-inner {
          position:relative;z-index:1;
          display:flex;flex-direction:column;height:100%;
        }
        .h-top {
          flex:1;display:flex;flex-direction:column;
          align-items:center;justify-content:flex-start;
          text-align:center;
          max-width:920px;margin:0 auto;width:100%;
          padding:min(104px,9.5vh) 6vw 0;
        }
        .h-dashboard-wrap {
          width:100%;max-width:660px;margin-top:min(18px,1.8vh);
          position:relative;
        }
        .h-dashboard-wrap::before {
          content:'';display:block;height:clamp(10px,1.5vh,20px);
          background:linear-gradient(to bottom,transparent,rgba(42,165,160,.08));
          margin-bottom:-2px;border-radius:4px;
        }

        /* ── Eyebrow ── */
        .h-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          padding:8px 20px;border-radius:50px;
          background:rgba(42,165,160,.08);
          border:1px solid rgba(42,165,160,.18);
          font-size:12px;font-weight:700;color:#2AA5A0;
          letter-spacing:.4px;margin-bottom:min(32px,2.8vh);
          font-family:'Inter',sans-serif;
          width:fit-content;
        }

        /* ── Headline ── */
        .h-h1 {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:clamp(50px,5.5vw,64px);font-weight:900;
          line-height:1.04;letter-spacing:-1.5px;color:#fff;
          margin-bottom:min(34px,3vh);
        }
        .h-line { display:block; }
        .h-line-accent { color:#2AA5A0; }

        /* ── Subheadline ── */
        .h-sub {
          font-size:clamp(15px,1.6vw,17px);color:rgba(255,255,255,.65);
          line-height:1.75;max-width:480px;margin-bottom:min(28px,2.5vh);
          font-family:'Inter',sans-serif;
        }

        /* ── CTAs ── */
        .h-ctas { display:flex;gap:14px;margin-bottom:min(42px,3.7vh);flex-wrap:wrap;justify-content:center; }
        .h-btn-primary {
          padding:16px 36px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#2AA5A0,#1B8F8A);color:#fff;
          font-size:16px;font-weight:700;cursor:pointer;
          font-family:'Inter',sans-serif;
          box-shadow:0 12px 40px rgba(42,165,160,.4),0 0 0 1px rgba(42,165,160,.3);
          transition:all .3s cubic-bezier(.21,.47,.32,.98);
          position:relative;overflow:hidden;
        }
        .h-btn-primary::after {
          content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
          animation:hShimmer 2.8s ease-in-out infinite;
        }
        @keyframes hShimmer { 0%{left:-100%} 60%,100%{left:160%} }
        .h-btn-primary:hover { transform:translateY(-3px);box-shadow:0 20px 56px rgba(42,165,160,.55),0 0 0 1px rgba(42,165,160,.4); }
        .h-btn-ghost {
          padding:16px 28px;border-radius:50px;
          border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);
          color:rgba(255,255,255,.65);font-size:16px;font-weight:600;
          cursor:pointer;font-family:'Inter',sans-serif;
          transition:all .3s;backdrop-filter:blur(8px);
        }
        .h-btn-ghost:hover { border-color:rgba(255,255,255,.25);color:#fff;background:rgba(255,255,255,.06); }

        /* ── Trust ── */
        .h-trust { display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center; }
        .h-trust-chip {
          display:flex;align-items:center;gap:7px;
          font-size:13px;color:rgba(255,255,255,.4);font-weight:500;
          font-family:'Inter',sans-serif;padding:0 20px;
        }
        .h-trust-chip + .h-trust-chip {
          border-left:1px solid rgba(255,255,255,.1);
        }

        .h-dash {
          width:100%;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.15);
          border-radius:20px;padding:20px 22px;
          backdrop-filter:blur(32px);
          -webkit-backdrop-filter:blur(32px);
          box-shadow:
            0 24px 60px rgba(0,0,0,.35),
            0 0 0 1px rgba(42,165,160,.1),
            inset 0 1px 0 rgba(255,255,255,.08);
        }
        .h-dash-header {
          display:flex;align-items:center;justify-content:center;
          margin-bottom:16px;padding-bottom:14px;
          border-bottom:1px solid rgba(255,255,255,.12);
        }
        .h-dash-pulse {
          width:7px;height:7px;border-radius:50%;
          background:#34d399;box-shadow:0 0 8px #34d399;
          animation:hPulse 2s ease-in-out infinite;
        }
        @keyframes hPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .h-dash-metrics {
          display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px;
        }
        .h-dash-metric {
          background:rgba(255,255,255,.08);border-radius:10px;
          padding:12px 10px;text-align:center;
          border:1px solid rgba(255,255,255,.1);
        }
        .h-dash-row {
          display:flex;align-items:center;gap:10px;
          padding:8px 10px;
          background:rgba(255,255,255,.06);border-radius:10px;
          border:1px solid rgba(255,255,255,.09);
          overflow:hidden;
        }
        .h-dash-icon {
          width:28px;height:28px;border-radius:8px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }

        /* ── Scroll indicator ── */
        .h-scroll {
          position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          display:flex;flex-direction:column;align-items:center;gap:4px;
          background:none;border:none;cursor:pointer;padding:8px;
        }
        .h-scroll-label {
          font-size:9px;color:rgba(255,255,255,.25);font-weight:700;
          text-transform:uppercase;letter-spacing:2px;
        }

        /* ── Dashboard nudge on smaller/windowed viewports ── */
        @media (max-height:1200px) {
          .h-dashboard-wrap { margin-top:50px !important; }
        }
        @media (min-width:1200px) and (max-height:1100px) {
          .h-ctas { margin-bottom:16px !important; }
          .h-dashboard-wrap { margin-top:30px !important; }
        }

        /* ── Responsive ── */
        @media (max-width:768px) {
          .h-top { padding:80px 5vw 20px; }
          .h-trust { flex-direction:column;align-items:center;gap:12px; }
          .h-ctas { flex-direction:column;width:100%;max-width:340px; }
          .h-btn-primary, .h-btn-ghost { width:100%;text-align:center; }
          .h-scroll { display:none; }
          .h-h1 { font-size:clamp(60px,9.5vw,72px);letter-spacing:-0.5px;overflow-wrap:break-word;hyphens:auto; }
        }
        @media (max-width:480px) {
          .h-eyebrow { font-size:10px;padding:6px 14px; }
          .h-h1 { font-size:clamp(50px,8.5vw,60px);letter-spacing:-0.5px;overflow-wrap:break-word;hyphens:auto; }
          .h-dash-metrics { grid-template-columns:1fr;gap:6px; }
        }
      `}</style>
    </section>
  );
}
