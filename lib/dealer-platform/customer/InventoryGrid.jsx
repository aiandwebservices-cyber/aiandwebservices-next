'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';
import { FleetCard } from './VehicleCard';

export function Fleet({ priceMode, setPriceMode, onView, onBuildDeal, saved, onToggleSave, priceAlerts, onTogglePriceAlert, onCompare, reserved, bodyType, sortBy, setSortBy }) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = FLEET;
    if (bodyType === 'electric') {
      list = list.filter(v => v.flags.includes('EV') || /electric|ev|dual motor/i.test(v.eng));
    } else if (bodyType !== 'all') {
      const map = { sedan: 'sedan', suv: 'suv', truck: 'truck', coupe: 'coupe', van: 'van' };
      const target = map[bodyType];
      list = list.filter(v => (v.body || '').toLowerCase() === target);
    }
    const sorted = [...list];
    if (sortBy === 'price-asc')  sorted.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a,b) => b.price - a.price);
    if (sortBy === 'mi-asc')     sorted.sort((a,b) => a.mi - b.mi);
    if (sortBy === 'year-desc')  sorted.sort((a,b) => b.y - a.y);
    return sorted;
  }, [bodyType, sortBy]);

  return (
    <section id="fleet" style={{
      position: 'relative', padding: '40px 0 72px 0',
      background: C.bg,
    }}>
      <VTag num={1} label="FLEET" color={C.gold} />

      <div style={{ paddingLeft: 96, paddingRight: 48 }} className="fleet-pad">
        {/* compact section head */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
              marginBottom: 6,
            }}>01 / FLEET MANIFEST</div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', lineHeight: 1,
              letterSpacing: '-1px', color: C.ink, margin: 0,
              textTransform: 'uppercase',
            }}>The fleet</h2>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }} className="fleet-controls">
            <span style={{
              fontFamily: FONT_MONO, fontSize: 11, color: C.inkDim, letterSpacing: 1,
            }}>
              <strong style={{ color: C.gold, fontSize: 14, fontFamily: FONT_DISPLAY, marginRight: 4 }}>{filtered.length}</strong>
              {filtered.length === 1 ? 'vehicle' : 'vehicles'} found
            </span>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              background: C.panel, border: `1px solid ${C.rule2}`,
              color: C.ink, fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
              padding: '8px 12px', cursor: 'pointer', letterSpacing: 1,
              appearance: 'none',
            }}>
              <option value="recent">Sort: Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mi-asc">Mileage: Low to High</option>
              <option value="year-desc">Year: Newest First</option>
            </select>

            <button onClick={onCompare} style={{
              padding: '8px 14px', background: 'transparent',
              color: C.cyan, border: `1px solid ${C.cyan}55`, cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.cyan}55`; }}
            >⇄ COMPARE</button>

            <div style={{ display: 'inline-flex', border: `1px solid ${C.rule2}` }}>
              {[['price','STICKER'],['payment','PAYMENT']].map(([k, l]) => (
                <button key={k} onClick={() => setPriceMode(k)} style={{
                  padding: '8px 14px',
                  background: priceMode === k ? C.gold : 'transparent',
                  color: priceMode === k ? C.bg : C.inkDim,
                  border: 'none', cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
                }}>{l}</button>
              ))}
            </div>

            <button onClick={() => setFiltersOpen(o => !o)} className="mobile-filter-btn" style={{
              padding: '8px 14px', background: filtersOpen ? C.gold : C.panel,
              color: filtersOpen ? C.bg : C.ink, border: `1px solid ${filtersOpen ? C.gold : C.rule2}`,
              cursor: 'pointer',
              fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 700,
            }}>⚙ FILTERS</button>
          </div>
        </header>

        {/* compact search row */}
        <div style={{
          background: C.panel, border: `1px solid ${C.rule}`,
          padding: 0, marginBottom: 24,
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr) auto',
        }} className={`search-row ${filtersOpen ? 'open' : ''}`}>
          {[
            { lab: 'MAKE',    opts: ['ANY', 'BMW', 'MERCEDES', 'AUDI', 'LEXUS', 'TESLA', 'PORSCHE', 'FORD', 'RANGE ROVER'] },
            { lab: 'MODEL',   opts: ['ANY MODEL'] },
            { lab: 'YEAR',    opts: ['ANY', '2024', '2023', '2022', '2021'] },
            { lab: priceMode === 'payment' ? 'MO. RANGE' : 'PRICE',
              opts: priceMode === 'payment'
                ? ['ANY', '<$400', '$400-600', '$600-800', '>$800']
                : ['ANY', '<$20K', '$20-40K', '$40-60K', '>$60K'] },
            { lab: 'MILES',   opts: ['ANY', '<15K', '15-30K', '30-50K', '50K+'] },
            { lab: 'BODY',    opts: ['ANY', 'SUV', 'SEDAN', 'TRUCK', 'COUPE', 'VAN'] },
            { lab: 'COLOR',   opts: ['ANY', 'WHITE', 'BLACK', 'GREY', 'RED'] },
          ].map((d, i) => (
            <div key={d.lab} style={{
              padding: 12, borderRight: `1px solid ${C.rule}`,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 2, color: C.inkLow, marginBottom: 4 }}>{d.lab}</div>
              <select style={{
                width: '100%', appearance: 'none',
                background: 'transparent', border: 'none',
                color: C.ink, fontSize: 12, fontFamily: FONT_DISPLAY, fontWeight: 600,
                cursor: 'pointer', letterSpacing: 0.5, padding: 0,
              }}>{d.opts.map(o => <option key={o} style={{ background: C.bg }}>{o}</option>)}</select>
            </div>
          ))}
          <button style={{
            background: C.red, color: C.ink, border: 'none',
            padding: '0 28px', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>RUN ⟶</button>
        </div>

        {/* fleet grid — clean 4-column */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        }} className="fleet-grid">
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', padding: '60px 24px', textAlign: 'center',
              color: C.inkDim, border: `1px dashed ${C.rule2}`, background: C.panel,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, marginBottom: 10, color: C.gold }}>NO MATCHES</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14 }}>No vehicles in this category right now. Try another body type.</div>
            </div>
          ) : filtered.map((v, i) => (
            <FleetCard
              key={v.id} v={v}
              priceMode={priceMode}
              onView={onView}
              onBuildDeal={onBuildDeal}
              isSaved={saved.has(v.id)}
              onToggleSave={() => onToggleSave(v.id)}
              isAlerted={priceAlerts.has(v.id)}
              onTogglePriceAlert={() => onTogglePriceAlert(v.id)}
              isReserved={reserved.has(v.id)}
              idx={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Fleet Card (spec sheet style) ────────────────── */
