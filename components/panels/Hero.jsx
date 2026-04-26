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
          <img src="/logo-final/logoFINAL-graph-transparent.svg" alt="AIandWEB" style={{ width:20, height:20, borderRadius:5, flexShrink:0 }} />
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

  // H1 lines paint immediately so the LCP element is never invisible on first render
  const revealH1 = {
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0, delay: 0 },
  };

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
            <motion.span {...revealH1} className="h-line">Stop losing leads</motion.span>
            <motion.span {...revealH1} className="h-line">to competitors with</motion.span>
            <motion.span {...revealH1} className="h-line h-line-better" style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:'0.25em', paddingLeft:'0.25em' }}>
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

    </section>
  );
}
