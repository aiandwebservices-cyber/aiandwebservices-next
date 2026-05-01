'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function ReserveModal({ vehicle, onClose, onReserve }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [rvName, setRvName] = useState('');
  const [rvEmail, setRvEmail] = useState('');
  const [rvPhone, setRvPhone] = useState('');
  const config = useCustomerConfig();
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 240); };

  const submit = async (e) => {
    e.preventDefault();
    if (!rvName || (!rvEmail && !rvPhone)) return;
    setSubmitting(true); setFormError('');
    try {
      const slug = config.dealerSlug || 'primo';
      const res = await fetch(`/api/dealer/${slug}/reserve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: rvName,
          customerEmail: rvEmail,
          customerPhone: rvPhone,
          depositAmount: 500,
        }),
      });
      const data = await res.json();
      if (data.ok) { onReserve && onReserve(vehicle.id); setSubmitted(true); }
      else setFormError(`Something went wrong. Call us at ${config.phone || 'the dealership'} for immediate help.`);
    } catch { setFormError(`Something went wrong. Call us at ${config.phone || 'the dealership'} for immediate help.`); }
    finally { setSubmitting(false); }
  };

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 112,
      background: open ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(8px)' : 'none',
      transition: 'all 240ms',
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(560px, 100%)', maxHeight: '90vh', overflowY: 'auto',
        background: C.bg, border: `1px solid ${C.gold}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.gold}25`,
        opacity: open ? 1 : 0, transform: open ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold }}>
              ★ RESERVE · 48-HOUR HOLD
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>Lock this vehicle</div>
          </div>
          <button onClick={close} style={{
            width: 36, height: 36, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* vehicle strip */}
        <div style={{
          padding: 20, borderBottom: `1px solid ${C.rule}`,
          display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'center',
          background: C.panel,
        }}>
          <div style={{
            aspectRatio: '4/3',
            background: `url('${vehicle.img}') center/cover`,
            border: `1px solid ${C.rule}`,
          }} />
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow }}>
              STOCK · {vehicle.id}
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>{vehicle.y} {vehicle.mk} {vehicle.md}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.gold, marginTop: 6,
            }}>{fmt(vehicle.price)}</div>
          </div>
        </div>

        {submitted ? (
          <div style={{ padding: '40px 28px', textAlign: 'center' }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              background: `${C.gold}22`, border: `2px solid ${C.gold}`,
              display: 'grid', placeItems: 'center', margin: '0 auto 22px',
              color: C.gold, fontSize: 34,
            }}>✓</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
              color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
            }}>Reserved.</div>
            <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
              This vehicle is held for you for <strong style={{ color: C.gold }}>48 hours</strong>.
              A team member will confirm within 15 minutes.
            </div>
            <div style={{
              display: 'inline-block', padding: '8px 18px',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.cyan,
              border: `1px solid ${C.cyan}55`,
            }}>★ HOLD ID · R-{vehicle.id}-{Date.now().toString().slice(-5)}</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ padding: 24 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 14, color: C.inkDim, lineHeight: 1.55,
              margin: 0, marginBottom: 20,
            }}>
              Hold this vehicle for 48 hours with a <strong style={{ color: C.gold }}>$500 fully refundable</strong> deposit. No obligation. No pressure.
            </p>

            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              {[
                ['NAME',  'text',  'Jane Doe',          rvName,  setRvName],
                ['EMAIL', 'email', 'you@email.com',     rvEmail, setRvEmail],
                ['PHONE', 'tel',   '(305) 555-0123',    rvPhone, setRvPhone],
              ].map(([lab, t, ph, val, setter]) => (
                <div key={lab}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                  <input type={t} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                    padding: '6px 0', letterSpacing: 0.5,
                  }} />
                </div>
              ))}
            </div>

            {formError && (
              <div style={{ marginBottom: 10, color: '#EF4444', fontFamily: FONT_BODY, fontSize: 13 }}>
                {formError}
              </div>
            )}

            <button type="submit" disabled={submitting} style={{
              width: '100%', padding: 16, background: submitting ? C.rule2 : C.gold,
              color: submitting ? C.inkLow : '#08080A',
              border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: 2,
              textTransform: 'uppercase',
            }}>{submitting ? 'Submitting...' : '▸ Reserve Now · $500'}</button>

            <div style={{
              marginTop: 14, padding: 12, background: C.bg2,
              border: `1px dashed ${C.rule2}`,
              fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, letterSpacing: 0.5, lineHeight: 1.6,
            }}>
              ▸ Your card is <strong style={{ color: C.ink }}>not charged</strong> at this time.<br />
              ▸ A team member confirms within 15 minutes.<br />
              ▸ 100% refundable up to 48 hours.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Accessibility Widget (bottom-left) ─────────── */
