'use client';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';
import { Check, X, Zap, DollarSign, Clock, Shield, Search, MessageSquare, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ease = [0.21, 0.47, 0.32, 0.98];

const ROWS = [
  {
    icon: Clock, label: 'Speed to Launch',
    us:     { ok: true,  text: '7–14 days',           detail: 'Built, tested, live. You approve before it ships.' },
    agency: { ok: false, text: '6–12 weeks'            },
    diy:    { ok: false, text: 'Weeks to months'       },
    },
  {
    icon: MessageSquare, label: 'AI Automation',
    us:     { ok: true,  text: 'Built-in from day 1',  detail: 'Custom-trained on your business. Live 24/7.' },
    agency: { ok: false, text: '$3k–$10k add-on'        },
    diy:    { ok: false, text: 'Not available'          },
  },
  {
    icon: DollarSign, label: 'Monthly Cost',
    us:     { ok: true,  text: '$99–$349/mo flat',     detail: 'Everything included. No surprises, ever.' },
    agency: { ok: false, text: '$1k–$5k/mo'            },
    diy:    { ok: false, text: '"Free" + your time'    },
  },
  {
    icon: Users, label: 'Who You Talk To',
    us:     { ok: true,  text: 'David — direct',       detail: 'Same person who built it. Hours, not days.' },
    agency: { ok: false, text: 'Account manager'       },
    diy:    { ok: false, text: 'Forums & YouTube'      },
  },
  {
    icon: Search, label: 'SEO & Visibility',
    us:     { ok: true,  text: 'Included from day 1',  detail: 'Local SEO, GBP, schema — optimised at launch.' },
    agency: { ok: false, text: 'Separate contract'     },
    diy:    { ok: false, text: 'Default settings'      },
  },
  {
    icon: Shield, label: 'Ownership & Exit',
    us:     { ok: true,  text: 'You own everything',   detail: 'Code, domain, CRM data — all yours. Always.' },
    agency: { ok: false, text: 'They own the CMS'      },
    diy:    { ok: false, text: 'Platform lock-in'      },
  },
];

/* Animated counter hook */
function useCounter(target, duration = 1.4, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const ctrl = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [start, target, duration]);
  return val;
}

/* Savings calculator strip */
function SavingsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const agency = useCounter(1000, 1.6, inView);
  const us = useCounter(99, 1.6, inView);
  const saved = useCounter(10812, 1.8, inView);

  return (
    <motion.div
      ref={ref}
      className="cmp-savings"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="cmp-savings-inner">
        <TrendingUp size={14} color="#2AA5A0" />
        <span className="cmp-savings-label">At agency rates you'd pay</span>
        <span className="cmp-savings-bad">${agency.toLocaleString()}/mo</span>
        <ChevronRight size={13} color="#9ca3af" />
        <span className="cmp-savings-label">with us:</span>
        <span className="cmp-savings-good">from ${us}/mo</span>
        <ChevronRight size={13} color="#9ca3af" />
        <span className="cmp-savings-label">you save</span>
        <span className="cmp-savings-big">${saved.toLocaleString()}/yr</span>
      </div>
    </motion.div>
  );
}

/* Animated check that draws in */
function AnimatedCheck({ delay = 0, reduced }) {
  return (
    <div className="cmp-check cmp-check-ok" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
        whileInView={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20, delay } }}
        viewport={{ once: true }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Check size={11} strokeWidth={3} color="#fff" />
      </motion.div>
    </div>
  );
}


export default function Comparison() {
  const reduced = useReducedMotion();

  return (
    <section className="panel" id="comparison" aria-label="Why AIandWEBservices beats agencies and DIY">
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: '#dde5ed', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(42,165,160,.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 500, background: 'radial-gradient(circle,rgba(42,165,160,.08) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        {/* Extra orb bottom-left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 400, height: 400, background: 'radial-gradient(circle,rgba(42,165,160,.05) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      </div>

      <div className="comparison-inner">
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
            viewport={{ once: true, amount: 0.05 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <div className="cmp-eyebrow">THE HONEST COMPARISON</div>
            <h2 className="cmp-h2">The honest comparison<br/><span className="cmp-h2-accent">nobody else will show you.</span></h2>
            <p className="cmp-sub">See exactly why 70% of clients switch from agencies.</p>
          </motion.div>

          <div style={{ flex: 0.15 }} />

          {/* Table */}
          <div className="cmp-table">

            {/* Column headers */}
            <div className="cmp-thead">
              <div className="cmp-th-cat" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:12, fontWeight:800, letterSpacing:2, textTransform:'uppercase', color:'#9ca3af' }}>Category</span>
              </div>
              {/* "Us" header with pulse ring */}
              <div className="cmp-th cmp-th-us">
                <span className="cmp-zap-wrap">
                  <Zap size={13} color="#fff" />
                  <span className="cmp-pulse-ring" />
                </span>
                AIandWEB
                {/* Shimmer sweep */}
                <span className="cmp-th-shimmer" />
              </div>
              <div className="cmp-th cmp-th-other">Agency</div>
              <div className="cmp-th cmp-th-other">DIY</div>
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.label}
                  className="cmp-row"
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease } }}
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {/* Category */}
                  <div className="cmp-row-cat">
                    <Icon size={17} color="#6b7280" strokeWidth={2} />
                    <span>{row.label}</span>
                  </div>

                  {/* Us */}
                  <div className="cmp-cell cmp-cell-us">
                    <AnimatedCheck delay={i * 0.07 + 0.2} reduced={reduced} />
                    <div style={{ flex: 1 }}>
                      <div className="cmp-cell-main cmp-cell-main-ok">{row.us.text}</div>
                      <div className="cmp-cell-detail">{row.us.detail}</div>
                    </div>
                  </div>

                  {/* Agency */}
                  <div className="cmp-cell cmp-cell-bad">
                    <div className="cmp-check cmp-check-no">
                      <X size={11} strokeWidth={3} color="#f87171" />
                    </div>
                    <div className="cmp-cell-main">{row.agency.text}</div>
                  </div>

                  {/* DIY */}
                  <div className="cmp-cell cmp-cell-bad">
                    <div className="cmp-check cmp-check-no">
                      <X size={11} strokeWidth={3} color="#f87171" />
                    </div>
                    <div className="cmp-cell-main">{row.diy.text}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Savings strip */}
          <SavingsStrip />

          {/* Bottom CTA */}
          <motion.div
            className="panel-cta-wrap"
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease } }}
            viewport={{ once: true }}
          >
            <div className="panel-cta-card">
              <p className="panel-cta-title">Same results. <span style={{ color: '#0f172a' }}>70% less.</span> One person.</p>
              <p className="panel-cta-sub">Most clients go live in 14 days. No contracts, no lock-in.</p>
              <a className="panel-cta-btn" href="/contact">Book a Call</a>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        .comparison-inner { height:100%;display:flex;flex-direction:column;padding:90px 6vw 0;overflow-y:auto; }
        .comparison-inner .panel-cta-wrap { margin-top:auto;padding-top:60px;padding-bottom:clamp(16px,2.5vh,28px); }

        .cmp-eyebrow { font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .cmp-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3.5vw,46px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#111827;margin-bottom:8px; }
        .cmp-h2-accent { color:#2AA5A0; }
        .cmp-sub { font-size:13px;color:#6b7280; }

        /* Table */
        .cmp-table { display:flex;flex-direction:column;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.05); }

        /* Header row */
        .cmp-thead { display:grid;grid-template-columns:200px 1fr 213px 213px; }
        .cmp-th-cat { background:#f9fafb;border-right:1px solid #e5e7eb; }
        .cmp-th {
          display:flex;align-items:center;justify-content:center;gap:6px;
          padding:21px 16px;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:800;
          border-right:1px solid #e5e7eb;
          position:relative;overflow:hidden;
        }
        .cmp-th:last-child { border-right:none; }
        .cmp-th-us {
          background:linear-gradient(135deg,#2AA5A0,#33BDB8);
          color:#fff;
        }
        .cmp-th-other { background:#f9fafb;color:#9ca3af; }

        /* Pulse ring on Zap icon */
        .cmp-zap-wrap { position:relative;display:flex;align-items:center;justify-content:center; }
        .cmp-pulse-ring {
          position:absolute;inset:-6px;border-radius:50%;
          border:2px solid rgba(255,255,255,.5);
          animation:cmp-pulse 2.2s ease-out infinite;
        }
        @keyframes cmp-pulse {
          0%   { transform:scale(1);   opacity:.7; }
          70%  { transform:scale(2.2); opacity:0;  }
          100% { transform:scale(2.2); opacity:0;  }
        }

        /* Shimmer sweep on AIandWEB header */
        .cmp-th-shimmer {
          position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.35) 50%,transparent 60%);
          background-size:200% 100%;
          animation:cmp-shimmer 3s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes cmp-shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }

        /* Teal column glow pulse */
        .cmp-cell-us {
          background:rgba(42,165,160,.04);
          animation:cmp-glow 3s ease-in-out infinite;
        }
        @keyframes cmp-glow {
          0%,100% { background:rgba(42,165,160,.04); }
          50%      { background:rgba(42,165,160,.09); }
        }

/* Data rows */
        .cmp-row {
          display:grid;grid-template-columns:200px 1fr 213px 213px;
          border-top:1px solid #e5e7eb;
        }

        .cmp-row-cat {
          display:flex;align-items:center;gap:10px;
          padding:18px 20px;
          font-size:15px;font-weight:700;color:#374151;
          background:#f9fafb;border-right:1px solid #e5e7eb;
        }

        .cmp-cell {
          display:flex;align-items:flex-start;gap:10px;
          padding:16px 18px;
          border-right:1px solid #f3f4f6;
        }
        .cmp-cell:last-child { border-right:none; }

        .cmp-cell-us { background:rgba(42,165,160,.04); }
        .cmp-cell-bad { background:#fff; }

        .cmp-check {
          width:25px;height:25px;border-radius:8px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          margin-top:1px;
        }
        .cmp-check-ok { background:#2AA5A0; }
        .cmp-check-no { background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2); }

        .cmp-cell-main { font-size:15px;font-weight:700;color:#6b7280;line-height:1.3; }
        .cmp-cell-main-ok { color:#111827; }
        .cmp-cell-detail { font-size:12px;color:#2AA5A0;margin-top:3px;line-height:1.4;opacity:.85; }

/* Savings strip */
        .cmp-savings { margin-top:10px; }
        .cmp-savings-inner {
          display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;
          background:linear-gradient(90deg,rgba(42,165,160,.06),rgba(42,165,160,.1),rgba(42,165,160,.06));
          border:1px solid rgba(42,165,160,.15);border-radius:12px;
          padding:10px 20px;font-size:12px;
        }
        .cmp-savings-label { color:#6b7280;font-weight:500; }
        .cmp-savings-bad { color:#f87171;font-weight:800; }
        .cmp-savings-good { color:#2AA5A0;font-weight:800; }
        .cmp-savings-big { color:#111827;font-weight:900;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif; }

        /* Bottom */

        @media (max-width:768px) {
          .comparison-inner { padding:80px 4vw 36px; }
          .cmp-thead { grid-template-columns:1fr 1fr; }
          .cmp-th-other { display:none; }
          .cmp-row { grid-template-columns:1fr 1fr; }
          .cmp-cell-bad { display:none; }
          .cmp-row-cat { font-size:12px;padding:14px 12px; }
          .cmp-cell { padding:14px 12px; }
          .cmp-cell-main { font-size:12px; }
          .cmp-savings-inner { font-size:11px;gap:5px; }
        }
        @media (max-width:480px) {
          .cmp-th { font-size:13px;padding:14px 10px; }
          .cmp-bottom-card { padding:16px 20px; }
        }
      `}</style>
    </section>
  );
}
