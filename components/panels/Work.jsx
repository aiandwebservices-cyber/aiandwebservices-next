'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const samples = [
  {
    href:     '/samples/example001',
    domain:   'finedining.aiandwebservices.com',
    label:    'Fine Dining',
    emoji:    '🍽️',
    accent:   '#C9A84C',
  },
  {
    href:     '/samples/example003',
    domain:   'premierbarbershop.aiandwebservices.com',
    label:    'Premium Barbershop',
    emoji:    '✂️',
    accent:   '#D4A843',
  },
  {
    href:     '/samples/example002',
    domain:   'luxuryproperties.aiandwebservices.com',
    label:    'Luxury Properties',
    emoji:    '🏡',
    accent:   '#10B981',
  },
  {
    href:     '/samples/example004',
    domain:   'ironcladconstruction.aiandwebservices.com',
    label:    'General Contractor',
    emoji:    '🏗️',
    accent:   '#FF6B2B',
  },
];

export default function Work() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const s = samples[active];

  const f = (d = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 20 },
    whileInView: { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  function handleTabClick(i) {
    if (i === active) return;
    setLoading(true);
    setActive(i);
  }

  return (
    <section className="panel" id="samples" aria-label="Sample websites built by AIandWEBservices">
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'#f0f4f8', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:500, height:400, background:`radial-gradient(circle,${s.accent}12 0%,transparent 70%)`, filter:'blur(80px)', transition:'background .6s', pointerEvents:'none' }} />
      </div>

      <div className="work-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Header */}
          <motion.div {...f(0)} style={{ marginBottom:24, textAlign:'center' }}>
            <div className="wk-eyebrow">SAMPLE WORK</div>
            <h2 className="wk-h2">Built for your business.<br/><span className="wk-h2-accent">Not from a template.</span></h2>
            <p className="wk-sub">Click a sample to see the real page — built for that industry.</p>
          </motion.div>

          {/* Tab selector row */}
          <motion.div {...f(0.08)} className="wk-tabs">
            {samples.map((smp, i) => (
              <button
                key={smp.label}
                onClick={() => handleTabClick(i)}
                className={`wk-tab${active === i ? ' wk-tab-active' : ''}`}
                style={{
                  borderColor: active === i ? `${smp.accent}60` : 'rgba(0,0,0,.08)',
                  background:  active === i ? `${smp.accent}12` : 'rgba(255,255,255,.7)',
                  color:       active === i ? smp.accent : '#6b7280',
                }}
              >
                <span style={{ fontSize:22 }}>{smp.emoji}</span>
                <span className="wk-tab-label">{smp.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Browser iframe preview */}
          <motion.div {...f(0.14)} className="wk-browser" style={{ flex:1, minHeight:0, maxHeight:'53vh' }}>
            {/* Chrome bar */}
            <div className="wk-chrome">
              <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                  <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
                ))}
              </div>
              <div className="wk-url">{s.domain}</div>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="wk-open-btn"
                style={{ color: s.accent }}
              >
                <ExternalLink size={12} /> Open
              </a>
            </div>

            {/* iframe + shimmer + click overlay */}
            <div style={{ flex:1, position:'relative', minHeight:0 }}>
              {loading && (
                <div className="wk-shimmer" />
              )}
              <iframe
                key={s.href}
                src={s.href}
                title={s.label}
                className="wk-iframe"
                loading="lazy"
                onLoad={() => setLoading(false)}
              />
              {/* Clickable overlay — opens full sample in new tab */}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="wk-overlay"
                title={`Open ${s.label} sample`}
              >
                <div className="wk-overlay-hint">
                  <ExternalLink size={14} /> View Full Site
                </div>
              </a>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <div className="panel-cta-wrap">
            <div className="panel-cta-card">
              <p className="panel-cta-title">Like what you see? Get yours built today.</p>
              <p className="panel-cta-sub">Not sure where to start? Find out in 2 minutes.</p>
              <a className="panel-cta-btn" href="/checklist">Take the AI Readiness Check</a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .work-inner { height:100%;display:flex;flex-direction:column;padding:90px 6vw 0;overflow-y:auto; }
        .work-inner .panel-cta-wrap { margin-top:auto;padding-top:14px;padding-bottom:clamp(16px,2.5vh,28px); }

        .wk-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .wk-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3.5vw,46px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#111827;margin-bottom:6px; }
        .wk-h2-accent { color:#2AA5A0; }
        .wk-sub { font-size:13px;color:#6b7280;line-height:1.6; }

        /* Tab row */
        .wk-tabs { display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap;justify-content:center; }
        .wk-tab {
          display:flex;align-items:center;gap:10px;
          padding:14px 28px;border-radius:50px;
          border:1px solid;cursor:pointer;
          font-family:'Inter',sans-serif;font-size:15px;font-weight:700;
          transition:all .25s;white-space:nowrap;
        }
        .wk-tab:hover { filter:brightness(.97); }
        .wk-tab-label { font-size:15px; }

        /* Browser shell */
        .wk-browser {
          display:flex;flex-direction:column;
          border-radius:14px;overflow:hidden;
          border:1px solid rgba(0,0,0,.1);
          box-shadow:0 8px 40px rgba(0,0,0,.12);
          background:#1a1a1a;
        }
        .wk-chrome {
          display:flex;align-items:center;gap:10px;
          padding:10px 14px;background:#242424;
          border-bottom:1px solid rgba(255,255,255,.06);
          flex-shrink:0;
        }
        .wk-url {
          flex:1;background:rgba(255,255,255,.07);border-radius:6px;
          padding:4px 12px;font-size:11px;color:rgba(255,255,255,.45);
          text-align:center;font-family:monospace;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .wk-open-btn {
          display:flex;align-items:center;gap:4px;flex-shrink:0;
          font-size:11px;font-weight:700;text-decoration:none;
          font-family:'Inter',sans-serif;white-space:nowrap;
          transition:opacity .2s;
        }
        .wk-open-btn:hover { opacity:.7; }

        /* iframe */
        .wk-iframe { width:100%;height:100%;border:none;display:block;background:#fff; }

        /* Click overlay */
        .wk-overlay {
          position:absolute;inset:0;z-index:3;
          display:flex;align-items:flex-end;justify-content:flex-end;
          padding:14px;cursor:pointer;text-decoration:none;
        }
        .wk-overlay-hint {
          display:flex;align-items:center;gap:6px;
          background:rgba(0,0,0,.55);backdrop-filter:blur(6px);
          color:#fff;font-size:12px;font-weight:700;
          padding:7px 14px;border-radius:50px;
          font-family:'Inter',sans-serif;
          opacity:0;transition:opacity .2s;
        }
        .wk-overlay:hover .wk-overlay-hint { opacity:1; }

        /* Loading shimmer */
        .wk-shimmer {
          position:absolute;inset:0;z-index:2;
          background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
          background-size:200% 100%;
          animation:wkShimmer 1.2s ease-in-out infinite;
        }
        @keyframes wkShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        @media (max-width:768px) {
          .wk-tabs { gap:8px; margin-bottom:10px; }
          .wk-tab { padding:8px 10px;font-size:13px;flex-shrink:0; }
          .wk-tab-label { font-size:13px; }
          .wk-h2 { font-size:22px;margin-bottom:4px; }
          .wk-sub { font-size:12px;margin-bottom:0; }
          .wk-browser { height:45vh !important;min-height:300px !important;max-height:45vh !important;flex:none !important; }
          .wk-iframe { position:absolute;inset:0;width:100%;height:100%; }
          .work-inner .panel-cta-card { padding:12px 20px; }
          .work-inner .panel-cta-sub  { font-size:11px;margin:2px 0 0;line-height:1.3; }
          .work-inner .panel-cta-btn  { padding:10px 24px;font-size:13px; }
        }
        @media (max-width:560px) {
          .work-inner { padding:80px 5vw 40px; }
          .wk-tab-label { display:none; }
        }
      `}</style>
    </section>
  );
}
