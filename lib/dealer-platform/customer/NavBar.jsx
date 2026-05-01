'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function SideRail({ active, onJump, theme, onThemeToggle, lang, onLangToggle, savedCount, onShowSaved }) {
  const cfg = useCustomerConfig();
  const dealerInitial = (cfg.dealerName || 'D').charAt(0).toUpperCase();
  const cityShort = (cfg.address?.city || '').slice(0, 3).toUpperCase();
  const slugLabel = `${(cfg.dealerName || 'DEALER').split(' ')[0].toUpperCase()}//${cityShort || 'HQ'}`;
  const items = [
    { id:'top',      n:'00', l:'INDEX'    },
    { id:'fleet',    n:'01', l:'FLEET'    },
    { id:'detail',   n:'02', l:'DETAIL'   },
    { id:'trade',    n:'03', l:'TRADE'    },
    { id:'finance',  n:'04', l:'FINANCE'  },
    { id:'why',      n:'05', l:'CHARTER'  },
    { id:'process',  n:'06', l:'PROCESS'  },
    { id:'voices',   n:'07', l:'VOICES'   },
    { id:'alerts',   n:'08', l:'ALERTS'   },
    { id:'notebook', n:'09', l:'NOTEBOOK' },
    { id:'contact',  n:'10', l:'CONTACT'  },
  ];
  return (
    <aside className="side-rail" style={{
      position: 'fixed', top: 0, bottom: 0, left: 0, width: 96,
      background: C.bg, borderRight: `1px solid ${C.rule}`,
      zIndex: 40,
      display: 'flex', flexDirection: 'column',
      padding: '20px 0',
    }}>
      {/* logo block */}
      <a href="#top" onClick={(e) => { e.preventDefault(); onJump('top'); }} style={{
        display: 'block', padding: '0 12px 18px',
        borderBottom: `1px solid ${C.rule}`, marginBottom: 18,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 48, height: 48, margin: '0 auto',
          background: C.red,
          clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
          display: 'grid', placeItems: 'center',
          position: 'relative',
        }}>
          <span style={{
            color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 22, letterSpacing: '-1px',
          }}>{dealerInitial}</span>
        </div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.5,
          textAlign: 'center', marginTop: 8, color: C.gold,
        }}>{slugLabel}</div>
      </a>

      {/* section list */}
      <nav style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
        {items.map(({ id, n, l }) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); onJump(id); }} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 6px', textDecoration: 'none',
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5,
            color: active === id ? C.gold : C.inkLow,
            borderLeft: `2px solid ${active === id ? C.gold : 'transparent'}`,
            transition: 'color 200ms, border-color 200ms',
            marginBottom: 2,
          }}>
            <span style={{ color: active === id ? C.red : C.inkLow }}>{n}</span>
            <span>{l}</span>
          </a>
        ))}
      </nav>

      {/* utility cluster: saved + lang + theme */}
      <div style={{
        padding: '12px 6px', borderTop: `1px solid ${C.rule}`,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* SAVED button with badge */}
        <button onClick={onShowSaved} style={{
          position: 'relative',
          background: savedCount > 0 ? C.gold : 'transparent',
          color: savedCount > 0 ? C.bg : C.inkDim,
          border: `1px solid ${savedCount > 0 ? C.gold : C.rule2}`,
          padding: '8px 4px', cursor: 'pointer',
          fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
          transition: 'all 180ms',
        }}>
          ♥ SAVED
          {savedCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              minWidth: 18, height: 18, padding: '0 4px',
              background: C.red, color: '#FFF',
              borderRadius: 9, fontSize: 10, fontWeight: 700,
              display: 'grid', placeItems: 'center',
              border: `2px solid ${C.bg}`,
            }}>{savedCount}</span>
          )}
        </button>

        {/* LANG toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          border: `1px solid ${C.rule2}`,
        }}>
          {['en', 'es'].map(l => (
            <button key={l} onClick={() => lang !== l && onLangToggle()} style={{
              padding: '6px 0', cursor: 'pointer',
              background: lang === l ? C.gold : 'transparent',
              color: lang === l ? C.bg : C.inkDim,
              border: 'none',
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, fontWeight: 700,
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        {/* THEME toggle */}
        <button onClick={onThemeToggle} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} style={{
          background: 'transparent', border: `1px solid ${C.rule2}`,
          padding: '8px 4px', cursor: 'pointer',
          color: C.gold,
          fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 0,
          transition: 'all 180ms',
        }}>{theme === 'dark' ? '☀' : '☾'}</button>
      </div>

      {/* bottom block: phone */}
      <a href={`tel:${(cfg.phone || '').replace(/\D/g, '')}`} style={{
        padding: '14px 8px', textDecoration: 'none',
        borderTop: `1px solid ${C.rule}`,
        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1, color: C.ink,
        textAlign: 'center', display: 'block',
      }}>
        <div style={{ color: C.gold, fontSize: 8, letterSpacing: 2, marginBottom: 4 }}>HOTLINE</div>
        {(cfg.phone || '').replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3')}
      </a>
    </aside>
  );
}

/* ─── Marquee Ticker ───────────────────────────────── */
