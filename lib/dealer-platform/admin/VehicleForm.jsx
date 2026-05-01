'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard, Car, Plus, Users, FileText, Archive, Megaphone,
  Settings as SettingsIcon, Bell, Search, Edit3, Trash2, Eye, EyeOff,
  ChevronDown, ChevronRight, ChevronUp, Filter, Download, Upload,
  ExternalLink, Calculator, Calendar, MapPin, Globe, Facebook, Instagram,
  Youtube, Check, X, AlertTriangle, AlertCircle, TrendingUp, Hash, Award,
  ShieldCheck, Zap, Save, Star, Tag, Clock, Phone, Mail, MessageSquare,
  DollarSign, BarChart3, Image as ImageIcon, GripVertical, Send, Printer,
  Sparkles, ArrowUpRight, ArrowDownRight, RefreshCw, Share2, Menu,
  MoreHorizontal, FileSpreadsheet, ThumbsUp, Languages, Receipt, Layers,
  PlusCircle, MinusCircle, ChevronLeft, Power, CircleDot, Square, CheckSquare,
  Wrench, Activity, Gauge, Timer, Shield, Flag, Reply,
  TrendingDown, BadgeCheck, Smartphone, Monitor, Sun, Moon, HelpCircle, Bookmark, Camera,
} from 'lucide-react';
import {
  GOLD, GOLD_SOFT, RED_ACCENT,
  MAKES, COLORS, BODY_STYLES, TRANSMISSIONS, DRIVETRAINS, FUEL_TYPES,
  STATUSES, LEAD_SOURCES, LEAD_STATUSES, DEAL_STATUSES, APPT_STATUSES,
  SERVICE_TYPES, SERVICE_RATES, FNI_PRODUCT_CATALOG, TEAM_MEMBERS, POPULAR_MAKES,
  TODAY, isoDaysAgo, isoDays, isoAt,
  storage, fetchWithTimeout, nhtsaDecodeVin, nhtsaGetAllMakes, nhtsaGetModelsForMake,
  fuelEconomyLookup, nhtsaRecalls, espoSaveVehicle,
  fmtMoney, fmtMiles, fmtDate, relTime, calcPayment, dealFinanced, validVin,
  downloadFile, csvEscape, buildCSV, parseCSV, newId,
  Btn, Card, Field, Input, Select, Textarea, IconBtn, StatusBadge, LeadSourceBadge,
  Toggle, VehiclePhoto, StatCard, ConfirmDialog, Skeleton, Paginator, SectionHeader,
} from './_internals';
import { useAdminConfig } from './AdminConfigContext';
import { SEED_FNI_HISTORY } from '@/lib/dealer-platform/data/seed-deals';
import { SEED_APPT_HISTORY } from '@/lib/dealer-platform/data/seed-appointments';
import { ActivityLog } from './ActivityLog';
import { BreadcrumbBar } from './BreadcrumbBar';

function SearchableSelect({ value, onChange, items, popular = [], loading, placeholder, error, disabled, allLabel = 'All' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const filteredAll = q ? items.filter(i => i.toLowerCase().includes(q)) : items;
  const popularFiltered = q ? popular.filter(i => i.toLowerCase().includes(q)) : popular;
  const showPopular = !q && popular.length > 0;

  return (
    <div ref={ref} className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`w-full pl-3 pr-9 py-2 bg-white border rounded-md text-sm text-left ring-gold transition ${error ? 'border-red-400' : 'border-stone-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className={value ? 'text-stone-900' : 'text-stone-400'}>{value || placeholder || 'Select…'}</span>
        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-stone-200 rounded-md shadow-lg max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-stone-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading…
              </div>
            ) : (
              <>
                {showPopular && popularFiltered.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-[10px] smallcaps font-semibold text-stone-500 bg-stone-50">Popular</div>
                    {popularFiltered.map(item => (
                      <button key={`p-${item}`} type="button"
                        onClick={() => { onChange(item); setOpen(false); setQuery(''); }}
                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-amber-50 ${value === item ? 'font-semibold' : ''}`}>
                        {item}
                      </button>
                    ))}
                    <div className="border-t border-stone-200 my-1" />
                    <div className="px-3 py-1 text-[10px] smallcaps font-semibold text-stone-500 bg-stone-50">{allLabel}</div>
                  </>
                )}
                {filteredAll.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400">No matches</div>
                ) : filteredAll.map(item => (
                  <button key={item} type="button"
                    onClick={() => { onChange(item); setOpen(false); setQuery(''); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-amber-50 ${value === item ? 'font-semibold' : ''}`}>
                    {item}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const RECON_STAGES = [
  { key: 'acquired',    label: 'Acquired' },
  { key: 'in_recon',    label: 'In Recon' },
  { key: 'photo_ready', label: 'Photo Ready' },
  { key: 'lot_ready',   label: 'Lot Ready' },
  { key: 'listed',      label: 'Listed' },
];

const ACQUISITION_SOURCES = ['Auction', 'Trade-In', 'Private Purchase', 'Consignment', 'Dealer Transfer', 'Repo'];

const COMMON_AUCTIONS = ['Manheim', 'ADESA', 'Copart', 'IAA', 'OVE', 'SmartAuction', 'ACV Auctions'];

const INSPECTION_ITEMS = [
  { key: 'engine',       label: 'Engine' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'brakes',       label: 'Brakes' },
  { key: 'tires',        label: 'Tires' },
  { key: 'ac',           label: 'A/C & Heat' },
  { key: 'electrical',   label: 'Electrical' },
  { key: 'body',         label: 'Body' },
  { key: 'interior',     label: 'Interior' },
  { key: 'frame',        label: 'Frame' },
  { key: 'roadTest',     label: 'Road Test' },
];

const BLANK_VEHICLE = {
  year: new Date(TODAY).getFullYear(), make: 'Toyota', model: '', trim: '', bodyStyle: 'Sedan',
  cost: '', listPrice: '', salePrice: '', mileage: '',
  exteriorColor: 'Black', interiorColor: 'Black',
  engine: '', transmission: 'Automatic', drivetrain: 'FWD', fuelType: 'Gas',
  mpgCity: '', mpgHwy: '', vin: '', stockNumber: '',
  status: 'Available',
  history: { noAccidents: false, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false, noOpenRecalls: true },
  description: '', photos: [],
  daysOnLot: 0, views: 0, dateAdded: new Date(TODAY).toISOString(),
  hasOpenRecalls: false, espoId: null,
  // Acquisition
  acquisitionSource: '', auctionName: '', acquisitionDate: '', acquiredFrom: '',
  // Reconditioning
  reconStage: 'listed', reconStartDate: '', reconCompletedDate: '',
  reconCost: 0, reconItems: [], reconNotes: '',
  // Inspection
  inspection: null, inspectionDate: '', inspectionPassed: false,
};

export function VehicleFormTab({ vehicle, onSave, onCancel, flash }) {
  const config = useAdminConfig();
  const isEdit = !!vehicle;
  const [form, setForm] = useState(() => vehicle ? { ...BLANK_VEHICLE, ...vehicle } : { ...BLANK_VEHICLE });
  const [photoInput, setPhotoInput] = useState((vehicle?.photos || []).join(', '));
  const [errors, setErrors] = useState({});
  const [autoFilled, setAutoFilled] = useState(new Set());
  const [vinInput, setVinInput] = useState(vehicle?.vin || '');
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinSummary, setVinSummary] = useState(null);
  const [allMakes, setAllMakes] = useState([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [makesError, setMakesError] = useState(false);
  const [modelsForMake, setModelsForMake] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState(false);
  const [mpgLoading, setMpgLoading] = useState(false);
  const [mpgUnavailable, setMpgUnavailable] = useState(false);
  const [recalls, setRecalls] = useState([]);
  const [recallsLoading, setRecallsLoading] = useState(false);
  const [recallsChecked, setRecallsChecked] = useState(false);
  const [savingEspo, setSavingEspo] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setForm({ ...BLANK_VEHICLE, ...vehicle });
      setPhotoInput((vehicle.photos || []).join(', '));
      setVinInput(vehicle.vin || '');
    } else {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
      setVinInput('');
    }
    setAutoFilled(new Set());
    setVinSummary(null);
    setRecalls([]);
    setRecallsChecked(false);
    setMpgUnavailable(false);
    setAiGenerated(false);
  }, [vehicle?.id]);

  // Load all makes once on mount
  useEffect(() => {
    let cancel = false;
    (async () => {
      setMakesLoading(true);
      try {
        const list = await nhtsaGetAllMakes();
        if (!cancel) { setAllMakes(list); setMakesError(false); }
      } catch {
        if (!cancel) setMakesError(true);
      } finally {
        if (!cancel) setMakesLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (!form.make) { setModelsForMake([]); return; }
    let cancel = false;
    (async () => {
      setModelsLoading(true);
      try {
        const list = await nhtsaGetModelsForMake(form.make);
        if (!cancel) { setModelsForMake(list); setModelsError(false); }
      } catch {
        if (!cancel) { setModelsForMake([]); setModelsError(true); }
      } finally {
        if (!cancel) setModelsLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [form.make]);

  // Auto-fetch MPG + recalls when Year + Make + Model are all set
  useEffect(() => {
    if (!form.year || !form.make || !form.model) return;
    let cancel = false;
    (async () => {
      setMpgLoading(true);
      setMpgUnavailable(false);
      try {
        const data = await fuelEconomyLookup(form.year, form.make, form.model);
        if (cancel) return;
        if (data) {
          setForm(f => ({ ...f, mpgCity: data.mpgCity, mpgHwy: data.mpgHwy }));
          setAutoFilled(s => new Set([...s, 'mpgCity', 'mpgHwy']));
        } else {
          setMpgUnavailable(true);
        }
      } catch {
        if (!cancel) setMpgUnavailable(true);
      } finally {
        if (!cancel) setMpgLoading(false);
      }
      setRecallsLoading(true);
      try {
        const list = await nhtsaRecalls(form.year, form.make, form.model);
        if (cancel) return;
        setRecalls(list);
        setRecallsChecked(true);
        setForm(f => ({
          ...f,
          hasOpenRecalls: list.length > 0,
          history: { ...(f.history || {}), noOpenRecalls: list.length === 0 }
        }));
      } catch {
        if (!cancel) { setRecalls([]); setRecallsChecked(true); }
      } finally {
        if (!cancel) setRecallsLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [form.year, form.make, form.model]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (autoFilled.has(k)) setAutoFilled(s => { const n = new Set(s); n.delete(k); return n; });
  };
  const setHist = (k, v) => setForm(f => ({ ...f, history: { ...f.history, [k]: v } }));

  // Auto-set recon dates when stage advances
  const setReconStage = (stageKey) => {
    setForm((f) => {
      const next = { ...f, reconStage: stageKey };
      if (stageKey === 'in_recon' && !f.reconStartDate) next.reconStartDate = new Date().toISOString().slice(0, 10);
      if (stageKey === 'photo_ready' && !f.reconCompletedDate) next.reconCompletedDate = new Date().toISOString().slice(0, 10);
      return next;
    });
  };

  // Recon line items
  const reconTotal = useMemo(() => {
    const items = Array.isArray(form.reconItems) ? form.reconItems : [];
    const sum = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    return sum;
  }, [form.reconItems]);

  useEffect(() => {
    setForm((f) => f.reconCost === reconTotal ? f : { ...f, reconCost: reconTotal });
  }, [reconTotal]);

  const addReconItem = (preset) => {
    setForm((f) => ({
      ...f,
      reconItems: [...(f.reconItems || []), preset || { description: '', amount: '' }],
    }));
  };
  const updateReconItem = (idx, patch) => {
    setForm((f) => {
      const items = [...(f.reconItems || [])];
      items[idx] = { ...items[idx], ...patch };
      return { ...f, reconItems: items };
    });
  };
  const removeReconItem = (idx) => {
    setForm((f) => ({ ...f, reconItems: (f.reconItems || []).filter((_, i) => i !== idx) }));
  };

  // Inspection
  const inspectionResult = form.inspection || {};
  const inspectionStats = useMemo(() => {
    let passed = 0, failed = 0, untouched = 0;
    INSPECTION_ITEMS.forEach((it) => {
      const v = inspectionResult[it.key];
      if (v === 'pass') passed += 1;
      else if (v === 'fail') failed += 1;
      else untouched += 1;
    });
    return { passed, failed, untouched, total: INSPECTION_ITEMS.length };
  }, [form.inspection]); // eslint-disable-line react-hooks/exhaustive-deps

  const setInspectionItem = (key, value) => {
    setForm((f) => {
      const next = { ...(f.inspection || {}), [key]: value };
      const allTouched = INSPECTION_ITEMS.every((it) => next[it.key]);
      const allPass = allTouched && INSPECTION_ITEMS.every((it) => next[it.key] === 'pass');
      return {
        ...f,
        inspection: next,
        inspectionPassed: allPass,
        inspectionDate: f.inspectionDate || new Date().toISOString().slice(0, 10),
        history: { ...(f.history || {}), inspection: allPass },
      };
    });
  };

  const runFullInspection = () => {
    const next = {};
    INSPECTION_ITEMS.forEach((it) => { next[it.key] = 'pass'; });
    setForm((f) => ({
      ...f,
      inspection: next,
      inspectionPassed: true,
      inspectionDate: new Date().toISOString().slice(0, 10),
      history: { ...(f.history || {}), inspection: true },
    }));
    flash && flash('Full inspection marked as passed', 'success');
  };

  const filledClass = (k) => autoFilled.has(k) ? 'border-blue-400 bg-blue-50/40' : '';

  const decodeVin = async () => {
    const v = String(vinInput || '').trim().toUpperCase();
    if (!validVin(v)) {
      setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
      flash && flash('VIN must be 17 chars (no I, O, Q)', 'error');
      return;
    }
    setErrors(e => { const { vin: _, ...rest } = e; return rest; });
    setVinDecoding(true);
    setVinSummary(null);
    try {
      const result = await nhtsaDecodeVin(v);
      if (!result || !result.fields.make) {
        flash && flash('VIN not found — enter details manually', 'error');
        setVinDecoding(false);
        return;
      }
      const f = result.fields;
      const filled = [];
      const next = { ...form, vin: v };
      const apply = (key, val, label) => {
        if (val !== null && val !== undefined && val !== '') { next[key] = val; filled.push(label); }
      };
      apply('year', f.year ? Number(f.year) : null, 'Year');
      apply('make', f.make, 'Make');
      apply('model', f.model, 'Model');
      apply('trim', f.trim, 'Trim');
      if (f.bodyStyle && BODY_STYLES.includes(f.bodyStyle)) { next.bodyStyle = f.bodyStyle; filled.push('Body Style'); }
      apply('engine', f.engine, 'Engine');
      if (f.transmission && TRANSMISSIONS.includes(f.transmission)) { next.transmission = f.transmission; filled.push('Transmission'); }
      if (f.drivetrain && DRIVETRAINS.includes(f.drivetrain)) { next.drivetrain = f.drivetrain; filled.push('Drivetrain'); }
      if (f.fuelType && FUEL_TYPES.includes(f.fuelType)) { next.fuelType = f.fuelType; filled.push('Fuel Type'); }
      filled.push('VIN');
      setForm(next);
      const filledKeys = new Set();
      if (next.year !== form.year) filledKeys.add('year');
      if (next.make !== form.make) filledKeys.add('make');
      if (next.model !== form.model) filledKeys.add('model');
      if (next.trim !== form.trim) filledKeys.add('trim');
      if (next.bodyStyle !== form.bodyStyle) filledKeys.add('bodyStyle');
      if (next.engine !== form.engine) filledKeys.add('engine');
      if (next.transmission !== form.transmission) filledKeys.add('transmission');
      if (next.drivetrain !== form.drivetrain) filledKeys.add('drivetrain');
      if (next.fuelType !== form.fuelType) filledKeys.add('fuelType');
      filledKeys.add('vin');
      setAutoFilled(filledKeys);
      setVinSummary({ count: filled.length, fields: filled });
      flash && flash(`VIN decoded — ${filled.length} fields auto-filled`, 'success');
    } catch (err) {
      flash && flash('VIN decoder unavailable — enter details manually', 'error');
    } finally {
      setVinDecoding(false);
    }
  };

  const generateAiDescription = async (regenerate = false) => {
    setAiGenerating(true);
    setAiGenerated(false);
    try {
      const dealerSlug = config.dealerSlug || 'primo';
      const res = await fetch(`/api/dealer/${dealerSlug}/ai/describe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: {
            year: form.year, make: form.make, model: form.model, trim: form.trim,
            mileage: form.mileage, exteriorColor: form.exteriorColor,
            interiorColor: form.interiorColor, engine: form.engine,
            transmission: form.transmission, drivetrain: form.drivetrain,
            fuelType: form.fuelType, bodyStyle: form.bodyStyle,
            listPrice: form.listPrice,
            noAccidents: form.history?.noAccidents, oneOwner: form.history?.oneOwner,
            cleanTitle: form.history?.cleanTitle, serviceRecords: form.history?.serviceRecords,
            inspectionPassed: form.history?.inspection,
          },
          regenerate,
        }),
      });
      const data = await res.json();
      if (data.ok && data.description) {
        set('description', data.description);
        setAiGenerated(true);
        flash && flash('AI description generated', 'success');
      } else {
        flash && flash('AI unavailable — write manually', 'error');
      }
    } catch {
      flash && flash('AI unavailable — write manually', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const margin = useMemo(() => {
    const sale = parseFloat(form.salePrice) || parseFloat(form.listPrice) || 0;
    const cost = parseFloat(form.cost) || 0;
    if (!sale || !cost) return null;
    return { gross: sale - cost, pct: ((sale - cost) / sale * 100) };
  }, [form.cost, form.listPrice, form.salePrice]);

  const validate = () => {
    const e = {};
    if (!form.year) e.year = 'Required';
    if (!form.make) e.make = 'Required';
    if (!form.model) e.model = 'Required';
    if (!form.listPrice) e.listPrice = 'Required';
    if (!form.mileage && form.mileage !== 0) e.mileage = 'Required';
    if (form.vin && !validVin(form.vin)) e.vin = 'VIN must be 17 alphanumeric chars (no I, O, Q)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (addAnother = false) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const photos = photoInput.split(',').map(s => s.trim()).filter(Boolean);
    const cleaned = {
      ...form,
      year: Number(form.year), cost: Number(form.cost) || 0,
      listPrice: Number(form.listPrice), salePrice: form.salePrice ? Number(form.salePrice) : null,
      mileage: Number(form.mileage), mpgCity: Number(form.mpgCity) || 0, mpgHwy: Number(form.mpgHwy) || 0,
      photos
    };
    setSavingEspo(true);
    const espo = await espoSaveVehicle(cleaned);
    setSavingEspo(false);
    if (espo.ok) {
      cleaned.espoId = espo.id || cleaned.espoId || null;
      flash && flash(`Saved to EspoCRM (${ESPO_VEHICLE_ENTITY})`, 'success');
    } else {
      flash && flash(`EspoCRM save failed: ${espo.error}. Saved locally only.`, 'error');
    }
    onSave(cleaned, addAnother);
    if (addAnother) {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
      setVinInput('');
      setAutoFilled(new Set());
      setVinSummary(null);
      setRecalls([]);
      setRecallsChecked(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const photoUrls = photoInput.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs mb-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
        <button onClick={onCancel} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Inventory</button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? `Edit: ${form.year} ${form.make} ${form.model}` : 'Add New Vehicle'}
        </span>
      </nav>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {isEdit ? `Edit ${form.year} ${form.make} ${form.model}` : 'Add New Vehicle'}
          </h1>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Please fix the highlighted errors below before saving.
        </div>
      )}

      <div className="space-y-6">
        {/* VIN DECODER (HERO) */}
        <Card className="p-5 border-2" style={{ borderColor: `${GOLD}80`, background: `linear-gradient(135deg, ${GOLD}10 0%, transparent 60%)` }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: '#7A5A0F' }} />
            <h3 className="font-display text-lg font-semibold">VIN Decoder</h3>
            <span className="text-[10px] smallcaps font-semibold ml-auto px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>Free · NHTSA</span>
          </div>
          <p className="text-sm text-stone-600 mb-4">Enter a VIN to auto-fill 9 vehicle details in one click.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Input value={vinInput} maxLength={17}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                onBlur={() => {
                  const v = vinInput.trim();
                  if (v && !validVin(v)) setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
                  else setErrors(e => { const { vin: _, ...rest } = e; return rest; });
                }}
                placeholder="Enter 17-character VIN to auto-fill vehicle details"
                className={`font-mono text-sm tracking-wider ${errors.vin ? 'border-red-400' : ''}`} />
            </div>
            <Btn variant="gold" icon={vinDecoding ? RefreshCw : Sparkles} disabled={vinDecoding || !vinInput}
              onClick={decodeVin} className={vinDecoding ? '[&>svg]:animate-spin' : ''}>
              {vinDecoding ? 'Decoding…' : 'Decode VIN'}
            </Btn>
          </div>
          {errors.vin && <div className="text-[11px] text-red-600 mt-1.5">{errors.vin}</div>}
          {vinSummary && (
            <div className="mt-3 p-3 rounded-md bg-white border border-stone-200 text-[12px] text-stone-700">
              <div className="flex items-center gap-1.5 mb-1 font-semibold" style={{ color: '#256B40' }}>
                <Check className="w-3.5 h-3.5" />
                {vinSummary.count} fields auto-filled
              </div>
              <div className="text-stone-500">{vinSummary.fields.join(' · ')}</div>
            </div>
          )}
          <div className="mt-3 text-[10px] smallcaps text-stone-400">Powered by NHTSA Open Data</div>
        </Card>

        {/* RECALLS BANNER */}
        {recallsLoading && (
          <div className="p-3 rounded-md border border-stone-200 bg-white text-sm text-stone-600 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking NHTSA recalls…
          </div>
        )}
        {!recallsLoading && recallsChecked && recalls.length > 0 && (
          <div className="p-4 rounded-md border-l-4 bg-amber-50 border border-amber-200" style={{ borderLeftColor: '#D97706' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-amber-900">⚠️ {recalls.length} open recall{recalls.length === 1 ? '' : 's'} found for this vehicle</div>
                <ul className="mt-2 space-y-1.5 text-[12px] text-amber-900/90">
                  {recalls.slice(0, 5).map((r, i) => (
                    <li key={i}><span className="font-mono font-semibold">{r.campaign}</span>{r.summary ? <> — {r.summary}</> : null}</li>
                  ))}
                  {recalls.length > 5 && <li className="italic text-amber-700">+{recalls.length - 5} more…</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
        {!recallsLoading && recallsChecked && recalls.length === 0 && (
          <div className="p-3 rounded-md border border-emerald-200 bg-emerald-50 text-sm flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" /> ✓ No open recalls found
          </div>
        )}

        {/* VEHICLE INFO */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-semibold">Vehicle Info</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Year" required>
              <Select value={form.year} onChange={(e) => set('year', Number(e.target.value))}
                className={`${errors.year ? 'border-red-400' : ''} ${filledClass('year')}`}>
                {(() => {
                  const cy = new Date().getFullYear();
                  const years = [];
                  for (let y = cy + 1; y >= 1950; y--) years.push(y);
                  return years.map(y => <option key={y} value={y}>{y}</option>);
                })()}
              </Select>
            </Field>
            <Field label="Make" required hint={makesError ? 'NHTSA list unavailable — using free text' : undefined}>
              {makesError ? (
                <Input value={form.make} onChange={(e) => set('make', e.target.value)}
                  className={`${errors.make ? 'border-red-400' : ''} ${filledClass('make')}`} />
              ) : (
                <div className={filledClass('make') ? 'rounded-md ring-1 ring-blue-300' : ''}>
                  <SearchableSelect value={form.make}
                    onChange={(v) => { set('make', v); set('model', ''); }}
                    items={allMakes} popular={POPULAR_MAKES}
                    loading={makesLoading} error={!!errors.make}
                    placeholder="Select make" allLabel="All Makes" />
                </div>
              )}
            </Field>
            <Field label="Model" required hint={modelsError ? 'NHTSA models unavailable — using free text' : (modelsLoading ? 'Loading models…' : undefined)}>
              {modelsError || modelsForMake.length === 0 ? (
                <Input value={form.model} onChange={(e) => set('model', e.target.value)}
                  className={`${errors.model ? 'border-red-400' : ''} ${filledClass('model')}`}
                  placeholder="e.g. X5" />
              ) : (
                <div className={filledClass('model') ? 'rounded-md ring-1 ring-blue-300' : ''}>
                  <SearchableSelect value={form.model} onChange={(v) => set('model', v)}
                    items={modelsForMake} loading={modelsLoading}
                    error={!!errors.model} placeholder="Select model" allLabel="Models" />
                </div>
              )}
            </Field>
            <Field label="Trim">
              <Input value={form.trim} onChange={(e) => set('trim', e.target.value)}
                className={filledClass('trim')} placeholder="e.g. xDrive40i" />
            </Field>
            <Field label="Body Style">
              <Select value={form.bodyStyle} onChange={(e) => set('bodyStyle', e.target.value)}
                className={filledClass('bodyStyle')}>
                {BODY_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {['Available','Featured','On Sale','Just Arrived','Price Drop','Pending'].map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        {/* PRICING */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-semibold">Pricing</h3>
            </div>
            {margin && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-50 border border-stone-200">
                <span className="text-[10px] smallcaps text-stone-500">Margin</span>
                <span className="font-display tabular text-sm font-semibold" style={{ color: margin.gross > 0 ? '#2F7A4A' : '#A12B2B' }}>
                  {fmtMoney(margin.gross)}
                </span>
                <span className="text-xs text-stone-500 tabular">({margin.pct.toFixed(1)}%)</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Field label="Purchase Price (cost)" hint="Hidden from customer site — for margin tracking only">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.cost} onChange={(e) => set('cost', e.target.value)} className="pl-7" />
              </div>
            </Field>
            <Field label="List Price" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.listPrice} onChange={(e) => set('listPrice', e.target.value)} className={`pl-7 ${errors.listPrice ? 'border-red-400' : ''}`} />
              </div>
            </Field>
            <Field label="Sale Price (optional)" hint="Shows strikethrough on customer site">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.salePrice || ''} onChange={(e) => set('salePrice', e.target.value)} className="pl-7" />
              </div>
            </Field>
          </div>
        </Card>

        {/* ACQUISITION */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-semibold">Acquisition Details</h3>
            <span className="text-[10px] smallcaps text-stone-500 ml-1">— track where your best inventory comes from</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Acquisition Source">
              <Select value={form.acquisitionSource || ''} onChange={(e) => set('acquisitionSource', e.target.value)}>
                <option value="">— Select —</option>
                {ACQUISITION_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            {form.acquisitionSource === 'Auction' && (
              <Field label="Auction Name" hint="e.g., Manheim, ADESA, Copart">
                <Input list="auction-names" value={form.auctionName || ''}
                  onChange={(e) => set('auctionName', e.target.value)} placeholder="Manheim" />
                <datalist id="auction-names">
                  {COMMON_AUCTIONS.map((a) => <option key={a} value={a} />)}
                </datalist>
              </Field>
            )}
            <Field label="Acquisition Date">
              <Input type="date" value={form.acquisitionDate || ''} onChange={(e) => set('acquisitionDate', e.target.value)} />
            </Field>
            <Field label="Acquisition Cost" hint="Maps to cost basis above">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.cost} onChange={(e) => set('cost', e.target.value)} className="pl-7" />
              </div>
            </Field>
            <Field label="Acquired From" hint="Seller / consignor name">
              <Input value={form.acquiredFrom || ''} onChange={(e) => set('acquiredFrom', e.target.value)}
                placeholder="e.g., John's Auto, Trade-in #4521" />
            </Field>
          </div>
        </Card>

        {/* RECONDITIONING */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-semibold">Reconditioning</h3>
            </div>
            {(() => {
              const sale = parseFloat(form.salePrice) || parseFloat(form.listPrice) || 0;
              const cost = parseFloat(form.cost) || 0;
              const recon = parseFloat(form.reconCost) || 0;
              if (!sale || !cost) return null;
              const trueGross = sale - cost - recon;
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-50 border border-stone-200">
                  <span className="text-[10px] smallcaps text-stone-500">True Gross</span>
                  <span className="font-display tabular text-sm font-semibold" style={{ color: trueGross > 0 ? '#2F7A4A' : '#A12B2B' }}>
                    {fmtMoney(trueGross)}
                  </span>
                  <span className="text-xs text-stone-500 tabular">(after {fmtMoney(recon)} recon)</span>
                </div>
              );
            })()}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Recon Stage">
              <Select value={form.reconStage || 'listed'} onChange={(e) => setReconStage(e.target.value)}>
                {RECON_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </Select>
            </Field>
            <Field label="Recon Start Date" hint="Auto-set when stage → In Recon">
              <Input type="date" value={form.reconStartDate ? String(form.reconStartDate).slice(0, 10) : ''}
                onChange={(e) => set('reconStartDate', e.target.value)} />
            </Field>
            <Field label="Recon Completed Date" hint="Auto-set when stage → Photo Ready">
              <Input type="date" value={form.reconCompletedDate ? String(form.reconCompletedDate).slice(0, 10) : ''}
                onChange={(e) => set('reconCompletedDate', e.target.value)} />
            </Field>
          </div>

          <div className="rounded-md border border-stone-200 overflow-hidden mb-4">
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <span className="text-[10px] smallcaps font-bold text-stone-700">Recon Cost — Line Items</span>
              <span className="text-[11px] tabular text-stone-600">
                Total: <span className="font-bold text-stone-900">{fmtMoney(reconTotal)}</span>
              </span>
            </div>
            <div className="divide-y divide-stone-100">
              {(form.reconItems || []).length === 0 ? (
                <div className="px-4 py-3 text-[12px] text-stone-400 italic">No line items yet — add details below or use a preset.</div>
              ) : (form.reconItems || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2">
                  <Input value={item.description || ''} placeholder="Description (e.g., Detail & Clean)"
                    onChange={(e) => updateReconItem(idx, { description: e.target.value })}
                    className="flex-1 text-xs" />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
                    <Input type="number" value={item.amount} placeholder="0"
                      onChange={(e) => updateReconItem(idx, { amount: e.target.value })}
                      className="pl-6 text-xs tabular" />
                  </div>
                  <button type="button" onClick={() => removeReconItem(idx)}
                    className="p-1.5 rounded text-stone-400 hover:text-red-700 hover:bg-red-50" title="Remove">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 bg-stone-50/50 border-t border-stone-100 flex items-center gap-2 flex-wrap">
              <Btn size="sm" variant="default" icon={Plus} onClick={() => addReconItem()}>Add Recon Item</Btn>
              <span className="text-[10px] smallcaps text-stone-500">Presets:</span>
              {[
                { description: 'Detail & Clean', amount: 350 },
                { description: 'Oil Change', amount: 89 },
                { description: 'New Tires (4)', amount: 480 },
                { description: 'Touch Up Paint', amount: 150 },
              ].map((p) => (
                <button key={p.description} type="button" onClick={() => addReconItem(p)}
                  className="text-[10px] px-2 py-1 rounded border border-stone-200 hover:bg-amber-50 hover:border-amber-300">
                  + {p.description} ({fmtMoney(p.amount)})
                </button>
              ))}
            </div>
          </div>

          <Field label="Recon Notes">
            <Textarea rows={2} value={form.reconNotes || ''} onChange={(e) => set('reconNotes', e.target.value)}
              placeholder="e.g., Replaced timing belt, refinished wheels, swapped headlight bulb" />
          </Field>
        </Card>

        {/* INSPECTION */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-semibold">Inspection</h3>
              <span className="text-[10px] smallcaps text-stone-500 ml-1">— 10 key items</span>
            </div>
            <div className="flex items-center gap-2">
              {form.inspectionDate && (
                <span className="text-[11px] text-stone-500">
                  {form.inspectionPassed ? '✅' : '⚠️'} {inspectionStats.passed}/{inspectionStats.total} passed — inspected {fmtDate(form.inspectionDate)}
                </span>
              )}
              {!form.inspectionDate && (
                <span className="text-[11px] text-stone-500 italic">No inspection on file</span>
              )}
              <Btn size="sm" variant="outlineGold" icon={ShieldCheck} onClick={runFullInspection}>
                Run 150-Point Inspection
              </Btn>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {INSPECTION_ITEMS.map((item) => {
              const v = inspectionResult[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-stone-200">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setInspectionItem(item.key, 'pass')}
                      className={`px-2 py-1 rounded text-[10px] smallcaps font-bold ${v === 'pass' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                      Pass
                    </button>
                    <button type="button" onClick={() => setInspectionItem(item.key, 'fail')}
                      className={`px-2 py-1 rounded text-[10px] smallcaps font-bold ${v === 'fail' ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-700'}`}>
                      Fail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {inspectionStats.passed + inspectionStats.failed > 0 && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> {inspectionStats.passed} passed
              <X className="w-3.5 h-3.5 text-red-600 ml-2" /> {inspectionStats.failed} failed
              {inspectionStats.untouched > 0 && <span className="text-stone-400 ml-2">· {inspectionStats.untouched} untouched</span>}
            </div>
          )}
        </Card>

        {/* SPECS */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-semibold">Specifications</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Mileage" required>
              <Input type="number" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className={errors.mileage ? 'border-red-400' : ''} />
            </Field>
            <Field label="Exterior Color">
              <Select value={form.exteriorColor} onChange={(e) => set('exteriorColor', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Interior Color">
              <Select value={form.interiorColor} onChange={(e) => set('interiorColor', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Engine">
              <Input value={form.engine} onChange={(e) => set('engine', e.target.value)}
                className={filledClass('engine')} placeholder="3.0L Turbo Inline-6" />
            </Field>
            <Field label="Transmission">
              <Select value={form.transmission} onChange={(e) => set('transmission', e.target.value)}
                className={filledClass('transmission')}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Drivetrain">
              <Select value={form.drivetrain} onChange={(e) => set('drivetrain', e.target.value)}
                className={filledClass('drivetrain')}>
                {DRIVETRAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Fuel Type">
              <Select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)}
                className={filledClass('fuelType')}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="MPG City" hint={mpgLoading ? 'Fetching…' : (mpgUnavailable ? 'MPG data not available for this vehicle' : undefined)}>
                <Input type="number" value={form.mpgCity} onChange={(e) => set('mpgCity', e.target.value)}
                  className={filledClass('mpgCity')} />
              </Field>
              <Field label="MPG Hwy" hint={mpgLoading ? 'Fetching…' : undefined}>
                <Input type="number" value={form.mpgHwy} onChange={(e) => set('mpgHwy', e.target.value)}
                  className={filledClass('mpgHwy')} />
              </Field>
            </div>
            <Field label="VIN" hint={errors.vin || '17 characters · no I, O, Q'}>
              <Input value={form.vin}
                onChange={(e) => { const v = e.target.value.toUpperCase(); set('vin', v); setVinInput(v); }}
                onBlur={() => {
                  const v = String(form.vin || '').trim();
                  if (v && !validVin(v)) setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
                  else setErrors(e => { const { vin: _, ...rest } = e; return rest; });
                }}
                maxLength={17}
                className={`font-mono text-xs ${errors.vin ? 'border-red-400' : ''} ${filledClass('vin')}`} />
            </Field>
            <Field label="Stock Number">
              <Input value={form.stockNumber} onChange={(e) => set('stockNumber', e.target.value)} className="font-mono text-xs" />
            </Field>
          </div>
        </Card>

        {/* HISTORY */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-semibold">Vehicle History</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ['noAccidents','No Accidents'], ['oneOwner','1 Owner'], ['cleanTitle','Clean Title'],
              ['serviceRecords','Service Records Available'], ['inspection','150-Point Inspection Passed'],
              ['carfax','CARFAX Available'], ['warranty','Manufacturer Warranty Remaining'],
              ['noOpenRecalls','No Open Recalls']
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-stone-200 hover:border-stone-300 cursor-pointer">
                <input type="checkbox" checked={!!form.history?.[k]} onChange={(e) => setHist(k, e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-600" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* DESCRIPTION */}
        <Card className="p-5" id="description-section">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-semibold">Description</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] tabular ${(form.description?.length || 0) > 500 ? 'text-red-600' : 'text-stone-500'}`}>
                {form.description?.length || 0} / 500
              </span>
              <Btn variant="gold" size="sm" icon={aiGenerating ? RefreshCw : Sparkles}
                disabled={aiGenerating} onClick={() => generateAiDescription(false)}
                className={aiGenerating ? '[&>svg]:animate-spin' : ''}>
                {aiGenerating ? 'AI is writing…' : '✨ Generate'}
              </Btn>
            </div>
          </div>
          <Textarea value={form.description}
            onChange={(e) => { set('description', e.target.value); setAiGenerated(false); }}
            rows={4} placeholder="Highlight key features, condition, and what makes this vehicle a great buy…" maxLength={500} />
          <div className="mt-2 flex items-center gap-3 min-h-[20px]">
            {aiGenerated && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <Sparkles className="w-3 h-3" /> AI-generated
              </span>
            )}
            {form.description?.trim() && (
              <button type="button" onClick={() => generateAiDescription(true)}
                className="text-[11px] text-stone-500 hover:text-stone-900 underline">
                ✨ Regenerate with AI
              </button>
            )}
          </div>
        </Card>

        {/* PHOTOS */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-semibold">Photos</h3>
            </div>
            <span className="text-[10px] smallcaps text-stone-500">{photoUrls.length} of 20 photos · First = hero</span>
          </div>

          {/* Drag-drop zone */}
          <button type="button"
            onClick={() => {
              const url = window.prompt('Paste image URL (in production: drag photos to upload to Cloudflare R2)');
              if (url && url.trim()) {
                setPhotoInput(prev => prev ? prev + ', ' + url.trim() : url.trim());
              }
            }}
            className="w-full rounded-lg p-8 text-center transition hover:bg-stone-50/60"
            style={{ border: '2px dashed var(--border-strong)', backgroundColor: 'var(--bg-elevated)' }}>
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
            <div className="text-sm font-semibold mb-1">Drag photos here or click to browse</div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG, HEIC — up to 20 photos per vehicle</div>
            <div className="text-[10px] smallcaps font-semibold mt-3 inline-flex items-center gap-1" style={{ color: GOLD }}>
              <Sparkles className="w-3 h-3" /> Cloud photo storage included — unlimited photos
            </div>
          </button>

          {/* Thumbnail grid */}
          {photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={url} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-stone-400">Invalid URL</div>'; }} />
                  </div>
                  {i === 0 ? (
                    <span className="absolute top-1 left-1 text-[9px] font-bold smallcaps px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                      style={{ backgroundColor: GOLD, color: '#1A1612' }}><Star className="w-2.5 h-2.5" fill="currentColor" /> HERO</span>
                  ) : (
                    <button type="button" title="Set as hero" onClick={() => {
                      const arr = [...photoUrls]; const [moved] = arr.splice(i, 1); arr.unshift(moved);
                      setPhotoInput(arr.join(', '));
                    }} className="absolute top-1 left-1 w-6 h-6 bg-white/85 rounded text-stone-600 hover:text-amber-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button type="button" title="Remove" onClick={() => {
                    const arr = photoUrls.filter((_, j) => j !== i);
                    setPhotoInput(arr.join(', '));
                  }} className="absolute top-1 right-1 w-6 h-6 bg-white/85 rounded text-stone-600 hover:text-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-white/90 rounded text-[10px] font-bold flex items-center justify-center text-stone-700">{i + 1}</span>
                  {i > 0 && (
                    <button type="button" title="Move left" onClick={() => {
                      const arr = [...photoUrls]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      setPhotoInput(arr.join(', '));
                    }} className="absolute bottom-1 left-1 w-5 h-5 bg-white/90 rounded text-[10px] font-bold flex items-center justify-center text-stone-600 opacity-0 group-hover:opacity-100 transition">
                      ◀
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* URL fallback toggle */}
          <details className="mt-4">
            <summary className="text-[11px] smallcaps font-semibold cursor-pointer hover:text-stone-900" style={{ color: 'var(--text-muted)' }}>
              Or paste image URLs manually
            </summary>
            <Textarea value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} rows={2} className="mt-2 text-xs"
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg" />
          </details>
        </Card>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-stone-50/95 backdrop-blur py-4 -mx-6 px-6 lg:-mx-8 lg:px-8 border-t border-stone-200">
          {savingEspo && (
            <span className="text-[11px] text-stone-500 flex items-center gap-1.5 mr-2">
              <RefreshCw className="w-3 h-3 animate-spin" /> Syncing to EspoCRM…
            </span>
          )}
          <Btn variant="ghost" onClick={onCancel} disabled={savingEspo}>Cancel</Btn>
          {!isEdit && <Btn variant="default" icon={Plus} disabled={savingEspo} onClick={() => handleSave(true)}>Save & Add Another</Btn>}
          <Btn variant="gold" icon={savingEspo ? RefreshCw : Save} disabled={savingEspo}
            onClick={() => handleSave(false)}
            className={savingEspo ? '[&>svg]:animate-spin' : ''}>
            {savingEspo ? 'Saving…' : (isEdit ? 'Save Changes' : 'Save Vehicle')}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ====================== LEADS TAB ================================ */

