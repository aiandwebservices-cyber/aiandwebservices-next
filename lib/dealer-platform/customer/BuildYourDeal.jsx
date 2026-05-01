'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function DealWizard({ vehicle, onClose }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  // step 2 — trade
  const [hasTrade, setHasTrade] = useState(null); // null = unset, true/false
  const [tradeYear, setTradeYear] = useState('2020');
  const [tradeMake, setTradeMake] = useState('Toyota');
  const [tradeModel, setTradeModel] = useState('Camry');
  const [tradeMiles, setTradeMiles] = useState('30K-60K');
  const [tradeCondition, setTradeCondition] = useState('Good');
  // step 3 — financing
  const [down, setDown] = useState(2500);
  const [term, setTerm] = useState(60);
  const [credit, setCredit] = useState('Excellent');
  // step 4 — F&I add-ons
  const [addons, setAddons] = useState({ extWarranty: false, paint: false, tint: false, gap: false });
  // step 6 — submit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 260); };

  const tradeRanges = {
    Excellent: [14000, 16000],
    Good:      [11000, 13000],
    Fair:      [7500, 9500],
    Poor:      [3500, 5000],
  };
  const aprMap = { Excellent: 3.9, Good: 5.9, Fair: 8.9, Rebuilding: 12.9 };
  const apr = aprMap[credit];

  // F&I add-ons — one-time price + per-month figure
  const ADDONS = [
    { key: 'extWarranty', name: 'Extended Warranty',     price: 1200, mo: 22, desc: 'Bumper-to-bumper coverage up to 100,000 miles.' },
    { key: 'paint',       name: 'Paint Protection Film', price: 599,  mo: 11, desc: 'Invisible shield against chips, scratches, and UV damage.' },
    { key: 'tint',        name: 'Window Tint',           price: 299,  mo: 5,  desc: 'Premium ceramic — blocks 99% UV, keeps interior cool.' },
    { key: 'gap',         name: 'GAP Insurance',         price: 495,  mo: 9,  desc: 'Covers the gap between your loan balance and vehicle value.' },
  ];
  const selectedAddons = ADDONS.filter(a => addons[a.key]);
  const addonsMonthly = selectedAddons.reduce((s, a) => s + a.mo, 0);

  const tradeCredit = hasTrade ? Math.round((tradeRanges[tradeCondition][0] + tradeRanges[tradeCondition][1]) / 2) : 0;
  const tax = vehicle.price * 0.06;
  const docFee = 499;
  const subtotal = vehicle.price + tax + docFee - tradeCredit;
  const financed = Math.max(0, subtotal - down);
  const baseMonthly = monthlyPayment(financed, 0, term, apr);
  const monthly = baseMonthly + addonsMonthly;

  const stepLabels = ['VEHICLE', 'TRADE-IN', 'FINANCING', 'PROTECT', 'SUMMARY', 'SUBMIT'];
  const TOTAL_STEPS = stepLabels.length;

  const next = () => setStep(s => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 115,
      background: open ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(10px)' : 'none',
      transition: 'all 260ms',
      display: 'grid', placeItems: 'start center', padding: '24px',
      overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(820px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: C.bg, border: `1px solid ${C.gold}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${C.gold}30`,
        opacity: open ? 1 : 0, transform: open ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 260ms cubic-bezier(0.2,0.8,0.2,1)',
        display: 'flex', flexDirection: 'column',
        marginTop: 24, marginBottom: 24,
      }}>
        {/* header */}
        <div style={{
          padding: '18px 28px', borderBottom: `1px solid ${C.rule}`,
          background: C.bg2,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold }}>
                ★ BUILD YOUR DEAL · STEP {step}/{TOTAL_STEPS}
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
              }}>{stepLabels[step - 1]}</div>
            </div>
            <button onClick={close} style={{
              width: 38, height: 38, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 16,
            }}>✕</button>
          </div>
          {/* progress bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)`, gap: 4,
          }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{
                height: 4,
                background: i + 1 <= step ? C.gold : C.rule,
                transition: 'background 240ms',
              }} />
            ))}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)`, gap: 4,
            marginTop: 6,
          }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5,
                color: i + 1 <= step ? C.gold : C.inkLow,
                fontWeight: 600, textAlign: 'center',
              }}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* content area */}
        <div style={{ padding: 28, flex: 1, overflowY: 'auto', minHeight: 380 }}>
          {/* STEP 1 — vehicle */}
          {step === 1 && (
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
                alignItems: 'center', marginBottom: 20,
              }}>
                <div style={{
                  aspectRatio: '16/10',
                  background: `url('${vehicle.img}') center/cover`,
                  border: `1px solid ${C.rule}`,
                }} />
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.gold, marginBottom: 6 }}>
                    STOCK · {vehicle.id}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28,
                    color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', lineHeight: 1.05,
                    marginBottom: 8,
                  }}>{vehicle.y} {vehicle.mk} {vehicle.md}</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, marginBottom: 14 }}>
                    {vehicle.trim}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36,
                    color: C.gold, lineHeight: 1,
                  }}>{fmt(vehicle.price)}</div>
                </div>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
                border: `1px solid ${C.rule}`,
              }}>
                {[
                  ['MILES',   fmtMi(vehicle.mi)],
                  ['HP',      vehicle.hp],
                  ['0-60',    `${vehicle.sec}s`],
                  ['MPG',     vehicle.mpg],
                ].map(([k, val], i) => (
                  <div key={k} style={{
                    padding: '14px 16px',
                    borderRight: i < 3 ? `1px solid ${C.rule}` : 'none',
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow }}>{k}</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.cyan }}>{val}</div>
                  </div>
                ))}
              </div>
              <p style={{
                fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginTop: 20, lineHeight: 1.55,
              }}>
                You're building a deal on this vehicle. Next, we'll factor in your trade-in (if any), then build your financing plan.
              </p>
            </div>
          )}

          {/* STEP 2 — trade */}
          {step === 2 && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                color: C.ink, letterSpacing: -0.3, marginBottom: 6, textTransform: 'uppercase',
              }}>Have a trade-in?</div>
              <p style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 18 }}>
                Trade credit applies directly against your purchase price. Skip if you don't have one.
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                {[['yes', true, 'YES, I HAVE A TRADE'], ['no', false, 'NO TRADE-IN']].map(([k, v, l]) => (
                  <button key={k} onClick={() => setHasTrade(v)} style={{
                    flex: 1, padding: '14px 16px',
                    background: hasTrade === v ? C.gold : 'transparent',
                    color: hasTrade === v ? '#08080A' : C.ink,
                    border: `1px solid ${hasTrade === v ? C.gold : C.rule2}`,
                    cursor: 'pointer',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>

              {hasTrade === true && (
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                  background: C.bg2, border: `1px solid ${C.rule}`, padding: 20,
                }}>
                  {[
                    ['YEAR', tradeYear, setTradeYear, ['2024', '2023', '2022', '2021', '2020', '2019', 'OLDER']],
                    ['MAKE', tradeMake, setTradeMake, ['Toyota', 'Honda', 'Ford', 'Chevy', 'Nissan', 'Other']],
                    ['MODEL', tradeModel, setTradeModel, ['Camry', 'Civic', 'F-150', 'Other']],
                    ['MILEAGE', tradeMiles, setTradeMiles, ['<30K', '30K-60K', '60K-100K', '>100K']],
                  ].map(([lab, val, setter, opts]) => (
                    <div key={lab}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{lab}</div>
                      <select value={val} onChange={e => setter(e.target.value)} style={{
                        width: '100%', appearance: 'none', background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${C.rule2}`,
                        color: C.ink, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
                        padding: '6px 0', cursor: 'pointer', letterSpacing: 0.5,
                      }}>{opts.map(o => <option key={o} style={{ background: C.panel }}>{o}</option>)}</select>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>CONDITION</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                      {Object.keys(tradeRanges).map(c => (
                        <button key={c} onClick={() => setTradeCondition(c)} style={{
                          padding: '10px 0',
                          background: tradeCondition === c ? C.gold : 'transparent',
                          color: tradeCondition === c ? '#08080A' : C.ink,
                          border: `1px solid ${tradeCondition === c ? C.gold : C.rule2}`,
                          cursor: 'pointer',
                          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
                        }}>{c.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    gridColumn: '1 / -1', marginTop: 8, padding: 16,
                    background: C.bg, border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.cyan, marginBottom: 4 }}>
                      EST. TRADE VALUE · {tradeCondition.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: C.gold, lineHeight: 1,
                    }}>${tradeRanges[tradeCondition][0].toLocaleString()} – ${tradeRanges[tradeCondition][1].toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — financing */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  FINANCING PLAN
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink,
                  letterSpacing: -0.3, textTransform: 'uppercase',
                }}>Build your monthly payment.</div>
              </div>

              {/* down */}
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                }}>
                  <span style={{ color: C.inkDim }}>DOWN PAYMENT</span>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{fmt(down)}</span>
                </div>
                <input type="range" min={0} max={20000} step={500} value={down}
                  onChange={e => setDown(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: C.gold }} />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2,
                }}>
                  <span>$0</span><span>$20,000</span>
                </div>
              </div>

              {/* term */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim, marginBottom: 8 }}>TERM</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${C.rule2}` }}>
                  {[36, 48, 60, 72].map((tt, i) => (
                    <button key={tt} onClick={() => setTerm(tt)} style={{
                      padding: '12px 0', cursor: 'pointer',
                      background: term === tt ? C.gold : 'transparent',
                      color: term === tt ? '#08080A' : C.inkDim,
                      border: 'none', borderRight: i < 3 ? `1px solid ${C.rule2}` : 'none',
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>{tt} MO</button>
                  ))}
                </div>
              </div>

              {/* credit band */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: C.inkDim, marginBottom: 8 }}>CREDIT BAND</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {Object.keys(aprMap).map(k => (
                    <button key={k} onClick={() => setCredit(k)} style={{
                      padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                      background: credit === k ? C.gold : 'transparent',
                      color: credit === k ? '#08080A' : C.ink,
                      border: `1px solid ${credit === k ? C.gold : C.rule2}`,
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>
                      <div>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 16, marginTop: 2 }}>{aprMap[k]}% APR</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* live readout */}
              <div style={{
                padding: '20px 24px', background: C.panel,
                border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>EST. MONTHLY</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 42, color: C.gold, lineHeight: 1,
                  }}>{fmt(monthly)}<span style={{ fontSize: 16, color: C.inkLow }}>/mo</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow }}>FINANCED</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>{fmt(financed)}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginTop: 2 }}>@ {apr}% · {term}mo</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — PROTECT YOUR INVESTMENT */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan, marginBottom: 6 }}>
                  F&I PROTECTION PACKAGE
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink,
                  letterSpacing: -0.3, textTransform: 'uppercase',
                }}>Protect your investment.</div>
                <p style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginTop: 8, marginBottom: 0, lineHeight: 1.55 }}>
                  Optional add-ons — keep what you want, skip what you don't. Your monthly recalculates instantly.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                {ADDONS.map(a => {
                  const on = addons[a.key];
                  return (
                    <button key={a.key} type="button" onClick={() => setAddons(p => ({ ...p, [a.key]: !p[a.key] }))} style={{
                      textAlign: 'left', cursor: 'pointer', padding: 16,
                      background: on ? `${C.gold}15` : C.panel,
                      border: `1px solid ${on ? C.gold : C.rule2}`,
                      borderLeft: `4px solid ${on ? C.gold : C.rule2}`,
                      display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14,
                      transition: 'all 200ms',
                    }}>
                      {/* checkbox */}
                      <div style={{
                        width: 22, height: 22,
                        background: on ? C.gold : 'transparent',
                        border: `1px solid ${on ? C.gold : C.rule2}`,
                        display: 'grid', placeItems: 'center',
                        color: '#08080A', fontSize: 14, fontWeight: 700,
                      }}>{on ? '✓' : ''}</div>
                      <div>
                        <div style={{
                          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
                          marginBottom: 4,
                        }}>
                          <div style={{
                            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                            color: C.ink, letterSpacing: -0.2, textTransform: 'uppercase',
                          }}>{a.name}</div>
                          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.gold }}>
                            ${a.price.toLocaleString()} · ${a.mo}/mo over 60mo
                          </div>
                        </div>
                        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, lineHeight: 1.5 }}>
                          {a.desc}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                        color: on ? C.gold : C.inkLow, letterSpacing: -0.5,
                      }}>+${a.mo}<span style={{ fontSize: 11, color: C.inkLow }}>/mo</span></div>
                    </button>
                  );
                })}
              </div>

              {/* package subtotal */}
              <div style={{
                padding: '16px 22px',
                background: addonsMonthly > 0 ? C.panel : C.bg2,
                border: `1px solid ${addonsMonthly > 0 ? C.gold : C.rule}`,
                borderLeft: `4px solid ${addonsMonthly > 0 ? C.gold : C.rule2}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>
                    PROTECTION PACKAGE
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, marginTop: 2 }}>
                    {selectedAddons.length === 0
                      ? 'No add-ons selected. Skip this step or add coverage.'
                      : `${selectedAddons.length} item${selectedAddons.length === 1 ? '' : 's'} selected`}
                  </div>
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26,
                  color: addonsMonthly > 0 ? C.gold : C.inkLow, letterSpacing: -1,
                }}>+${addonsMonthly}<span style={{ fontSize: 13, color: C.inkLow }}>/mo</span></div>
              </div>
            </div>
          )}

          {/* STEP 5 — summary */}
          {step === 5 && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 6,
              }}>Your Deal</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 24 }}>
                Final terms determined at the dealership. This is your estimated, all-in monthly figure.
              </div>

              <div style={{
                background: C.panel, border: `1px solid ${C.rule}`, padding: 24,
                marginBottom: 18,
              }}>
                {(() => {
                  const rows = [
                    ['VEHICLE PRICE',          fmt(vehicle.price), false, false],
                    ['SALES TAX (6%)',         fmt(tax), false, false],
                    ['DOC FEE',                fmt(docFee), false, false],
                    ['TRADE-IN CREDIT',        hasTrade ? `– ${fmt(tradeCredit)}` : '–', false, false],
                    ['DOWN PAYMENT',           `– ${fmt(down)}`, false, false],
                    ['AMOUNT FINANCED',        fmt(financed), true, false],
                    ['APR',                    `${apr}%`, false, false],
                    ['TERM',                   `${term} months`, false, false],
                    ['BASE MONTHLY',           `${fmt(baseMonthly)}/mo`, false, false],
                    addonsMonthly > 0
                      ? [`PROTECTION PACKAGE (${selectedAddons.length})`, `+ ${fmt(addonsMonthly)}/mo`, false, true]
                      : null,
                  ].filter(Boolean);
                  return rows.map(([k, val, big, gold], i) => (
                    <div key={k} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: i < rows.length - 1 ? `1px solid ${C.rule}` : 'none',
                    }}>
                      <div style={{
                        fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
                        color: gold ? C.gold : C.inkDim, fontWeight: gold ? 700 : 500,
                      }}>{k}</div>
                      <div style={{
                        fontFamily: FONT_DISPLAY, fontWeight: big || gold ? 700 : 600,
                        fontSize: big ? 18 : 14, color: gold ? C.gold : C.ink, letterSpacing: 0.3,
                      }}>{val}</div>
                    </div>
                  ));
                })()}
              </div>

              {/* huge monthly */}
              <div style={{
                padding: '24px 28px',
                background: `linear-gradient(135deg, #1A1408 0%, #0E0E12 100%)`,
                border: `1px solid ${C.gold}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.gold, fontWeight: 700 }}>
                  ESTIMATED<br />MONTHLY PAYMENT
                </div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: C.gold,
                  lineHeight: 1, letterSpacing: -2,
                }}>{fmt(monthly)}<span style={{ fontSize: 20, color: C.inkLow }}>/mo</span></div>
              </div>

              <div style={{
                marginTop: 14, fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow,
                lineHeight: 1.6, letterSpacing: 0.5,
              }}>
                ★ This is an estimate. Final terms determined at dealership based on credit verification, exact vehicle, residency, and applicable taxes/fees.
              </div>
            </div>
          )}

          {/* STEP 6 — submit */}
          {step === 6 && !submitted && (
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
                color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginBottom: 6,
              }}>Lock it in.</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13, marginBottom: 22 }}>
                A team member will review your deal and call you back within 15 minutes.
              </div>

              <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
                {[
                  ['NAME',  name,  setName,  'text',  'Full Name'],
                  ['EMAIL', email, setEmail, 'email', 'you@email.com'],
                  ['PHONE', phone, setPhone, 'tel',   '(305) 555-0123'],
                ].map(([lab, val, setter, t, ph]) => (
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

              <div style={{
                padding: 14, background: C.bg2, border: `1px dashed ${C.rule2}`,
                fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, letterSpacing: 0.5, lineHeight: 1.6,
              }}>
                ▸ DEAL: {vehicle.y} {vehicle.mk} {vehicle.md}<br />
                ▸ MONTHLY: <span style={{ color: C.gold, fontWeight: 700 }}>{fmt(monthly)}/mo</span> · {term}mo @ {apr}% APR<br />
                ▸ DOWN: {fmt(down)} · TRADE: {hasTrade ? fmt(tradeCredit) : 'NONE'}<br />
                ▸ PROTECTION: {selectedAddons.length === 0 ? 'NONE' : `${selectedAddons.length} ITEM${selectedAddons.length === 1 ? '' : 'S'} · +$${addonsMonthly}/MO`}
              </div>
            </div>
          )}

          {step === 6 && submitted && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                background: `${C.gold}20`, border: `2px solid ${C.gold}`,
                display: 'grid', placeItems: 'center', margin: '0 auto 22px',
                color: C.gold, fontSize: 38,
              }}>✓</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28,
                color: C.ink, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 10,
              }}>Deal Submitted.</div>
              <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 14, lineHeight: 1.55, maxWidth: 440, margin: '0 auto 24px' }}>
                A team member will contact you within <strong style={{ color: C.gold }}>15 minutes</strong> to confirm and schedule your pickup or delivery.
              </div>
              <div style={{
                display: 'inline-block', padding: '8px 18px',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.cyan,
                border: `1px solid ${C.cyan}55`,
              }}>★ DEAL ID · D-{vehicle.id}-{Date.now().toString().slice(-5)}</div>
            </div>
          )}
        </div>

        {/* footer nav */}
        {!(step === TOTAL_STEPS && submitted) && (
          <div style={{
            padding: '18px 28px', borderTop: `1px solid ${C.rule}`,
            background: C.bg2,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {step > 1 ? (
              <button onClick={back} style={{
                padding: '12px 22px', background: 'transparent', color: C.inkDim,
                border: `1px solid ${C.rule2}`, cursor: 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>← BACK</button>
            ) : <span />}
            {step < TOTAL_STEPS ? (
              <button onClick={() => {
                // step 2 — must answer yes/no
                if (step === 2 && hasTrade === null) { setHasTrade(false); next(); return; }
                next();
              }} style={{
                padding: '12px 28px', background: C.gold, color: '#08080A',
                border: 'none', cursor: 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>{step === 2 && hasTrade === null ? 'SKIP →' : 'CONTINUE →'}</button>
            ) : (
              <button onClick={() => setSubmitted(true)} disabled={!name || !email || !phone} style={{
                padding: '12px 28px',
                background: (!name || !email || !phone) ? C.rule2 : C.gold,
                color: (!name || !email || !phone) ? C.inkLow : '#08080A',
                border: 'none', cursor: (!name || !email || !phone) ? 'not-allowed' : 'pointer',
                fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              }}>▸ SUBMIT MY DEAL</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Counters Block (between Charter and Voices) ──── */
