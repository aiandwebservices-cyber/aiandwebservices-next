'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

const BODY_TYPES = [
  { key: 'all',      icon: '🔥', label: 'All' },
  { key: 'sedan',    icon: '🚗', label: 'Sedan' },
  { key: 'suv',      icon: '🚙', label: 'SUV' },
  { key: 'truck',    icon: '🛻', label: 'Truck' },
  { key: 'coupe',    icon: '🏎️', label: 'Coupe' },
  { key: 'van',      icon: '🚐', label: 'Van' },
  { key: 'electric', icon: '⚡', label: 'Electric' },
];

export function BodyTypePicker({ value, onChange }) {
  return (
    <section style={{
      background: C.bg2,
      borderTop: `1px solid ${C.rule}`,
      borderBottom: `1px solid ${C.rule}`,
      padding: '20px 48px 20px 96px',
    }} className="bodytype-section">
      <div style={{
        display: 'flex', gap: 10, alignItems: 'stretch',
        overflowX: 'auto', paddingBottom: 4,
        scrollbarWidth: 'thin',
      }} className="bodytype-row">
        {BODY_TYPES.map(t => {
          const on = value === t.key;
          return (
            <button key={t.key} onClick={() => onChange(t.key)} style={{
              flex: '0 0 auto', minWidth: 96,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 16px',
              background: on ? C.gold : C.panel,
              color: on ? '#08080A' : C.ink,
              border: `1px solid ${on ? C.gold : C.rule}`,
              cursor: 'pointer', transition: 'background 180ms, border-color 180ms, color 180ms',
              fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 12,
              letterSpacing: 1.5, textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!on) e.currentTarget.style.borderColor = C.gold; }}
            onMouseLeave={e => { if (!on) e.currentTarget.style.borderColor = C.rule; }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─── 01 · FLEET ─────────────────────────────────────── */
