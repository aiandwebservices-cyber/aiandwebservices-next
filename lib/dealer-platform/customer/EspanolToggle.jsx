'use client';
import { C, FONT_MONO } from './_internals';

/**
 * EspanolToggle — EN/ES language switch.
 *
 * Toggles between the two key sets in I18N (en/es). The richer version with
 * additional UI affordances is currently inline inside NavBar (the SideRail
 * vertical button row); this is the standalone reusable version.
 *
 * Props:
 *   value: 'en' | 'es'
 *   onChange: (next) => void
 *   className: extra class names
 */
export function EspanolToggle({ value = 'en', onChange, className = '' }) {
  return (
    <div className={`inline-flex border ${className}`} style={{ borderColor: C.rule2 }}>
      {['en', 'es'].map(l => {
        const on = value === l;
        return (
          <button key={l} onClick={() => onChange && onChange(l)} style={{
            padding: '6px 10px',
            background: on ? C.gold : 'transparent',
            color: on ? C.bg : C.inkDim,
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
            border: 'none', cursor: 'pointer',
          }}>{l.toUpperCase()}</button>
        );
      })}
    </div>
  );
}

export default EspanolToggle;
