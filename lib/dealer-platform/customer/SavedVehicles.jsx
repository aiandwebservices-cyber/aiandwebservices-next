'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function SavedPanel({ saved, onClose, onToggleSave, onView, onCompare }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 280); };

  const items = FLEET.filter(v => saved.has(v.id));

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: open ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
      backdropFilter: open ? 'blur(4px)' : 'none',
      transition: 'all 280ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: 'min(440px, 100%)', background: C.bg,
        borderLeft: `1px solid ${C.gold}`,
        transform: open ? 'translateX(0)' : 'translateX(40px)',
        opacity: open ? 1 : 0,
        transition: 'all 280ms cubic-bezier(0.2,0.8,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.bg2,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.5, color: C.gold }}>
              ♥ SAVED VEHICLES
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
              color: C.ink, letterSpacing: -0.3, textTransform: 'uppercase', marginTop: 2,
            }}>{items.length} {items.length === 1 ? 'Vehicle' : 'Vehicles'}</div>
          </div>
          <button onClick={close} style={{
            width: 36, height: 36, background: 'transparent',
            border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
            fontFamily: FONT_MONO, fontSize: 16,
          }}>✕</button>
        </div>

        {/* list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {items.length === 0 ? (
            <div style={{
              padding: 40, textAlign: 'center', color: C.inkDim,
              fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.55,
            }}>
              <div style={{ fontSize: 32, color: C.gold, marginBottom: 12 }}>♡</div>
              No saved vehicles yet.<br />
              Tap the heart on any car to save it here.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map(v => (
                <div key={v.id} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr',
                  gap: 12, background: C.panel, border: `1px solid ${C.rule}`,
                }}>
                  <div style={{
                    aspectRatio: '4/3',
                    background: `url('${v.img}') center/cover`,
                  }} />
                  <div style={{ padding: '10px 10px 10px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.inkLow }}>
                      {v.id} · {v.y}
                    </div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                      color: C.ink, letterSpacing: -0.2, lineHeight: 1.1,
                    }}>{v.mk} {v.md}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: C.gold,
                    }}>{fmt(v.price)}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
                      <button onClick={() => { close(); setTimeout(() => onView(v), 320); }} style={{
                        flex: 1, padding: '6px 8px', background: C.gold, color: '#08080A',
                        border: 'none', cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                      }}>VIEW</button>
                      <button onClick={() => onToggleSave(v.id)} style={{
                        padding: '6px 8px', background: 'transparent', color: C.inkDim,
                        border: `1px solid ${C.rule2}`, cursor: 'pointer',
                        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                      }}>REMOVE</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer CTA */}
        {items.length >= 2 && (
          <div style={{
            padding: 20, borderTop: `1px solid ${C.rule}`, background: C.bg2,
          }}>
            <button onClick={onCompare} style={{
              width: '100%', padding: 14, background: C.cyan, color: '#08080A',
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>⇄ Compare Saved Vehicles</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── BUILD YOUR DEAL — 5-step wizard ────────────── */
