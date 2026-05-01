'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';
import { QRBlock } from './QRCode';
import { useDealerInventory } from './InventoryGrid';
import { findSimilarVehicles } from '@/lib/dealer-platform/ai/similar-vehicles';
import { VehicleSchema } from './VehicleSchema';
import { generateVehicleSlug } from './utils';

function deriveSized(imgUrl, size) {
  if (!imgUrl) return imgUrl;
  const m = imgUrl.match(/\/full-([a-f0-9]+\.webp)$/);
  if (!m) return imgUrl;
  const base = imgUrl.slice(0, imgUrl.lastIndexOf('/full-'));
  return `${base}/${size}-${m[1]}`;
}

function buildSrcSet(imgUrl) {
  if (!imgUrl) return undefined;
  const m = imgUrl.match(/\/full-([a-f0-9]+\.webp)$/);
  if (!m) return undefined;
  const base = imgUrl.slice(0, imgUrl.lastIndexOf('/full-'));
  const suffix = m[1];
  return `${base}/thumb-${suffix} 400w, ${base}/medium-${suffix} 800w, ${imgUrl} 1600w`;
}

export function DetailDrawer({ v, onClose, onBuildDeal, onReserve, isReserved }) {
  const [tab, setTab]   = useState('specs');
  const [shot, setShot] = useState(0);
  const [down, setDown] = useState(15);
  const [term, setTerm] = useState(60);
  const [credit, setCredit] = useState('Excellent (750+)');
  const [zip, setZip]   = useState('');
  const [delivery, setDelivery] = useState(false);
  const [delZip, setDelZip] = useState('');
  // Text-me-this-vehicle popover
  const [textOpen, setTextOpen] = useState(false);
  const [textPhone, setTextPhone] = useState('');
  const [textSent, setTextSent] = useState(false);
  // Form 1 — Get E-Price
  const [epName, setEpName] = useState('');
  const [epEmail, setEpEmail] = useState('');
  const [epPhone, setEpPhone] = useState('');
  const [epSubmitting, setEpSubmitting] = useState(false);
  const [epSubmitted, setEpSubmitted] = useState(false);
  const [epError, setEpError] = useState('');
  // Form 4 — Test Drive
  const [tdDate, setTdDate] = useState('');
  const [tdTime, setTdTime] = useState('10:00 AM');
  const [tdName, setTdName] = useState('');
  const [tdPhone, setTdPhone] = useState('');
  const [tdSubmitting, setTdSubmitting] = useState(false);
  const [tdSubmitted, setTdSubmitted] = useState(false);
  const [tdError, setTdError] = useState('');

  const handleEPrice = async () => {
    if (!epName || (!epEmail && !epPhone)) return;
    setEpSubmitting(true); setEpError('');
    try {
      const [firstName, ...rest] = epName.trim().split(' ');
      const res = await fetch(`/api/dealer/${dealerSlug}/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'GetEPrice', firstName, lastName: rest.join(' '),
          email: epEmail, phone: epPhone,
          vehicleOfInterest: `${v.y} ${v.mk} ${v.md}`,
          message: 'Requesting e-price',
        }),
      });
      const data = await res.json();
      if (data.ok) setEpSubmitted(true);
      else setEpError(`Something went wrong. Call us at ${cfg.phone || 'the dealership'} for immediate help.`);
    } catch { setEpError(`Something went wrong. Call us at ${cfg.phone || 'the dealership'} for immediate help.`); }
    finally { setEpSubmitting(false); }
  };

  const handleTestDrive = async () => {
    if (!tdName || !tdPhone) return;
    setTdSubmitting(true); setTdError('');
    try {
      const [firstName, ...rest] = tdName.trim().split(' ');
      const res = await fetch(`/api/dealer/${dealerSlug}/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'TestDrive', firstName, lastName: rest.join(' '),
          phone: tdPhone,
          vehicleOfInterest: `${v.y} ${v.mk} ${v.md}`,
          message: `Test drive requested for ${tdDate || 'TBD'} at ${tdTime}`,
        }),
      });
      const data = await res.json();
      if (data.ok) setTdSubmitted(true);
      else setTdError(`Something went wrong. Call us at ${cfg.phone || 'the dealership'} for immediate help.`);
    } catch { setTdError(`Something went wrong. Call us at ${cfg.phone || 'the dealership'} for immediate help.`); }
    finally { setTdSubmitting(false); }
  };

  const aprMap = {
    'Excellent (750+)':  5.4,
    'Good (700-749)':    6.9,
    'Fair (600-699)':    9.5,
    'Rebuilding (<600)': 14.9,
  };
  const apr = aprMap[credit];

  // tax & fee estimator from ZIP
  const isFL = /^3[34]\d{3}$/.test(zip);
  const validZip = /^\d{5}$/.test(zip);
  const taxRate = validZip ? (isFL ? 0.06 : 0.07) : 0;
  const fees    = validZip ? (isFL ? 400  : 500)  : 0;
  const taxAmt  = v.price * taxRate;
  const adjusted = v.price + taxAmt + fees;
  const calc = monthlyPayment(validZip ? adjusted : v.price, down, term, apr);

  // delivery estimator
  const delZipFL = /^3[34]\d{3}$/.test(delZip);
  const delValidZip = /^\d{5}$/.test(delZip);
  const delFee = delValidZip ? (delZipFL ? 0 : (parseInt(delZip[2]) > 5 ? 199 : 99)) : null;

  const thumbs = v.imgs || [v.img, v.img, v.img, v.img, v.img];

  // Live similar vehicles — pulled from the same module-level cache the
  // inventory grid populates, so this is usually instant after the grid mount.
  const cfg = useCustomerConfig();
  const dealerSlug = cfg?.dealerSlug || 'primo';
  const { vehicles: liveInventory } = useDealerInventory(dealerSlug);
  const similar = useMemo(() => {
    const pool = (liveInventory && liveInventory.length ? liveInventory : FLEET)
      .filter((x) => x && x.id !== v.id);
    // findSimilarVehicles returns score summaries keyed by id — re-hydrate
    // back to the original FLEET-shape entries so the existing card render
    // (which reads v.img / v.mk / v.md / v.y / v.price) Just Works.
    const ranked = findSimilarVehicles(v, pool, 4);
    const byId = new Map(pool.map((p) => [p.id, p]));
    return ranked.map((r) => byId.get(r.id)).filter(Boolean);
  }, [liveInventory, v]);

  // anim in
  const [open, setOpen] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 280); };

  const vehiclePageUrl = cfg?.dealerSlug
    ? `https://lotpilot.ai/dealers/${cfg.dealerSlug}/inventory/${generateVehicleSlug(v)}`
    : undefined;

  return (
    <>
      <VehicleSchema vehicle={v} dealerConfig={cfg} vehicleUrl={vehiclePageUrl} />
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: open ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: open ? 'blur(4px)' : 'none',
        transition: 'background 280ms, backdrop-filter 280ms',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, bottom: 0, right: 0,
          width: 'min(960px, 100%)',
          background: C.bg, borderLeft: `1px solid ${C.rule}`,
          transform: open ? 'translateX(0)' : 'translateX(40px)',
          opacity: open ? 1 : 0,
          transition: 'transform 320ms cubic-bezier(0.2,0.8,0.2,1), opacity 260ms',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* drawer header — dossier strip */}
        <div style={{
          padding: '20px 28px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: C.bg2, position: 'sticky', top: 0, zIndex: 5,
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5,
              color: C.gold, marginBottom: 4,
            }}>DOSSIER · {v.id} · VIN {v.vin}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 22, letterSpacing: -0.5, color: C.ink, textTransform: 'uppercase',
            }}>{v.y} {v.mk} {v.md}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onBuildDeal && onBuildDeal(v)} style={{
              padding: '10px 18px', background: C.gold, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>★ Build Deal</button>
            <button
              disabled={isReserved}
              onClick={() => onReserve && onReserve(v)} style={{
                padding: '10px 18px',
                background: isReserved ? C.rule2 : 'transparent',
                color: isReserved ? C.inkLow : C.gold,
                border: `1px solid ${isReserved ? C.rule2 : C.gold}`,
                cursor: isReserved ? 'not-allowed' : 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
              {isReserved ? '✓ Reserved' : '⌚ Reserve · $500'}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setTextOpen(o => !o)} style={{
                padding: '10px 14px', background: 'transparent',
                color: C.cyan, border: `1px solid ${C.cyan}55`, cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>📱 Text Me</button>
              {textOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 8,
                  width: 260, background: C.bg, border: `1px solid ${C.cyan}`,
                  padding: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                }}>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 8,
                  }}>TEXT ME THIS VEHICLE</div>
                  {textSent ? (
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.gold, lineHeight: 1.5 }}>
                      ✓ Link sent!<br />Check your messages.
                    </div>
                  ) : (
                    <>
                      <input
                        type="tel" placeholder="(305) 555-0123"
                        value={textPhone}
                        onChange={e => setTextPhone(e.target.value)}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          borderBottom: `1px solid ${C.rule2}`,
                          color: C.ink, fontFamily: FONT_MONO, fontSize: 13,
                          padding: '6px 0', marginBottom: 10,
                        }}
                      />
                      <button onClick={() => { setTextSent(true); setTimeout(() => { setTextOpen(false); setTextSent(false); setTextPhone(''); }, 1800); }} style={{
                        width: '100%', padding: '8px', background: C.cyan, color: '#08080A',
                        border: 'none', cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                      }}>▸ SEND LINK</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <button onClick={close} style={{
              width: 40, height: 40,
              background: 'transparent', border: `1px solid ${C.rule2}`,
              color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 16,
            }}>✕</button>
          </div>
        </div>

        {/* video walkaround */}
        <div style={{ padding: '28px 28px 0' }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold,
            marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: C.red }}>●</span> VIDEO WALKAROUND · {v.y} {v.mk} {v.md}
          </div>
          <div style={{
            position: 'relative', aspectRatio: '16/9',
            border: `1px solid ${C.rule}`, overflow: 'hidden',
            background: '#000',
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1&color=white`}
              title={`${v.y} ${v.mk} ${v.md} walkaround`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        </div>

        {/* gallery strip */}
        <div style={{ padding: 28, paddingBottom: 0 }}>
          <div style={{
            aspectRatio: '16/9',
            background: C.bg2,
            border: `1px solid ${C.rule}`, position: 'relative', overflow: 'hidden',
          }}>
            {thumbs[shot] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbs[shot]}
                srcSet={buildSrcSet(thumbs[shot])}
                sizes="(max-width: 768px) 100vw, 960px"
                alt={`${v.y} ${v.mk} ${v.md} — photo ${shot + 1}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            {/* registration corners */}
            {[
              { top: 8, left: 8 },
              { top: 8, right: 8 },
              { bottom: 8, left: 8 },
              { bottom: 8, right: 8 },
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', width: 18, height: 18,
                borderTop: i < 2 ? `1px solid ${C.gold}` : 'none',
                borderBottom: i >= 2 ? `1px solid ${C.gold}` : 'none',
                borderLeft: (i === 0 || i === 2) ? `1px solid ${C.gold}` : 'none',
                borderRight: (i === 1 || i === 3) ? `1px solid ${C.gold}` : 'none',
                ...p,
              }} />
            ))}
            {/* badge bar */}
            <div style={{
              position: 'absolute', bottom: 14, left: 14, right: 14,
              display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {['NO ACCIDENTS', '1 OWNER', 'SVC RECORDS', '150-PT INSPECTED'].map(b => (
                <span key={b} style={{
                  background: 'rgba(91,227,255,0.1)', color: C.cyan,
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 600,
                  padding: '4px 8px', border: `1px solid ${C.cyan}55`,
                }}>✓ {b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {thumbs.map((t, i) => (
              <button key={i} onClick={() => setShot(i)} style={{
                width: 80, height: 56, flexShrink: 0,
                position: 'relative', overflow: 'hidden',
                border: `1px solid ${shot === i ? C.gold : C.rule}`,
                cursor: 'pointer', padding: 0, opacity: shot === i ? 1 : 0.6,
                background: C.bg2,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deriveSized(t, 'thumb') || t}
                  alt={`Photo ${i + 1}`}
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* tab bar */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 28, paddingLeft: 28,
          borderBottom: `1px solid ${C.rule}`,
        }}>
          {[
            ['specs',    'SPECS'],
            ['payment',  'PAYMENT CALC'],
            ['contact',  'CONTACT DEALER'],
            ['testdrive','SCHEDULE'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '14px 20px',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, fontWeight: 600,
              color: tab === k ? C.gold : C.inkLow,
              borderBottom: `2px solid ${tab === k ? C.gold : 'transparent'}`,
              marginBottom: -1,
            }}>{l}</button>
          ))}
        </div>

        {/* tab content */}
        <div style={{ padding: 28, flex: 1 }}>
          {tab === 'specs' && (
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
                border: `1px solid ${C.rule}`, marginBottom: 24,
              }}>
                {[
                  ['HORSEPOWER', `${v.hp} HP`],
                  ['0–60 MPH',   `${v.sec} SEC`],
                  ['MPG',        `${v.mpg}`],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '18px 20px',
                    borderRight: i < 2 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: C.cyan, lineHeight: 1 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                border: `1px solid ${C.rule}`,
              }}>
                {[
                  ['MILEAGE',       `${fmtMi(v.mi)} mi`],
                  ['EXTERIOR',      v.ext],
                  ['INTERIOR',      v.int],
                  ['ENGINE',        v.eng],
                  ['TRANSMISSION',  v.tx],
                  ['DRIVETRAIN',    v.dr],
                  ['BODY STYLE',    v.body],
                  ['STOCK #',       v.id],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '14px 18px',
                    borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
                    borderBottom: i < 6 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.ink, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* VEHICLE HISTORY — boolean badges + optional CARFAX/AutoCheck links */}
              {(() => {
                const flagsArr = Array.isArray(v.flags) ? v.flags.map(s => String(s).toUpperCase()) : [];
                const has = (s) => flagsArr.some(f => f.includes(s));
                const items = [
                  { key: 'noAccidents',    show: !!v.noAccidents    || has('NO ACCIDENT'),                    label: 'No Accidents Reported' },
                  { key: 'oneOwner',       show: !!v.oneOwner       || has('ONE-OWNER') || has('ONE OWNER'),  label: 'One Previous Owner' },
                  { key: 'cleanTitle',     show: !!v.cleanTitle     || has('CLEAN TITLE'),                    label: 'Clean Title — No Liens' },
                  { key: 'serviceRecords', show: !!v.serviceRecords || has('SERVICE RECORDS'),                label: 'Service Records Available' },
                  { key: 'inspection',     show: !!v.inspection     || true,                                  label: '150-Point Inspection Passed' },
                ];
                const cx = cfg.integrations?.carfax;
                const ac = cfg.integrations?.autocheck;
                const cxReady = !!(cx?.enabled && cx.dealerId && v.vin);
                const acReady = !!(ac?.enabled && ac.accountId && v.vin);
                return (
                  <div style={{ marginTop: 24, border: `1px solid ${C.rule}`, padding: 24 }}>
                    <div style={{
                      fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 3, color: C.gold,
                      marginBottom: 16, fontWeight: 700,
                    }}>VEHICLE HISTORY</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {items.map(it => (
                        <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {it.show ? (
                            <span style={{
                              width: 22, height: 22, borderRadius: 11,
                              background: '#22C55E22', color: '#22C55E',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 14, fontWeight: 700,
                            }}>✓</span>
                          ) : (
                            <span style={{
                              width: 22, height: 22, borderRadius: 11,
                              background: C.rule, color: C.inkLow,
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12,
                            }}>—</span>
                          )}
                          <span style={{
                            fontFamily: FONT_BODY, fontSize: 14,
                            color: it.show ? C.ink : C.inkLow,
                            fontWeight: it.show ? 500 : 400,
                          }}>{it.label}</span>
                        </div>
                      ))}
                    </div>

                    {(cxReady || acReady) && (
                      <>
                        <div style={{
                          marginTop: 18, paddingTop: 14,
                          borderTop: `1px solid ${C.rule}`,
                          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                        }}>FREE VEHICLE HISTORY REPORT INCLUDED</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                          {cxReady && (
                            <a href={`https://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DEL_${encodeURIComponent(cx.dealerId)}&vin=${encodeURIComponent(v.vin)}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 16px', background: '#003478', color: '#FFFFFF',
                                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                                letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
                              }}>View CARFAX Report →</a>
                          )}
                          {acReady && (
                            <a href={`https://www.autocheck.com/vehiclehistory/autocheck/actionForm?vin=${encodeURIComponent(v.vin)}&siteID=${encodeURIComponent(ac.accountId)}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 16px', background: '#0033A0', color: '#FFFFFF',
                                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                                letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
                              }}>View AutoCheck Report →</a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {tab === 'payment' && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingBottom: 16, borderBottom: `1px solid ${C.rule}`, marginBottom: 24,
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>STICKER</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{fmt(v.price)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>EST. MONTHLY</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: C.gold, lineHeight: 1 }}>
                    {fmt(calc)}<span style={{ fontSize: 16, color: C.inkLow }}>/mo</span>
                  </div>
                </div>
              </div>

              {/* down payment slider */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                }}>
                  <span style={{ color: C.inkDim }}>DOWN PAYMENT</span>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{down}% · {fmt(v.price * down / 100)}</span>
                </div>
                <input type="range" min={0} max={50} value={down}
                  onChange={e => setDown(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: C.gold }}
                />
              </div>

              {/* term selector */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim,
                  marginBottom: 8,
                }}>TERM</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${C.rule2}` }}>
                  {[36, 48, 60, 72].map((t, i) => (
                    <button key={t} onClick={() => setTerm(t)} style={{
                      padding: '12px 0', cursor: 'pointer',
                      background: term === t ? C.gold : 'transparent',
                      color: term === t ? C.bg : C.inkDim,
                      border: 'none', borderRight: i < 3 ? `1px solid ${C.rule2}` : 'none',
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>{t} MO</button>
                  ))}
                </div>
              </div>

              {/* credit selector */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim,
                  marginBottom: 8,
                }}>CREDIT BAND</div>
                <select value={credit} onChange={e => setCredit(e.target.value)} style={{
                  width: '100%', appearance: 'none',
                  background: C.panel, border: `1px solid ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                  cursor: 'pointer',
                }}>
                  {Object.keys(aprMap).map(k => <option key={k}>{k}</option>)}
                </select>
              </div>

              {/* ZIP / tax estimator */}
              <div style={{
                marginTop: 16, padding: 14,
                border: `1px dashed ${C.rule2}`, background: C.bg2,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  }}>TAX & FEE ESTIMATOR</div>
                  <input
                    type="text" placeholder="ZIP" maxLength={5}
                    value={zip}
                    onChange={e => setZip(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: 90, background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${C.rule2}`,
                      color: C.ink, fontFamily: FONT_MONO, fontSize: 13,
                      padding: '4px 6px', textAlign: 'center', letterSpacing: 2,
                    }}
                  />
                </div>
                {validZip ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>SALES TAX ({(taxRate * 100).toFixed(0)}%)</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{fmt(taxAmt)}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>EST. FEES</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{fmt(fees)}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow, letterSpacing: 1 }}>
                    Enter ZIP to include tax & fees in monthly payment.
                  </div>
                )}
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 6, lineHeight: 1.5 }}>
                  Tax and fee estimates. Final amounts at signing.
                </div>
              </div>

              {/* readout */}
              <div style={{
                marginTop: 16,
                padding: '20px 24px', background: C.panel,
                border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
              }}>
                {[
                  ['APR',           `${apr}%`],
                  ['TOTAL INT.',    fmt(calc * term - (validZip ? adjusted : v.price) * (1 - down / 100))],
                  ['TOTAL PAID',    fmt(calc * term + (validZip ? adjusted : v.price) * (down / 100))],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '0 16px',
                    borderLeft: i > 0 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  marginBottom: 6,
                }}>02 · GET YOUR E-PRICE</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase',
                }}>Get the dealer's best number, sent to your inbox.</div>
              </div>
              {epSubmitted ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                    color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 8,
                  }}>Thanks {epName.split(' ')[0]}!</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55 }}>
                    We'll be in touch shortly.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                    {[
                      ['Full Name',     'text',  epName,  setEpName],
                      ['Email Address', 'email', epEmail, setEpEmail],
                      ['Phone Number',  'tel',   epPhone, setEpPhone],
                    ].map(([ph, t, val, setter]) => (
                      <input key={ph} type={t} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={{
                        background: C.panel, border: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_BODY, fontSize: 14, padding: '14px 16px',
                      }} />
                    ))}
                  </div>
                  {epError && (
                    <div style={{ marginBottom: 12, color: '#EF4444', fontFamily: FONT_BODY, fontSize: 13 }}>
                      {epError}
                    </div>
                  )}
                  <button onClick={handleEPrice} disabled={epSubmitting || !epName || (!epEmail && !epPhone)} style={{
                    width: '100%', padding: '16px 20px',
                    background: (epSubmitting || !epName || (!epEmail && !epPhone)) ? C.rule2 : C.red,
                    color: (epSubmitting || !epName || (!epEmail && !epPhone)) ? C.inkLow : C.ink,
                    border: 'none', cursor: (epSubmitting || !epName || (!epEmail && !epPhone)) ? 'not-allowed' : 'pointer',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                    letterSpacing: 2, textTransform: 'uppercase',
                  }}>{epSubmitting ? 'Submitting...' : 'Send Me My E-Price ▸'}</button>
                </>
              )}

              <div style={{
                marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.rule}`,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              }}>
                <button style={{
                  padding: 14, background: 'transparent', color: C.ink,
                  border: `1px solid ${C.rule2}`, cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 600,
                }}>📲 TEXT ABOUT THIS CAR</button>
                <button style={{
                  padding: 14, background: 'transparent', color: C.ink,
                  border: `1px solid ${C.rule2}`, cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 600,
                }}>↗ SHARE THIS VEHICLE</button>
              </div>
            </div>
          )}

          {tab === 'testdrive' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                  marginBottom: 6,
                }}>02 · BOOK A TEST DRIVE</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                  color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase',
                }}>Pick a slot. Car will be detailed and ready.</div>
              </div>
              {tdSubmitted ? (
                <div style={{ padding: '32px 0', textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                    color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 8,
                  }}>Thanks {tdName.split(' ')[0]}!</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55 }}>
                    We'll be in touch shortly.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>DATE</div>
                      <input type="date" value={tdDate} onChange={e => setTdDate(e.target.value)} style={{
                        width: '100%', background: C.panel, border: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                        colorScheme: 'dark',
                      }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>TIME SLOT</div>
                      <select value={tdTime} onChange={e => setTdTime(e.target.value)} style={{
                        width: '100%', appearance: 'none',
                        background: C.panel, border: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_BODY, fontSize: 13, padding: '12px 14px',
                        cursor: 'pointer',
                      }}>
                        <option>10:00 AM</option><option>11:30 AM</option>
                        <option>1:00 PM</option><option>2:30 PM</option>
                        <option>4:00 PM</option><option>5:30 PM</option>
                      </select>
                    </div>
                  </div>
                  <input type="text" placeholder="Full Name" value={tdName} onChange={e => setTdName(e.target.value)} style={{
                    background: C.panel, border: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_BODY, fontSize: 14, padding: '12px 14px',
                  }} />
                  <input type="tel" placeholder="Phone Number" value={tdPhone} onChange={e => setTdPhone(e.target.value)} style={{
                    background: C.panel, border: `1px solid ${C.rule2}`,
                    color: C.ink, fontFamily: FONT_BODY, fontSize: 14, padding: '12px 14px',
                  }} />
                  {tdError && (
                    <div style={{ color: '#EF4444', fontFamily: FONT_BODY, fontSize: 13 }}>
                      {tdError}
                    </div>
                  )}
                  <button onClick={handleTestDrive} disabled={tdSubmitting || !tdName || !tdPhone} style={{
                    padding: '16px 20px',
                    background: (tdSubmitting || !tdName || !tdPhone) ? C.rule2 : C.gold,
                    color: (tdSubmitting || !tdName || !tdPhone) ? C.inkLow : C.bg,
                    border: 'none', cursor: (tdSubmitting || !tdName || !tdPhone) ? 'not-allowed' : 'pointer',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                    letterSpacing: 2, textTransform: 'uppercase', marginTop: 4,
                  }}>{tdSubmitting ? 'Submitting...' : 'Lock My Slot ▸'}</button>
                </div>
              )}

              {/* HOME DELIVERY */}
              <div style={{
                marginTop: 28, padding: 20,
                background: C.bg2, border: `1px solid ${delivery ? C.gold : C.rule}`,
                transition: 'border-color 200ms',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: delivery ? 14 : 0,
                }}>
                  <div>
                    <div style={{
                      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan,
                      marginBottom: 4,
                    }}>HOME DELIVERY · CARVANA-STYLE</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
                      color: C.ink, letterSpacing: -0.3,
                    }}>Deliver to my door</div>
                  </div>
                  <button onClick={() => setDelivery(d => !d)} style={{
                    width: 50, height: 28, position: 'relative',
                    background: delivery ? C.gold : C.rule2, border: 'none',
                    cursor: 'pointer', padding: 0, transition: 'background 200ms',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: delivery ? 25 : 3,
                      width: 22, height: 22,
                      background: delivery ? '#08080A' : C.ink,
                      transition: 'left 200ms',
                    }} />
                  </button>
                </div>
                {delivery && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input
                      type="text" placeholder="DELIVERY ZIP CODE" maxLength={5}
                      value={delZip}
                      onChange={e => setDelZip(e.target.value.replace(/\D/g, ''))}
                      style={{
                        background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_MONO, fontSize: 14,
                        padding: '8px 4px', letterSpacing: 2,
                      }}
                    />
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
                      border: `1px solid ${C.rule}`, fontFamily: FONT_MONO, fontSize: 10,
                    }}>
                      <div style={{ padding: 10, borderRight: `1px solid ${C.rule}`,
                        background: delValidZip && delFee === 0 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>≤25 MI</div>
                        <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>FREE</div>
                      </div>
                      <div style={{ padding: 10, borderRight: `1px solid ${C.rule}`,
                        background: delValidZip && delFee === 99 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>25-50 MI</div>
                        <div style={{ color: C.ink, fontWeight: 700, fontSize: 13 }}>$99</div>
                      </div>
                      <div style={{ padding: 10,
                        background: delValidZip && delFee === 199 ? `${C.gold}22` : 'transparent' }}>
                        <div style={{ color: C.cyan, letterSpacing: 1.5, marginBottom: 3 }}>50+ MI</div>
                        <div style={{ color: C.ink, fontWeight: 700, fontSize: 13 }}>$199</div>
                      </div>
                    </div>
                    {delValidZip && (
                      <div style={{
                        fontFamily: FONT_MONO, fontSize: 11, color: C.gold, marginTop: 4,
                      }}>▸ Estimated delivery fee: {delFee === 0 ? 'FREE' : `$${delFee}`}</div>
                    )}
                    <button style={{
                      padding: '14px 18px', background: C.cyan, color: '#08080A',
                      border: 'none', cursor: 'pointer',
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
                      letterSpacing: 2, textTransform: 'uppercase',
                    }}>▸ Schedule Delivery</button>
                  </div>
                )}
              </div>

              {/* QR CODE BLOCK */}
              <div style={{
                marginTop: 24, padding: 20,
                border: `1px solid ${C.rule}`, background: C.panel,
                display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center',
              }}>
                <QRBlock seed={v.id} />
                <div>
                  <div style={{
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold,
                    marginBottom: 6,
                  }}>SCAN · MOBILE</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                    color: C.ink, letterSpacing: -0.3, marginBottom: 6,
                  }}>Scan to view this vehicle on your phone.</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, lineHeight: 1.5,
                  }}>Print this QR for your lot windshield sticker — physical-to-digital bridge.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* similar bar */}
        <div style={{
          padding: '28px', borderTop: `1px solid ${C.rule}`,
          background: C.bg2,
        }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
            marginBottom: 4,
          }}>SIMILAR DOSSIERS</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
            color: C.ink, letterSpacing: 0.5, marginBottom: 14,
          }}>You might also like</div>
          {similar.length === 0 ? (
            <div style={{
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.inkLow,
              padding: '14px 0',
            }}>No close matches in current inventory.</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {similar.map((s) => (
                <div key={s.id} style={{
                  flex: '0 0 200px',
                  border: `1px solid ${C.rule}`, background: C.panel, cursor: 'pointer',
                }}>
                  <div style={{ aspectRatio: '16/10', background: C.bg2, position: 'relative', overflow: 'hidden' }}>
                    {s.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={deriveSized(s.img, 'thumb') || s.img}
                        alt={`${s.mk} ${s.md}`}
                        loading="lazy"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{
                      fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow,
                    }}>{s.id} · {s.y}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14,
                      color: C.ink, letterSpacing: 0.5, marginTop: 2,
                    }}>{s.mk} {s.md}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                      color: C.gold, marginTop: 4,
                    }}>{fmt(s.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

/* ─── 03 · TRADE-IN (diagnostic terminal style) ────── */
