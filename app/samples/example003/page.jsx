'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';

const GOLD = '#D4A843';
const BLACK = '#0C0C0C';
const OFF = '#F0EAE0';
const GRAY = '#171717';

const SERVICES = [
  { name: 'Classic Cut', price: '$45', duration: '45 min', desc: 'Scissor or clipper cut with hot towel neck finish and styling.' },
  { name: 'Skin Fade', price: '$55', duration: '50 min', desc: 'Zero to mid or high fade with precision blend and clean edges.' },
  { name: 'Beard Lineup', price: '$30', duration: '30 min', desc: 'Shape, edge, and define your beard line to perfection.' },
  { name: 'Cut & Beard', price: '$75', duration: '75 min', desc: 'Full haircut with beard trim and classic hot towel treatment.' },
  { name: 'Hot Lather Shave', price: '$50', duration: '40 min', desc: 'Traditional straight razor shave with pre-shave oil and hot lather.' },
  { name: 'The Works', price: '$110', duration: '90 min', desc: 'Haircut + fade + beard + scalp massage + hot towel. The full experience.' },
];

const BARBERS = [
  { name: 'Marcus Webb', title: 'Master Barber · 12 yrs', spec: 'Fades · Textures · Creative cuts', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85' },
  { name: 'Diego Cruz', title: 'Senior Barber · 8 yrs', spec: 'Classic cuts · Beard sculpting', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=85' },
  { name: 'Jordan Price', title: 'Barber · 5 yrs', spec: 'Fades · Afro textures · Lineups', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=85' },
];

const REVIEWS = [
  { name: 'Carlos M.', text: 'Marcus gave me the cleanest fade I\'ve ever had. Been coming every two weeks for a year — won\'t go anywhere else.' },
  { name: 'DeShawn T.', text: 'The hot towel shave is next level. You walk in looking decent, you walk out looking like you have your life together.' },
  { name: 'Ryan K.', text: 'Easy booking, no wait, Diego nailed my beard sculpt exactly how I described it. This is my shop now.' },
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateY(${y}px)`, transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}s, transform .85s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, x = -70, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateX(${x}px)`, transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}s, transform .85s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function BladeRoom() {
  const [openIdx, setOpenIdx] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [heroIn, setHeroIn] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.self !== window.top);
    setTimeout(() => setHeroIn(true), 120);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Barlow','Helvetica Neue',sans-serif", background: BLACK, color: OFF, overflowX: 'hidden' }} className={isPreview ? 'preview-mode' : ''}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${BLACK}}::-webkit-scrollbar-thumb{background:${GOLD}77}
        ::selection{background:${GOLD}33}

        /* NAV */
        .br-nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 3rem;transition:background .5s,border-color .5s}
        .br-nav.scrolled{background:rgba(12,12,12,.97);backdrop-filter:blur(12px);border-bottom:1px solid ${GOLD}22}
        .br-logo{font-family:'Bebas Neue',sans-serif;font-size:1.55rem;letter-spacing:.12em;color:${OFF};text-decoration:none}
        .br-logo span{color:${GOLD}}
        .br-links{display:flex;gap:2.5rem;list-style:none}
        .br-links a{font-size:.72rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:${OFF}77;text-decoration:none;transition:color .25s}
        .br-links a:hover{color:${GOLD}}
        .btn-book{font-family:'Barlow',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:.65rem 1.75rem;background:${GOLD};color:${BLACK};border:none;cursor:pointer;text-decoration:none;transition:background .25s;display:inline-block}
        .btn-book:hover{background:#e8ba55}
        .btn-out{background:transparent;color:${GOLD};border:1px solid ${GOLD};padding:.75rem 2rem;font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:all .25s;display:inline-block}
        .btn-out:hover{background:${GOLD};color:${BLACK}}

        /* HERO */
        .hero{position:relative;height:100vh;min-height:680px;display:flex;align-items:flex-end;overflow:hidden}
        .hero-bg{position:absolute;inset:0;width:100%;height:115%;object-fit:cover;object-position:center 25%;will-change:transform;filter:brightness(.85)}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,${BLACK} 0%,rgba(12,12,12,.96) 25%,rgba(12,12,12,.35) 55%,rgba(12,12,12,.05) 100%)}
        .hero-inner{position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:flex-start;width:100%;padding:0 3rem 5.5rem}
        .hero-content{max-width:620px;flex:1}
        .hero-tag{font-size:.68rem;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:${GOLD};margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem;transition:opacity 1.1s .2s,transform 1.1s .2s cubic-bezier(.16,1,.3,1)}
        .hero-tag.hidden{opacity:0;transform:translateY(16px)}
        .hero-tag::before{content:'';width:32px;height:1px;background:${GOLD}}
        .hero-h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(10.4rem,13.6vw,14.6rem);line-height:.9;letter-spacing:.03em;margin-bottom:2rem}
        @media(max-width:768px){.hero-h1{font-size:clamp(2.8rem,10vw,5rem)}}
        .hero-h1 .line{display:block;transition:transform 1.3s cubic-bezier(.16,1,.3,1),opacity 1.3s cubic-bezier(.16,1,.3,1)}
        .hero-h1 .line.hidden{transform:translateY(80px);opacity:0}
        .hero-h1 .gold{color:${GOLD}}
        .hero-sub{font-size:1rem;font-weight:300;color:${OFF}77;max-width:440px;line-height:1.75;margin-bottom:2.5rem;transition:opacity 1.1s .5s,transform 1.1s .5s cubic-bezier(.16,1,.3,1)}
        .hero-sub.hidden{opacity:0;transform:translateY(20px)}
        .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;transition:opacity 1.1s .75s,transform 1.1s .75s cubic-bezier(.16,1,.3,1)}
        .hero-btns.hidden{opacity:0;transform:translateY(20px)}

        /* HERO GALLERY — absolute top-right */
        .hero-gallery{position:absolute;top:90px;right:3rem;width:310px;display:flex;flex-direction:column;gap:6px;z-index:3;transition:opacity 1.1s 1s,transform 1.1s 1s cubic-bezier(.16,1,.3,1)}
        .hero-gallery.hidden{opacity:0;transform:translateY(-20px)}
        .hero-gallery-top{position:relative;border-radius:5px;overflow:hidden}
        .hero-gallery-main{width:100%;height:220px;object-fit:cover;object-position:top;display:block;filter:brightness(.9)}
        .hero-gallery-badge{position:absolute;top:7px;left:7px;background:rgba(12,12,12,.82);backdrop-filter:blur(8px);border:1px solid ${GOLD}30;border-radius:5px;padding:4px 8px;text-align:center}
        .hero-gallery-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
        .hero-gallery-sm{width:100%;height:115px;object-fit:cover;border-radius:5px;display:block;filter:brightness(.85)}
        .hero-gallery-label{font-size:.55rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:${GOLD}77;text-align:center;padding-top:2px}

        @media(max-width:900px){
          .hero-inner{flex-direction:column;align-items:flex-start;padding:0 1.5rem 4.5rem}
          .hero-gallery{display:none}
        }

        /* TICKER */
        .ticker{overflow:hidden;border-top:1px solid ${GOLD}22;border-bottom:1px solid ${GOLD}22;padding:.7rem 0;background:${GOLD}08}
        .ticker-inner{display:inline-flex;animation:tick 25s linear infinite}
        .ticker-item{font-family:'Bebas Neue',sans-serif;font-size:.85rem;letter-spacing:.2em;color:${GOLD}88;padding:0 2.5rem;white-space:nowrap}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        /* SERVICES */
        .section{padding:8rem 3rem;max-width:1200px;margin:0 auto}
        .eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:${GOLD};margin-bottom:.75rem}
        .big-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,7vw,6rem);letter-spacing:.04em;line-height:.95}
        .big-title .gold{color:${GOLD}}
        .gold-bar{width:52px;height:3px;background:${GOLD};margin:1.5rem 0 2.5rem}

        .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1e1e1e;margin-top:3rem}
        .svc-card{background:${BLACK};padding:2.25rem;cursor:pointer;transition:background .3s;border-left:3px solid transparent}
        .svc-card:hover,.svc-card.open{background:${GRAY};border-left-color:${GOLD}}
        .svc-name{font-family:'Bebas Neue',sans-serif;font-size:1.45rem;letter-spacing:.06em;margin-bottom:.35rem}
        .svc-row{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
        .svc-price{font-size:1.4rem;font-weight:700;color:${GOLD}}
        .svc-dur{font-size:.7rem;color:${OFF}44;letter-spacing:.08em;text-transform:uppercase}
        .svc-desc{font-size:.83rem;color:${OFF}66;line-height:1.65;overflow:hidden;max-height:0;opacity:0;margin-top:0;transition:max-height .45s ease,opacity .45s ease,margin-top .45s ease}
        .svc-card.open .svc-desc{max-height:80px;opacity:1;margin-top:.85rem}
        .svc-hint{font-size:.65rem;color:${GOLD}55;letter-spacing:.08em;text-transform:uppercase;margin-top:.65rem;transition:color .25s}
        .svc-card:hover .svc-hint{color:${GOLD}99}

        /* PHOTO GRID */
        .photo-grid{display:grid;grid-template-columns:1.35fr 1fr 1fr;grid-template-rows:290px 290px;gap:4px;max-width:1200px;margin:0 auto;padding:0 3rem 8rem}
        .ph{overflow:hidden;position:relative}
        .ph img{width:100%;height:100%;object-fit:cover;filter:brightness(.75) grayscale(15%);transition:transform .7s cubic-bezier(.16,1,.3,1),filter .7s}
        .ph:hover img{transform:scale(1.07);filter:brightness(.95) grayscale(0%)}
        .ph-tall{grid-row:span 2}
        .ph-caption{position:absolute;bottom:0;left:0;right:0;padding:.75rem 1rem;background:linear-gradient(to top,rgba(12,12,12,.85) 0%,transparent 100%);font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${GOLD}99;opacity:0;transition:opacity .4s}
        .ph:hover .ph-caption{opacity:1}

        /* TEAM */
        .team-bg{background:${GRAY};padding:8rem 3rem}
        .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;margin-top:3rem;max-width:1200px;margin-left:auto;margin-right:auto}
        .barber-card{text-align:center}
        .barber-img-wrap{position:relative;margin-bottom:1.5rem;overflow:hidden;aspect-ratio:3/4}
        .barber-img-wrap img{width:100%;height:100%;object-fit:cover;object-position:top;filter:grayscale(25%);transition:filter .5s,transform .5s cubic-bezier(.16,1,.3,1)}
        .barber-card:hover .barber-img-wrap img{filter:grayscale(0%);transform:scale(1.04)}
        .barber-img-wrap::after{content:'';position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(to top,${GRAY} 0%,transparent 100%)}
        .barber-name{font-family:'Bebas Neue',sans-serif;font-size:1.55rem;letter-spacing:.08em}
        .barber-title{font-size:.7rem;color:${GOLD};letter-spacing:.1em;text-transform:uppercase;margin:.25rem 0 .35rem}
        .barber-spec{font-size:.78rem;color:${OFF}55}

        /* REVIEWS */
        .reviews-wrap{background:${BLACK};padding:8rem 3rem}
        .reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:#1a1a1a;margin-top:3rem;max-width:1200px;margin-left:auto;margin-right:auto}
        .review-card{background:${BLACK};padding:3rem;transition:background .3s}
        .review-card:hover{background:${GRAY}}
        .stars{color:${GOLD};font-size:1rem;letter-spacing:.1em;margin-bottom:1.25rem}
        .review-text{font-size:.9rem;font-weight:300;line-height:1.85;color:${OFF}88;font-style:italic;margin-bottom:1.5rem}
        .review-name{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:.1em;color:${GOLD}}

        /* BOOK */
        .book-section{position:relative;overflow:hidden;padding:9rem 3rem;background:${GRAY}}
        .book-bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.08) saturate(0);opacity:.8}
        .book-content{position:relative;z-index:2;max-width:640px}
        .book-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(3.5rem,9vw,8rem);line-height:.9;letter-spacing:.03em;margin-bottom:2.5rem}
        .book-title .gold{color:${GOLD}}
        .hours-list{list-style:none;margin-bottom:3rem}
        .hours-item{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid rgba(240,234,224,.07);max-width:340px}
        .hours-day{font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${OFF}55}
        .hours-time{font-size:.9rem;font-weight:500;color:${OFF}}
        .address-line{font-size:.8rem;color:${OFF}44;letter-spacing:.06em;margin-top:1.75rem}
        .address-line span{color:${GOLD}88}

        /* FOOTER */
        .footer{background:#070707;padding:2rem 3rem;border-top:1px solid ${GOLD}12;display:flex;align-items:center;justify-content:space-between}
        .footer-logo{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:.12em;color:${OFF}33}
        .footer-logo span{color:${GOLD}55}
        .footer-note{font-size:.65rem;color:${OFF}33;letter-spacing:.08em;text-transform:uppercase}
        .back-link{font-size:.68rem;color:${GOLD};text-decoration:none;letter-spacing:.1em;text-transform:uppercase}
        .back-link:hover{text-decoration:underline}

        @media(max-width:900px){
          .br-nav{padding:1rem 1.5rem}.br-links{display:none}
          .hero-content{padding:0 1.5rem 4.5rem}
          .section{padding:5rem 1.5rem}
          .svc-grid{grid-template-columns:1fr 1fr}
          .photo-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto;padding:0 1.5rem 5rem}
          .ph-tall{grid-row:span 1}
          .team-grid{grid-template-columns:1fr;max-width:320px;margin:3rem auto 0}
          .team-bg{padding:5rem 1.5rem}
          .reviews-grid{grid-template-columns:1fr}
          .reviews-wrap{padding:5rem 1.5rem}
          .book-section{padding:6rem 1.5rem}
          .footer{flex-direction:column;gap:1rem;text-align:center}
        }
        @media(max-width:600px){
          .svc-grid{grid-template-columns:1fr}
          .photo-grid{grid-template-columns:1fr}
        }
        @media(max-width:900px){
          .hero-h1{font-size:clamp(2.5rem,7.5vw,7.5rem) !important}
          .btn-book{font-size:.58rem !important;padding:.45rem 1rem !important}
          .btn-out{font-size:.58rem !important;padding:.5rem 1.2rem !important}
          .hero-gallery{width:175px !important}
          .hero-gallery-main{height:125px !important}
          .hero-gallery-sm{height:65px !important}
        }
        .preview-mode .big-title{font-size:clamp(2.375rem,6.3vw,5.375rem) !important}
      `}</style>

      {/* NAV */}
      <nav className={`br-nav${scrollY > 60 ? ' scrolled' : ''}`}>
        <a href="#" className="br-logo">The <span>Blade</span> Room</a>
        <ul className="br-links">
          {['Services','Gallery','Team','Book'].map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <a href="#book" className="btn-book">Book Now</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <img className="hero-bg" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1800&q=90" alt="Barber shop interior" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="hero-overlay" />
        <div className="hero-inner">
          {/* Left: headline */}
          <div className="hero-content">
            <div className={`hero-tag${heroIn ? '' : ' hidden'}`}>Fort Lauderdale · Walk-ins Welcome</div>
            <h1 className="hero-h1">
              <span className={`line${heroIn ? '' : ' hidden'}`} style={{ transitionDelay: '.1s' }}>Sharp</span>
              <span className={`line gold${heroIn ? '' : ' hidden'}`} style={{ transitionDelay: '.22s' }}>Cuts.</span>
              <span className={`line${heroIn ? '' : ' hidden'}`} style={{ transitionDelay: '.34s' }}>Clean</span>
              <span className={`line gold${heroIn ? '' : ' hidden'}`} style={{ transitionDelay: '.46s' }}>Fades.</span>
            </h1>
            <p className={`hero-sub${heroIn ? '' : ' hidden'}`}>Old-school craft. New-school precision. The Blade Room is where South Florida men come to look their best.</p>
            <div className={`hero-btns${heroIn ? '' : ' hidden'}`}>
              <a href="#book" className="btn-book" style={{ padding: '.85rem 2.25rem' }}>Book Your Cut</a>
              <a href="#services" className="btn-out">See Services</a>
            </div>
          </div>

          {/* Top-right: photo showcase — absolute, no longer in flex row */}
          <div className={`hero-gallery${heroIn ? '' : ' hidden'}`}>
            <div className="hero-gallery-top">
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=85" alt="Fresh fade" className="hero-gallery-main" />
              <div className="hero-gallery-badge">
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:GOLD, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'.06em' }}>4.9 ★</div>
                <div style={{ fontSize:'.6rem', color:`${OFF}88`, letterSpacing:'.08em', textTransform:'uppercase' }}>247 Reviews</div>
              </div>
            </div>
            <div className="hero-gallery-row">
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80" alt="Cut detail" className="hero-gallery-sm" />
              <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" alt="Barber chair" className="hero-gallery-sm" />
            </div>
            <div className="hero-gallery-label">Fresh out the chair ✦ Fort Lauderdale</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {Array(2).fill(['Classic Cut','Skin Fade','Beard Lineup','Hot Lather Shave','The Works','Walk-ins Welcome','Open 7 Days']).flat().map((t,i) => (
            <span key={i} className="ticker-item">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="section" id="services">
        <Reveal><div className="eyebrow">What We Do</div></Reveal>
        <Reveal delay={.1}><div className="big-title">Services &amp;<br /><span className="gold">Pricing</span></div></Reveal>
        <Reveal delay={.15}><div className="gold-bar" /></Reveal>
        <Reveal delay={.2}><p style={{ fontSize: '.875rem', color: `${OFF}55`, maxWidth: 420, lineHeight: 1.8, fontWeight: 300, marginBottom: 0 }}>Click any service for full details. All cuts include hot towel neck treatment and blow-dry styling.</p></Reveal>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * .07}>
              <div className={`svc-card${openIdx === i ? ' open' : ''}`} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <div className="svc-name">{s.name}</div>
                <div className="svc-row">
                  <div className="svc-price">{s.price}</div>
                  <div className="svc-dur">{s.duration}</div>
                </div>
                <p className="svc-desc">{s.desc}</p>
                <div className="svc-hint">{openIdx === i ? '▲ collapse' : '▼ details'}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PHOTO GRID */}
      <div id="gallery">
        <Reveal style={{ maxWidth: 1200, margin: '0 auto', padding: '0 3rem 2rem' }}>
          <div className="eyebrow">The Shop</div>
          <div className="big-title">Inside the<br /><span className="gold">Blade Room</span></div>
        </Reveal>
        <Reveal delay={.15}>
          <div className="photo-grid">
            <div className="ph ph-tall">
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=85" alt="Barber at work" />
              <div className="ph-caption">The Chair</div>
            </div>
            <div className="ph">
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700&q=80" alt="Barber tools" />
              <div className="ph-caption">The Tools</div>
            </div>
            <div className="ph">
              <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=700&q=80" alt="Barber shop chair" />
              <div className="ph-caption">The Space</div>
            </div>
            <div className="ph">
              <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&q=80" alt="Fresh fade" />
              <div className="ph-caption">The Fade</div>
            </div>
            <div className="ph">
              <img src="https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=700&q=80" alt="Classic shop interior" />
              <div className="ph-caption">Classic Vibes</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* TEAM */}
      <div className="team-bg" id="team">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div className="eyebrow">The Crew</div></Reveal>
          <Reveal delay={.1}><div className="big-title">Meet Your<br /><span className="gold">Barbers</span></div></Reveal>
          <Reveal delay={.15}><div className="gold-bar" /></Reveal>
        </div>
        <div className="team-grid">
          {BARBERS.map((b, i) => (
            <Reveal key={b.name} delay={i * .12}>
              <div className="barber-card">
                <div className="barber-img-wrap">
                  <img src={b.img} alt={b.name} />
                </div>
                <div className="barber-name">{b.name}</div>
                <div className="barber-title">{b.title}</div>
                <div className="barber-spec">{b.spec}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-wrap">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div className="eyebrow">Client Reviews</div></Reveal>
          <Reveal delay={.1}><div className="big-title">What They're<br /><span className="gold">Saying</span></div></Reveal>
          <Reveal delay={.15}><div className="gold-bar" /></Reveal>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * .1}>
              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-name">{r.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* BOOK */}
      <section className="book-section" id="book">
        <img className="book-bg-img" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=60" alt="" aria-hidden />
        <div className="book-content">
          <Reveal><div className="eyebrow">Ready to Look Sharp?</div></Reveal>
          <Reveal delay={.1}>
            <div className="book-title">Book Your<br /><span className="gold">Cut Today</span></div>
          </Reveal>
          <Reveal delay={.2}>
            <ul className="hours-list">
              {[['Mon – Fri','9 AM – 8 PM'],['Saturday','8 AM – 7 PM'],['Sunday','10 AM – 5 PM']].map(([d,t]) => (
                <li key={d} className="hours-item">
                  <span className="hours-day">{d}</span>
                  <span className="hours-time">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={.3}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:+15554567890" className="btn-book" style={{ padding: '.85rem 2rem' }}>📞 (555) 456-7890</a>
              <a href="#" className="btn-out">Book Online</a>
            </div>
            <p className="address-line"><span>📍</span> 1421 NE Federal Hwy · Fort Lauderdale, FL</p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-logo">The <span>Blade</span> Room</span>
        <Link href="/samples" className="back-link">← All Samples</Link>
        <span className="footer-note">Built by aiandwebservices.com</span>
      </footer>

      <ChatWidget
        accent={GOLD}
        agentName="Blade Room AI"
        greeting="Hey! Want to book a cut? Next slot is today at 3pm with Marcus 💈"
        quickReplies={['Book a cut', 'See services & pricing', 'Walk-ins today?']}
        autoReplies={{
          'Book a cut': "Easy — call (555) 456-7890 or book online. Marcus, Diego, and Jordan all have slots this week. Any preference?",
          'See services & pricing': "Classic Cut $45 · Skin Fade $55 · Cut & Beard $75 · Hot Lather Shave $50 · The Works $110. All cuts include hot towel finish!",
          'Walk-ins today?': "Yes! We accept walk-ins Mon–Fri 9am–8pm, Sat 8am–7pm, Sun 10am–5pm. Usually 15–30 min wait on weekdays.",
        }}
      />
    </div>
  );
}
