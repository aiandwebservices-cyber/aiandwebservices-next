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
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const team = [
    { name: 'Carlos Rivera',  role: 'SALES MANAGER',         bio: '15 years helping local drivers find the perfect car.', initials: 'CR', tone: '#2AA5A0' },
    { name: 'Maria Santos',   role: 'FINANCE DIRECTOR',      bio: 'Making car ownership affordable for every budget.',    initials: 'MS', tone: C.gold },
    { name: 'James Mitchell', role: 'SALES CONSULTANT',      bio: 'Your car, your terms. No pressure, ever.',             initials: 'JM', tone: C.red  },
    { name: 'Ana Gutierrez',  role: 'SERVICIO EN ESPAÑOL',   bio: 'Aquí para ayudarte en cada paso.',                     initials: 'AG', tone: '#2AA5A0' },
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 28, height: 3, background: '#2AA5A0', borderRadius: 2, display: 'inline-block' }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: '#2AA5A0' }}>07.5 / THE CREW</span>
          </div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 800,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase',
          }}>Meet the <span style={{ color: '#2AA5A0' }}>team.</span></h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
        }} className="team-grid">
          {team.map((m, i) => (
            <div
              key={m.name}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
              style={{
                padding: 28, background: C.panel,
                border: `1px solid ${C.rule}`, borderRadius: 12,
                margin: 8,
                display: 'flex', flexDirection: 'column', gap: 14,
                position: 'relative', overflow: 'hidden',
                transition: 'box-shadow 200ms ease-out, transform 200ms ease-out',
                boxShadow: hoveredIdx === i ? `0 8px 24px rgba(0,0,0,0.24), 0 0 0 1px ${m.tone}33` : '0 0 0 1px rgba(255,255,255,0.04)',
                transform: hoveredIdx === i ? 'translateY(-3px)' : 'none',
              }}
            >
              {/* Avatar — circular */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%', position: 'relative',
                background: `linear-gradient(135deg, ${m.tone}33, ${m.tone}66)`,
                border: `2px solid ${m.tone}`,
                display: 'grid', placeItems: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22,
                  color: m.tone, letterSpacing: -0.5,
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
                fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.6,
                margin: 0, flex: 1, fontStyle: 'italic',
              }}>"{m.bio}"</p>

              <div style={{
                paddingTop: 12, borderTop: `1px solid ${C.rule}`,
                display: 'flex', gap: 8,
              }}>
                <a href={`tel:${phoneDigits}`} title="Call" style={{
                  flex: 1, padding: '9px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  borderRadius: 6,
                  color: '#2AA5A0', textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 200ms ease-out',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(42,165,160,0.1)'; e.currentTarget.style.borderColor = '#2AA5A0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.rule2; }}
                >📞 CALL</a>
                <a href={`mailto:${teamEmail}`} title="Email" style={{
                  flex: 1, padding: '9px',
                  background: 'transparent', border: `1px solid ${C.rule2}`,
                  borderRadius: 6,
                  color: '#2AA5A0', textAlign: 'center', textDecoration: 'none',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                  transition: 'all 200ms ease-out',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(42,165,160,0.1)'; e.currentTarget.style.borderColor = '#2AA5A0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.rule2; }}
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
