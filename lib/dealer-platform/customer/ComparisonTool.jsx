'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function CompareModal({ onClose, initialIds = [] }) {
  const [open, setOpen] = useState(false);
  const [picks, setPicks] = useState(() => {
    const seed = initialIds.slice(0, 3);
    while (seed.length < 2) {
      const next = FLEET.find(f => !seed.includes(f.id));
      if (next) seed.push(next.id); else break;
    }
    return seed;
  });
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 240); };

  const vehicles = picks.map(id => FLEET.find(f => f.id === id)).filter(Boolean);

  const setSlot = (i, id) => {
    setPicks(p => { const n = [...p]; n[i] = id; return n; });
  };
  const addSlot = () => { if (picks.length < 3) {
    const next = FLEET.find(f => !picks.includes(f.id));
    if (next) setPicks([...picks, next.id]);
  }};
  const removeSlot = (i) => setPicks(p => p.filter((_, idx) => idx !== i));

  // determine winner per row (lowest = best for price/miles, highest = best for year/mpg/hp, fastest = best for sec)
  const winners = useMemo(() => {
    if (vehicles.length < 2) return {};
    const w = {};
    const min = (key) => vehicles.reduce((b, v) => v[key] < b[key] ? v : b, vehicles[0]).id;
    const max = (key) => vehicles.reduce((b, v) => v[key] > b[key] ? v : b, vehicles[0]).id;
    w.price   = min('price');
    w.monthly = min('price'); // monthly tracks price
    w.mi      = min('mi');
    w.y       = max('y');
    w.hp      = max('hp');
    w.mpg     = max('mpg');
    w.sec     = vehicles.reduce((b, v) => parseFloat(v.sec) < parseFloat(b.sec) ? v : b, vehicles[0]).id;
    return w;
  }, [vehicles]);

  const rows = [
    ['STICKER',     v => fmt(v.price),                    'price'],
    ['EST. MO.',    v => fmt(monthlyPayment(v.price)) + '/mo', 'monthly'],
    ['MILEAGE',     v => fmtMi(v.mi) + ' mi',             'mi'],
    ['YEAR',        v => v.y.toString(),                  'y'],
    ['BODY',        v => v.body,                          null],
    ['ENGINE',      v => v.eng,                           null],
    ['HORSEPOWER',  v => v.hp + ' HP',                    'hp'],
    ['0–60',        v => v.sec + 's',                     'sec'],
    ['MPG',         v => v.mpg.toString(),                'mpg'],
    ['TRANSMISSION',v => v.tx,                            null],
    ['DRIVETRAIN',  v => v.dr,                            null],
  ];

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 105,
      background: open ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(8px)' : 'none',
      transition: 'all 240ms',
      display: 'grid', placeItems: 'center', padding: 24, overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(1080px, 100%)', maxHeight: '92vh', overflowY: 'auto',
        background: C.bg, border: `1px solid ${C.cyan}55`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.cyan}25`,
        opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 28px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.cyan }}>
              ⇄ COMPARISON BENCH
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 4,
            }}>Side-by-Side · {vehicles.length} Vehicles</div>
          </div>
          <button onClick={close} style={{
            width: 38, height: 38, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* selector row */}
        <div style={{
          padding: 20, display: 'grid',
          gridTemplateColumns: `170px repeat(${vehicles.length}, 1fr) ${picks.length < 3 ? 'auto' : ''}`,
          gap: 0,
        }}>
          <div></div>
          {vehicles.map((v, i) => (
            <div key={i} style={{
              padding: '0 12px', borderRight: i < vehicles.length - 1 ? `1px solid ${C.rule}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                aspectRatio: '16/10',
                background: `url('${v.img}') center/cover`,
                border: `1px solid ${C.rule}`,
              }} />
              <select value={v.id} onChange={e => setSlot(i, e.target.value)} style={{
                appearance: 'none', background: C.panel, border: `1px solid ${C.rule2}`,
                color: C.ink, fontFamily: FONT_MONO, fontSize: 11, padding: '8px 10px',
                cursor: 'pointer', letterSpacing: 0.5,
              }}>
                {FLEET.map(f => (
                  <option key={f.id} value={f.id} style={{ background: C.panel }}>
                    {f.y} {f.mk} {f.md}
                  </option>
                ))}
              </select>
              {vehicles.length > 2 && (
                <button onClick={() => removeSlot(i)} style={{
                  background: 'transparent', color: C.inkDim,
                  border: `1px solid ${C.rule2}`, padding: '4px 8px', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1,
                }}>− REMOVE</button>
              )}
            </div>
          ))}
          {picks.length < 3 && (
            <button onClick={addSlot} style={{
              alignSelf: 'center', minWidth: 120,
              background: 'transparent', color: C.cyan,
              border: `1px dashed ${C.cyan}55`, padding: '12px',
              cursor: 'pointer', fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5,
              fontWeight: 700,
            }}>+ ADD VEHICLE</button>
          )}
        </div>

        {/* spec table */}
        <div style={{
          borderTop: `1px solid ${C.rule}`,
        }}>
          {rows.map(([lab, render, key], rIdx) => (
            <div key={lab} style={{
              display: 'grid',
              gridTemplateColumns: `170px repeat(${vehicles.length}, 1fr)`,
              borderBottom: `1px solid ${C.rule}`,
              background: rIdx % 2 === 0 ? C.bg : C.bg2,
            }}>
              <div style={{
                padding: '14px 20px',
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow,
                fontWeight: 600, borderRight: `1px solid ${C.rule}`,
              }}>{lab}</div>
              {vehicles.map((v, i) => {
                const isWinner = key && winners[key] === v.id;
                return (
                  <div key={i} style={{
                    padding: '14px 20px',
                    borderRight: i < vehicles.length - 1 ? `1px solid ${C.rule}` : 'none',
                    background: isWinner ? `${C.gold}15` : 'transparent',
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15,
                    color: isWinner ? C.gold : C.ink,
                    letterSpacing: 0.3,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {render(v)}
                    {isWinner && (
                      <span style={{
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.gold,
                      }}>★ BEST</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          padding: 24, background: C.bg2, borderTop: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 14,
        }}>
          <div style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 13,
          }}>Can't decide? Test-drive both — schedule both back-to-back in 30 minutes.</div>
          <button style={{
            padding: '14px 24px', background: C.gold, color: '#08080A',
            border: 'none', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>▸ Schedule Both Drives</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Saved Panel (slide-out from right) ──────────── */
