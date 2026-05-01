'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  C, THEMES, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  monthlyPayment, fmt, fmtMi,
} from './_internals';

export function VehicleDetailPageContent({
  vehicle: v,
  dealerConfig,
  prevSlug,
  nextSlug,
  dealerId,
}) {
  const [shot, setShot] = useState(0);
  const thumbs = Array.isArray(v.imgs) && v.imgs.length ? v.imgs : [v.img].filter(Boolean);
  const monthly = monthlyPayment(v.price);
  const dealerSlug = dealerConfig?.dealerSlug || dealerId;

  return (
    <div style={{
      ...THEMES.dark,
      minHeight: '100vh',
      background: C.bg, color: C.ink,
      fontFamily: FONT_BODY,
    }}>
      {/* nav strip */}
      <div style={{
        padding: '14px 28px',
        borderBottom: `1px solid ${C.rule}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: C.bg2, position: 'sticky', top: 0, zIndex: 20,
      }}>
        <Link
          href={`/dealers/${dealerSlug}`}
          style={{ color: C.gold, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, textDecoration: 'none' }}
        >
          ← BACK TO INVENTORY
        </Link>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {prevSlug && (
            <Link
              href={`/dealers/${dealerSlug}/inventory/${prevSlug}`}
              style={{ color: C.inkDim, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, textDecoration: 'none' }}
            >
              ‹ PREV
            </Link>
          )}
          {nextSlug && (
            <Link
              href={`/dealers/${dealerSlug}/inventory/${nextSlug}`}
              style={{ color: C.inkDim, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, textDecoration: 'none' }}
            >
              NEXT ›
            </Link>
          )}
        </div>
      </div>

      {/* page header */}
      <div style={{
        padding: '28px 32px 24px',
        background: C.bg2, borderBottom: `1px solid ${C.rule}`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2.5,
          color: C.gold, marginBottom: 6,
        }}>
          DOSSIER · {v.stockNumber || v.id}
          {v.vin ? ` · VIN ${v.vin}` : ''}
        </div>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          letterSpacing: '-1px', textTransform: 'uppercase',
          color: C.ink, margin: '0 0 6px',
        }}>
          {v.y || v.year} {v.mk || v.make} {v.md || v.model}
        </h1>
        {v.trim && (
          <div style={{ fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15, marginBottom: 16 }}>
            {v.trim}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 700, color: C.gold, lineHeight: 1,
          }}>{fmt(v.price)}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim }}>
            Est. {fmt(monthly)}/mo · {fmtMi(v.mi)} miles
          </div>
        </div>
      </div>

      {/* main two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 0,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '32px 24px',
        alignItems: 'start',
      }} className="vdp-layout">

        {/* LEFT: gallery + specs + description */}
        <div style={{ paddingRight: 24 }}>

          {/* photo gallery */}
          {thumbs.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{
                aspectRatio: '16/9',
                background: `url('${thumbs[shot]}') center/cover no-repeat ${C.bg2}`,
                border: `1px solid ${C.rule}`,
              }} />
              {thumbs.length > 1 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {thumbs.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setShot(i)}
                      aria-label={`Photo ${i + 1}`}
                      style={{
                        width: 80, height: 56,
                        background: `url('${t}') center/cover`,
                        border: `1px solid ${shot === i ? C.gold : C.rule}`,
                        cursor: 'pointer', padding: 0,
                        opacity: shot === i ? 1 : 0.6,
                        transition: 'opacity 150ms, border-color 150ms',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* spec grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: `1px solid ${C.rule}`, marginBottom: 28,
          }}>
            {[
              ['MILEAGE',      `${fmtMi(v.mi)} mi`],
              ['EXTERIOR',     v.ext  || v.exteriorColor  || '—'],
              ['INTERIOR',     v.int  || v.interiorColor  || '—'],
              ['ENGINE',       v.eng  || v.engine         || '—'],
              ['TRANSMISSION', v.tx   || v.transmission   || '—'],
              ['DRIVETRAIN',   v.dr   || v.drivetrain     || '—'],
              ['BODY STYLE',   v.body || v.bodyStyle      || '—'],
              ['FUEL TYPE',    v.fuelType                 || '—'],
            ].map(([k, val], i) => (
              <div key={k} style={{
                padding: '14px 18px',
                borderRight:  i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
                borderBottom: i < 6        ? `1px solid ${C.rule}` : 'none',
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.ink, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          {v.description && (
            <div style={{ padding: '20px 24px', border: `1px solid ${C.rule}`, marginBottom: 28 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 10 }}>
                VEHICLE DESCRIPTION
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.inkDim, lineHeight: 1.7, margin: 0 }}>
                {v.description}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: sticky CTA sidebar */}
        <div>
          <div style={{ position: 'sticky', top: 68 }}>
            <div style={{ background: C.bg2, border: `1px solid ${C.rule}`, padding: 24, marginBottom: 16 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 8 }}>
                ASKING PRICE
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: C.gold, marginBottom: 4,
              }}>{fmt(v.price)}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.inkDim, marginBottom: 24 }}>
                Est. {fmt(monthly)}/mo · 60mo @ 6.9%
              </div>

              <a
                href={`/dealers/${dealerSlug}#fleet`}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '14px 20px',
                  background: C.gold, color: '#08080A',
                  textDecoration: 'none',
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
                  letterSpacing: 2, textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                ★ Build Your Deal
              </a>

              {dealerConfig?.phone && (
                <a
                  href={`tel:${dealerConfig.phone}`}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '12px 20px',
                    background: 'transparent', color: C.ink,
                    border: `1px solid ${C.rule2}`,
                    textDecoration: 'none',
                    fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1,
                  }}
                >
                  📞 {dealerConfig.phone}
                </a>
              )}
            </div>

            {dealerConfig?.address?.street && (
              <div style={{ background: C.bg2, border: `1px solid ${C.rule}`, padding: 18 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.inkLow, marginBottom: 8 }}>
                  {dealerConfig.dealerName}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.inkDim, lineHeight: 1.65 }}>
                  {dealerConfig.address.street}<br />
                  {dealerConfig.address.city}, {dealerConfig.address.state} {dealerConfig.address.zip}
                </div>
                {dealerConfig.hours?.monFri && (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow, marginTop: 10, letterSpacing: 0.5 }}>
                    Mon–Fri {dealerConfig.hours.monFri}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .vdp-layout {
            grid-template-columns: 1fr !important;
          }
          .vdp-layout > div:first-child {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
