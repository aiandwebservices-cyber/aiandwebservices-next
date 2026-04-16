'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const GOLD = '#C9A84C';
const DARK = '#0D0D0D';
const CREAM = '#F5EDD6';

const MENU_ITEMS = [
  { cat: 'Starters', name: 'Seared Scallops', desc: 'Lemon beurre blanc · crispy capers · micro herbs', price: '$24' },
  { cat: 'Starters', name: 'Foie Gras Torchon', desc: 'Brioche toast · fig compote · aged balsamic', price: '$32' },
  { cat: 'Starters', name: 'Burrata & Heirloom', desc: 'Heirloom tomatoes · basil oil · Maldon salt', price: '$18' },
  { cat: 'Mains', name: 'Dry-Aged Ribeye', desc: '45-day dry aged · truffle butter · roasted bone marrow', price: '$74' },
  { cat: 'Mains', name: 'Pan-Seared Halibut', desc: 'Saffron risotto · lobster bisque · fennel frond', price: '$52' },
  { cat: 'Mains', name: 'Roasted Duck Breast', desc: 'Cherry gastrique · celeriac purée · duck jus', price: '$46' },
  { cat: 'Desserts', name: 'Chocolate Sphere', desc: 'Warm caramel · hazelnut praline · gold leaf', price: '$18' },
  { cat: 'Desserts', name: 'Crème Brûlée', desc: 'Madagascar vanilla · caramelised sugar crust', price: '$14' },
];

const TESTIMONIALS = [
  { name: 'Alexandra V.', role: 'Food & Travel Writer', quote: 'The most transcendent dining experience I\'ve had in South Florida. Every course was a work of art.' },
  { name: 'James R.', role: 'Michelin Inspector (ret.)', quote: 'Technically flawless. The dry-aged ribeye alone earns a standing reservation.' },
  { name: 'Sofia M.', role: 'Wedding Planner', quote: 'Every private event here has exceeded expectations. The team is extraordinary.' },
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

function Reveal({ children, delay = 0, y = 60, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : `translateY(${y}px)`, transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, x = -80, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : `translateX(${x}px)`, transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function ScaleIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.88)', transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function EmberOak() {
  const [activeTab, setActiveTab] = useState('Starters');
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cats = ['Starters', 'Mains', 'Desserts'];
  const filtered = MENU_ITEMS.filter(m => m.cat === activeTab);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: DARK, color: CREAM, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Montserrat:wght@300;400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:${GOLD}88}
        ::selection{background:${GOLD}33}

        .eo-nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:space-between;padding:1.5rem 3rem;transition:background .5s,backdrop-filter .5s}
        .eo-nav.scrolled{background:rgba(13,13,13,.97);backdrop-filter:blur(16px);border-bottom:1px solid ${GOLD}22}
        .eo-logo{font-size:1.4rem;font-weight:300;letter-spacing:.2em;text-decoration:none;color:${CREAM}}
        .eo-logo em{color:${GOLD};font-style:italic}
        .eo-links{display:flex;gap:2.5rem;list-style:none}
        .eo-links a{font-family:'Montserrat',sans-serif;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:${CREAM}88;text-decoration:none;transition:color .3s}
        .eo-links a:hover{color:${GOLD}}
        .btn-gold{font-family:'Montserrat',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;padding:.7rem 1.75rem;border:1px solid ${GOLD};color:${GOLD};background:transparent;cursor:pointer;text-decoration:none;transition:all .35s;display:inline-block}
        .btn-gold:hover,.btn-solid:hover{background:transparent;color:${GOLD};border-color:${GOLD}}
        .btn-solid{font-family:'Montserrat',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;padding:.7rem 1.75rem;border:1px solid ${GOLD};color:${DARK};background:${GOLD};cursor:pointer;text-decoration:none;transition:all .35s;display:inline-block}

        /* HERO */
        .hero{position:relative;height:100vh;min-height:700px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .hero-bg{position:absolute;inset:0;width:100%;height:115%;object-fit:cover;object-position:center;will-change:transform}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,13,13,.2) 0%,rgba(13,13,13,.55) 50%,rgba(13,13,13,1) 100%)}
        .hero-content{position:relative;z-index:2;text-align:center;padding:2rem}
        .hero-badge{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;color:${GOLD};margin-bottom:2rem;display:flex;align-items:center;justify-content:center;gap:1rem}
        .hero-badge::before,.hero-badge::after{content:'';flex:1;max-width:40px;height:1px;background:${GOLD}88}
        .hero-title{font-size:clamp(4rem,9vw,8.5rem);font-weight:300;line-height:.95;letter-spacing:.04em;margin-bottom:2rem;overflow:hidden}
        .hero-title .line{display:block;transition:transform 1.4s cubic-bezier(.16,1,.3,1),opacity 1.4s cubic-bezier(.16,1,.3,1)}
        .hero-title .line.hidden{transform:translateY(110%);opacity:0}
        .hero-title em{font-style:italic;color:${GOLD}}
        .hero-sub{font-family:'Montserrat',sans-serif;font-size:.8rem;letter-spacing:.25em;text-transform:uppercase;color:${CREAM}88;margin-bottom:3rem;transition:opacity 1.2s .6s,transform 1.2s .6s cubic-bezier(.16,1,.3,1)}
        .hero-sub.hidden{opacity:0;transform:translateY(20px)}
        .hero-ctas{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;transition:opacity 1.2s .9s,transform 1.2s .9s cubic-bezier(.16,1,.3,1)}
        .hero-ctas.hidden{opacity:0;transform:translateY(20px)}

        /* SECTIONS */
        .section{padding:8rem 3rem;max-width:1100px;margin:0 auto}
        .eyebrow{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:${GOLD};margin-bottom:1.25rem}
        .section-title{font-size:clamp(2.2rem,4.5vw,4rem);font-weight:300;line-height:1.05}
        .section-title em{font-style:italic;color:${GOLD}}
        .gold-line{width:56px;height:1px;background:${GOLD};margin:1.5rem 0}
        .gold-line-center{margin:1.5rem auto}
        .divider-full{width:100%;height:1px;background:linear-gradient(to right,transparent,${GOLD}44,transparent);margin:2rem 0}

        /* MARQUEE */
        .marquee-wrap{overflow:hidden;border-top:1px solid ${GOLD}22;border-bottom:1px solid ${GOLD}22;padding:.75rem 0;background:rgba(201,168,76,.04)}
        .marquee-inner{display:flex;white-space:nowrap;animation:marquee 28s linear infinite}
        .marquee-item{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:${GOLD}88;padding:0 2.5rem}
        .marquee-dot{color:${GOLD};margin-right:2.5rem}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        /* ABOUT SPLIT */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:85vh}
        .about-img-col{position:relative;overflow:hidden}
        .about-img-col img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.8) saturate(.9)}
        .about-text-col{display:flex;align-items:center;padding:6rem 5rem;background:#0a0a0a}
        .about-big-num{font-size:8rem;font-weight:300;color:${GOLD}11;line-height:1;position:absolute;top:2rem;right:3rem;pointer-events:none}

        /* MENU */
        .tab-strip{display:flex;border-bottom:1px solid ${GOLD}22;margin-bottom:3rem;gap:0}
        .tab{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;padding:.85rem 2rem;border:none;background:transparent;color:${CREAM}55;cursor:pointer;transition:all .3s;position:relative}
        .tab::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:${GOLD};transform:scaleX(0);transition:transform .35s cubic-bezier(.16,1,.3,1)}
        .tab.active{color:${GOLD}}.tab.active::after{transform:scaleX(1)}
        .menu-item{display:flex;align-items:baseline;justify-content:space-between;padding:1.5rem 0;border-bottom:1px solid ${CREAM}08;gap:1.5rem;transition:background .25s}
        .menu-item:hover{background:${GOLD}05}
        .menu-name{font-size:1.3rem;font-weight:400}
        .menu-desc{font-family:'Montserrat',sans-serif;font-size:.72rem;color:${CREAM}55;margin-top:.35rem;line-height:1.6}
        .menu-price{font-family:'Montserrat',sans-serif;font-size:1rem;color:${GOLD};white-space:nowrap;font-weight:300}
        .menu-dots{flex:1;border-bottom:1px dashed ${CREAM}18;margin-bottom:.35rem;min-width:20px}

        /* PHOTO MOSAIC */
        .mosaic{display:grid;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:280px 280px;gap:4px}
        .mosaic-item{overflow:hidden;position:relative}
        .mosaic-item img{width:100%;height:100%;object-fit:cover;filter:brightness(.8) saturate(.85);transition:transform .7s cubic-bezier(.16,1,.3,1),filter .7s}
        .mosaic-item:hover img{transform:scale(1.07);filter:brightness(.95) saturate(1)}
        .mosaic-tall{grid-row:span 2}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${GOLD}18}
        .stat-cell{background:${DARK};padding:4rem 2.5rem;text-align:center}
        .stat-num{font-size:4.5rem;font-weight:300;color:${GOLD};line-height:1;letter-spacing:-.02em}
        .stat-label{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:${CREAM}44;margin-top:.6rem}

        /* TESTIMONIALS */
        .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem}
        .testi-card{padding:2.5rem;border:1px solid ${CREAM}0a;position:relative;transition:border-color .4s}
        .testi-card:hover{border-color:${GOLD}44}
        .testi-quote-mark{font-size:5rem;color:${GOLD}22;line-height:.8;font-family:Georgia;position:absolute;top:1.5rem;left:2rem}
        .testi-text{font-style:italic;font-size:1.05rem;line-height:1.75;color:${CREAM}cc;margin-bottom:1.75rem}
        .testi-name{font-family:'Montserrat',sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:${GOLD}}
        .testi-role{font-family:'Montserrat',sans-serif;font-size:.65rem;color:${CREAM}33;margin-top:.3rem}

        /* RESERVATION */
        .reserve-band{background:linear-gradient(135deg,#120d04 0%,#0d0d0d 40%,#04100a 100%);padding:9rem 3rem;text-align:center;position:relative;overflow:hidden}
        .reserve-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,${GOLD}18 0%,transparent 65%);pointer-events:none}
        .reserve-title{font-size:clamp(2.5rem,6vw,5.5rem);font-weight:300;line-height:1;margin-bottom:2rem}
        .reserve-title em{font-style:italic;color:${GOLD}}
        .hours-row{display:flex;justify-content:center;gap:4rem;margin:3rem 0;flex-wrap:wrap}
        .hours-item{text-align:center}
        .hours-day{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:${CREAM}44;margin-bottom:.5rem}
        .hours-time{font-size:1.15rem;font-weight:300}
        .ctas-row{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}

        /* FOOTER */
        .footer{padding:2.5rem 3rem;border-top:1px solid ${CREAM}08;display:flex;align-items:center;justify-content:space-between;background:#070707}
        .footer-note{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.08em;color:${CREAM}33}
        .back-link{font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:${GOLD};text-decoration:none}
        .back-link:hover{text-decoration:underline}

        @media(max-width:900px){
          .eo-nav{padding:1.25rem 1.5rem}.eo-links{display:none}
          .hero-title{font-size:clamp(3rem,14vw,5rem)}
          .section{padding:5rem 1.5rem}
          .about-grid{grid-template-columns:1fr}
          .about-img-col{height:55vw}
          .about-text-col{padding:4rem 1.5rem}
          .mosaic{grid-template-columns:1fr 1fr;grid-template-rows:auto}
          .mosaic-tall{grid-row:span 1}
          .stats-row{grid-template-columns:1fr}
          .testi-grid{grid-template-columns:1fr}
          .hours-row{gap:2rem}
          .footer{flex-direction:column;gap:1rem;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav className={`eo-nav${scrollY > 60 ? ' scrolled' : ''}`}>
        <a href="#" className="eo-logo">Ember <em>&amp;</em> Oak</a>
        <ul className="eo-links">
          {['Menu','Gallery','About','Reserve'].map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <a href="#reserve" className="btn-gold">Reserve</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <img className="hero-bg" src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90" alt="Fine dining" style={{ transform: `translateY(${scrollY * 0.25}px)` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className={`hero-badge${heroVisible ? '' : ' hidden'}`} style={{ transition: 'opacity 1.2s .2s, transform 1.2s .2s cubic-bezier(.16,1,.3,1)', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(16px)' }}>
            Fort Lauderdale · Est. 2019
          </div>
          <div className="hero-title" aria-label="Ember & Oak">
            <span className={`line${heroVisible ? '' : ' hidden'}`} style={{ transitionDelay: '.1s' }}>Ember</span>
            <span className={`line${heroVisible ? '' : ' hidden'}`} style={{ transitionDelay: '.25s' }}><em>&amp; Oak</em></span>
          </div>
          <p className={`hero-sub${heroVisible ? '' : ' hidden'}`}>Where fire meets forest · An experience beyond the plate</p>
          <div className={`hero-ctas${heroVisible ? '' : ' hidden'}`}>
            <a href="#reserve" className="btn-solid">Reserve Tonight</a>
            <a href="#menu" className="btn-gold">View Menu</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-inner">
          {Array(2).fill(['Locally Sourced','IICRC Certified Kitchen','James Beard Nominated','Seasonal Menus','Private Dining','Wine Program','Chef\'s Table Available']).flat().map((t,i) => (
            <span key={i} className="marquee-item"><span className="marquee-dot">✦</span>{t}</span>
          ))}
        </div>
      </div>

      {/* INTRO + STATS */}
      <div style={{ textAlign: 'center', padding: '7rem 2rem 0', maxWidth: 750, margin: '0 auto' }}>
        <Reveal><div className="eyebrow">Our Philosophy</div></Reveal>
        <Reveal delay={.1}><div className="gold-line gold-line-center" /></Reveal>
        <Reveal delay={.15}><h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.25, marginBottom: '1.5rem' }}>Every dish tells the story of<br /><em style={{ color: GOLD }}>fire, season, and craft.</em></h2></Reveal>
        <Reveal delay={.2}><p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.875rem', lineHeight: 1.9, color: `${CREAM}77` }}>We source within 200 miles, change our menu with the seasons, and believe the table is the most sacred space in any home — or restaurant.</p></Reveal>
      </div>

      <div style={{ maxWidth: 1100, margin: '5rem auto', padding: '0 3rem' }}>
        <Reveal>
          <div className="stats-row">
            {[['12+','Years of craft'],['4','James Beard noms'],['200mi','Sourced within']].map(([n,l]) => (
              <div className="stat-cell" key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* MENU */}
      <section className="section" id="menu">
        <Reveal><div className="eyebrow">Seasonal Menu</div></Reveal>
        <Reveal delay={.1}><h2 className="section-title">The <em>Menu</em></h2></Reveal>
        <Reveal delay={.15}><div className="gold-line" /></Reveal>
        <Reveal delay={.2}>
          <div className="tab-strip">
            {cats.map(c => <button key={c} className={`tab${activeTab===c?' active':''}`} onClick={() => setActiveTab(c)}>{c}</button>)}
          </div>
        </Reveal>
        {filtered.map((item, i) => (
          <Reveal key={item.name} delay={i * .08}>
            <div className="menu-item">
              <div style={{ flex: 1 }}>
                <div className="menu-name">{item.name}</div>
                <div className="menu-desc">{item.desc}</div>
              </div>
              <div className="menu-dots" />
              <div className="menu-price">{item.price}</div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={.3} style={{ marginTop: '3rem' }}>
          <a href="#reserve" className="btn-gold">Reserve to Dine</a>
        </Reveal>
      </section>

      {/* GALLERY MOSAIC */}
      <section id="gallery" style={{ maxWidth: 1100, margin: '0 auto 8rem', padding: '0 3rem' }}>
        <Reveal><div className="eyebrow">The Space</div></Reveal>
        <Reveal delay={.1}><h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Crafted <em>Ambiance</em></h2></Reveal>
        <ScaleIn delay={.15}>
          <div className="mosaic">
            <div className="mosaic-item mosaic-tall"><img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=85" alt="Restaurant interior" /></div>
            <div className="mosaic-item"><img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=700&q=80" alt="Table setting" /></div>
            <div className="mosaic-item"><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700&q=80" alt="Wine selection" /></div>
            <div className="mosaic-item"><img src="https://images.unsplash.com/photo-1550966871-3ed3cfd6b0cb?w=700&q=80" alt="Bar" /></div>
            <div className="mosaic-item"><img src="https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=700&q=80" alt="Plated dish" /></div>
          </div>
        </ScaleIn>
      </section>

      {/* ABOUT SPLIT */}
      <section className="about-grid" id="about">
        <SlideIn x={-80}>
          <div className="about-img-col" style={{ position: 'relative', height: '100%', minHeight: 500 }}>
            <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=900&q=85" alt="Executive Chef Marcus Laurent" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, #0a0a0a 100%)' }} />
          </div>
        </SlideIn>
        <div className="about-text-col" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Reveal><div className="eyebrow">The Chef</div></Reveal>
            <Reveal delay={.1}><h2 className="section-title">Marcus <em>Laurent</em></h2></Reveal>
            <Reveal delay={.15}><div className="gold-line" /></Reveal>
            <Reveal delay={.2}><p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.875rem', lineHeight: 1.9, color: `${CREAM}77`, marginBottom: '1.25rem' }}>Trained at Le Cordon Bleu Paris and seasoned in Michelin-starred kitchens from Lyon to New York, Chef Laurent brings Old World precision to South Florida's vibrant ingredient story.</p></Reveal>
            <Reveal delay={.25}><p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.875rem', lineHeight: 1.9, color: `${CREAM}55`, fontStyle: 'italic', marginBottom: '2.5rem' }}>"I don't cook food. I translate the land, the farmer, and the season into something you'll remember for years."</p></Reveal>
            <Reveal delay={.3}><a href="#reserve" className="btn-gold">Book the Chef's Table</a></Reveal>
          </div>
          <div className="about-big-num">12</div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 3rem' }}><div className="divider-full" /></div>

      {/* TESTIMONIALS */}
      <section style={{ background: '#080808', padding: '8rem 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal><div className="eyebrow" style={{ textAlign: 'center' }}>Guest Experiences</div></Reveal>
          <Reveal delay={.1}><h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0' }}>Every <em>Table</em>, a Story</h2></Reveal>
          <div className="testi-grid">
            {TESTIMONIALS.map((t,i) => (
              <Reveal key={t.name} delay={i*.12}>
                <div className="testi-card">
                  <div className="testi-quote-mark">"</div>
                  <p className="testi-text">"{t.quote}"</p>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVE */}
      <section className="reserve-band" id="reserve">
        <div className="reserve-glow" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal><div className="eyebrow">Join Us This Evening</div></Reveal>
          <Reveal delay={.1}><h2 className="reserve-title">Reserve Your<br /><em>Table</em></h2></Reveal>
          <Reveal delay={.2}>
            <div className="hours-row">
              {[['Tue – Thu','6 PM – 10 PM'],['Fri – Sat','5:30 PM – 11 PM'],['Sunday','5 PM – 9 PM']].map(([d,t]) => (
                <div className="hours-item" key={d}><div className="hours-day">{d}</div><div className="hours-time">{t}</div></div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={.3}>
            <div className="ctas-row">
              <a href="tel:+15551234567" className="btn-solid">📞 (555) 123-4567</a>
              <a href="#" className="btn-gold">Book Online</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-note">© 2024 Ember &amp; Oak · Fort Lauderdale, FL</span>
        <Link href="/samples" className="back-link">← All Samples</Link>
        <span className="footer-note">Built by aiandwebservices.com</span>
      </footer>
    </div>
  );
}
