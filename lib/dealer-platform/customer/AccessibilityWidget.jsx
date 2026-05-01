'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function AccessibilityWidget({ a11y, setA11y }) {
  const [open, setOpen] = useState(false);
  const toggle = (key) => setA11y(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Accessibility options" className="a11y-btn" style={{
        position: 'fixed', left: 116, bottom: 24, zIndex: 50,
        width: 48, height: 48,
        background: C.cyan, color: '#08080A',
        border: `2px solid ${C.cyan}`, cursor: 'pointer',
        clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
        display: 'grid', placeItems: 'center',
        fontSize: 20, fontWeight: 700,
        boxShadow: `0 6px 22px rgba(91,227,255,0.4)`,
      }}>♿</button>

      {open && (
        <div className="a11y-panel" style={{
          position: 'fixed', left: 116, bottom: 84, zIndex: 49,
          width: 280, background: 'var(--c-glass)',
          backdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${C.cyan}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 24px ${C.cyan}30`,
          padding: 18,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.cyan }}>
                ♿ ACCESSIBILITY
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                color: C.ink, letterSpacing: -0.3, marginTop: 2,
              }}>Adjust Display</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              width: 26, height: 26, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 12,
            }}>✕</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {[
              ['largeFont',   'INCREASE FONT SIZE',  'Scales all text 20% larger'],
              ['highContrast','HIGH CONTRAST MODE',  'Pure white on black, no gradients'],
              ['noMotion',    'PAUSE ANIMATIONS',    'Disables motion site-wide'],
            ].map(([key, lab, sub]) => (
              <li key={key} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12,
                padding: 10, background: C.panel, border: `1px solid ${C.rule}`,
              }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.ink, fontWeight: 700 }}>{lab}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.inkDim, marginTop: 2 }}>{sub}</div>
                </div>
                <button onClick={() => toggle(key)} style={{
                  width: 44, height: 24, position: 'relative',
                  background: a11y[key] ? C.cyan : C.rule2, border: 'none',
                  cursor: 'pointer', padding: 0, transition: 'background 200ms',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: a11y[key] ? 23 : 3,
                    width: 18, height: 18,
                    background: a11y[key] ? '#08080A' : C.ink,
                    transition: 'left 200ms',
                  }} />
                </button>
              </li>
            ))}
          </ul>

          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.rule}`,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, color: C.gold, lineHeight: 1.6,
          }}>★ ADA COMPLIANT — Accessibility matters to us.</div>
        </div>
      )}
    </>
  );
}

/* ─── Page Composition ───────────────────────────── */
/**
 * CustomerSite — main composer for the dealer customer-facing site.
 *
 * Receives a `config` prop (per-dealer override of defaultConfig) and threads
 * dealer-specific values (name, phone, email, address, colors, features)
 * down through the section components below.
 *
 * NOTE: This file was previously the monolithic PrimoAutoGroup component.
 * Many internal sections (Hero/Fleet/TradeIn/Charter/Voices/etc.) still live
 * inline below and read hardcoded Primo strings. Future sessions will break
 * each section into its own file under lib/dealer-platform/customer/ — see
 * REFACTOR_NOTES.md.
 *
 * For dealer-specific values, the helpers below thread `config` into the most
 * visible places: phone numbers, addresses, dealer name in headings, footer.
 */
import { defaultConfig } from '@/lib/dealer-platform/config/default-config';

