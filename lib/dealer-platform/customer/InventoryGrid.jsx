'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';
import { FleetCard } from './VehicleCard';
import { SEED_VEHICLES } from '@/lib/dealer-platform/data/seed-vehicles';

/* ─── Live-inventory plumbing ───────────────────────────────────────────
 * Module-level cache shared between <Fleet/> and <DetailDrawer/> so opening
 * the detail view doesn't re-fetch and "similar vehicles" can run instantly.
 * The cache TTL (5 min) and the promise-dedup keep concurrent mounts cheap.
 * ────────────────────────────────────────────────────────────────────── */

const CACHE_TTL = 5 * 60 * 1000;
export const ALLOWED_STATUSES = new Set([
  'Available', 'Featured', 'OnSale', 'JustArrived', 'PriceDrop',
]);

const _invCache = new Map();   // dealerId -> { vehicles, ts, source }
const _invInflight = new Map(); // dealerId -> Promise

export function mapEspoVehicle(e) {
  if (!e || typeof e !== 'object') return null;
  const flags = [];
  if (e.oneOwner)    flags.push('ONE-OWNER');
  if (e.noAccidents) flags.push('NO ACCIDENTS');
  const ft = String(e.fuelType || '').toLowerCase();
  if (ft === 'electric' || ft === 'ev' || /electric|dual motor/i.test(e.engine || '')) {
    flags.push('EV');
  }
  if (Number(e.mileage) && Number(e.mileage) < 15000) flags.push('LOW MILEAGE');

  let photos = [];
  if (typeof e.photoUrls === 'string') {
    photos = e.photoUrls.split(',').map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(e.photoUrls)) {
    photos = e.photoUrls.filter(Boolean);
  } else if (Array.isArray(e.photos)) {
    photos = e.photos.filter(Boolean);
  }

  const listPrice = e.listPrice == null ? null : Number(e.listPrice);
  const salePrice = e.salePrice == null ? null : Number(e.salePrice);
  const price = Number(salePrice ?? listPrice ?? e.price ?? 0);

  const daysOnLot = e.dateAdded
    ? Math.max(0, Math.floor((Date.now() - new Date(e.dateAdded).getTime()) / 86400000))
    : Number(e.daysOnLot) || 0;

  return {
    // FLEET-shape fields the customer-site cards/drawer read directly
    id: e.id || e.stockNumber || '',
    y: Number(e.year) || 0,
    mk: e.make || '',
    md: e.model || '',
    trim: e.trim || '',
    price,
    salePrice,
    listPrice,
    mi: Number(e.mileage) || 0,
    body: e.bodyStyle || '',
    ext: e.exteriorColor || '',
    int: e.interiorColor || '',
    eng: e.engine || '',
    tx: e.transmission || '',
    dr: e.drivetrain || '',
    hp: Number(e.horsepower) || 0,
    sec: e.zeroToSixty || '',
    mpg: Number(e.mpgCity || e.mpgHwy) || 0,
    vin: e.vin || '',
    stockNumber: e.stockNumber || '',
    status: e.status || 'Available',
    img: photos[0] || '',
    imgs: photos,
    videoId: e.videoId || '',
    flags,
    description: e.description || '',
    daysOnLot,
    // EspoCRM-shape passthroughs so findSimilarVehicles can score correctly
    year: Number(e.year) || 0,
    make: e.make || '',
    model: e.model || '',
    bodyStyle: e.bodyStyle || '',
    fuelType: e.fuelType || '',
    noAccidents: !!e.noAccidents,
    oneOwner: !!e.oneOwner,
  };
}

function vehicleUrlSlug(v, dealerSlug) {
  const slugify = (s) => String(s || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const parts = [v.y, v.mk, v.md].map(slugify).filter(Boolean).join('-');
  const tail = v.stockNumber || v.id || '';
  return `/dealers/${dealerSlug}/inventory/${parts}${tail ? '-' + slugify(tail) : ''}`;
}

async function fetchInventory(dealerId) {
  const inflight = _invInflight.get(dealerId);
  if (inflight) return inflight;
  const p = (async () => {
    try {
      const res = await fetch(
        `/api/dealer/${encodeURIComponent(dealerId)}/vehicles`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || data.ok === false) throw new Error(data?.error || 'API returned ok:false');
      const raw = Array.isArray(data.vehicles) ? data.vehicles : [];
      const list = raw
        .map(mapEspoVehicle)
        .filter((v) => v && ALLOWED_STATUSES.has(v.status));
      const entry = { vehicles: list, ts: Date.now(), source: 'live' };
      _invCache.set(dealerId, entry);
      return entry;
    } catch (err) {
      const list = SEED_VEHICLES
        .map(mapEspoVehicle)
        .filter((v) => v && ALLOWED_STATUSES.has(v.status));
      const entry = { vehicles: list, ts: Date.now(), source: 'seed', error: err.message };
      _invCache.set(dealerId, entry);
      return entry;
    } finally {
      _invInflight.delete(dealerId);
    }
  })();
  _invInflight.set(dealerId, p);
  return p;
}

export function useDealerInventory(dealerId) {
  const [state, setState] = useState({
    vehicles: [], loading: true, source: null, error: null,
  });

  useEffect(() => {
    if (!dealerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      const id = setTimeout(() => setState({ vehicles: [], loading: false, source: 'seed', error: null }), 0);
      return () => clearTimeout(id);
    }
    const hit = _invCache.get(dealerId);
    const now = Date.now();
    if (hit && now - hit.ts < CACHE_TTL) {
      const id = setTimeout(() =>
        setState({ vehicles: hit.vehicles, loading: false, source: hit.source, error: hit.error || null }), 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    fetchInventory(dealerId).then((entry) => {
      if (cancelled) return;
      setState({
        vehicles: entry.vehicles,
        loading: false,
        source: entry.source,
        error: entry.error || null,
      });
    });
    return () => { cancelled = true; };
  }, [dealerId]);

  return state;
}

function FleetSkeletonCard({ idx }) {
  return (
    <div style={{
      position: 'relative', background: C.panel, border: `1px solid ${C.rule}`,
      display: 'flex', flexDirection: 'column', minHeight: 360,
    }}>
      <div style={{
        aspectRatio: '16/10',
        background: `linear-gradient(90deg, ${C.bg2} 0%, ${C.panel} 50%, ${C.bg2} 100%)`,
        backgroundSize: '200% 100%',
        animation: `inv-shimmer 1.4s ${idx * 120}ms infinite linear`,
      }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 10, width: '60%', background: C.bg2, opacity: 0.6 }} />
        <div style={{ height: 14, width: '85%', background: C.bg2, opacity: 0.6 }} />
        <div style={{ height: 10, width: '40%', background: C.bg2, opacity: 0.4 }} />
        <div style={{ height: 24, width: '50%', background: C.bg2, opacity: 0.5, marginTop: 8 }} />
      </div>
    </div>
  );
}

export function Fleet({ priceMode, setPriceMode, onView, onBuildDeal, saved, onToggleSave, priceAlerts, onTogglePriceAlert, onCompare, reserved, bodyType, sortBy, setSortBy }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const config = useCustomerConfig();
  const dealerSlug = config?.dealerSlug || 'primo';
  const { vehicles, loading, source } = useDealerInventory(dealerSlug);

  // One-shot toast when we fall back to seed data so the site never silently breaks.
  const [seedToast, setSeedToast] = useState(false);
  const toastShownRef = useRef(false);
  useEffect(() => {
    if (source !== 'seed' || loading || toastShownRef.current) return;
    toastShownRef.current = true;
    // Defer setState out of the effect's sync body to satisfy the
    // react-hooks/set-state-in-effect rule.
    const showId = setTimeout(() => setSeedToast(true), 0);
    const hideId = setTimeout(() => setSeedToast(false), 4000);
    return () => { clearTimeout(showId); clearTimeout(hideId); };
  }, [source, loading]);

  const filtered = useMemo(() => {
    let list = vehicles && vehicles.length ? vehicles : [];
    if (bodyType === 'electric') {
      list = list.filter(v => (v.flags || []).includes('EV') || /electric|ev|dual motor/i.test(v.eng || ''));
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
  }, [vehicles, bodyType, sortBy]);

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
              {loading ? (
                <em style={{ color: C.inkLow, fontStyle: 'normal' }}>Loading inventory…</em>
              ) : (
                <>
                  Showing{' '}
                  <strong style={{ color: C.gold, fontSize: 14, fontFamily: FONT_DISPLAY, margin: '0 4px' }}>{filtered.length}</strong>
                  {filtered.length === 1 ? 'vehicle' : 'vehicles'}
                </>
              )}
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
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <FleetSkeletonCard key={i} idx={i} />)
          ) : filtered.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', padding: '60px 24px', textAlign: 'center',
              color: C.inkDim, border: `1px dashed ${C.rule2}`, background: C.panel,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, marginBottom: 10, color: C.gold }}>NO MATCHES</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14 }}>No vehicles in this category right now. Try another body type.</div>
            </div>
          ) : filtered.map((v, i) => (
            <div
              key={v.id}
              data-vehicle-url={vehicleUrlSlug(v, dealerSlug)}
              style={{ display: 'contents' }}
            >
              <FleetCard
                v={v}
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
            </div>
          ))}
        </div>
      </div>

      {/* Subtle toast when EspoCRM is unreachable and we're rendering seed data. */}
      {seedToast && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 50,
          background: C.panel, border: `1px solid ${C.rule2}`, color: C.ink,
          padding: '10px 14px', fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        }}>
          <span style={{ color: C.gold, marginRight: 6 }}>◇</span>
          Loading demo inventory
        </div>
      )}

      {/* shimmer keyframes for the skeleton */}
      <style>{`@keyframes inv-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>
  );
}

/* ─── Fleet Card (spec sheet style) ────────────────── */
