'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const EMERALD = '#10B981';
const DARK = '#0F1923';
const LIGHT = '#E8F0F7';

const LISTINGS = [
  { label: 'Featured', addr: '2847 Palmetto Bay Drive', city: 'Coral Gables, FL', beds: 5, baths: 4, sqft: '4,820', price: '$3,200,000', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { label: 'New', addr: '1104 Brickell Key Blvd', city: 'Miami, FL', beds: 3, baths: 3, sqft: '2,150', price: '$1,480,000', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { label: 'Sold', addr: '880 NE 14th Ave, #3201', city: 'Fort Lauderdale, FL', beds: 4, baths: 3, sqft: '3,200', price: '$2,100,000', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80' },
];

const SERVICES = [
  { icon: '🏡', title: 'Buyer Representation', desc: 'From pre-approval to closing day, we negotiate with precision to get you the right home at the right price.' },
  { icon: '📈', title: 'Seller Strategy', desc: 'Staging guidance, professional photography, targeted marketing, and relentless negotiation on your behalf.' },
  { icon: '🏢', title: 'Investment Properties', desc: 'Cap rate analysis, rental projections, and off-market access for investors looking to grow their portfolio.' },
  { icon: '🌴', title: 'Luxury Waterfront', desc: 'Specialists in South Florida waterfront estates, private docks, and intracoastal properties.' },
];

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, direction = 'up', style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : direction === 'up' ? 'translateY(44px)' : direction === 'left' ? 'translateX(-44px)' : direction === 'right' ? 'translateX(44px)' : 'scale(0.95)',
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatCounter({ value, suffix = '', prefix = '' }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(value, inView);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function AriaRealty() {
  const [activeCity, setActiveCity] = useState('All');

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: DARK, color: LIGHT, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${EMERALD}33; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${DARK}; }
        ::-webkit-scrollbar-thumb { background: ${EMERALD}55; border-radius: 2px; }

        .ar-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 3rem; background: rgba(15,25,35,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ar-logo { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: ${LIGHT}; letter-spacing: 0.02em; text-decoration: none; }
        .ar-logo span { color: ${EMERALD}; font-style: italic; }
        .ar-links { display: flex; gap: 2.5rem; list-style: none; }
        .ar-links a { font-size: 0.8rem; font-weight: 400; letter-spacing: 0.04em; color: ${LIGHT}88; text-decoration: none; transition: color 0.2s; }
        .ar-links a:hover { color: ${EMERALD}; }
        .ar-cta { background: ${EMERALD}; color: #fff; border: none; padding: 0.6rem 1.5rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; cursor: pointer; text-decoration: none; transition: all 0.2s; border-radius: 2px; }
        .ar-cta:hover { background: #0ea472; }
        .ar-cta-outline { background: transparent; color: ${EMERALD}; border: 1px solid ${EMERALD}; padding: 0.8rem 2rem; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; cursor: pointer; text-decoration: none; transition: all 0.25s; border-radius: 2px; display: inline-block; }
        .ar-cta-outline:hover { background: ${EMERALD}; color: #fff; }
        .hero { position: relative; height: 100vh; min-height: 600px; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
        .hero-left { display: flex; align-items: flex-end; padding: 6rem 3rem 5rem; position: relative; z-index: 2; }
        .hero-right { position: relative; overflow: hidden; }
        .hero-right img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-right::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, ${DARK} 0%, transparent 40%); }
        .hero-eyebrow { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: ${EMERALD}; margin-bottom: 1.25rem; }
        .hero-h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.05; font-weight: 600; margin-bottom: 1.5rem; }
        .hero-h1 em { font-style: italic; color: ${EMERALD}; }
        .hero-p { font-size: 0.9rem; line-height: 1.8; color: ${LIGHT}77; max-width: 440px; margin-bottom: 2.5rem; }
        .search-bar { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; max-width: 480px; }
        .search-input { background: none; border: none; color: ${LIGHT}; font-size: 0.875rem; flex: 1; outline: none; }
        .search-input::placeholder { color: ${LIGHT}44; }
        .search-btn { background: ${EMERALD}; color: #fff; border: none; padding: 0.5rem 1.25rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; border-radius: 2px; white-space: nowrap; }
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.05); margin: 0; }
        .stat-item { background: rgba(15,25,35,0.9); padding: 2.5rem 2rem; text-align: center; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 2.75rem; font-weight: 600; color: ${EMERALD}; line-height: 1; }
        .stat-label { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${LIGHT}44; margin-top: 0.5rem; }
        .section { padding: 7rem 3rem; max-width: 1200px; margin: 0 auto; }
        .section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: ${EMERALD}; margin-bottom: 0.75rem; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.75rem, 3.5vw, 3rem); font-weight: 600; margin-bottom: 1rem; }
        .section-title em { font-style: italic; color: ${EMERALD}; }
        .divider { width: 48px; height: 2px; background: ${EMERALD}; margin: 1.25rem 0 2.5rem; }
        .listing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .listing-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; transition: transform 0.3s, border-color 0.3s; }
        .listing-card:hover { transform: translateY(-4px); border-color: ${EMERALD}44; }
        .listing-img { position: relative; aspect-ratio: 16/10; overflow: hidden; }
        .listing-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .listing-card:hover .listing-img img { transform: scale(1.05); }
        .listing-badge { position: absolute; top: 1rem; left: 1rem; background: ${EMERALD}; color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 2px; }
        .listing-badge.sold { background: #666; }
        .listing-info { padding: 1.5rem; }
        .listing-price { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: ${LIGHT}; margin-bottom: 0.4rem; }
        .listing-addr { font-size: 0.875rem; color: ${LIGHT}; margin-bottom: 0.2rem; }
        .listing-city { font-size: 0.75rem; color: ${LIGHT}55; margin-bottom: 1rem; }
        .listing-meta { display: flex; gap: 1.25rem; font-size: 0.75rem; color: ${LIGHT}66; }
        .listing-meta span::before { color: ${EMERALD}; margin-right: 0.3rem; }
        .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,0.04); margin-top: 3rem; }
        .service-card { background: ${DARK}; padding: 3rem; transition: background 0.3s; }
        .service-card:hover { background: rgba(16,185,129,0.05); }
        .service-icon { font-size: 2rem; margin-bottom: 1.25rem; }
        .service-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; margin-bottom: 0.75rem; }
        .service-desc { font-size: 0.85rem; line-height: 1.8; color: ${LIGHT}66; }
        .agent-section { background: #0a1219; padding: 7rem 3rem; }
        .agent-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
        .agent-img { position: relative; }
        .agent-img img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .agent-img::after { content: ''; position: absolute; bottom: -1.5rem; right: -1.5rem; width: 60%; height: 60%; border: 2px solid ${EMERALD}33; pointer-events: none; }
        .contact-section { background: linear-gradient(135deg, #0a1a14 0%, ${DARK} 50%, #0a1219 100%); padding: 7rem 3rem; text-align: center; position: relative; overflow: hidden; }
        .contact-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, ${EMERALD}0a 0%, transparent 65%); }
        .filter-row { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .filter-btn { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.06em; padding: 0.5rem 1.25rem; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: ${LIGHT}77; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .filter-btn.active, .filter-btn:hover { border-color: ${EMERALD}; color: ${EMERALD}; background: ${EMERALD}11; }
        .footer-bar { background: #070e14; padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-note { font-size: 0.7rem; color: ${LIGHT}33; letter-spacing: 0.06em; }
        .back-link { font-size: 0.7rem; color: ${EMERALD}; text-decoration: none; letter-spacing: 0.06em; }
        .back-link:hover { text-decoration: underline; }
        @media (max-width: 900px) {
          .ar-nav { padding: 1rem 1.5rem; }
          .ar-links { display: none; }
          .hero { grid-template-columns: 1fr; height: auto; }
          .hero-left { padding: 7rem 1.5rem 4rem; }
          .hero-right { display: none; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .listing-grid { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: 1fr; }
          .agent-grid { grid-template-columns: 1fr; gap: 3rem; }
          .agent-img::after { display: none; }
          .section { padding: 4rem 1.5rem; }
          .footer-bar { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className="ar-nav">
        <a href="#" className="ar-logo">Aria <span>Realty</span></a>
        <ul className="ar-links">
          <li><a href="#listings">Listings</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#agent">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#contact" className="ar-cta">Schedule a Call</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-eyebrow">South Florida's Premier Real Estate</div>
            <h1 className="hero-h1">Find the Home<br />That Fits <em>Your Life</em></h1>
            <p className="hero-p">Aria Realty specializes in luxury residential and waterfront properties across Miami-Dade, Broward, and Palm Beach counties. Over $180M closed in 2023.</p>
            <div className="search-bar">
              <span style={{ color: `${LIGHT}44`, fontSize: '0.9rem' }}>🔍</span>
              <input className="search-input" placeholder="Search by address, city, or zip code..." />
              <button className="search-btn">Search</button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#listings" className="ar-cta-outline">View Listings</a>
              <a href="#contact" className="ar-cta" style={{ borderRadius: 2, padding: '0.8rem 2rem', fontSize: '0.85rem' }}>Book Free Consult</a>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85" alt="Luxury South Florida estate" />
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { value: 183, prefix: '$', suffix: 'M+', label: 'Closed volume 2023' },
          { value: 247, suffix: '+', label: 'Properties sold' },
          { value: 14, suffix: 'yrs', label: 'Years in market' },
          { value: 98, suffix: '%', label: 'Client satisfaction' },
        ].map(s => (
          <FadeIn key={s.label}>
            <div className="stat-item">
              <div className="stat-value"><StatCounter value={s.value} suffix={s.suffix} prefix={s.prefix || ''} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Listings */}
      <section className="section" id="listings">
        <FadeIn>
          <div className="section-label">Current Listings</div>
          <h2 className="section-title">Featured <em>Properties</em></h2>
          <div className="divider" />
          <div className="filter-row">
            {['All', 'Miami', 'Coral Gables', 'Fort Lauderdale', 'Waterfront'].map(c => (
              <button key={c} className={`filter-btn${activeCity === c ? ' active' : ''}`} onClick={() => setActiveCity(c)}>{c}</button>
            ))}
          </div>
        </FadeIn>
        <div className="listing-grid">
          {LISTINGS.map((l, i) => (
            <FadeIn key={l.addr} delay={i * 0.1}>
              <div className="listing-card">
                <div className="listing-img">
                  <img src={l.img} alt={l.addr} />
                  <span className={`listing-badge${l.label === 'Sold' ? ' sold' : ''}`}>{l.label}</span>
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
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ background: '#0a1219', padding: '7rem 3rem' }} id="services">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div className="section-label">What We Do</div>
            <h2 className="section-title">Full-Service <em>Real Estate</em></h2>
            <div className="divider" />
          </FadeIn>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.1}>
                <div className="service-card">
                  <div className="service-icon">{s.icon}</div>
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Agent */}
      <section className="agent-section" id="agent">
        <div className="agent-grid">
          <FadeIn direction="left">
            <div className="agent-img">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80" alt="Aria Realty Lead Agent" />
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="section-label">Meet Your Agent</div>
            <h2 className="section-title">Sophia <em>Whitmore</em></h2>
            <div className="divider" style={{ marginLeft: 0 }} />
            <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: `${LIGHT}77`, marginBottom: '1.25rem' }}>
              With 14 years navigating South Florida's luxury market, Sophia brings unmatched local knowledge, a network of off-market opportunities, and a track record that speaks for itself.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: `${LIGHT}77`, marginBottom: '2.5rem' }}>
              "I don't just sell homes — I match families with their futures. Every deal is personal."
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {['$183M+ Closed', 'Top 1% Broward', '247 Transactions'].map(b => (
                <span key={b} style={{ background: `${EMERALD}15`, border: `1px solid ${EMERALD}33`, color: EMERALD, fontSize: '0.75rem', padding: '0.4rem 0.9rem', borderRadius: 2 }}>{b}</span>
              ))}
            </div>
            <a href="#contact" className="ar-cta-outline">Work with Sophia</a>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div className="section-label">Get in Touch</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Ready to Find Your <em style={{ color: EMERALD }}>Dream Home?</em>
            </h2>
            <p style={{ fontSize: '0.9rem', color: `${LIGHT}66`, maxWidth: 500, margin: '0 auto 3rem', lineHeight: 1.8 }}>
              Book a free 30-minute consultation and we'll map out a custom strategy — whether you're buying, selling, or investing.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:+15559876543" className="ar-cta" style={{ borderRadius: 2, padding: '1rem 2.5rem', fontSize: '0.9rem' }}>📞 (555) 987-6543</a>
              <a href="#contact" className="ar-cta-outline">Book Free Consultation</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#040c12', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="footer-bar">
          <span className="footer-note">© 2024 Aria Realty · South Florida</span>
          <Link href="/samples" className="back-link">← Back to Samples</Link>
          <span className="footer-note">Sample site by aiandwebservices.com</span>
        </div>
      </footer>
    </div>
  );
}
