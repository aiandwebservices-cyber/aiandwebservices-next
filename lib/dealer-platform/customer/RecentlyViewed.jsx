'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function RecentlyViewed({ items, onView, onBuildDeal }) {
  return (
    <section style={{
      position: 'relative', padding: '60px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <div style={{ paddingLeft: 96, paddingRight: 48 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 6,
            }}>RECENTLY VIEWED</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: C.ink, letterSpacing: -0.8, textTransform: 'uppercase', margin: 0,
            }}>Pick up where you left off.</h2>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>
            ★ {items.length} ITEM{items.length === 1 ? '' : 'S'}
          </span>
        </div>

        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
        }}>
          {items.map(v => (
            <div key={v.id} style={{
              flex: '0 0 240px',
              background: C.panel, border: `1px solid ${C.rule}`,
            }}>
              <div style={{
                aspectRatio: '16/10',
                background: `url('${v.img}') center/cover`,
              }} />
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow, marginBottom: 3 }}>
                  {v.id} · {v.y}
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                  color: C.ink, letterSpacing: -0.2, lineHeight: 1.1,
                }}>{v.mk} {v.md}</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.gold, marginTop: 4,
                }}>{fmt(v.price)}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  <button onClick={() => onView(v)} style={{
                    flex: 1, padding: '7px 8px', background: C.gold, color: '#08080A',
                    border: 'none', cursor: 'pointer',
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                  }}>VIEW AGAIN</button>
                  <button onClick={() => onBuildDeal(v)} style={{
                    padding: '7px 8px', background: 'transparent', color: C.cyan,
                    border: `1px solid ${C.cyan}55`, cursor: 'pointer',
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                  }}>★ DEAL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   ROUND 3 · ADDITIONS
   Service · Warranty · Team · Reserve · Accessibility · Drive-time
═══════════════════════════════════════════════════════════════ */

/* ─── Service Scheduling Section ─────────────────── */
