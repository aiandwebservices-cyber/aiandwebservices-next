'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Contact() {
  const config = useCustomerConfig();
  const phoneDigits = (config.phone || '').replace(/\D/g, '');
  const addrStreet = (config.address?.street || '').toUpperCase();
  const addrCityState = `${(config.address?.city || '').toUpperCase()}, ${(config.address?.state || '').toUpperCase()} ${config.address?.zip || ''}`.trim();
  const [ref, seen] = useInView();
  const [driveZip, setDriveZip] = useState('');
  const driveZipValid = /^\d{5}$/.test(driveZip);
  let driveMsg = null, driveTone = C.cyan;
  if (driveZipValid) {
    if (/^33\d{3}$/.test(driveZip)) { driveMsg = "You're about 15-25 minutes away."; driveTone = C.gold; }
    else if (/^34\d{3}$/.test(driveZip)) { driveMsg = 'About 45 minutes — worth the drive!'; driveTone = C.gold; }
    else if (/^3[0-2]\d{3}$/.test(driveZip)) { driveMsg = 'We deliver statewide! Schedule delivery in any vehicle drawer.'; driveTone = C.cyan; }
    else { driveMsg = 'We ship nationwide! Call for a quote.'; driveTone = C.red; }
  }
  return (
    <section ref={ref} id="contact" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={10} label="CONTACT · MIA" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        <div style={{ marginBottom: 50, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>10 / CONTACT</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Drop in. <span style={{ color: C.red }}>We're here.</span></h2>
          <span style={{
            display: 'inline-block', padding: '6px 14px',
            border: `1px solid ${C.gold}`,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
            fontWeight: 700,
          }}>★ HABLAMOS ESPAÑOL</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule}`,
        }} className="contact-split">
          {/* left: location & map */}
          <div style={{ borderRight: `1px solid ${C.rule}` }}>
            {/* fake map */}
            <div style={{
              aspectRatio: '16/10', position: 'relative',
              background: `radial-gradient(ellipse at 60% 50%, #1a2030 0%, ${C.bg2} 80%)`,
              backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <line x1="0" y1="40%" x2="100%" y2="55%" stroke={`${C.gold}44`} strokeWidth="2" />
                <line x1="30%" y1="0" x2="40%" y2="100%" stroke={`${C.gold}44`} strokeWidth="2" />
                <line x1="0" y1="80%" x2="100%" y2="70%" stroke={`${C.gold}22`} strokeWidth="1" />
              </svg>
              {/* pin */}
              <div style={{
                position: 'absolute', top: '46%', left: '54%',
                transform: 'translate(-50%, -100%)',
              }}>
                <div style={{
                  width: 16, height: 16, background: C.red, borderRadius: '50%',
                  border: `3px solid ${C.gold}`,
                  boxShadow: `0 0 0 8px ${C.red}33`,
                  animation: 'pinPulse 2s ease-in-out infinite',
                }} />
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow,
                marginBottom: 8,
              }}>SHOWROOM</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, marginBottom: 16,
              }}>{addrStreet}<br />{addrCityState}</div>

              <div style={{ display: 'grid', gap: 14, paddingTop: 18, borderTop: `1px solid ${C.rule}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>HOTLINE</span>
                  <a href={`tel:${phoneDigits}`} style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, textDecoration: 'none', letterSpacing: 0.5 }}>{config.phone}</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>MON–SAT</span>
                  <span style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>9 AM – 8 PM</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold }}>SUNDAY</span>
                  <span style={{ color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>10 AM – 6 PM</span>
                </div>
              </div>

              {/* drive-time estimator */}
              <div style={{
                marginTop: 22, padding: 14,
                background: C.bg, border: `1px dashed ${C.rule2}`,
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  HOW FAR ARE YOU?
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text" placeholder="YOUR ZIP" maxLength={5}
                    value={driveZip}
                    onChange={e => setDriveZip(e.target.value.replace(/\D/g, ''))}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                      padding: '8px 4px', letterSpacing: 2,
                    }}
                  />
                </div>
                {driveMsg && (
                  <div style={{
                    marginTop: 10, padding: '8px 10px',
                    background: `${driveTone}15`, border: `1px solid ${driveTone}55`,
                    fontFamily: FONT_MONO, fontSize: 11, color: driveTone, lineHeight: 1.5,
                    fontWeight: 700, letterSpacing: 0.3,
                  }}>▸ {driveMsg}</div>
                )}
              </div>

              <a
                href={driveZipValid
                  ? `https://maps.google.com/?saddr=${driveZip}&daddr=${encodeURIComponent(addrStreet + ' ' + addrCityState)}`
                  : `https://maps.google.com/?daddr=${encodeURIComponent(addrStreet + ' ' + addrCityState)}`}
                target="_blank" rel="noreferrer"
                style={{
                marginTop: 16, display: 'inline-block',
                padding: '12px 22px', background: 'transparent', color: C.gold,
                border: `1px solid ${C.gold}`,
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, fontWeight: 700,
                textDecoration: 'none', textTransform: 'uppercase',
              }}>↗ GET DIRECTIONS</a>
            </div>
          </div>

          {/* right: contact form */}
          <div style={{ padding: 32, background: C.bg2 }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
              marginBottom: 8,
            }}>SEND A MESSAGE</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, marginBottom: 24,
            }}>WE REPLY WITHIN THE HOUR.</div>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { lab: 'NAME',     t: 'text',     ph: 'YOUR NAME' },
                { lab: 'PHONE',    t: 'tel',      ph: '(305) 555-0123' },
                { lab: 'EMAIL',    t: 'email',    ph: 'YOU@EMAIL.COM' },
                { lab: 'MESSAGE',  t: 'textarea', ph: 'WHAT CAN WE HELP YOU FIND?' },
              ].map(f => (
                <div key={f.lab}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{f.lab}</div>
                  {f.t === 'textarea' ? (
                    <textarea placeholder={f.ph} rows={4} style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                      padding: '6px 0', resize: 'vertical',
                    }} />
                  ) : (
                    <input type={f.t} placeholder={f.ph} style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                      padding: '6px 0', letterSpacing: 0.5,
                    }} />
                  )}
                </div>
              ))}
              <button style={{
                marginTop: 8, padding: 16,
                background: C.red, color: C.ink, border: 'none', cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
                textTransform: 'uppercase',
              }}>▸ TRANSMIT</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────── */
