'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Search, PenTool, Globe, Bot, BarChart3, TrendingUp, Clock } from 'lucide-react';

/* ── Chat mockup ── */
const CHAT = [
  { from: 'user', text: 'Hi, I need a quote for a new roof' },
  { from: 'bot',  text: "Hey! Happy to help. What's your zip code?" },
  { from: 'user', text: '33142 — Miami' },
  { from: 'bot',  text: 'Got it. Flat or pitched roof?' },
  { from: 'user', text: 'Pitched, about 2,200 sq ft' },
  { from: 'bot',  text: 'Want to book a free inspection this week?' },
  { from: 'user', text: 'Yes please' },
  { from: 'book', text: 'Booked — Fri 10am · CRM updated · Owner notified' },
];

function ChatMockup() {
  const [shown, setShown] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (shown >= CHAT.length) {
      const t = setTimeout(() => setShown(0), 3500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown(v => v + 1), shown === 0 ? 800 : 1400);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [shown]);

  return (
    <div className="hiw-chat">
      <div className="hiw-chat-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="hiw-chat-avatar"><Bot size={14} color="#fff" /></div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>Your AI Assistant</div>
            <div style={{ fontSize: 9, color: '#2AA5A0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="hiw-chat-dot" />Online 24/7
            </div>
          </div>
        </div>
      </div>
      <div className="hiw-chat-msgs" ref={containerRef}>
        <AnimatePresence>
          {CHAT.slice(0, shown).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`hiw-msg hiw-msg-${m.from}`}
            >
              {m.from === 'book'
                ? <div className="hiw-msg-book">{m.text}</div>
                : <div className={`hiw-bubble hiw-bubble-${m.from}`}>{m.text}</div>
              }
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Client Dashboard mockup ── */
const METRICS = [
  { label: 'Leads today',   value: 47, suffix: '',  color: '#2AA5A0' },
  { label: 'Response time',  value: 3,  suffix: 's', color: '#60a5fa' },
  { label: 'Calls booked',  value: 12, suffix: '',  color: '#a78bfa' },
  { label: 'Open rate',     value: 94, suffix: '%', color: '#34d399' },
];

const DASH_FEED = [
  { dot: '#34d399', text: 'New lead — Maria S., Miami FL',    time: 'Just now' },
  { dot: '#60a5fa', text: 'Appointment booked — Thu 2pm',     time: '4m ago'   },
  { dot: '#2AA5A0', text: 'FAQ answered — pricing inquiry',   time: '11m ago'  },
  { dot: '#a78bfa', text: 'Lead qualified — roofing estimate',time: '23m ago'  },
];

function DashCounter({ value, suffix, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      let n = 0;
      const step = Math.max(1, Math.ceil(value / 35));
      const t = setInterval(() => {
        n += step;
        if (n >= value) { setCount(value); clearInterval(t); }
        else setCount(n);
      }, 28);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <span ref={ref} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
      {count}{suffix}
    </span>
  );
}

function ClientDashboard() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [pulse, setPulse] = useState(false);

  // Cycle feed items — shift the visible window every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setFeedIdx(v => (v + 1) % DASH_FEED.length);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Rotate feed so the newest item appears at the top
  const visibleFeed = [...DASH_FEED.slice(feedIdx), ...DASH_FEED.slice(0, feedIdx)];

  return (
    <div className="hiw-dashboard">
      <div className="hiw-dash-header">
        <div style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>Client Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`hiw-dash-live${pulse ? ' hiw-dash-live-pulse' : ''}`} />
          <span style={{ fontSize: 9, color: '#2AA5A0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Live</span>
        </div>
      </div>
      <div className="hiw-dash-metrics">
        {METRICS.map(m => (
          <div key={m.label} className="hiw-dash-metric">
            <DashCounter value={m.value} suffix={m.suffix} color={m.color} />
            <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div className="hiw-dash-feed">
        <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Recent Activity</div>
        <AnimatePresence mode="popLayout">
          {visibleFeed.map((item, i) => (
            <motion.div
              key={item.text}
              className="hiw-dash-feed-row"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 11, color: '#374151', lineHeight: 1.3 }}>{item.text}</span>
              <span style={{ fontSize: 10, color: '#9ca3af', flexShrink: 0 }}>{item.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Steps data ── */
const STEPS = [
  {
    num: '01', icon: Search, title: 'Free Audit',
    body: '30-minute call. I analyse your business, competitors, and gaps. You get a clear plan — no pitch.',
    time: 'Day 1', accent: '#2AA5A0',
  },
  {
    num: '02', icon: PenTool, title: 'Design',
    body: 'You approve the look, feel, and structure before a single line of code is written.',
    time: 'Day 3', accent: '#60a5fa',
  },
  {
    num: '03', icon: Globe, title: 'Build',
    body: 'Custom website, SEO, and integrations built specifically for your industry. Fast, mobile-first, optimised.',
    time: 'Days 4–10', accent: '#8b5cf6',
  },
  {
    num: '04', icon: Bot, title: 'AI Setup',
    body: 'Your AI assistant is trained on your business — pricing, services, FAQs. It captures leads and books calls 24/7.',
    time: 'Days 10–12', accent: '#f59e0b',
  },
  {
    num: '05', icon: BarChart3, title: 'Launch',
    body: 'Everything goes live. AI starts working immediately. You get a walkthrough of your dashboard and tools.',
    time: 'Day 14', accent: '#ef4444',
  },
  {
    num: '06', icon: TrendingUp, title: 'Grow',
    body: 'Monthly optimisation, fresh content, performance reports. Your system gets smarter every month.',
    time: 'Ongoing', accent: '#10b981',
  },
];

export default function HowItWorks() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const ease = [0.21, 0.47, 0.32, 0.98];

  return (
    <section className="panel" id="p2" aria-label="How AIandWEBservices works — six steps from audit to live">
      {/* ── Background — matches FAQ panel exactly ── */}
      <div className="hiw-bg">
        <div className="hiw-orb hiw-orb-1" />
        <div className="hiw-orb hiw-orb-2" />
      </div>

      <div className="hiw-inner" ref={sectionRef}>
        <div className="hiw-mobile-flex" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* ── Header ── */}
          <motion.div
            className="hiw-header"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, ease }}
            style={{ textAlign: 'center', marginBottom: 44 }}
          >
            <div className="hiw-eyebrow">HOW IT WORKS</div>
            <h2 className="hiw-h2">
              Audit to live <span className="hiw-h2-accent">in 14 days or less.</span>
            </h2>
            <p className="hiw-sub">Six steps. No surprises. You approve everything before it ships.</p>
          </motion.div>

          {/* ── Graphics row ── */}
          <div className="hiw-graphics" style={{ marginBottom: 0 }}>
            <motion.div
              className="hiw-graphic-col"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              <div className="hiw-graphic-label">Your AI in action</div>
              <ChatMockup />
            </motion.div>

            <motion.div
              className="hiw-graphic-col"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
            >
              <div className="hiw-graphic-label">Client Dashboard</div>
              <ClientDashboard />
            </motion.div>
          </div>

          {/* ── Steps 3×2 grid (centered) ── */}
          <div className="hiw-steps" style={{ marginTop: 85, rowGap: 28 }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  className="hiw-card"
                  initial={reduced ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease }}
                >
                  <div className="hiw-ghost" aria-hidden="true">{step.num}</div>
                  <div className="hiw-card-top">
                    <div className="hiw-icon" style={{ background: `${step.accent}14`, border: `1px solid ${step.accent}30` }}>
                      <Icon size={18} color={step.accent} strokeWidth={2} />
                    </div>
                    <div className="hiw-badge" style={{ color: step.accent, background: `${step.accent}0d` }}>
                      <Clock size={10} strokeWidth={2.5} />
                      {step.time}
                    </div>
                  </div>
                  <h3 className="hiw-card-title">{step.title}</h3>
                  <p className="hiw-card-text">{step.body}</p>
                </motion.div>
              );
            })}
          </div>

          {/* ── CTA ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="panel-cta-wrap"
          >
            <div className="panel-cta-card">
              <p className="panel-cta-title">See exactly how it works for your business.</p>
              <p className="panel-cta-sub">30 minutes · No obligation · Honest advice</p>
              <a className="panel-cta-btn" href="/contact">Get Your Free Audit</a>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        .hiw-bg { position:absolute;inset:0;background:linear-gradient(135deg,#dbeafe 0%,#bfdbfe 60%,#c7d2fe 100%);z-index:0; }
        .hiw-orb { position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;animation:hiw-drift 12s ease-in-out infinite; }
        .hiw-orb-1 { width:420px;height:420px;top:-80px;left:-60px;background:radial-gradient(circle,rgba(42,165,160,.22) 0%,transparent 70%);animation-delay:0s; }
        .hiw-orb-2 { width:500px;height:500px;bottom:-100px;right:-80px;background:radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%);animation-delay:-6s; }
        @keyframes hiw-drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.06)} 66%{transform:translate(-20px,24px) scale(.96)} }
        .hiw-inner { height:100%;display:flex;flex-direction:column;padding:90px 6vw 0;overflow-y:auto; }
        .hiw-inner .panel-cta-wrap { margin-top:auto;padding-top:14px;padding-bottom:clamp(16px,2.5vh,28px); }

        .hiw-eyebrow { font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:14px; }
        .hiw-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3.5vw,46px);font-weight:900;color:#111827;line-height:1.08;letter-spacing:-1.5px;margin-bottom:10px; }
        .hiw-h2-accent { color:#2AA5A0; }
        .hiw-sub { font-size:14px;color:#6b7280;max-width:440px;margin:0 auto 10px;line-height:1.6; }

        /* ── Steps 3×2 grid (centered) ── */
        .hiw-steps {
          display:grid;grid-template-columns:repeat(3,1fr);gap:14px;
          max-width:960px;margin:0 auto;width:100%;
        }

        .hiw-card {
          position:relative;overflow:hidden;
          background:#fff;border:1px solid #e5e7eb;border-radius:16px;
          padding:18px 16px 16px;
          transition:transform .3s cubic-bezier(.21,.47,.32,.98),box-shadow .3s;
        }
        .hiw-card:hover {
          transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.07);
        }

        .hiw-ghost {
          position:absolute;top:4px;right:10px;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:56px;font-weight:900;line-height:1;
          color:rgba(42,165,160,.04);pointer-events:none;
          user-select:none;letter-spacing:-2px;
        }

        .hiw-card-top { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px; }
        .hiw-icon {
          width:36px;height:36px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;
        }
        .hiw-badge {
          display:flex;align-items:center;gap:4px;
          font-size:10px;font-weight:700;padding:3px 9px;border-radius:50px;
        }

        .hiw-card-title {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:16px;font-weight:800;color:#111827;
          margin-bottom:6px;line-height:1.2;position:relative;
        }
        .hiw-card-text {
          font-size:12px;color:#6b7280;line-height:1.7;position:relative;margin:0;
        }

        /* ── Graphics row ── */
        .hiw-graphics {
          display:grid;grid-template-columns:1fr 1fr;gap:20px;
          max-width:960px;margin:0 auto;width:100%;
        }
        .hiw-graphic-col { display:flex;flex-direction:column;gap:10px; }
        .hiw-graphic-label {
          font-size:10px;font-weight:800;letter-spacing:2px;
          text-transform:uppercase;color:#2AA5A0;text-align:center;
        }

        /* ── Dashboard mockup ── */
        .hiw-dashboard {
          background:#fff;border:1px solid #e5e7eb;border-radius:18px;
          overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.05);
          display:flex;flex-direction:column;height:293px;width:100%;
        }
        .hiw-dash-header {
          padding:12px 14px;border-bottom:1px solid #f0f0f0;
          background:#fafbfc;display:flex;align-items:center;justify-content:space-between;
        }
        .hiw-dash-metrics {
          display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
          background:#e5e7eb;
        }
        .hiw-dash-metric {
          background:#fff;padding:14px 12px;text-align:center;
        }
        .hiw-dash-feed {
          flex:1;padding:12px 14px;border-top:1px solid #f0f0f0;overflow-y:auto;
        }
        .hiw-dash-feed-row {
          display:flex;align-items:center;gap:8px;padding:5px 0;
          border-bottom:1px solid #f5f5f5;
        }
        .hiw-dash-feed-row:last-child { border-bottom:none; }
        .hiw-dash-live {
          width:6px;height:6px;border-radius:50%;background:#2AA5A0;
          display:inline-block;animation:hiwBlink 1.5s ease-in-out infinite;
        }
        .hiw-dash-live-pulse { animation:hiwDashPop .6s ease; }
        @keyframes hiwDashPop { 0%{transform:scale(1)} 50%{transform:scale(1.8)} 100%{transform:scale(1)} }

        /* ── Chat mockup ── */
        .hiw-chat {
          background:#fff;border:1px solid #e5e7eb;border-radius:18px;
          overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.05);
          display:flex;flex-direction:column;height:293px;width:100%;
        }
        .hiw-chat-bar {
          padding:12px 14px;border-bottom:1px solid #f0f0f0;
          background:#fafbfc;
        }
        .hiw-chat-avatar {
          width:28px;height:28px;border-radius:50%;
          background:linear-gradient(135deg,#2AA5A0,#33BDB8);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .hiw-chat-dot {
          width:5px;height:5px;border-radius:50%;background:#2AA5A0;
          display:inline-block;animation:hiwBlink 1.5s ease-in-out infinite;
        }
        @keyframes hiwBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .hiw-chat-msgs {
          flex:1;padding:12px;display:flex;flex-direction:column;gap:6px;
          overflow-y:auto;min-height:0;
        }
        .hiw-msg { display:flex; }
        .hiw-msg-user { justify-content:flex-end; }
        .hiw-msg-bot, .hiw-msg-book { justify-content:flex-start; }

        .hiw-bubble {
          max-width:85%;padding:8px 12px;border-radius:12px;
          font-size:12px;line-height:1.5;
        }
        .hiw-bubble-user {
          background:#2AA5A0;color:#fff;border-bottom-right-radius:4px;
        }
        .hiw-bubble-bot {
          background:#f3f4f6;color:#374151;border-bottom-left-radius:4px;
        }
        .hiw-msg-book {
          width:100%;
        }
        .hiw-msg-book .hiw-msg-book {
          background:rgba(42,165,160,.08);border:1px solid rgba(42,165,160,.2);
          border-radius:10px;padding:8px 12px;
          font-size:11px;color:#2AA5A0;font-weight:600;width:100%;
        }

        /* ── CTA ── */
        .hiw-cta {
          padding:14px 32px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#2AA5A0,#1B8F8A);color:#fff;
          font-size:15px;font-weight:700;cursor:pointer;
          font-family:'Inter',sans-serif;
          box-shadow:0 8px 28px rgba(42,165,160,.35);
          transition:all .3s cubic-bezier(.21,.47,.32,.98);
        }
        .hiw-cta:hover { transform:translateY(-3px);box-shadow:0 16px 44px rgba(42,165,160,.5); }
        .hiw-cta-note { font-size:12px;color:#9ca3af;margin-top:10px;font-weight:500; }

        /* ── Responsive ── */
        @media (max-width:768px) {
          .hiw-inner { padding:80px 5vw 36px; }
          .hiw-steps { grid-template-columns:1fr 1fr; }
          .hiw-graphics { grid-template-columns:1fr; }
          .hiw-mobile-flex .hiw-header    { order: 0; }
          .hiw-mobile-flex .hiw-steps     { order: 1; }
          .hiw-mobile-flex .hiw-graphics  { order: 2; margin-top: 20px; }
          .hiw-mobile-flex .panel-cta-wrap { order: 3; }
        }
        @media (max-width:480px) {
          .hiw-steps { grid-template-columns:1fr; }
        }
      `}</style>
    </section>
  );
}
