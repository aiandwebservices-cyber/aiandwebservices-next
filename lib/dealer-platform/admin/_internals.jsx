'use client';
/**
 * Admin internals — shared atoms, constants, utilities, and API helpers
 * used by every admin tab component.
 *
 * This file exists because the inline atoms in the original AdminPanel.jsx
 * monolith have a slightly different API from the canonical atoms in
 * `lib/dealer-platform/shared/`. Rather than rewrite every tab to consume
 * the canonical atoms, the extracted tabs import from here. A future session
 * can migrate tab-by-tab to the canonical atoms.
 */
import React, { useState, useEffect } from 'react';
import { ChevronDown, Car, Star, Tag, X, Check } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

export const GOLD = '#D4AF37';
export const GOLD_SOFT = '#F5E9C4';
export const RED_ACCENT = '#C33B3B';

export const MAKES = [
  'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford',
  'Genesis','GMC','Honda','Hyundai','Infiniti','Jaguar','Jeep','Kia','Land Rover',
  'Lexus','Lincoln','Maserati','Mazda','Mercedes-Benz','Nissan','Porsche','Ram',
  'Subaru','Tesla','Toyota','Volkswagen','Volvo'
];
export const COLORS = ['Black','White','Silver','Gray','Red','Blue','Green','Brown','Beige','Gold','Yellow','Orange','Burgundy'];
export const BODY_STYLES = ['Sedan','SUV','Truck','Coupe','Van','Convertible','Hatchback','Wagon'];
export const TRANSMISSIONS = ['Automatic','Manual','CVT'];
export const DRIVETRAINS = ['FWD','RWD','AWD','4WD'];
export const FUEL_TYPES = ['Gas','Diesel','Electric','Hybrid','PHEV'];
export const STATUSES = ['Available','Featured','On Sale','Just Arrived','Price Drop','Pending','Sold'];
export const LEAD_SOURCES = ['Get E-Price','Pre-Approval','Trade-In','Test Drive','Contact','Build Your Deal','Inventory Alert','Chat','Phone Call'];
export const LEAD_STATUSES = ['New','Contacted','Appointment Set','Showed','Sold','Lost'];
export const DEAL_STATUSES = ['New Deal','Working','Approved','Delivered','Lost'];
export const APPT_STATUSES = ['Pending','Confirmed','In Progress','Completed','No-Show','Cancelled'];
export const SERVICE_TYPES = [
  'Oil Change','Brake Inspection','Brake Service','Tire Rotation','State Inspection',
  'A/C Service','Battery Replacement','Multi-Point Inspection','Diagnostic',
  'Transmission Service','Detailing','Other'
];
export const SERVICE_RATES = {
  'Oil Change': 89, 'Brake Inspection': 49, 'Brake Service': 425, 'Tire Rotation': 39,
  'State Inspection': 35, 'A/C Service': 189, 'Battery Replacement': 215,
  'Multi-Point Inspection': 79, 'Diagnostic': 149, 'Transmission Service': 380,
  'Detailing': 249, 'Other': 150
};
export const FNI_PRODUCT_CATALOG = [
  { key: 'extWarranty', label: 'Extended Warranty', price: 1200 },
  { key: 'paintProtection', label: 'Paint Protection', price: 599 },
  { key: 'windowTint', label: 'Window Tint', price: 299 },
  { key: 'gapInsurance', label: 'GAP Insurance', price: 695 },
  { key: 'wheelLock', label: 'Wheel & Tire Protection', price: 449 },
  { key: 'maintPlan', label: 'Pre-Paid Maintenance', price: 875 }
];

export const TEAM_MEMBERS = [
  { name: 'Carlos Rivera',   role: 'Sales' },
  { name: 'Maria Santos',    role: 'Finance' },
  { name: 'James Mitchell',  role: 'Sales' },
  { name: 'Ana Gutierrez',   role: 'Service Advisor' }
];

export const POPULAR_MAKES = [
  'Toyota','Honda','Ford','Chevrolet','BMW','Mercedes-Benz','Audi','Lexus','Nissan','Hyundai',
  'Kia','Jeep','Subaru','Volkswagen','Porsche','Tesla','Ram','GMC','Cadillac','Land Rover'
];

export const ESPO_BASE = 'http://localhost:8081';
export const ESPO_API_KEY = '7190e14d23e6ca8d68a5d2b29c91e55e';
export const ESPO_VEHICLE_ENTITY = 'CVehicle';

const NHTSA_TTL_MS = 30 * 24 * 3600 * 1000;

/* ------------------------------------------------------------------ */
/*  DATE / TIME UTILITIES                                              */
/* ------------------------------------------------------------------ */

// Frozen "today" so demo seed data renders consistently. In production this
// would just be `new Date()`.
export const TODAY = new Date('2026-05-01T12:00:00Z');
export const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();
export const isoDays = (d) => new Date(TODAY.getTime() + d * 86400000).toISOString();
export const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0); // EDT offset for Miami-ish display
  return dt.toISOString();
};

/* ------------------------------------------------------------------ */
/*  STORAGE                                                            */
/* ------------------------------------------------------------------ */

let _storageErrorHandler = null;
export const setStorageErrorHandler = (fn) => { _storageErrorHandler = fn; };

export const storage = {
  async get(key, fallback) {
    try {
      if (typeof window === 'undefined' || !window.storage) return fallback;
      const raw = await window.storage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch { return fallback; }
  },
  async set(key, value) {
    try {
      if (typeof window === 'undefined' || !window.storage) return;
      await window.storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (_storageErrorHandler) _storageErrorHandler(err, key);
      else if (typeof console !== 'undefined') console.error('storage.set failed', key, err);
    }
  }
};

/* ------------------------------------------------------------------ */
/*  EXTERNAL APIs (NHTSA, FuelEconomy.gov, EspoCRM)                    */
/* ------------------------------------------------------------------ */

async function cachedFetch(cacheKey, fetcher) {
  const hit = await storage.get(cacheKey, null);
  if (hit && hit.ts && Date.now() - hit.ts < NHTSA_TTL_MS) return hit.data;
  const data = await fetcher();
  await storage.set(cacheKey, { ts: Date.now(), data });
  return data;
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const mapBodyClass = (s) => {
  const x = String(s || '').toLowerCase();
  if (!x) return null;
  if (x.includes('sedan')) return 'Sedan';
  if (x.includes('suv') || x.includes('sport utility') || x.includes('cuv') || x.includes('crossover')) return 'SUV';
  if (x.includes('pickup') || x.includes('truck')) return 'Truck';
  if (x.includes('coupe')) return 'Coupe';
  if (x.includes('convertible') || x.includes('roadster') || x.includes('cabriolet')) return 'Convertible';
  if (x.includes('hatchback')) return 'Hatchback';
  if (x.includes('wagon')) return 'Wagon';
  if (x.includes('van') || x.includes('minivan')) return 'Van';
  return null;
};
const mapTransmission = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('cvt') || x.includes('continuously')) return 'CVT';
  if (x.includes('manual')) return 'Manual';
  if (x.includes('auto')) return 'Automatic';
  return null;
};
const mapDrivetrain = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('4wd') || x.includes('4x4') || x.includes('four-wheel') || x.includes('4-wheel')) return '4WD';
  if (x.includes('awd') || x.includes('all-wheel') || x.includes('all wheel')) return 'AWD';
  if (x.includes('rwd') || x.includes('rear-wheel') || x.includes('rear wheel')) return 'RWD';
  if (x.includes('fwd') || x.includes('front-wheel') || x.includes('front wheel')) return 'FWD';
  return null;
};
const mapFuelType = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('plug-in') || x.includes('phev')) return 'PHEV';
  if (x.includes('hybrid')) return 'Hybrid';
  if (x.includes('electric') || x.includes('bev')) return 'Electric';
  if (x.includes('diesel')) return 'Diesel';
  if (x.includes('gasoline') || x.includes('gas') || x.includes('petrol') || x.includes('flex')) return 'Gas';
  return null;
};

export async function nhtsaDecodeVin(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
  const json = await fetchWithTimeout(url);
  const r = (json.Results && json.Results[0]) || {};
  if (!r.Make && !r.ModelYear) return null;
  const cylPrefix = r.EngineConfiguration ? String(r.EngineConfiguration).match(/^[A-Z]/i) : null;
  const engineParts = [
    r.DisplacementL ? `${parseFloat(r.DisplacementL).toFixed(1)}L` : '',
    mapFuelType(r.FuelTypePrimary) || (r.FuelTypePrimary || ''),
    r.EngineConfiguration && r.EngineCylinders
      ? `${cylPrefix ? cylPrefix[0] : ''}${r.EngineCylinders}`
      : (r.EngineCylinders ? `${r.EngineCylinders}cyl` : '')
  ].filter(Boolean).join(' ');
  return {
    raw: r,
    fields: {
      year: r.ModelYear || null,
      make: r.Make || null,
      model: r.Model || null,
      trim: r.Trim || null,
      bodyStyle: mapBodyClass(r.BodyClass),
      engine: engineParts || null,
      transmission: mapTransmission(r.TransmissionStyle),
      drivetrain: mapDrivetrain(r.DriveType),
      fuelType: mapFuelType(r.FuelTypePrimary),
    }
  };
}

export async function nhtsaGetAllMakes() {
  return cachedFetch('nhtsa-makes', async () => {
    const json = await fetchWithTimeout('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json', {}, 8000);
    const names = (json.Results || []).map(m => m.Make_Name).filter(Boolean);
    return Array.from(new Set(names.map(n => n.replace(/\b\w/g, c => c.toUpperCase())))).sort();
  });
}

export async function nhtsaGetModelsForMake(make) {
  const key = `nhtsa-models-${String(make).toLowerCase()}`;
  return cachedFetch(key, async () => {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
    const json = await fetchWithTimeout(url);
    const names = (json.Results || []).map(m => m.Model_Name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  });
}

export async function fuelEconomyLookup(year, make, model) {
  const opts = await fetchWithTimeout(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
    { headers: { Accept: 'application/json' } }
  );
  const items = Array.isArray(opts.menuItem) ? opts.menuItem : (opts.menuItem ? [opts.menuItem] : []);
  if (!items.length) return null;
  const id = items[0].value;
  if (!id) return null;
  const ympg = await fetchWithTimeout(
    `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${encodeURIComponent(id)}`,
    { headers: { Accept: 'application/json' } }
  );
  const city = parseFloat(ympg.city);
  const hwy = parseFloat(ympg.highway);
  if (!Number.isFinite(city) && !Number.isFinite(hwy)) return null;
  return {
    mpgCity: Number.isFinite(city) ? Math.round(city) : 0,
    mpgHwy: Number.isFinite(hwy) ? Math.round(hwy) : 0
  };
}

export async function nhtsaRecalls(year, make, model) {
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const json = await fetchWithTimeout(url);
  return (json.results || []).map(r => ({
    campaign: r.NHTSACampaignNumber || r.CampaignNumber || '—',
    summary: (r.Summary || r.Component || '').slice(0, 100)
  }));
}

export async function espoSaveVehicle(formVehicle) {
  const payload = {
    name: `${formVehicle.year || ''} ${formVehicle.make || ''} ${formVehicle.model || ''}`.trim(),
    cYear: Number(formVehicle.year) || null,
    cMake: formVehicle.make || null,
    cModel: formVehicle.model || null,
    cTrim: formVehicle.trim || null,
    cBodyStyle: formVehicle.bodyStyle || null,
    cExteriorColor: formVehicle.exteriorColor || null,
    cInteriorColor: formVehicle.interiorColor || null,
    cEngine: formVehicle.engine || null,
    cTransmission: formVehicle.transmission || null,
    cDrivetrain: formVehicle.drivetrain || null,
    cFuelType: formVehicle.fuelType || null,
    cMpgCity: Number(formVehicle.mpgCity) || null,
    cMpgHwy: Number(formVehicle.mpgHwy) || null,
    cVin: formVehicle.vin || null,
    cStockNumber: formVehicle.stockNumber || null,
    cMileage: Number(formVehicle.mileage) || null,
    cListPrice: Number(formVehicle.listPrice) || null,
    cSalePrice: formVehicle.salePrice ? Number(formVehicle.salePrice) : null,
    cCost: Number(formVehicle.cost) || null,
    cStatus: formVehicle.status || null,
    cDescription: formVehicle.description || null,
    cHasOpenRecalls: !!formVehicle.hasOpenRecalls
  };
  const espoId = formVehicle.espoId || null;
  const url = espoId
    ? `${ESPO_BASE}/api/v1/${ESPO_VEHICLE_ENTITY}/${encodeURIComponent(espoId)}`
    : `${ESPO_BASE}/api/v1/${ESPO_VEHICLE_ENTITY}`;
  const method = espoId ? 'PUT' : 'POST';
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': ESPO_API_KEY },
      body: JSON.stringify(payload),
      signal: ctl.signal
    });
    if (!res.ok) throw new Error(`Espo HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data.id || espoId, raw: data };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  } finally {
    clearTimeout(t);
  }
}

/* ------------------------------------------------------------------ */
/*  FORMATTING + MATH UTILITIES                                        */
/* ------------------------------------------------------------------ */

export const fmtMoney = (n, fractionDigits = 0) =>
  n == null || n === '' ? '—'
  : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });

export const fmtMiles = (n) =>
  n == null || n === '' ? '—' : Number(n).toLocaleString('en-US') + ' mi';

export const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const relTime = (iso) => {
  if (!iso) return '—';
  const ms = TODAY.getTime() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`;
  return fmtDate(iso);
};

export const calcPayment = (principal, apr, months) => {
  if (!principal || principal <= 0 || !months) return 0;
  const r = (Number(apr) || 0) / 12 / 100;
  if (r === 0) return principal / months;
  return (r * principal) / (1 - Math.pow(1 + r, -months));
};

export const dealFinanced = (deal) => {
  const fees = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
  return Math.max(0, (deal.salePrice || 0) + fees - (deal.trade?.value || 0) - (deal.downPayment || 0));
};

export const validVin = (v) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(String(v || '').trim());

export const downloadFile = (filename, content, mime = 'text/csv') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const csvEscape = (s) => {
  const v = s == null ? '' : String(s);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
};

export const buildCSV = (headers, rows) =>
  [headers.join(','), ...rows.map(r => headers.map(h => csvEscape(r[h])).join(','))].join('\n');

export const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const parseLine = (line) => {
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ',') { out.push(cur); cur = ''; }
        else if (c === '"') inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(l => {
    const cells = parseLine(l);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cells[i] ?? ''; });
    return obj;
  });
  return { headers, rows };
};

export const newId = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 9);

/* ------------------------------------------------------------------ */
/*  SETTINGS BUILDER                                                   */
/* ------------------------------------------------------------------ */

const SEED_SETTINGS_BASE = {
  dealership: {
    name: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '', website: '', logoUrl: '',
    hours: {
      Mon: { open: '09:00', close: '20:00', closed: false },
      Tue: { open: '09:00', close: '20:00', closed: false },
      Wed: { open: '09:00', close: '20:00', closed: false },
      Thu: { open: '09:00', close: '20:00', closed: false },
      Fri: { open: '09:00', close: '20:00', closed: false },
      Sat: { open: '10:00', close: '18:00', closed: false },
      Sun: { open: '11:00', close: '17:00', closed: false }
    }
  },
  notifications: {
    emailAlerts: true, alertEmail: '',
    smsAlerts: true, alertPhone: '',
    speedToLead: '15 min',
    autoFollowupEmail: true, autoFollowupSms: false
  },
  pricing: { autoDrop3At30: false, autoDrop5At45: true, autoSaleAt60: true },
  branding: {
    primaryColor: '#D4AF37', accentColor: '#E8272C', theme: 'Light',
    hablamosEspanol: true
  },
  social: { facebook: '', instagram: '', tiktok: '', youtube: '', google: '' },
  marketing: {
    autoReviewRequest: true, reviewReminderText: true,
    autoPostFacebook: false, autoPostInstagram: false
  },
  dealerName: 'Marco Esposito',  // signed-in user fallback (not the dealership name)
  adminTheme: 'light',
  savedViews: {
    inventory: [
      { id: 'sv-i-1', name: 'Aging 60+ days',     filter: { search: '', status: 'all', sort: 'daysOnLot-desc', minDays: 60 } },
      { id: 'sv-i-2', name: 'Featured vehicles',  filter: { search: '', status: 'Featured', sort: 'recent' } }
    ],
    leads: [
      { id: 'sv-l-1', name: 'New leads today',    filter: { search: '', status: 'New', source: 'all' } },
      { id: 'sv-l-2', name: 'Trade-ins',          filter: { search: '', status: 'all', source: 'Trade-In' } }
    ]
  }
};

export const buildSeedSettings = (config) => ({
  ...SEED_SETTINGS_BASE,
  dealership: {
    ...SEED_SETTINGS_BASE.dealership,
    name:    config.dealerName || SEED_SETTINGS_BASE.dealership.name,
    address: config.address?.street || '',
    city:    config.address?.city   || '',
    state:   config.address?.state  || '',
    zip:     config.address?.zip    || '',
    phone:   config.phone           || '',
    email:   config.email           || '',
  },
  notifications: {
    ...SEED_SETTINGS_BASE.notifications,
    alertEmail: config.email || SEED_SETTINGS_BASE.notifications.alertEmail,
    alertPhone: config.phone || SEED_SETTINGS_BASE.notifications.alertPhone,
  },
  branding: {
    ...SEED_SETTINGS_BASE.branding,
    primaryColor: config.colors?.primary || SEED_SETTINGS_BASE.branding.primaryColor,
    accentColor:  config.colors?.accent  || SEED_SETTINGS_BASE.branding.accentColor,
  },
  dealerName: config.dealerName || SEED_SETTINGS_BASE.dealerName,
});

/* ------------------------------------------------------------------ */
/*  SHARED UI ATOMS                                                    */
/* ------------------------------------------------------------------ */

export const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
    .font-display { font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif; font-feature-settings: "ss01", "ss02"; }
    .font-ui { font-family: 'Manrope', system-ui, -apple-system, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace; }
    .tabular { font-variant-numeric: tabular-nums; }
    .smallcaps { font-variant: all-small-caps; letter-spacing: 0.08em; }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #d6d2c8; border-radius: 3px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .ring-gold:focus { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px ${GOLD}; }
    @keyframes slide-in { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    .anim-slide { animation: slide-in 240ms cubic-bezier(.2,.8,.2,1) both; }
    @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(195,59,59,0.7) } 50% { box-shadow: 0 0 0 6px rgba(195,59,59,0) } }
    .pulse-dot { animation: pulse-dot 2s infinite; }
    @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
    .anim-fade { animation: fade-in 120ms ease both; }
    @keyframes saved-pulse { 0% { background-color: rgba(16, 185, 129, 0); } 30% { background-color: rgba(16, 185, 129, 0.18); } 100% { background-color: rgba(16, 185, 129, 0); } }
    .saved-pulse { animation: saved-pulse 1.4s ease both; }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; }
      main, .print-area { padding: 0 !important; margin: 0 !important; }
      * { box-shadow: none !important; }
    }
    table thead { background-color: var(--table-header); }
    table tbody tr:hover { background-color: var(--table-hover); }
    .themed-row:hover { background-color: var(--table-hover); }
    input, select, textarea { color-scheme: light dark; }
  `}</style>
);

export const StatusBadge = ({ status, size = 'sm' }) => {
  const map = {
    'Available':     { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'Featured':      { bg: GOLD_SOFT, fg: '#7A5A0F', dot: GOLD, icon: Star },
    'On Sale':       { bg: '#FCE5E5', fg: '#9B1C1C', dot: '#C53030', icon: Tag },
    'Just Arrived':  { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
    'Price Drop':    { bg: '#FFEDD5', fg: '#9A3412', dot: '#EA580C' },
    'Pending':       { bg: '#FEF3C7', fg: '#92400E', dot: '#D97706' },
    'Sold':          { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' },
    'Reserved':      { bg: 'transparent', fg: '#7A5A0F', dot: GOLD, border: GOLD },
    'New':           { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT, pulse: true },
    'Contacted':     { bg: '#FEF9C3', fg: '#854D0E', dot: '#CA8A04' },
    'Appointment Set':{bg: '#E0E7FF', fg: '#3730A3', dot: '#4F46E5' },
    'Showed':        { bg: '#F3E8FF', fg: '#6B21A8', dot: '#9333EA' },
    'Lost':          { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X, strike: true },
    'New Deal':      { bg: '#DBEAFE', fg: '#1E40AF', dot: '#2563EB' },
    'Working':       { bg: '#BFDBFE', fg: '#1D4ED8', dot: '#3B82F6' },
    'Approved':      { bg: '#D1FAE5', fg: '#065F46', dot: '#059669' },
    'Delivered':     { bg: '#CCFBF1', fg: '#115E59', dot: '#0D9488' },
    'Confirmed':     { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
    'In Progress':   { bg: '#CFFAFE', fg: '#155E75', dot: '#0891B2' },
    'Completed':     { bg: '#D1FAE5', fg: '#065F46', dot: '#059669', icon: Check },
    'No-Show':       { bg: '#FECDD3', fg: '#9F1239', dot: '#BE123C', icon: X },
    'Cancelled':     { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X },
    'Expired':       { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X },
    'Released':      { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E' }
  };
  const s = map[status] || { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'} rounded-full font-semibold smallcaps ${s.strike ? 'line-through' : ''}`}
      style={{ backgroundColor: s.bg, color: s.fg, border: s.border ? `1px solid ${s.border}` : undefined }}>
      {Icon ? <Icon className="w-3 h-3" strokeWidth={2.5} style={{ color: s.dot }} fill={Icon === Star ? s.dot : 'none'} />
        : <span className={`w-1.5 h-1.5 rounded-full ${s.pulse ? 'pulse-dot' : ''}`} style={{ backgroundColor: s.dot }} />}
      {status}
    </span>
  );
};

export const LEAD_SOURCE_BORDERS = {
  'Get E-Price':     '#D4AF37',
  'Build Your Deal': '#D4AF37',
  'Pre-Approval':    '#2563EB',
  'Inventory Alert': '#2563EB',
  'Test Drive':      '#10B981',
  'Reserve':         '#10B981',
  'Chat':            '#9333EA',
  'Phone Call':      '#9333EA',
  'Trade-In':        '#EA580C',
  'Service':         '#EA580C',
  'Contact':         '#78716C'
};
export const LeadSourceBadge = ({ source }) => {
  const border = LEAD_SOURCE_BORDERS[source] || '#78716C';
  return (
    <span className="inline-block pl-2 pr-2.5 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-r-md"
      style={{ borderLeft: `3px solid ${border}` }}>
      {source}
    </span>
  );
};

export const Toggle = ({ checked, onChange, label, description, disabled }) => (
  <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <button type="button" disabled={disabled} onClick={() => !disabled && onChange(!checked)}
      className="relative shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? GOLD : '#D6D2C8' }}>
      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
        style={{ left: checked ? '18px' : '2px' }} />
    </button>
    {(label || description) && (
      <div className="flex-1 min-w-0">
        {label && <div className="text-sm font-medium text-stone-900">{label}</div>}
        {description && <div className="text-xs text-stone-500 mt-0.5">{description}</div>}
      </div>
    )}
  </label>
);

export const Field = ({ label, hint, required, children, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-[11px] font-semibold smallcaps" style={{ color: 'var(--text-secondary)' }}>
        {label}{required && <span className="text-red-700 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <div className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>{hint}</div>}
  </div>
);

export const Input = React.forwardRef(({ className = '', style, ...props }, ref) => (
  <input ref={ref} {...props}
    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
    className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold transition ${className}`} />
));
Input.displayName = 'Input';

export const Select = ({ children, className = '', style, ...props }) => (
  <div className="relative">
    <select {...props}
      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
      className={`w-full pl-3 pr-9 py-2 border rounded-md text-sm appearance-none ring-gold ${className}`}>
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
  </div>
);

export const Textarea = ({ className = '', style, ...props }) => (
  <textarea {...props}
    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
    className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold resize-y ${className}`} />
);

export const Btn = ({ variant = 'default', size = 'md', icon: Icon, children, className = '', ...props }) => {
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2'
  };
  const variants = {
    default: 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50',
    gold: 'text-stone-900 border border-transparent hover:brightness-95',
    dark: 'bg-stone-900 text-white border border-stone-900 hover:bg-stone-800',
    ghost: 'bg-transparent border border-transparent text-stone-700 hover:bg-stone-100',
    outlineGold: 'bg-white border text-stone-900 hover:bg-amber-50',
    danger: 'bg-white border border-red-300 text-red-700 hover:bg-red-50',
    soft: 'bg-stone-100 border border-transparent text-stone-800 hover:bg-stone-200'
  };
  const goldStyle = variant === 'gold' ? { backgroundColor: GOLD } : (variant === 'outlineGold' ? { borderColor: GOLD, color: '#7A5A0F' } : undefined);
  return (
    <button {...props}
      style={goldStyle}
      className={`inline-flex items-center justify-center font-semibold rounded-md transition ring-gold ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} strokeWidth={2.25} />}
      {children}
    </button>
  );
};

export const IconBtn = ({ icon: Icon, title, onClick, tone = 'default' }) => {
  const tones = {
    default: 'text-stone-500 hover:text-stone-900 hover:bg-stone-100',
    gold: 'hover:bg-amber-50',
    danger: 'text-stone-500 hover:text-red-700 hover:bg-red-50',
    blue: 'text-stone-500 hover:text-blue-700 hover:bg-blue-50'
  };
  const goldStyle = tone === 'gold' ? { color: '#7A5A0F' } : undefined;
  return (
    <button onClick={onClick} title={title} aria-label={title} style={goldStyle}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition ${tones[tone] || tones.default}`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg ${className}`}
    style={{ backgroundColor: 'var(--bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
    {children}
  </div>
);

export const SectionHeader = ({ eyebrow, title, action, className = '' }) => (
  <div className={`flex items-end justify-between mb-4 ${className}`}>
    <div>
      {eyebrow && <div className="text-[10px] font-semibold smallcaps mb-1" style={{ color: 'var(--text-muted)' }}>{eyebrow}</div>}
      <h2 className="font-display text-2xl font-medium tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    </div>
    {action}
  </div>
);

export const VehiclePhoto = ({ vehicle, size = 'md' }) => {
  const sizes = { xs: 'w-12 h-9', sm: 'w-16 h-12', md: 'w-24 h-16', lg: 'w-full aspect-[4/3]' };
  const initials = (vehicle?.make || '?').slice(0, 2).toUpperCase();
  const color = vehicle?.exteriorColor?.toLowerCase() || 'gray';
  const palette = {
    black: 'linear-gradient(135deg,#2c2a26 0%,#1a1815 100%)',
    white: 'linear-gradient(135deg,#fafaf7 0%,#e8e5dd 100%)',
    silver: 'linear-gradient(135deg,#e0ddd5 0%,#b8b3a8 100%)',
    gray: 'linear-gradient(135deg,#9a958a 0%,#6b655b 100%)',
    red: 'linear-gradient(135deg,#a12b2b 0%,#6b1a1a 100%)',
    blue: 'linear-gradient(135deg,#2a4a7a 0%,#1a2e4a 100%)',
    green: 'linear-gradient(135deg,#3a6b4a 0%,#234430 100%)',
    brown: 'linear-gradient(135deg,#7a5a3a 0%,#4a3a25 100%)',
    beige: 'linear-gradient(135deg,#d8cdb8 0%,#b3a48a 100%)',
    gold: `linear-gradient(135deg,${GOLD} 0%,#9a7d28 100%)`
  };
  const bg = palette[color] || palette.gray;
  const isLight = ['white','silver','beige','gold'].includes(color);
  if (vehicle?.photos?.[0]) {
    return (
      <div className={`${sizes[size]} rounded-md overflow-hidden bg-stone-100 shrink-0`}>
        <img src={vehicle.photos[0]} alt="" className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
    );
  }
  return (
    <div className={`${sizes[size]} rounded-md overflow-hidden shrink-0 relative flex items-center justify-center`}
      style={{ background: bg }}>
      <Car className={`${size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.6)' }} strokeWidth={1.5} />
      <span className={`absolute right-1 bottom-0.5 font-display font-medium ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.7)' }}>{initials}</span>
    </div>
  );
};

export const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div className="rounded-lg p-4 relative"
    style={{ backgroundColor: 'var(--bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border)' }}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {Icon && <Icon className="w-4 h-4" style={{ color: accent || 'var(--text-muted)' }} strokeWidth={1.75} />}
    </div>
    <div className="font-display text-2xl font-medium tracking-tight tabular leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
    {sub && <div className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
);

export const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', confirmColor = 'red', onConfirm, onCancel, inputs = [] }) => {
  const [values, setValues] = useState({});
  useEffect(() => {
    if (isOpen) {
      const init = {};
      inputs.forEach(i => { init[i.name] = i.defaultValue ?? ''; });
      setValues(init);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  if (!isOpen) return null;
  const colorMap = {
    red:  'bg-red-600 hover:bg-red-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    gold: 'text-stone-900 hover:brightness-95',
    dark: 'bg-stone-900 hover:bg-stone-800 text-white'
  };
  const goldStyle = confirmColor === 'gold' ? { backgroundColor: GOLD } : undefined;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 anim-fade no-print" onClick={onCancel}>
      <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {message && <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{message}</p>}
          {inputs.map((i, idx) => (
            <div key={i.name} className="mb-3">
              <label className="block text-[11px] font-semibold mb-1 smallcaps" style={{ color: 'var(--text-secondary)' }}>{i.label}</label>
              <input
                type={i.type || 'text'}
                value={values[i.name] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [i.name]: e.target.value }))}
                placeholder={i.placeholder || ''}
                autoFocus={idx === 0}
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
              {i.hint && <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{i.hint}</div>}
            </div>
          ))}
        </div>
        <div className="px-5 py-3 flex justify-end gap-2"
          style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md transition hover:bg-stone-200/40"
            style={{ color: 'var(--text-secondary)' }}>{cancelLabel}</button>
          <button onClick={() => onConfirm(values)} style={goldStyle}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${colorMap[confirmColor] || colorMap.red}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export const Skeleton = ({ rows = 4, className = '' }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-stone-200/70 rounded-md" />
    ))}
  </div>
);

export const Paginator = ({ total, page, pageSize, onPage, onPageSize, label = 'item' }) => {
  const isAll = pageSize === Infinity || pageSize === 'all';
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const start = isAll ? (total === 0 ? 0 : 1) : (total === 0 ? 0 : Math.min(total, (page - 1) * pageSize + 1));
  const end = isAll ? total : Math.min(total, page * pageSize);
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 text-xs flex-wrap"
      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
      <div className="flex items-center gap-1 tabular">
        Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{start}–{end}</span>
        of <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{total}</span> {label}{total === 1 ? '' : 's'}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          Per page:
          <select value={isAll ? 'all' : pageSize}
            onChange={(e) => { const v = e.target.value; onPageSize(v === 'all' ? Infinity : Number(v)); onPage(1); }}
            className="px-1.5 py-1 rounded text-xs"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
            <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="all">All</option>
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1 || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition">Prev</button>
          <span className="tabular px-2 text-stone-700">{isAll ? 1 : page}/{totalPages}</span>
          <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition">Next</button>
        </div>
      </div>
    </div>
  );
};

export const HELP_FAQ = [
  { q: 'How to add a vehicle', a: 'Click "Add Vehicle" in the sidebar (or the + button). Enter a VIN to auto-decode 9 fields, or fill the form manually. Photos and pricing can be edited any time after.' },
  { q: 'How to respond to leads', a: 'Open the Leads tab, expand a lead row to see their timeline, then use Quick Actions to call, text, or email. The lead status auto-advances when you change it.' },
  { q: 'How to run a sale', a: 'Select vehicles in Inventory (table or grid view), click "Sale" in the bulk action bar, and apply a percentage or dollar discount. Apply to one vehicle via the kebab menu (⋯).' },
  { q: 'How to export to Facebook', a: 'In Inventory, select vehicles and choose "Export FB" from the bulk bar — this generates a Facebook Marketplace catalog CSV that uploads directly to Commerce Manager.' },
  { q: 'How to request Google reviews', a: 'On the Sold tab, click the gold star icon next to a customer to send a review request. Email or SMS templates are pre-set in Settings → Marketing.' }
];
