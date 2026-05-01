'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function CountersBlock() {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 24, height: 3, background: '#2AA5A0', borderRadius: 2, display: 'inline-block' }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: '#2AA5A0' }}>SOCIAL PROOF</span>
          </div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
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
