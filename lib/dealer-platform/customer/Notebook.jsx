'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Notebook() {
  const [ref, seen] = useInView();
  const POSTS = [
    {
      d: '2026-04-22', tag: 'BUYER TIPS', mins: 4,
      t: '5 things to check before buying a used car',
      ex: 'A no-nonsense list — what to inspect, what to ignore, and the one document you should always demand.',
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=85&auto=format,compress',
    },
    {
      d: '2026-04-09', tag: 'TRADE-IN', mins: 5,
      t: 'How to get the best trade-in value',
      ex: 'Three small things you can do today to add $500 to $1,500 to your offer. (Hint: detailing isn\'t one of them.)',
      img: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=900&q=85&auto=format,compress',
    },
    {
      d: '2026-03-30', tag: 'FINANCING', mins: 6,
      t: 'Understanding your credit score for auto financing',
      ex: 'How lenders actually think about credit scores, what tier gets you what rate, and how to bump your score before you apply.',
      img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85&auto=format,compress',
    },
  ];

  return (
    <section ref={ref} id="notebook" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={9} label="NOTEBOOK" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 44, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 12,
            }}>09 / NOTEBOOK</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.92,
              letterSpacing: '-1.5px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>Smarter buyers. <span style={{ color: C.gold }}>Better deals.</span></h2>
          </div>
          <a href="#" style={{
            fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.gold,
            textDecoration: 'none', borderBottom: `1px solid ${C.gold}`,
            paddingBottom: 2,
          }}>ALL ARTICLES →</a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="notebook-grid">
          {POSTS.map((p, i) => (
            <article key={p.t} style={{
              padding: 0, cursor: 'pointer',
              borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
              background: C.panel,
              transition: 'background 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = C.panel}
            >
              <div style={{
                aspectRatio: '16/10',
                background: `url('${p.img}') center/cover`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: C.bg, color: C.gold,
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
                  padding: '4px 10px', border: `1px solid ${C.gold}55`,
                }}>{p.tag}</div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
                  marginBottom: 12,
                }}>
                  <span>{p.d}</span>
                  <span>{p.mins} MIN READ</span>
                </div>
                <h3 style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20,
                  color: C.ink, letterSpacing: -0.3, lineHeight: 1.15,
                  margin: 0, marginBottom: 12,
                }}>{p.t}</h3>
                <p style={{
                  fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13,
                  lineHeight: 1.55, margin: 0, marginBottom: 16,
                }}>{p.ex}</p>
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
                  borderBottom: `1px solid ${C.gold}`, paddingBottom: 2,
                }}>READ →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 10 · CONTACT ──────────────────────────────── */
