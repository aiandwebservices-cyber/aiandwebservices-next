'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';

const EM = '#10B981';
const DARK = '#0F1923';
const LIGHT = '#E8F0F7';

const LISTINGS = [
  { badge: 'Featured', addr: '2847 Palmetto Bay Drive', city: 'Coral Gables, FL', beds: 5, baths: 4, sqft: '4,820', price: '$3,200,000', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85' },
  { badge: 'New', addr: '1104 Brickell Key Blvd #3201', city: 'Miami, FL', beds: 3, baths: 3, sqft: '2,150', price: '$1,480,000', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85' },
  { badge: 'Sold', addr: '880 Intracoastal Dr', city: 'Fort Lauderdale, FL', beds: 4, baths: 3, sqft: '3,200', price: '$2,100,000', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=85' },
];

const SERVICES = [
  { icon: '🏡', title: 'Buyer Representation', desc: 'From pre-approval to closing day — precision negotiation to get you the right home at the right price.' },
  { icon: '📈', title: 'Seller Strategy', desc: 'Professional staging, photography, targeted marketing, and aggressive negotiation on your behalf.' },
  { icon: '🏢', title: 'Investment Properties', desc: 'Cap rate analysis, rental projections, and off-market access for portfolio growth.' },
  { icon: '🌴', title: 'Luxury Waterfront', desc: 'Specialists in South Florida waterfront estates, private docks, and intracoastal properties.' },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, y = 50, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateY(${y}px)`, transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, x = -70, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateX(${x}px)`, transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0; const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const t = setInterval(() => { v = Math.min(v + step, target); setVal(v); if (v >= target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}

function CounterCell({ value, prefix = '', suffix = '', label }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(value, inView);
  return (
    <div ref={ref} className="stat-cell">
      <div className="stat-val">{prefix}{count.toLocaleString()}{suffix}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export default function AriaRealty() {
  const [scrollY, setScrollY] = useState(0);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 120);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: DARK, color: LIGHT, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${DARK}}::-webkit-scrollbar-thumb{background:${EM}66}
        ::selection{background:${EM}33}

        .ar-nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 3rem;transition:background .5s,border-color .5s}
        .ar-nav.scrolled{background:rgba(15,25,35,.97);backdrop-filter:blur(16px);border-bottom:1px solid rgba(16,185,129,.15)}
        .ar-logo{font-family:'Playfair Display',serif;font-size:1.35rem;color:${LIGHT};text-decoration:none;letter-spacing:.02em}
        .ar-logo em{color:${EM};font-style:italic}
        .ar-links{display:flex;gap:2.5rem;list-style:none}
        .ar-links a{font-size:.75rem;font-weight:500;letter-spacing:.06em;color:${LIGHT}77;text-decoration:none;transition:color .25s}
        .ar-links a:hover{color:${EM}}
        .ar-cta{background:${EM};color:#fff;border:none;padding:.65rem 1.6rem;font-size:.75rem;font-weight:600;letter-spacing:.04em;cursor:pointer;text-decoration:none;transition:all .25s;border-radius:2px;display:inline-block}
        .ar-cta:hover{background:#0ea472}
        .ar-cta-out{background:transparent;color:${EM};border:1px solid ${EM};padding:.75rem 2rem;font-size:.8rem;font-weight:500;letter-spacing:.04em;cursor:pointer;text-decoration:none;transition:all .25s;border-radius:2px;display:inline-block}
        .ar-cta-out:hover{background:${EM};color:#fff}

        /* HERO - cinematic full-bleed */
        .hero{position:relative;height:100vh;min-height:680px;overflow:hidden;display:flex;align-items:flex-start}
        .hero-bg{position:absolute;inset:0;z-index:0}
        .hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:brightness(.55) saturate(.85)}
        .hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,${DARK}cc 0%,${DARK}55 20%,transparent 50%)}
        .hero-left{position:relative;z-index:2;width:100%;padding:7rem 5rem 0}

        /* Option A — magazine cover split */
        .hero-tag{font-size:.65rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:${EM};margin-bottom:1.25rem;display:flex;align-items:center;gap:.75rem;transition:opacity 1s .2s,transform 1s .2s cubic-bezier(.16,1,.3,1)}
        .hero-tag.hidden{opacity:0;transform:translateY(16px)}
        .hero-tag::before{content:'';width:28px;height:1px;background:${EM}}
        .hero-bottom{display:flex;align-items:baseline;justify-content:space-between;gap:2rem;margin-bottom:2rem}
        .hero-h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,6.5vw,7rem);font-weight:700;line-height:1.05;margin:0;white-space:nowrap}
        .hero-h1 em{font-style:italic;color:${EM}}
        .hero-h1-right{font-family:'Playfair Display',serif;font-size:clamp(3rem,6.5vw,7rem);font-weight:700;font-style:italic;color:${EM};white-space:nowrap;line-height:1.05;text-align:right;transition:opacity 1.2s .3s,transform 1.2s .3s cubic-bezier(.16,1,.3,1)}
        .hero-h1-right.hidden{opacity:0;transform:translateY(40px)}
        .hero-h1.hidden{opacity:0;transform:translateY(40px)}
        .hero-p{font-size:.875rem;line-height:1.85;color:${LIGHT}77;max-width:380px;margin-bottom:0;transition:opacity 1s .6s,transform 1s .6s cubic-bezier(.16,1,.3,1)}
        .hero-p.hidden{opacity:0;transform:translateY(20px)}
        .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;transition:opacity 1s .85s,transform 1s .85s cubic-bezier(.16,1,.3,1)}
        .hero-btns.hidden{opacity:0;transform:translateY(20px)}

        /* STATS BAR */
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.05)}
        .stat-cell{background:rgba(15,25,35,.97);padding:3rem 2rem;text-align:center}
        .stat-val{font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:${EM};line-height:1}
        .stat-lbl{font-size:.65rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:${LIGHT}44;margin-top:.6rem}

        /* LISTINGS */
        .section{padding:8rem 3rem;max-width:1200px;margin:0 auto}
        .eyebrow{font-size:.65rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:${EM};margin-bottom:.75rem}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:700;margin-bottom:.5rem}
        .section-title em{font-style:italic;color:${EM}}
        .em-line{width:48px;height:2px;background:${EM};margin:1.25rem 0 2.5rem}

        .listing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:2.5rem}
        .listing-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:3px;overflow:hidden;transition:transform .4s cubic-bezier(.16,1,.3,1),border-color .4s,box-shadow .4s}
        .listing-card:hover{transform:translateY(-6px);border-color:${EM}44;box-shadow:0 20px 60px rgba(16,185,129,.1)}
        .listing-img-wrap{position:relative;aspect-ratio:16/10;overflow:hidden}
        .listing-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1)}
        .listing-card:hover .listing-img-wrap img{transform:scale(1.08)}
        .listing-badge{position:absolute;top:.85rem;left:.85rem;background:${EM};color:#fff;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.25rem .65rem;border-radius:2px}
        .listing-badge.sold{background:#4B5563}
        .listing-info{padding:1.5rem}
        .listing-price{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:${LIGHT};margin-bottom:.4rem}
        .listing-addr{font-size:.875rem;color:${LIGHT};margin-bottom:.2rem}
        .listing-city{font-size:.75rem;color:${LIGHT}44;margin-bottom:1rem}
        .listing-meta{display:flex;gap:1.25rem;font-size:.75rem;color:${LIGHT}66}

        /* SERVICES */
        .svc-bg{background:#0a1219;padding:8rem 3rem}
        .svc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:rgba(255,255,255,.04);margin-top:3rem;max-width:1200px;margin-left:auto;margin-right:auto}
        .svc-card{background:#0a1219;padding:3.5rem;transition:background .35s}
        .svc-card:hover{background:rgba(16,185,129,.06)}
        .svc-icon{font-size:2.25rem;margin-bottom:1.25rem}
        .svc-title{font-family:'Playfair Display',serif;font-size:1.35rem;margin-bottom:.75rem}
        .svc-desc{font-size:.875rem;line-height:1.85;color:${LIGHT}66}

        /* AGENT */
        .agent-wrap{display:grid;grid-template-columns:1fr 1fr;min-height:650px}
        .agent-img-col{position:relative;overflow:hidden}
        .agent-img-col img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;filter:brightness(.85) saturate(.9)}
        .agent-img-col::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,#0a1219 100%)}
        .agent-text-col{background:#0a1219;display:flex;align-items:center;padding:6rem 5rem;position:relative}
        .agent-big{font-size:10rem;font-weight:700;color:${EM}08;line-height:1;position:absolute;bottom:2rem;right:2rem;pointer-events:none;font-family:'Playfair Display',serif}
        .badge-pill{background:${EM}15;border:1px solid ${EM}33;color:${EM};font-size:.72rem;padding:.35rem .9rem;border-radius:99px;display:inline-block;margin-right:.4rem;margin-bottom:.4rem}

        /* CONTACT */
        .contact-band{background:linear-gradient(135deg,#071410 0%,${DARK} 50%,#071318 100%);padding:9rem 3rem;text-align:center;position:relative;overflow:hidden}
        .contact-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,${EM}15 0%,transparent 65%);pointer-events:none}
        .contact-title{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,4.5rem);font-weight:700;margin-bottom:1rem}
        .contact-title em{font-style:italic;color:${EM}}

        /* FOOTER */
        .footer{background:#040c12;padding:2rem 3rem;border-top:1px solid rgba(255,255,255,.04);display:flex;align-items:center;justify-content:space-between}
        .footer-note{font-size:.65rem;color:${LIGHT}33;letter-spacing:.06em}
        .back-link{font-size:.7rem;color:${EM};text-decoration:none;letter-spacing:.06em}
        .back-link:hover{text-decoration:underline}

        /* MARQUEE */
        .ticker{background:${EM}10;border-top:1px solid ${EM}22;border-bottom:1px solid ${EM}22;padding:.65rem 0;overflow:hidden;white-space:nowrap}
        .ticker-inner{display:inline-flex;animation:tick 30s linear infinite}
        .ticker-item{font-size:.65rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${EM}88;padding:0 2rem}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        @media(max-width:960px){
          .ar-nav{padding:1rem 1.5rem}.ar-links{display:none}
          .hero{grid-template-columns:1fr;height:auto}
          .hero-left{padding:4rem 1.5rem 5rem}
          .hero-right{display:none}
          .stats-bar{grid-template-columns:repeat(2,1fr)}
          .listing-grid{grid-template-columns:1fr}
          .svc-grid{grid-template-columns:1fr}
          .agent-wrap{grid-template-columns:1fr}
          .agent-img-col{height:55vw}
          .agent-text-col{padding:4rem 1.5rem}
          .section{padding:5rem 1.5rem}
          .svc-bg{padding:5rem 1.5rem}
          .footer{flex-direction:column;gap:1rem;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav className={`ar-nav${scrollY > 60 ? ' scrolled' : ''}`}>
        <a href="#" className="ar-logo">Aria <em>Realty</em></a>
        <ul className="ar-links">
          {['Listings','Services','About','Contact'].map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <Link href="/samples/example002/book" className="ar-cta">Free Consult</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=90" alt="Luxury South Florida estate" />
        </div>
        <div className="hero-left">
          <div className="hero-bottom">
            <h1 className={`hero-h1${heroIn ? '' : ' hidden'}`}>Find the Home That Fits</h1>
            <span className={`hero-h1-right${heroIn ? '' : ' hidden'}`}><em>Your Life</em></span>
          </div>
          <div className={`hero-tag${heroIn ? '' : ' hidden'}`}>— South Florida's Premier Real Estate —</div>
          <p className={`hero-p${heroIn ? '' : ' hidden'}`}>Aria Realty specializes in luxury residential and waterfront properties across Miami-Dade, Broward, and Palm Beach. Over $183M closed in 2023.</p>
          <div className={`hero-btns${heroIn ? '' : ' hidden'}`}>
            <a href="#listings" className="ar-cta-out">View Listings</a>
            <Link href="/samples/example002/book" className="ar-cta">Book Free Consultation</Link>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {Array(2).fill(['$183M Closed 2023','247 Properties Sold','14 Years in Market','98% Client Satisfaction','Coral Gables','Miami Beach','Fort Lauderdale','Waterfront Specialist']).flat().map((t,i) => (
            <span key={i} className="ticker-item">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <CounterCell value={183} prefix="$" suffix="M+" label="Closed Volume 2023" />
        <CounterCell value={247} suffix="+" label="Properties Sold" />
        <CounterCell value={14} suffix="yrs" label="Years in Market" />
        <CounterCell value={98} suffix="%" label="Client Satisfaction" />
      </div>

      {/* LISTINGS */}
      <section className="section" id="listings">
        <Reveal><div className="eyebrow">Current Listings</div></Reveal>
        <Reveal delay={.1}><h2 className="section-title">Featured <em>Properties</em></h2></Reveal>
        <Reveal delay={.15}><div className="em-line" /></Reveal>
        <div className="listing-grid">
          {LISTINGS.map((l, i) => (
            <Reveal key={l.addr} delay={i * .1}>
              <div className="listing-card">
                <div className="listing-img-wrap">
                  <img src={l.img} alt={l.addr} />
                  <span className={`listing-badge${l.badge === 'Sold' ? ' sold' : ''}`}>{l.badge}</span>
                </div>
                <div className="listing-info">
                  <div className="listing-price">{l.price}</div>
                  <div className="listing-addr">{l.addr}</div>
                  <div className="listing-city">{l.city}</div>
                  <div className="listing-meta">
                    <span>🛏 {l.beds} bed</span>
                    <span>🚿 {l.baths} bath</span>
                    <span>📐 {l.sqft} sq ft</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <div className="svc-bg" id="services">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div className="eyebrow">What We Do</div></Reveal>
          <Reveal delay={.1}><h2 className="section-title">Full-Service <em>Real Estate</em></h2></Reveal>
          <Reveal delay={.15}><div className="em-line" /></Reveal>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s,i) => (
            <Reveal key={s.title} delay={i*.08}>
              <div className="svc-card">
                <div className="svc-icon">{s.icon}</div>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* AGENT */}
      <section className="agent-wrap" id="about">
        <SlideIn x={-80}>
          <div className="agent-img-col" style={{ minHeight: 500 }}>
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85" alt="Sophia Whitmore" />
          </div>
        </SlideIn>
        <div className="agent-text-col">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Reveal><div className="eyebrow">Meet Your Agent</div></Reveal>
            <Reveal delay={.1}><h2 className="section-title">Sophia <em>Whitmore</em></h2></Reveal>
            <Reveal delay={.15}><div className="em-line" /></Reveal>
            <Reveal delay={.2}><p style={{ fontSize: '.9rem', lineHeight: 1.85, color: `${LIGHT}77`, marginBottom: '1.25rem' }}>With 14 years navigating South Florida's luxury market, Sophia brings unmatched local knowledge, a network of off-market opportunities, and a track record that speaks for itself.</p></Reveal>
            <Reveal delay={.25}><p style={{ fontSize: '.875rem', lineHeight: 1.85, color: `${LIGHT}55`, fontStyle: 'italic', marginBottom: '2rem' }}>"I don't just sell homes — I match families with their futures."</p></Reveal>
            <Reveal delay={.3}>
              <div style={{ marginBottom: '2.5rem' }}>
                {['$183M+ Closed','Top 1% Broward','247 Transactions'].map(b => <span key={b} className="badge-pill">{b}</span>)}
              </div>
            </Reveal>
            <Reveal delay={.35}><Link href="/samples/example002/book" className="ar-cta-out">Work with Sophia</Link></Reveal>
          </div>
          <div className="agent-big">14</div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-band" id="contact">
        <div className="contact-glow" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal><div className="eyebrow">Let's Find Your Home</div></Reveal>
          <Reveal delay={.1}><h2 className="contact-title">Ready for Your<br /><em>Dream Home?</em></h2></Reveal>
          <Reveal delay={.2}><p style={{ fontSize: '.9rem', color: `${LIGHT}66`, maxWidth: 460, margin: '1.25rem auto 3rem', lineHeight: 1.85 }}>Book a free 30-minute consultation and we'll map out a custom strategy — whether you're buying, selling, or investing.</p></Reveal>
          <Reveal delay={.3}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <a href="tel:+15559876543" className="ar-cta" style={{ padding: '1rem 2.5rem', fontSize: '.9rem' }}>📞 (555) 987-6543</a>
              <a href="mailto:sophia@ariarealty.com" className="ar-cta-out" style={{ padding: '1rem 2.5rem', fontSize: '.9rem' }}>✉️ Email Sophia</a>
              <Link href="/samples/example002/book" className="ar-cta-out" style={{ padding: '1rem 2.5rem', fontSize: '.9rem' }}>📅 Book Online</Link>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '.78rem', color: `${LIGHT}44`, letterSpacing: '.08em', display: 'block' }}>
              <span style={{ color: EM, marginRight: '.4rem' }}>✓</span> Guaranteed response within 2 hours · 7 days a week
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-note">© 2024 Aria Realty · South Florida</span>
        <Link href="/samples" className="back-link">← All Samples</Link>
        <span className="footer-note">Built by aiandwebservices.com</span>
      </footer>

      <ChatWidget
        accent={EM}
        agentName="Aria Realty AI"
        greeting="Looking for your dream home in South Florida? I can help you find the right listing 🏡"
        quickReplies={['Browse listings', 'Book a consultation', 'Sell my home']}
        autoReplies={{
          'Browse listings': "We have waterfront homes from $1.8M in Miami Beach, Coral Gables, and Brickell. Any area or budget in mind?",
          'Book a consultation': "Our agents are available 7 days a week. Call (555) 987-6543 or I can schedule a callback — what works for you?",
          'Sell my home': "We average 97% of asking price and 21 days on market. Want a free home valuation? Takes 2 minutes.",
        }}
      />
    </div>
  );
}
