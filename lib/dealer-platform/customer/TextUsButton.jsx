'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function TextUsButton() {
  const config = useCustomerConfig();
  const phoneDigits = (config.phone || '').replace(/\D/g, '');
  return (
    <a
      href={`sms:${phoneDigits}?&body=${encodeURIComponent("Hi, I'm interested in a vehicle at " + (config.dealerName || 'your dealership'))}`}
      className="textus-btn"
      style={{
        position: 'fixed', left: 96, top: '50%',
        transform: 'translateY(-50%)', zIndex: 35,
        background: C.gold, color: '#08080A',
        textDecoration: 'none', cursor: 'pointer',
        padding: '14px 10px', writingMode: 'vertical-rl',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: 2,
        textTransform: 'uppercase',
        clipPath: 'polygon(0 0, 100% 8px, 100% calc(100% - 8px), 0 100%)',
        boxShadow: `4px 0 14px rgba(0,0,0,0.4), inset -1px 0 0 ${C.gold}`,
        transition: 'background 180ms, transform 180ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F4D77E'; e.currentTarget.style.transform = 'translateY(-50%) translateX(2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'translateY(-50%)'; }}
    >📱 Text Us</a>
  );
}

/* ─── Mobile Sticky Call Button ───────────────────── */
