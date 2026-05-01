'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function MobileCallButton() {
  const config = useCustomerConfig();
  const phoneDigits = (config.phone || '').replace(/\D/g, '');
  return (
    <a
      href={`tel:${phoneDigits}`}
      className="mobile-call-btn"
      style={{
        display: 'none', /* shown on mobile via media query */
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 78,
        padding: '14px 18px',
        background: C.red, color: '#FFFFFF',
        textDecoration: 'none', textAlign: 'center',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
        letterSpacing: 2, textTransform: 'uppercase',
        borderTop: `2px solid ${C.gold}`,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
      }}
    >📞 Call {config.phone}</a>
  );
}

/* ─── Beat Any Price floating badge (right side) ──── */
