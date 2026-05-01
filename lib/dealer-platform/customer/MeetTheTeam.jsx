'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function MeetTheTeam() {
  const cfg = useCustomerConfig();
  const phoneDigits = (cfg.phone || '').replace(/\D/g, '');
  const teamEmail = cfg.email || 'team@example.com';
  const [ref, seen] = useInView();
  const team = [
    { name: 'Carlos Rivera',  role: 'SALES MANAGER',         bio: '15 years helping Miami drivers find the perfect car.', initials: 'CR', tone: C.gold },
    { name: 'Maria Santos',   role: 'FINANCE DIRECTOR',      bio: 'Making car ownership affordable for every budget.',    initials: 'MS', tone: C.cyan },
    { name: 'James Mitchell', role: 'SALES CONSULTANT',      bio: 'Your car, your terms. No pressure, ever.',             initials: 'JM', tone: C.red  },
    { name: 'Ana Gutierrez',  role: 'SERVICIO EN ESPAÑOL',   bio: 'Aquí para ayudarte en cada paso.',                     initials: 'AG', tone: C.gold },
  ];

  return (
    <section ref={ref} id="team" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={7.5} label="THE CREW" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 56, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>07.5 / THE CREW</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Meet the <span style={{ color: C.gold }}>team.</span></h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="team-grid">
          {team.map((m, i) => (
            <div key={m.name} style={{
              padding: 28, background: i % 2 === 0 ? C.panel : C.bg2,
              borderRight: i < 3 ? `1px solid ${C.rule}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {/* avatar */}
              <div style={{
                width: 72, height: 72, position: 'relative',
                background: `linear-gradient(135deg, ${m.tone}, ${m.tone}55)`,
                border: `1px solid ${m.tone}`,
                clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                display: 'grid', placeItems: 'center',
              }}>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: '#08080A', letterSpacing: -0.5,
                }}>{m.initials}</span>
              </div>

              <div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                  color: C.ink, letterSpacing: -0.3, lineHeight: 1.1, marginBottom: 4,
                }}>{m.name}</div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.8,
                  color: m.tone, fontWeight: 700,
                }}>{m.role}</div>
              </div>

              <p style={{
                fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.55,
                margin: 0, flex: 1,
              }}>"{m.bio}"</p>

              <div style={{
                paddingTop: 12, borderTop: `1px dashed ${C.rule2}`,
                display: 'flex', gap: 6,
              }}>
                <a href={`tel:${phoneDigits}`} title="Call" style={{
                  flex: 1, padding: '8px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  color: C.gold, textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 180ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.rule2}
                >📞 CALL</a>
                <a href={`mailto:${teamEmail}`} title="Email" style={{
                  flex: 1, padding: '8px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  color: C.cyan, textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 180ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.cyan}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.rule2}
                >✉ EMAIL</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reserve Vehicle Modal ──────────────────────── */
