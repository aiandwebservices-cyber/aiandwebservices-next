'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Alerts() {
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
