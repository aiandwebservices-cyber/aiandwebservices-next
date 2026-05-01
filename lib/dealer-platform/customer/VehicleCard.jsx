'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

// Derives srcset from the optimized URL convention:
// .../full-{hash}.webp → thumb-{hash}.webp 400w, medium-{hash}.webp 800w, full-{hash}.webp 1600w
function buildSrcSet(imgUrl) {
  if (!imgUrl) return undefined;
  const m = imgUrl.match(/\/full-([a-f0-9]+\.webp)$/);
  if (!m) return undefined;
  const base = imgUrl.slice(0, imgUrl.lastIndexOf('/full-'));
  const suffix = m[1];
  return `${base}/thumb-${suffix} 400w, ${base}/medium-${suffix} 800w, ${imgUrl} 1600w`;
}

export function FleetCard({ v, url, priceMode, onView, onBuildDeal, isSaved, onToggleSave, isAlerted, onTogglePriceAlert, isReserved, idx }) {
  const [ref, seen] = useInView();
  const [hover, setHover] = useState(false);
  const monthly = monthlyPayment(v.price);
  const stop = (e) => { e.stopPropagation(); };

  return (
    <div
      ref={ref}
      onClick={() => onView(v)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        background: C.panel, border: `1px solid ${C.rule}`,
        opacity: seen ? 1 : 0,
        transform: seen ? `translateY(${hover ? -2 : 0}px)` : 'translateY(20px)',
        transition: `opacity 500ms ${idx * 40}ms, transform 200ms ease, box-shadow 200ms ease, border-color 200ms`,
        boxShadow: hover ? '0 6px 18px rgba(0,0,0,0.22)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
      className="fleet-card"
    >
      {/* image */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: '16/10',
        background: C.bg2,
      }}>
        {v.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={v.img}
            srcSet={buildSrcSet(v.img)}
            sizes="(max-width: 768px) 400px, 800px"
            alt={`${v.y} ${v.mk} ${v.md}`}
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {/* RESERVED overlay */}
        {isReserved && (
          <>
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'rgba(8,8,10,0.55)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              zIndex: 6, pointerEvents: 'none',
              background: C.gold, color: '#08080A',
              padding: '6px 18px',
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: 3,
              border: `2px solid #08080A`,
            }}>RESERVED</div>
          </>
        )}

        {/* corner stock # */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: C.gold, color: C.bg,
          fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
          padding: '3px 9px',
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
          paddingRight: 14,
        }}>STOCK · {v.id}</div>

        {/* HEART (save) — top right */}
        <button onClick={(e) => { stop(e); onToggleSave(); }}
          title={isSaved ? 'Unsave' : 'Save'}
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 4,
            width: 30, height: 30,
            background: isSaved ? C.gold : 'rgba(8,8,10,0.72)',
            border: `1px solid ${isSaved ? C.gold : C.rule2}`,
            color: isSaved ? '#08080A' : C.ink,
            cursor: 'pointer', fontSize: 13,
            display: 'grid', placeItems: 'center',
            transition: 'background 180ms, color 180ms',
          }}>{isSaved ? '♥' : '♡'}</button>

        {/* hover scrim — "View Details" is an anchor so Google can crawl the vehicle URL */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(8,8,10,0.82), rgba(8,8,10,0) 55%)',
          opacity: hover ? 1 : 0, transition: 'opacity 200ms',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 14,
          pointerEvents: 'none',
        }}>
          <a
            href={url}
            onClick={(e) => { e.preventDefault(); }}
            style={{
              fontFamily: FONT_DISPLAY, fontSize: 11, letterSpacing: 2, fontWeight: 700,
              color: '#08080A', textTransform: 'uppercase',
              background: C.gold, padding: '8px 16px',
              textDecoration: 'none', pointerEvents: 'auto',
            }}
          >View Details →</a>
        </div>
      </div>

      {/* spec sheet */}
      <div style={{
        padding: 16,
        display: 'flex', flexDirection: 'column', gap: 6,
        flex: 1,
      }}>
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2,
            color: C.inkLow, marginBottom: 3,
          }}>{v.y} · {v.body.toUpperCase()} · {fmtMi(v.mi)} mi</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 17, letterSpacing: -0.3,
            color: C.ink, lineHeight: 1.1, textTransform: 'uppercase',
          }}>{v.mk} {v.md}</div>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 11.5, color: C.inkDim, marginTop: 3, lineHeight: 1.35,
          }}>{v.eng} · {v.tx}</div>
        </div>

        {/* History badges — derived from v.flags[] OR explicit booleans */}
        {(() => {
          const flagsArr = Array.isArray(v.flags) ? v.flags.map(f => String(f).toUpperCase()) : [];
          const has = (s) => flagsArr.some(f => f.includes(s));
          const items = [
            { show: !!v.noAccidents || has('NO ACCIDENT'),  label: 'No Accidents' },
            { show: !!v.oneOwner    || has('ONE-OWNER') || has('ONE OWNER'), label: '1-Owner' },
            { show: !!v.cleanTitle  || has('CLEAN TITLE'),  label: 'Clean Title' },
          ].filter(x => x.show);
          if (items.length === 0) return null;
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {items.map(it => (
                <span key={it.label} style={{
                  fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1,
                  color: '#22C55E', fontWeight: 700,
                }}>✓ {it.label.toUpperCase()}</span>
              ))}
            </div>
          );
        })()}

        {/* price + payment - always shown */}
        <div style={{
          marginTop: 'auto', paddingTop: 10,
          borderTop: `1px solid ${C.rule}`,
        }}>
          {priceMode === 'payment' ? (
            <>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700,
                color: C.gold, lineHeight: 1, marginBottom: 4,
              }}>{fmt(monthly)}<span style={{ fontSize: 12, color: C.inkLow, marginLeft: 2 }}>/mo</span></div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim }}>
                {fmt(v.price)} sticker · 60mo @ 6.9%
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700,
                color: C.gold, lineHeight: 1, marginBottom: 4,
              }}>{fmt(v.price)}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim }}>
                Est. {fmt(monthly)}/mo
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── 02 · DETAIL DRAWER (full-height slide-in) ────── */
