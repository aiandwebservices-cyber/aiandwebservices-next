'use client';
import { useEffect, useRef, useState, useMemo } from 'react';

/* ─── Brand Tokens ──────────────────────────────────────────
   Racing HUD / dossier aesthetic — sharp, telemetric, raw.
   Red dominant, gold accent, cyan for data. Theme-driven via CSS vars.
─────────────────────────────────────────────────────────── */
const C = {
  bg:       'var(--c-bg)',
  bg2:      'var(--c-bg2)',
  panel:    'var(--c-panel)',
  rule:     'var(--c-rule)',
  rule2:    'var(--c-rule2)',
  red:      '#FF1F2D',
  redDeep:  '#B6121C',
  gold:     '#E2B23C',
  cyan:     'var(--c-cyan)',
  ink:      'var(--c-ink)',
  inkDim:   'var(--c-inkDim)',
  inkLow:   'var(--c-inkLow)',
};

const THEMES = {
  dark: {
    '--c-bg':      '#08080A',
    '--c-bg2':     '#0E0E12',
    '--c-panel':   '#13131A',
    '--c-rule':    '#1F1F2A',
    '--c-rule2':   '#2A2A38',
    '--c-ink':     '#F2F2EC',
    '--c-inkDim':  'rgba(242,242,236,0.55)',
    '--c-inkLow':  'rgba(242,242,236,0.32)',
    '--c-cyan':    '#5BE3FF',
    '--c-shadow':  '0 0 0 transparent',
    '--c-glass':   'rgba(8,8,10,0.78)',
  },
  light: {
    '--c-bg':      '#FFFFFF',
    '--c-bg2':     '#F5F5F5',
    '--c-panel':   '#FAFAFA',
    '--c-rule':    '#E5E5E5',
    '--c-rule2':   '#D0D0D0',
    '--c-ink':     '#1A1A1A',
    '--c-inkDim':  'rgba(26,26,26,0.65)',
    '--c-inkLow':  'rgba(26,26,26,0.40)',
    '--c-cyan':    '#0077A5',
    '--c-shadow':  '0 1px 3px rgba(0,0,0,0.08), 0 6px 16px rgba(0,0,0,0.06)',
    '--c-glass':   'rgba(255,255,255,0.85)',
  },
};

const I18N = {
  en: {
    eyebrow: 'PREMIUM',
    title1:  'Premium',
    title2:  'pre-owned',
    body:    'Luxury for less. No games. No hidden fees.',
    body2:   'Hand-picked inventory, full mechanical certification, financing engineered for everyone — even the credit-rebuilding crowd.',
    cta1:    'Browse Fleet',
    cta2:    'Get Pre-Approved →',
  },
  es: {
    eyebrow: 'PREMIUM',
    title1:  'Concesionario',
    title2:  'premium',
    body:    'El concesionario premium de autos usados en Miami.',
    body2:   'Lujo por menos. Sin juegos. Sin costos ocultos. Inventario seleccionado a mano, certificación mecánica completa, financiamiento para cualquier crédito.',
    cta1:    'Ver Inventario',
    cta2:    'Pre-Aprobación →',
  },
};

const FONT_DISPLAY = 'var(--font-oswald), "Oswald", "Bebas Neue", Impact, sans-serif';
const FONT_BODY    = 'var(--font-inter), -apple-system, sans-serif';
const FONT_MONO    = 'var(--font-mono), "JetBrains Mono", "IBM Plex Mono", monospace';

/* ─── Inventory ─────────────────────────────────────────── */
const FLEET = [
  { id:'P5012', y:2023, mk:'BMW',           md:'X5',                 trim:'xDrive40i',          price:42995, mi:18420, body:'SUV',   ext:'Alpine White',     int:'Black Vernasca',  eng:'3.0L Turbo I6',   tx:'8-spd Auto',     dr:'AWD',  hp:335, sec:'5.3', mpg:23, vin:'WBA••••••3K9L21', img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=85&auto=format,compress',  flags:['ONE-OWNER','NO ACCIDENTS'] },
  { id:'P5023', y:2022, mk:'Mercedes-Benz', md:'GLE',                trim:'350 4MATIC',         price:38750, mi:24310, body:'SUV',   ext:'Obsidian Black',   int:'Macchiato Beige', eng:'2.0L Turbo I4',   tx:'9-spd Auto',     dr:'AWD',  hp:255, sec:'6.7', mpg:25, vin:'4JG•••••••N4H88', img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=85&auto=format,compress', flags:['ONE-OWNER','NO ACCIDENTS'] },
  { id:'P5031', y:2024, mk:'Audi',          md:'Q5',                 trim:'Premium Plus',       price:44900, mi:9870,  body:'SUV',   ext:'Glacier White',    int:'Black Leather',   eng:'2.0L TFSI',       tx:'7-spd S tronic', dr:'AWD',  hp:261, sec:'5.7', mpg:25, vin:'WA1•••••••P201',  img:'https://images.unsplash.com/photo-1606664922998-f180146da80a?w=1400&q=85&auto=format,compress', flags:['ONE-OWNER','LOW MILEAGE'] },
  { id:'P5044', y:2021, mk:'Lexus',         md:'RX',                 trim:'350 F Sport',        price:31995, mi:38600, body:'SUV',   ext:'Nori Green Pearl', int:'Circuit Red',     eng:'3.5L V6',         tx:'8-spd Auto',     dr:'AWD',  hp:295, sec:'7.2', mpg:22, vin:'2T2•••••••MC42',  img:'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1400&q=85&auto=format,compress', flags:['NO ACCIDENTS'] },
  { id:'P5052', y:2023, mk:'Tesla',         md:'Model Y',            trim:'Long Range',         price:36500, mi:14200, body:'SUV',   ext:'Pearl White',      int:'All Black',       eng:'Dual Motor EV',   tx:'1-spd Direct',   dr:'AWD',  hp:384, sec:'4.8', mpg:122,vin:'7SA•••••••P772',  img:'https://images.unsplash.com/photo-1617704548623-340376564e68?w=1400&q=85&auto=format,compress', flags:['ONE-OWNER','EV'] },
  { id:'P5066', y:2022, mk:'Porsche',       md:'Cayenne',            trim:'Base AWD',           price:52800, mi:21400, body:'SUV',   ext:'Carrara White',    int:'Black/Bordeaux',  eng:'3.0L Turbo V6',   tx:'8-spd Tiptronic', dr:'AWD', hp:335, sec:'5.9', mpg:21, vin:'WP1•••••••N005',  img:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1400&q=85&auto=format,compress', flags:['ONE-OWNER','LUXURY'] },
  { id:'P5077', y:2023, mk:'Range Rover',   md:'Sport',              trim:'P400 SE',            price:61995, mi:12890, body:'SUV',   ext:'Santorini Black',  int:'Ebony Windsor',   eng:'3.0L Mild-Hybrid I6', tx:'8-spd Auto', dr:'AWD',  hp:395, sec:'5.7', mpg:21, vin:'SAL•••••••P210',  img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1400&q=85&auto=format,compress', flags:['ONE-OWNER','LOW MILEAGE'] },
  { id:'P5081', y:2022, mk:'Cadillac',      md:'Escalade',           trim:'Premium Luxury',     price:54900, mi:28900, body:'SUV',   ext:'Black Raven',      int:'Whisper Beige',   eng:'6.2L V8',         tx:'10-spd Auto',    dr:'AWD',  hp:420, sec:'6.0', mpg:16, vin:'1GY•••••••N113',  img:'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1400&q=85&auto=format,compress', flags:['NO ACCIDENTS','LUXURY'] },
];

/* monthly payment math: P = r·PV / (1 − (1+r)^−n)  */
const monthlyPayment = (price, downPct = 10, termMonths = 60, apr = 6.9) => {
  const principal = price * (1 - downPct / 100);
  const r = apr / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (r * principal) / (1 - Math.pow(1 + r, -termMonths));
};
const fmt   = (n) => '$' + Math.round(n).toLocaleString('en-US');
const fmtMi = (n) => n.toLocaleString('en-US');

/* ─── In-View Hook ────────────────────────────────────── */
function useInView(opts = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } });
    }, opts);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, seen];
}

/* ─── Vertical Section Tag ───────────────────────────── */
function VTag({ num, label, color = C.gold }) {
  return (
    <div style={{
      position: 'absolute', left: 28, top: 60,
      writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 4,
      color, fontWeight: 600, textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <span style={{ color: C.inkLow }}>SECTION /</span>
      <span style={{ color }}>{num.toString().padStart(2, '0')}</span>
      <span style={{ width: 1, height: 24, background: color, opacity: 0.6 }} />
      <span>{label}</span>
    </div>
  );
}

/* ─── Side Rail Nav ──────────────────────────────────── */
function SideRail({ active, onJump, theme, onThemeToggle, lang, onLangToggle, savedCount, onShowSaved }) {
  const items = [
    { id:'top',      n:'00', l:'INDEX'    },
    { id:'fleet',    n:'01', l:'FLEET'    },
    { id:'detail',   n:'02', l:'DETAIL'   },
    { id:'trade',    n:'03', l:'TRADE'    },
    { id:'finance',  n:'04', l:'FINANCE'  },
    { id:'why',      n:'05', l:'CHARTER'  },
    { id:'process',  n:'06', l:'PROCESS'  },
    { id:'voices',   n:'07', l:'VOICES'   },
    { id:'alerts',   n:'08', l:'ALERTS'   },
    { id:'notebook', n:'09', l:'NOTEBOOK' },
    { id:'contact',  n:'10', l:'CONTACT'  },
  ];
  return (
    <aside className="side-rail" style={{
      position: 'fixed', top: 0, bottom: 0, left: 0, width: 96,
      background: C.bg, borderRight: `1px solid ${C.rule}`,
      zIndex: 40,
      display: 'flex', flexDirection: 'column',
      padding: '20px 0',
    }}>
      {/* logo block */}
      <a href="#top" onClick={(e) => { e.preventDefault(); onJump('top'); }} style={{
        display: 'block', padding: '0 12px 18px',
        borderBottom: `1px solid ${C.rule}`, marginBottom: 18,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 48, height: 48, margin: '0 auto',
          background: C.red,
          clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
          display: 'grid', placeItems: 'center',
          position: 'relative',
        }}>
          <span style={{
            color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 22, letterSpacing: '-1px',
          }}>P</span>
        </div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.5,
          textAlign: 'center', marginTop: 8, color: C.gold,
        }}>PRIMO//MIA</div>
      </a>

      {/* section list */}
      <nav style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
        {items.map(({ id, n, l }) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); onJump(id); }} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 6px', textDecoration: 'none',
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5,
            color: active === id ? C.gold : C.inkLow,
            borderLeft: `2px solid ${active === id ? C.gold : 'transparent'}`,
            transition: 'color 200ms, border-color 200ms',
            marginBottom: 2,
          }}>
            <span style={{ color: active === id ? C.red : C.inkLow }}>{n}</span>
            <span>{l}</span>
          </a>
        ))}
      </nav>

      {/* utility cluster: saved + lang + theme */}
      <div style={{
        padding: '12px 6px', borderTop: `1px solid ${C.rule}`,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* SAVED button with badge */}
        <button onClick={onShowSaved} style={{
          position: 'relative',
          background: savedCount > 0 ? C.gold : 'transparent',
          color: savedCount > 0 ? C.bg : C.inkDim,
          border: `1px solid ${savedCount > 0 ? C.gold : C.rule2}`,
          padding: '8px 4px', cursor: 'pointer',
          fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
          transition: 'all 180ms',
        }}>
          ♥ SAVED
          {savedCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              minWidth: 18, height: 18, padding: '0 4px',
              background: C.red, color: '#FFF',
              borderRadius: 9, fontSize: 10, fontWeight: 700,
              display: 'grid', placeItems: 'center',
              border: `2px solid ${C.bg}`,
            }}>{savedCount}</span>
          )}
        </button>

        {/* LANG toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule2}`,
        }}>
          {['en', 'es'].map(l => (
            <button key={l} onClick={() => lang !== l && onLangToggle()} style={{
              padding: '6px 0', cursor: 'pointer',
              background: lang === l ? C.gold : 'transparent',
              color: lang === l ? C.bg : C.inkDim,
              border: 'none',
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        {/* THEME toggle */}
        <button onClick={onThemeToggle} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} style={{
          background: 'transparent', border: `1px solid ${C.rule2}`,
          padding: '8px 4px', cursor: 'pointer',
          color: C.gold,
          fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 0,
          transition: 'all 180ms',
        }}>{theme === 'dark' ? '☀' : '☾'}</button>
      </div>

      {/* bottom block: phone */}
      <a href="tel:3055550199" style={{
        padding: '14px 8px', textDecoration: 'none',
        borderTop: `1px solid ${C.rule}`,
        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, color: C.ink,
        textAlign: 'center', display: 'block',
      }}>
        <div style={{ color: C.gold, fontSize: 8, letterSpacing: 2, marginBottom: 4 }}>HOTLINE</div>
        305.555.0199
      </a>
    </aside>
  );
}

/* ─── Marquee Ticker ───────────────────────────────── */
function Ticker() {
  const items = [
    'NEW ARRIVAL · 2024 AUDI Q5 PREMIUM PLUS · STOCK P5031',
    'FINANCING FROM 2.9% APR · O.A.C.',
    '★★★★★ 4.9 / 847 GOOGLE REVIEWS',
    'FREE HOME DELIVERY · SOUTH FLORIDA',
    '7-DAY MONEY-BACK GUARANTEE',
    '150-POINT INSPECTION · EVERY VEHICLE',
    'TRADE-IN VALUES UP $1,200 THIS WEEK',
    'HABLAMOS ESPAÑOL · OPEN 7 DAYS',
  ];
  const line = items.join('   ◆   ');
  return (
    <div style={{
      position: 'fixed', top: 0, left: 96, right: 0,
      height: 28, background: C.red, color: C.ink,
      borderBottom: `1px solid ${C.redDeep}`,
      overflow: 'hidden', zIndex: 35,
      display: 'flex', alignItems: 'center',
    }} className="marquee-bar">
      <div style={{
        whiteSpace: 'nowrap', display: 'inline-flex', gap: 60,
        animation: 'marquee 60s linear infinite',
        fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
      }}>
        <span>{line}</span>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}

/* ─── 00 · HERO / INDEX ─────────────────────────────── */
function Hero({ onCTA, lang = 'en' }) {
  const t = I18N[lang];
  return (
    <section id="top" style={{
      position: 'relative', minHeight: 'calc(100vh - 28px)',
      paddingTop: 28, overflow: 'hidden',
      background: C.bg,
    }}>
      <VTag num={0} label="INDEX" color={C.cyan} />

      {/* GIANT background type */}
      <div aria-hidden style={{
        position: 'absolute', bottom: -40, left: 80, right: 0, zIndex: 0,
        fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 0.78,
        fontSize: 'clamp(8rem, 22vw, 22rem)',
        color: 'transparent',
        WebkitTextStroke: `1px ${C.rule2}`,
        letterSpacing: '-8px', textTransform: 'uppercase',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}>PRIMO</div>

      {/* content grid */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: '1.05fr 1fr',
        height: 'calc(100vh - 28px)', minHeight: 720,
      }} className="hero-grid">
        {/* LEFT — dossier */}
        <div style={{
          padding: '80px 48px 48px 96px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: `1px solid ${C.rule}`,
        }}>
          {/* dossier header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36,
            opacity: 0, animation: 'fadeIn 600ms 100ms forwards',
          }}>
            <span style={{
              width: 8, height: 8, background: C.red,
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            }} />
            <span style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3,
              color: C.gold, fontWeight: 600,
            }}>FILE NO. 2026-MIA-0501</span>
            <span style={{ flex: 1, height: 1, background: C.rule }} />
            <span style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2,
              color: C.cyan,
            }}>STATUS · OPEN</span>
          </div>

          {/* monster title */}
          <h1 key={lang} style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            lineHeight: 0.86, letterSpacing: '-3px',
            color: C.ink, textTransform: 'uppercase',
            margin: 0, marginBottom: 24,
            opacity: 0, animation: 'slideRise 800ms 220ms forwards',
          }}>
            {t.title1}<br />
            <span style={{
              color: 'transparent',
              WebkitTextStroke: `1px ${C.gold}`,
            }}>{t.title2}</span>
            <span style={{ color: C.red }}>.</span>
          </h1>

          {/* dossier-style metadata strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
            marginBottom: 36, borderTop: `1px solid ${C.rule}`,
            opacity: 0, animation: 'fadeIn 700ms 480ms forwards',
          }}>
            {[
              ['LOCATION',  'MIAMI, FL'],
              ['INVENTORY', '128 UNITS'],
              ['EST.',      '2018'],
            ].map(([k, v], i) => (
              <div key={k} style={{
                padding: '14px 16px',
                borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
                borderBottom: `1px solid ${C.rule}`,
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: C.ink, letterSpacing: 0.5 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* tagline */}
          <p key={`b-${lang}`} style={{
            fontFamily: FONT_BODY, color: C.inkDim,
            fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', lineHeight: 1.55,
            maxWidth: 460, margin: 0, marginBottom: 38,
            opacity: 0, animation: 'fadeIn 700ms 620ms forwards',
          }}>
            {t.body}<br />
            {t.body2}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 0,
            opacity: 0, animation: 'fadeIn 700ms 780ms forwards',
          }}>
            <a href="#fleet" onClick={(e)=>{e.preventDefault();onCTA('fleet');}} style={{
              padding: '18px 28px', background: C.red, color: C.ink,
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
              letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)',
              paddingRight: 42,
              transition: 'background 180ms, color 180ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.gold}
            onMouseLeave={e => e.currentTarget.style.background = C.red}
            >{t.cta1}</a>
            <a href="#finance" onClick={(e)=>{e.preventDefault();onCTA('finance');}} style={{
              padding: '18px 28px 18px 14px', background: 'transparent',
              color: C.ink, border: `1px solid ${C.rule2}`, borderLeft: 'none',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
              letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
              marginLeft: -10,
              transition: 'border-color 180ms, color 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.rule2; e.currentTarget.style.color = C.ink; }}
            >{t.cta2}</a>
          </div>
        </div>

        {/* RIGHT — image with corner registration marks + spec readout */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: C.bg2,
        }}>
          {/* image */}
          <div style={{
            position: 'absolute', inset: 24,
            background: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=90&auto=format,compress') center/cover no-repeat`,
            opacity: 0, animation: 'fadeIn 1200ms 400ms forwards',
          }} />
          {/* dim overlay */}
          <div style={{
            position: 'absolute', inset: 24,
            background: `linear-gradient(180deg, transparent 40%, rgba(8,8,10,0.85) 100%)`,
          }} />
          {/* registration corners */}
          {[
            { top: 24, left: 24, br: 'left bottom' },
            { top: 24, right: 24, br: 'right bottom' },
            { bottom: 24, left: 24, br: 'left top' },
            { bottom: 24, right: 24, br: 'right top' },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 30, height: 30,
              borderTop: i < 2 ? `2px solid ${C.gold}` : 'none',
              borderBottom: i >= 2 ? `2px solid ${C.gold}` : 'none',
              borderLeft: (i === 0 || i === 2) ? `2px solid ${C.gold}` : 'none',
              borderRight: (i === 1 || i === 3) ? `2px solid ${C.gold}` : 'none',
              ...p,
            }} />
          ))}
          {/* spec readout */}
          <div style={{
            position: 'absolute', bottom: 56, left: 56, right: 56,
            color: C.ink, fontFamily: FONT_MONO,
            opacity: 0, animation: 'fadeIn 800ms 900ms forwards',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>
              FEATURED · STOCK P5066
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700,
              letterSpacing: -0.5, color: C.ink, marginBottom: 12,
            }}>2022 PORSCHE CAYENNE</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
              fontSize: 11, letterSpacing: 1,
            }}>
              {[
                ['PWR',  '335 hp'],
                ['0-60', '5.9 s'],
                ['MI',   '21,400'],
                ['$',    '52,800'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: C.inkLow, fontSize: 9, marginBottom: 3 }}>{k}</div>
                  <div style={{ color: C.cyan, fontWeight: 700, fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 01 · FLEET ─────────────────────────────────────── */
function Fleet({ priceMode, setPriceMode, onView, onBuildDeal, saved, onToggleSave, priceAlerts, onTogglePriceAlert, onCompare, reserved }) {
  return (
    <section id="fleet" style={{
      position: 'relative', padding: '80px 0 100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={1} label="FLEET MANIFEST" color={C.gold} />

      <div style={{ paddingLeft: 96, paddingRight: 48 }}>
        {/* section head */}
        <header style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 44, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 12,
            }}>01 / FLEET MANIFEST</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.92,
              letterSpacing: '-2px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>Find your perfect <span style={{ color: C.red }}>ride.</span></h2>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* COMPARE button */}
            <button onClick={onCompare} style={{
              padding: '10px 18px', background: 'transparent',
              color: C.cyan, border: `1px solid ${C.cyan}55`, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.cyan}15`; e.currentTarget.style.borderColor = C.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${C.cyan}55`; }}
            >⇄ COMPARE</button>

            {/* price ↔ payment toggle */}
            <div style={{
              display: 'inline-flex', border: `1px solid ${C.rule2}`,
            }}>
              {[
                ['price',   'STICKER'],
                ['payment', 'PAYMENT'],
              ].map(([k, l]) => (
                <button key={k} onClick={() => setPriceMode(k)} style={{
                  padding: '10px 18px',
                  background: priceMode === k ? C.gold : 'transparent',
                  color: priceMode === k ? C.bg : C.inkDim,
                  border: 'none', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
                }}>{l}</button>
              ))}
            </div>
          </div>
        </header>

        {/* search row — built like an instrument cluster */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          padding: 0, marginBottom: 36,
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr) auto',
        }} className="search-row">
          {[
            { lab: 'MAKE',    opts: ['ANY', 'BMW', 'MERCEDES', 'AUDI', 'LEXUS', 'TESLA', 'PORSCHE'] },
            { lab: 'MODEL',   opts: ['ANY MODEL'] },
            { lab: 'YEAR',    opts: ['ANY', '2024', '2023', '2022', '2021'] },
            { lab: priceMode === 'payment' ? 'MO. RANGE' : 'PRICE',
              opts: priceMode === 'payment'
                ? ['ANY', '<$400', '$400-600', '$600-800', '>$800']
                : ['ANY', '<$20K', '$20-40K', '$40-60K', '>$60K'] },
            { lab: 'MILES',   opts: ['ANY', '<15K', '15-30K', '30-50K', '50K+'] },
            { lab: 'BODY',    opts: ['ANY', 'SUV', 'SEDAN', 'TRUCK', 'COUPE'] },
            { lab: 'COLOR',   opts: ['ANY', 'WHITE', 'BLACK', 'GREY', 'RED'] },
          ].map((d, i) => (
            <div key={d.lab} style={{
              padding: 16, borderRight: `1px solid ${C.rule}`,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>{d.lab}</div>
              <select style={{
                width: '100%', appearance: 'none',
                background: 'transparent', border: 'none',
                color: C.ink, fontSize: 13, fontFamily: FONT_DISPLAY, fontWeight: 600,
                cursor: 'pointer', letterSpacing: 0.5, padding: 0,
              }}>{d.opts.map(o => <option key={o} style={{ background: C.bg }}>{o}</option>)}</select>
            </div>
          ))}
          <button style={{
            background: C.red, color: C.ink, border: 'none',
            padding: '0 32px', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>RUN ⟶</button>
        </div>

        {/* quick filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 44, flexWrap: 'wrap' }}>
          {['UNDER $20K', 'SUVs', 'LUXURY', 'LOW MILEAGE', 'TRUCKS', 'EV ONLY'].map(p => (
            <button key={p} style={{
              background: 'transparent', border: `1px solid ${C.rule2}`,
              color: C.inkDim, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5,
              padding: '8px 14px', cursor: 'pointer', fontWeight: 600,
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.inkDim; e.currentTarget.style.borderColor = C.rule2; }}
            >+ {p}</button>
          ))}
        </div>

        {/* fleet grid — asymmetric: 2/3/3 across */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18,
        }} className="fleet-grid">
          {FLEET.map((v, i) => {
            // 1st row: big-small (8/4); rest: 4/4/4
            const span = i === 0 ? 8 : i === 1 ? 4 : 4;
            return (
              <FleetCard
                key={v.id}
                v={v}
                feature={i === 0}
                span={span}
                priceMode={priceMode}
                onView={onView}
                onBuildDeal={onBuildDeal}
                isSaved={saved.has(v.id)}
                onToggleSave={() => onToggleSave(v.id)}
                isAlerted={priceAlerts.has(v.id)}
                onTogglePriceAlert={() => onTogglePriceAlert(v.id)}
                isReserved={reserved.has(v.id)}
                idx={i}
              />
            );
          })}
        </div>

        {/* view all */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <a href="#fleet" style={{
            display: 'inline-block', padding: '14px 36px',
            border: `1px solid ${C.gold}`, color: C.gold,
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
            letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all 180ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; }}
          >View All 128 Units →</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Fleet Card (spec sheet style) ────────────────── */
function FleetCard({ v, feature, span, priceMode, onView, onBuildDeal, isSaved, onToggleSave, isAlerted, onTogglePriceAlert, isReserved, idx }) {
  const [ref, seen] = useInView();
  const [hover, setHover] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const monthly = monthlyPayment(v.price);

  const stop = (e) => { e.stopPropagation(); };

  return (
    <div
      ref={ref}
      onClick={() => onView(v)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: `span ${span}`,
        position: 'relative', cursor: 'pointer',
        background: C.panel, border: `1px solid ${hover ? C.gold : C.rule}`,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 700ms ${idx * 60}ms, transform 700ms ${idx * 60}ms, border-color 200ms`,
        display: 'grid',
        gridTemplateColumns: feature ? '1.4fr 1fr' : '1fr',
        minHeight: feature ? 380 : 'auto',
      }}
      className="fleet-card"
    >
      {/* image */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: feature ? 'auto' : '16/10',
        background: `url('${v.img}') center/cover no-repeat`,
      }}>
        {/* RESERVED overlay */}
        {isReserved && (
          <>
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'rgba(8,8,10,0.55)',
              backdropFilter: 'grayscale(0.4)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              zIndex: 6, pointerEvents: 'none',
              background: C.gold, color: '#08080A',
              padding: '8px 22px',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 4,
              border: `2px solid #08080A`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
            }}>RESERVED</div>
          </>
        )}
        {/* corner stock # */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: C.gold, color: C.bg,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
          padding: '4px 10px',
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
          paddingRight: 18,
        }}>STOCK · {v.id}</div>

        {/* flags */}
        <div style={{
          position: 'absolute', top: 14, right: 56,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {v.flags.map(f => (
            <span key={f} style={{
              background: 'rgba(8,8,10,0.85)',
              color: '#5BE3FF', fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5,
              padding: '3px 8px', border: `1px solid #5BE3FF55`,
              fontWeight: 600,
            }}>{f}</span>
          ))}
        </div>

        {/* HEART (save) + BELL (alert) — top right */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', flexDirection: 'column', gap: 6,
          zIndex: 4,
        }} onClick={stop}>
          <button onClick={(e) => { stop(e); onToggleSave(); }}
            title={isSaved ? 'Unsave' : 'Save'}
            style={{
              width: 32, height: 32,
              background: isSaved ? C.gold : 'rgba(8,8,10,0.78)',
              border: `1px solid ${isSaved ? C.gold : C.rule2}`,
              color: isSaved ? '#08080A' : C.ink,
              cursor: 'pointer', fontSize: 14,
              display: 'grid', placeItems: 'center',
              transition: 'all 180ms',
            }}>{isSaved ? '♥' : '♡'}</button>

          <button onClick={(e) => { stop(e); setAlertOpen(o => !o); }}
            title={isAlerted ? 'Alert active' : 'Notify on price drop'}
            style={{
              width: 32, height: 32,
              background: isAlerted ? `${C.cyan}30` : 'rgba(8,8,10,0.78)',
              border: `1px solid ${isAlerted ? C.cyan : C.rule2}`,
              color: isAlerted ? C.cyan : C.ink,
              cursor: 'pointer', fontSize: 13,
              display: 'grid', placeItems: 'center',
              transition: 'all 180ms',
            }}>{isAlerted ? '🔔' : '🔕'}</button>
        </div>

        {/* alert popover */}
        {alertOpen && (
          <div onClick={stop} style={{
            position: 'absolute', top: 56, right: 14, zIndex: 6,
            width: 240, background: '#08080A', border: `1px solid ${C.gold}`,
            padding: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold, marginBottom: 8 }}>
              PRICE-DROP ALERT
            </div>
            {alertSent ? (
              <div style={{
                fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, lineHeight: 1.5,
              }}>✓ Alert armed.<br />We'll text you the second this drops.</div>
            ) : (
              <>
                <input
                  type="email" placeholder="you@email.com"
                  value={alertEmail}
                  onChange={e => setAlertEmail(e.target.value)}
                  onClick={stop}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_MONO, fontSize: 12,
                    padding: '6px 0', marginBottom: 10,
                  }}
                />
                <button onClick={() => { onTogglePriceAlert(); setAlertSent(true); setTimeout(() => { setAlertOpen(false); setAlertSent(false); setAlertEmail(''); }, 1800); }} style={{
                  width: '100%', padding: '8px', background: C.gold, color: '#08080A',
                  border: 'none', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                }}>▸ ARM ALERT</button>
              </>
            )}
          </div>
        )}

        {/* hover scrim with view */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(8,8,10,0.92), rgba(8,8,10,0))',
          opacity: hover ? 1 : 0, transition: 'opacity 200ms',
          display: 'flex', alignItems: 'flex-end', padding: 16,
        }}>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2,
            color: C.gold, fontWeight: 700,
          }}>OPEN DOSSIER →</span>
        </div>
      </div>

      {/* spec sheet */}
      <div style={{
        padding: feature ? 28 : 18,
        display: 'flex', flexDirection: 'column', gap: 12,
        background: C.panel,
      }}>
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2,
            color: C.inkLow, marginBottom: 4,
          }}>{v.y} · {v.body.toUpperCase()} · {fmtMi(v.mi)} mi</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: feature ? 28 : 18, letterSpacing: -0.5,
            color: C.ink, lineHeight: 1.05, textTransform: 'uppercase',
          }}>{v.mk} {v.md}</div>
          {feature && (
            <div style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, marginTop: 4,
            }}>{v.trim}</div>
          )}
        </div>

        {/* tech bar — only on feature card */}
        {feature && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
            border: `1px solid ${C.rule}`, marginTop: 4,
          }}>
            {[
              ['HP',     v.hp.toString()],
              ['0-60',   `${v.sec}s`],
              ['MPG',    v.mpg.toString()],
            ].map(([k, val], i) => (
              <div key={k} style={{
                padding: '10px 12px',
                borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.5, color: C.inkLow }}>{k}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: C.cyan }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {/* price/payment */}
        <div style={{
          marginTop: 'auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingTop: 10, borderTop: `1px dashed ${C.rule2}`,
        }}>
          {priceMode === 'payment' ? (
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 2, color: C.inkLow }}>EST. MO.</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: feature ? 32 : 22, fontWeight: 700, color: C.gold, lineHeight: 1 }}>
                {fmt(monthly)}<span style={{ fontSize: 12, color: C.inkLow, marginLeft: 2 }}>/mo</span>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2 }}>{fmt(v.price)} · 60mo · 6.9%</div>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 2, color: C.inkLow }}>STICKER</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: feature ? 32 : 22, fontWeight: 700, color: C.gold, lineHeight: 1 }}>
                {fmt(v.price)}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2 }}>~{fmt(monthly)}/mo est.</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} onClick={stop}>
            <button onClick={(e) => { stop(e); onBuildDeal(v); }} style={{
              background: C.gold, color: '#08080A',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 11,
              letterSpacing: 1.5, textTransform: 'uppercase',
              padding: '8px 12px', border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>★ BUILD DEAL</button>
            <button onClick={(e) => { stop(e); onView(v); }} style={{
              background: C.red, color: '#FFFFFF',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 11,
              letterSpacing: 1.5, textTransform: 'uppercase',
              padding: '8px 12px', border: 'none', cursor: 'pointer',
            }}>OPEN ▸</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 02 · DETAIL DRAWER (full-height slide-in) ────── */
function DetailDrawer({ v, onClose, onBuildDeal, onReserve, isReserved }) {
  const [tab, setTab]   = useState('specs');
  const [shot, setShot] = useState(0);
  const [down, setDown] = useState(15);
  const [term, setTerm] = useState(60);
  const [credit, setCredit] = useState('Excellent (750+)');
  const [zip, setZip]   = useState('');
  const [delivery, setDelivery] = useState(false);
  const [delZip, setDelZip] = useState('');
  // Text-me-this-vehicle popover
  const [textOpen, setTextOpen] = useState(false);
  const [textPhone, setTextPhone] = useState('');
  const [textSent, setTextSent] = useState(false);

  const aprMap = {
    'Excellent (750+)':  5.4,
    'Good (700-749)':    6.9,
    'Fair (600-699)':    9.5,
    'Rebuilding (<600)': 14.9,
  };
  const apr = aprMap[credit];

  // tax & fee estimator from ZIP
  const isFL = /^3[34]\d{3}$/.test(zip);
  const validZip = /^\d{5}$/.test(zip);
  const taxRate = validZip ? (isFL ? 0.06 : 0.07) : 0;
  const fees    = validZip ? (isFL ? 400  : 500)  : 0;
  const taxAmt  = v.price * taxRate;
  const adjusted = v.price + taxAmt + fees;
  const calc = monthlyPayment(validZip ? adjusted : v.price, down, term, apr);

  // delivery estimator
  const delZipFL = /^3[34]\d{3}$/.test(delZip);
  const delValidZip = /^\d{5}$/.test(delZip);
  const delFee = delValidZip ? (delZipFL ? 0 : (parseInt(delZip[2]) > 5 ? 199 : 99)) : null;

  const thumbs = [v.img, v.img, v.img, v.img, v.img];

  // anim in
  const [open, setOpen] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 280); };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: open ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: open ? 'blur(4px)' : 'none',
        transition: 'background 280ms, backdrop-filter 280ms',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, bottom: 0, right: 0,
          width: 'min(960px, 100%)',
          background: C.bg, borderLeft: `1px solid ${C.rule}`,
          transform: open ? 'translateX(0)' : 'translateX(40px)',
          opacity: open ? 1 : 0,
          transition: 'transform 320ms cubic-bezier(0.2,0.8,0.2,1), opacity 260ms',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* drawer header — dossier strip */}
        <div style={{
          padding: '20px 28px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: C.bg2, position: 'sticky', top: 0, zIndex: 5,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5,
              color: C.gold, marginBottom: 4,
            }}>DOSSIER · {v.id} · VIN {v.vin}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 22, letterSpacing: -0.5, color: C.ink, textTransform: 'uppercase',
            }}>{v.y} {v.mk} {v.md}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onBuildDeal && onBuildDeal(v)} style={{
              padding: '10px 18px', background: C.gold, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>★ Build Deal</button>
            <button
              disabled={isReserved}
              onClick={() => onReserve && onReserve(v)} style={{
                padding: '10px 18px',
                background: isReserved ? C.rule2 : 'transparent',
                color: isReserved ? C.inkLow : C.gold,
                border: `1px solid ${isReserved ? C.rule2 : C.gold}`,
                cursor: isReserved ? 'not-allowed' : 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
              {isReserved ? '✓ Reserved' : '⌚ Reserve · $500'}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setTextOpen(o => !o)} style={{
                padding: '10px 14px', background: 'transparent',
                color: C.cyan, border: `1px solid ${C.cyan}55`, cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>📱 Text Me</button>
              {textOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 8,
                  width: 260, background: C.bg, border: `1px solid ${C.cyan}`,
                  padding: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                }}>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 8,
                  }}>TEXT ME THIS VEHICLE</div>
                  {textSent ? (
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.gold, lineHeight: 1.5 }}>
                      ✓ Link sent!<br />Check your messages.
                    </div>
                  ) : (
                    <>
                      <input
                        type="tel" placeholder="(305) 555-0123"
                        value={textPhone}
                        onChange={e => setTextPhone(e.target.value)}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          borderBottom: `1px solid ${C.rule2}`,
                          color: C.ink, fontFamily: FONT_MONO, fontSize: 13,
                          padding: '6px 0', marginBottom: 10,
                        }}
                      />
                      <button onClick={() => { setTextSent(true); setTimeout(() => { setTextOpen(false); setTextSent(false); setTextPhone(''); }, 1800); }} style={{
                        width: '100%', padding: '8px', background: C.cyan, color: '#08080A',
                        border: 'none', cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                      }}>▸ SEND LINK</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <button onClick={close} style={{
              width: 40, height: 40,
              background: 'transparent', border: `1px solid ${C.rule2}`,
              color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 16,
            }}>✕</button>
          </div>
        </div>

        {/* video walkaround placeholder */}
        <div style={{ padding: '28px 28px 0' }}>
          <div style={{
            position: 'relative', aspectRatio: '21/9',
            background: `linear-gradient(135deg, #050508 0%, #0E0E12 100%)`,
            border: `1px solid ${C.rule}`, overflow: 'hidden',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            {/* scan lines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(91,227,255,0.04) 2px 3px)`,
            }} />
            {/* play button */}
            <div style={{
              position: 'relative', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(226,178,60,0.15)', border: `2px solid ${C.gold}`,
                display: 'grid', placeItems: 'center',
                boxShadow: `0 0 40px ${C.gold}40`,
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}>
                <span style={{
                  marginLeft: 4, color: C.gold, fontSize: 26,
                }}>▶</span>
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                color: C.ink, letterSpacing: 0.5, textTransform: 'uppercase',
              }}>360° Video Walkaround</div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
              }}>2:14 · HD AVAILABLE</div>
            </div>
            {/* corner badge */}
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: C.red, color: '#FFF',
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
              padding: '4px 8px',
            }}>● LIVE WALKAROUND</div>
          </div>
        </div>

        {/* gallery strip */}
        <div style={{ padding: 28, paddingBottom: 0 }}>
          <div style={{
            aspectRatio: '16/9',
            background: `url('${thumbs[shot]}') center/cover no-repeat`,
            border: `1px solid ${C.rule}`, position: 'relative',
          }}>
            {/* registration corners */}
            {[
              { top: 8, left: 8 },
              { top: 8, right: 8 },
              { bottom: 8, left: 8 },
              { bottom: 8, right: 8 },
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', width: 18, height: 18,
                borderTop: i < 2 ? `1px solid ${C.gold}` : 'none',
                borderBottom: i >= 2 ? `1px solid ${C.gold}` : 'none',
                borderLeft: (i === 0 || i === 2) ? `1px solid ${C.gold}` : 'none',
                borderRight: (i === 1 || i === 3) ? `1px solid ${C.gold}` : 'none',
                ...p,
              }} />
            ))}
            {/* badge bar */}
            <div style={{
              position: 'absolute', bottom: 14, left: 14, right: 14,
              display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {['NO ACCIDENTS', '1 OWNER', 'SVC RECORDS', '150-PT INSPECTED'].map(b => (
                <span key={b} style={{
                  background: 'rgba(91,227,255,0.1)', color: C.cyan,
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 600,
                  padding: '4px 8px', border: `1px solid ${C.cyan}55`,
                }}>✓ {b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {thumbs.map((t, i) => (
              <button key={i} onClick={() => setShot(i)} style={{
                width: 80, height: 56,
                background: `url('${t}') center/cover`,
                border: `1px solid ${shot === i ? C.gold : C.rule}`,
                cursor: 'pointer', padding: 0, opacity: shot === i ? 1 : 0.6,
              }} />
            ))}
          </div>
        </div>

        {/* tab bar */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 28, paddingLeft: 28,
          borderBottom: `1px solid ${C.rule}`,
        }}>
          {[
            ['specs',    'SPECS'],
            ['payment',  'PAYMENT CALC'],
            ['contact',  'CONTACT DEALER'],
            ['testdrive','SCHEDULE'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '14px 20px',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, fontWeight: 600,
              color: tab === k ? C.gold : C.inkLow,
              borderBottom: `2px solid ${tab === k ? C.gold : 'transparent'}`,
              marginBottom: -1,
            }}>{l}</button>
          ))}
        </div>

        {/* tab content */}
        <div style={{ padding: 28, flex: 1 }}>
          {tab === 'specs' && (
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
                border: `1px solid ${C.rule}`, marginBottom: 24,
              }}>
                {[
                  ['HORSEPOWER', `${v.hp} HP`],
                  ['0–60 MPH',   `${v.sec} SEC`],
                  ['MPG',        `${v.mpg}`],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '18px 20px',
                    borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: C.cyan, lineHeight: 1 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                border: `1px solid ${C.rule}`,
              }}>
                {[
                  ['MILEAGE',       `${fmtMi(v.mi)} mi`],
                  ['EXTERIOR',      v.ext],
                  ['INTERIOR',      v.int],
                  ['ENGINE',        v.eng],
                  ['TRANSMISSION',  v.tx],
                  ['DRIVETRAIN',    v.dr],
                  ['BODY STYLE',    v.body],
                  ['STOCK #',       v.id],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '14px 18px',
                    borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
                    borderBottom: i < 6 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.ink, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'payment' && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingBottom: 16, borderBottom: `1px solid ${C.rule}`, marginBottom: 24,
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>STICKER</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{fmt(v.price)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>EST. MONTHLY</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: C.gold, lineHeight: 1 }}>
                    {fmt(calc)}<span style={{ fontSize: 16, color: C.inkLow }}>/mo</span>
                  </div>
                </div>
              </div>

              {/* down payment slider */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                }}>
                  <span style={{ color: C.inkDim }}>DOWN PAYMENT</span>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{down}% · {fmt(v.price * down / 100)}</span>
                </div>
                <input type="range" min={0} max={50} value={down}
                  onChange={e => setDown(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: C.gold }}
                />
              </div>

              {/* term selector */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim,
                  marginBottom: 8,
                }}>TERM</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${C.rule2}` }}>
                  {[36, 48, 60, 72].map((t, i) => (
                    <button key={t} onClick={() => setTerm(t)} style={{
                      padding: '12px 0', cursor: 'pointer',
                      background: term === t ? C.gold : 'transparent',
                      color: term === t ? C.bg : C.inkDim,
                      border: 'none', borderRight: i < 3 ? `1px solid ${C.rule2}` : 'none',
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>{t} MO</button>
                  ))}
                </div>
              </div>

              {/* credit selector */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim,
                  marginBottom: 8,
                }}>CREDIT BAND</div>
                <select value={credit} onChange={e => setCredit(e.target.value)} style={{
                  width: '100%', appearance: 'none',
                  background: C.panel, border: `1px solid ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                  cursor: 'pointer',
                }}>
                  {Object.keys(aprMap).map(k => <option key={k}>{k}</option>)}
                </select>
              </div>

              {/* ZIP / tax estimator */}
              <div style={{
                marginTop: 16, padding: 14,
                border: `1px dashed ${C.rule2}`, background: C.bg2,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  }}>TAX & FEE ESTIMATOR</div>
                  <input
                    type="text" placeholder="ZIP" maxLength={5}
                    value={zip}
                    onChange={e => setZip(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: 90, background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 13,
                      padding: '4px 6px', textAlign: 'center', letterSpacing: 2,
                    }}
                  />
                </div>
                {validZip ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>SALES TAX ({(taxRate * 100).toFixed(0)}%)</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{fmt(taxAmt)}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>EST. FEES</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{fmt(fees)}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow, letterSpacing: 1 }}>
                    Enter ZIP to include tax & fees in monthly payment.
                  </div>
                )}
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 6, lineHeight: 1.5 }}>
                  Tax and fee estimates. Final amounts at signing.
                </div>
              </div>

              {/* readout */}
              <div style={{
                marginTop: 16,
                padding: '20px 24px', background: C.panel,
                border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
              }}>
                {[
                  ['APR',           `${apr}%`],
                  ['TOTAL INT.',    fmt(calc * term - (validZip ? adjusted : v.price) * (1 - down / 100))],
                  ['TOTAL PAID',    fmt(calc * term + (validZip ? adjusted : v.price) * (down / 100))],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '0 16px',
                    borderLeft: i > 0 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  marginBottom: 6,
                }}>02 · GET YOUR E-PRICE</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase',
                }}>Get the dealer's best number, sent to your inbox.</div>
              </div>
              <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                {[['Full Name', 'text'], ['Email Address', 'email'], ['Phone Number', 'tel']].map(([ph, t]) => (
                  <input key={ph} type={t} placeholder={ph} style={{
                    background: C.panel, border: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_BODY, fontSize: 14, padding: '14px 16px',
                  }} />
                ))}
              </div>
              <button style={{
                width: '100%', padding: '16px 20px',
                background: C.red, color: C.ink, border: 'none', cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                letterSpacing: 2, textTransform: 'uppercase',
              }}>Send Me My E-Price ▸</button>

              <div style={{
                marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.rule}`,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              }}>
                <button style={{
                  padding: 14, background: 'transparent', color: C.ink,
                  border: `1px solid ${C.rule2}`, cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 600,
                }}>📲 TEXT ABOUT THIS CAR</button>
                <button style={{
                  padding: 14, background: 'transparent', color: C.ink,
                  border: `1px solid ${C.rule2}`, cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 600,
                }}>↗ SHARE THIS VEHICLE</button>
              </div>
            </div>
          )}

          {tab === 'testdrive' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  marginBottom: 6,
                }}>02 · BOOK A TEST DRIVE</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase',
                }}>Pick a slot. Car will be detailed and ready.</div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>DATE</div>
                    <input type="date" style={{
                      width: '100%', background: C.panel, border: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                      colorScheme: 'dark',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>TIME SLOT</div>
                    <select style={{
                      width: '100%', appearance: 'none',
                      background: C.panel, border: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                      cursor: 'pointer',
                    }}>
                      <option>10:00 AM</option><option>11:30 AM</option>
                      <option>1:00 PM</option><option>2:30 PM</option>
                      <option>4:00 PM</option><option>5:30 PM</option>
                    </select>
                  </div>
                </div>
                {['Full Name', 'Phone Number'].map(ph => (
                  <input key={ph} type="text" placeholder={ph} style={{
                    background: C.panel, border: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_BODY, fontSize: 14, padding: '12px 14px',
                  }} />
                ))}
                <button style={{
                  padding: '16px 20px', background: C.gold, color: C.bg,
                  border: 'none', cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                  letterSpacing: 2, textTransform: 'uppercase', marginTop: 4,
                }}>Lock My Slot ▸</button>
              </div>

              {/* HOME DELIVERY */}
              <div style={{
                marginTop: 28, padding: 20,
                background: C.bg2, border: `1px solid ${delivery ? C.gold : C.rule}`,
                transition: 'border-color 200ms',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: delivery ? 14 : 0,
                }}>
                  <div>
                    <div style={{
                      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                      marginBottom: 4,
                    }}>HOME DELIVERY · CARVANA-STYLE</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                      color: C.ink, letterSpacing: -0.3,
                    }}>Deliver to my door</div>
                  </div>
                  <button onClick={() => setDelivery(d => !d)} style={{
                    width: 50, height: 28, position: 'relative',
                    background: delivery ? C.gold : C.rule2, border: 'none',
                    cursor: 'pointer', padding: 0, transition: 'background 200ms',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: delivery ? 25 : 3,
                      width: 22, height: 22,
                      background: delivery ? '#08080A' : C.ink,
                      transition: 'left 200ms',
                    }} />
                  </button>
                </div>
                {delivery && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input
                      type="text" placeholder="DELIVERY ZIP CODE" maxLength={5}
                      value={delZip}
                      onChange={e => setDelZip(e.target.value.replace(/\D/g, ''))}
                      style={{
                        background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                        padding: '8px 4px', letterSpacing: 2,
                      }}
                    />
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
                      border: `1px solid ${C.rule}`, fontFamily: FONT_MONO, fontSize: 10,
                    }}>
                      <div style={{ padding: 10, borderRight: `1px solid ${C.rule}`,
                        background: delValidZip && delFee === 0 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>≤25 MI</div>
                        <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>FREE</div>
                      </div>
                      <div style={{ padding: 10, borderRight: `1px solid ${C.rule}`,
                        background: delValidZip && delFee === 99 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>25-50 MI</div>
                        <div style={{ color: C.ink, fontWeight: 700, fontSize: 13 }}>$99</div>
                      </div>
                      <div style={{ padding: 10,
                        background: delValidZip && delFee === 199 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>50+ MI</div>
                        <div style={{ color: C.ink, fontWeight: 700, fontSize: 13 }}>$199</div>
                      </div>
                    </div>
                    {delValidZip && (
                      <div style={{
                        fontFamily: FONT_MONO, fontSize: 11, color: C.gold, marginTop: 4,
                      }}>▸ Estimated delivery fee: {delFee === 0 ? 'FREE' : `$${delFee}`}</div>
                    )}
                    <button style={{
                      padding: '14px 18px', background: C.cyan, color: '#08080A',
                      border: 'none', cursor: 'pointer',
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
                      letterSpacing: 2, textTransform: 'uppercase',
                    }}>▸ Schedule Delivery</button>
                  </div>
                )}
              </div>

              {/* QR CODE BLOCK */}
              <div style={{
                marginTop: 24, padding: 20,
                border: `1px solid ${C.rule}`, background: C.panel,
                display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center',
              }}>
                <QRBlock seed={v.id} />
                <div>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
                    marginBottom: 6,
                  }}>SCAN · MOBILE</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                    color: C.ink, letterSpacing: -0.3, marginBottom: 6,
                  }}>Scan to view this vehicle on your phone.</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, lineHeight: 1.5,
                  }}>Print this QR for your lot windshield sticker — physical-to-digital bridge.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* similar bar */}
        <div style={{
          padding: '28px', borderTop: `1px solid ${C.rule}`,
          background: C.bg2,
        }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
            marginBottom: 14,
          }}>SIMILAR DOSSIERS</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {FLEET.filter(x => x.id !== v.id).slice(0, 4).map(s => (
              <div key={s.id} style={{
                flex: '0 0 200px',
                border: `1px solid ${C.rule}`, background: C.panel, cursor: 'pointer',
              }}>
                <div style={{ aspectRatio: '16/10', background: `url('${s.img}') center/cover` }} />
                <div style={{ padding: 10 }}>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow,
                  }}>{s.id} · {s.y}</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14,
                    color: C.ink, letterSpacing: 0.5, marginTop: 2,
                  }}>{s.mk} {s.md}</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                    color: C.gold, marginTop: 4,
                  }}>{fmt(s.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 03 · TRADE-IN (diagnostic terminal style) ────── */
function TradeIn() {
  const [ref, seen] = useInView();
  const [out, setOut] = useState(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setOut(null);
    setTimeout(() => {
      setOut({ low: 12400, high: 14200 });
      setRunning(false);
    }, 1100);
  };

  return (
    <section ref={ref} id="trade" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3} label="TRADE-IN ESTIMATOR" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }} className="trade-grid">
        {/* left intro */}
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>03 / TRADE-IN ESTIMATOR</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 18,
          }}>What's it <span style={{ color: C.red }}>worth?</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15,
            lineHeight: 1.55, margin: 0, marginBottom: 24,
          }}>
            Drop your VIN — or pick year/make/model — and we'll bounce it against three live wholesale auctions in 60 seconds.
            Bring it in for the precise number.
          </p>

          <div style={{
            fontFamily: FONT_MONO, fontSize: 11, color: C.inkLow, lineHeight: 1.7,
            paddingLeft: 14, borderLeft: `1px solid ${C.rule2}`,
          }}>
            ▸ Manheim live data<br />
            ▸ ADESA wholesale<br />
            ▸ KBB instant offer<br />
            ▸ Honored 7 days
          </div>
        </div>

        {/* right: terminal + form */}
        <div style={{
          background: '#02030A', border: `1px solid ${C.rule2}`,
          fontFamily: FONT_MONO,
        }}>
          {/* terminal title bar */}
          <div style={{
            padding: '10px 14px', borderBottom: `1px solid ${C.rule2}`,
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#06060E',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28CA41' }} />
            <span style={{
              flex: 1, textAlign: 'center', fontSize: 10, color: C.inkLow, letterSpacing: 1,
            }}>primo://trade-est ~ session 0501</span>
          </div>

          {/* form rows */}
          <div style={{ padding: 24 }}>
            {[
              { lab: 'YEAR',     opts: ['2024', '2023', '2022', '2021', '2020', 'OLDER'] },
              { lab: 'MAKE',     opts: ['TOYOTA', 'HONDA', 'FORD', 'CHEVY', 'NISSAN', 'OTHER'] },
              { lab: 'MODEL',    opts: ['MODEL'] },
              { lab: 'MILEAGE',  opts: ['<30K', '30-60K', '60-100K', '>100K'] },
            ].map(d => (
              <div key={d.lab} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr',
                alignItems: 'center', marginBottom: 12,
              }}>
                <span style={{ color: C.cyan, fontSize: 11, letterSpacing: 1.5 }}>$ {d.lab}</span>
                <select style={{
                  appearance: 'none', background: 'transparent',
                  border: 'none', borderBottom: `1px dashed ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_MONO, fontSize: 13, padding: '6px 4px',
                  cursor: 'pointer',
                }}>
                  {d.opts.map(o => <option key={o} style={{ background: '#02030A' }}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{
              display: 'grid', gridTemplateColumns: '120px 1fr',
              alignItems: 'center', marginBottom: 16,
            }}>
              <span style={{ color: C.cyan, fontSize: 11, letterSpacing: 1.5 }}>$ CONDITION</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {['EXC', 'GOOD', 'FAIR', 'POOR'].map(c => (
                  <button key={c} style={{
                    background: 'transparent', border: `1px solid ${C.rule2}`,
                    color: C.inkDim, fontFamily: FONT_MONO, fontSize: 10,
                    padding: '6px 0', cursor: 'pointer', letterSpacing: 1,
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <button onClick={run} disabled={running} style={{
              width: '100%', padding: '14px',
              background: running ? C.rule : C.cyan,
              color: C.bg, border: 'none', cursor: running ? 'wait' : 'pointer',
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, letterSpacing: 2,
            }}>{running ? 'RUNNING DIAGNOSTIC ⋯' : '▸ EXECUTE TRADE-EST'}</button>

            {/* terminal output */}
            <div style={{
              marginTop: 18, padding: 14, minHeight: 110,
              background: 'rgba(91,227,255,0.05)',
              border: `1px solid ${C.cyan}33`,
              fontSize: 11, color: C.cyan, lineHeight: 1.7,
            }}>
              {!out && !running && <div style={{ color: C.inkLow }}>{`> awaiting input ⋯`}</div>}
              {running && (
                <div>
                  <div>{`> querying manheim ............ OK`}</div>
                  <div>{`> querying adesa .............. OK`}</div>
                  <div>{`> querying kbb instant ........ ⋯`}</div>
                </div>
              )}
              {out && (
                <div>
                  <div>{`> querying manheim ............ OK`}</div>
                  <div>{`> querying adesa .............. OK`}</div>
                  <div>{`> querying kbb instant ........ OK`}</div>
                  <div style={{ color: C.gold, marginTop: 6 }}>{`> RANGE: $${out.low.toLocaleString()} – $${out.high.toLocaleString()}`}</div>
                  <div style={{ color: C.inkDim, marginTop: 4 }}>{`> bring it in for an exact appraisal`}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 04 · FINANCE ─────────────────────────────────── */
function Finance() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} id="finance" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={4} label="FINANCE QUALIFICATION" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{ marginBottom: 48, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>04 / PRE-APPROVAL · 60 SECONDS</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Get qualified <span style={{ color: C.red }}>without</span> the credit hit.</h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Soft credit pull. No SSN required. No impact to your score. We work with five major lenders — <strong style={{ color: C.ink }}>excellent, fair, rebuilding, all of it.</strong>
          </p>
        </div>

        {/* form — split into 2 columns */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }} className="finance-split">
          {/* left: form */}
          <div style={{ padding: 32, borderRight: `1px solid ${C.rule}` }}>
            {[
              { lab: 'FIRST NAME',         t: 'text',   ph: 'JANE' },
              { lab: 'LAST NAME',          t: 'text',   ph: 'DOE' },
              { lab: 'EMAIL',              t: 'email',  ph: 'jane@email.com' },
              { lab: 'PHONE',              t: 'tel',    ph: '(305) 555-0123' },
              { lab: 'EMPLOYMENT STATUS',  t: 'select', opts: ['W-2 EMPLOYEE', 'SELF-EMPLOYED', 'RETIRED', '1099 / CONTRACTOR', 'OTHER'] },
              { lab: 'MONTHLY INCOME',     t: 'select', opts: ['UNDER $3K', '$3-5K', '$5-8K', '$8-12K', 'OVER $12K'] },
              { lab: 'CREDIT BAND',        t: 'select', opts: ['EXCELLENT (750+)', 'GOOD (700-749)', 'FAIR (600-699)', 'REBUILDING (<600)'] },
            ].map(f => (
              <div key={f.lab} style={{ marginBottom: 14 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow,
                  marginBottom: 4,
                }}>{f.lab}</div>
                {f.t === 'select' ? (
                  <select style={{
                    width: '100%', appearance: 'none',
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                    padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                  }}>{f.opts.map(o => <option key={o} style={{ background: C.panel }}>{o}</option>)}</select>
                ) : (
                  <input type={f.t} placeholder={f.ph} style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                    padding: '6px 0', letterSpacing: 0.5,
                  }} />
                )}
              </div>
            ))}

            <button style={{
              width: '100%', padding: '16px 20px', marginTop: 18,
              background: C.gold, color: C.bg, border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>🔒 Check My Rate</button>
          </div>

          {/* right: assurance + lenders */}
          <div style={{ padding: 32, background: C.bg2 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                marginBottom: 10,
              }}>SECURITY · TRUST</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {[
                  ['256-BIT', 'Bank-grade end-to-end encryption'],
                  ['NO SSN', 'Quote without disclosing your SSN'],
                  ['SOFT', 'Soft credit pull only — zero impact'],
                  ['SECURE', 'No data resold or shared, ever'],
                ].map(([k, v]) => (
                  <li key={k} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10, alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.gold,
                      fontWeight: 700,
                    }}>{k}</span>
                    <span style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13 }}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.rule}` }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                marginBottom: 14,
              }}>LENDER PARTNERS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${C.rule}` }}>
                {['CAPITAL ONE AUTO', 'CHASE AUTO', 'ALLY FINANCIAL', 'WELLS FARGO', 'TD AUTO', 'SANTANDER'].map((b, i) => (
                  <div key={b} style={{
                    padding: '12px 14px',
                    borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
                    borderTop: i >= 2 ? `1px solid ${C.rule}` : 'none',
                    fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
                    color: C.ink, letterSpacing: 0.5,
                  }}>{b}</div>
                ))}
              </div>
            </div>

            <p style={{
              marginTop: 24, fontFamily: FONT_MONO, fontSize: 11, color: C.gold,
              letterSpacing: 1, lineHeight: 1.6,
            }}>
              ▸ BAD CREDIT? NO CREDIT?<br />
              ▸ BANKRUPTCY? RECENT REPO?<br />
              ▸ <span style={{ color: C.ink }}>WE WORK WITH ALL CREDIT SITUATIONS.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 05 · CHARTER (Why) ────────────────────────── */
function Charter() {
  const [ref, seen] = useInView();
  const items = [
    { n: '01', t: '150-Point Inspection',     d: 'Every vehicle passes our certified inspection before it hits the lot. No shortcuts. No exceptions.' },
    { n: '02', t: 'No Hidden Fees — Ever',    d: 'The price you see is the price you pay. No surprise dealer fees, no nickel-and-diming at signing.' },
    { n: '03', t: 'Financing from 2.9% APR',  d: 'Top-tier credit gets top-tier rates. Five lender partners, one quick application.' },
    { n: '04', t: '7-Day Money-Back',         d: 'Drive it. Live with it. If it\'s not right, return it within 7 days. No questions.' },
    { n: '05', t: 'Free CARFAX Report',       d: 'Full vehicle history report on every car, free. No accidents, no surprises.' },
    { n: '06', t: 'We Deliver to Your Door',  d: 'Free home delivery anywhere in South Florida. Hand-shake to handover.' },
  ];

  return (
    <section ref={ref} id="why" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={5} label="THE PRIMO CHARTER" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 56, maxWidth: 700 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>05 / THE CHARTER</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Six promises. <span style={{ color: C.red }}>In writing.</span></h2>
        </div>

        <ol style={{
          listStyle: 'none', padding: 0, margin: 0,
          borderTop: `1px solid ${C.rule}`,
        }}>
          {items.map((it, i) => (
            <li key={it.n} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 2fr 80px',
              alignItems: 'baseline', gap: 24,
              padding: '32px 0', borderBottom: `1px solid ${C.rule}`,
              transition: 'background 180ms',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,178,60,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            className="charter-row"
            >
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56,
                color: C.red, lineHeight: 1, letterSpacing: -2,
              }}>{it.n}</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', lineHeight: 1.1,
              }}>{it.t}</div>
              <div style={{
                fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55,
              }}>{it.d}</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
                }}>★ ARTICLE {it.n}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── 06 · PROCESS ───────────────────────────────── */
function Process() {
  const [ref, seen] = useInView();
  const steps = [
    { t: 'BROWSE',     d: 'Search inventory 24/7. Filter by price, payment, body style, mileage.', meta: 'TIME · 2 MIN' },
    { t: 'QUALIFY',    d: 'Soft credit pre-approval. 60 seconds. No SSN. No impact to your score.', meta: 'TIME · 60 SEC' },
    { t: 'TEST DRIVE', d: 'Pick your slot. We have it detailed and waiting at the door.',          meta: 'TIME · 30 MIN' },
    { t: 'DRIVE HOME', d: 'Same-day pickup or free home delivery anywhere in South Florida.',      meta: 'TIME · SAME DAY' },
  ];
  return (
    <section ref={ref} id="process" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={6} label="PROCESS" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 60, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>06 / PROCESS</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Four steps. <span style={{ color: C.gold }}>Click to keys.</span></h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`, position: 'relative',
        }} className="process-grid">
          {/* horizontal connector with markers */}
          <div className="process-line" style={{
            position: 'absolute', top: 50, left: '6%', right: '6%', height: 1,
            background: `repeating-linear-gradient(90deg, ${C.gold} 0 4px, transparent 4px 12px)`,
            pointerEvents: 'none',
          }} />

          {steps.map((s, i) => (
            <div key={s.t} style={{
              padding: '36px 24px',
              borderRight: i < 3 ? `1px solid ${C.rule}` : 'none',
              position: 'relative', background: C.panel,
            }}>
              {/* step number circle */}
              <div style={{
                width: 44, height: 44,
                background: i === 0 ? C.red : C.bg2,
                border: `1px solid ${i === 0 ? C.red : C.rule2}`,
                color: i === 0 ? C.ink : C.gold,
                display: 'grid', placeItems: 'center',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                marginBottom: 18, position: 'relative', zIndex: 1,
              }}>{i + 1}</div>

              <div style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold,
                marginBottom: 6,
              }}>{s.meta}</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, marginBottom: 10,
              }}>{s.t}</div>
              <div style={{
                fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, lineHeight: 1.55,
              }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 07 · VOICES (Reviews) ─────────────────────── */
function Voices() {
  const [ref, seen] = useInView();
  const REV = [
    { name: 'Marcus J.',  car: '2023 BMW X5',           date: '2026-04-18', text: 'Found my BMW online, got pre-approved in literally 90 seconds, and drove it home the next day. Zero pressure. The CARFAX was clean and the price was already below market.' },
    { name: 'Daniela R.', car: '2022 Mercedes GLE',     date: '2026-04-11', text: 'I was dreading the dealership experience. PRIMO was a different planet. Sam in finance got me 4.1% APR with my 680 score — better than my credit union. They delivered to my house in Coral Gables.' },
    { name: 'Anthony C.', car: '2024 Audi Q5',          date: '2026-04-03', text: 'Test drove three SUVs in one afternoon. No salesperson hovering. Honest answers, transparent pricing. Bought the Q5, took the trade-in offer for my Civic — all-in done in under 3 hours.' },
    { name: 'Priya S.',   car: '2023 Tesla Model Y',    date: '2026-03-28', text: 'Honestly the best used car experience I\'ve had. Inspection report was on the windshield. They even let me bring it to my own mechanic for a second look before signing.' },
    { name: 'Jorge L.',   car: '2022 Cadillac Escalade',date: '2026-03-21', text: 'Hablan español, lo cual fue clave para mi mamá. Trato profesional, sin presión, y el precio fue justo. Recomiendo Primo a cualquier familia latina.' },
  ];

  return (
    <section ref={ref} id="voices" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={7} label="VOICES · 4.9 ★" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 50, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 12,
            }}>07 / VOICES</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
              letterSpacing: '-1.8px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>Real owners. <span style={{ color: C.red }}>Real receipts.</span></h2>
          </div>

          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 16,
            border: `1px solid ${C.rule2}`, padding: '12px 18px',
          }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 38,
              color: C.gold, lineHeight: 1,
            }}>4.9</div>
            <div>
              <div style={{ color: C.gold, letterSpacing: 1 }}>★★★★★</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow }}>847 GOOGLE REVIEWS</div>
            </div>
          </div>
        </div>

        {/* feed — telemetry log style */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="voices-grid">
          {REV.map((r, i) => (
            <article key={i} style={{
              padding: 28,
              borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
              borderBottom: i < REV.length - 2 ? `1px solid ${C.rule}` : 'none',
              background: i % 2 === 0 ? C.panel : C.bg2,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 14,
              }}>
                <div style={{ color: C.gold, fontSize: 12, letterSpacing: 1 }}>★★★★★</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
                }}>{r.date}</div>
              </div>
              <p style={{
                fontFamily: FONT_BODY, color: C.ink, fontSize: 15, lineHeight: 1.55,
                margin: 0, marginBottom: 16,
              }}>"{r.text}"</p>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingTop: 12, borderTop: `1px dashed ${C.rule2}`,
              }}>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                  color: C.ink, letterSpacing: 0.5,
                }}>{r.name}</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.cyan,
                }}>{r.car}</div>
              </div>
            </article>
          ))}
        </div>

        {/* platform tags */}
        <div style={{
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.rule}`,
        }}>
          {['GOOGLE · 4.9', 'YELP · 4.8', 'CARS.COM · 4.9', 'DEALERRATER · 4.9'].map(p => (
            <span key={p} style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
            }}>★ {p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 08 · ALERTS ────────────────────────────────── */
function Alerts() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} id="alerts" style={{
      position: 'relative', padding: '90px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
      backgroundImage: `repeating-linear-gradient(45deg, transparent 0 14px, rgba(226,178,60,0.02) 14px 15px)`,
    }}>
      <VTag num={8} label="LOOP ALERTS" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center',
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }} className="alerts-grid">
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>08 / LOOP ALERTS</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 0.95,
            letterSpacing: '-1.2px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>The car you want — <span style={{ color: C.gold }}>before it's listed.</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55, margin: 0,
          }}>
            Tell us your spec. We'll text you the second it lands at auction or trades in. No spam, no pressure — kill the alert anytime.
          </p>
        </div>

        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`, padding: 24,
        }}>
          <div style={{ display: 'grid', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>EMAIL OR PHONE</div>
              <input type="text" placeholder="you@email.com or (305) 555-0123" style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: `1px solid ${C.rule2}`,
                color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                padding: '6px 0', letterSpacing: 0.5,
              }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>MAKE</div>
                <select style={{
                  width: '100%', appearance: 'none',
                  background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                  padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                }}>
                  <option style={{ background: C.panel }}>ANY MAKE</option>
                  <option style={{ background: C.panel }}>BMW</option>
                  <option style={{ background: C.panel }}>MERCEDES-BENZ</option>
                  <option style={{ background: C.panel }}>AUDI</option>
                  <option style={{ background: C.panel }}>LEXUS</option>
                  <option style={{ background: C.panel }}>TESLA</option>
                </select>
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>BUDGET</div>
                <select style={{
                  width: '100%', appearance: 'none',
                  background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                  padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                }}>
                  <option style={{ background: C.panel }}>ANY</option>
                  <option style={{ background: C.panel }}>UNDER $20K</option>
                  <option style={{ background: C.panel }}>$20K - $40K</option>
                  <option style={{ background: C.panel }}>$40K - $60K</option>
                  <option style={{ background: C.panel }}>OVER $60K</option>
                </select>
              </div>
            </div>
          </div>
          <button style={{
            width: '100%', padding: 14,
            background: C.cyan, color: C.bg, border: 'none', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: 2,
            textTransform: 'uppercase',
          }}>▸ ARM ALERT</button>
        </div>
      </div>
    </section>
  );
}

/* ─── 09 · NOTEBOOK (Blog) ──────────────────────── */
function Notebook() {
  const [ref, seen] = useInView();
  const POSTS = [
    {
      d: '2026-04-22', tag: 'BUYER TIPS', mins: 4,
      t: '5 things to check before buying a used car',
      ex: 'A no-nonsense list — what to inspect, what to ignore, and the one document you should always demand.',
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=85&auto=format,compress',
    },
    {
      d: '2026-04-09', tag: 'TRADE-IN', mins: 5,
      t: 'How to get the best trade-in value',
      ex: 'Three small things you can do today to add $500 to $1,500 to your offer. (Hint: detailing isn\'t one of them.)',
      img: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=900&q=85&auto=format,compress',
    },
    {
      d: '2026-03-30', tag: 'FINANCING', mins: 6,
      t: 'Understanding your credit score for auto financing',
      ex: 'How lenders actually think about credit scores, what tier gets you what rate, and how to bump your score before you apply.',
      img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85&auto=format,compress',
    },
  ];

  return (
    <section ref={ref} id="notebook" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={9} label="NOTEBOOK" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 44, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 12,
            }}>09 / NOTEBOOK</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.92,
              letterSpacing: '-1.5px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>Smarter buyers. <span style={{ color: C.gold }}>Better deals.</span></h2>
          </div>
          <a href="#" style={{
            fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.gold,
            textDecoration: 'none', borderBottom: `1px solid ${C.gold}`,
            paddingBottom: 2,
          }}>ALL ARTICLES →</a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="notebook-grid">
          {POSTS.map((p, i) => (
            <article key={p.t} style={{
              padding: 0, cursor: 'pointer',
              borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
              background: C.panel,
              transition: 'background 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = C.panel}
            >
              <div style={{
                aspectRatio: '16/10',
                background: `url('${p.img}') center/cover`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: C.bg, color: C.gold,
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
                  padding: '4px 10px', border: `1px solid ${C.gold}55`,
                }}>{p.tag}</div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
                  marginBottom: 12,
                }}>
                  <span>{p.d}</span>
                  <span>{p.mins} MIN READ</span>
                </div>
                <h3 style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20,
                  color: C.ink, letterSpacing: -0.3, lineHeight: 1.15,
                  margin: 0, marginBottom: 12,
                }}>{p.t}</h3>
                <p style={{
                  fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13,
                  lineHeight: 1.55, margin: 0, marginBottom: 16,
                }}>{p.ex}</p>
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
                  borderBottom: `1px solid ${C.gold}`, paddingBottom: 2,
                }}>READ →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 10 · CONTACT ──────────────────────────────── */
function Contact() {
  const [ref, seen] = useInView();
  const [driveZip, setDriveZip] = useState('');
  const driveZipValid = /^\d{5}$/.test(driveZip);
  let driveMsg = null, driveTone = C.cyan;
  if (driveZipValid) {
    if (/^33\d{3}$/.test(driveZip)) { driveMsg = "You're about 15-25 minutes away."; driveTone = C.gold; }
    else if (/^34\d{3}$/.test(driveZip)) { driveMsg = 'About 45 minutes — worth the drive!'; driveTone = C.gold; }
    else if (/^3[0-2]\d{3}$/.test(driveZip)) { driveMsg = 'We deliver statewide! Schedule delivery in any vehicle drawer.'; driveTone = C.cyan; }
    else { driveMsg = 'We ship nationwide! Call for a quote.'; driveTone = C.red; }
  }
  return (
    <section ref={ref} id="contact" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={10} label="CONTACT · MIA" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>10 / CONTACT</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Drop in. <span style={{ color: C.red }}>We're here.</span></h2>
          <span style={{
            display: 'inline-block', padding: '6px 14px',
            border: `1px solid ${C.gold}`,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
            fontWeight: 700,
          }}>★ HABLAMOS ESPAÑOL</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="contact-split">
          {/* left: location & map */}
          <div style={{ borderRight: `1px solid ${C.rule}` }}>
            {/* fake map */}
            <div style={{
              aspectRatio: '16/10', position: 'relative',
              background: `radial-gradient(ellipse at 60% 50%, #1a2030 0%, ${C.bg2} 80%)`,
              backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <line x1="0" y1="40%" x2="100%" y2="55%" stroke={`${C.gold}44`} strokeWidth="2" />
                <line x1="30%" y1="0" x2="40%" y2="100%" stroke={`${C.gold}44`} strokeWidth="2" />
                <line x1="0" y1="80%" x2="100%" y2="70%" stroke={`${C.gold}22`} strokeWidth="1" />
              </svg>
              {/* pin */}
              <div style={{
                position: 'absolute', top: '46%', left: '54%',
                transform: 'translate(-50%, -100%)',
              }}>
                <div style={{
                  width: 16, height: 16, background: C.red, borderRadius: '50%',
                  border: `3px solid ${C.gold}`,
                  boxShadow: `0 0 0 8px ${C.red}33`,
                  animation: 'pinPulse 2s ease-in-out infinite',
                }} />
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow,
                marginBottom: 8,
              }}>SHOWROOM</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, marginBottom: 16,
              }}>123 BISCAYNE BLVD<br />MIAMI, FL 33132</div>

              <div style={{ display: 'grid', gap: 14, paddingTop: 18, borderTop: `1px solid ${C.rule}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>HOTLINE</span>
                  <a href="tel:3055550199" style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, textDecoration: 'none', letterSpacing: 0.5 }}>(305) 555-0199</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>MON–SAT</span>
                  <span style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>9 AM – 8 PM</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>SUNDAY</span>
                  <span style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>10 AM – 6 PM</span>
                </div>
              </div>

              {/* drive-time estimator */}
              <div style={{
                marginTop: 22, padding: 14,
                background: C.bg, border: `1px dashed ${C.rule2}`,
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  HOW FAR ARE YOU?
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text" placeholder="YOUR ZIP" maxLength={5}
                    value={driveZip}
                    onChange={e => setDriveZip(e.target.value.replace(/\D/g, ''))}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                      padding: '8px 4px', letterSpacing: 2,
                    }}
                  />
                </div>
                {driveMsg && (
                  <div style={{
                    marginTop: 10, padding: '8px 10px',
                    background: `${driveTone}15`, border: `1px solid ${driveTone}55`,
                    fontFamily: FONT_MONO, fontSize: 11, color: driveTone, lineHeight: 1.5,
                    fontWeight: 700, letterSpacing: 0.3,
                  }}>▸ {driveMsg}</div>
                )}
              </div>

              <a
                href={driveZipValid
                  ? `https://maps.google.com/?saddr=${driveZip}&daddr=123+Biscayne+Blvd+Miami+FL+33132`
                  : 'https://maps.google.com/?daddr=123+Biscayne+Blvd+Miami+FL+33132'}
                target="_blank" rel="noreferrer"
                style={{
                marginTop: 16, display: 'inline-block',
                padding: '12px 22px', background: 'transparent', color: C.gold,
                border: `1px solid ${C.gold}`,
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, fontWeight: 700,
                textDecoration: 'none', textTransform: 'uppercase',
              }}>↗ GET DIRECTIONS</a>
            </div>
          </div>

          {/* right: contact form */}
          <div style={{ padding: 32, background: C.bg2 }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
              marginBottom: 8,
            }}>SEND A MESSAGE</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, marginBottom: 24,
            }}>WE REPLY WITHIN THE HOUR.</div>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { lab: 'NAME',     t: 'text',     ph: 'YOUR NAME' },
                { lab: 'PHONE',    t: 'tel',      ph: '(305) 555-0123' },
                { lab: 'EMAIL',    t: 'email',    ph: 'YOU@EMAIL.COM' },
                { lab: 'MESSAGE',  t: 'textarea', ph: 'WHAT CAN WE HELP YOU FIND?' },
              ].map(f => (
                <div key={f.lab}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{f.lab}</div>
                  {f.t === 'textarea' ? (
                    <textarea placeholder={f.ph} rows={4} style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                      padding: '6px 0', resize: 'vertical',
                    }} />
                  ) : (
                    <input type={f.t} placeholder={f.ph} style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                      padding: '6px 0', letterSpacing: 0.5,
                    }} />
                  )}
                </div>
              ))}
              <button style={{
                marginTop: 8, padding: 16,
                background: C.red, color: C.ink, border: 'none', cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
                textTransform: 'uppercase',
              }}>▸ TRANSMIT</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      background: '#040406', borderTop: `1px solid ${C.rule}`,
      padding: '48px 48px 24px 96px',
    }}>
      {/* big PRIMO type */}
      <div aria-hidden style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700,
        fontSize: 'clamp(4rem, 12vw, 9rem)',
        lineHeight: 0.85, letterSpacing: '-4px',
        color: 'transparent', WebkitTextStroke: `1px ${C.rule2}`,
        textTransform: 'uppercase', marginBottom: 36,
      }}>PRIMO AUTO MIA</div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36,
        marginBottom: 40, paddingTop: 36, borderTop: `1px solid ${C.rule}`,
      }} className="footer-grid">
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5, color: C.gold,
            marginBottom: 10,
          }}>★ MIAMI · GROUP · 2026</div>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, lineHeight: 1.55,
            marginTop: 0, marginBottom: 18,
          }}>
            Miami's most-trusted source for premium pre-owned vehicles.
            Real prices. Real inspection. Real talk.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {['FB', 'IG', 'TT', 'YT', 'X'].map(s => (
              <a key={s} href="#" style={{
                width: 32, height: 32, border: `1px solid ${C.rule2}`,
                color: C.inkDim, display: 'grid', placeItems: 'center',
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                textDecoration: 'none', transition: 'all 180ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.inkDim; e.currentTarget.style.borderColor = C.rule2; }}
              >{s}</a>
            ))}
          </div>
        </div>

        {[
          ['EXPLORE', ['Inventory', 'New Arrivals', 'Featured Deals', 'Specials', 'Service']],
          ['BUYING',  ['Pre-Approval', 'Trade-In', 'Payment Calc', 'Warranty', 'How It Works']],
          ['COMPANY', ['About', 'Reviews', 'Contact', 'Careers', 'Notebook']],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5, color: C.gold,
              marginBottom: 14,
            }}>{h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {items.map(l => (
                <li key={l}><a href="#" style={{
                  fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, textDecoration: 'none',
                  transition: 'color 180ms',
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.inkDim}
                >{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* legal strip */}
      <div style={{
        paddingTop: 22, borderTop: `1px solid ${C.rule}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 14,
        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
      }}>
        <div>© {new Date().getFullYear()} PRIMO AUTO GROUP · ALL RIGHTS RESERVED</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['PRIVACY POLICY', 'TERMS', 'ACCESSIBILITY', 'SITEMAP'].map(l => (
            <a key={l} href="#" style={{ color: C.inkLow, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </div>

      {/* powered by */}
      <div style={{
        marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.rule}`,
        textAlign: 'center', fontFamily: FONT_MONO, fontSize: 11, color: C.inkLow,
        letterSpacing: 1.5,
      }}>
        WEBSITE BY{' '}
        <a href="https://aiandwebservices.com" target="_blank" rel="noreferrer" style={{
          color: C.gold, textDecoration: 'none', fontWeight: 700,
        }}>AIANDWEBSERVICES</a>
        {' '}— MIAMI'S #1 AUTO DEALER WEBSITE BUILDER
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════
   NEW LAYER · ADDITIONS
   Chat · Compare · Saved · Build Deal · Counters · RecentlyViewed
   WhyPreOwned · BeatPrice · TextUs · QR
═══════════════════════════════════════════════════════════════ */

/* ─── QR placeholder (deterministic SVG grid) ──────── */
function QRBlock({ seed = 'P0000', size = 132 }) {
  const grid = useMemo(() => {
    // simple hash from seed
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff;
    const N = 21;
    const cells = [];
    for (let i = 0; i < N * N; i++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      cells.push((h >> 8) & 1);
    }
    return { N, cells };
  }, [seed]);
  const { N, cells } = grid;
  const cell = size / N;

  // mark finder squares (TL, TR, BL) — fixed pattern
  const isFinder = (r, c) => {
    const inSq = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    if (inSq(0, 0) || inSq(0, N - 7) || inSq(N - 7, 0)) {
      const local = (r % 7 < 1 || r % 7 > 5 || c % 7 < 1 || c % 7 > 5);
      const innerSq = (r0, c0) => r >= r0 + 2 && r < r0 + 5 && c >= c0 + 2 && c < c0 + 5;
      if (innerSq(0, 0) || innerSq(0, N - 7) || innerSq(N - 7, 0)) return true;
      return local;
    }
    return null;
  };

  return (
    <div style={{
      width: size, height: size, padding: 6, background: '#FFF',
      border: `1px solid ${C.gold}`,
    }}>
      <svg width={size - 12} height={size - 12} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const f = isFinder(r, c);
            const fill = f === true ? '#000' : f === false ? '#FFF' : (cells[r * N + c] ? '#000' : '#FFF');
            return <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fill} />;
          })
        )}
      </svg>
    </div>
  );
}

/* ─── TextUs floating button (left edge) ───────────── */
function TextUsButton() {
  return (
    <a
      href="sms:3055550199?&body=Hi, I'm interested in a vehicle at Primo Auto Group"
      className="textus-btn"
      style={{
        position: 'fixed', left: 96, top: '50%',
        transform: 'translateY(-50%)', zIndex: 35,
        background: C.gold, color: '#08080A',
        textDecoration: 'none', cursor: 'pointer',
        padding: '14px 10px', writingMode: 'vertical-rl',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: 2,
        textTransform: 'uppercase',
        clipPath: 'polygon(0 0, 100% 8px, 100% calc(100% - 8px), 0 100%)',
        boxShadow: `4px 0 14px rgba(0,0,0,0.4), inset -1px 0 0 ${C.gold}`,
        transition: 'background 180ms, transform 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F4D77E'; e.currentTarget.style.transform = 'translateY(-50%) translateX(2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'translateY(-50%)'; }}
    >📱 Text Us</a>
  );
}

/* ─── Beat Any Price floating badge (right side) ──── */
function BeatPriceBadge({ onClick }) {
  return (
    <button onClick={onClick} className="beat-badge" style={{
      position: 'fixed', right: 0, bottom: 220, zIndex: 36,
      background: C.red, color: '#FFFFFF',
      border: `2px solid ${C.gold}`, borderRight: 'none', cursor: 'pointer',
      padding: '14px 18px', textAlign: 'left', maxWidth: 220,
      fontFamily: FONT_DISPLAY, fontWeight: 700,
      boxShadow: `0 8px 30px rgba(184,18,28,0.5), 0 0 22px ${C.red}30`,
      transition: 'transform 200ms',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-4px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
    >
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold, marginBottom: 4 }}>
        ★ PRICE-MATCH
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.2, letterSpacing: -0.3, textTransform: 'uppercase' }}>
        Found it cheaper?<br />
        <span style={{ color: C.gold }}>We beat by $500.</span>
      </div>
    </button>
  );
}

/* ─── Beat Price Modal ─────────────────────────────── */
function BeatPriceModal({ onClose }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 240); };

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 110,
      background: open ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(8px)' : 'none',
      transition: 'all 240ms',
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(540px, 100%)', maxHeight: '90vh', overflowY: 'auto',
        background: C.bg, border: `1px solid ${C.gold}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.gold}25`,
        opacity: open ? 1 : 0,
        transform: open ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold }}>
              ★ PRICE-MATCH GUARANTEE
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 4,
            }}>We'll beat any price by $500</div>
          </div>
          <button onClick={close} style={{
            width: 36, height: 36, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>
        {submitted ? (
          <div style={{ padding: 36, textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: `${C.gold}22`, border: `2px solid ${C.gold}`,
              display: 'grid', placeItems: 'center', margin: '0 auto 18px',
              color: C.gold, fontSize: 28,
            }}>✓</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, marginBottom: 8,
            }}>Match request received.</div>
            <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55 }}>
              We'll review and respond <strong style={{ color: C.ink }}>within 2 hours</strong> with our best price.
            </div>
            <div style={{
              marginTop: 16, padding: '12px 16px',
              background: `${C.gold}15`, border: `1px dashed ${C.gold}`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.gold, fontWeight: 700, lineHeight: 1.6,
            }}>★ We beat competitors by $500 — or your first oil change is free.</div>
          </div>
        ) : (
          <div style={{ padding: 24, display: 'grid', gap: 14 }}>
            {[
              { lab: 'COMPETITOR DEALER', t: 'text', ph: 'Joe\'s Used Cars' },
              { lab: 'COMPETITOR PRICE',  t: 'text', ph: '$38,500' },
              { lab: 'LINK TO LISTING',   t: 'url',  ph: 'https://...' },
              { lab: 'YOUR NAME',         t: 'text', ph: 'Jane Doe' },
              { lab: 'PHONE',             t: 'tel',  ph: '(305) 555-0123' },
            ].map(f => (
              <div key={f.lab}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{f.lab}</div>
                <input type={f.t} placeholder={f.ph} style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                  padding: '6px 0', letterSpacing: 0.5,
                }} />
              </div>
            ))}
            <button onClick={() => setSubmitted(true)} style={{
              marginTop: 8, padding: 16, background: C.gold, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
              textTransform: 'uppercase',
            }}>▸ Submit Price Match</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── AI Chat Widget ───────────────────────────────── */
function AIChatWidget({ open, onToggle }) {
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'Hi! I can help you find the right car, check financing, or schedule a test drive. What are you looking for?' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const reply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('suv') && (lower.includes('40') || lower.includes('under'))) {
      return "Yes! We have 3 SUVs under $40K — the 2021 Lexus RX at $31,995, the 2023 Tesla Model Y at $36,500, and the 2022 Mercedes GLE on sale at $38,750. Want to schedule a test drive?";
    }
    if (lower.includes('rate') || lower.includes('financ') || lower.includes('credit')) {
      return "Pre-approval is 60 seconds, soft pull only — no impact to your score. APRs start at 2.9% for top-tier credit, and we work with all credit situations down to rebuilding. Want me to start your application?";
    }
    if (lower.includes('test drive') || lower.includes('schedule') || lower.includes('appointment')) {
      return "Easy. Pick a slot Monday–Saturday 9–8 or Sunday 10–6. The car will be detailed and ready when you arrive. Which vehicle, and what time works?";
    }
    if (lower.includes('trade')) {
      return "Drop your year, make, model and mileage and I'll pull a live wholesale-auction range in 60 seconds. We honor most quotes for 7 days.";
    }
    return "I can help with inventory, financing, trade-in values, or test-drive scheduling. Want me to send you to a human in 60 seconds?";
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { from: 'user', text }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { from: 'bot', text: reply(text) }]), 700);
  };

  const quickReplies = ['Browse SUVs', 'Check My Rate', 'Schedule Test Drive'];

  return (
    <>
      {/* bubble */}
      <button onClick={onToggle} className="chat-bubble" style={{
        position: 'fixed', right: 24, bottom: 24, zIndex: 50,
        width: 60, height: 60,
        background: C.gold, color: '#08080A',
        border: `2px solid ${C.gold}`, cursor: 'pointer',
        clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
        display: 'grid', placeItems: 'center',
        fontSize: 26, fontWeight: 800,
        boxShadow: `0 8px 30px ${C.gold}55, 0 0 24px ${C.gold}40`,
        transition: 'transform 200ms',
      }}>
        <span style={{ marginTop: 4 }}>{open ? '×' : '◴'}</span>
        {!open && (
          <span aria-hidden style={{
            position: 'absolute', inset: -3,
            clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
            border: `2px solid ${C.gold}`,
            animation: 'chatPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      {/* panel */}
      {open && (
        <div className="chat-panel" style={{
          position: 'fixed', right: 24, bottom: 100, zIndex: 49,
          width: 360, maxWidth: 'calc(100vw - 48px)',
          height: 540, maxHeight: 'calc(100vh - 140px)',
          background: 'var(--c-glass)', backdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${C.gold}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.gold}30`,
          display: 'flex', flexDirection: 'column',
          animation: 'chatSlide 240ms cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          {/* header */}
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.rule}`,
            display: 'flex', alignItems: 'center', gap: 10,
            background: C.bg2,
          }}>
            <div style={{
              width: 32, height: 32,
              background: C.red,
              clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
              display: 'grid', placeItems: 'center',
              color: '#FFF', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
            }}>P</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                color: C.ink, letterSpacing: 0.3,
              }}>PRIMO BOT</div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.cyan,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: C.cyan,
                  boxShadow: `0 0 6px ${C.cyan}`,
                }} />
                ONLINE · POWERED BY AI · 24/7
              </div>
            </div>
            <button onClick={onToggle} style={{
              width: 26, height: 26, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontSize: 12,
            }}>−</button>
          </div>

          {/* messages */}
          <div ref={listRef} style={{
            flex: 1, padding: 16, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                background: m.from === 'user' ? C.gold : C.panel,
                color: m.from === 'user' ? '#08080A' : C.ink,
                border: m.from === 'user' ? 'none' : `1px solid ${C.rule}`,
                fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.5,
              }}>{m.text}</div>
            ))}
          </div>

          {/* quick replies */}
          {msgs.length < 3 && (
            <div style={{
              padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {quickReplies.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'transparent', border: `1px solid ${C.cyan}55`,
                  color: C.cyan, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1,
                  padding: '6px 10px', cursor: 'pointer', fontWeight: 600,
                }}>+ {q}</button>
              ))}
            </div>
          )}

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} style={{
            padding: 14, borderTop: `1px solid ${C.rule}`,
            display: 'flex', gap: 8, background: C.bg2,
          }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..." style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: `1px solid ${C.rule2}`,
                color: C.ink, fontFamily: FONT_BODY, fontSize: 13,
                padding: '6px 4px',
              }}
            />
            <button type="submit" style={{
              background: C.gold, color: '#08080A', border: 'none', cursor: 'pointer',
              padding: '6px 14px', fontFamily: FONT_MONO, fontSize: 11,
              letterSpacing: 1.5, fontWeight: 700,
            }}>SEND ▸</button>
          </form>
        </div>
      )}
    </>
  );
}

/* ─── Compare Modal ────────────────────────────────── */
function CompareModal({ onClose, initialIds = [] }) {
  const [open, setOpen] = useState(false);
  const [picks, setPicks] = useState(() => {
    const seed = initialIds.slice(0, 3);
    while (seed.length < 2) {
      const next = FLEET.find(f => !seed.includes(f.id));
      if (next) seed.push(next.id); else break;
    }
    return seed;
  });
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 240); };

  const vehicles = picks.map(id => FLEET.find(f => f.id === id)).filter(Boolean);

  const setSlot = (i, id) => {
    setPicks(p => { const n = [...p]; n[i] = id; return n; });
  };
  const addSlot = () => { if (picks.length < 3) {
    const next = FLEET.find(f => !picks.includes(f.id));
    if (next) setPicks([...picks, next.id]);
  }};
  const removeSlot = (i) => setPicks(p => p.filter((_, idx) => idx !== i));

  // determine winner per row (lowest = best for price/miles, highest = best for year/mpg/hp, fastest = best for sec)
  const winners = useMemo(() => {
    if (vehicles.length < 2) return {};
    const w = {};
    const min = (key) => vehicles.reduce((b, v) => v[key] < b[key] ? v : b, vehicles[0]).id;
    const max = (key) => vehicles.reduce((b, v) => v[key] > b[key] ? v : b, vehicles[0]).id;
    w.price   = min('price');
    w.monthly = min('price'); // monthly tracks price
    w.mi      = min('mi');
    w.y       = max('y');
    w.hp      = max('hp');
    w.mpg     = max('mpg');
    w.sec     = vehicles.reduce((b, v) => parseFloat(v.sec) < parseFloat(b.sec) ? v : b, vehicles[0]).id;
    return w;
  }, [vehicles]);

  const rows = [
    ['STICKER',     v => fmt(v.price),                    'price'],
    ['EST. MO.',    v => fmt(monthlyPayment(v.price)) + '/mo', 'monthly'],
    ['MILEAGE',     v => fmtMi(v.mi) + ' mi',             'mi'],
    ['YEAR',        v => v.y.toString(),                  'y'],
    ['BODY',        v => v.body,                          null],
    ['ENGINE',      v => v.eng,                           null],
    ['HORSEPOWER',  v => v.hp + ' HP',                    'hp'],
    ['0–60',        v => v.sec + 's',                     'sec'],
    ['MPG',         v => v.mpg.toString(),                'mpg'],
    ['TRANSMISSION',v => v.tx,                            null],
    ['DRIVETRAIN',  v => v.dr,                            null],
  ];

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 105,
      background: open ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(8px)' : 'none',
      transition: 'all 240ms',
      display: 'grid', placeItems: 'center', padding: 24, overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(1080px, 100%)', maxHeight: '92vh', overflowY: 'auto',
        background: C.bg, border: `1px solid ${C.cyan}55`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.cyan}25`,
        opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 28px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.cyan }}>
              ⇄ COMPARISON BENCH
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 4,
            }}>Side-by-Side · {vehicles.length} Vehicles</div>
          </div>
          <button onClick={close} style={{
            width: 38, height: 38, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* selector row */}
        <div style={{
          padding: 20, display: 'grid',
          gridTemplateColumns: `170px repeat(${vehicles.length}, 1fr) ${picks.length < 3 ? 'auto' : ''}`,
          gap: 0,
        }}>
          <div></div>
          {vehicles.map((v, i) => (
            <div key={i} style={{
              padding: '0 12px', borderRight: i < vehicles.length - 1 ? `1px solid ${C.rule}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                aspectRatio: '16/10',
                background: `url('${v.img}') center/cover`,
                border: `1px solid ${C.rule}`,
              }} />
              <select value={v.id} onChange={e => setSlot(i, e.target.value)} style={{
                appearance: 'none', background: C.panel, border: `1px solid ${C.rule2}`,
                color: C.ink, fontFamily: FONT_MONO, fontSize: 11, padding: '8px 10px',
                cursor: 'pointer', letterSpacing: 0.5,
              }}>
                {FLEET.map(f => (
                  <option key={f.id} value={f.id} style={{ background: C.panel }}>
                    {f.y} {f.mk} {f.md}
                  </option>
                ))}
              </select>
              {vehicles.length > 2 && (
                <button onClick={() => removeSlot(i)} style={{
                  background: 'transparent', color: C.inkDim,
                  border: `1px solid ${C.rule2}`, padding: '4px 8px', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1,
                }}>− REMOVE</button>
              )}
            </div>
          ))}
          {picks.length < 3 && (
            <button onClick={addSlot} style={{
              alignSelf: 'center', minWidth: 120,
              background: 'transparent', color: C.cyan,
              border: `1px dashed ${C.cyan}55`, padding: '12px',
              cursor: 'pointer', fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
              fontWeight: 700,
            }}>+ ADD VEHICLE</button>
          )}
        </div>

        {/* spec table */}
        <div style={{
          borderTop: `1px solid ${C.rule}`,
        }}>
          {rows.map(([lab, render, key], rIdx) => (
            <div key={lab} style={{
              display: 'grid',
              gridTemplateColumns: `170px repeat(${vehicles.length}, 1fr)`,
              borderBottom: `1px solid ${C.rule}`,
              background: rIdx % 2 === 0 ? C.bg : C.bg2,
            }}>
              <div style={{
                padding: '14px 20px',
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
                fontWeight: 600, borderRight: `1px solid ${C.rule}`,
              }}>{lab}</div>
              {vehicles.map((v, i) => {
                const isWinner = key && winners[key] === v.id;
                return (
                  <div key={i} style={{
                    padding: '14px 20px',
                    borderRight: i < vehicles.length - 1 ? `1px solid ${C.rule}` : 'none',
                    background: isWinner ? `${C.gold}15` : 'transparent',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                    color: isWinner ? C.gold : C.ink,
                    letterSpacing: 0.3,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {render(v)}
                    {isWinner && (
                      <span style={{
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.gold,
                      }}>★ BEST</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          padding: 24, background: C.bg2, borderTop: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 14,
        }}>
          <div style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13,
          }}>Can't decide? Test-drive both — schedule both back-to-back in 30 minutes.</div>
          <button style={{
            padding: '14px 24px', background: C.gold, color: '#08080A',
            border: 'none', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>▸ Schedule Both Drives</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Saved Panel (slide-out from right) ──────────── */
function SavedPanel({ saved, onClose, onToggleSave, onView, onCompare }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 280); };

  const items = FLEET.filter(v => saved.has(v.id));

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: open ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(4px)' : 'none',
      transition: 'all 280ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: 'min(440px, 100%)', background: C.bg,
        borderLeft: `1px solid ${C.gold}`,
        transform: open ? 'translateX(0)' : 'translateX(40px)',
        opacity: open ? 1 : 0,
        transition: 'all 280ms cubic-bezier(0.2,0.8,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold }}>
              ♥ SAVED VEHICLES
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>{items.length} {items.length === 1 ? 'Vehicle' : 'Vehicles'}</div>
          </div>
          <button onClick={close} style={{
            width: 36, height: 36, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {items.length === 0 ? (
            <div style={{
              padding: 40, textAlign: 'center', color: C.inkDim,
              fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.55,
            }}>
              <div style={{ fontSize: 32, color: C.gold, marginBottom: 12 }}>♡</div>
              No saved vehicles yet.<br />
              Tap the heart on any car to save it here.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map(v => (
                <div key={v.id} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr',
                  gap: 12, background: C.panel, border: `1px solid ${C.rule}`,
                }}>
                  <div style={{
                    aspectRatio: '4/3',
                    background: `url('${v.img}') center/cover`,
                  }} />
                  <div style={{ padding: '10px 10px 10px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow }}>
                      {v.id} · {v.y}
                    </div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                      color: C.ink, letterSpacing: -0.2, lineHeight: 1.1,
                    }}>{v.mk} {v.md}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: C.gold,
                    }}>{fmt(v.price)}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
                      <button onClick={() => { close(); setTimeout(() => onView(v), 320); }} style={{
                        flex: 1, padding: '6px 8px', background: C.gold, color: '#08080A',
                        border: 'none', cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                      }}>VIEW</button>
                      <button onClick={() => onToggleSave(v.id)} style={{
                        padding: '6px 8px', background: 'transparent', color: C.inkDim,
                        border: `1px solid ${C.rule2}`, cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                      }}>REMOVE</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer CTA */}
        {items.length >= 2 && (
          <div style={{
            padding: 20, borderTop: `1px solid ${C.rule}`, background: C.bg2,
          }}>
            <button onClick={onCompare} style={{
              width: '100%', padding: 14, background: C.cyan, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>⇄ Compare Saved Vehicles</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── BUILD YOUR DEAL — 5-step wizard ────────────── */
function DealWizard({ vehicle, onClose }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  // step 2 — trade
  const [hasTrade, setHasTrade] = useState(null); // null = unset, true/false
  const [tradeYear, setTradeYear] = useState('2020');
  const [tradeMake, setTradeMake] = useState('Toyota');
  const [tradeModel, setTradeModel] = useState('Camry');
  const [tradeMiles, setTradeMiles] = useState('30K-60K');
  const [tradeCondition, setTradeCondition] = useState('Good');
  // step 3 — financing
  const [down, setDown] = useState(2500);
  const [term, setTerm] = useState(60);
  const [credit, setCredit] = useState('Excellent');
  // step 4 — F&I add-ons
  const [addons, setAddons] = useState({ extWarranty: false, paint: false, tint: false, gap: false });
  // step 6 — submit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 260); };

  const tradeRanges = {
    Excellent: [14000, 16000],
    Good:      [11000, 13000],
    Fair:      [7500, 9500],
    Poor:      [3500, 5000],
  };
  const aprMap = { Excellent: 3.9, Good: 5.9, Fair: 8.9, Rebuilding: 12.9 };
  const apr = aprMap[credit];

  // F&I add-ons — one-time price + per-month figure
  const ADDONS = [
    { key: 'extWarranty', name: 'Extended Warranty',     price: 1200, mo: 22, desc: 'Bumper-to-bumper coverage up to 100,000 miles.' },
    { key: 'paint',       name: 'Paint Protection Film', price: 599,  mo: 11, desc: 'Invisible shield against chips, scratches, and UV damage.' },
    { key: 'tint',        name: 'Window Tint',           price: 299,  mo: 5,  desc: 'Premium ceramic — blocks 99% UV, keeps interior cool.' },
    { key: 'gap',         name: 'GAP Insurance',         price: 495,  mo: 9,  desc: 'Covers the gap between your loan balance and vehicle value.' },
  ];
  const selectedAddons = ADDONS.filter(a => addons[a.key]);
  const addonsMonthly = selectedAddons.reduce((s, a) => s + a.mo, 0);

  const tradeCredit = hasTrade ? Math.round((tradeRanges[tradeCondition][0] + tradeRanges[tradeCondition][1]) / 2) : 0;
  const tax = vehicle.price * 0.06;
  const docFee = 499;
  const subtotal = vehicle.price + tax + docFee - tradeCredit;
  const financed = Math.max(0, subtotal - down);
  const baseMonthly = monthlyPayment(financed, 0, term, apr);
  const monthly = baseMonthly + addonsMonthly;

  const stepLabels = ['VEHICLE', 'TRADE-IN', 'FINANCING', 'PROTECT', 'SUMMARY', 'SUBMIT'];
  const TOTAL_STEPS = stepLabels.length;

  const next = () => setStep(s => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 115,
      background: open ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(10px)' : 'none',
      transition: 'all 260ms',
      display: 'grid', placeItems: 'start center', padding: '24px',
      overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(820px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: C.bg, border: `1px solid ${C.gold}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${C.gold}30`,
        opacity: open ? 1 : 0, transform: open ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 260ms cubic-bezier(0.2,0.8,0.2,1)',
        display: 'flex', flexDirection: 'column',
        marginTop: 24, marginBottom: 24,
      }}>
        {/* header */}
        <div style={{
          padding: '18px 28px', borderBottom: `1px solid ${C.rule}`,
          background: C.bg2,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold }}>
                ★ BUILD YOUR DEAL · STEP {step}/{TOTAL_STEPS}
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
              }}>{stepLabels[step - 1]}</div>
            </div>
            <button onClick={close} style={{
              width: 38, height: 38, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 16,
            }}>✕</button>
          </div>
          {/* progress bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)`, gap: 4,
          }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{
                height: 4,
                background: i + 1 <= step ? C.gold : C.rule,
                transition: 'background 240ms',
              }} />
            ))}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)`, gap: 4,
            marginTop: 6,
          }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5,
                color: i + 1 <= step ? C.gold : C.inkLow,
                fontWeight: 600, textAlign: 'center',
              }}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* content area */}
        <div style={{ padding: 28, flex: 1, overflowY: 'auto', minHeight: 380 }}>
          {/* STEP 1 — vehicle */}
          {step === 1 && (
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
                alignItems: 'center', marginBottom: 20,
              }}>
                <div style={{
                  aspectRatio: '16/10',
                  background: `url('${vehicle.img}') center/cover`,
                  border: `1px solid ${C.rule}`,
                }} />
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold, marginBottom: 6 }}>
                    STOCK · {vehicle.id}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28,
                    color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', lineHeight: 1.05,
                    marginBottom: 8,
                  }}>{vehicle.y} {vehicle.mk} {vehicle.md}</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, marginBottom: 14 }}>
                    {vehicle.trim}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36,
                    color: C.gold, lineHeight: 1,
                  }}>{fmt(vehicle.price)}</div>
                </div>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
                border: `1px solid ${C.rule}`,
              }}>
                {[
                  ['MILES',   fmtMi(vehicle.mi)],
                  ['HP',      vehicle.hp],
                  ['0-60',    `${vehicle.sec}s`],
                  ['MPG',     vehicle.mpg],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '14px 16px',
                    borderRight: i < 3 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.cyan }}>{val}</div>
                  </div>
                ))}
              </div>
              <p style={{
                fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginTop: 20, lineHeight: 1.55,
              }}>
                You're building a deal on this vehicle. Next, we'll factor in your trade-in (if any), then build your financing plan.
              </p>
            </div>
          )}

          {/* STEP 2 — trade */}
          {step === 2 && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, marginBottom: 6, textTransform: 'uppercase',
              }}>Have a trade-in?</div>
              <p style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 18 }}>
                Trade credit applies directly against your purchase price. Skip if you don't have one.
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                {[['yes', true, 'YES, I HAVE A TRADE'], ['no', false, 'NO TRADE-IN']].map(([k, v, l]) => (
                  <button key={k} onClick={() => setHasTrade(v)} style={{
                    flex: 1, padding: '14px 16px',
                    background: hasTrade === v ? C.gold : 'transparent',
                    color: hasTrade === v ? '#08080A' : C.ink,
                    border: `1px solid ${hasTrade === v ? C.gold : C.rule2}`,
                    cursor: 'pointer',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>

              {hasTrade === true && (
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                  background: C.bg2, border: `1px solid ${C.rule}`, padding: 20,
                }}>
                  {[
                    ['YEAR', tradeYear, setTradeYear, ['2024', '2023', '2022', '2021', '2020', '2019', 'OLDER']],
                    ['MAKE', tradeMake, setTradeMake, ['Toyota', 'Honda', 'Ford', 'Chevy', 'Nissan', 'Other']],
                    ['MODEL', tradeModel, setTradeModel, ['Camry', 'Civic', 'F-150', 'Other']],
                    ['MILEAGE', tradeMiles, setTradeMiles, ['<30K', '30K-60K', '60K-100K', '>100K']],
                  ].map(([lab, val, setter, opts]) => (
                    <div key={lab}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                      <select value={val} onChange={e => setter(e.target.value)} style={{
                        width: '100%', appearance: 'none', background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                        padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                      }}>{opts.map(o => <option key={o} style={{ background: C.panel }}>{o}</option>)}</select>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>CONDITION</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                      {Object.keys(tradeRanges).map(c => (
                        <button key={c} onClick={() => setTradeCondition(c)} style={{
                          padding: '10px 0',
                          background: tradeCondition === c ? C.gold : 'transparent',
                          color: tradeCondition === c ? '#08080A' : C.ink,
                          border: `1px solid ${tradeCondition === c ? C.gold : C.rule2}`,
                          cursor: 'pointer',
                          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
                        }}>{c.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    gridColumn: '1 / -1', marginTop: 8, padding: 16,
                    background: C.bg, border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 4 }}>
                      EST. TRADE VALUE · {tradeCondition.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: C.gold, lineHeight: 1,
                    }}>${tradeRanges[tradeCondition][0].toLocaleString()} – ${tradeRanges[tradeCondition][1].toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — financing */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  FINANCING PLAN
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink,
                  letterSpacing: -0.3, textTransform: 'uppercase',
                }}>Build your monthly payment.</div>
              </div>

              {/* down */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                }}>
                  <span style={{ color: C.inkDim }}>DOWN PAYMENT</span>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{fmt(down)}</span>
                </div>
                <input type="range" min={0} max={20000} step={500} value={down}
                  onChange={e => setDown(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: C.gold }} />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2,
                }}>
                  <span>$0</span><span>$20,000</span>
                </div>
              </div>

              {/* term */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim, marginBottom: 8 }}>TERM</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${C.rule2}` }}>
                  {[36, 48, 60, 72].map((tt, i) => (
                    <button key={tt} onClick={() => setTerm(tt)} style={{
                      padding: '12px 0', cursor: 'pointer',
                      background: term === tt ? C.gold : 'transparent',
                      color: term === tt ? '#08080A' : C.inkDim,
                      border: 'none', borderRight: i < 3 ? `1px solid ${C.rule2}` : 'none',
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>{tt} MO</button>
                  ))}
                </div>
              </div>

              {/* credit band */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim, marginBottom: 8 }}>CREDIT BAND</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {Object.keys(aprMap).map(k => (
                    <button key={k} onClick={() => setCredit(k)} style={{
                      padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                      background: credit === k ? C.gold : 'transparent',
                      color: credit === k ? '#08080A' : C.ink,
                      border: `1px solid ${credit === k ? C.gold : C.rule2}`,
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>
                      <div>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 16, marginTop: 2 }}>{aprMap[k]}% APR</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* live readout */}
              <div style={{
                padding: '20px 24px', background: C.panel,
                border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>EST. MONTHLY</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 42, color: C.gold, lineHeight: 1,
                  }}>{fmt(monthly)}<span style={{ fontSize: 16, color: C.inkLow }}>/mo</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>FINANCED</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>{fmt(financed)}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2 }}>@ {apr}% · {term}mo</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — PROTECT YOUR INVESTMENT */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  F&I PROTECTION PACKAGE
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink,
                  letterSpacing: -0.3, textTransform: 'uppercase',
                }}>Protect your investment.</div>
                <p style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginTop: 8, marginBottom: 0, lineHeight: 1.55 }}>
                  Optional add-ons — keep what you want, skip what you don't. Your monthly recalculates instantly.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                {ADDONS.map(a => {
                  const on = addons[a.key];
                  return (
                    <button key={a.key} type="button" onClick={() => setAddons(p => ({ ...p, [a.key]: !p[a.key] }))} style={{
                      textAlign: 'left', cursor: 'pointer', padding: 16,
                      background: on ? `${C.gold}15` : C.panel,
                      border: `1px solid ${on ? C.gold : C.rule2}`,
                      borderLeft: `4px solid ${on ? C.gold : C.rule2}`,
                      display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14,
                      transition: 'all 200ms',
                    }}>
                      {/* checkbox */}
                      <div style={{
                        width: 22, height: 22,
                        background: on ? C.gold : 'transparent',
                        border: `1px solid ${on ? C.gold : C.rule2}`,
                        display: 'grid', placeItems: 'center',
                        color: '#08080A', fontSize: 14, fontWeight: 700,
                      }}>{on ? '✓' : ''}</div>
                      <div>
                        <div style={{
                          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
                          marginBottom: 4,
                        }}>
                          <div style={{
                            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                            color: C.ink, letterSpacing: -0.2, textTransform: 'uppercase',
                          }}>{a.name}</div>
                          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.gold }}>
                            ${a.price.toLocaleString()} · ${a.mo}/mo over 60mo
                          </div>
                        </div>
                        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, lineHeight: 1.5 }}>
                          {a.desc}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                        color: on ? C.gold : C.inkLow, letterSpacing: -0.5,
                      }}>+${a.mo}<span style={{ fontSize: 11, color: C.inkLow }}>/mo</span></div>
                    </button>
                  );
                })}
              </div>

              {/* package subtotal */}
              <div style={{
                padding: '16px 22px',
                background: addonsMonthly > 0 ? C.panel : C.bg2,
                border: `1px solid ${addonsMonthly > 0 ? C.gold : C.rule}`,
                borderLeft: `4px solid ${addonsMonthly > 0 ? C.gold : C.rule2}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>
                    PROTECTION PACKAGE
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, marginTop: 2 }}>
                    {selectedAddons.length === 0
                      ? 'No add-ons selected. Skip this step or add coverage.'
                      : `${selectedAddons.length} item${selectedAddons.length === 1 ? '' : 's'} selected`}
                  </div>
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26,
                  color: addonsMonthly > 0 ? C.gold : C.inkLow, letterSpacing: -1,
                }}>+${addonsMonthly}<span style={{ fontSize: 13, color: C.inkLow }}>/mo</span></div>
              </div>
            </div>
          )}

          {/* STEP 5 — summary */}
          {step === 5 && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 6,
              }}>Your Deal</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 24 }}>
                Final terms determined at the dealership. This is your estimated, all-in monthly figure.
              </div>

              <div style={{
                background: C.panel, border: `1px solid ${C.rule}`, padding: 24,
                marginBottom: 18,
              }}>
                {(() => {
                  const rows = [
                    ['VEHICLE PRICE',          fmt(vehicle.price), false, false],
                    ['SALES TAX (6%)',         fmt(tax), false, false],
                    ['DOC FEE',                fmt(docFee), false, false],
                    ['TRADE-IN CREDIT',        hasTrade ? `– ${fmt(tradeCredit)}` : '–', false, false],
                    ['DOWN PAYMENT',           `– ${fmt(down)}`, false, false],
                    ['AMOUNT FINANCED',        fmt(financed), true, false],
                    ['APR',                    `${apr}%`, false, false],
                    ['TERM',                   `${term} months`, false, false],
                    ['BASE MONTHLY',           `${fmt(baseMonthly)}/mo`, false, false],
                    addonsMonthly > 0
                      ? [`PROTECTION PACKAGE (${selectedAddons.length})`, `+ ${fmt(addonsMonthly)}/mo`, false, true]
                      : null,
                  ].filter(Boolean);
                  return rows.map(([k, val, big, gold], i) => (
                    <div key={k} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: i < rows.length - 1 ? `1px solid ${C.rule}` : 'none',
                    }}>
                      <div style={{
                        fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                        color: gold ? C.gold : C.inkDim, fontWeight: gold ? 700 : 500,
                      }}>{k}</div>
                      <div style={{
                        fontFamily: FONT_DISPLAY, fontWeight: big || gold ? 700 : 600,
                        fontSize: big ? 18 : 14, color: gold ? C.gold : C.ink, letterSpacing: 0.3,
                      }}>{val}</div>
                    </div>
                  ));
                })()}
              </div>

              {/* huge monthly */}
              <div style={{
                padding: '24px 28px',
                background: `linear-gradient(135deg, #1A1408 0%, #0E0E12 100%)`,
                border: `1px solid ${C.gold}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.gold, fontWeight: 700 }}>
                  ESTIMATED<br />MONTHLY PAYMENT
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: C.gold,
                  lineHeight: 1, letterSpacing: -2,
                }}>{fmt(monthly)}<span style={{ fontSize: 20, color: C.inkLow }}>/mo</span></div>
              </div>

              <div style={{
                marginTop: 14, fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow,
                lineHeight: 1.6, letterSpacing: 0.5,
              }}>
                ★ This is an estimate. Final terms determined at dealership based on credit verification, exact vehicle, residency, and applicable taxes/fees.
              </div>
            </div>
          )}

          {/* STEP 6 — submit */}
          {step === 6 && !submitted && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 6,
              }}>Lock it in.</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 22 }}>
                A team member will review your deal and call you back within 15 minutes.
              </div>

              <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
                {[
                  ['NAME',  name,  setName,  'text',  'Full Name'],
                  ['EMAIL', email, setEmail, 'email', 'you@email.com'],
                  ['PHONE', phone, setPhone, 'tel',   '(305) 555-0123'],
                ].map(([lab, val, setter, t, ph]) => (
                  <div key={lab}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                    <input type={t} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                      padding: '6px 0', letterSpacing: 0.5,
                    }} />
                  </div>
                ))}
              </div>

              <div style={{
                padding: 14, background: C.bg2, border: `1px dashed ${C.rule2}`,
                fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, letterSpacing: 0.5, lineHeight: 1.6,
              }}>
                ▸ DEAL: {vehicle.y} {vehicle.mk} {vehicle.md}<br />
                ▸ MONTHLY: <span style={{ color: C.gold, fontWeight: 700 }}>{fmt(monthly)}/mo</span> · {term}mo @ {apr}% APR<br />
                ▸ DOWN: {fmt(down)} · TRADE: {hasTrade ? fmt(tradeCredit) : 'NONE'}<br />
                ▸ PROTECTION: {selectedAddons.length === 0 ? 'NONE' : `${selectedAddons.length} ITEM${selectedAddons.length === 1 ? '' : 'S'} · +$${addonsMonthly}/MO`}
              </div>
            </div>
          )}

          {step === 6 && submitted && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                background: `${C.gold}20`, border: `2px solid ${C.gold}`,
                display: 'grid', placeItems: 'center', margin: '0 auto 22px',
                color: C.gold, fontSize: 38,
              }}>✓</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28,
                color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
              }}>Deal Submitted.</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55, maxWidth: 440, margin: '0 auto 24px' }}>
                A team member will contact you within <strong style={{ color: C.gold }}>15 minutes</strong> to confirm and schedule your pickup or delivery.
              </div>
              <div style={{
                display: 'inline-block', padding: '8px 18px',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.cyan,
                border: `1px solid ${C.cyan}55`,
              }}>★ DEAL ID · D-{vehicle.id}-{Date.now().toString().slice(-5)}</div>
            </div>
          )}
        </div>

        {/* footer nav */}
        {!(step === TOTAL_STEPS && submitted) && (
          <div style={{
            padding: '18px 28px', borderTop: `1px solid ${C.rule}`,
            background: C.bg2,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {step > 1 ? (
              <button onClick={back} style={{
                padding: '12px 22px', background: 'transparent', color: C.inkDim,
                border: `1px solid ${C.rule2}`, cursor: 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>← BACK</button>
            ) : <span />}
            {step < TOTAL_STEPS ? (
              <button onClick={() => {
                // step 2 — must answer yes/no
                if (step === 2 && hasTrade === null) { setHasTrade(false); next(); return; }
                next();
              }} style={{
                padding: '12px 28px', background: C.gold, color: '#08080A',
                border: 'none', cursor: 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>{step === 2 && hasTrade === null ? 'SKIP →' : 'CONTINUE →'}</button>
            ) : (
              <button onClick={() => setSubmitted(true)} disabled={!name || !email || !phone} style={{
                padding: '12px 28px',
                background: (!name || !email || !phone) ? C.rule2 : C.gold,
                color: (!name || !email || !phone) ? C.inkLow : '#08080A',
                border: 'none', cursor: (!name || !email || !phone) ? 'not-allowed' : 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>▸ SUBMIT MY DEAL</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Counters Block (between Charter and Voices) ──── */
function CountersBlock() {
  const [ref, seen] = useInView({ threshold: 0.4 });
  const stats = [
    { final: 2847, label: 'HAPPY CUSTOMERS',    suffix: '' },
    { final: 4.9,  label: 'GOOGLE RATING',      suffix: '', isFloat: true },
    { final: 156,  label: '5-STAR REVIEWS',     suffix: '' },
  ];

  return (
    <section ref={ref} style={{
      position: 'relative', padding: '70px 0',
      background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`,
      borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`,
    }}>
      <div style={{
        paddingLeft: 96, paddingRight: 48,
        display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 36, alignItems: 'center',
      }} className="counters-grid">
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 8,
          }}>SOCIAL PROOF</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            color: C.ink, letterSpacing: -0.8, textTransform: 'uppercase', lineHeight: 1.05,
          }}>The numbers.</div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold, marginTop: 8,
          }}>★ SINCE 2019</div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }}>
          {stats.map((s, i) => (
            <Counter key={s.label} {...s} go={seen} delay={i * 200} hasBorder={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ final, label, suffix = '', isFloat = false, go, delay = 0, hasBorder }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!go) return;
    const dur = 1600;
    const t0 = performance.now() + delay;
    let raf;
    const tick = (now) => {
      if (now < t0) { raf = requestAnimationFrame(tick); return; }
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(final * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, final, delay]);

  const display = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();

  return (
    <div style={{
      padding: '32px 24px',
      borderRight: hasBorder ? `1px solid ${C.rule}` : 'none',
    }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        color: C.gold, lineHeight: 1, letterSpacing: -2,
      }}>{display}{suffix}</div>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.cyan,
        marginTop: 10, fontWeight: 700,
      }}>{label}</div>
    </div>
  );
}

/* ─── Why Pre-Owned Section ─────────────────────── */
function WhyPreOwned() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3.5} label="WHY PRE-OWNED" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 720 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>03.5 / WHY PRE-OWNED</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Why buy <span style={{ color: C.red }}>pre-owned?</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, marginTop: 14, marginBottom: 0,
          }}>
            Smart buyers don't pay $13,500 to drive off the lot. They put that money toward equity, freedom, or just living.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="preowned-grid">
          {/* Card 1 — New */}
          <div style={{ padding: 28, borderRight: `1px solid ${C.rule}`, background: C.panel }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.inkLow, marginBottom: 8,
            }}>SCENARIO A</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>New Car</div>
            {/* dep curve */}
            <div style={{
              height: 60, position: 'relative', marginBottom: 14,
              background: C.bg, border: `1px solid ${C.rule}`,
            }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 0 8 Q 50 20, 200 50" stroke={C.red} strokeWidth="2" fill="none" />
              </svg>
              <span style={{ position: 'absolute', top: 4, left: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.inkLow }}>$45K</span>
              <span style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.red }}>$31.5K</span>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink, lineHeight: 1.2 }}>
              $45,000 → <span style={{ color: C.red }}>$31,500</span><br />
              <span style={{ fontSize: 12, color: C.inkDim, fontWeight: 500 }}>in 3 years</span>
            </div>
            <div style={{
              marginTop: 14, padding: '10px 12px', background: `${C.red}11`,
              border: `1px solid ${C.red}55`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5, color: C.red, fontWeight: 700,
            }}>− $13,500 to depreciation</div>
          </div>

          {/* Card 2 — CPO */}
          <div style={{ padding: 28, borderRight: `1px solid ${C.rule}`, background: C.panel }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.inkLow, marginBottom: 8,
            }}>SCENARIO B</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>Certified Pre-Owned</div>
            <div style={{
              height: 60, position: 'relative', marginBottom: 14,
              background: C.bg, border: `1px solid ${C.rule}`,
            }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 0 18 Q 100 28, 200 42" stroke={C.cyan} strokeWidth="2" fill="none" />
              </svg>
              <span style={{ position: 'absolute', top: 4, left: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.inkLow }}>$32K</span>
              <span style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.cyan }}>$24K</span>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink, lineHeight: 1.2 }}>
              $32,000 → <span style={{ color: C.cyan }}>$24,000</span><br />
              <span style={{ fontSize: 12, color: C.inkDim, fontWeight: 500 }}>in 3 years</span>
            </div>
            <div style={{
              marginTop: 14, padding: '10px 12px', background: 'rgba(91,227,255,0.07)',
              border: `1px solid ${C.cyan}55`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5, color: C.cyan, fontWeight: 700,
            }}>+ Buy smart. Save $9,500+</div>
          </div>

          {/* Card 3 — Savings */}
          <div style={{
            padding: 28, background: `linear-gradient(160deg, #1A1408 0%, ${C.panel} 100%)`,
          }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold, marginBottom: 8,
            }}>★ YOUR SAVINGS</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>Pure Win.</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              color: C.gold, lineHeight: 1, letterSpacing: -3, margin: '14px 0',
            }}>$9,500<span style={{ fontSize: '0.5em' }}>+</span></div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.5,
            }}>Average savings vs. buying new — money you keep, invest, or use for upgrades, gas, insurance.</div>
            <div style={{
              marginTop: 16, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.gold, fontWeight: 700,
            }}>★ Smart buyers choose pre-owned.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Recently Viewed (above footer) ────────────── */
function RecentlyViewed({ items, onView, onBuildDeal }) {
  return (
    <section style={{
      position: 'relative', padding: '60px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <div style={{ paddingLeft: 96, paddingRight: 48 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 6,
            }}>RECENTLY VIEWED</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: C.ink, letterSpacing: -0.8, textTransform: 'uppercase', margin: 0,
            }}>Pick up where you left off.</h2>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>
            ★ {items.length} ITEM{items.length === 1 ? '' : 'S'}
          </span>
        </div>

        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
        }}>
          {items.map(v => (
            <div key={v.id} style={{
              flex: '0 0 240px',
              background: C.panel, border: `1px solid ${C.rule}`,
            }}>
              <div style={{
                aspectRatio: '16/10',
                background: `url('${v.img}') center/cover`,
              }} />
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow, marginBottom: 3 }}>
                  {v.id} · {v.y}
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                  color: C.ink, letterSpacing: -0.2, lineHeight: 1.1,
                }}>{v.mk} {v.md}</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.gold, marginTop: 4,
                }}>{fmt(v.price)}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  <button onClick={() => onView(v)} style={{
                    flex: 1, padding: '7px 8px', background: C.gold, color: '#08080A',
                    border: 'none', cursor: 'pointer',
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                  }}>VIEW AGAIN</button>
                  <button onClick={() => onBuildDeal(v)} style={{
                    padding: '7px 8px', background: 'transparent', color: C.cyan,
                    border: `1px solid ${C.cyan}55`, cursor: 'pointer',
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                  }}>★ DEAL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   ROUND 3 · ADDITIONS
   Service · Warranty · Team · Reserve · Accessibility · Drive-time
═══════════════════════════════════════════════════════════════ */

/* ─── Service Scheduling Section ─────────────────── */
function ServiceSchedule() {
  const [ref, seen] = useInView();
  const [submitted, setSubmitted] = useState(false);

  const services = [
    ['Oil Change & Filter',       49.95],
    ['Tire Rotation',             29.95],
    ['Brake Inspection',          0],
    ['Check Engine Diagnostic',   89.95],
    ['State Inspection',          29.95],
    ['A/C Service',               129.95],
    ['Full Detail',               199.95],
    ['Other',                     null],
  ];

  return (
    <section ref={ref} id="service" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3.7} label="SERVICE BAY" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{ marginBottom: 48, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>03.7 / SERVICE BAY</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Schedule <span style={{ color: C.gold }}>service.</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Keep your vehicle running like new. Factory-trained technicians. Competitive pricing. We service all makes — yours doesn't have to come from us.
          </p>
        </div>

        {/* form panel */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '1.4fr 1fr',
        }} className="service-grid">
          {/* form */}
          <div style={{ padding: 32, borderRight: `1px solid ${C.rule}` }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 78, height: 78, borderRadius: '50%',
                  background: `${C.gold}22`, border: `2px solid ${C.gold}`,
                  display: 'grid', placeItems: 'center', margin: '0 auto 22px',
                  color: C.gold, fontSize: 34,
                }}>✓</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
                }}>Appointment Confirmed.</div>
                <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                  We'll text you a reminder <strong style={{ color: C.gold }}>24 hours before</strong> your appointment.
                </div>
                <button onClick={() => setSubmitted(false)} style={{
                  background: 'transparent', color: C.cyan,
                  border: `1px solid ${C.cyan}55`, padding: '10px 20px', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
                }}>+ BOOK ANOTHER</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 18,
                }}>★ APPOINTMENT REQUEST</div>

                {/* contact row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }} className="srv-row3">
                  {[['NAME', 'text', 'Jane Doe'], ['PHONE', 'tel', '(305) 555-0123'], ['EMAIL', 'email', 'you@email.com']].map(([lab, t, ph]) => (
                    <div key={lab}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                      <input type={t} placeholder={ph} required style={{
                        width: '100%', background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                        padding: '6px 0', letterSpacing: 0.5,
                      }} />
                    </div>
                  ))}
                </div>

                {/* vehicle row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }} className="srv-row3">
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>VEHICLE YEAR</div>
                    <select style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['2024','2023','2022','2021','2020','2019','2018','2017','OLDER'].map(y => (
                        <option key={y} style={{ background: C.panel }}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>MAKE</div>
                    <select style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['BMW','Mercedes-Benz','Audi','Lexus','Tesla','Porsche','Range Rover','Cadillac','Toyota','Honda','Ford','Chevy','Other'].map(m => (
                        <option key={m} style={{ background: C.panel }}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>MODEL</div>
                    <input type="text" placeholder="X5" required style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', letterSpacing: 0.5,
                    }} />
                  </div>
                </div>

                {/* service type */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>SERVICE TYPE</div>
                  <select required style={{
                    width: '100%', appearance: 'none', background: 'transparent',
                    border: 'none', borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                    padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                  }}>
                    {services.map(([name, price]) => (
                      <option key={name} style={{ background: C.panel }}>
                        {name}{price === 0 ? '  ·  FREE' : price ? `  ·  $${price.toFixed(2)}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* date/time row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>PREFERRED DATE</div>
                    <input type="date" required style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                      padding: '6px 0', colorScheme: 'dark',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>PREFERRED TIME</div>
                    <select required style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['8:00 AM','9:30 AM','11:00 AM','1:00 PM','2:30 PM','4:00 PM','5:30 PM'].map(t => (
                        <option key={t} style={{ background: C.panel }}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* notes */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>NOTES (OPTIONAL)</div>
                  <textarea rows={3} placeholder="ANYTHING WE SHOULD KNOW..." style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                    padding: '6px 0', resize: 'vertical', letterSpacing: 0.5,
                  }} />
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '16px 20px',
                  background: C.gold, color: '#08080A', border: 'none', cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>▸ Schedule Now</button>
              </form>
            )}
          </div>

          {/* coupons sidebar */}
          <div style={{ padding: 28, background: C.bg2 }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold, marginBottom: 4,
            }}>★ ACTIVE COUPONS</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
              color: C.ink, letterSpacing: -0.3, marginBottom: 18,
            }}>Stack the savings.</div>

            {[
              { tag: 'NEW · CUSTOMERS', t: 'First Oil Change FREE', s: 'For new customers · One-time' },
              { tag: '$50 · OFF',       t: 'Brake Service Special', s: 'Any brake job · Pad or rotor' },
              { tag: 'BUNDLE',          t: 'Free Multi-Point Inspection', s: 'With any paid service' },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'relative', marginBottom: 12,
                background: C.bg, border: `1px dashed ${C.gold}`,
                padding: 14,
              }}>
                {/* corner notches */}
                <span style={{
                  position: 'absolute', top: -1, left: -1, width: 8, height: 8,
                  borderTop: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}`,
                }} />
                <span style={{
                  position: 'absolute', top: -1, right: -1, width: 8, height: 8,
                  borderTop: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}`,
                }} />
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold, fontWeight: 700, marginBottom: 4 }}>
                  ▸ {c.tag}
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                  color: C.ink, letterSpacing: -0.2, lineHeight: 1.2, marginBottom: 4,
                }}>{c.t}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.inkDim }}>{c.s}</div>
              </div>
            ))}

            <div style={{
              marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.rule}`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.cyan, lineHeight: 1.6,
            }}>
              ▸ All makes serviced<br />
              ▸ Loaner cars available<br />
              ▸ Open Sat 9-4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Warranty Tiers Section ─────────────────────── */
function Warranty() {
  const [ref, seen] = useInView();
  const tiers = [
    {
      tag: 'STANDARD',
      label: 'INCLUDED',
      title: '90 Days · 3,000 mi',
      sub: 'Powertrain coverage on every vehicle',
      bullets: ['Engine', 'Transmission', 'Drive Axle'],
      foot: 'Included with every purchase — no extra cost',
      featured: false,
    },
    {
      tag: 'CERTIFIED PRE-OWNED',
      label: '$999',
      title: '1 Year · 12,000 mi',
      sub: 'Comprehensive coverage',
      bullets: ['Everything in Standard', '+ A/C System', '+ Electrical', '+ Suspension'],
      foot: '172-point inspection required',
      featured: true,
    },
    {
      tag: 'EXTENDED',
      label: '$1,899',
      title: '3 Years · 36,000 mi',
      sub: 'Bumper-to-bumper protection',
      bullets: ['Total peace of mind', 'Covers almost everything', 'Transferable on resale'],
      foot: 'Best value · Most popular',
      featured: false,
    },
  ];

  return (
    <section ref={ref} id="warranty" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={5.5} label="WARRANTY" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>05.5 / WARRANTY PROMISE</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Coverage that <span style={{ color: C.red }}>holds up.</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Every vehicle ships with powertrain coverage. Want more peace of mind? Two upgrade tiers, no upsell pressure — just real protection.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          alignItems: 'stretch',
        }} className="warranty-grid">
          {tiers.map((tier, i) => (
            <div key={tier.tag} style={{
              position: 'relative',
              padding: 32,
              background: tier.featured
                ? `linear-gradient(160deg, #1A1408 0%, ${C.panel} 100%)`
                : C.panel,
              border: tier.featured ? `2px solid ${C.gold}` : `1px solid ${C.rule}`,
              borderLeft: i === 0 ? (tier.featured ? `2px solid ${C.gold}` : `1px solid ${C.rule}`) : (tier.featured ? `2px solid ${C.gold}` : 'none'),
              marginTop: tier.featured ? -8 : 0,
              marginBottom: tier.featured ? -8 : 0,
              boxShadow: tier.featured ? `0 0 30px ${C.gold}25` : 'none',
              zIndex: tier.featured ? 2 : 1,
              display: 'flex', flexDirection: 'column',
            }}>
              {tier.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: 24,
                  background: C.gold, color: '#08080A',
                  padding: '4px 12px',
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, fontWeight: 700,
                }}>★ RECOMMENDED</div>
              )}

              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5,
                color: tier.featured ? C.gold : C.inkLow, marginBottom: 6, fontWeight: 700,
              }}>{tier.tag}</div>

              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700,
                fontSize: tier.featured ? 32 : 26,
                color: tier.featured ? C.gold : C.ink,
                lineHeight: 1, letterSpacing: -1, marginBottom: 12,
              }}>{tier.label}</div>

              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                color: C.ink, letterSpacing: -0.3, marginBottom: 4,
                textTransform: 'uppercase',
              }}>{tier.title}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, marginBottom: 18 }}>{tier.sub}</div>

              <ul style={{
                listStyle: 'none', padding: 0, margin: 0, marginBottom: 18,
                borderTop: `1px solid ${C.rule}`,
              }}>
                {tier.bullets.map(b => (
                  <li key={b} style={{
                    padding: '10px 0', borderBottom: `1px solid ${C.rule}`,
                    fontFamily: FONT_BODY, fontSize: 13, color: C.ink,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: tier.featured ? C.gold : C.cyan, fontFamily: FONT_MONO, fontSize: 11 }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: 'auto',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5,
                color: tier.featured ? C.gold : C.cyan, fontWeight: 700,
              }}>▸ {tier.foot}</div>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 28, paddingTop: 18, borderTop: `1px dashed ${C.rule2}`,
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.gold,
          textAlign: 'center', lineHeight: 1.6,
        }}>★ All warranty claims handled in-house at our service center · Same shop, same techs, same quality.</p>
      </div>
    </section>
  );
}

/* ─── Meet The Team Section ──────────────────────── */
function MeetTheTeam() {
  const [ref, seen] = useInView();
  const team = [
    { name: 'Carlos Rivera',  role: 'SALES MANAGER',         bio: '15 years helping Miami drivers find the perfect car.', initials: 'CR', tone: C.gold },
    { name: 'Maria Santos',   role: 'FINANCE DIRECTOR',      bio: 'Making car ownership affordable for every budget.',    initials: 'MS', tone: C.cyan },
    { name: 'James Mitchell', role: 'SALES CONSULTANT',      bio: 'Your car, your terms. No pressure, ever.',             initials: 'JM', tone: C.red  },
    { name: 'Ana Gutierrez',  role: 'SERVICIO EN ESPAÑOL',   bio: 'Aquí para ayudarte en cada paso.',                     initials: 'AG', tone: C.gold },
  ];

  return (
    <section ref={ref} id="team" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={7.5} label="THE CREW" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 56, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>07.5 / THE CREW</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Meet the <span style={{ color: C.gold }}>team.</span></h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="team-grid">
          {team.map((m, i) => (
            <div key={m.name} style={{
              padding: 28, background: i % 2 === 0 ? C.panel : C.bg2,
              borderRight: i < 3 ? `1px solid ${C.rule}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {/* avatar */}
              <div style={{
                width: 72, height: 72, position: 'relative',
                background: `linear-gradient(135deg, ${m.tone}, ${m.tone}55)`,
                border: `1px solid ${m.tone}`,
                clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                display: 'grid', placeItems: 'center',
              }}>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: '#08080A', letterSpacing: -0.5,
                }}>{m.initials}</span>
              </div>

              <div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                  color: C.ink, letterSpacing: -0.3, lineHeight: 1.1, marginBottom: 4,
                }}>{m.name}</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.8,
                  color: m.tone, fontWeight: 700,
                }}>{m.role}</div>
              </div>

              <p style={{
                fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.55,
                margin: 0, flex: 1,
              }}>"{m.bio}"</p>

              <div style={{
                paddingTop: 12, borderTop: `1px dashed ${C.rule2}`,
                display: 'flex', gap: 6,
              }}>
                <a href="tel:3055550199" title="Call" style={{
                  flex: 1, padding: '8px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  color: C.gold, textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 180ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.rule2}
                >📞 CALL</a>
                <a href="mailto:team@primoauto.com" title="Email" style={{
                  flex: 1, padding: '8px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  color: C.cyan, textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 180ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.cyan}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.rule2}
                >✉ EMAIL</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reserve Vehicle Modal ──────────────────────── */
function ReserveModal({ vehicle, onClose, onReserve }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 240); };

  const submit = (e) => {
    e.preventDefault();
    onReserve(vehicle.id);
    setSubmitted(true);
  };

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 112,
      background: open ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(8px)' : 'none',
      transition: 'all 240ms',
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(560px, 100%)', maxHeight: '90vh', overflowY: 'auto',
        background: C.bg, border: `1px solid ${C.gold}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.gold}25`,
        opacity: open ? 1 : 0, transform: open ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold }}>
              ★ RESERVE · 48-HOUR HOLD
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>Lock this vehicle</div>
          </div>
          <button onClick={close} style={{
            width: 36, height: 36, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* vehicle strip */}
        <div style={{
          padding: 20, borderBottom: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'center',
          background: C.panel,
        }}>
          <div style={{
            aspectRatio: '4/3',
            background: `url('${vehicle.img}') center/cover`,
            border: `1px solid ${C.rule}`,
          }} />
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow }}>
              STOCK · {vehicle.id}
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>{vehicle.y} {vehicle.mk} {vehicle.md}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.gold, marginTop: 6,
            }}>{fmt(vehicle.price)}</div>
          </div>
        </div>

        {submitted ? (
          <div style={{ padding: '40px 28px', textAlign: 'center' }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              background: `${C.gold}22`, border: `2px solid ${C.gold}`,
              display: 'grid', placeItems: 'center', margin: '0 auto 22px',
              color: C.gold, fontSize: 34,
            }}>✓</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
              color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
            }}>Reserved.</div>
            <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
              This vehicle is held for you for <strong style={{ color: C.gold }}>48 hours</strong>.
              A team member will confirm within 15 minutes.
            </div>
            <div style={{
              display: 'inline-block', padding: '8px 18px',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.cyan,
              border: `1px solid ${C.cyan}55`,
            }}>★ HOLD ID · R-{vehicle.id}-{Date.now().toString().slice(-5)}</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ padding: 24 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 14, color: C.inkDim, lineHeight: 1.55,
              margin: 0, marginBottom: 20,
            }}>
              Hold this vehicle for 48 hours with a <strong style={{ color: C.gold }}>$500 fully refundable</strong> deposit. No obligation. No pressure.
            </p>

            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              {[['NAME','text','Jane Doe'], ['EMAIL','email','you@email.com'], ['PHONE','tel','(305) 555-0123']].map(([lab, t, ph]) => (
                <div key={lab}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                  <input type={t} placeholder={ph} required style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                    padding: '6px 0', letterSpacing: 0.5,
                  }} />
                </div>
              ))}
            </div>

            <button type="submit" style={{
              width: '100%', padding: 16, background: C.gold, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
              textTransform: 'uppercase',
            }}>▸ Reserve Now · $500</button>

            <div style={{
              marginTop: 14, padding: 12, background: C.bg2,
              border: `1px dashed ${C.rule2}`,
              fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, letterSpacing: 0.5, lineHeight: 1.6,
            }}>
              ▸ Your card is <strong style={{ color: C.ink }}>not charged</strong> at this time.<br />
              ▸ A team member confirms within 15 minutes.<br />
              ▸ 100% refundable up to 48 hours.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Accessibility Widget (bottom-left) ─────────── */
function AccessibilityWidget({ a11y, setA11y }) {
  const [open, setOpen] = useState(false);
  const toggle = (key) => setA11y(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Accessibility options" className="a11y-btn" style={{
        position: 'fixed', left: 116, bottom: 24, zIndex: 50,
        width: 48, height: 48,
        background: C.cyan, color: '#08080A',
        border: `2px solid ${C.cyan}`, cursor: 'pointer',
        clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
        display: 'grid', placeItems: 'center',
        fontSize: 20, fontWeight: 700,
        boxShadow: `0 6px 22px rgba(91,227,255,0.4)`,
      }}>♿</button>

      {open && (
        <div className="a11y-panel" style={{
          position: 'fixed', left: 116, bottom: 84, zIndex: 49,
          width: 280, background: 'var(--c-glass)',
          backdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${C.cyan}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 24px ${C.cyan}30`,
          padding: 18,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>
                ♿ ACCESSIBILITY
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                color: C.ink, letterSpacing: -0.3, marginTop: 2,
              }}>Adjust Display</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              width: 26, height: 26, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 12,
            }}>✕</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {[
              ['largeFont',   'INCREASE FONT SIZE',  'Scales all text 20% larger'],
              ['highContrast','HIGH CONTRAST MODE',  'Pure white on black, no gradients'],
              ['noMotion',    'PAUSE ANIMATIONS',    'Disables motion site-wide'],
            ].map(([key, lab, sub]) => (
              <li key={key} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12,
                padding: 10, background: C.panel, border: `1px solid ${C.rule}`,
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.ink, fontWeight: 700 }}>{lab}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.inkDim, marginTop: 2 }}>{sub}</div>
                </div>
                <button onClick={() => toggle(key)} style={{
                  width: 44, height: 24, position: 'relative',
                  background: a11y[key] ? C.cyan : C.rule2, border: 'none',
                  cursor: 'pointer', padding: 0, transition: 'background 200ms',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: a11y[key] ? 23 : 3,
                    width: 18, height: 18,
                    background: a11y[key] ? '#08080A' : C.ink,
                    transition: 'left 200ms',
                  }} />
                </button>
              </li>
            ))}
          </ul>

          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.rule}`,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, color: C.gold, lineHeight: 1.6,
          }}>★ ADA COMPLIANT — Accessibility matters to us.</div>
        </div>
      )}
    </>
  );
}

/* ─── Page Composition ───────────────────────────── */
export default function PrimoAutoGroup() {
  const [priceMode, setPriceMode] = useState('price');
  const [active, setActive] = useState(null);
  const [section, setSection] = useState('top');

  // NEW state
  const [theme, setTheme] = useState('dark');
  const [lang, setLang]   = useState('en');
  const [saved, setSaved] = useState(() => new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [dealVehicle, setDealVehicle] = useState(null);
  const [showBeatPrice, setShowBeatPrice] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(() => new Set());
  // Round 3 state
  const [reserveVehicle, setReserveVehicle] = useState(null);
  const [reserved, setReserved] = useState(() => new Set());
  const [a11y, setA11y] = useState({ largeFont: false, highContrast: false, noMotion: false });

  const toggleSaved = (id) => {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const togglePriceAlert = (id) => {
    setPriceAlerts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleView = (v) => {
    setActive(v);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x.id !== v.id);
      return [v, ...filtered].slice(0, 8);
    });
  };

  const reserveOne = (id) => setReserved(p => { const n = new Set(p); n.add(id); return n; });

  // lock body scroll while any modal/drawer open
  const anyOverlayOpen = active || dealVehicle || showCompare || showSaved || showBeatPrice || reserveVehicle;
  useEffect(() => {
    document.body.style.overflow = anyOverlayOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyOverlayOpen]);

  // active section observer
  useEffect(() => {
    const ids = ['top', 'fleet', 'detail', 'trade', 'finance', 'why', 'process', 'voices', 'alerts', 'notebook', 'contact'];
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) setSection(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      data-fontscale={a11y.largeFont ? 'lg' : ''}
      data-hc={a11y.highContrast ? 'true' : ''}
      data-noanim={a11y.noMotion ? 'true' : ''}
      style={{
        ...THEMES[theme],
        background: C.bg, color: C.ink, minHeight: '100vh',
        fontFamily: FONT_BODY,
        transition: 'background-color 300ms ease, color 300ms ease',
      }}>
      <SideRail
        active={section} onJump={jump}
        theme={theme} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        lang={lang} onLangToggle={() => setLang(l => l === 'en' ? 'es' : 'en')}
        savedCount={saved.size} onShowSaved={() => setShowSaved(true)}
      />
      <Ticker />
      <TextUsButton />

      <main style={{ marginLeft: 96, paddingTop: 28 }} className="page-main">
        <Hero onCTA={jump} lang={lang} />
        <Fleet
          priceMode={priceMode} setPriceMode={setPriceMode}
          onView={handleView}
          onBuildDeal={setDealVehicle}
          saved={saved} onToggleSave={toggleSaved}
          priceAlerts={priceAlerts} onTogglePriceAlert={togglePriceAlert}
          onCompare={() => setShowCompare(true)}
          reserved={reserved}
        />
        <TradeIn />
        <ServiceSchedule />
        <WhyPreOwned />
        <Finance />
        <Charter />
        <Warranty />
        <CountersBlock />
        <Process />
        <Voices />
        <MeetTheTeam />
        <Alerts />
        <Notebook />
        <Contact />
        {recentlyViewed.length > 0 && (
          <RecentlyViewed
            items={recentlyViewed}
            onView={handleView}
            onBuildDeal={setDealVehicle}
          />
        )}
        <Footer />
      </main>

      {active && (
        <DetailDrawer
          v={active}
          onClose={() => setActive(null)}
          onBuildDeal={(v) => { setActive(null); setDealVehicle(v); }}
          onReserve={(v) => { setActive(null); setReserveVehicle(v); }}
          isReserved={reserved.has(active.id)}
        />
      )}
      {dealVehicle && <DealWizard vehicle={dealVehicle} onClose={() => setDealVehicle(null)} />}
      {reserveVehicle && (
        <ReserveModal
          vehicle={reserveVehicle}
          onClose={() => setReserveVehicle(null)}
          onReserve={reserveOne}
        />
      )}
      {showCompare && (
        <CompareModal
          onClose={() => setShowCompare(false)}
          initialIds={Array.from(saved)}
        />
      )}
      {showSaved && (
        <SavedPanel
          saved={saved}
          onClose={() => setShowSaved(false)}
          onToggleSave={toggleSaved}
          onView={handleView}
          onCompare={() => { setShowSaved(false); setShowCompare(true); }}
        />
      )}
      {showBeatPrice && <BeatPriceModal onClose={() => setShowBeatPrice(false)} />}

      <BeatPriceBadge onClick={() => setShowBeatPrice(true)} />
      <AIChatWidget open={showChat} onToggle={() => setShowChat(s => !s)} />
      <AccessibilityWidget a11y={a11y} setA11y={setA11y} />

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; background: ${C.bg}; }
        body { margin: 0; background: ${C.bg}; color: ${C.ink}; }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRise {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pinPulse {
          0%, 100% { box-shadow: 0 0 0 8px rgba(255,31,45,0.2); }
          50%      { box-shadow: 0 0 0 16px rgba(255,31,45,0); }
        }
        @keyframes chatPulse {
          0%   { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        @keyframes chatSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px ${C.gold}30; }
          50%      { box-shadow: 0 0 60px ${C.gold}60; }
        }

        /* ── Accessibility overrides ── */
        [data-fontscale="lg"] { zoom: 1.2; -moz-transform: scale(1.2); -moz-transform-origin: 0 0; }
        [data-hc="true"] {
          --c-bg: #000000 !important;
          --c-bg2: #000000 !important;
          --c-panel: #000000 !important;
          --c-rule: #FFFFFF !important;
          --c-rule2: #FFFFFF !important;
          --c-ink: #FFFFFF !important;
          --c-inkDim: #FFFFFF !important;
          --c-inkLow: #DDDDDD !important;
          --c-cyan: #FFFFFF !important;
          --c-glass: #000000 !important;
        }
        [data-hc="true"] *:not(input):not(select):not(textarea) {
          background-image: none !important;
          backdrop-filter: none !important;
          box-shadow: none !important;
        }
        [data-hc="true"] svg path { stroke: #FFFFFF !important; }
        [data-noanim="true"] *,
        [data-noanim="true"] *::before,
        [data-noanim="true"] *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }

        input::placeholder, textarea::placeholder {
          color: ${C.inkLow};
          letter-spacing: 1.5px;
          font-size: 13px !important;
          text-transform: uppercase;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-bottom-color: ${C.gold} !important;
          color: ${C.ink};
        }

        @media (max-width: 1080px) {
          .hero-grid { grid-template-columns: 1fr !important; height: auto !important; min-height: 100vh !important; }
          .hero-grid > div:first-child { padding: 80px 32px 40px 96px !important; }
          .hero-grid > div:last-child { aspect-ratio: 4/3; }
          .search-row { grid-template-columns: repeat(4, 1fr) auto !important; }
          .search-row > div:nth-child(n+5):not(:last-child) { grid-column: span 2; border-top: 1px solid ${C.rule}; }
          .fleet-grid > div { grid-column: span 12 !important; }
          .fleet-card { grid-template-columns: 1fr !important; }
          .trade-grid, .finance-split, .alerts-grid, .contact-split, .voices-grid { grid-template-columns: 1fr !important; }
          .finance-split > div:first-child, .contact-split > div:first-child { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .voices-grid > article { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .notebook-grid { grid-template-columns: 1fr !important; }
          .notebook-grid > article { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .process-grid { grid-template-columns: 1fr 1fr !important; }
          .process-line { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 1080px) {
          .preowned-grid { grid-template-columns: 1fr !important; }
          .preowned-grid > div { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .preowned-grid > div:last-child { border-bottom: none !important; }
          .counters-grid { grid-template-columns: 1fr !important; }
          .service-grid { grid-template-columns: 1fr !important; }
          .service-grid > div:first-child { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .warranty-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .warranty-grid > div { margin: 0 !important; border-left: 1px solid ${C.rule} !important; }
          .team-grid { grid-template-columns: 1fr 1fr !important; }
          .team-grid > div:nth-child(2) { border-right: none !important; }
          .team-grid > div:nth-child(1), .team-grid > div:nth-child(2) { border-bottom: 1px solid ${C.rule} !important; }
          .srv-row3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          .side-rail { width: 64px !important; }
          .marquee-bar { left: 64px !important; }
          .page-main { margin-left: 64px !important; }
          .textus-btn { left: 64px !important; padding: 10px 8px !important; font-size: 11px !important; }
          .beat-badge { bottom: 110px !important; max-width: 180px !important; padding: 10px 12px !important; }
          .beat-badge > div:last-child { font-size: 12px !important; }
          .chat-bubble { right: 16px !important; bottom: 16px !important; width: 52px !important; height: 52px !important; }
          .chat-panel { right: 12px !important; bottom: 80px !important; width: calc(100vw - 24px) !important; }
          .a11y-btn { left: 80px !important; bottom: 16px !important; width: 42px !important; height: 42px !important; }
          .a11y-panel { left: 80px !important; bottom: 70px !important; width: calc(100vw - 96px) !important; max-width: 280px; }
          .team-grid { grid-template-columns: 1fr !important; }
          .team-grid > div { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
          .team-grid > div:last-child { border-bottom: none !important; }
          .srv-row3 { grid-template-columns: 1fr !important; }
          .hero-grid > div:first-child { padding: 80px 24px 40px 60px !important; }
          .charter-row { grid-template-columns: 60px 1fr !important; gap: 16px !important; }
          .charter-row > div:nth-child(3), .charter-row > div:nth-child(4) {
            grid-column: 1 / -1; padding-left: 76px;
          }
          .process-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .voices-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
