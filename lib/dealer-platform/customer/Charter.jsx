'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Charter() {
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
