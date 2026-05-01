'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function QRBlock({ seed = 'P0000', size = 132 }) {
  const grid = useMemo(() => {
    // simple hash from seed
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff;
    const N = 21;
    const cells = [];
    for (let i = 0; i < N * N; i++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      cells.push((h >> 8) & 1);
    }
    return { N, cells };
  }, [seed]);
  const { N, cells } = grid;
  const cell = size / N;

  // mark finder squares (TL, TR, BL) — fixed pattern
  const isFinder = (r, c) => {
    const inSq = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    if (inSq(0, 0) || inSq(0, N - 7) || inSq(N - 7, 0)) {
      const local = (r % 7 < 1 || r % 7 > 5 || c % 7 < 1 || c % 7 > 5);
      const innerSq = (r0, c0) => r >= r0 + 2 && r < r0 + 5 && c >= c0 + 2 && c < c0 + 5;
      if (innerSq(0, 0) || innerSq(0, N - 7) || innerSq(N - 7, 0)) return true;
      return local;
    }
    return null;
  };

  return (
    <div style={{
      width: size, height: size, padding: 6, background: '#FFF',
      border: `1px solid ${C.gold}`,
    }}>
      <svg width={size - 12} height={size - 12} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const f = isFinder(r, c);
            const fill = f === true ? '#000' : f === false ? '#FFF' : (cells[r * N + c] ? '#000' : '#FFF');
            return <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fill} />;
          })
        )}
      </svg>
    </div>
  );
}

/* ─── TextUs floating button (left edge) ───────────── */
