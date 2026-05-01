'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function BeatPriceBadge({ onClick }) {
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
export function BeatPriceModal({ onClose }) {
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
