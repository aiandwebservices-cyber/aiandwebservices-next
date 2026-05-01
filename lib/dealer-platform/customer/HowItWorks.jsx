'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Process() {
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
