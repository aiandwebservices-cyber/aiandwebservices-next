'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';

const ORANGE = '#FF6B2B';
const DARK   = '#0A0D14';
const NAVY   = '#0D1117';
const STEEL  = '#1A2035';

const SERVICES = [
  { icon: '🏗️', title: 'New Construction',    desc: 'Ground-up residential and commercial builds. Design-build delivery from permit to handover.' },
  { icon: '🔨', title: 'Full Renovations',     desc: 'Whole-home remodels, additions, and structural changes. On time, on budget, guaranteed.' },
  { icon: '🏠', title: 'Roofing',              desc: 'Flat, pitched, metal, tile, and shingle. Storm damage, full replacements, inspections.' },
  { icon: '⚡', title: 'Electrical',           desc: 'Panel upgrades, full rewires, EV chargers, generator hookups. Licensed & code-compliant.' },
  { icon: '🔧', title: 'Plumbing',             desc: 'Repiping, water heaters, drain replacement, bathroom & kitchen rough-in.' },
  { icon: '❄️', title: 'HVAC',                 desc: 'New installs, full system replacements, ductwork, mini-splits. All major brands.' },
  { icon: '🧱', title: 'Framing & Drywall',   desc: 'Structural framing, metal stud, drywall, taping, texture. Rough-in to finish-ready.' },
  { icon: '⚙️', title: 'Concrete & Foundations', desc: 'Slabs, footings, driveways, retaining walls, concrete repair and waterproofing.' },
];

const STATS = [
  { num: '24+', label: 'Years in Business' },
  { num: '900+', label: 'Projects Completed' },
  { num: '18',  label: 'Licensed Trades' },
  { num: '100%', label: 'Licensed & Insured' },
];

const PROJECTS = [
  { label: 'Custom Home Build',    sub: 'Miami Beach · 4,200 sq ft',  img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85', tag: 'New Construction' },
  { label: 'Commercial Remodel',   sub: 'Brickell · 12,000 sq ft',    img: 'https://images.unsplash.com/photo-mO8voqjIA7w?w=800&q=85', tag: 'Commercial' },
  { label: 'Full Home Renovation', sub: 'Coral Gables · Historic',    img: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=85', tag: 'Renovation' },
  { label: 'Roofing & HVAC',       sub: 'Fort Lauderdale · Storm',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85', tag: 'Roofing' },
];

const REVIEWS = [
  { name: 'Marcus T.', stars: 5, text: 'Ironclad handled our entire home build — foundation to finishing. Flawless execution, zero surprises on cost. The project manager was on site every day.' },
  { name: 'Sandra L.', stars: 5, text: 'They pulled every permit, handled every trade, and delivered 3 days early. I never had to chase anyone. This is how construction should work.' },
  { name: 'James O.',  stars: 5, text: 'Our commercial remodel had to be done in phases to keep us open. Ironclad nailed the schedule every single phase. Highly recommend.' },
];

/* ── Network canvas animation ── */
function NetworkCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const N = 70;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blueprint grid
      ctx.strokeStyle = 'rgba(255,107,43,0.035)';
      ctx.lineWidth = 1;
      const g = 72;
      for (let x = 0; x < canvas.width; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      const t = Date.now() * 0.001;

      nodes.forEach(p => {
        p.pulse += 0.018;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130 && d > 0) {
          p.vx += (dx / d) * 0.25;
          p.vy += (dy / d) * 0.25;
        }

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }

        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x  += p.vx;
        p.y  += p.vy;

        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

        // Draw node
        const glow = 0.4 + Math.sin(p.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,43,${glow})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,107,43,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ── Intersection reveal ── */
function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : `translateY(${y}px)`, transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      const num = parseInt(target.replace(/\D/g, ''));
      let cur = 0;
      const step = Math.max(1, Math.ceil(num / 40));
      const t = setInterval(() => { cur = Math.min(cur + step, num); setVal(cur); if (cur >= num) clearInterval(t); }, 35);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  const prefix = target.match(/^\D+/) ? target.match(/^\D+/)[0] : '';
  const suf    = target.match(/\D+$/) ? target.match(/\D+$/)[0] : suffix;
  return <span ref={ref}>{prefix}{val}{suf}</span>;
}

/* ── Estimate form ── */
const PROJECT_TYPES = ['New Home Build', 'Full Renovation', 'Room Addition', 'Kitchen Remodel', 'Bathroom Remodel', 'Roofing', 'Electrical', 'Plumbing', 'HVAC', 'Concrete / Foundation', 'Commercial Build-Out', 'Storm Damage Repair', 'Other'];
const PROPERTY_TYPES = ['Single Family Home', 'Multi-Family / Duplex', 'Condo / Townhouse', 'Commercial Building', 'Warehouse / Industrial', 'Mixed Use'];
const TIMELINES = ['ASAP — urgent', 'Within 1 month', '1–3 months', '3–6 months', '6–12 months', 'Just planning / getting quotes'];
const BUDGETS = ['Under $25K', '$25K–$75K', '$75K–$150K', '$150K–$500K', '$500K–$1M', '$1M+', 'Not sure yet'];
const HEARD = ['Google Search', 'Referral from friend/family', 'Drove past a job site', 'Social media', 'Home show / event', 'Other'];

function EstimateForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', propertyType:'', projectType:[], description:'', sqft:'', stories:'', timeline:'', budget:'', permit:'', existing:'', financing:'', heard:'' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e) { e.preventDefault(); setSubmitted(true); }

  const inputStyle = { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,107,43,.2)', borderRadius:4, padding:'.75rem 1rem', fontSize:'.85rem', color:'#e2e8f0', fontFamily:"'Inter',sans-serif", outline:'none', transition:'border-color .2s' };
  const labelStyle = { display:'block', fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,107,43,.7)', marginBottom:'.4rem' };
  const chipStyle  = (active) => ({ display:'inline-block', padding:'.45rem 1rem', borderRadius:3, border:`1px solid ${active ? ORANGE : 'rgba(255,255,255,.1)'}`, background: active ? `${ORANGE}18` : 'rgba(255,255,255,.03)', color: active ? ORANGE : 'rgba(226,232,240,.55)', fontSize:'.75rem', fontWeight:600, cursor:'pointer', transition:'all .2s', fontFamily:"'Inter',sans-serif", letterSpacing:'.04em' });

  if (submitted) return (
    <div style={{ background:'rgba(255,107,43,.06)', border:`1px solid ${ORANGE}30`, borderRadius:8, padding:'3rem 2.5rem', textAlign:'center' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏗️</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'2rem', fontWeight:900, textTransform:'uppercase', color:ORANGE, letterSpacing:'.04em', marginBottom:'.5rem' }}>Request Received</div>
      <p style={{ fontSize:'.88rem', color:'rgba(226,232,240,.55)', lineHeight:1.8 }}>We'll review your project details and get back to you within 24 hours with a no-obligation estimate.</p>
      <div style={{ marginTop:'2rem', fontSize:'.75rem', color:'rgba(226,232,240,.3)', letterSpacing:'.08em', textTransform:'uppercase' }}>📞 Need it faster? Call (555) 123-4567</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ background:'rgba(10,13,20,.75)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,107,43,.15)', borderRadius:8, overflow:'hidden' }}>

      {/* Progress bar */}
      <div style={{ height:3, background:'rgba(255,255,255,.06)' }}>
        <div style={{ height:'100%', width:`${(step/3)*100}%`, background:ORANGE, transition:'width .4s cubic-bezier(.16,1,.3,1)' }} />
      </div>

      {/* Step header */}
      <div style={{ padding:'1.5rem 2rem .5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:`${ORANGE}88` }}>Step {step} of 3</div>
        <div style={{ display:'flex', gap:6 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ width:24, height:4, borderRadius:2, background: n <= step ? ORANGE : 'rgba(255,255,255,.1)', transition:'background .3s' }} />
          ))}
        </div>
      </div>

      {/* ── STEP 1: About You & Property ── */}
      {step === 1 && (
        <div style={{ padding:'1rem 2rem 2rem' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'1.6rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'.04em', color:'#e2e8f0', marginBottom:'1.25rem' }}>
            Tell us about <span style={{ color:ORANGE }}>yourself</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input required style={inputStyle} placeholder="John Smith" value={form.name} onChange={e => set('name', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input required type="tel" style={inputStyle} placeholder="(555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
            </div>
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={labelStyle}>Email Address *</label>
            <input required type="email" style={inputStyle} placeholder="john@email.com" value={form.email} onChange={e => set('email', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={labelStyle}>Property Address *</label>
            <input required style={inputStyle} placeholder="123 Main St, Miami, FL" value={form.address} onChange={e => set('address', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Property Type *</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:'.25rem' }}>
              {PROPERTY_TYPES.map(t => (
                <button key={t} type="button" onClick={() => set('propertyType', t)} style={chipStyle(form.propertyType === t)}>{t}</button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.email || !form.address || !form.propertyType} className="ic-btn ic-btn-primary" style={{ width:'100%', justifyContent:'center', opacity: (!form.name || !form.phone || !form.email || !form.address || !form.propertyType) ? .4 : 1 }}>
            Next — Project Details →
          </button>
        </div>
      )}

      {/* ── STEP 2: Project Details ── */}
      {step === 2 && (
        <div style={{ padding:'1rem 2rem 2rem' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'1.6rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'.04em', color:'#e2e8f0', marginBottom:'1.25rem' }}>
            Project <span style={{ color:ORANGE }}>details</span>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Type of Work * <span style={{ color:'rgba(226,232,240,.3)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(select all that apply)</span></label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:'.25rem' }}>
              {PROJECT_TYPES.map(t => {
                const active = form.projectType.includes(t);
                return <button key={t} type="button" onClick={() => set('projectType', active ? form.projectType.filter(x => x !== t) : [...form.projectType, t])} style={chipStyle(active)}>{t}</button>;
              })}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={labelStyle}>Approx. Square Footage</label>
              <input style={inputStyle} placeholder="e.g. 2,400 sq ft" value={form.sqft} onChange={e => set('sqft', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
            </div>
            <div>
              <label style={labelStyle}>Number of Stories</label>
              <input style={inputStyle} placeholder="e.g. 2" value={form.stories} onChange={e => set('stories', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
            </div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Describe the scope of work</label>
            <textarea rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }} placeholder="E.g. Full kitchen gut and remodel — new cabinets, counters, plumbing rough-in, electrical panel upgrade, tile throughout..." value={form.description} onChange={e => set('description', e.target.value)} onFocus={e => e.target.style.borderColor=ORANGE} onBlur={e => e.target.style.borderColor='rgba(255,107,43,.2)'} />
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Permits & Plans</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Already permitted', 'Have plans, no permit', 'Need design + permit', 'Starting from scratch', 'Not sure'].map(o => (
                <button key={o} type="button" onClick={() => set('permit', o)} style={chipStyle(form.permit === o)}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Is the property currently occupied?</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Yes — occupied', 'No — vacant', 'Partially occupied', 'Commercial / open for business'].map(o => (
                <button key={o} type="button" onClick={() => set('existing', o)} style={chipStyle(form.existing === o)}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:'1rem' }}>
            <button type="button" onClick={() => setStep(1)} style={{ ...chipStyle(false), padding:'.75rem 1.5rem', flex:'0 0 auto' }}>← Back</button>
            <button type="button" onClick={() => setStep(3)} disabled={form.projectType.length === 0} className="ic-btn ic-btn-primary" style={{ flex:1, justifyContent:'center', opacity: form.projectType.length === 0 ? .4 : 1 }}>
              Next — Timeline & Budget →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Timeline, Budget & Final ── */}
      {step === 3 && (
        <div style={{ padding:'1rem 2rem 2rem' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'1.6rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'.04em', color:'#e2e8f0', marginBottom:'1.25rem' }}>
            Timeline & <span style={{ color:ORANGE }}>budget</span>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>When do you want to start?</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {TIMELINES.map(t => (
                <button key={t} type="button" onClick={() => set('timeline', t)} style={chipStyle(form.timeline === t)}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Estimated budget range</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {BUDGETS.map(b => (
                <button key={b} type="button" onClick={() => set('budget', b)} style={chipStyle(form.budget === b)}>{b}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Are you considering financing?</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Yes — interested in options', 'No — paying cash / own funds', 'Already pre-approved', 'Not sure yet'].map(o => (
                <button key={o} type="button" onClick={() => set('financing', o)} style={chipStyle(form.financing === o)}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={labelStyle}>Have you gotten other quotes?</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['No — you are my first call', 'Yes — 1 or 2 others', 'Yes — comparing multiple bids', 'Had a quote, looking for better'].map(o => (
                <button key={o} type="button" onClick={() => set('heard', o)} style={chipStyle(form.heard === o)}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:'1rem', padding:'1rem', background:'rgba(255,107,43,.05)', border:'1px solid rgba(255,107,43,.12)', borderRadius:4 }}>
            <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:`${ORANGE}88`, marginBottom:'.5rem' }}>Your Request Summary</div>
            <div style={{ fontSize:'.8rem', color:'rgba(226,232,240,.6)', lineHeight:1.9 }}>
              <div><span style={{ color:'rgba(226,232,240,.4)', minWidth:90, display:'inline-block' }}>Name</span> <span style={{ color:'#e2e8f0' }}>{form.name}</span></div>
              <div><span style={{ color:'rgba(226,232,240,.4)', minWidth:90, display:'inline-block' }}>Property</span> {form.propertyType} · {form.address}</div>
              <div><span style={{ color:'rgba(226,232,240,.4)', minWidth:90, display:'inline-block' }}>Work</span> {form.projectType.join(', ') || '—'}</div>
              <div><span style={{ color:'rgba(226,232,240,.4)', minWidth:90, display:'inline-block' }}>Timeline</span> {form.timeline || '—'}</div>
              <div><span style={{ color:'rgba(226,232,240,.4)', minWidth:90, display:'inline-block' }}>Budget</span> {form.budget || '—'}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'1rem' }}>
            <button type="button" onClick={() => setStep(2)} style={{ ...chipStyle(false), padding:'.75rem 1.5rem', flex:'0 0 auto' }}>← Back</button>
            <button type="submit" className="ic-btn ic-btn-primary" style={{ flex:1, justifyContent:'center' }}>
              🏗️ Submit Estimate Request
            </button>
          </div>
        </div>
      )}

    </form>
  );
}

export default function IroncladConstruction() {
  const [scrollY, setScrollY] = useState(0);
  const [heroIn, setHeroIn]   = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 100);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: DARK, color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${DARK}}::-webkit-scrollbar-thumb{background:${ORANGE}88}
        ::selection{background:${ORANGE}33}

        /* NAV */
        .ic-nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 3rem;transition:all .4s}
        .ic-nav.scrolled{background:rgba(10,13,20,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,107,43,.15);box-shadow:0 4px 32px rgba(0,0,0,.4)}
        .ic-logo{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#fff;text-decoration:none;display:flex;align-items:center;gap:.6rem}
        .ic-logo-mark{width:32px;height:32px;background:${ORANGE};clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ic-links{display:flex;gap:2rem;list-style:none}
        .ic-links a{font-size:.78rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(226,232,240,.5);text-decoration:none;transition:color .2s}
        .ic-links a:hover{color:${ORANGE}}
        .ic-cta{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.65rem 1.5rem;background:${ORANGE};color:#fff;border:none;cursor:pointer;text-decoration:none;transition:all .2s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
        .ic-cta:hover{background:#ff8450;transform:translateY(-1px)}

        /* HERO */
        .ic-hero{position:relative;height:100vh;min-height:700px;display:flex;align-items:center;overflow:hidden;background:${DARK}}
        .ic-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(.55)}
        .ic-hero-canvas{position:absolute;inset:0}
        .ic-hero-gradient{position:absolute;inset:0;background:linear-gradient(to right,${DARK} 0%,rgba(10,13,20,.95) 30%,rgba(10,13,20,.4) 65%,rgba(10,13,20,.1) 100%)}
        .ic-hero-content{position:relative;z-index:2;padding:0 3rem;max-width:780px}
        .ic-hero-badge{display:inline-flex;align-items:center;gap:.6rem;font-size:.65rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:${ORANGE};margin-bottom:1.75rem;transition:opacity .9s .1s,transform .9s .1s cubic-bezier(.16,1,.3,1)}
        .ic-hero-badge.hide{opacity:0;transform:translateX(-20px)}
        .ic-hero-badge::before{content:'';width:28px;height:2px;background:${ORANGE}}
        .ic-h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(4rem,10vw,9.5rem);line-height:.9;letter-spacing:.02em;text-transform:uppercase;margin-bottom:1.75rem}
        .ic-h1 .line{display:block;transition:transform 1.1s cubic-bezier(.16,1,.3,1),opacity 1.1s cubic-bezier(.16,1,.3,1)}
        .ic-h1 .line.hide{transform:translateY(60px);opacity:0}
        .ic-h1 .orange{color:${ORANGE}}
        .ic-hero-sub{font-size:1rem;font-weight:400;color:rgba(226,232,240,.55);max-width:500px;line-height:1.75;margin-bottom:2.25rem;transition:opacity .9s .55s,transform .9s .55s cubic-bezier(.16,1,.3,1)}
        .ic-hero-sub.hide{opacity:0;transform:translateY(16px)}
        .ic-hero-btns{display:flex;gap:1rem;flex-wrap:wrap;transition:opacity .9s .75s,transform .9s .75s cubic-bezier(.16,1,.3,1)}
        .ic-hero-btns.hide{opacity:0;transform:translateY(16px)}

        /* TICKER */
        .ic-ticker{overflow:hidden;background:${ORANGE};padding:.6rem 0}
        .ic-ticker-inner{display:inline-flex;animation:icTick 22s linear infinite}
        .ic-ticker-item{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.9);padding:0 2rem;white-space:nowrap}
        @keyframes icTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        /* STATS BAR */
        .ic-stats{display:grid;grid-template-columns:repeat(4,1fr);background:${STEEL};border-bottom:1px solid rgba(255,107,43,.12)}
        .ic-stat{padding:2.5rem 2rem;text-align:center;border-right:1px solid rgba(255,255,255,.05)}
        .ic-stat:last-child{border-right:none}
        .ic-stat-num{font-family:'Barlow Condensed',sans-serif;font-size:3rem;font-weight:900;color:${ORANGE};line-height:1;margin-bottom:.35rem}
        .ic-stat-label{font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(226,232,240,.4)}

        /* SECTIONS */
        .ic-section{padding:6rem 3rem;max-width:1280px;margin:0 auto}
        .ic-eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:${ORANGE};margin-bottom:.75rem;display:flex;align-items:center;gap:.75rem}
        .ic-eyebrow::before{content:'';width:24px;height:2px;background:${ORANGE}}
        .ic-big-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(2.5rem,6vw,5rem);text-transform:uppercase;line-height:.95;letter-spacing:.02em;margin-bottom:1rem}
        .ic-big-title .orange{color:${ORANGE}}

        /* SERVICES GRID */
        .ic-svc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.06);margin-top:3rem;border:1px solid rgba(255,255,255,.06)}
        .ic-svc-card{background:${NAVY};padding:2rem 1.75rem;transition:background .3s,border-left .3s;border-left:3px solid transparent;cursor:default}
        .ic-svc-card:hover{background:${STEEL};border-left-color:${ORANGE}}
        .ic-svc-icon{font-size:2rem;margin-bottom:1rem;display:block}
        .ic-svc-title{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.6rem;color:#fff}
        .ic-svc-desc{font-size:.8rem;color:rgba(226,232,240,.45);line-height:1.7}

        /* PROJECTS */
        .ic-projects{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:320px 320px;gap:4px;margin-top:3rem}
        .ic-proj{position:relative;overflow:hidden;cursor:pointer}
        .ic-proj img{width:100%;height:100%;object-fit:cover;filter:brightness(.65);transition:transform .7s cubic-bezier(.16,1,.3,1),filter .7s}
        .ic-proj:hover img{transform:scale(1.06);filter:brightness(.85)}
        .ic-proj-info{position:absolute;bottom:0;left:0;right:0;padding:1.5rem;background:linear-gradient(to top,rgba(10,13,20,.95) 0%,transparent 100%)}
        .ic-proj-tag{display:inline-block;font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${ORANGE};background:${ORANGE}18;border:1px solid ${ORANGE}40;padding:.2rem .7rem;border-radius:2px;margin-bottom:.5rem}
        .ic-proj-title{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#fff;line-height:1.1}
        .ic-proj-sub{font-size:.72rem;color:rgba(226,232,240,.5);margin-top:.25rem}

        /* PROCESS */
        .ic-process{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:${STEEL};margin-top:3rem}
        .ic-step{padding:2.5rem 2rem;border-right:1px solid rgba(255,255,255,.05);position:relative}
        .ic-step:last-child{border-right:none}
        .ic-step-num{font-family:'Barlow Condensed',sans-serif;font-size:5rem;font-weight:900;color:${ORANGE};opacity:.1;line-height:1;margin-bottom:-.5rem}
        .ic-step-title{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin-bottom:.6rem}
        .ic-step-desc{font-size:.8rem;color:rgba(226,232,240,.45);line-height:1.7}

        /* REVIEWS */
        .ic-reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(255,255,255,.05);margin-top:3rem}
        .ic-review{background:${NAVY};padding:2.5rem;transition:background .3s}
        .ic-review:hover{background:${STEEL}}
        .ic-review-stars{color:${ORANGE};font-size:.95rem;letter-spacing:.1em;margin-bottom:1rem}
        .ic-review-text{font-size:.88rem;font-weight:300;line-height:1.85;color:rgba(226,232,240,.7);font-style:italic;margin-bottom:1.25rem}
        .ic-review-name{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:${ORANGE}}

        /* CTA SECTION */
        .ic-cta-section{position:relative;overflow:hidden;background:${STEEL};padding:8rem 3rem;border-top:1px solid rgba(255,107,43,.15)}
        @media(max-width:900px){.ic-cta-section .ic-form-grid{grid-template-columns:1fr !important;gap:3rem !important}}
        .ic-cta-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80');background-size:cover;background-position:center right;filter:brightness(.55)}
        .ic-cta-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,${STEEL} 0%,rgba(26,32,53,.85) 40%,rgba(26,32,53,.4) 100%)}
        .ic-cta-content{position:relative;z-index:2;max-width:700px}
        .ic-cta-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(3rem,8vw,7rem);text-transform:uppercase;line-height:.9;letter-spacing:.02em;margin-bottom:2rem}
        .ic-cta-title .orange{color:${ORANGE}}
        .ic-trust{display:flex;gap:2rem;flex-wrap:wrap;margin-bottom:2.5rem}
        .ic-trust-item{display:flex;align-items:center;gap:.5rem;font-size:.78rem;font-weight:600;color:rgba(226,232,240,.5);letter-spacing:.05em}
        .ic-trust-item::before{content:'✓';color:${ORANGE};font-weight:800}

        /* BUTTONS */
        .ic-btn{display:inline-flex;align-items:center;gap:.5rem;font-family:'Inter',sans-serif;font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.85rem 2rem;text-decoration:none;transition:all .25s;cursor:pointer;border:none;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)}
        .ic-btn-primary{background:${ORANGE};color:#fff}
        .ic-btn-primary:hover{background:#ff8450;transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,107,43,.4)}
        .ic-btn-outline{background:transparent;color:${ORANGE};border:1px solid ${ORANGE}60}
        .ic-btn-outline:hover{background:${ORANGE}15;border-color:${ORANGE};transform:translateY(-2px)}

        /* FOOTER */
        .ic-footer{background:#060810;padding:1.75rem 3rem;border-top:1px solid rgba(255,107,43,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
        .ic-footer-logo{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:rgba(226,232,240,.25)}
        .ic-footer-logo span{color:${ORANGE}66}
        .ic-footer-note{font-size:.65rem;color:rgba(226,232,240,.25);letter-spacing:.08em;text-transform:uppercase}
        .back-link{font-size:.68rem;color:${ORANGE};text-decoration:none;letter-spacing:.1em;text-transform:uppercase}
        .back-link:hover{text-decoration:underline}

        @media(max-width:1000px){
          .ic-svc-grid{grid-template-columns:repeat(2,1fr)}
          .ic-stats{grid-template-columns:repeat(2,1fr)}
          .ic-process{grid-template-columns:repeat(2,1fr)}
          .ic-projects{grid-template-columns:1fr;grid-template-rows:auto}
          .ic-proj{height:280px}
        }
        @media(max-width:768px){
          .ic-nav{padding:1rem 1.5rem}.ic-links{display:none}
          .ic-hero-content{padding:0 1.5rem}
          .ic-section{padding:4rem 1.5rem}
          .ic-svc-grid{grid-template-columns:1fr}
          .ic-stats{grid-template-columns:repeat(2,1fr)}
          .ic-reviews{grid-template-columns:1fr}
          .ic-process{grid-template-columns:1fr}
          .ic-cta-section{padding:5rem 1.5rem}
          .ic-footer{flex-direction:column;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav className={`ic-nav${scrollY > 50 ? ' scrolled' : ''}`}>
        <a href="#" className="ic-logo">
          <div className="ic-logo-mark" />
          Ironclad <span style={{ color: ORANGE }}>Construction</span>
        </a>
        <ul className="ic-links">
          {['Services','Projects','Process','Reviews','Contact'].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <a href="/contact" className="ic-cta">Free Estimate</a>
      </nav>

      {/* HERO */}
      <section className="ic-hero">
        <img className="ic-hero-bg" src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85" alt="Construction site" />
        <div className="ic-hero-canvas"><NetworkCanvas /></div>
        <div className="ic-hero-gradient" />
        <div className="ic-hero-content">
          <div className={`ic-hero-badge${heroIn ? '' : ' hide'}`}>South Florida · Licensed General Contractor</div>
          <h1 className="ic-h1">
            <span className={`line${heroIn ? '' : ' hide'}`} style={{ transitionDelay: '.1s' }}>We</span>
            <span className={`line orange${heroIn ? '' : ' hide'}`} style={{ transitionDelay: '.2s' }}>Build.</span>
            <span className={`line${heroIn ? '' : ' hide'}`} style={{ transitionDelay: '.3s' }}>We</span>
            <span className={`line orange${heroIn ? '' : ' hide'}`} style={{ transitionDelay: '.4s' }}>Deliver.</span>
          </h1>
          <p className={`ic-hero-sub${heroIn ? '' : ' hide'}`}>
            From ground-up construction to full remodels, roofing to HVAC — Ironclad handles every trade under one contract. 24 years. 900+ projects. Zero excuses.
          </p>
          <div className={`ic-hero-btns${heroIn ? '' : ' hide'}`}>
            <a href="/contact" className="ic-btn ic-btn-primary">Get a Free Estimate</a>
            <a href="#projects" className="ic-btn ic-btn-outline">View Our Work</a>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ic-ticker">
        <div className="ic-ticker-inner">
          {Array(2).fill(['New Construction','Roofing','Electrical','Plumbing','HVAC','Framing','Concrete','Renovations','Licensed & Insured','South Florida']).flat().map((t, i) => (
            <span key={i} className="ic-ticker-item">◆ {t}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="ic-stats">
        {STATS.map(s => (
          <div key={s.label} className="ic-stat">
            <div className="ic-stat-num"><Counter target={s.num} /></div>
            <div className="ic-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="ic-section" id="services">
        <Reveal><div className="ic-eyebrow">What We Do</div></Reveal>
        <Reveal delay={.1}>
          <div className="ic-big-title">Every Trade.<br /><span className="orange">One Contractor.</span></div>
        </Reveal>
        <Reveal delay={.15}>
          <p style={{ fontSize: '.875rem', color: 'rgba(226,232,240,.45)', maxWidth: 500, lineHeight: 1.8, marginTop: '.75rem' }}>
            We self-perform the core trades and manage the rest. No subcontractor surprises — one point of contact for every phase.
          </p>
        </Reveal>
        <div className="ic-svc-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * .06}>
              <div className="ic-svc-card">
                <span className="ic-svc-icon">{s.icon}</span>
                <div className="ic-svc-title">{s.title}</div>
                <p className="ic-svc-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <div id="projects" style={{ scrollMarginTop: '80px', paddingTop: '5rem' }}>
      <div style={{ padding: '0 3rem 6rem', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal><div className="ic-eyebrow">Featured Work</div></Reveal>
        <Reveal delay={.1}><div className="ic-big-title">Built by <span className="orange">Ironclad.</span></div></Reveal>
        <div className="ic-projects" style={{ marginTop: '2.5rem' }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.label} delay={i * .08}>
              <div className="ic-proj">
                <img src={p.img} alt={p.label} />
                <div className="ic-proj-info">
                  <div className="ic-proj-tag">{p.tag}</div>
                  <div className="ic-proj-title">{p.label}</div>
                  <div className="ic-proj-sub">{p.sub}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </div>

      {/* PROCESS */}
      <div style={{ background: NAVY, padding: '6rem 0' }} id="process">
        <div className="ic-section" style={{ padding: '0 3rem' }}>
          <Reveal><div className="ic-eyebrow">How It Works</div></Reveal>
          <Reveal delay={.1}><div className="ic-big-title">Simple <span className="orange">Process.</span></div></Reveal>
        </div>
        <div style={{ maxWidth: 1280, margin: '2.5rem auto 0', padding: '0 3rem' }}>
          <div className="ic-process">
            {[
              { n: '01', title: 'Free Estimate',    desc: 'We walk the job, review scope, and deliver a detailed written estimate within 48 hours. No vague ballparks.' },
              { n: '02', title: 'Permit & Plan',     desc: 'We pull every permit, handle inspections, and coordinate with your architect or ours. Fully code-compliant.' },
              { n: '03', title: 'Build',             desc: "Daily on-site management. Weekly progress photos and reports. You know exactly what's happening and when." },
              { n: '04', title: 'Final Walkthrough', desc: "We don't close until you sign off. Punch list completed, inspections passed, documentation handed over." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * .1}>
                <div className="ic-step">
                  <div className="ic-step-num">{s.n}</div>
                  <div className="ic-step-title">{s.title}</div>
                  <p className="ic-step-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div id="reviews" style={{ background: DARK, padding: '6rem 3rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal><div className="ic-eyebrow">Client Reviews</div></Reveal>
          <Reveal delay={.1}><div className="ic-big-title">Owners <span className="orange">Trust Us.</span></div></Reveal>
          <div className="ic-reviews" style={{ marginTop: '2.5rem' }}>
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * .1}>
                <div className="ic-review">
                  <div className="ic-review-stars">{'★'.repeat(r.stars)}</div>
                  <p className="ic-review-text">"{r.text}"</p>
                  <div className="ic-review-name">{r.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA / CONTACT FORM */}
      <section className="ic-cta-section" id="contact">
        <div className="ic-cta-bg" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'start' }}>

          {/* LEFT — pitch */}
          <div>
            <Reveal><div className="ic-eyebrow">Start Your Project</div></Reveal>
            <Reveal delay={.1}>
              <div className="ic-cta-title">Get a <span className="orange">Free</span><br />Estimate</div>
            </Reveal>
            <Reveal delay={.2}>
              <div className="ic-trust" style={{ flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '✓', text: 'No obligation — ever' },
                  { icon: '✓', text: 'Detailed written quote in 48 hrs' },
                  { icon: '✓', text: 'Licensed, bonded & fully insured' },
                  { icon: '✓', text: 'One contractor for every trade' },
                ].map(t => (
                  <div key={t.text} className="ic-trust-item">{t.text}</div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={.3}>
              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,107,43,.15)' }}>
                <p style={{ fontSize: '.72rem', color: 'rgba(226,232,240,.35)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.75rem' }}>Or call us directly</p>
                <a href="tel:+15551234567" style={{ fontSize: '1.6rem', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, color: ORANGE, textDecoration: 'none', letterSpacing: '.04em' }}>
                  (555) 123-4567
                </a>
                <p style={{ marginTop: '1rem', fontSize: '.72rem', color: 'rgba(226,232,240,.3)', letterSpacing: '.05em' }}>
                  📍 Miami-Dade · Broward · Palm Beach
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — form */}
          <Reveal delay={.15}>
            <EstimateForm />
          </Reveal>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="ic-footer">
        <span className="ic-footer-logo">Ironclad <span>Construction</span></span>
        <Link href="/samples" className="back-link">← All Samples</Link>
        <span className="ic-footer-note">Built by aiandwebservices.com</span>
      </footer>

      <ChatWidget
        accent={ORANGE}
        agentName="Ironclad AI"
        greeting="Need a contractor? We cover every trade — new builds, roofing, electrical, HVAC and more. Get a free estimate! 🏗️"
        quickReplies={['Get a free estimate', 'What do you build?', 'Are you licensed?']}
        autoReplies={{
          'Get a free estimate': "We'll come to you — free, no obligation. Call (555) 123-4567 or drop your details and we'll call you back within 2 hours.",
          'What do you build?': "Everything: new homes, commercial builds, remodels, roofing, electrical, plumbing, HVAC, foundations, and framing. One contractor, every trade.",
          'Are you licensed?': "Yes — fully licensed general contractor in Miami-Dade, Broward, and Palm Beach. Fully insured. We pull every permit and handle all inspections.",
        }}
      />
    </div>
  );
}
