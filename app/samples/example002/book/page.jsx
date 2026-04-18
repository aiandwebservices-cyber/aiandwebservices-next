'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const EM = '#10B981';
const DARK = '#0F1923';
const NAVY = '#152030';
const STEEL = '#1C2E40';
const LIGHT = '#E8F0F7';

const MEETING_TYPES = [
  {
    id: 'showing',
    icon: '🏡',
    title: 'Property Showing',
    subtitle: 'In-Person · 60 min',
    desc: 'Tour one or more listings with Sophia in person. We\'ll preview shortlisted properties and discuss your must-haves on site.',
  },
  {
    id: 'virtual',
    icon: '🎥',
    title: 'Virtual Tour',
    subtitle: 'Video Call · 45 min',
    desc: 'Live walkthrough of any listing via FaceTime or Zoom. Perfect if you\'re relocating or previewing before flying in.',
  },
  {
    id: 'strategy',
    icon: '📊',
    title: 'Strategy Consultation',
    subtitle: 'Phone or Video · 30 min',
    desc: 'Deep-dive into your buy, sell, or investment goals. Sophia will prepare a market analysis and personalized game plan.',
  },
];

const NEIGHBORHOODS = ['Coral Gables', 'Brickell', 'Coconut Grove', 'Pinecrest', 'Key Biscayne', 'Miami Beach', 'Fort Lauderdale', 'Aventura', 'Open to all areas'];
const PRICE_RANGES  = ['Under $500K', '$500K–$1M', '$1M–$2M', '$2M–$5M', '$5M+', 'Selling — not buying'];
const TIMELINES     = ['Ready now', 'Within 30 days', '1–3 months', '3–6 months', 'Just exploring'];
const INTERESTS     = ['Primary Residence', 'Vacation Home', 'Investment / Rental', 'Downsizing', 'Upsizing', 'Relocating to South FL', 'Selling my current home'];

// Generate next 5 weekdays from today
function getWeekdays(count = 5) {
  const days = [];
  const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push({ label: names[d.getDay()], date: d.getDate(), month: months[d.getMonth()], iso: d.toISOString().slice(0,10) });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const SLOTS = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];
const BOOKED = new Set(['9:30 AM','10:30 AM','2:30 PM','4:00 PM']); // demo unavailable slots

function chip(active) {
  return {
    display:'inline-block', padding:'.45rem 1.1rem', borderRadius:50,
    border:`1px solid ${active ? EM : 'rgba(232,240,247,.15)'}`,
    background: active ? `${EM}18` : 'rgba(232,240,247,.04)',
    color: active ? EM : `${LIGHT}88`,
    fontSize:'.95rem', fontWeight:600, cursor:'pointer',
    transition:'all .2s', fontFamily:"'Inter',sans-serif",
  };
}

function label(text) {
  return { display:'block', fontSize:'.78rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:`${EM}99`, marginBottom:'.45rem' };
}

function input(style={}) {
  return { width:'100%', background:'rgba(232,240,247,.06)', border:'1px solid rgba(232,240,247,.12)', borderRadius:6, padding:'.75rem 1rem', fontSize:'1rem', color:LIGHT, fontFamily:"'Inter',sans-serif", outline:'none', transition:'border-color .2s', ...style };
}

export default function BookPage() {
  const [step, setStep]     = useState(1);
  const [type, setType]     = useState(null);
  const [day, setDay]       = useState(null);
  const [slot, setSlot]     = useState(null);
  const [prefs, setPrefs]   = useState({ neighborhoods:[], priceRange:'', timeline:'', interests:[] });
  const [info, setInfo]     = useState({ name:'', email:'', phone:'', notes:'' });
  const [done, setDone]     = useState(false);
  const weekdays = getWeekdays(5);

  const toggleArr = (key, val) => setPrefs(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val],
  }));

  function submit(e) { e.preventDefault(); setDone(true); }

  const selectedType = MEETING_TYPES.find(m => m.id === type);

  if (done) return (
    <div style={{ minHeight:'100vh', background:DARK, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Inter',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ textAlign:'center', maxWidth:520 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`${EM}18`, border:`2px solid ${EM}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 2rem' }}>✓</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontStyle:'italic', color:LIGHT, marginBottom:'.75rem' }}>You're confirmed.</div>
        <p style={{ color:`${LIGHT}66`, fontSize:'.9rem', lineHeight:1.8, marginBottom:'2.5rem' }}>
          Sophia will be in touch within the hour to confirm details. A calendar invitation has been sent to <span style={{ color:EM }}>{info.email}</span>.
        </p>
        <div style={{ background:STEEL, border:`1px solid ${EM}25`, borderRadius:12, padding:'1.5rem 2rem', marginBottom:'2rem', textAlign:'left' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.25rem', paddingBottom:'1.25rem', borderBottom:'1px solid rgba(232,240,247,.08)' }}>
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=85" alt="Sophia Whitmore" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:`2px solid ${EM}` }} />
            <div>
              <div style={{ fontWeight:700, color:LIGHT, fontSize:'.95rem' }}>Sophia Whitmore</div>
              <div style={{ fontSize:'.75rem', color:`${LIGHT}55` }}>Luxury Real Estate · South Florida</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            {[
              { l:'Meeting Type', v: selectedType?.title },
              { l:'Format',       v: selectedType?.subtitle },
              { l:'Date',         v: weekdays.find(d => d.iso === day) ? `${weekdays.find(d => d.iso === day).label}, ${weekdays.find(d => d.iso === day).month} ${weekdays.find(d => d.iso === day).date}` : '—' },
              { l:'Time',         v: slot },
            ].map(r => (
              <div key={r.l}>
                <div style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:`${EM}77`, marginBottom:'.2rem' }}>{r.l}</div>
                <div style={{ fontSize:'.85rem', color:LIGHT }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/samples/example002" style={{ padding:'.75rem 1.75rem', borderRadius:50, background:`${EM}18`, border:`1px solid ${EM}50`, color:EM, fontSize:'.8rem', fontWeight:700, textDecoration:'none', letterSpacing:'.05em' }}>← Back to Site</Link>
          <Link href="/samples" style={{ padding:'.75rem 1.75rem', borderRadius:50, background:'rgba(232,240,247,.06)', border:'1px solid rgba(232,240,247,.12)', color:`${LIGHT}77`, fontSize:'.8rem', fontWeight:700, textDecoration:'none', letterSpacing:'.05em' }}>All Samples</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:"'Inter',sans-serif", color:LIGHT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${DARK}}::-webkit-scrollbar-thumb{background:${EM}44}
        input::placeholder,textarea::placeholder{color:rgba(232,240,247,.25)}
        input:focus,textarea:focus{border-color:${EM} !important}

        .eyebrow{font-size:.65rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:${EM};margin-bottom:.75rem;display:block}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:700;line-height:1.15;margin-bottom:.5rem;color:${LIGHT}}
        .section-title em{font-style:italic;color:${EM}}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:99, background:`${DARK}f0`, backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(232,240,247,.06)', padding:'1rem 3rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/samples/example002" style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:LIGHT, textDecoration:'none' }}>Aria <em style={{ color:EM }}>Realty</em></Link>
        <div style={{ fontSize:'.88rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:`${LIGHT}44` }}>Book a Consultation</div>
        <Link href="/samples/example002" style={{ fontSize:'.9rem', color:`${LIGHT}55`, textDecoration:'none', letterSpacing:'.05em' }}>← Back</Link>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'4rem 2rem 6rem' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div className="eyebrow">Free Consultation · No Obligation</div>
          <h1 className="section-title" style={{ marginBottom:'1rem' }}>
            Schedule time with <em>Sophia</em>
          </h1>
          <p style={{ color:`${LIGHT}55`, fontSize:'1rem', maxWidth:520, margin:'0 auto', lineHeight:1.8 }}>
            Choose your meeting type, pick a time that works, and Sophia will come prepared with listings, market data, and a custom strategy.
          </p>

          {/* Social proof */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.75rem', marginTop:'1.5rem', background:`${EM}10`, border:`1px solid ${EM}25`, borderRadius:50, padding:'.6rem 1.5rem' }}>
            <div style={{ display:'flex' }}>
              {['photo-1494790108377-be9c29b29330','photo-1507003211169-0a1dd7228f2d','photo-1534528741775-53994a69daeb'].map(id => (
                <img key={id} src={`https://images.unsplash.com/${id}?w=60&q=80`} alt="" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', border:`2px solid ${DARK}`, marginLeft:-6 }} />
              ))}
            </div>
            <span style={{ fontSize:'.9rem', color:`${LIGHT}88` }}><strong style={{ color:EM }}>23 clients</strong> booked this month</span>
          </div>
        </div>

        {/* Progress steps */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:'3rem' }}>
          {['Meeting Type','Your Goals','Pick a Time','Your Details'].map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', fontWeight:700, background: i+1 <= step ? EM : 'rgba(232,240,247,.08)', color: i+1 <= step ? '#fff' : `${LIGHT}44`, border:`2px solid ${i+1 <= step ? EM : 'rgba(232,240,247,.12)'}`, transition:'all .3s' }}>{i+1 < step ? '✓' : i+1}</div>
                <div style={{ fontSize:'.75rem', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color: i+1 <= step ? `${LIGHT}88` : `${LIGHT}33`, whiteSpace:'nowrap' }}>{s}</div>
              </div>
              {i < 3 && <div style={{ width:60, height:2, background: i+1 < step ? EM : 'rgba(232,240,247,.08)', margin:'0 .5rem', marginBottom:'1.6rem', transition:'background .3s' }} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Meeting Type ── */}
        {step === 1 && (
          <div style={{ maxWidth:820, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', marginBottom:'2.5rem' }}>
              {MEETING_TYPES.map(m => (
                <button key={m.id} onClick={() => setType(m.id)} style={{ textAlign:'left', padding:'1.75rem', borderRadius:12, border:`2px solid ${type === m.id ? EM : 'rgba(232,240,247,.1)'}`, background: type === m.id ? `${EM}10` : NAVY, cursor:'pointer', transition:'all .25s', fontFamily:"'Inter',sans-serif" }}>
                  <div style={{ fontSize:'2.2rem', marginBottom:'1rem' }}>{m.icon}</div>
                  <div style={{ fontSize:'1.15rem', fontWeight:700, color:LIGHT, marginBottom:'.3rem' }}>{m.title}</div>
                  <div style={{ fontSize:'.88rem', fontWeight:600, color:EM, letterSpacing:'.06em', marginBottom:'.85rem' }}>{m.subtitle}</div>
                  <div style={{ fontSize:'.95rem', color:`${LIGHT}55`, lineHeight:1.7 }}>{m.desc}</div>
                  {type === m.id && <div style={{ marginTop:'1rem', fontSize:'.85rem', fontWeight:700, color:EM, letterSpacing:'.08em', textTransform:'uppercase' }}>✓ Selected</div>}
                </button>
              ))}
            </div>
            <div style={{ textAlign:'center' }}>
              <button onClick={() => setStep(2)} disabled={!type} style={{ padding:'1.1rem 3rem', borderRadius:50, background: type ? EM : 'rgba(232,240,247,.08)', color: type ? '#fff' : `${LIGHT}33`, border:'none', cursor: type ? 'pointer' : 'not-allowed', fontSize:'1rem', fontWeight:700, letterSpacing:'.05em', transition:'all .25s' }}>
                Next — Your Goals →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preferences ── */}
        {step === 2 && (
          <div style={{ maxWidth:820, margin:'0 auto', background:NAVY, borderRadius:16, padding:'2.5rem', border:'1px solid rgba(232,240,247,.08)' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontStyle:'italic', color:LIGHT, marginBottom:'1.75rem' }}>Tell Sophia what you're looking for</h2>

            <div style={{ marginBottom:'1.5rem' }}>
              <div style={label("I'm interested in")}>I'm interested in <span style={{ color:`${LIGHT}33`, fontWeight:400, textTransform:'none', letterSpacing:0 }}>(select all that apply)</span></div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                {INTERESTS.map(t => <button key={t} type="button" onClick={() => toggleArr('interests', t)} style={chip(prefs.interests.includes(t))}>{t}</button>)}
              </div>
            </div>

            <div style={{ marginBottom:'1.5rem' }}>
              <div style={label('Target neighborhoods')}>Target neighborhoods</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                {NEIGHBORHOODS.map(n => <button key={n} type="button" onClick={() => toggleArr('neighborhoods', n)} style={chip(prefs.neighborhoods.includes(n))}>{n}</button>)}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
              <div>
                <div style={label('Price range')}>Price range</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                  {PRICE_RANGES.map(r => <button key={r} type="button" onClick={() => setPrefs(p => ({...p, priceRange:r}))} style={chip(prefs.priceRange === r)}>{r}</button>)}
                </div>
              </div>
              <div>
                <div style={label('Timeline')}>Timeline to buy/sell</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                  {TIMELINES.map(t => <button key={t} type="button" onClick={() => setPrefs(p => ({...p, timeline:t}))} style={chip(prefs.timeline === t)}>{t}</button>)}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:'1rem', justifyContent:'space-between' }}>
              <button onClick={() => setStep(1)} style={{ ...chip(false), padding:'.85rem 1.5rem' }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ padding:'1.1rem 2.5rem', borderRadius:50, background:EM, color:'#fff', border:'none', cursor:'pointer', fontSize:'1rem', fontWeight:700, letterSpacing:'.05em' }}>
                Next — Pick a Time →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Calendar & Slots ── */}
        {step === 3 && (
          <div style={{ maxWidth:820, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'1.5rem', alignItems:'stretch' }}>

              {/* Agent card */}
              <div style={{ background:NAVY, borderRadius:16, padding:'1.75rem', border:'1px solid rgba(232,240,247,.08)' }}>
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=85" alt="Sophia Whitmore" style={{ width:'100%', height:200, objectFit:'cover', objectPosition:'top', borderRadius:10, marginBottom:'1.25rem' }} />
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:LIGHT, marginBottom:'.25rem' }}>Sophia Whitmore</div>
                <div style={{ fontSize:'.88rem', color:EM, fontWeight:600, letterSpacing:'.08em', marginBottom:'1rem' }}>LUXURY REAL ESTATE · 14 YRS</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                  {['⭐ 4.9 · 186 reviews', '🏆 Top 1% South Florida', '🏡 $340M+ in sales', '📍 Coral Gables, FL'].map(s => (
                    <div key={s} style={{ fontSize:'.92rem', color:`${LIGHT}66` }}>{s}</div>
                  ))}
                </div>
                {selectedType && (
                  <div style={{ marginTop:'1.25rem', paddingTop:'1.25rem', borderTop:'1px solid rgba(232,240,247,.08)' }}>
                    <div style={{ fontSize:'.75rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:`${EM}77`, marginBottom:'.4rem' }}>Selected</div>
                    <div style={{ fontSize:'1rem', color:LIGHT, fontWeight:600 }}>{selectedType.title}</div>
                    <div style={{ fontSize:'.88rem', color:`${LIGHT}55` }}>{selectedType.subtitle}</div>
                  </div>
                )}
              </div>

              {/* Calendar + slots */}
              <div style={{ background:NAVY, borderRadius:16, padding:'1.75rem', border:'1px solid rgba(232,240,247,.08)', display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:'.8rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:`${EM}88`, marginBottom:'1rem' }}>Select a day</div>
                <div style={{ display:'flex', gap:'.6rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                  {weekdays.map(d => (
                    <button key={d.iso} onClick={() => { setDay(d.iso); setSlot(null); }} style={{ flex:1, minWidth:60, padding:'.85rem .5rem', borderRadius:10, border:`2px solid ${day === d.iso ? EM : 'rgba(232,240,247,.1)'}`, background: day === d.iso ? `${EM}15` : 'rgba(232,240,247,.04)', cursor:'pointer', textAlign:'center', transition:'all .2s' }}>
                      <div style={{ fontSize:'.78rem', fontWeight:600, color: day === d.iso ? EM : `${LIGHT}44`, letterSpacing:'.06em', textTransform:'uppercase' }}>{d.label}</div>
                      <div style={{ fontSize:'1.45rem', fontWeight:700, color: day === d.iso ? EM : LIGHT, lineHeight:1.2, margin:'.2rem 0' }}>{d.date}</div>
                      <div style={{ fontSize:'.75rem', color: day === d.iso ? `${EM}99` : `${LIGHT}33` }}>{d.month}</div>
                    </button>
                  ))}
                </div>

                {day && (
                  <>
                    <div style={{ fontSize:'.8rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:`${EM}88`, marginBottom:'.75rem' }}>Available times</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.5rem', marginBottom:'1.5rem' }}>
                      {SLOTS.map(s => {
                        const unavail = BOOKED.has(s);
                        const sel = slot === s;
                        return (
                          <button key={s} onClick={() => !unavail && setSlot(s)} disabled={unavail} style={{ padding:'.75rem', borderRadius:8, border:`1px solid ${sel ? EM : unavail ? 'rgba(232,240,247,.05)' : 'rgba(232,240,247,.15)'}`, background: sel ? `${EM}20` : unavail ? 'rgba(232,240,247,.02)' : 'rgba(232,240,247,.04)', color: sel ? EM : unavail ? `${LIGHT}22` : `${LIGHT}88`, fontSize:'.92rem', fontWeight:600, cursor: unavail ? 'not-allowed' : 'pointer', transition:'all .2s', textDecoration: unavail ? 'line-through' : 'none' }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div style={{ display:'flex', gap:'1rem', justifyContent:'space-between', marginTop:'auto', paddingTop:'1.5rem' }}>
                  <button onClick={() => setStep(2)} style={{ ...chip(false), padding:'.85rem 1.5rem' }}>← Back</button>
                  <button onClick={() => setStep(4)} disabled={!day || !slot} style={{ padding:'1.1rem 2rem', borderRadius:50, background: (day && slot) ? EM : 'rgba(232,240,247,.08)', color: (day && slot) ? '#fff' : `${LIGHT}33`, border:'none', cursor: (day && slot) ? 'pointer' : 'not-allowed', fontSize:'1rem', fontWeight:700, letterSpacing:'.05em', transition:'all .25s' }}>
                    Next — Your Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Your Details ── */}
        {step === 4 && (
          <form onSubmit={submit} style={{ maxWidth:640, margin:'0 auto', background:NAVY, borderRadius:16, padding:'2.5rem', border:'1px solid rgba(232,240,247,.08)' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontStyle:'italic', color:LIGHT, marginBottom:'1.75rem' }}>Almost there — your details</h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              <div>
                <label style={label('Full Name *')}>Full Name *</label>
                <input required style={input()} placeholder="Jane Smith" value={info.name} onChange={e => setInfo(i => ({...i, name:e.target.value}))} onFocus={e => e.target.style.borderColor=EM} onBlur={e => e.target.style.borderColor='rgba(232,240,247,.12)'} />
              </div>
              <div>
                <label style={label('Phone')}>Phone</label>
                <input type="tel" style={input()} placeholder="(305) 000-0000" value={info.phone} onChange={e => setInfo(i => ({...i, phone:e.target.value}))} onFocus={e => e.target.style.borderColor=EM} onBlur={e => e.target.style.borderColor='rgba(232,240,247,.12)'} />
              </div>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={label('Email Address *')}>Email Address *</label>
              <input required type="email" style={input()} placeholder="jane@email.com" value={info.email} onChange={e => setInfo(i => ({...i, email:e.target.value}))} onFocus={e => e.target.style.borderColor=EM} onBlur={e => e.target.style.borderColor='rgba(232,240,247,.12)'} />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={label('Anything Sophia should know?')}>Anything Sophia should know?</label>
              <textarea rows={3} style={input({ resize:'vertical', lineHeight:1.7 })} placeholder="e.g. Moving from New York, looking for waterfront with a dock, budget flexible for the right property..." value={info.notes} onChange={e => setInfo(i => ({...i, notes:e.target.value}))} onFocus={e => e.target.style.borderColor=EM} onBlur={e => e.target.style.borderColor='rgba(232,240,247,.12)'} />
            </div>

            {/* Booking summary */}
            <div style={{ background:STEEL, borderRadius:10, padding:'1.25rem', marginBottom:'1.5rem', border:`1px solid ${EM}20` }}>
              <div style={{ fontSize:'.78rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:`${EM}77`, marginBottom:'.75rem' }}>Booking Summary</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem .75rem' }}>
                {[
                  { l:'Type',      v: selectedType?.title },
                  { l:'Format',    v: selectedType?.subtitle },
                  { l:'Date',      v: weekdays.find(d => d.iso === day) ? `${weekdays.find(d => d.iso === day).label} ${weekdays.find(d => d.iso === day).month} ${weekdays.find(d => d.iso === day).date}` : '—' },
                  { l:'Time',      v: slot },
                  { l:'Goals',     v: prefs.interests.slice(0,2).join(', ') || '—' },
                  { l:'Budget',    v: prefs.priceRange || '—' },
                ].map(r => (
                  <div key={r.l}>
                    <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:`${EM}66` }}>{r.l}</div>
                    <div style={{ fontSize:'.95rem', color:`${LIGHT}88` }}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:'1rem', justifyContent:'space-between' }}>
              <button type="button" onClick={() => setStep(3)} style={{ ...chip(false), padding:'.85rem 1.5rem' }}>← Back</button>
              <button type="submit" disabled={!info.name || !info.email} style={{ padding:'1.1rem 2.5rem', borderRadius:50, background: (info.name && info.email) ? EM : 'rgba(232,240,247,.08)', color: (info.name && info.email) ? '#fff' : `${LIGHT}33`, border:'none', cursor: (info.name && info.email) ? 'pointer' : 'not-allowed', fontSize:'1rem', fontWeight:700, letterSpacing:'.05em', transition:'all .25s' }}>
                Confirm Booking ✓
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
