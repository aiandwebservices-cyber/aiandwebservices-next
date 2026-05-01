'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function WhyPreOwned() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3.5} label="WHY PRE-OWNED" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 720 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>03.5 / WHY PRE-OWNED</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Why buy <span style={{ color: C.red }}>pre-owned?</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, marginTop: 14, marginBottom: 0,
          }}>
            Smart buyers don't pay $13,500 to drive off the lot. They put that money toward equity, freedom, or just living.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="preowned-grid">
          {/* Card 1 — New */}
          <div style={{ padding: 28, borderRight: `1px solid ${C.rule}`, background: C.panel }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.inkLow, marginBottom: 8,
            }}>SCENARIO A</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>New Car</div>
            {/* dep curve */}
            <div style={{
              height: 60, position: 'relative', marginBottom: 14,
              background: C.bg, border: `1px solid ${C.rule}`,
            }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 0 8 Q 50 20, 200 50" stroke={C.red} strokeWidth="2" fill="none" />
              </svg>
              <span style={{ position: 'absolute', top: 4, left: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.inkLow }}>$45K</span>
              <span style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.red }}>$31.5K</span>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink, lineHeight: 1.2 }}>
              $45,000 → <span style={{ color: C.red }}>$31,500</span><br />
              <span style={{ fontSize: 12, color: C.inkDim, fontWeight: 500 }}>in 3 years</span>
            </div>
            <div style={{
              marginTop: 14, padding: '10px 12px', background: `${C.red}11`,
              border: `1px solid ${C.red}55`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5, color: C.red, fontWeight: 700,
            }}>− $13,500 to depreciation</div>
          </div>

          {/* Card 2 — CPO */}
          <div style={{ padding: 28, borderRight: `1px solid ${C.rule}`, background: C.panel }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.inkLow, marginBottom: 8,
            }}>SCENARIO B</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>Certified Pre-Owned</div>
            <div style={{
              height: 60, position: 'relative', marginBottom: 14,
              background: C.bg, border: `1px solid ${C.rule}`,
            }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 0 18 Q 100 28, 200 42" stroke={C.cyan} strokeWidth="2" fill="none" />
              </svg>
              <span style={{ position: 'absolute', top: 4, left: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.inkLow }}>$32K</span>
              <span style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: FONT_MONO, fontSize: 8, color: C.cyan }}>$24K</span>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink, lineHeight: 1.2 }}>
              $32,000 → <span style={{ color: C.cyan }}>$24,000</span><br />
              <span style={{ fontSize: 12, color: C.inkDim, fontWeight: 500 }}>in 3 years</span>
            </div>
            <div style={{
              marginTop: 14, padding: '10px 12px', background: 'rgba(91,227,255,0.07)',
              border: `1px solid ${C.cyan}55`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5, color: C.cyan, fontWeight: 700,
            }}>+ Buy smart. Save $9,500+</div>
          </div>

          {/* Card 3 — Savings */}
          <div style={{
            padding: 28, background: `linear-gradient(160deg, #1A1408 0%, ${C.panel} 100%)`,
          }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold, marginBottom: 8,
            }}>★ YOUR SAVINGS</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 14,
            }}>Pure Win.</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              color: C.gold, lineHeight: 1, letterSpacing: -3, margin: '14px 0',
            }}>$9,500<span style={{ fontSize: '0.5em' }}>+</span></div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.5,
            }}>Average savings vs. buying new — money you keep, invest, or use for upgrades, gas, insurance.</div>
            <div style={{
              marginTop: 16, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.gold, fontWeight: 700,
            }}>★ Smart buyers choose pre-owned.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Recently Viewed (above footer) ────────────── */
