'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Check, Zap } from 'lucide-react';

const TEAL = '#2AA5A0';

/* ── Data ── */
const ROUNDS = [
  {
    label: 'Speed to Launch',
    scenario: 'You need a website live by next week.',
    us:     { verdict:'done', text:'7–14 days. Built, tested, live.' },
    agency: { verdict:'bad',  text:'6–12 week minimum. Discovery phase alone is 2 weeks.' },
    diy:    { verdict:'bad',  text:'You build it yourself. Nights and weekends.' },
  },
  {
    label: 'AI + Automation',
    scenario: 'You want AI to capture leads while you sleep.',
    us:     { verdict:'done', text:'Built in. Custom trained on your business from day one.' },
    agency: { verdict:'bad',  text:'Not their specialty. Quoted as a separate $8k+ project.' },
    diy:    { verdict:'bad',  text:"No templates for this. You're on your own." },
  },
  {
    label: 'Monthly Cost',
    scenario: 'You want ongoing support without surprises.',
    us:     { verdict:'done', text:'$99–$349/mo flat. No scope creep.' },
    agency: { verdict:'bad',  text:'$2,000–$10,000/mo retainer. Plus hourly overages.' },
    diy:    { verdict:'bad',  text:'Free tools + your time = hidden cost nobody talks about.' },
  },
  {
    label: 'Who You Talk To',
    scenario: 'You have a question on a Tuesday at 6pm.',
    us:     { verdict:'done', text:'David. Same person who built it. Response within 6 hours.' },
    agency: { verdict:'bad',  text:'Account manager who forwards it to the dev team. Maybe Friday.' },
    diy:    { verdict:'bad',  text:'A forum. Maybe a YouTube tutorial from 2019.' },
  },
  {
    label: 'SEO & Visibility',
    scenario: 'You want to rank on Google for your services.',
    us:     { verdict:'done', text:'Local SEO, schema markup, GBP optimized from day 1.' },
    agency: { verdict:'bad',  text:'Separate SEO contract. 3–6 month ramp-up. Extra billing.' },
    diy:    { verdict:'bad',  text:'Default WordPress install with no real SEO configuration.' },
  },
  {
    label: 'Ownership',
    scenario: 'You decide to move on after 6 months.',
    us:     { verdict:'done', text:'You own everything. Code, domain, CRM data — all yours.' },
    agency: { verdict:'bad',  text:'They own the proprietary CMS. Moving = rebuilding.' },
    diy:    { verdict:'bad',  text:'Platform lock-in. Export tools are broken by design.' },
  },
];

function ScoreBar({ wins, total, color, delay }) {
  const pct = Math.round((wins / total) * 100);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ flex:1, height:5, background:'rgba(255,255,255,.1)', borderRadius:99, overflow:'hidden' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:1.1, ease:[0.22,1,0.36,1], delay }}
          style={{ height:'100%', background:color, borderRadius:99 }}
        />
      </div>
      <span style={{ fontSize:11, fontWeight:800, color, minWidth:30 }}>{pct}%</span>
    </div>
  );
}

function VerdictPill({ verdict, text }) {
  const isGood = verdict === 'done';
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:10,
      background: isGood ? 'rgba(52,211,153,.09)' : 'rgba(248,113,113,.06)',
      border:`1px solid ${isGood ? 'rgba(52,211,153,.22)' : 'rgba(248,113,113,.14)'}`,
      borderRadius:12, padding:'12px 14px',
    }}>
      <div style={{
        width:22, height:22, borderRadius:7, flexShrink:0, marginTop:1,
        background: isGood ? 'rgba(52,211,153,.18)' : 'rgba(248,113,113,.12)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {isGood
          ? <Check size={12} strokeWidth={2.5} color="#34d399" />
          : <X    size={12} strokeWidth={2.5} color="#f87171" />
        }
      </div>
      <span style={{ fontSize:12, color: isGood ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.38)', lineHeight:1.65 }}>{text}</span>
    </div>
  );
}

export default function Comparison() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const round = ROUNDS[active];

  useEffect(() => {
    const t = setInterval(() => setActive(v => (v + 1) % ROUNDS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scores = {
    us:     ROUNDS.filter(r => r.us.verdict === 'done').length,
    agency: ROUNDS.filter(r => r.agency.verdict === 'done').length,
    diy:    ROUNDS.filter(r => r.diy.verdict === 'done').length,
  };

  return (
    <section className="panel" id="comparison" aria-label="Why AIandWEBservices beats agencies and freelancers for small business AI and web">
      {/* Background — true navy, not near-black */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#0f1e3d 0%,#162444 50%,#0d1a35 100%)', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(42,165,160,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,.04) 1px,transparent 1px)', backgroundSize:'52px 52px' }} />
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:900, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.07) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
      </div>

      <div className="comparison-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Header — centered, no pill */}
          <motion.div
            initial={{ opacity:0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1] } }}
            viewport={{ once:true, amount:.05 }}
            style={{ textAlign:'center', marginBottom:28 }}
          >
            <div className="cmp-eyebrow">WHY US</div>
            <h2 className="cmp-h2">See the difference<br/><span className="cmp-h2-accent">scenario by scenario.</span></h2>
            <p className="cmp-sub">Pick any situation. See exactly how each option plays out.</p>
          </motion.div>

          {/* Main layout */}
          <div className="cmp-layout">

            {/* Left: Round selector + scores */}
            <motion.div
              initial={{ opacity:0, x: reduced ? 0 : -20 }}
              whileInView={{ opacity:1, x:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:.1 } }}
              viewport={{ once:true, amount:.05 }}
              className="cmp-rounds"
            >
              {ROUNDS.map((r, i) => (
                <button key={r.label} onClick={() => setActive(i)} className={`cmp-round-btn${active===i?' cmp-round-active':''}`}>
                  {active===i && (
                    <motion.div layoutId="cmp-pill" className="cmp-round-indicator" transition={{ type:'spring', stiffness:400, damping:30 }} />
                  )}
                  <span className="cmp-round-n">{String(i+1).padStart(2,'0')}</span>
                  <span className="cmp-round-label">{r.label}</span>
                </button>
              ))}

              <div className="cmp-scores">
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginBottom:14 }}>Win Rate</div>
                {[
                  { label:'Us',            wins:scores.us,     color:TEAL },
                  { label:'Agency',        wins:scores.agency, color:'rgba(255,255,255,.2)' },
                  { label:'Freelance/DIY', wins:scores.diy,    color:'rgba(255,255,255,.2)' },
                ].map(({ label, wins, color }, i) => (
                  <div key={label} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:600 }}>{label}</span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,.28)' }}>{wins}/{ROUNDS.length}</span>
                    </div>
                    <ScoreBar wins={wins} total={ROUNDS.length} color={color} delay={0.3 + i * 0.1} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Verdict panel */}
            <motion.div
              initial={{ opacity:0, x: reduced ? 0 : 24 }}
              whileInView={{ opacity:1, x:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:.15 } }}
              viewport={{ once:true, amount:.05 }}
              className="cmp-verdict-wrap"
            >
              {/* Scenario prompt */}
              <div className="cmp-scenario">
                <span className="cmp-scenario-dot"/>
                <span className="cmp-scenario-text">{round.scenario}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0, transition:{ duration:.4, ease:[0.22,1,0.36,1] } }}
                  exit={{ opacity:0, y:-12, transition:{ duration:.2 } }}
                >
                  {/* Column headers */}
                  <div className="cmp-col-headers">
                    {[
                      { title:'Us',            hi:true  },
                      { title:'Agency',        hi:false },
                      { title:'Freelance/DIY', hi:false },
                    ].map(({ title, hi }) => (
                      <div key={title} style={{ display:'flex', alignItems:'center', gap:6, paddingBottom:10 }}>
                        <span style={{ fontSize:11, fontWeight:800, letterSpacing:.5, textTransform:'uppercase', color: hi ? TEAL : 'rgba(255,255,255,.3)' }}>{title}</span>
                        {hi && <Zap size={11} color={TEAL} />}
                      </div>
                    ))}
                  </div>

                  <div className="cmp-verdicts">
                    {[
                      { title:'Us',            data:round.us,     hi:true  },
                      { title:'Agency',        data:round.agency, hi:false },
                      { title:'Freelance/DIY', data:round.diy,    hi:false },
                    ].map(({ title, data, hi }) => (
                      <VerdictPill key={title} verdict={data.verdict} text={data.text} />
                    ))}
                  </div>

                  {/* Dot nav */}
                  <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:24 }}>
                    {ROUNDS.map((_, i) => (
                      <button key={i} onClick={() => setActive(i)} style={{
                        width:active===i?22:6, height:6, borderRadius:99,
                        background:active===i ? TEAL : 'rgba(255,255,255,.15)',
                        border:'none', cursor:'pointer', padding:0, transition:'all .3s',
                      }} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ marginTop:28, textAlign:'center' }}>
                <button className="cmp-cta" onClick={() => window.go && window.go(7)}>
                  Get Your Free Audit
                </button>
              </div>
            </motion.div>

          </div>

          {/* Bottom action chips */}
          <motion.div
            initial={{ opacity:0, y: reduced ? 0 : 10 }}
            whileInView={{ opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1], delay:.3 } }}
            viewport={{ once:true, amount:.05 }}
            className="cmp-chips"
          >
            <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(7)}} className="cmp-chip cmp-chip-primary">Get Your Free Audit</a>
            <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(8)}} className="cmp-chip">Contact David Directly</a>
            <a href="/blog" className="cmp-chip">Read the Blog</a>
            <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(3)}} className="cmp-chip">See Pricing</a>
          </motion.div>

        </div>
      </div>

      <style>{`
        .comparison-inner { height:100%;display:flex;flex-direction:column;padding:72px 6vw 32px;overflow-y:auto; }

        .cmp-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .cmp-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3vw,42px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#fff;margin-bottom:8px; }
        .cmp-h2-accent { color:#2AA5A0; }
        .cmp-sub { font-size:13px;color:rgba(255,255,255,.4); }

        .cmp-layout { display:grid;grid-template-columns:240px 1fr;gap:24px;flex:1;align-content:start;margin-bottom:24px; }

        .cmp-rounds { display:flex;flex-direction:column;gap:3px; }
        .cmp-round-btn {
          position:relative;display:flex;align-items:center;gap:10px;
          background:none;border:none;cursor:pointer;text-align:left;
          padding:10px 12px;border-radius:10px;transition:background .2s;width:100%;
          font-family:'Inter',sans-serif;
        }
        .cmp-round-btn:hover { background:rgba(255,255,255,.04); }
        .cmp-round-active { background:rgba(42,165,160,.08) !important; }
        .cmp-round-indicator { position:absolute;inset:0;border-radius:10px;border:1px solid rgba(42,165,160,.3);pointer-events:none; }
        .cmp-round-n { font-size:10px;font-weight:800;color:rgba(42,165,160,.5);min-width:22px;flex-shrink:0; }
        .cmp-round-label { font-size:12px;font-weight:700;color:rgba(255,255,255,.5); }
        .cmp-round-active .cmp-round-label { color:#fff; }

        .cmp-scores { margin-top:16px;padding:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px; }

        .cmp-verdict-wrap { background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px; }
        .cmp-scenario { display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.07); }
        .cmp-scenario-dot { width:8px;height:8px;border-radius:50%;background:#2AA5A0;flex-shrink:0; }
        .cmp-scenario-text { font-size:14px;font-style:italic;color:rgba(255,255,255,.6);line-height:1.5; }

        .cmp-col-headers { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:12px; }
        .cmp-verdicts { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }

        .cmp-cta {
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;
          border:none;border-radius:50px;padding:12px 28px;
          font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;
          box-shadow:0 8px 24px rgba(42,165,160,.35);transition:all .25s;
        }
        .cmp-cta:hover { transform:translateY(-2px);box-shadow:0 14px 32px rgba(42,165,160,.5); }

        /* Bottom chips */
        .cmp-chips { display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding-bottom:8px; }
        .cmp-chip {
          display:inline-flex;align-items:center;
          padding:8px 18px;border-radius:50px;
          font-size:12px;font-weight:700;font-family:'Inter',sans-serif;
          border:1px solid rgba(42,165,160,.3);color:rgba(42,165,160,.9);
          background:rgba(42,165,160,.08);cursor:pointer;text-decoration:none;
          transition:all .22s;
        }
        .cmp-chip:hover { background:rgba(42,165,160,.16);border-color:rgba(42,165,160,.5);color:#2AA5A0; }
        .cmp-chip-primary { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(42,165,160,.35); }
        .cmp-chip-primary:hover { transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,165,160,.5);color:#fff; }

        @media (max-width:900px) {
          .cmp-layout { grid-template-columns:1fr; }
          .cmp-rounds { flex-direction:row;flex-wrap:wrap; }
          .cmp-round-btn { width:auto; }
          .cmp-scores { display:none; }
        }
        @media (max-width:560px) {
          .comparison-inner { padding:80px 5vw 48px; }
          .cmp-verdicts { grid-template-columns:1fr; }
          .cmp-col-headers { grid-template-columns:1fr; }
        }
      `}</style>
    </section>
  );
}
