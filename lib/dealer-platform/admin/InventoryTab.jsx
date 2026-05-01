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

const RECON_STAGES = [
  { key: 'acquired',    label: 'Acquired',    color: '#374151', bg: '#F3F4F6', accent: '#9CA3AF' },
  { key: 'in_recon',    label: 'In Recon',    color: '#92400E', bg: '#FEF3C7', accent: '#D97706' },
  { key: 'photo_ready', label: 'Photo Ready', color: '#1D4ED8', bg: '#DBEAFE', accent: '#3B82F6' },
  { key: 'lot_ready',   label: 'Lot Ready',   color: '#065F46', bg: '#D1FAE5', accent: '#10B981' },
  { key: 'listed',      label: 'Listed',      color: '#7A5A0F', bg: GOLD_SOFT, accent: GOLD },
];

const ACQUISITION_SOURCES = ['Auction', 'Trade-In', 'Private Purchase', 'Consignment', 'Dealer Transfer', 'Repo'];

function inferReconStage(v) {
  if (v.reconStage && RECON_STAGES.some((s) => s.key === v.reconStage)) return v.reconStage;
  if (v.status === 'Pending') return 'acquired';
  return 'listed';
}

function daysSince(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}

export function InventoryTab({ inventory, setInventory, updateVehicle, removeVehicle, markSold, onEdit, onAdd, flash, reservations = [], onReleaseReservation, settings, setSettings }) {
  const reservedMap = useMemo(() => {
    const m = new Map();
    reservations.forEach(r => m.set(r.vehicleId, r));
    return m;
  }, [reservations]);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('dateAdded');
  const [sortDir, setSortDir] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMake, setFilterMake] = useState('all');
  const [filterBody, setFilterBody] = useState('all');
  const [filterAcquisition, setFilterAcquisition] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null);
  const [bulkValue, setBulkValue] = useState('');
  const [bulkBuyer, setBulkBuyer] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [openKebab, setOpenKebab] = useState(null);  // vehicle id with open kebab
  const [sellRequest, setSellRequest] = useState(null); // vehicle awaiting Mark Sold confirm
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const savedViews = settings?.savedViews?.inventory || [];

  const applyView = (v) => {
    setSearch(v.filter.search || '');
    setSortKey(v.filter.sort?.split('-')[0] || 'dateAdded');
    setSortDir(v.filter.sort?.split('-')[1] || 'desc');
    setFilterStatus(v.filter.status || 'all');
    setSavedOpen(false);
    flash(`Loaded view: ${v.name}`);
  };
  const saveCurrentView = (name) => {
    if (!name || !name.trim()) return;
    const view = {
      id: 'sv-i-' + Date.now(),
      name: name.trim(),
      filter: { search, status: filterStatus, sort: sortKey + '-' + sortDir }
    };
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), inventory: [...(s.savedViews?.inventory || []), view] } }));
    flash(`Saved view: ${view.name}`);
  };
  const deleteView = (id) => {
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), inventory: (s.savedViews?.inventory || []).filter(v => v.id !== id) } }));
  };

  const filtered = useMemo(() => {
    let arr = inventory.filter(v => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [v.make, v.model, v.trim, v.vin, v.stockNumber, String(v.year)].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (filterMake !== 'all' && v.make !== filterMake) return false;
      if (filterBody !== 'all' && v.bodyStyle !== filterBody) return false;
      if (filterAcquisition !== 'all' && (v.acquisitionSource || '') !== filterAcquisition) return false;
      const price = v.salePrice || v.listPrice;
      if (priceRange === '<25k' && price >= 25000) return false;
      if (priceRange === '25-40k' && (price < 25000 || price >= 40000)) return false;
      if (priceRange === '40-55k' && (price < 40000 || price >= 55000)) return false;
      if (priceRange === '55k+' && price < 55000) return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      const ka = sortKey === 'price' ? (a.salePrice || a.listPrice) :
                 sortKey === 'dateAdded' ? new Date(a.dateAdded).getTime() :
                 sortKey === 'mileage' ? a.mileage :
                 sortKey === 'daysOnLot' ? a.daysOnLot :
                 sortKey === 'views' ? (a.views || 0) :
                 sortKey === 'status' ? STATUSES.indexOf(a.status) :
                 0;
      const kb = sortKey === 'price' ? (b.salePrice || b.listPrice) :
                 sortKey === 'dateAdded' ? new Date(b.dateAdded).getTime() :
                 sortKey === 'mileage' ? b.mileage :
                 sortKey === 'daysOnLot' ? b.daysOnLot :
                 sortKey === 'views' ? (b.views || 0) :
                 sortKey === 'status' ? STATUSES.indexOf(b.status) :
                 0;
      return (ka - kb) * dir;
    });
    return arr;
  }, [inventory, search, sortKey, sortDir, filterStatus, filterMake, filterBody, filterAcquisition, priceRange]);

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [search, sortKey, sortDir, filterStatus, filterMake, filterBody, filterAcquisition, priceRange]);

  const pipelineColumns = useMemo(() => {
    const groups = Object.fromEntries(RECON_STAGES.map((s) => [s.key, []]));
    filtered.forEach((v) => {
      const stage = inferReconStage(v);
      if (groups[stage]) groups[stage].push(v);
    });
    return groups;
  }, [filtered]);

  const advanceStage = (vehicle, direction = 1) => {
    const cur = inferReconStage(vehicle);
    const idx = RECON_STAGES.findIndex((s) => s.key === cur);
    const next = RECON_STAGES[Math.max(0, Math.min(RECON_STAGES.length - 1, idx + direction))];
    if (!next || next.key === cur) return;
    const patch = { reconStage: next.key };
    if (next.key === 'in_recon' && !vehicle.reconStartDate) patch.reconStartDate = new Date().toISOString();
    if (next.key === 'photo_ready' && !vehicle.reconCompletedDate) patch.reconCompletedDate = new Date().toISOString();
    updateVehicle(vehicle.id, patch);
    flash(`${vehicle.year} ${vehicle.make} ${vehicle.model} → ${next.label}`);
  };

  const allSelected = filtered.length > 0 && filtered.every(v => selected.has(v.id));
  const toggleAll = () => {
    if (allSelected) {
      const ns = new Set(selected); filtered.forEach(v => ns.delete(v.id)); setSelected(ns);
    } else {
      const ns = new Set(selected); filtered.forEach(v => ns.add(v.id)); setSelected(ns);
    }
  };
  const toggleOne = (id) => {
    const ns = new Set(selected);
    if (ns.has(id)) ns.delete(id); else ns.add(id);
    setSelected(ns);
  };

  const applyBulk = () => {
    const ids = Array.from(selected);
    if (bulkAction === 'sale') {
      const v = parseFloat(bulkValue) || 0;
      const isPct = bulkValue.toString().includes('%') || (bulkValue && parseFloat(bulkValue) <= 100 && !bulkValue.includes('$'));
      setInventory(arr => arr.map(item => {
        if (!ids.includes(item.id)) return item;
        const sale = isPct
          ? Math.round(item.listPrice * (1 - v / 100) / 5) * 5
          : Math.max(0, item.listPrice - v);
        return { ...item, salePrice: sale, status: 'On Sale' };
      }));
      flash(`${ids.length} vehicles marked on sale`);
    } else if (bulkAction === 'removeSale') {
      setInventory(arr => arr.map(item => ids.includes(item.id) ? { ...item, salePrice: null, status: item.status === 'On Sale' || item.status === 'Price Drop' ? 'Available' : item.status } : item));
      flash(`Sale removed from ${ids.length} vehicles`);
    } else if (bulkAction === 'sold') {
      const list = inventory.filter(v => ids.includes(v.id));
      list.forEach(v => markSold(v.id, bulkBuyer || 'Walk-in Buyer'));
    } else if (bulkAction === 'feature') {
      setInventory(arr => arr.map(item => ids.includes(item.id) ? { ...item, status: 'Featured' } : item));
      flash(`${ids.length} vehicles featured`);
    } else if (bulkAction === 'delete') {
      const removed = inventory.filter(item => ids.includes(item.id));
      setInventory(arr => arr.filter(item => !ids.includes(item.id)));
      flash(`${ids.length} vehicle${ids.length === 1 ? '' : 's'} deleted`, {
        tone: 'destructive',
        undo: () => setInventory(arr => [...removed, ...arr])
      });
    } else if (bulkAction === 'csv') {
      const headers = ['year','make','model','trim','listPrice','salePrice','mileage','vin','stockNumber','status','daysOnLot'];
      const rows = inventory.filter(v => ids.includes(v.id));
      downloadFile(`${slug}-inventory.csv`, buildCSV(headers, rows));
      flash(`Exported ${ids.length} vehicles to CSV`);
    } else if (bulkAction === 'fb') {
      const headers = ['title','price','description','condition','availability','category','image_url','vehicle_year','vehicle_make','vehicle_model','vehicle_trim','vehicle_mileage','vehicle_vin','address'];
      const rows = inventory.filter(v => ids.includes(v.id)).map(v => ({
        title: `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim(),
        price: v.salePrice || v.listPrice,
        description: v.description,
        condition: 'used', availability: 'in stock', category: 'vehicles',
        image_url: v.photos?.[0] || '',
        vehicle_year: v.year, vehicle_make: v.make, vehicle_model: v.model,
        vehicle_trim: v.trim, vehicle_mileage: v.mileage, vehicle_vin: v.vin,
        address: 'Miami, FL'
      }));
      downloadFile(`${slug}-facebook-marketplace.csv`, buildCSV(headers, rows));
      flash(`Exported ${ids.length} vehicles to Facebook format`);
    }
    setSelected(new Set());
    setBulkAction(null);
    setBulkValue('');
    setBulkBuyer('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900">Inventory</h1>
          <p className="text-sm text-stone-500 mt-1">
            {filtered.length} of {inventory.length} vehicles · {fmtMoney(filtered.reduce((s, v) => s + (v.salePrice || v.listPrice), 0))} total value
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-stone-100 rounded-md p-0.5">
            <button onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${view === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              Table
            </button>
            <button onClick={() => setView('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${view === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              Grid
            </button>
            <button onClick={() => setView('pipeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${view === 'pipeline' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              Pipeline
            </button>
          </div>
          <Btn variant="gold" icon={Plus} onClick={onAdd}>Add Vehicle</Btn>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, VIN, stock #…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="relative">
            <button onClick={() => setSavedOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md hover:bg-stone-100 transition"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' }}>
              <Bookmark className="w-3.5 h-3.5" /> Views
              <ChevronDown className="w-3 h-3" />
            </button>
            {savedOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSavedOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg z-40 py-1 anim-fade"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {savedViews.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-center" style={{ color: 'var(--text-muted)' }}>No saved views yet</div>
                  ) : savedViews.map(v => (
                    <div key={v.id} className="flex items-center group">
                      <button onClick={() => applyView(v)}
                        className="flex-1 px-3 py-2 text-left text-xs hover:bg-stone-50 truncate">{v.name}</button>
                      <button onClick={() => deleteView(v.id)} title="Delete view"
                        className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                  <button onClick={() => { setSavedOpen(false); setShowSaveView(true); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50"
                    style={{ color: 'var(--text-primary)' }}>
                    <Plus className="w-3 h-3" /> Save current view…
                  </button>
                </div>
              </>
            )}
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs w-32">
            <option value="all">All status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterMake} onChange={(e) => setFilterMake(e.target.value)} className="text-xs w-32">
            <option value="all">All makes</option>
            {Array.from(new Set(inventory.map(v => v.make))).sort().map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select value={filterBody} onChange={(e) => setFilterBody(e.target.value)} className="text-xs w-32">
            <option value="all">All body styles</option>
            {BODY_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Select value={filterAcquisition} onChange={(e) => setFilterAcquisition(e.target.value)} className="text-xs w-36" title="Acquisition source">
            <option value="all">All acquisitions</option>
            {ACQUISITION_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="text-xs w-32">
            <option value="all">Any price</option>
            <option value="<25k">Under $25k</option>
            <option value="25-40k">$25k–$40k</option>
            <option value="40-55k">$40k–$55k</option>
            <option value="55k+">$55k+</option>
          </Select>
          <div className="w-px h-6 bg-stone-200 mx-1" />
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="text-xs w-36">
            <option value="dateAdded">Sort: Date Added</option>
            <option value="price">Sort: Price</option>
            <option value="mileage">Sort: Mileage</option>
            <option value="daysOnLot">Sort: Days on Lot</option>
            <option value="status">Sort: Status</option>
            <option value="views">Sort: Views</option>
          </Select>
          <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-2 border border-stone-300 rounded-md hover:bg-stone-50">
            {sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </Card>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <>
          {/* Desktop bulk bar */}
          <div className="mb-4 anim-slide bg-stone-900 text-white rounded-lg p-3 hidden md:flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-sm px-2">
              {selected.size} selected
            </span>
            <span className="text-stone-500">·</span>
            <button onClick={() => setBulkAction('sale')}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5"
              style={{ color: GOLD }}>
              <Tag className="w-3 h-3" /> Mark On Sale
            </button>
            <button onClick={() => { setBulkAction('removeSale'); setTimeout(applyBulk, 0); }}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800">
              Remove Sale
            </button>
            <button onClick={() => setBulkAction('sold')}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
              <Award className="w-3 h-3" /> Mark as Sold
            </button>
            <button onClick={() => { setBulkAction('feature'); setTimeout(applyBulk, 0); }}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
              <Star className="w-3 h-3" /> Feature
            </button>
            <button onClick={() => { setBulkAction('csv'); setTimeout(applyBulk, 0); }}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
              <Download className="w-3 h-3" /> Export CSV
            </button>
            <button onClick={() => { setBulkAction('fb'); setTimeout(applyBulk, 0); }}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
              <Share2 className="w-3 h-3" /> Export to FB
            </button>
            <div className="flex-1" />
            <button onClick={() => setBulkAction('delete')}
              className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-900/30 text-red-300 inline-flex items-center gap-1.5">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
            <button onClick={() => setSelected(new Set())}
              className="px-2 py-1.5 rounded text-xs hover:bg-stone-800 text-stone-400">
              Clear
            </button>
          </div>
          {/* Mobile bulk dropdown */}
          <details className="mb-4 anim-slide bg-stone-900 text-white rounded-lg md:hidden">
            <summary className="cursor-pointer p-3 flex items-center justify-between text-sm font-semibold list-none">
              <span>{selected.size} selected · Actions</span>
              <ChevronDown className="w-4 h-4" />
            </summary>
            <div className="px-3 pb-3 flex flex-col gap-1 border-t border-stone-700">
              <button onClick={() => setBulkAction('sale')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left"
                style={{ color: GOLD }}>
                <Tag className="w-3 h-3" /> Mark On Sale
              </button>
              <button onClick={() => { setBulkAction('removeSale'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 text-left">
                Remove Sale
              </button>
              <button onClick={() => setBulkAction('sold')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Award className="w-3 h-3" /> Mark as Sold
              </button>
              <button onClick={() => { setBulkAction('feature'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Star className="w-3 h-3" /> Feature
              </button>
              <button onClick={() => { setBulkAction('csv'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button onClick={() => { setBulkAction('fb'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Share2 className="w-3 h-3" /> Export to FB
              </button>
              <button onClick={() => setBulkAction('delete')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-red-900/30 text-red-300 inline-flex items-center gap-1.5 text-left">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              <button onClick={() => setSelected(new Set())}
                className="px-3 py-2 rounded text-xs hover:bg-stone-800 text-stone-400 text-left">
                Clear Selection
              </button>
            </div>
          </details>
        </>
      )}

      {/* Bulk action prompts */}
      {bulkAction === 'sale' && (
        <div className="mb-4 p-4 border-2 rounded-lg flex items-center gap-3 anim-slide" style={{ borderColor: GOLD, backgroundColor: '#FFFCF2' }}>
          <Tag className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-sm font-medium">Apply discount to {selected.size} vehicles:</span>
          <input value={bulkValue} onChange={(e) => setBulkValue(e.target.value)}
            placeholder="e.g. 7% or $2000" autoFocus
            className="px-3 py-1.5 border border-stone-300 rounded-md text-sm w-32 ring-gold" />
          <Btn variant="gold" size="sm" onClick={applyBulk}>Apply Sale</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setBulkAction(null); setBulkValue(''); }}>Cancel</Btn>
        </div>
      )}
      {bulkAction === 'sold' && (
        <div className="mb-4 p-4 border-2 border-green-300 bg-green-50 rounded-lg flex items-center gap-3 anim-slide">
          <Award className="w-4 h-4 text-green-700" />
          <span className="text-sm font-medium">Mark {selected.size} as sold to:</span>
          <input value={bulkBuyer} onChange={(e) => setBulkBuyer(e.target.value)}
            placeholder="Buyer name" autoFocus
            className="px-3 py-1.5 border border-stone-300 rounded-md text-sm w-48 ring-gold" />
          <Btn variant="dark" size="sm" onClick={applyBulk}>Mark Sold</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setBulkAction(null); setBulkBuyer(''); }}>Cancel</Btn>
        </div>
      )}
      {bulkAction === 'delete' && (
        <div className="mb-4 p-4 border-2 border-red-300 bg-red-50 rounded-lg flex items-center gap-3 anim-slide">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span className="text-sm font-medium">Delete {selected.size} vehicles permanently? This cannot be undone.</span>
          <Btn variant="dark" size="sm" onClick={applyBulk} className="bg-red-700 border-red-700 hover:bg-red-800">Delete</Btn>
          <Btn variant="ghost" size="sm" onClick={() => setBulkAction(null)}>Cancel</Btn>
        </div>
      )}

      {/* Inventory table, grid, or pipeline */}
      {view === 'pipeline' ? (
        <div className="overflow-x-auto pb-3 -mx-2 px-2">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {RECON_STAGES.map((stage) => {
              const items = pipelineColumns[stage.key] || [];
              return (
                <div key={stage.key} className="rounded-lg flex flex-col" style={{ width: 280, flexShrink: 0, backgroundColor: '#FAFAF9', border: '1px solid #E7E5E4' }}>
                  <div className="px-3 py-2.5 rounded-t-lg flex items-center justify-between" style={{ backgroundColor: stage.bg, borderBottom: `2px solid ${stage.accent}` }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.accent }} />
                      <span className="text-[11px] smallcaps font-bold" style={{ color: stage.color }}>
                        {stage.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold tabular px-1.5 py-0.5 rounded-full bg-white/70" style={{ color: stage.color }}>
                      {items.length}
                    </span>
                  </div>
                  <div className="p-2 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="text-[11px] text-stone-400 italic text-center py-6">No vehicles in this stage</div>
                    ) : items.map((v) => {
                      const dStage = daysSince(v.reconStartDate || v.dateAdded);
                      const stageIdx = RECON_STAGES.findIndex((s) => s.key === stage.key);
                      const canPrev = stageIdx > 0;
                      const canNext = stageIdx < RECON_STAGES.length - 1;
                      return (
                        <div key={v.id} className="rounded-md bg-white border border-stone-200 p-2.5 hover:border-stone-300 transition group">
                          <button onClick={() => onEdit(v.id)} className="block text-left w-full">
                            <div className="font-medium text-[13px] leading-tight truncate">{v.year} {v.make} {v.model}</div>
                            {v.trim && <div className="text-[11px] text-stone-500 truncate">{v.trim}</div>}
                          </button>
                          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] tabular text-stone-600">
                            <div>{dStage != null ? `${dStage}d in stage` : '—'}</div>
                            <div className="text-right">Stock {v.stockNumber || '—'}</div>
                            {v.cost ? <div>Cost: {fmtMoney(v.cost)}</div> : <div>Cost: —</div>}
                            {v.reconCost ? <div className="text-right">Recon: {fmtMoney(v.reconCost)}</div> : <div className="text-right text-stone-400">Recon: —</div>}
                          </div>
                          {v.acquisitionSource && (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] font-bold smallcaps" style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                              {v.acquisitionSource}{v.acquisitionSource === 'Auction' && v.auctionName ? ` · ${v.auctionName}` : ''}
                            </div>
                          )}
                          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <button
                              type="button" disabled={!canPrev}
                              onClick={() => advanceStage(v, -1)}
                              className={`text-[10px] smallcaps font-semibold ${canPrev ? 'text-stone-500 hover:text-stone-900' : 'text-stone-300 cursor-not-allowed'}`}>
                              ← Previous
                            </button>
                            <button
                              type="button" disabled={!canNext}
                              onClick={() => advanceStage(v, 1)}
                              className={`text-[10px] smallcaps font-bold px-2 py-1 rounded ${canNext ? 'hover:opacity-90' : 'cursor-not-allowed opacity-50'}`}
                              style={{ backgroundColor: canNext ? stage.accent : '#E5E7EB', color: canNext ? '#FFFFFF' : '#9CA3AF' }}>
                              Next Stage →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : view === 'list' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                    </button>
                  </th>
                  <th className="px-3 py-3 w-20 text-left">Photo</th>
                  <th className="px-3 py-3 w-14 text-left">Year</th>
                  <th className="px-3 py-3 text-left">Make / Model</th>
                  <th className="px-3 py-3 text-left">Trim</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Mileage</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-right">Days</th>
                  <th className="px-3 py-3 text-right">Views</th>
                  <th className="px-4 py-3 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-16 px-4">
                    <Car className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                    <div className="font-display text-lg font-semibold text-stone-900 mb-1">No vehicles match</div>
                    <div className="text-sm text-stone-500 mb-4 max-w-xs mx-auto">Try adjusting your filters, or add your first vehicle to get started.</div>
                    <button onClick={onAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white"
                      style={{ backgroundColor: GOLD, color: '#1A1714' }}>
                      <Plus className="w-3.5 h-3.5" /> Add Vehicle
                    </button>
                  </td></tr>
                ) : paged.map(v => (
                  <tr key={v.id} className={`group hover:bg-stone-50 transition ${selected.has(v.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleOne(v.id)} className="flex items-center justify-center">
                        {selected.has(v.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />}
                      </button>
                    </td>
                    <td className="px-3 py-3"><VehiclePhoto vehicle={v} size="sm" /></td>
                    <td className="px-3 py-3 font-medium tabular">{v.year}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => onEdit(v.id)} className="font-semibold hover:underline text-left">
                          {v.make} {v.model}
                        </button>
                        {reservedMap.has(v.id) && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded smallcaps"
                            style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                            <Timer className="w-2.5 h-2.5" /> RESERVED
                          </span>
                        )}
                        {(!v.description || !v.description.trim()) && (
                          <button onClick={(e) => { e.stopPropagation(); onEdit(v.id); }}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded smallcaps"
                            style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                            <Sparkles className="w-2.5 h-2.5" /> No desc — Generate
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 tabular flex items-center gap-1.5 flex-wrap">
                        <span>VIN ··{v.vin.slice(-6)} · Stock {v.stockNumber}</span>
                        {v.acquisitionSource && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold smallcaps not-tabular" style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                            {v.acquisitionSource}{v.acquisitionSource === 'Auction' && v.auctionName ? ` · ${v.auctionName}` : ''}
                          </span>
                        )}
                        {reservedMap.has(v.id) && (
                          <>
                            <span> · </span>
                            <span style={{ color: '#7A5A0F' }}>{reservedMap.get(v.id).customerName}</span>
                            <button onClick={(e) => { e.stopPropagation(); onReleaseReservation(reservedMap.get(v.id).id); }}
                              className="ml-2 text-[10px] underline hover:text-stone-700">Release Hold</button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-stone-600">{v.trim}</td>
                    <td className="px-3 py-3 text-right tabular">
                      {v.salePrice ? (
                        <>
                          <div className="font-semibold" style={{ color: RED_ACCENT }}>{fmtMoney(v.salePrice)}</div>
                          <div className="text-[11px] text-stone-400 line-through">{fmtMoney(v.listPrice)}</div>
                        </>
                      ) : (
                        <div className="font-semibold">{fmtMoney(v.listPrice)}</div>
                      )}
                      {v.daysOnLot > 45 && (() => {
                        const price = v.salePrice || v.listPrice;
                        const cost = v.cost || 0;
                        if (cost > 0) {
                          const margin = (price - cost) / cost * 100;
                          if (margin > 10) {
                            const r5 = Math.round(price * 0.95 / 5) * 5;
                            const suggested = r5 % 10 === 0 ? r5 - 1 : r5;
                            return (
                              <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold"
                                style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                AI: drop to {fmtMoney(suggested)}
                              </div>
                            );
                          }
                          return <div className="text-[9px] text-stone-400 mt-1">At margin floor</div>;
                        }
                        return null;
                      })()}
                    </td>
                    <td className="px-3 py-3 text-right tabular text-stone-600">{Number(v.mileage).toLocaleString()}</td>
                    <td className="px-3 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tabular ${
                        v.daysOnLot >= 60 ? 'bg-red-100 text-red-700' :
                        v.daysOnLot >= 31 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {v.daysOnLot}d
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{(v.views || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 relative">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(v.id); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setSellRequest(v); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition">
                          <Check className="w-3 h-3" /> Sold
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenKebab(o => o === v.id ? null : v.id); }}
                          title="More actions"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-stone-500 hover:bg-stone-100 transition">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openKebab === v.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpenKebab(null); }} />
                            <div className="absolute right-2 top-full mt-1 w-44 bg-white border border-stone-200 rounded-md shadow-lg z-40 py-1 anim-fade">
                              <button onClick={(e) => { e.stopPropagation(); updateVehicle(v.id, { status: v.status === 'Featured' ? 'Available' : 'Featured' }); flash(v.status === 'Featured' ? 'Unfeatured' : 'Vehicle featured'); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Star className="w-3 h-3" /> {v.status === 'Featured' ? 'Unfeature' : 'Feature'}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); const sale = Math.round(v.listPrice * 0.93 / 5) * 5; updateVehicle(v.id, { salePrice: sale, status: 'On Sale' }); flash(`${v.year} ${v.make} ${v.model} put on sale`); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Tag className="w-3 h-3" /> Put on Sale
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); flash(`Export queued: ${v.year} ${v.make} ${v.model}`); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Share2 className="w-3 h-3" /> Export to Facebook
                              </button>
                              <div className="border-t border-stone-100 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(v.id); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-700 flex items-center gap-2 font-semibold">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="vehicle" />
        </Card>
      ) : (
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {paged.map(v => (
            <Card key={v.id} className="overflow-hidden group hover:shadow-md transition cursor-pointer"
              onClick={() => onEdit(v.id)}>
              <div className="relative">
                <VehiclePhoto vehicle={v} size="lg" />
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                  <StatusBadge status={v.status} />
                  {reservedMap.has(v.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full smallcaps"
                      style={{ backgroundColor: GOLD, color: '#1A1612' }}>
                      <Timer className="w-2.5 h-2.5" /> RESERVED · {reservedMap.get(v.id).customerName.split(' ')[0]}
                    </span>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleOne(v.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-md flex items-center justify-center hover:bg-white">
                  {selected.has(v.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-500" />}
                </button>
              </div>
              <div className="p-3.5">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="font-display text-base font-medium leading-tight truncate">
                    {v.year} {v.make} {v.model}
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 mb-2.5">{v.trim}</div>
                <div className="flex items-baseline justify-between mb-2.5">
                  {v.salePrice ? (
                    <div className="tabular">
                      <span className="font-display text-lg font-semibold" style={{ color: RED_ACCENT }}>{fmtMoney(v.salePrice)}</span>
                      <span className="text-[11px] text-stone-400 line-through ml-1.5">{fmtMoney(v.listPrice)}</span>
                    </div>
                  ) : (
                    <span className="font-display text-lg font-semibold tabular">{fmtMoney(v.listPrice)}</span>
                  )}
                  <span className="text-[11px] text-stone-500 tabular">{fmtMiles(v.mileage)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] smallcaps text-stone-400 pt-2 border-t border-stone-100">
                  <span>Stock {v.stockNumber}</span>
                  <span className={`font-semibold ${v.daysOnLot >= 60 ? 'text-red-700' : v.daysOnLot >= 45 ? 'text-orange-700' : v.daysOnLot >= 30 ? 'text-amber-700' : ''}`}>
                    {v.daysOnLot}d on lot
                  </span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(v.views || 0).toLocaleString()}</span>
                </div>
                {v.acquisitionSource && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] font-bold smallcaps" style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                    {v.acquisitionSource}{v.acquisitionSource === 'Auction' && v.auctionName ? ` · ${v.auctionName}` : ''}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-4">
          <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="vehicle" />
        </Card>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete vehicle?"
        message="This permanently removes the vehicle from inventory. This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="red"
        onConfirm={() => {
          const id = confirmDelete;
          const v = inventory.find(x => x.id === id);
          removeVehicle(id);
          setConfirmDelete(null);
          flash(`${v ? `${v.year} ${v.make} ${v.model}` : 'Vehicle'} deleted`,
            { tone: 'destructive', undo: () => v && setInventory(arr => [v, ...arr]) });
        }}
        onCancel={() => setConfirmDelete(null)} />

      <ConfirmDialog
        isOpen={showSaveView}
        title="Save current view"
        message="Give this filter combination a name to load it later."
        confirmLabel="Save view"
        confirmColor="dark"
        inputs={[{ name: 'name', label: 'View name', placeholder: 'e.g., New listings under $30k' }]}
        onConfirm={(vals) => { saveCurrentView(vals.name); setShowSaveView(false); }}
        onCancel={() => setShowSaveView(false)} />

      <ConfirmDialog
        isOpen={!!sellRequest}
        title={sellRequest ? `Mark ${sellRequest.year} ${sellRequest.make} ${sellRequest.model} as sold?` : ''}
        message={sellRequest ? `Stock #${sellRequest.stockNumber || sellRequest.id}. This moves the vehicle from inventory to Sold.` : ''}
        confirmLabel="Mark Sold"
        confirmColor="dark"
        inputs={sellRequest ? [
          { name: 'buyer', label: 'Buyer Name', placeholder: 'e.g., Walk-in Buyer' },
          { name: 'finalPrice', label: 'Final Sale Price ($)', type: 'number',
            defaultValue: String(sellRequest.salePrice ?? sellRequest.listPrice),
            hint: `List: $${(sellRequest.listPrice||0).toLocaleString()}${sellRequest.salePrice ? ` · Sale: $${sellRequest.salePrice.toLocaleString()}` : ''}` }
        ] : []}
        onConfirm={(vals) => {
          const buyer = (vals.buyer || '').trim() || 'Walk-in Buyer';
          const final = parseFloat(vals.finalPrice) || (sellRequest.salePrice ?? sellRequest.listPrice);
          markSold(sellRequest.id, buyer, final);
          setSellRequest(null);
        }}
        onCancel={() => setSellRequest(null)} />
    </div>
  );
}

/* ====================== VEHICLE FORM TAB ========================= */

