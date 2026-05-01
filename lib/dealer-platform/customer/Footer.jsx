'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Footer() {
  const config = useCustomerConfig();
  const dealerName = (config.dealerName || 'Demo Auto Group').toUpperCase();
  const cityShort  = (config.address?.city || '').toUpperCase().slice(0, 3);
  const giantText  = `${dealerName} ${cityShort}`.trim();
  return (
    <footer style={{
      background: '#040406', borderTop: `1px solid ${C.rule}`,
      padding: '48px 48px 24px 96px',
    }}>
      {/* giant dealer-name type */}
      <div aria-hidden style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700,
        fontSize: 'clamp(4rem, 12vw, 9rem)',
        lineHeight: 0.85, letterSpacing: '-4px',
        color: 'transparent', WebkitTextStroke: `1px ${C.rule2}`,
        textTransform: 'uppercase', marginBottom: 36,
      }}>{giantText}</div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36,
        marginBottom: 40, paddingTop: 36, borderTop: `1px solid ${C.rule}`,
      }} className="footer-grid">
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5, color: C.gold,
            marginBottom: 10,
          }}>★ {(config.address?.city || '').toUpperCase()} · GROUP · {new Date().getFullYear()}</div>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, lineHeight: 1.55,
            marginTop: 0, marginBottom: 18,
          }}>
            {config.tagline || `${config.address?.city || 'Your city'}'s most-trusted source for premium pre-owned vehicles.`}
            {' '}Real prices. Real inspection. Real talk.
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
        <div>© {new Date().getFullYear()} {(config.dealerName || 'Demo Auto Group').toUpperCase()} · ALL RIGHTS RESERVED</div>
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
