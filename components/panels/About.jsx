'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Phone, Zap, Check } from 'lucide-react';
import Link from 'next/link';

const TEAL = '#2AA5A0';

const SCENARIOS = [
  {
    emoji:'📞', label:'After-Hours Lead',
    before:{ title:'Without AI',        bullets:['Phone rings at 11pm — nobody answers','Lead gets frustrated, calls a competitor','You wake up to a missed opportunity','Happens every single night'] },
    after:{  title:'With Your AI',      bullets:['AI responds instantly, any time of night','Asks qualifying questions automatically','Books the appointment before you wake up','New contact added to CRM — zero effort'] },
  },
  {
    emoji:'🔍', label:'Google Ranking',
    before:{ title:'Without Local SEO', bullets:['You show up on page 3 — below the map','Competitors get the calls you should get','Google Business Profile incomplete or missing','Paying for a site nobody finds'] },
    after:{  title:'With Local SEO',    bullets:['Top 3 in Google Map Pack for your city','Phone number and reviews front and center','GBP fully optimized and updated monthly','Customers find you before they scroll down'] },
  },
  {
    emoji:'💬', label:'FAQ Overload',
    before:{ title:'Without Automation',bullets:['"What are your hours?" — answered 30× a week','"Do you serve my area?" — every single day','Hours lost to questions, not to paid work','After 5pm? Nobody answers. Lead moves on.'] },
    after:{  title:'With AI Chat',      bullets:['AI handles every FAQ — 24/7, instantly','Trained on your prices, area, and availability','You only talk to people ready to buy','Handles after-hours so you never miss a lead'] },
  },
  {
    emoji:'📊', label:'Lead Tracking',
    before:{ title:'Without CRM',       bullets:['Leads come in from 4 places, tracked nowhere','Follow-ups forgotten — revenue left behind','No idea which source is sending the best leads','You know something\'s slipping — can\'t see what'] },
    after:{  title:'With Automation',   bullets:['Every lead captured from every channel','Tagged by source, auto-followed up same day','Clear pipeline view — nothing falls through','Know exactly what\'s working and what\'s not'] },
  },
];

const GUARANTEES = [
  'Response within 6 hours — always',
  'You own everything we build — always',
  'No lock-in contracts — cancel anytime',
  '48-hour on-call after every launch',
];

const HOW = [
  { n:'🎯', title:'Radical Ownership',          desc:'No team to hide behind. Full accountability on every project, every time.' },
  { n:'🤝', title:'Honest Expertise',            desc:"I tell you what you need to hear, not what sells. If something won't work for you, I'll say so." },
  { n:'📊', title:'Results Over Hype',           desc:'Measurable outcomes only. No AI buzzwords, no vague promises — just numbers that move.' },
  { n:'⚡', title:'Accessible Intelligence',     desc:'Enterprise-grade technology at startup-friendly pricing. Big-company tools for real-world budgets.' },
  { n:'📚', title:'Continuous Learning',         desc:'AI moves fast. I stay sharp so your business always gets what\'s current, not what was relevant two years ago.' },
  { n:'🌱', title:'Partnership, Not Transactions',desc:'Long-term relationships over one-off gigs. Your growth is what keeps me here.' },
];

export default function About() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeout(() => setActive(v => (v + 1) % SCENARIOS.length), 400);
    }, 10000);
    return () => clearInterval(t);
  }, []);

  const s = SCENARIOS[active];

  const f = (d = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 22 },
    whileInView: { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="p3" aria-label="About David Pulis — AI automation and web expert">
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'#fff', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(42,165,160,.06) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:700, height:500, background:'radial-gradient(circle,rgba(42,165,160,.08) 0%,transparent 65%)', filter:'blur(80px)', pointerEvents:'none' }} />
      </div>

      <div className="about-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* ── Centered header ── */}
          <motion.div {...f(0)} style={{ textAlign:'center', marginBottom:16, maxWidth:1386, margin:'0 auto 16px', width:'100%' }}>
            <div className="abt-eyebrow">ABOUT</div>
            <h2 className="abt-h2">One person builds it.<br/><span className="abt-h2-accent">One person answers.</span></h2>
            <p className="abt-sub">No agencies. No middlemen. David handles everything — and stays on to make sure it keeps working.</p>
          </motion.div>

          {/* ── Main 3-col grid ── */}
          <div className="abt-grid">

            {/* Col 1: David card */}
            <motion.div {...f(0.08)} className="abt-david">
              <div className="abt-photo-wrap">
                <Image src="/david-pulis.jpg" alt="David Pulis — founder of AIandWEBservices" width={340} height={440} sizes="(max-width: 768px) 90vw, 340px" style={{ width:'100%', height:'auto', display:'block' }} />
              </div>
              <div className="abt-david-info">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <img src="/logo-icon-transparent.png" alt="AIandWEB" style={{ width:28, height:28, borderRadius:7, flexShrink:0 }} />
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:800, color:'#111827' }}>David Pulis</div>
                </div>
                <div style={{ fontSize:12, color:TEAL, fontWeight:700, marginBottom:12 }}>Founder · AIandWEBservices</div>
                <p style={{ fontSize:12, color:'#6b7280', lineHeight:1.75, marginBottom:14 }}>
                  I started AIandWEBservices because I kept seeing the same thing — great small businesses losing customers to competitors with better websites and faster response times, not better service. I fix that. I build the AI, the website, the automations — and I stay on to make sure it keeps working. You get one person who knows your business inside out, not a rotating team of strangers.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  <a href="mailto:david@aiandwebservices.com" className="abt-contact">
                    <div className="abt-contact-icon"><Mail size={12} color={TEAL}/></div>
                    david@aiandwebservices.com
                  </a>
                  <a href="tel:+13155720710" className="abt-contact">
                    <div className="abt-contact-icon"><Phone size={12} color={TEAL}/></div>
                    (315) 572-0710
                  </a>
                  <Link href="/guarantee" className="abt-contact">
                    <div className="abt-contact-icon"><Zap size={12} color="#f59e0b"/></div>
                    <span>Response <strong>within 6 hours</strong> — guaranteed, usually in minutes</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Col 2: Before/After + How I Work */}
            <motion.div {...f(0.12)} className="abt-scenarios">
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'#9ca3af', marginBottom:14, textAlign:'center' }}>What changes when you work with me</div>
              <div className="abt-tabs" style={{ justifyContent:'center' }}>
                {SCENARIOS.map((sc, i) => (
                  <button key={sc.label} onClick={() => setActive(i)} className={`abt-tab${active===i?' abt-tab-active':''}`}>
                    <span style={{ fontSize:14 }}>{sc.emoji}</span>
                    <span style={{ fontSize:10, fontWeight:700 }}>{sc.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity:0, x:20 }}
                    animate={{ opacity:1, x:0, transition:{ duration:.4, ease:[0.22,1,0.36,1] } }}
                    exit={{ opacity:0, x:-20, transition:{ duration:.25 } }}
                    style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}
                  >
                    <div className="abt-card abt-card-before">
                      <div className="abt-card-label abt-label-before">✗ Before</div>
                      <div className="abt-card-title">{s.before.title}</div>
                      <ul className="abt-bullets">{s.before.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                    </div>
                    <div className="abt-card abt-card-after">
                      <div className="abt-card-label abt-label-after">✓ After</div>
                      <div className="abt-card-title">{s.after.title}</div>
                      <ul className="abt-bullets">{s.after.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div style={{ display:'flex', justifyContent:'center', gap:6 }}>
                  {SCENARIOS.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)} style={{ width:active===i?20:7, height:7, borderRadius:99, background:active===i?TEAL:'#d1d5db', border:'none', cursor:'pointer', padding:0, transition:'all .3s' }}/>
                  ))}
                </div>

                {/* How I Work — lives in center col to fill space */}
                <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:16, marginTop:10 }}>
                  <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'#9ca3af', marginBottom:12, textAlign:'center' }}>How I Work</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {HOW.map(({ n, title, desc }) => (
                      <div key={n} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:12, padding:'12px 12px', display:'flex', flexDirection:'column' }}>
                        <div style={{ fontSize:22, lineHeight:1, marginBottom:7 }}>{n}</div>
                        <div style={{ fontSize:12, fontWeight:800, color:'#111827', marginBottom:4 }}>{title}</div>
                        <div style={{ fontSize:10, color:'#6b7280', lineHeight:1.55 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Col 3: Guarantees + Stats + CTA */}
            <motion.div {...f(0.16)} className="abt-right-col">
              <div className="abt-guarantees" style={{ marginBottom:16 }}>
                {GUARANTEES.map(g => (
                  <div key={g} style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:18, height:18, borderRadius:5, background:'rgba(42,165,160,.12)', border:'1px solid rgba(42,165,160,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Check size={10} color={TEAL} strokeWidth={2.5}/>
                    </div>
                    <span style={{ fontSize:12, color:'#374151', fontWeight:600 }}>{g}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:'#9ca3af', marginBottom:14 }}>By the numbers</div>
              <div className="abt-stats-col">
                {[
                  { n:'7–14', l:'day delivery',     desc:'Most projects go live in under 2 weeks.',     color:TEAL },
                  { n:'24/7', l:'AI uptime',         desc:'Your AI never sleeps, never misses a lead.', color:'#60a5fa' },
                  { n:'6hr',  l:'response SLA',      desc:'Guaranteed response on every ticket.',       color:'#a78bfa' },
                  { n:'0',    l:'lock-in contracts', desc:'Cancel anytime. No penalties, no hoops.',    color:'#34d399' },
                ].map(({ n, l, desc, color }) => (
                  <div key={l} className="abt-stat-card">
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color, lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:11, color:'#6b7280', lineHeight:1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── Bottom CTA ── */}
          <motion.div {...f(0.24)} className="panel-cta-wrap" style={{ maxWidth:1386, margin:'auto auto 0', width:'100%' }}>
            <div className="panel-cta-card">
              <p className="panel-cta-title">Based in Miami · Serving South Florida</p>
              <p className="panel-cta-sub" style={{ marginBottom: 4 }}>Travel to clients throughout Miami-Dade &amp; Broward</p>
              <p className="panel-cta-sub" style={{ marginBottom: 4 }}>Small businesses and individuals</p>
              <p className="panel-cta-sub">Remote across the US</p>
              <a className="panel-cta-btn" href="tel:+13155720710">Call David — (315) 572-0710</a>
            </div>
          </motion.div>


        </div>
      </div>

      <style>{`
        .about-inner { height:100%;display:flex;flex-direction:column;padding:90px 3vw 36px;overflow-y:auto;background:transparent; }
        .about-inner .panel-cta-wrap { margin-top:auto;padding-top:60px;padding-bottom:clamp(16px,2.5vh,28px); }

        .abt-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .abt-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(22px,3.8vw,46px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#111827;margin-bottom:10px; }
        .abt-h2-accent { color:#2AA5A0; }
        .abt-sub { font-size:14px;color:#6b7280;max-width:520px;margin:0 auto 10px;line-height:1.65; }

        .abt-guarantees { display:flex;flex-direction:column;gap:7px;background:rgba(42,165,160,.04);border:1px solid rgba(42,165,160,.12);border-radius:14px;padding:14px 18px; }
        .abt-grid { display:grid;grid-template-columns:220px 1fr 220px;gap:20px;align-content:start;max-width:1386px;margin:0 auto;width:100%; }

        .abt-david { display:flex;flex-direction:column;gap:0; }
        .abt-photo-wrap { position:relative;border-radius:16px;overflow:hidden;flex-shrink:0; }
        .abt-david-info { padding:14px 0 0; }
        .abt-contact { display:flex;align-items:center;gap:8px;font-size:11px;color:#6b7280;text-decoration:none;transition:color .2s; }
        .abt-contact:hover { color:#111827; }
        .abt-contact strong { color:#111827;font-weight:700; }
        .abt-contact-icon { width:24px;height:24px;border-radius:6px;background:rgba(42,165,160,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0; }

        .abt-scenarios { display:flex;flex-direction:column; }
        .abt-tabs { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px; }
        .abt-tab { display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.07);border-radius:50px;padding:6px 12px;cursor:pointer;font-family:'Inter',sans-serif;color:#6b7280;transition:all .2s; }
        .abt-tab:hover { background:rgba(0,0,0,.07); }
        .abt-tab-active { background:rgba(42,165,160,.1) !important;border-color:rgba(42,165,160,.25) !important;color:#2AA5A0 !important; }

        .abt-card { border-radius:14px;padding:18px 20px; }
        .abt-card-before { background:rgba(248,113,113,.05);border:1px solid rgba(248,113,113,.15); }
        .abt-card-after  { background:rgba(42,165,160,.06);border:1px solid rgba(42,165,160,.2); }
        .abt-card-label { font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px; }
        .abt-label-before { color:#f87171; }
        .abt-label-after  { color:#2AA5A0; }
        .abt-card-title { font-size:16px;font-weight:800;color:#111827;margin-bottom:8px;font-family:'Plus Jakarta Sans',sans-serif; }
        .abt-bullets { margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px; }
        .abt-bullets li { font-size:13px;color:#6b7280;line-height:1.5;padding-left:16px;position:relative; }
        .abt-bullets li::before { content:'–';position:absolute;left:0;color:#9ca3af; }
        .abt-card-after .abt-bullets li { color:#374151; }
        .abt-card-after .abt-bullets li::before { color:#2AA5A0; }

        .abt-right-col { display:flex;flex-direction:column; }
        .abt-stats-col { display:flex;flex-direction:column;gap:10px;margin-bottom:16px;flex:1; }
        .abt-stat-card { background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px; }



        @media (max-width:1386px) { .abt-grid { grid-template-columns:200px 1fr 200px; } .abt-how-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:900px) { .abt-grid { grid-template-columns:200px 1fr; } .abt-right-col { display:none; } }
        @media (max-width:768px) {
          .abt-grid { grid-template-columns:1fr; }
          .abt-guarantees { display:none; }
          .abt-photo-wrap img { width:100%;height:260px !important;object-fit:cover;object-position:center top; }
        }
        @media (max-width:640px) { .abt-how-grid { grid-template-columns:repeat(2,1fr); } .about-inner { padding:80px 5vw 40px; } }
      `}</style>
    </section>
  );
}
