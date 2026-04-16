'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const GOLD = '#C9A84C';
const DARK = '#0D0D0D';
const CREAM = '#F5EDD6';

const MENU = [
  { category: 'Starters', items: [
    { name: 'Seared Scallops', desc: 'Lemon beurre blanc, crispy capers, micro herbs', price: '$24' },
    { name: 'Foie Gras Torchon', desc: 'Brioche toast, fig compote, aged balsamic', price: '$32' },
    { name: 'Burrata & Heirloom', desc: 'Heirloom tomatoes, basil oil, Maldon salt', price: '$18' },
  ]},
  { category: 'Mains', items: [
    { name: 'Dry-Aged Ribeye', desc: '45-day dry aged, truffle butter, roasted bone marrow', price: '$74' },
    { name: 'Pan-Seared Halibut', desc: 'Saffron risotto, lobster bisque, fennel frond', price: '$52' },
    { name: 'Roasted Duck Breast', desc: 'Cherry gastrique, celeriac purée, duck jus', price: '$46' },
  ]},
  { category: 'Desserts', items: [
    { name: 'Valrhona Chocolate Sphere', desc: 'Warm caramel sauce, hazelnut praline, gold leaf', price: '$18' },
    { name: 'Crème Brûlée', desc: 'Classic Madagascar vanilla, caramelised sugar', price: '$14' },
    { name: 'Tarte Tatin', desc: 'Caramelised apple, Calvados cream, fleur de sel', price: '$16' },
  ]},
];

const TESTIMONIALS = [
  { name: 'Alexandra V.', role: 'Food & Travel Writer', quote: 'The most transcendent dining experience I\'ve had in South Florida. Every course was a work of art.' },
  { name: 'James R.', role: 'Michelin Inspector (ret.)', quote: 'Technically flawless execution. The dry-aged ribeye alone earns a standing reservation.' },
  { name: 'Sofia M.', role: 'Wedding Planner', quote: 'Every private event I\'ve booked here has exceeded expectations. The team is extraordinary.' },
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
      transform: inView ? 'none' : direction === 'up' ? 'translateY(48px)' : direction === 'left' ? 'translateX(-48px)' : 'translateX(48px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function EmberOak() {
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", background: DARK, color: CREAM, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${GOLD}33; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: ${GOLD}66; border-radius: 2px; }

        .eo-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 3rem; background: linear-gradient(to bottom, rgba(13,13,13,0.95) 0%, transparent 100%); backdrop-filter: blur(4px); }
        .eo-nav-logo { font-size: 1.5rem; font-weight: 300; letter-spacing: 0.15em; color: ${CREAM}; text-decoration: none; }
        .eo-nav-logo span { color: ${GOLD}; }
        .eo-nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .eo-nav-links a { color: ${CREAM}99; font-family: 'Montserrat', sans-serif; font-size: 0.75rem; font-weight: 300; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; transition: color 0.3s; }
        .eo-nav-links a:hover { color: ${GOLD}; }
        .eo-btn { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.75rem 2rem; border: 1px solid ${GOLD}; color: ${GOLD}; background: transparent; cursor: pointer; text-decoration: none; transition: all 0.3s; display: inline-block; }
        .eo-btn:hover { background: ${GOLD}; color: ${DARK}; }
        .eo-btn-solid { background: ${GOLD}; color: ${DARK}; }
        .eo-btn-solid:hover { background: transparent; color: ${GOLD}; }
        .divider { width: 60px; height: 1px; background: ${GOLD}66; margin: 1.5rem auto; }
        .divider-left { margin: 1.5rem 0; }
        .gold { color: ${GOLD}; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0; }
        .menu-item { padding: 1.5rem 0; border-bottom: 1px solid #ffffff0d; }
        .menu-item:last-child { border-bottom: none; }
        .tab-btn { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.75rem 1.5rem; border: none; background: transparent; color: ${CREAM}55; cursor: pointer; transition: all 0.3s; border-bottom: 1px solid transparent; }
        .tab-btn.active { color: ${GOLD}; border-bottom-color: ${GOLD}; }
        .parallax-hero { position: relative; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.6) 60%, rgba(13,13,13,1) 100%); }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 120%; object-fit: cover; object-position: center; }
        .hero-content { position: relative; z-index: 2; text-align: center; padding: 2rem; }
        .hero-eyebrow { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 1.5rem; }
        .hero-title { font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 300; line-height: 1; letter-spacing: 0.05em; margin-bottom: 1.5rem; }
        .hero-title em { font-style: italic; color: ${GOLD}; }
        .hero-sub { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; letter-spacing: 0.2em; color: ${CREAM}99; text-transform: uppercase; margin-bottom: 3rem; }
        .section { padding: 7rem 2rem; max-width: 1100px; margin: 0 auto; }
        .section-label { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 1rem; }
        .section-title { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; line-height: 1.1; }
        .section-title em { font-style: italic; color: ${GOLD}; }
        .ambiance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #1a1a1a; }
        .ambiance-img { aspect-ratio: 4/3; object-fit: cover; width: 100%; display: block; filter: brightness(0.85); transition: filter 0.4s; }
        .ambiance-img:hover { filter: brightness(1); }
        .ambiance-large { grid-row: span 2; aspect-ratio: unset; height: 100%; }
        .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #1a1a1a; margin: 5rem 0; }
        .stat-cell { background: ${DARK}; padding: 3rem 2rem; text-align: center; }
        .stat-num { font-size: 3.5rem; font-weight: 300; color: ${GOLD}; line-height: 1; }
        .stat-label { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${CREAM}55; margin-top: 0.5rem; }
        .testimonial-track { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .testimonial-card { padding: 2.5rem; border: 1px solid #ffffff0d; position: relative; }
        .testimonial-card::before { content: '\\201C'; position: absolute; top: 1rem; left: 2rem; font-size: 4rem; color: ${GOLD}33; line-height: 1; font-family: Georgia; }
        .testimonial-quote { font-style: italic; font-size: 1.05rem; line-height: 1.7; color: ${CREAM}cc; margin-bottom: 1.5rem; }
        .testimonial-name { font-family: 'Montserrat', sans-serif; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${GOLD}; }
        .testimonial-role { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.08em; color: ${CREAM}44; margin-top: 0.25rem; }
        .reserve-section { background: linear-gradient(135deg, #1a1208 0%, #0d0d0d 50%, #0a1208 100%); padding: 7rem 2rem; text-align: center; position: relative; overflow: hidden; }
        .reserve-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, ${GOLD}0d 0%, transparent 70%); }
        .reserve-title { font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 300; margin-bottom: 1.5rem; }
        .hours-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 700px; margin: 3rem auto; text-align: center; }
        .hours-day { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${CREAM}55; margin-bottom: 0.5rem; }
        .hours-time { font-size: 1.1rem; color: ${CREAM}; }
        .footer { padding: 3rem 2rem; border-top: 1px solid #ffffff0d; display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto; }
        .footer-note { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; color: ${CREAM}33; text-transform: uppercase; }
        .back-link { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${GOLD}; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { width: 22px; height: 1px; background: ${CREAM}; display: block; }
        @media (max-width: 768px) {
          .eo-nav { padding: 1.25rem 1.5rem; }
          .eo-nav-links { display: none; }
          .hamburger { display: flex; }
          .hero-title { font-size: clamp(2.5rem, 12vw, 4rem); }
          .section { padding: 4rem 1.5rem; }
          .ambiance-grid { grid-template-columns: 1fr; }
          .ambiance-large { grid-row: span 1; aspect-ratio: 4/3; }
          .stat-row { grid-template-columns: 1fr; }
          .testimonial-track { grid-template-columns: 1fr; }
          .hours-grid { grid-template-columns: 1fr; gap: 1rem; }
          .footer { flex-direction: column; gap: 1rem; text-align: center; }
          .menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="eo-nav">
        <a href="#" className="eo-nav-logo">Ember <span>&</span> Oak</a>
        <ul className="eo-nav-links">
          <li><a href="#menu">Menu</a></li>
          <li><a href="#ambiance">Ambiance</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#reserve">Reserve</a></li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <a href="#reserve" className="eo-btn" style={{ display: menuOpen ? 'none' : undefined }}>Reserve a Table</a>
      </nav>

      {/* Hero */}
      <section className="parallax-hero">
        <img
          className="hero-img"
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85"
          alt="Ember & Oak fine dining interior"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Fort Lauderdale · Est. 2019</div>
          <h1 className="hero-title">Ember<br /><em>&amp; Oak</em></h1>
          <p className="hero-sub">Where fire meets forest. An experience beyond the plate.</p>
          <a href="#reserve" className="eo-btn eo-btn-solid" style={{ marginRight: '1rem' }}>Reserve Tonight</a>
          <a href="#menu" className="eo-btn">View Menu</a>
        </div>
      </section>

      {/* Intro */}
      <div style={{ padding: '5rem 2rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <div className="section-label">Our Philosophy</div>
          <div className="divider" />
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 300, lineHeight: 1.3, marginBottom: '1.5rem' }}>
            Every dish tells the story of<br /><em style={{ color: GOLD }}>fire, season, and craft.</em>
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', lineHeight: 1.9, color: `${CREAM}88`, maxWidth: 560, margin: '0 auto' }}>
            We source from small farms within 200 miles, change our menu with the seasons, and believe that the table is the most sacred space in any home — or restaurant.
          </p>
        </FadeIn>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <FadeIn>
          <div className="stat-row">
            {[['12', 'Years of craft'], ['4', 'James Beard nominations'], ['200mi', 'Sourced within']].map(([n, l]) => (
              <div className="stat-cell" key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Menu */}
      <section className="section" id="menu">
        <FadeIn>
          <div className="section-label">Seasonal Menu</div>
          <h2 className="section-title">The <em>Menu</em></h2>
          <div className="divider-left" />
        </FadeIn>

        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid #ffffff0d`, marginBottom: '3rem', marginTop: '2rem' }}>
          {MENU.map((cat, i) => (
            <button key={cat.category} className={`tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
              {cat.category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {MENU[activeTab].items.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.1}>
              <div className="menu-item" style={{ paddingRight: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 400 }}>{item.name}</span>
                  <span style={{ color: GOLD, fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>{item.price}</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: `${CREAM}55`, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div style={{ marginTop: '3rem' }}>
            <a href="#reserve" className="eo-btn">Make a Reservation to Dine</a>
          </div>
        </FadeIn>
      </section>

      {/* Ambiance photos */}
      <section id="ambiance" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 7rem' }}>
        <FadeIn>
          <div className="section-label">The Space</div>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Crafted <em>Ambiance</em></h2>
        </FadeIn>
        <div className="ambiance-grid">
          <img className="ambiance-img ambiance-large" src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80" alt="Restaurant interior with warm lighting" />
          <img className="ambiance-img" src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=700&q=80" alt="Elegant table setting with candles" />
          <img className="ambiance-img" src="https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=700&q=80" alt="Gourmet dish plating" />
        </div>
        <div className="ambiance-grid" style={{ marginTop: '1px' }}>
          <img className="ambiance-img" src="https://images.unsplash.com/photo-1550966871-3ed3cfd6b0cb?w=700&q=80" alt="Bar counter with spirits" />
          <img className="ambiance-img" src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700&q=80" alt="Wine cellar selection" />
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#0a0a0a', padding: '7rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div className="section-label" style={{ textAlign: 'center' }}>What Guests Say</div>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>Every <em>Table</em>, a Story</h2>
          </FadeIn>
          <div className="testimonial-track">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.15}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">"{t.quote}"</p>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <FadeIn direction="left">
            <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80" alt="Executive Chef Marcus Laurent" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'brightness(0.9)' }} />
          </FadeIn>
          <FadeIn direction="right">
            <div className="section-label">The Chef</div>
            <h2 className="section-title">Marcus <em>Laurent</em></h2>
            <div className="divider-left" />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', lineHeight: 1.9, color: `${CREAM}77`, marginBottom: '1.5rem' }}>
              Trained at Le Cordon Bleu Paris and seasoned in Michelin-starred kitchens from Lyon to New York, Chef Laurent brings Old World precision to South Florida's vibrant ingredient story.
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', lineHeight: 1.9, color: `${CREAM}77`, marginBottom: '2.5rem' }}>
              "I don't cook food. I translate the land, the farmer, and the season into something you'll remember for years."
            </p>
            <a href="#reserve" className="eo-btn">Book the Chef's Table</a>
          </FadeIn>
        </div>
      </section>

      {/* Reserve */}
      <section className="reserve-section" id="reserve">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div className="section-label">Join Us</div>
            <h2 className="reserve-title">Reserve Your <em style={{ color: GOLD }}>Table</em></h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: `${CREAM}77`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3rem' }}>
              Tuesday — Sunday · Dinner from 6 PM
            </p>
            <div className="hours-grid">
              {[['Tue – Thu', '6 PM – 10 PM'], ['Fri – Sat', '5:30 PM – 11 PM'], ['Sunday', '5 PM – 9 PM']].map(([d, t]) => (
                <div key={d}>
                  <div className="hours-day">{d}</div>
                  <div className="hours-time">{t}</div>
                </div>
              ))}
            </div>
            <a href="tel:+15551234567" className="eo-btn eo-btn-solid" style={{ fontSize: '0.8rem', letterSpacing: '0.12em', marginRight: '1rem' }}>
              Call (555) 123-4567
            </a>
            <a href="#reserve" className="eo-btn">Book Online</a>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#070707', padding: '2rem', borderTop: '1px solid #ffffff0a' }}>
        <div className="footer">
          <span className="footer-note">© 2024 Ember &amp; Oak · Fort Lauderdale, FL</span>
          <Link href="/samples" className="back-link">← Back to Samples</Link>
          <span className="footer-note">Sample site by aiandwebservices.com</span>
        </div>
      </footer>
    </div>
  );
}
