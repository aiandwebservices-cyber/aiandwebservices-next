'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Hero({ onCTA, lang = 'en' }) {
  const cfg = useCustomerConfig();
  const t = { ...I18N[lang], ...(cfg.hero?.[lang] ?? cfg.hero ?? {}) };
  const heroImage = cfg.heroImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2000&q=85&auto=format,compress';
  const [search, setSearch] = useState('');

  return (
    <section id="top" style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      {/* Background image */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `url('${heroImage}') center/cover no-repeat`,
      }} />

      {/* Gradient overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(105deg, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.72) 55%, rgba(9,9,11,0.38) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '0 48px 0 96px',
        maxWidth: 860,
      }} className="hero-grid">

        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          opacity: 0, animation: 'fadeIn 500ms 80ms forwards',
        }}>
          <span style={{ width: 32, height: 3, background: '#2AA5A0', borderRadius: 2, display: 'inline-block' }} />
          <span style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3,
            color: '#2AA5A0', fontWeight: 600,
          }}>{(cfg.address?.city || 'MIAMI').toUpperCase()} · PREMIUM PRE-OWNED</span>
        </div>

        <h1 key={lang} style={{
          fontFamily: FONT_DISPLAY, fontWeight: 800,
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          lineHeight: 0.94, letterSpacing: '-2px',
          color: '#F4F4F5', textTransform: 'uppercase',
          margin: 0, marginBottom: 20,
          opacity: 0, animation: 'slideRise 700ms 160ms forwards',
        }}>
          {t.title1}{' '}
          <span style={{ color: '#2AA5A0' }}>{t.title2}</span>
          <span style={{ color: '#FF1F2D' }}>.</span>
        </h1>

        <p key={`b-${lang}`} style={{
          fontFamily: FONT_BODY, color: 'rgba(244,244,245,0.68)', fontWeight: 400,
          fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.65,
          maxWidth: 520, margin: 0, marginBottom: 32,
          opacity: 0, animation: 'fadeIn 600ms 300ms forwards',
        }}>{t.body}</p>

        {/* Search bar */}
        <div style={{
          display: 'flex', marginBottom: 24, maxWidth: 560,
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4,
          overflow: 'hidden',
          opacity: 0, animation: 'fadeIn 600ms 380ms forwards',
        }}>
          <input
            type="text"
            placeholder="Make, model, year…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onCTA('fleet')}
            className="hero-search-input"
            style={{
              flex: 1, padding: '14px 20px',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              border: 'none', color: '#F4F4F5',
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500,
              outline: 'none',
            }}
          />
          <button
            onClick={() => onCTA('fleet')}
            style={{
              padding: '14px 22px', background: '#2AA5A0', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
              letterSpacing: 2, textTransform: 'uppercase',
              transition: 'all 200ms ease-out', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#238b87'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2AA5A0'; e.currentTarget.style.transform = 'scale(1)'; }}
          >Search →</button>
        </div>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          opacity: 0, animation: 'fadeIn 600ms 460ms forwards',
        }}>
          <a href="#fleet" onClick={(e) => { e.preventDefault(); onCTA('fleet'); }} style={{
            padding: '14px 28px', background: '#2AA5A0', color: '#fff',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all 200ms ease-out', display: 'inline-block',
            borderRadius: 2,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#238b87'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(42,165,160,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2AA5A0'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >{t.cta1}</a>
          <a href="#finance" onClick={(e) => { e.preventDefault(); onCTA('finance'); }} style={{
            padding: '14px 24px', background: 'transparent',
            color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.28)',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all 200ms ease-out', display: 'inline-block',
            borderRadius: 2,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2AA5A0'; e.currentTarget.style.color = '#2AA5A0'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#F4F4F5'; e.currentTarget.style.transform = 'scale(1)'; }}
          >{t.cta2}</a>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <button
        onClick={() => onCTA('fleet')}
        aria-label="Scroll to inventory"
        style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', padding: 0,
        }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5, color: 'rgba(244,244,245,0.4)' }}>SCROLL</span>
        <div className="scroll-down-indicator" style={{
          width: 28, height: 28,
          border: '1px solid rgba(244,244,245,0.2)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#2AA5A0', fontSize: 14,
        }}>↓</div>
      </button>

      <style>{`
        @media (max-width: 760px) {
          #top .hero-grid { padding: 0 16px 0 64px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── Body Type Picker ───────────────────────────────── */
const BODY_TYPES = [
  { key: 'all',      icon: '🔥', label: 'All' },
  { key: 'sedan',    icon: '🚗', label: 'Sedan' },
  { key: 'suv',      icon: '🚙', label: 'SUV' },
  { key: 'truck',    icon: '🛻', label: 'Truck' },
  { key: 'coupe',    icon: '🏎️', label: 'Coupe' },
  { key: 'van',      icon: '🚐', label: 'Van' },
  { key: 'electric', icon: '⚡', label: 'Electric' },
];

