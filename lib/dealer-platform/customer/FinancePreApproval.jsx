'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Finance() {
  const [ref, seen] = useInView();
  const config = useCustomerConfig();
  const [fv, setFv] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    employment: 'W-2 EMPLOYEE', income: 'UNDER $3K', creditBand: 'EXCELLENT (750+)',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const setField = (key) => (e) => setFv(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!fv.firstName || (!fv.email && !fv.phone)) return;
    setSubmitting(true); setFormError('');
    try {
      const slug = config.dealerSlug || 'primo';
      const res = await fetch(`/api/dealer/${slug}/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'PreApproval',
          firstName: fv.firstName, lastName: fv.lastName,
          email: fv.email, phone: fv.phone,
          downPayment: '', financeTerm: '', creditTier: fv.creditBand,
          estimatedPayment: '',
        }),
      });
      const data = await res.json();
      if (data.ok) setSubmitted(true);
      else setFormError(`Something went wrong. Call us at ${config.phone || 'the dealership'} for immediate help.`);
    } catch { setFormError(`Something went wrong. Call us at ${config.phone || 'the dealership'} for immediate help.`); }
    finally { setSubmitting(false); }
  };

  return (
    <section ref={ref} id="finance" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={4} label="FINANCE QUALIFICATION" color={C.gold} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }}>
        {/* head */}
        <div style={{ marginBottom: 48, maxWidth: 760 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>04 / PRE-APPROVAL · 60 SECONDS</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Get qualified <span style={{ color: C.red }}>without</span> the credit hit.</h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, lineHeight: 1.55, margin: 0,
          }}>
            Soft credit pull. No SSN required. No impact to your score. We work with five major lenders — <strong style={{ color: C.ink }}>excellent, fair, rebuilding, all of it.</strong>
          </p>
        </div>

        {/* form — split into 2 columns */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }} className="finance-split">
          {/* left: form or success */}
          <div style={{ padding: 32, borderRight: `1px solid ${C.rule}` }}>
            {submitted ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                  color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 10,
                }}>Thanks {fv.firstName}!</div>
                <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55 }}>
                  We'll be in touch shortly.
                </div>
              </div>
            ) : (
              <>
                {[
                  { lab: 'FIRST NAME',         key: 'firstName', t: 'text',   ph: 'JANE' },
                  { lab: 'LAST NAME',          key: 'lastName',  t: 'text',   ph: 'DOE' },
                  { lab: 'EMAIL',              key: 'email',     t: 'email',  ph: 'jane@email.com' },
                  { lab: 'PHONE',              key: 'phone',     t: 'tel',    ph: '(305) 555-0123' },
                  { lab: 'EMPLOYMENT STATUS',  key: 'employment',t: 'select', opts: ['W-2 EMPLOYEE', 'SELF-EMPLOYED', 'RETIRED', '1099 / CONTRACTOR', 'OTHER'] },
                  { lab: 'MONTHLY INCOME',     key: 'income',    t: 'select', opts: ['UNDER $3K', '$3-5K', '$5-8K', '$8-12K', 'OVER $12K'] },
                  { lab: 'CREDIT BAND',        key: 'creditBand',t: 'select', opts: ['EXCELLENT (750+)', 'GOOD (700-749)', 'FAIR (600-699)', 'REBUILDING (<600)'] },
                ].map(f => (
                  <div key={f.lab} style={{ marginBottom: 14 }}>
                    <div style={{
                      fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow,
                      marginBottom: 4,
                    }}>{f.lab}</div>
                    {f.t === 'select' ? (
                      <select value={fv[f.key]} onChange={setField(f.key)} style={{
                        width: '100%', appearance: 'none',
                        background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                        padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                      }}>{f.opts.map(o => <option key={o} style={{ background: C.panel }}>{o}</option>)}</select>
                    ) : (
                      <input type={f.t} placeholder={f.ph} value={fv[f.key]} onChange={setField(f.key)} style={{
                        width: '100%', background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                        padding: '6px 0', letterSpacing: 0.5,
                      }} />
                    )}
                  </div>
                ))}

                {formError && (
                  <div style={{ marginBottom: 10, color: '#EF4444', fontFamily: FONT_BODY, fontSize: 13 }}>
                    {formError}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting || !fv.firstName || (!fv.email && !fv.phone)} style={{
                  width: '100%', padding: '16px 20px', marginTop: 18,
                  background: (submitting || !fv.firstName || (!fv.email && !fv.phone)) ? C.rule2 : C.gold,
                  color: (submitting || !fv.firstName || (!fv.email && !fv.phone)) ? C.inkLow : C.bg,
                  border: 'none', cursor: (submitting || !fv.firstName || (!fv.email && !fv.phone)) ? 'not-allowed' : 'pointer',
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                  letterSpacing: 2, textTransform: 'uppercase',
                }}>{submitting ? 'Submitting...' : '🔒 Check My Rate'}</button>
              </>
            )}
          </div>

          {/* right: assurance + lenders */}
          <div style={{ padding: 32, background: C.bg2 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                marginBottom: 10,
              }}>SECURITY · TRUST</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {[
                  ['256-BIT', 'Bank-grade end-to-end encryption'],
                  ['NO SSN', 'Quote without disclosing your SSN'],
                  ['SOFT', 'Soft credit pull only — zero impact'],
                  ['SECURE', 'No data resold or shared, ever'],
                ].map(([k, v]) => (
                  <li key={k} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10, alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.gold,
                      fontWeight: 700,
                    }}>{k}</span>
                    <span style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13 }}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.rule}` }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                marginBottom: 14,
              }}>LENDER PARTNERS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${C.rule}` }}>
                {['CAPITAL ONE AUTO', 'CHASE AUTO', 'ALLY FINANCIAL', 'WELLS FARGO', 'TD AUTO', 'SANTANDER'].map((b, i) => (
                  <div key={b} style={{
                    padding: '12px 14px',
                    borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
                    borderTop: i >= 2 ? `1px solid ${C.rule}` : 'none',
                    fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
                    color: C.ink, letterSpacing: 0.5,
                  }}>{b}</div>
                ))}
              </div>
            </div>

            <p style={{
              marginTop: 24, fontFamily: FONT_MONO, fontSize: 11, color: C.gold,
              letterSpacing: 1, lineHeight: 1.6,
            }}>
              ▸ BAD CREDIT? NO CREDIT?<br />
              ▸ BANKRUPTCY? RECENT REPO?<br />
              ▸ <span style={{ color: C.ink }}>WE WORK WITH ALL CREDIT SITUATIONS.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 05 · CHARTER (Why) ────────────────────────── */
