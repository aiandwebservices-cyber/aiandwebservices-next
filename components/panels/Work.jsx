'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const TEAL = '#2AA5A0';

const samples = [
  {
    href:     '/samples/example001',
    label:    'Restaurant',
    name:     'Fine Dining',
    industry: 'Food & Hospitality',
    desc:     'Animated menus, private events booking, testimonials, and reservation flow — dark luxury aesthetic.',
    accent:   '#C9A84C',
    bg:       '#0d0b06',
    emoji:    '🍽️',
    features: ['Animated menu', 'Reservations', 'Private events', 'Testimonials'],
    /* Simulated webpage content */
    navItems: ['Menu', 'Reservations', 'Events', 'Gallery'],
    hero:     { title:'A Table Worth Remembering', sub:'Fine dining in the heart of the city. Est. 2009.' },
    sections: [
      { label:'Featured Dishes', items:['Lobster Bisque', 'Wagyu Tenderloin', 'Truffle Risotto'], color:'#C9A84C' },
      { label:'Private Events', items:['Birthdays', 'Corporate', 'Anniversaries'], color:'#a78b60' },
    ],
    cta: 'Reserve a Table',
  },
  {
    href:     '/samples/example002',
    label:    'Real Estate',
    name:     'Luxury Properties',
    industry: 'Real Estate — South Florida',
    desc:     'High-end property listings, agent profiles, lead capture, and AI chat for qualifying buyers.',
    accent:   '#10B981',
    bg:       '#071412',
    emoji:    '🏡',
    features: ['Property listings', 'Lead capture', 'Agent profiles', 'AI chat'],
    navItems: ['Listings', 'Agents', 'Areas', 'Contact'],
    hero:     { title:'South Florida Luxury Real Estate', sub:'Waterfront homes. Private estates. Exclusive access.' },
    sections: [
      { label:'Featured Listings', items:['$2.1M — Miami Beach', '$4.5M — Coral Gables', '$1.8M — Brickell'], color:'#10B981' },
      { label:'Top Agents', items:['Maria Santos', 'Carlos Rivera', 'James Whitmore'], color:'#059669' },
    ],
    cta: 'View All Listings',
  },
  {
    href:     '/samples/example003',
    label:    'Barbershop',
    name:     'Premium Barbershop',
    industry: 'Personal Services',
    desc:     'Full services menu, team profiles with specialties, reviews, and online booking integration.',
    accent:   '#D4A843',
    bg:       '#0c0a04',
    emoji:    '✂️',
    features: ['Services menu', 'Online booking', 'Team profiles', 'Reviews'],
    navItems: ['Services', 'Book', 'Team', 'Reviews'],
    hero:     { title:'Sharp Cuts. Clean Lines. Zero Compromise.', sub:'Premium barbershop · Walk-ins welcome · Est. 2018.' },
    sections: [
      { label:'Our Services', items:['Classic Cut — $35', 'Fade + Beard — $55', 'Hot Towel Shave — $45'], color:'#D4A843' },
      { label:'Our Barbers', items:['Marco — Fades', 'Jake — Classics', 'Luis — Beard Design'], color:'#b8902e' },
    ],
    cta: 'Book Appointment',
  },
];

/* ── Full mockup browser ── */
function MockupBrowser({ s }) {
  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.accent}30`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: `0 32px 80px rgba(0,0,0,.5), 0 0 0 1px ${s.accent}20`,
    }}>
      {/* Browser chrome */}
      <div style={{ background:'#1a1a1a', padding:'10px 14px', display:'flex', alignItems:'center', gap:8, borderBottom:`1px solid rgba(255,255,255,.06)` }}>
        <div style={{ display:'flex', gap:5 }}>
          {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,.07)', borderRadius:6, padding:'4px 12px', fontSize:10, color:'rgba(255,255,255,.3)', textAlign:'center', fontFamily:'monospace' }}>
          aiandwebservices.com/samples
        </div>
      </div>

      {/* Nav bar */}
      <div style={{ background:`${s.bg}`, borderBottom:`1px solid ${s.accent}20`, padding:'10px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:12, fontWeight:800, color:s.accent, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.name}</div>
        <div style={{ display:'flex', gap:14 }}>
          {s.navItems.map(n => <span key={n} style={{ fontSize:9, color:'rgba(255,255,255,.45)', fontWeight:600 }}>{n}</span>)}
        </div>
        <div style={{ fontSize:9, fontWeight:700, color:s.bg, background:s.accent, borderRadius:20, padding:'4px 10px' }}>{s.cta}</div>
      </div>

      {/* Hero section */}
      <div style={{ padding:'20px 18px 16px', borderBottom:`1px solid ${s.accent}15` }}>
        <div style={{ fontSize:14, fontWeight:800, color:'#fff', lineHeight:1.3, marginBottom:5, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.hero.title}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginBottom:12 }}>{s.hero.sub}</div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ background:s.accent, borderRadius:20, padding:'6px 14px', fontSize:9, fontWeight:700, color:s.bg }}>{s.cta}</div>
          <div style={{ background:'rgba(255,255,255,.07)', border:`1px solid rgba(255,255,255,.1)`, borderRadius:20, padding:'6px 14px', fontSize:9, fontWeight:600, color:'rgba(255,255,255,.5)' }}>Learn More</div>
        </div>
      </div>

      {/* Content sections */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
        {s.sections.map((sec, si) => (
          <div key={sec.label} style={{ padding:'12px 16px', borderBottom:`1px solid ${s.accent}10`, borderRight: si===0 ? `1px solid ${s.accent}10` : 'none' }}>
            <div style={{ fontSize:9, fontWeight:800, color:sec.color, letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>{sec.label}</div>
            {sec.items.map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:`${sec.color}80`, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:'rgba(255,255,255,.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* AI chat bubble */}
      <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:24, height:24, borderRadius:'50%', background:`${s.accent}20`, border:`1px solid ${s.accent}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, flexShrink:0 }}>🤖</div>
        <div style={{ background:'rgba(255,255,255,.06)', border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:'7px 10px', fontSize:10, color:'rgba(255,255,255,.5)', flex:1 }}>
          Hi! How can I help you today? I can answer questions or book you in.
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const s = samples[active];

  const f = (d = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 24 },
    whileInView: { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="work" aria-label="Sample websites built by AIandWEBservices — restaurant, real estate, barbershop">
      <div style={{ position:'absolute', inset:0, background:'#f0f4f8', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:500, height:400, background:`radial-gradient(circle,${s.accent}12 0%,transparent 70%)`, filter:'blur(80px)', transition:'background .6s', pointerEvents:'none' }} />
      </div>

      <div className="work-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Header */}
          <motion.div {...f(0)} style={{ marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div className="wk-eyebrow">SAMPLE WORK</div>
                <h2 className="wk-h2">What we build —<br/><span className="wk-h2-accent">done properly.</span></h2>
                <p className="wk-sub">Every site is designed from scratch for its industry. No templates. Click to see it live.</p>
              </div>
              <button className="wk-cta" onClick={() => window.go && window.go(7)}>
                Get Your Free Audit
              </button>
            </div>
          </motion.div>

          <div className="wk-layout">

            {/* LEFT: selector */}
            <motion.div {...f(0.08)} className="wk-selector">
              {samples.map((smp, i) => (
                <button
                  key={smp.name}
                  onClick={() => setActive(i)}
                  className={`wk-sel-btn${active===i?' wk-sel-active':''}`}
                  style={{ borderColor: active===i ? `${smp.accent}40` : 'transparent', background: active===i ? `${smp.accent}10` : 'rgba(0,0,0,.03)' }}
                >
                  <span style={{ fontSize:22 }}>{smp.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:'#111827' }}>{smp.name}</div>
                    <div style={{ fontSize:10, color:'#6b7280', fontWeight:600 }}>{smp.industry}</div>
                  </div>
                  <div className="wk-sel-tag" style={{ color:smp.accent, background:`${smp.accent}18`, border:`1px solid ${smp.accent}30` }}>{smp.label}</div>
                </button>
              ))}

              <div className="wk-features">
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'#9ca3af', marginBottom:10 }}>Includes</div>
                {s.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                    <div style={{ width:18, height:18, borderRadius:6, background:`${s.accent}18`, border:`1px solid ${s.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:9 }}>✓</span>
                    </div>
                    <span style={{ fontSize:12, color:'#4b5563', fontWeight:600 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="wk-live-btn"
                style={{ color:s.accent, borderColor:`${s.accent}40`, background:`${s.accent}08` }}
              >
                <ExternalLink size={13} /> View Live Sample
              </Link>
            </motion.div>

            {/* RIGHT: browser mockup */}
            <motion.div {...f(0.12)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity:0, scale:.97 }}
                  animate={{ opacity:1, scale:1, transition:{ duration:.45, ease:[0.22,1,0.36,1] } }}
                  exit={{ opacity:0, scale:.96, transition:{ duration:.2 } }}
                >
                  <MockupBrowser s={s} />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginTop:14 }}>
                <button onClick={() => setActive(v => (v - 1 + samples.length) % samples.length)} className="wk-arrow">
                  <ChevronLeft size={16} color="#6b7280" />
                </button>
                {samples.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{ width:active===i?20:7, height:7, borderRadius:99, background:active===i ? s.accent : '#d1d5db', border:'none', cursor:'pointer', padding:0, transition:'all .3s' }} />
                ))}
                <button onClick={() => setActive(v => (v + 1) % samples.length)} className="wk-arrow">
                  <ChevronRight size={16} color="#6b7280" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom action chips */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap', paddingBottom:8, marginTop:20 }}>
          <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(7)}} className="wk-chip wk-chip-primary">Get Your Free Audit</a>
          <a href="/samples" className="wk-chip">See More Samples</a>
          <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(3)}} className="wk-chip">See Pricing</a>
        </div>
      </div>

      <style>{`
        .work-inner { height:100%;display:flex;flex-direction:column;padding:88px 6vw 40px;overflow-y:auto; }

        .wk-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .wk-edot { width:5px;height:5px;border-radius:50%;background:#2AA5A0;display:inline-block;animation:wkPulse 2s ease-in-out infinite; }
        @keyframes wkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        .wk-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(24px,3vw,40px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#111827;margin-bottom:6px; }
        .wk-h2-accent { color:#2AA5A0; }
        .wk-sub { font-size:13px;color:#6b7280;line-height:1.6; }

        .wk-cta { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border:none;border-radius:50px;padding:12px 26px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 6px 22px rgba(42,165,160,.3);transition:all .25s;white-space:nowrap; }
        .wk-cta:hover { transform:translateY(-2px);box-shadow:0 12px 32px rgba(42,165,160,.45); }

        .wk-layout { display:grid;grid-template-columns:240px 1fr;gap:24px;flex:1;align-content:start; }

        .wk-selector { display:flex;flex-direction:column;gap:8px; }
        .wk-sel-btn { display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1px solid transparent;cursor:pointer;text-align:left;font-family:'Inter',sans-serif;transition:all .25s; }
        .wk-sel-btn:hover { background:rgba(0,0,0,.05) !important; }
        .wk-sel-tag { font-size:9px;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap; }

        .wk-features { margin-top:12px;padding:14px;background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.07);border-radius:12px; }

        .wk-live-btn { display:flex;align-items:center;justify-content:center;gap:7px;margin-top:12px;text-decoration:none;font-size:12px;font-weight:700;border:1px solid;border-radius:50px;padding:9px 18px;transition:all .2s; }
        .wk-live-btn:hover { transform:translateY(-1px);filter:brightness(1.1); }

        .wk-arrow { background:rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.08);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s; }
        .wk-arrow:hover { background:rgba(0,0,0,.12); }

        @media (max-width:900px) { .wk-layout { grid-template-columns:1fr; } .wk-selector { flex-direction:row;flex-wrap:wrap; } .wk-sel-btn { flex:1;min-width:120px; } .wk-features { display:none; } }
        .wk-chip { display:inline-flex;align-items:center;padding:8px 18px;border-radius:50px;font-size:12px;font-weight:700;font-family:'Inter',sans-serif;border:1px solid rgba(42,165,160,.3);color:rgba(42,165,160,.9);background:rgba(42,165,160,.08);cursor:pointer;text-decoration:none;transition:all .22s; }
        .wk-chip:hover { background:rgba(42,165,160,.16);border-color:rgba(42,165,160,.5); }
        .wk-chip-primary { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(42,165,160,.3); }
        .wk-chip-primary:hover { transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,165,160,.45);color:#fff; }

        @media (max-width:560px) { .work-inner { padding:80px 5vw 48px; } }
      `}</style>
    </section>
  );
}
