'use client';
/**
 * Customer-site internals — shared color tokens, font stacks, I18N strings,
 * demo FLEET data, payment math, format helpers, and the small VTag /
 * useInView atoms used across every section component.
 *
 * Each extracted section file imports what it needs from here.
 */
import { useEffect, useRef, useState } from 'react';

/* ─── Brand color tokens (CSS-var driven, theme-aware) ──────────── */
export const C = {
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

export const THEMES = {
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

export const I18N = {
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
    body:    'Tu concesionario premium de autos usados de confianza.',
    body2:   'Lujo por menos. Sin juegos. Sin costos ocultos. Inventario seleccionado a mano, certificación mecánica completa, financiamiento para cualquier crédito.',
    cta1:    'Ver Inventario',
    cta2:    'Pre-Aprobación →',
  },
};

export const FONT_DISPLAY = 'var(--font-oswald), "Oswald", "Bebas Neue", Impact, sans-serif';
export const FONT_BODY    = 'var(--font-inter), -apple-system, sans-serif';
export const FONT_MONO    = 'var(--font-mono), "JetBrains Mono", "IBM Plex Mono", monospace';

/* ─── Demo FLEET inventory ─────────────────────────────────── */
export const FLEET = [
  { id:'P5012', y:2023, mk:'BMW',           md:'X5',       trim:'xDrive40i',        price:42995, mi:18420, body:'SUV',   ext:'Alpine White',      int:'Black Vernasca',       eng:'3.0L Turbo I6',          tx:'8-spd Auto',      dr:'AWD', hp:335, sec:'5.3', mpg:23, vin:'WBA••••••3K9L21',
    img:'https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-bmwusa-hero.jpg',
    imgs:['https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-bmwusa-hero.jpg','https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-bmwusa-side.jpg','https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-bmwusa-rear.jpg','https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-bmwusa-front.jpg','https://www.bmwusa.com/content/dam/bmwusa/X-Models/X5/2023/OverviewPage/2023-bmw-x5-exterior-1.jpg'],
    videoId:'lFfEHK4jHk0', flags:['ONE-OWNER','NO ACCIDENTS'] },
  { id:'P5023', y:2022, mk:'Mercedes-Benz', md:'GLE',      trim:'350 4MATIC',       price:38750, mi:24310, body:'SUV',   ext:'Obsidian Black',    int:'Macchiato Beige',      eng:'2.0L Turbo I4',          tx:'9-spd Auto',      dr:'AWD', hp:255, sec:'6.7', mpg:25, vin:'4JG•••••••N4H88',
    img:'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mercedes-Benz_W167_GLE_300d_4MATIC_2022.jpg',
    imgs:['https://upload.wikimedia.org/wikipedia/commons/a/a4/Mercedes-Benz_W167_GLE_300d_4MATIC_2022.jpg','https://upload.wikimedia.org/wikipedia/commons/8/80/Mercedes-Benz_W167_GLE_300d_4MATIC_2022_%281%29.jpg','https://images.hgmsites.net/lrg/2022-mercedes-benz-gle-class_100822420_l.jpg','https://images.hgmsites.net/lrg/2022-mercedes-benz-gle-class_100822421_l.jpg','https://images.hgmsites.net/lrg/2022-mercedes-benz-gle-class_100822422_l.jpg'],
    videoId:'iSY0tigBkys', flags:['ONE-OWNER','NO ACCIDENTS'] },
  { id:'P5031', y:2024, mk:'Audi',          md:'Q5',       trim:'Premium Plus',     price:44900, mi:9870,  body:'SUV',   ext:'Glacier White',     int:'Black Leather',        eng:'2.0L TFSI',              tx:'7-spd S tronic',  dr:'AWD', hp:261, sec:'5.7', mpg:25, vin:'WA1•••••••P201',
    img:'https://images.hgmsites.net/lrg/2024-audi-q5_100904831_l.webp',
    imgs:['https://images.hgmsites.net/lrg/2024-audi-q5_100904831_l.webp','https://images.hgmsites.net/lrg/2024-audi-q5_100904832_l.webp','https://images.hgmsites.net/lrg/2024-audi-q5_100904833_l.webp','https://images.hgmsites.net/lrg/2024-audi-q5_100904834_l.webp','https://images.hgmsites.net/lrg/2024-audi-q5_100904835_l.webp'],
    videoId:'2kdEYmsJfx0', flags:['ONE-OWNER','LOW MILEAGE'] },
  { id:'P5044', y:2021, mk:'Lexus',         md:'RX',       trim:'350 F Sport',      price:31995, mi:38600, body:'SUV',   ext:'Nori Green Pearl',  int:'Circuit Red',          eng:'3.5L V6',                tx:'8-spd Auto',      dr:'AWD', hp:295, sec:'7.2', mpg:22, vin:'2T2•••••••MC42',
    img:'https://images.hgmsites.net/lrg/2021-lexus-rx_100758668_l.jpg',
    imgs:['https://images.hgmsites.net/lrg/2021-lexus-rx_100758668_l.jpg','https://images.hgmsites.net/lrg/2021-lexus-rx_100758669_l.jpg','https://images.hgmsites.net/lrg/2021-lexus-rx_100758670_l.jpg','https://images.hgmsites.net/lrg/2021-lexus-rx_100758671_l.jpg','https://images.hgmsites.net/lrg/2021-lexus-rx_100758667_l.jpg'],
    videoId:'y0VQv_v4Mwo', flags:['NO ACCIDENTS'] },
  { id:'P5052', y:2023, mk:'Tesla',         md:'Model Y',  trim:'Long Range',       price:36500, mi:14200, body:'SUV',   ext:'Pearl White',       int:'All Black',            eng:'Dual Motor EV',          tx:'1-spd Direct',    dr:'AWD', hp:384, sec:'4.8', mpg:122,vin:'7SA•••••••P772',
    img:'https://upload.wikimedia.org/wikipedia/commons/5/55/2023_Tesla_Model_Y_RWD.jpg',
    imgs:['https://upload.wikimedia.org/wikipedia/commons/5/55/2023_Tesla_Model_Y_RWD.jpg','https://upload.wikimedia.org/wikipedia/commons/5/5e/2023_Tesla_Model_Y_Long_Range_All-Wheel_Drive_in_Pearl_White_Multi-Coat%2C_front_right%2C_2024-09-25.jpg','https://upload.wikimedia.org/wikipedia/commons/f/f1/2023_Tesla_Model_Y%2C_front_11.11.23.jpg','https://images.hgmsites.net/lrg/2023-tesla-model-y_100886991_l.jpg','https://images.hgmsites.net/lrg/2023-tesla-model-y_100872139_l.jpg'],
    videoId:'Q6PXeomevhE', flags:['ONE-OWNER','EV'] },
  { id:'P5066', y:2022, mk:'Porsche',       md:'Cayenne',  trim:'S AWD',            price:52800, mi:21400, body:'SUV',   ext:'Jet Black',         int:'Black/Bordeaux Red',   eng:'2.9L Twin-Turbo V6',     tx:'8-spd Tiptronic', dr:'AWD', hp:434, sec:'4.9', mpg:19, vin:'WP0•••••••N005',
    img:'https://images.hgmsites.net/lrg/2022-porsche-cayenne-awd-angular-front-exterior-view_100805221_l.jpg',
    imgs:['https://images.hgmsites.net/lrg/2022-porsche-cayenne-awd-angular-front-exterior-view_100805221_l.jpg','https://images.hgmsites.net/lrg/2022-porsche-cayenne-awd-front-exterior-view_100805209_l.jpg','https://images.hgmsites.net/lrg/2022-porsche-cayenne-awd-rear-exterior-view_100805222_l.jpg','https://images.hgmsites.net/lrg/2022-porsche-cayenne-awd-angular-rear-exterior-view_100805208_l.jpg','https://images.hgmsites.net/lrg/2022-porsche-cayenne-coupe-awd-angular-front-exterior-view_100842925_l.jpg'],
    videoId:'PqKFkWRQAjk', flags:['ONE-OWNER','LUXURY'] },
  { id:'P5077', y:2023, mk:'Range Rover',   md:'Sport',    trim:'P400 SE',          price:61995, mi:12890, body:'SUV',   ext:'Santorini Black',   int:'Ebony Windsor',        eng:'3.0L Mild-Hybrid I6',    tx:'8-spd Auto',      dr:'AWD', hp:395, sec:'5.7', mpg:21, vin:'SAL•••••••P210',
    img:'https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840840_l.jpg',
    imgs:['https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840840_l.jpg','https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840841_l.jpg','https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840842_l.jpg','https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840843_l.jpg','https://images.hgmsites.net/lrg/2023-land-rover-range-rover-sport_100840844_l.jpg'],
    videoId:'C9acAfjm0Hc', flags:['ONE-OWNER','LOW MILEAGE'] },
  { id:'P5081', y:2022, mk:'Cadillac',      md:'Escalade', trim:'Premium Luxury',   price:58900, mi:28900, body:'SUV',   ext:'Black Raven',       int:'Jet Black Semi-Aniline',eng:'6.2L V8',               tx:'10-spd Auto',     dr:'4WD', hp:420, sec:'6.0', mpg:14, vin:'1GYS4•••••••N113',
    img:'https://images.hgmsites.net/lrg/cadillac-escalade_100817700_l.jpg',
    imgs:['https://images.hgmsites.net/lrg/cadillac-escalade_100817700_l.jpg','https://images.hgmsites.net/lrg/cadillac-escalade_100817701_l.jpg','https://images.hgmsites.net/lrg/cadillac-escalade_100817699_l.jpg','https://images.hgmsites.net/lrg/cadillac-escalade_100817698_l.jpg','https://images.hgmsites.net/lrg/cadillac-escalade_100817697_l.jpg'],
    videoId:'tZ-YDLX2mHs', flags:['NO ACCIDENTS','LUXURY'] },
];

/* ─── Payment math + formatters ──────────────────────────── */
// P = r·PV / (1 − (1+r)^−n)
export const monthlyPayment = (price, downPct = 10, termMonths = 60, apr = 6.9) => {
  const principal = price * (1 - downPct / 100);
  const r = apr / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (r * principal) / (1 - Math.pow(1 + r, -termMonths));
};
export const fmt   = (n) => '$' + Math.round(n).toLocaleString('en-US');
export const fmtMi = (n) => n.toLocaleString('en-US');

/* ─── In-view hook (intersection observer reveal) ────────── */
export function useInView(opts = { threshold: 0.12 }) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, seen];
}

/* ─── Vertical section number tag (e.g. "SECTION / 01") ──── */
export function VTag({ num, label, color = C.gold }) {
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
