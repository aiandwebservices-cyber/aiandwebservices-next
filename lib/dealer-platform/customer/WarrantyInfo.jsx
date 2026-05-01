'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Warranty() {
  const [ref, seen] = useInView();
  const tiers = [
    {
      tag: 'STANDARD',
      label: 'INCLUDED',
      title: '90 Days · 3,000 mi',
      sub: 'Powertrain coverage on every vehicle',
      bullets: ['Engine', 'Transmission', 'Drive Axle'],
      foot: 'Included with every purchase — no extra cost',
      featured: false,
    },
    {
      tag: 'CERTIFIED PRE-OWNED',
      label: '$999',
      title: '1 Year · 12,000 mi',
      sub: 'Comprehensive coverage',
      bullets: ['Everything in Standard', '+ A/C System', '+ Electrical', '+ Suspension'],
      foot: '172-point inspection required',
      featured: true,
    },
    {
      tag: 'EXTENDED',
      label: '$1,899',
      title: '3 Years · 36,000 mi',
      sub: 'Bumper-to-bumper protection',
      bullets: ['Total peace of mind', 'Covers almost everything', 'Transferable on resale'],
      foot: 'Best value · Most popular',
      featured: false,
    },
  ];

  return (
    <section ref={ref} id="warranty" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={5.5} label="WARRANTY" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>05.5 / WARRANTY PROMISE</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Coverage that <span style={{ color: C.red }}>holds up.</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Every vehicle ships with powertrain coverage. Want more peace of mind? Two upgrade tiers, no upsell pressure — just real protection.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          alignItems: 'stretch',
        }} className="warranty-grid">
          {tiers.map((tier, i) => (
            <div key={tier.tag} style={{
              position: 'relative',
              padding: 32,
              background: tier.featured
                ? `linear-gradient(160deg, #1A1408 0%, ${C.panel} 100%)`
                : C.panel,
              border: tier.featured ? `2px solid ${C.gold}` : `1px solid ${C.rule}`,
              borderLeft: i === 0 ? (tier.featured ? `2px solid ${C.gold}` : `1px solid ${C.rule}`) : (tier.featured ? `2px solid ${C.gold}` : 'none'),
              marginTop: tier.featured ? -8 : 0,
              marginBottom: tier.featured ? -8 : 0,
              boxShadow: tier.featured ? `0 0 30px ${C.gold}25` : 'none',
              zIndex: tier.featured ? 2 : 1,
              display: 'flex', flexDirection: 'column',
            }}>
              {tier.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: 24,
                  background: C.gold, color: '#08080A',
                  padding: '4px 12px',
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, fontWeight: 700,
                }}>★ RECOMMENDED</div>
              )}

              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5,
                color: tier.featured ? C.gold : C.inkLow, marginBottom: 6, fontWeight: 700,
              }}>{tier.tag}</div>

              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700,
                fontSize: tier.featured ? 32 : 26,
                color: tier.featured ? C.gold : C.ink,
                lineHeight: 1, letterSpacing: -1, marginBottom: 12,
              }}>{tier.label}</div>

              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                color: C.ink, letterSpacing: -0.3, marginBottom: 4,
                textTransform: 'uppercase',
              }}>{tier.title}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, marginBottom: 18 }}>{tier.sub}</div>

              <ul style={{
                listStyle: 'none', padding: 0, margin: 0, marginBottom: 18,
                borderTop: `1px solid ${C.rule}`,
              }}>
                {tier.bullets.map(b => (
                  <li key={b} style={{
                    padding: '10px 0', borderBottom: `1px solid ${C.rule}`,
                    fontFamily: FONT_BODY, fontSize: 13, color: C.ink,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: tier.featured ? C.gold : C.cyan, fontFamily: FONT_MONO, fontSize: 11 }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: 'auto',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 0.5,
                color: tier.featured ? C.gold : C.cyan, fontWeight: 700,
              }}>▸ {tier.foot}</div>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 28, paddingTop: 18, borderTop: `1px dashed ${C.rule2}`,
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.gold,
          textAlign: 'center', lineHeight: 1.6,
        }}>★ All warranty claims handled in-house at our service center · Same shop, same techs, same quality.</p>
      </div>
    </section>
  );
}

/* ─── Meet The Team Section ──────────────────────── */
