'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Footer() {
  const config = useCustomerConfig();
  const phoneDigits = (config.phone || '').replace(/\D/g, '');
  const yr = new Date().getFullYear();
  const monFri = config.hours?.monFri || '9 AM – 8 PM';
  const sat    = config.hours?.sat    || '9 AM – 6 PM';
  const sun    = config.hours?.sun    || '10 AM – 4 PM';

  const colLabel = (text) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
    }}>
      <span style={{ width: 20, height: 2, background: '#2AA5A0', borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5, color: '#2AA5A0', fontWeight: 700 }}>{text}</span>
    </div>
  );

  return (
    <footer style={{
      background: '#09090B', borderTop: `1px solid ${C.rule}`,
      padding: '56px 48px 24px 96px',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40,
        marginBottom: 40,
      }} className="footer-grid">
        {/* About */}
        <div>
          {colLabel('ABOUT')}
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, lineHeight: 1.7,
            marginTop: 0, marginBottom: 20, fontWeight: 500,
          }}>
            {config.tagline || `${config.address?.city || 'Your city'}'s most-trusted source for premium pre-owned vehicles.`}
            {' '}Real prices. Real inspection. Real talk.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['FB','Facebook'],['IG','Instagram'],['TT','TikTok'],['YT','YouTube'],['X','X']].map(([s, label]) => (
              <a key={s} href="#" aria-label={label} style={{
                width: 34, height: 34, borderRadius: 8,
                border: `1px solid ${C.rule2}`,
                color: C.inkDim, display: 'grid', placeItems: 'center',
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                textDecoration: 'none', transition: 'all 200ms ease-out',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#2AA5A0'; e.currentTarget.style.borderColor = '#2AA5A0'; e.currentTarget.style.background = 'rgba(42,165,160,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.inkDim; e.currentTarget.style.borderColor = C.rule2; e.currentTarget.style.background = 'transparent'; }}
              >{s}</a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          {colLabel('QUICK LINKS')}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {['Inventory', 'Pre-Approval', 'Trade-In', 'Payment Calc', 'Warranty', 'Reviews', 'How It Works'].map(l => (
              <li key={l}><a href="#" style={{
                fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, textDecoration: 'none',
                fontWeight: 500, transition: 'color 200ms ease-out',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#2AA5A0'}
              onMouseLeave={e => e.currentTarget.style.color = C.inkDim}
              >{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          {colLabel('CONTACT')}
          <div style={{ display: 'grid', gap: 12 }}>
            {config.phone && (
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 3 }}>PHONE</div>
                <a href={`tel:${phoneDigits}`} style={{ fontFamily: FONT_BODY, color: C.ink, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{config.phone}</a>
              </div>
            )}
            {config.email && (
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 3 }}>EMAIL</div>
                <a href={`mailto:${config.email}`} style={{ fontFamily: FONT_BODY, color: C.ink, fontSize: 14, fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>{config.email}</a>
              </div>
            )}
            {config.address?.street && (
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 3 }}>ADDRESS</div>
                <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, fontWeight: 500, lineHeight: 1.55 }}>
                  {config.address.street}<br />
                  {config.address.city}, {config.address.state} {config.address.zip}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hours */}
        <div>
          {colLabel('HOURS')}
          <div style={{ display: 'grid', gap: 12 }}>
            {[['MON – FRI', monFri], ['SATURDAY', sat], ['SUNDAY', sun]].map(([day, hrs]) => (
              <div key={day}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 3 }}>{day}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.ink, fontSize: 13, fontWeight: 600 }}>{hrs}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal strip */}
      <div style={{
        paddingTop: 22, borderTop: `1px solid ${C.rule}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 14,
        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
      }}>
        <div>© {yr} {(config.dealerName || 'Demo Auto Group').toUpperCase()} · ALL RIGHTS RESERVED</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['PRIVACY POLICY', 'TERMS', 'ACCESSIBILITY', 'SITEMAP'].map(l => (
            <a key={l} href="#" style={{ color: C.inkLow, textDecoration: 'none', transition: 'color 200ms ease-out' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2AA5A0'}
              onMouseLeave={e => e.currentTarget.style.color = C.inkLow}
            >{l}</a>
          ))}
        </div>
      </div>

      {/* Powered by */}
      <div style={{
        marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.rule}`,
        textAlign: 'center', fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow,
        letterSpacing: 1.5,
      }}>
        POWERED BY{' '}
        <a href="https://lotpilot.ai" target="_blank" rel="noreferrer" style={{
          color: '#2AA5A0', textDecoration: 'none', fontWeight: 700,
        }}>LOTPILOT.AI</a>
        {' '}— INTELLIGENT DEALER PLATFORM
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
