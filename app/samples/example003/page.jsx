'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const GOLD = '#D4A843';
const BLACK = '#0C0C0C';
const OFF_WHITE = '#F0EAE0';
const GRAY = '#1A1A1A';

const SERVICES = [
  { name: 'Classic Cut', desc: 'Scissor or clipper cut with hot towel finish', price: '$45', duration: '45 min' },
  { name: 'Skin Fade', desc: 'Zero to mid or high fade, precision blend', price: '$55', duration: '50 min' },
  { name: 'Beard Lineup', desc: 'Shape, edge, and define your beard line', price: '$30', duration: '30 min' },
  { name: 'Cut & Beard', desc: 'Full cut with beard trim and hot towel shave', price: '$75', duration: '75 min' },
  { name: 'Hot Lather Shave', desc: 'Traditional straight razor with hot lather', price: '$50', duration: '40 min' },
  { name: 'The Works', desc: 'Cut + fade + beard + scalp treatment', price: '$110', duration: '90 min' },
];

const BARBERS = [
  { name: 'Marcus Webb', title: 'Master Barber · 12 yrs', spec: 'Fades, Textures, Creative cuts', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80' },
  { name: 'Diego Cruz', title: 'Senior Barber · 8 yrs', spec: 'Classic cuts, Beard sculpting', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80' },
  { name: 'Jordan Price', title: 'Barber · 5 yrs', spec: 'Fades, Afro textures, Lineups', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80' },
];

const REVIEWS = [
  { name: 'Carlos M.', stars: 5, text: 'Marcus gave me the cleanest fade I\'ve ever had. The shop has a real old-school vibe with modern skill. Been coming here every two weeks for a year.' },
  { name: 'DeShawn T.', stars: 5, text: 'Hot towel shave was next level. You walk in looking decent, you walk out looking like you have your life together.' },
  { name: 'Ryan K.', stars: 5, text: 'Booking online was easy, no wait. Diego nailed my beard sculpt exactly how I wanted it. This is my shop now.' },
];

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
      transform: inView ? 'none' : direction === 'up' ? 'translateY(40px)' : direction === 'left' ? 'translateX(-40px)' : direction === 'right' ? 'translateX(40px)' : 'scale(0.96)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stars({ n = 5 }) {
  return <span style={{ color: GOLD, letterSpacing: '0.05em' }}>{'★'.repeat(n)}</span>;
}

export default function BladeRoom() {
  const [openService, setOpenService] = useState(null);

  return (
    <div style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif", background: BLACK, color: OFF_WHITE, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${GOLD}33; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BLACK}; }
        ::-webkit-scrollbar-thumb { background: ${GOLD}66; border-radius: 0; }

        .br-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 3rem; background: rgba(12,12,12,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(212,168,67,0.15); }
        .br-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.1em; color: ${OFF_WHITE}; text-decoration: none; }
        .br-logo span { color: ${GOLD}; }
        .br-links { display: flex; gap: 2.5rem; list-style: none; }
        .br-links a { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${OFF_WHITE}77; text-decoration: none; transition: color 0.2s; }
        .br-links a:hover { color: ${GOLD}; }
        .br-book { font-family: 'Barlow', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.65rem 1.75rem; background: ${GOLD}; color: ${BLACK}; border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .br-book:hover { background: #e8ba55; }
        .br-book-outline { background: transparent; color: ${GOLD}; border: 1px solid ${GOLD}; padding: 0.75rem 2rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: all 0.25s; display: inline-block; }
        .br-book-outline:hover { background: ${GOLD}; color: ${BLACK}; }
        .hero { position: relative; height: 100vh; min-height: 640px; overflow: hidden; display: flex; align-items: flex-end; }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: brightness(0.45); }
        .hero-content { position: relative; z-index: 2; padding: 0 3rem 5rem; max-width: 780px; }
        .hero-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
        .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: ${GOLD}; }
        .hero-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(4rem, 10vw, 9rem); line-height: 0.95; letter-spacing: 0.02em; margin-bottom: 1.5rem; }
        .hero-h1 .gold-line { color: ${GOLD}; }
        .hero-p { font-size: 1rem; line-height: 1.7; color: ${OFF_WHITE}88; max-width: 420px; margin-bottom: 2.5rem; font-weight: 300; }
        .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .ticker { background: ${GOLD}; padding: 0.65rem 0; overflow: hidden; white-space: nowrap; }
        .ticker-inner { display: inline-flex; animation: ticker 22s linear infinite; }
        .ticker-item { font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem; letter-spacing: 0.15em; color: ${BLACK}; padding: 0 3rem; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .section { padding: 7rem 3rem; max-width: 1200px; margin: 0 auto; }
        .section-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 0.75rem; }
        .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: 0.04em; line-height: 1; margin-bottom: 0.5rem; }
        .gold-line-accent { width: 48px; height: 3px; background: ${GOLD}; margin: 1.25rem 0 2.5rem; }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #1e1e1e; margin-top: 3rem; }
        .service-card { background: ${BLACK}; padding: 2rem; cursor: pointer; transition: background 0.25s; border-left: 3px solid transparent; }
        .service-card:hover, .service-card.open { background: ${GRAY}; border-left-color: ${GOLD}; }
        .service-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.35rem; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
        .service-price { font-size: 1.5rem; font-weight: 700; color: ${GOLD}; margin-bottom: 0.25rem; }
        .service-duration { font-size: 0.75rem; color: ${OFF_WHITE}44; letter-spacing: 0.06em; text-transform: uppercase; }
        .service-desc { font-size: 0.85rem; color: ${OFF_WHITE}66; line-height: 1.6; margin-top: 0.75rem; overflow: hidden; max-height: 0; transition: max-height 0.4s ease, opacity 0.4s ease; opacity: 0; }
        .service-card.open .service-desc { max-height: 80px; opacity: 1; }
        .shop-photos { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 4px; height: 580px; }
        .shop-photo { overflow: hidden; }
        .shop-photo img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85) grayscale(20%); transition: filter 0.4s, transform 0.4s; }
        .shop-photo:hover img { filter: brightness(1) grayscale(0%); transform: scale(1.03); }
        .shop-photo.tall { grid-row: span 2; }
        .barbers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
        .barber-card { text-align: center; }
        .barber-img { width: 100%; aspect-ratio: 1; object-fit: cover; object-position: top; filter: grayscale(30%); transition: filter 0.4s; margin-bottom: 1.25rem; }
        .barber-card:hover .barber-img { filter: grayscale(0%); }
        .barber-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.08em; }
        .barber-title { font-size: 0.75rem; color: ${GOLD}; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .barber-spec { font-size: 0.8rem; color: ${OFF_WHITE}55; }
        .reviews-section { background: ${GRAY}; padding: 7rem 3rem; }
        .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #111; margin-top: 3rem; }
        .review-card { background: ${GRAY}; padding: 2.5rem; }
        .review-text { font-size: 0.9rem; line-height: 1.8; color: ${OFF_WHITE}88; margin-bottom: 1.5rem; font-style: italic; font-weight: 300; }
        .review-author { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .book-section { background: ${BLACK}; padding: 7rem 3rem; display: flex; align-items: center; overflow: hidden; position: relative; }
        .book-section::before { content: ''; position: absolute; right: -5%; top: -30%; width: 55%; height: 160%; opacity: 0.12; background: url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=60') center/cover no-repeat; }
        .book-content { position: relative; z-index: 2; max-width: 580px; }
        .book-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; letter-spacing: 0.04em; margin-bottom: 1.5rem; }
        .book-title .gold-line { color: ${GOLD}; }
        .hours-list { list-style: none; margin: 2rem 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .hours-row { display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid #ffffff0d; padding-bottom: 0.5rem; max-width: 320px; }
        .hours-day { color: ${OFF_WHITE}77; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.75rem; }
        .hours-time { color: ${OFF_WHITE}; font-weight: 500; }
        .footer { padding: 1.75rem 3rem; background: #070707; border-top: 1px solid rgba(212,168,67,0.1); display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.1em; color: ${OFF_WHITE}44; }
        .footer-note { font-size: 0.65rem; color: ${OFF_WHITE}33; letter-spacing: 0.08em; text-transform: uppercase; }
        .back-link { font-size: 0.7rem; color: ${GOLD}; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; }
        .back-link:hover { text-decoration: underline; }
        @media (max-width: 900px) {
          .br-nav { padding: 1rem 1.5rem; }
          .br-links { display: none; }
          .hero-content { padding: 0 1.5rem 4rem; }
          .hero-h1 { font-size: clamp(3.5rem, 15vw, 5.5rem); }
          .section { padding: 4rem 1.5rem; }
          .services-grid { grid-template-columns: 1fr 1fr; }
          .shop-photos { grid-template-columns: 1fr 1fr; grid-template-rows: auto; height: auto; }
          .shop-photo.tall { grid-row: span 1; aspect-ratio: 4/3; }
          .barbers-grid { grid-template-columns: 1fr; max-width: 360px; margin: 3rem auto 0; }
          .reviews-grid { grid-template-columns: 1fr; }
          .reviews-section { padding: 4rem 1.5rem; }
          .book-section { padding: 4rem 1.5rem; }
          .footer { flex-direction: column; gap: 1rem; text-align: center; }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
          .shop-photos { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="br-nav">
        <a href="#" className="br-logo">The <span>Blade</span> Room</a>
        <ul className="br-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#book">Book</a></li>
        </ul>
        <a href="#book" className="br-book">Book Now</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <img className="hero-img" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1800&q=85" alt="The Blade Room barber shop interior" />
        <div className="hero-content">
          <div className="hero-eyebrow">Fort Lauderdale · Walk-ins Welcome</div>
          <h1 className="hero-h1">
            Sharp<br /><span className="gold-line">Cuts.</span><br />Clean<br />Fades.
          </h1>
          <p className="hero-p">Old-school craft. New-school precision. The Blade Room is where South Florida men come to look their best.</p>
          <div className="hero-ctas">
            <a href="#book" className="br-book" style={{ fontSize: '0.8rem', padding: '0.85rem 2.25rem' }}>Book Your Cut</a>
            <a href="#services" className="br-book-outline">See Services</a>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          {['Classic Cut', 'Skin Fade', 'Beard Lineup', 'Hot Shave', 'The Works', 'Walk-ins Welcome', 'Classic Cut', 'Skin Fade', 'Beard Lineup', 'Hot Shave', 'The Works', 'Walk-ins Welcome'].map((t, i) => (
            <span key={i} className="ticker-item">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="section" id="services">
        <FadeIn>
          <div className="section-eyebrow">What We Do</div>
          <div className="section-title">Services &<br /><span style={{ color: GOLD }}>Pricing</span></div>
          <div className="gold-line-accent" />
          <p style={{ fontSize: '0.875rem', color: `${OFF_WHITE}66`, maxWidth: 420, lineHeight: 1.8, fontWeight: 300 }}>
            Click any service for full details. All cuts include hot towel neck treatment and styling.
          </p>
        </FadeIn>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.08}>
              <div className={`service-card${openService === i ? ' open' : ''}`} onClick={() => setOpenService(openService === i ? null : i)}>
                <div className="service-name">{s.name}</div>
                <div className="service-price">{s.price}</div>
                <div className="service-duration">{s.duration}</div>
                <p className="service-desc">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Shop photos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 3rem 5rem' }}>
        <FadeIn>
          <div className="shop-photos">
            <div className="shop-photo tall">
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80" alt="Barber at work" />
            </div>
            <div className="shop-photo">
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80" alt="Barber tools and scissors" />
            </div>
            <div className="shop-photo">
              <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80" alt="Barber chair interior" />
            </div>
            <div className="shop-photo">
              <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80" alt="Client getting a fade" />
            </div>
            <div className="shop-photo">
              <img src="https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80" alt="Classic barber interior" />
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Team */}
      <section style={{ background: GRAY, padding: '7rem 3rem' }} id="team">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div className="section-eyebrow">The Crew</div>
            <div className="section-title">Meet Your<br /><span style={{ color: GOLD }}>Barbers</span></div>
            <div className="gold-line-accent" />
          </FadeIn>
          <div className="barbers-grid">
            {BARBERS.map((b, i) => (
              <FadeIn key={b.name} delay={i * 0.12}>
                <div className="barber-card">
                  <img className="barber-img" src={b.img} alt={b.name} />
                  <div className="barber-name">{b.name}</div>
                  <div className="barber-title">{b.title}</div>
                  <div className="barber-spec">{b.spec}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section" id="reviews">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div className="section-eyebrow">Client Reviews</div>
            <div className="section-title">What They're<br /><span style={{ color: GOLD }}>Saying</span></div>
            <div className="gold-line-accent" />
          </FadeIn>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <FadeIn key={r.name} delay={i * 0.12}>
                <div className="review-card">
                  <Stars n={r.stars} />
                  <p className="review-text" style={{ marginTop: '1rem' }}>&ldquo;{r.text}&rdquo;</p>
                  <div className="review-author">{r.name}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Book */}
      <section className="book-section" id="book">
        <div className="book-content">
          <FadeIn>
            <div className="section-eyebrow">Ready to Look Sharp?</div>
            <div className="book-title">Book Your<br /><span className="gold-line">Cut Today</span></div>
            <ul className="hours-list">
              {[['Mon – Fri', '9 AM – 8 PM'], ['Saturday', '8 AM – 7 PM'], ['Sunday', '10 AM – 5 PM']].map(([d, t]) => (
                <li key={d} className="hours-row">
                  <span className="hours-day">{d}</span>
                  <span className="hours-time">{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a href="tel:+15554567890" className="br-book" style={{ fontSize: '0.8rem' }}>📞 (555) 456-7890</a>
              <a href="#book" className="br-book-outline">Book Online</a>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: `${OFF_WHITE}44`, letterSpacing: '0.06em' }}>
              📍 1421 NE Federal Hwy · Fort Lauderdale, FL
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-logo">The Blade Room</span>
        <Link href="/samples" className="back-link">← Back to Samples</Link>
        <span className="footer-note">Sample site by aiandwebservices.com</span>
      </footer>
    </div>
  );
}
