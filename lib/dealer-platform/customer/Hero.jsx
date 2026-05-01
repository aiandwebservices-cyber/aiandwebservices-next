'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Hero({ onCTA, lang = 'en' }) {
  const cfg = useCustomerConfig();
  const heroDealerName = (cfg.dealerName || 'Dealer').split(' ')[0].toUpperCase();
  const t = I18N[lang];
  return (
    <section id="top" style={{
      position: 'relative', overflow: 'hidden',
      background: C.bg, borderBottom: `1px solid ${C.rule}`,
    }}>
      <VTag num={0} label="INDEX" color={C.cyan} />

      {/* faint background type */}
      <div aria-hidden style={{
        position: 'absolute', bottom: -24, right: 24, zIndex: 0,
        fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 0.78,
        fontSize: 'clamp(5rem, 14vw, 14rem)',
        color: 'transparent',
        WebkitTextStroke: `1px ${C.rule}`,
        letterSpacing: '-6px', textTransform: 'uppercase',
        userSelect: 'none', whiteSpace: 'nowrap', opacity: 0.5,
      }}>{heroDealerName}</div>

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'center',
        padding: '36px 48px 32px 96px',
        minHeight: '40vh',
      }} className="hero-grid">
        {/* LEFT — title + CTAs */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            opacity: 0, animation: 'fadeIn 500ms 80ms forwards',
          }}>
            <span style={{ width: 6, height: 6, background: C.red, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
            <span style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3,
              color: C.gold, fontWeight: 600,
            }}>FILE NO. 2026-MIA-0501 · MIAMI, FL · 128 UNITS</span>
          </div>

          <h1 key={lang} style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
            lineHeight: 0.94, letterSpacing: '-2px',
            color: C.ink, textTransform: 'uppercase',
            margin: 0, marginBottom: 14,
            opacity: 0, animation: 'slideRise 700ms 160ms forwards',
          }}>
            {t.title1}{' '}
            <span style={{
              color: 'transparent',
              WebkitTextStroke: `1px ${C.gold}`,
            }}>{t.title2}</span>
            <span style={{ color: C.red }}>.</span>
          </h1>

          <p key={`b-${lang}`} style={{
            fontFamily: FONT_BODY, color: C.inkDim,
            fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)', lineHeight: 1.55,
            maxWidth: 520, margin: 0, marginBottom: 22,
            opacity: 0, animation: 'fadeIn 600ms 320ms forwards',
          }}>{t.body}</p>

          <div style={{
            display: 'flex', gap: 0,
            opacity: 0, animation: 'fadeIn 600ms 460ms forwards',
          }}>
            <a href="#fleet" onClick={(e)=>{e.preventDefault();onCTA('fleet');}} style={{
              padding: '14px 24px', background: C.red, color: C.ink,
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
              letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
              paddingRight: 36,
              transition: 'background 180ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.gold}
            onMouseLeave={e => e.currentTarget.style.background = C.red}
            >{t.cta1}</a>
            <a href="#finance" onClick={(e)=>{e.preventDefault();onCTA('finance');}} style={{
              padding: '14px 22px 14px 12px', background: 'transparent',
              color: C.ink, border: `1px solid ${C.rule2}`, borderLeft: 'none',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
              letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
              marginLeft: -8,
              transition: 'border-color 180ms, color 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.rule2; e.currentTarget.style.color = C.ink; }}
            >{t.cta2}</a>
          </div>
        </div>

        {/* RIGHT — compact featured image */}
        <div style={{
          position: 'relative', alignSelf: 'stretch', minHeight: 220,
          opacity: 0, animation: 'fadeIn 800ms 380ms forwards',
        }} className="hero-img">
          <div style={{
            position: 'absolute', inset: 0,
            background: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85&auto=format,compress') center/cover no-repeat`,
            border: `1px solid ${C.rule2}`,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, transparent 40%, rgba(8,8,10,0.55) 100%)`,
          }} />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5,
            color: C.gold, fontWeight: 700,
            background: 'rgba(8,8,10,0.78)', padding: '4px 10px',
            border: `1px solid ${C.gold}`,
          }}>FEATURED · 8 NEW THIS WEEK</div>
        </div>
      </div>
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

