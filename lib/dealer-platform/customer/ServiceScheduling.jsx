'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function ServiceSchedule() {
  const [ref, seen] = useInView();
  const [submitted, setSubmitted] = useState(false);

  const services = [
    ['Oil Change & Filter',       49.95],
    ['Tire Rotation',             29.95],
    ['Brake Inspection',          0],
    ['Check Engine Diagnostic',   89.95],
    ['State Inspection',          29.95],
    ['A/C Service',               129.95],
    ['Full Detail',               199.95],
    ['Other',                     null],
  ];

  return (
    <section ref={ref} id="service" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3.7} label="SERVICE BAY" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{ marginBottom: 48, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12,
          }}>03.7 / SERVICE BAY</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Schedule <span style={{ color: C.gold }}>service.</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Keep your vehicle running like new. Factory-trained technicians. Competitive pricing. We service all makes — yours doesn't have to come from us.
          </p>
        </div>

        {/* form panel */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '1.4fr 1fr',
        }} className="service-grid">
          {/* form */}
          <div style={{ padding: 32, borderRight: `1px solid ${C.rule}` }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 78, height: 78, borderRadius: '50%',
                  background: `${C.gold}22`, border: `2px solid ${C.gold}`,
                  display: 'grid', placeItems: 'center', margin: '0 auto 22px',
                  color: C.gold, fontSize: 34,
                }}>✓</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
                }}>Appointment Confirmed.</div>
                <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                  We'll text you a reminder <strong style={{ color: C.gold }}>24 hours before</strong> your appointment.
                </div>
                <button onClick={() => setSubmitted(false)} style={{
                  background: 'transparent', color: C.cyan,
                  border: `1px solid ${C.cyan}55`, padding: '10px 20px', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
                }}>+ BOOK ANOTHER</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 18,
                }}>★ APPOINTMENT REQUEST</div>

                {/* contact row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }} className="srv-row3">
                  {[['NAME', 'text', 'Jane Doe'], ['PHONE', 'tel', '(305) 555-0123'], ['EMAIL', 'email', 'you@email.com']].map(([lab, t, ph]) => (
                    <div key={lab}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                      <input type={t} placeholder={ph} required style={{
                        width: '100%', background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                        padding: '6px 0', letterSpacing: 0.5,
                      }} />
                    </div>
                  ))}
                </div>

                {/* vehicle row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }} className="srv-row3">
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>VEHICLE YEAR</div>
                    <select style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['2024','2023','2022','2021','2020','2019','2018','2017','OLDER'].map(y => (
                        <option key={y} style={{ background: C.panel }}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>MAKE</div>
                    <select style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['BMW','Mercedes-Benz','Audi','Lexus','Tesla','Porsche','Range Rover','Cadillac','Toyota','Honda','Ford','Chevy','Other'].map(m => (
                        <option key={m} style={{ background: C.panel }}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>MODEL</div>
                    <input type="text" placeholder="X5" required style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', letterSpacing: 0.5,
                    }} />
                  </div>
                </div>

                {/* service type */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>SERVICE TYPE</div>
                  <select required style={{
                    width: '100%', appearance: 'none', background: 'transparent',
                    border: 'none', borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                    padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                  }}>
                    {services.map(([name, price]) => (
                      <option key={name} style={{ background: C.panel }}>
                        {name}{price === 0 ? '  ·  FREE' : price ? `  ·  $${price.toFixed(2)}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* date/time row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>PREFERRED DATE</div>
                    <input type="date" required style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                      padding: '6px 0', colorScheme: 'dark',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>PREFERRED TIME</div>
                    <select required style={{
                      width: '100%', appearance: 'none', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                      padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                    }}>
                      {['8:00 AM','9:30 AM','11:00 AM','1:00 PM','2:30 PM','4:00 PM','5:30 PM'].map(t => (
                        <option key={t} style={{ background: C.panel }}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* notes */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>NOTES (OPTIONAL)</div>
                  <textarea rows={3} placeholder="ANYTHING WE SHOULD KNOW..." style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
                    padding: '6px 0', resize: 'vertical', letterSpacing: 0.5,
                  }} />
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '16px 20px',
                  background: C.gold, color: '#08080A', border: 'none', cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>▸ Schedule Now</button>
              </form>
            )}
          </div>

          {/* coupons sidebar */}
          <div style={{ padding: 28, background: C.bg2 }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold, marginBottom: 4,
            }}>★ ACTIVE COUPONS</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
              color: C.ink, letterSpacing: -0.3, marginBottom: 18,
            }}>Stack the savings.</div>

            {[
              { tag: 'NEW · CUSTOMERS', t: 'First Oil Change FREE', s: 'For new customers · One-time' },
              { tag: '$50 · OFF',       t: 'Brake Service Special', s: 'Any brake job · Pad or rotor' },
              { tag: 'BUNDLE',          t: 'Free Multi-Point Inspection', s: 'With any paid service' },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'relative', marginBottom: 12,
                background: C.bg, border: `1px dashed ${C.gold}`,
                padding: 14,
              }}>
                {/* corner notches */}
                <span style={{
                  position: 'absolute', top: -1, left: -1, width: 8, height: 8,
                  borderTop: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}`,
                }} />
                <span style={{
                  position: 'absolute', top: -1, right: -1, width: 8, height: 8,
                  borderTop: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}`,
                }} />
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold, fontWeight: 700, marginBottom: 4 }}>
                  ▸ {c.tag}
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                  color: C.ink, letterSpacing: -0.2, lineHeight: 1.2, marginBottom: 4,
                }}>{c.t}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.inkDim }}>{c.s}</div>
              </div>
            ))}

            <div style={{
              marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.rule}`,
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.cyan, lineHeight: 1.6,
            }}>
              ▸ All makes serviced<br />
              ▸ Loaner cars available<br />
              ▸ Open Sat 9-4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Warranty Tiers Section ─────────────────────── */
