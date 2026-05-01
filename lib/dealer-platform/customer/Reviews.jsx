'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Voices() {
  const [ref, seen] = useInView();
  const REV = [
    { name: 'Marcus J.',  car: '2023 BMW X5',           date: '2026-04-18', text: 'Found my BMW online, got pre-approved in literally 90 seconds, and drove it home the next day. Zero pressure. The CARFAX was clean and the price was already below market.' },
    { name: 'Daniela R.', car: '2022 Mercedes GLE',     date: '2026-04-11', text: 'I was dreading the dealership experience. PRIMO was a different planet. Sam in finance got me 4.1% APR with my 680 score — better than my credit union. They delivered to my house in Coral Gables.' },
    { name: 'Anthony C.', car: '2024 Audi Q5',          date: '2026-04-03', text: 'Test drove three SUVs in one afternoon. No salesperson hovering. Honest answers, transparent pricing. Bought the Q5, took the trade-in offer for my Civic — all-in done in under 3 hours.' },
    { name: 'Priya S.',   car: '2023 Tesla Model Y',    date: '2026-03-28', text: 'Honestly the best used car experience I\'ve had. Inspection report was on the windshield. They even let me bring it to my own mechanic for a second look before signing.' },
    { name: 'Jorge L.',   car: '2022 Cadillac Escalade',date: '2026-03-21', text: 'Hablan español, lo cual fue clave para mi mamá. Trato profesional, sin presión, y el precio fue justo. Recomiendo Primo a cualquier familia latina.' },
  ];

  return (
    <section ref={ref} id="voices" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={7} label="VOICES · 4.9 ★" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 50, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 12,
            }}>07 / VOICES</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
              letterSpacing: '-1.8px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>Real owners. <span style={{ color: C.red }}>Real receipts.</span></h2>
          </div>

          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 16,
            border: `1px solid ${C.rule2}`, padding: '12px 18px',
          }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 38,
              color: C.gold, lineHeight: 1,
            }}>4.9</div>
            <div>
              <div style={{ color: C.gold, letterSpacing: 1 }}>★★★★★</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow }}>847 GOOGLE REVIEWS</div>
            </div>
          </div>
        </div>

        {/* feed — telemetry log style */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="voices-grid">
          {REV.map((r, i) => (
            <article key={i} style={{
              padding: 28,
              borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
              borderBottom: i < REV.length - 2 ? `1px solid ${C.rule}` : 'none',
              background: i % 2 === 0 ? C.panel : C.bg2,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 14,
              }}>
                <div style={{ color: C.gold, fontSize: 12, letterSpacing: 1 }}>★★★★★</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.inkLow,
                }}>{r.date}</div>
              </div>
              <p style={{
                fontFamily: FONT_BODY, color: C.ink, fontSize: 15, lineHeight: 1.55,
                margin: 0, marginBottom: 16,
              }}>"{r.text}"</p>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingTop: 12, borderTop: `1px dashed ${C.rule2}`,
              }}>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                  color: C.ink, letterSpacing: 0.5,
                }}>{r.name}</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.cyan,
                }}>{r.car}</div>
              </div>
            </article>
          ))}
        </div>

        {/* platform tags */}
        <div style={{
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.rule}`,
        }}>
          {['GOOGLE · 4.9', 'YELP · 4.8', 'CARS.COM · 4.9', 'DEALERRATER · 4.9'].map(p => (
            <span key={p} style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
            }}>★ {p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 08 · ALERTS ────────────────────────────────── */
