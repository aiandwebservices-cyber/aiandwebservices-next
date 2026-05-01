'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function Ticker() {
  const items = [
    'NEW ARRIVAL · 2024 AUDI Q5 PREMIUM PLUS · STOCK P5031',
    'FINANCING FROM 2.9% APR · O.A.C.',
    '★★★★★ 4.9 / 847 GOOGLE REVIEWS',
    'FREE HOME DELIVERY · SOUTH FLORIDA',
    '7-DAY MONEY-BACK GUARANTEE',
    '150-POINT INSPECTION · EVERY VEHICLE',
    'TRADE-IN VALUES UP $1,200 THIS WEEK',
    'HABLAMOS ESPAÑOL · OPEN 7 DAYS',
  ];
  const line = items.join('   ◆   ');
  return (
    <div style={{
      position: 'fixed', top: 'var(--banner-h, 0px)', left: 96, right: 0,
      height: 28, background: C.red, color: C.ink,
      borderBottom: `1px solid ${C.redDeep}`,
      overflow: 'hidden', zIndex: 35,
      display: 'flex', alignItems: 'center',
    }} className="marquee-bar">
      <div style={{
        whiteSpace: 'nowrap', display: 'inline-flex', gap: 60,
        animation: 'marquee 60s linear infinite',
        fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
      }}>
        <span>{line}</span>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}

/* ─── 00 · HERO / INDEX ─────────────────────────────── */
