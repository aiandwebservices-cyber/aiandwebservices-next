'use client';
import React, { useState, useMemo } from 'react';
import {
  FileText, Printer, Download, ChevronDown, ChevronRight, Check,
  AlertTriangle, Car, MapPin, Shield, ClipboardList, X,
} from 'lucide-react';
import {
  GOLD, GOLD_SOFT, RED_ACCENT,
  fmtMoney, fmtDate,
  Btn, Card, Field, Input, Select, Textarea,
} from './_internals';
import { useAdminConfig } from './AdminConfigContext';

/* ─── Inspection checklist data ──────────────────────────────────── */
const INSPECTION_CATEGORIES = [
  { label: 'Engine', items: [
    'Oil level & condition', 'Coolant level & condition', 'Air filter', 'Serpentine belt',
    'Timing belt / chain', 'Radiator hoses', 'Power steering fluid', 'Brake fluid',
    'Transmission fluid', 'Battery & connections', 'Spark plugs', 'Fuel filter',
    'PCV valve', 'Thermostat', 'Valve cover gaskets',
  ]},
  { label: 'Transmission', items: [
    'Fluid level & condition', 'Shift quality', 'Clutch operation', 'Transfer case (4WD)',
    'CV joints', 'U-joints', 'Differential fluid', 'Transmission mounts',
  ]},
  { label: 'Brakes', items: [
    'Front pads / shoes', 'Rear pads / shoes', 'Front rotors / drums', 'Rear rotors / drums',
    'Brake lines & hoses', 'Master cylinder', 'Brake calipers', 'Parking brake',
    'ABS system', 'Brake fluid level',
  ]},
  { label: 'Suspension', items: [
    'Front struts / shocks', 'Rear struts / shocks', 'Ball joints', 'Tie rod ends',
    'Control arms', 'Sway bar links', 'Wheel bearings', 'Alignment',
    'Steering rack / box', 'Suspension bushings',
  ]},
  { label: 'Electrical', items: [
    'Battery & charging system', 'Alternator output', 'Exterior lights', 'Interior lights',
    'Dashboard warning lights', 'Power windows', 'Power locks', 'Power mirrors',
    'Horn', 'Audio system', 'Navigation / infotainment', 'OBD-II scan',
  ]},
  { label: 'Interior', items: [
    'Seat condition', 'Seat adjustments', 'Headliner', 'Carpets & floor mats',
    'Dashboard (cracks / warping)', 'Center console', 'Door panels', 'A/C operation',
    'Heat operation', 'Radio / audio', 'Navigation', 'Sunroof / moonroof',
    'Windshield & rear glass', 'Rearview mirror', 'Sun visors',
  ]},
  { label: 'Exterior', items: [
    'Paint condition', 'Body panels', 'Front bumper', 'Rear bumper',
    'Door operation & seals', 'Trunk operation & seal', 'Hood latch & hinges',
    'All glass', 'Exterior mirrors', 'Wheel covers / caps', 'Emblems & trim',
    'Panel gaps', 'Rust / corrosion', 'Undercoating', 'Antenna',
  ]},
  { label: 'Safety', items: [
    'Airbag system (no codes)', 'Seatbelts — all rows', 'TPMS sensors',
    'Child anchor points (LATCH)', 'Backup camera', 'Parking sensors',
    'Blind-spot monitoring', 'Lane departure system', 'Forward collision warning', 'Safety kit',
  ]},
  { label: 'Road Test', items: [
    'Engine performance', 'Transmission shifts', 'Braking response', 'Steering feel',
    'Noise / vibration / harshness', 'A/C under load', 'Cruise control',
    'Four-wheel drive engagement', 'Acceleration', 'Highway handling',
  ]},
  { label: 'Undercarriage', items: [
    'Frame condition', 'Exhaust system', 'Catalytic converter', 'Suspension components',
    'CV axles', 'Oil pan', 'Transmission pan', 'Fuel lines', 'Brake lines', 'Fluid leaks',
  ]},
];

const TOTAL_ITEMS = INSPECTION_CATEGORIES.reduce((s, c) => s + c.items.length, 0);

function itemKey(catIdx, itemIdx) { return `${catIdx}-${itemIdx}`; }

function initInspection() {
  const map = {};
  INSPECTION_CATEGORIES.forEach((cat, ci) => {
    cat.items.forEach((_, ii) => { map[itemKey(ci, ii)] = { status: '', note: '' }; });
  });
  return map;
}

/* ─── Shared print style injected once ──────────────────────────── */
const PRINT_STYLE = `@media print { body > *:not(.print-target) { display: none !important; } .print-target { display: block !important; } .no-print { display: none !important; } }`;

/* ─── DocumentsTab ──────────────────────────────────────────────── */
export function DocumentsTab({ inventory = [], flash }) {
  const config = useAdminConfig();
  const dealerName = config?.dealerName || 'Premier Auto';
  const dealerAddress = config?.address || '1234 Auto Row, Miami, FL 33101';

  /* Card A — Buyer's Guide */
  const [bgVehicleId, setBgVehicleId] = useState(inventory[0]?.id || '');
  const [bgWarranty, setBgWarranty] = useState('as-is');
  const [bgPreview, setBgPreview] = useState(false);

  /* Card B — Purchase Agreement */
  const [paVehicleId, setPaVehicleId] = useState(inventory[0]?.id || '');
  const [paBuyer, setPaBuyer] = useState('');
  const [paBuyerAddr, setPaBuyerAddr] = useState('');
  const [paSalePrice, setPaSalePrice] = useState('');
  const [paPreview, setPaPreview] = useState(false);

  /* Card C — Odometer Disclosure */
  const [odVehicleId, setOdVehicleId] = useState(inventory[0]?.id || '');
  const [odType, setOdType] = useState('actual');

  /* Card D — Inspection Report */
  const [inVehicleId, setInVehicleId] = useState(inventory[0]?.id || '');
  const [inspection, setInspection] = useState(initInspection);
  const [expandedCat, setExpandedCat] = useState(0);
  const [inspectionDone, setInspectionDone] = useState(false);

  /* Card E — Title placeholder */
  const [titleState, setTitleState] = useState('Florida');

  /* helpers */
  const getVeh = (id) => inventory.find(v => v.id === id) || inventory[0] || {};

  const setItemStatus = (key, status) =>
    setInspection(prev => ({ ...prev, [key]: { ...prev[key], status } }));
  const setItemNote = (key, note) =>
    setInspection(prev => ({ ...prev, [key]: { ...prev[key], note } }));

  const passCount = useMemo(() =>
    Object.values(inspection).filter(v => v.status === 'pass').length, [inspection]);
  const failCount = useMemo(() =>
    Object.values(inspection).filter(v => v.status === 'fail').length, [inspection]);
  const noteCount = useMemo(() =>
    Object.values(inspection).filter(v => v.status === 'note').length, [inspection]);

  const VehicleSelector = ({ value, onChange }) => (
    <div className="mb-4">
      <label className="block text-[10px] smallcaps font-semibold text-stone-500 mb-1">Select Vehicle</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 ring-offset-0"
        style={{ '--tw-ring-color': GOLD }}>
        {inventory.map(v => (
          <option key={v.id} value={v.id}>
            {v.year} {v.make} {v.model} — Stock #{v.stockNumber}
          </option>
        ))}
        {inventory.length === 0 && <option value="">No vehicles in inventory</option>}
      </select>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
          <FileText className="w-5 h-5" style={{ color: '#7A5A0F' }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Deal Documents</h1>
          <p className="text-sm text-stone-500 mt-0.5">Generate, preview, and print required deal paperwork.</p>
        </div>
      </div>

      {/* ── Card A: Buyer's Guide ─────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-amber-50 border border-amber-200">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="font-display font-semibold">Buyer's Guide</div>
              <div className="text-[10px] smallcaps font-semibold text-red-600">FTC Required</div>
            </div>
          </div>
          <div className="text-[11px] text-stone-500 max-w-md">
            Every used vehicle must display a Buyer's Guide per FTC rules (16 CFR Part 455).
          </div>
        </div>
        <div className="p-5">
          <VehicleSelector value={bgVehicleId} onChange={id => { setBgVehicleId(id); setBgPreview(false); }} />

          <div className="mb-4">
            <label className="block text-[10px] smallcaps font-semibold text-stone-500 mb-2">Warranty Type</label>
            <div className="flex gap-4">
              {[['as-is', 'As-Is (No Warranty)'], ['warranty', 'With Warranty']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="bgWarranty" value={v} checked={bgWarranty === v}
                    onChange={() => setBgWarranty(v)} className="accent-amber-600" />
                  <span className="text-sm font-medium">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <Btn variant="gold" icon={FileText} onClick={() => setBgPreview(true)}>
              Generate Buyer's Guide
            </Btn>
            {bgPreview && (
              <Btn variant="default" icon={Printer} onClick={() => { window.print(); flash('Print dialog opened'); }}>
                Print
              </Btn>
            )}
            {bgPreview && (
              <Btn variant="default" icon={Download}
                onClick={() => flash('PDF download — connect document generation service in Settings')}>
                Download PDF
              </Btn>
            )}
          </div>

          {bgPreview && (() => {
            const v = getVeh(bgVehicleId);
            return (
              <div className="border-2 border-stone-800 p-5 rounded bg-white text-sm font-serif print-target">
                <div className="text-center mb-3">
                  <div className="text-xl font-bold uppercase tracking-wide border-b-2 border-stone-800 pb-2 mb-2">
                    BUYER'S GUIDE
                  </div>
                  <div className="text-[11px] text-stone-600">As required by FTC Rule (16 CFR Part 455)</div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-[12px]">
                  <div><span className="font-bold">Vehicle:</span> {v.year} {v.make} {v.model} {v.trim}</div>
                  <div><span className="font-bold">Stock #:</span> {v.stockNumber}</div>
                  <div><span className="font-bold">VIN:</span> {v.vin || '—'}</div>
                  <div><span className="font-bold">Mileage:</span> {Number(v.mileage || 0).toLocaleString()} mi</div>
                </div>
                <div className="border border-stone-400 rounded p-3 mb-3 text-[12px]">
                  {bgWarranty === 'as-is' ? (
                    <>
                      <div className="font-bold text-sm mb-1">☑ AS IS — NO WARRANTY</div>
                      <div>YOU WILL PAY ALL COSTS FOR ANY REPAIRS. The dealer assumes no responsibility for any repairs regardless of any oral statements about the vehicle.</div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-sm mb-1">☑ WARRANTY</div>
                      <div className="mb-1"><span className="font-bold">Duration:</span> 30 days or 1,000 miles, whichever comes first</div>
                      <div className="mb-1"><span className="font-bold">Systems Covered:</span> Engine, Transmission, Drive Axle</div>
                      <div><span className="font-bold">Percentage of repair costs paid by dealer:</span> 50%</div>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-stone-600 mb-3">
                  IMPORTANT: The information on this form is part of any contract to buy this vehicle. Removing this form before a consumer has purchased the vehicle is a violation of Federal law (16 C.F.R. 455).
                </div>
                <div className="text-[12px] font-bold">{dealerName}</div>
                <div className="text-[11px] text-stone-600">{dealerAddress}</div>
              </div>
            );
          })()}
        </div>
      </Card>

      {/* ── Card B: Purchase Agreement ────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-stone-50 border border-stone-200">
            <ClipboardList className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="font-display font-semibold">Purchase Agreement</div>
            <div className="text-[10px] text-stone-500">Buyer / seller contract for the vehicle sale</div>
          </div>
        </div>
        <div className="p-5">
          <VehicleSelector value={paVehicleId} onChange={id => { setPaVehicleId(id); setPaPreview(false); }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <Field label="Buyer Name">
              <Input value={paBuyer} onChange={e => setPaBuyer(e.target.value)} placeholder="Jane Doe" />
            </Field>
            <Field label="Sale Price ($)">
              <Input type="number" value={paSalePrice} onChange={e => setPaSalePrice(e.target.value)} placeholder="38500" />
            </Field>
            <Field label="Buyer Address" className="md:col-span-2">
              <Input value={paBuyerAddr} onChange={e => setPaBuyerAddr(e.target.value)} placeholder="123 Main St, Miami, FL 33101" />
            </Field>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <Btn variant="gold" icon={FileText} onClick={() => setPaPreview(true)}>
              Generate Agreement
            </Btn>
            {paPreview && (
              <Btn variant="default" icon={Printer} onClick={() => { window.print(); flash('Print dialog opened'); }}>
                Print
              </Btn>
            )}
            {paPreview && (
              <Btn variant="default" icon={Download}
                onClick={() => flash('Sending to customer — configure email in Settings')}>
                Email to Customer
              </Btn>
            )}
          </div>

          {paPreview && (() => {
            const v = getVeh(paVehicleId);
            const sp = parseFloat(paSalePrice) || v.salePrice || v.listPrice || 0;
            const dp = 5000;
            const trade = 0;
            const financed = Math.max(0, sp - dp - trade);
            const apr = 6.9;
            const term = 60;
            const r = apr / 100 / 12;
            const mo = r > 0 ? Math.round(r * financed / (1 - Math.pow(1 + r, -term)) * 100) / 100 : financed / term;
            return (
              <div className="border border-stone-300 rounded p-5 bg-white text-[12px] leading-relaxed font-serif print-target">
                <div className="text-center text-base font-bold mb-4 uppercase tracking-wide border-b pb-3">
                  Vehicle Purchase Agreement
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                  <div>
                    <div className="font-bold text-[10px] uppercase text-stone-500 mb-0.5">Seller</div>
                    <div>{dealerName}</div>
                    <div className="text-stone-600">{dealerAddress}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[10px] uppercase text-stone-500 mb-0.5">Buyer</div>
                    <div>{paBuyer || '___________________________'}</div>
                    <div className="text-stone-600">{paBuyerAddr || '___________________________'}</div>
                  </div>
                </div>
                <div className="border border-stone-200 rounded p-3 mb-4">
                  <div className="font-bold mb-2">Vehicle Description</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div><span className="text-stone-500">Year/Make/Model:</span> {v.year} {v.make} {v.model} {v.trim}</div>
                    <div><span className="text-stone-500">VIN:</span> {v.vin || '—'}</div>
                    <div><span className="text-stone-500">Stock #:</span> {v.stockNumber}</div>
                    <div><span className="text-stone-500">Mileage:</span> {Number(v.mileage || 0).toLocaleString()} mi</div>
                  </div>
                </div>
                <div className="border border-stone-200 rounded p-3 mb-4">
                  <div className="font-bold mb-2">Financial Terms</div>
                  <div className="space-y-1">
                    {[
                      ['Sale Price', fmtMoney(sp)],
                      ['Trade-In Allowance', fmtMoney(trade)],
                      ['Down Payment', fmtMoney(dp)],
                      ['Amount Financed', fmtMoney(financed)],
                      ['APR', `${apr}%`],
                      ['Term', `${term} months`],
                      ['Monthly Payment', `${fmtMoney(mo)}/month`],
                      ['Total of Payments', fmtMoney(mo * term)],
                    ].map(([l, val]) => (
                      <div key={l} className="flex justify-between border-b border-stone-100 pb-0.5">
                        <span className="text-stone-600">{l}</span>
                        <span className="font-semibold tabular">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-8">
                  <div>
                    <div className="border-b border-stone-400 mb-1 pb-4" />
                    <div className="text-[10px] text-stone-500">Buyer Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
                  </div>
                  <div>
                    <div className="border-b border-stone-400 mb-1 pb-4" />
                    <div className="text-[10px] text-stone-500">Seller Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
                  </div>
                </div>
                <div className="text-[10px] text-stone-400 mt-3 italic text-center">
                  Digital signatures via DocuSign — coming soon
                </div>
              </div>
            );
          })()}
        </div>
      </Card>

      {/* ── Card C: Odometer Disclosure ───────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-stone-50 border border-stone-200">
            <Car className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="font-display font-semibold">Odometer Disclosure Statement</div>
            <div className="text-[10px] text-stone-500">Federal requirement for all vehicle transfers (49 U.S.C. § 32705)</div>
          </div>
        </div>
        <div className="p-5">
          <VehicleSelector value={odVehicleId} onChange={id => setOdVehicleId(id)} />
          {(() => {
            const v = getVeh(odVehicleId);
            return (
              <>
                <div className="mb-4">
                  <Field label="Current Mileage (pre-filled from inventory)">
                    <Input value={Number(v.mileage || 0).toLocaleString()} readOnly className="bg-stone-50" />
                  </Field>
                </div>
                <div className="mb-4">
                  <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Odometer Reading Certification</div>
                  <div className="space-y-2">
                    {[
                      ['actual', 'The mileage stated is the ACTUAL mileage of the vehicle'],
                      ['exceeds', 'The mileage stated EXCEEDS mechanical limits (odometer can only read 5 or 6 digits)'],
                      ['discrepancy', 'WARNING: The odometer reading is NOT the actual mileage — odometer discrepancy'],
                    ].map(([val, label]) => (
                      <label key={val} className="flex items-start gap-2.5 cursor-pointer">
                        <input type="radio" name="odType" value={val} checked={odType === val}
                          onChange={() => setOdType(val)} className="mt-0.5 accent-amber-600 shrink-0" />
                        <span className={`text-sm ${val === 'discrepancy' ? 'text-red-700 font-semibold' : ''}`}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-6 mb-4">
                  <div>
                    <div className="border-b border-stone-400 mb-1 pb-4" />
                    <div className="text-[10px] text-stone-500">Seller Signature &nbsp;&nbsp;&nbsp;&nbsp; Date</div>
                  </div>
                  <div>
                    <div className="border-b border-stone-400 mb-1 pb-4" />
                    <div className="text-[10px] text-stone-500">Buyer Signature &nbsp;&nbsp;&nbsp;&nbsp; Date</div>
                  </div>
                </div>
                <Btn variant="default" icon={Printer} onClick={() => { window.print(); flash('Print dialog opened'); }}>
                  Print Odometer Disclosure
                </Btn>
              </>
            );
          })()}
        </div>
      </Card>

      {/* ── Card D: Vehicle Condition Report ─────────────────────── */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-stone-50 border border-stone-200">
              <ClipboardList className="w-4 h-4 text-stone-600" />
            </div>
            <div>
              <div className="font-display font-semibold">Vehicle Condition Report</div>
              <div className="text-[10px] text-stone-500">{TOTAL_ITEMS}-point inspection checklist</div>
            </div>
          </div>
          {inspectionDone && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #10B981' }}>
              <Check className="w-4 h-4" />
              Inspection Complete — {passCount}/{TOTAL_ITEMS} passed
            </div>
          )}
        </div>
        <div className="p-5">
          <VehicleSelector value={inVehicleId} onChange={id => { setInVehicleId(id); setInspectionDone(false); }} />

          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Pass: {passCount}
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" /> Note: {noteCount}
            </span>
            <span className="flex items-center gap-1.5 text-red-700">
              <X className="w-3.5 h-3.5" /> Fail: {failCount}
            </span>
            <span className="text-stone-400 text-[11px]">· {TOTAL_ITEMS - passCount - noteCount - failCount} not inspected</span>
          </div>

          <div className="space-y-2">
            {INSPECTION_CATEGORIES.map((cat, ci) => {
              const isExpanded = expandedCat === ci;
              const catItems = cat.items.map((_, ii) => inspection[itemKey(ci, ii)]);
              const catPass  = catItems.filter(x => x.status === 'pass').length;
              const catFail  = catItems.filter(x => x.status === 'fail').length;
              const catNote  = catItems.filter(x => x.status === 'note').length;
              return (
                <div key={cat.label} className="border border-stone-200 rounded-md overflow-hidden">
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition text-left"
                    onClick={() => setExpandedCat(isExpanded ? -1 : ci)}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{cat.label}</span>
                      <span className="text-[10px] text-stone-400">{cat.items.length} items</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {catFail > 0 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{catFail} fail</span>}
                      {catNote > 0 && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{catNote} note</span>}
                      {catPass > 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{catPass} pass</span>}
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="divide-y divide-stone-100">
                      {cat.items.map((item, ii) => {
                        const key = itemKey(ci, ii);
                        const val = inspection[key];
                        return (
                          <div key={key} className="px-4 py-2.5">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-sm flex-1 min-w-[160px]">{item}</span>
                              <div className="flex gap-1.5 shrink-0">
                                {[
                                  { s: 'pass', label: 'Pass', cls: 'bg-emerald-500 text-white' },
                                  { s: 'note', label: 'Note', cls: 'bg-amber-500 text-white' },
                                  { s: 'fail', label: 'Fail', cls: 'bg-red-500 text-white' },
                                ].map(({ s, label, cls }) => (
                                  <button key={s} onClick={() => setItemStatus(key, val.status === s ? '' : s)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition border ${
                                      val.status === s ? cls : 'border-stone-200 text-stone-400 hover:border-stone-400'
                                    }`}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {val.status === 'note' && (
                              <input type="text" value={val.note}
                                onChange={e => setItemNote(key, e.target.value)}
                                placeholder="Describe the issue..."
                                className="mt-1.5 w-full text-[12px] px-2 py-1 border border-amber-200 rounded bg-amber-50 text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <Btn variant="gold" icon={Check} onClick={() => {
              setInspectionDone(true);
              flash(`Inspection saved — ${passCount}/${TOTAL_ITEMS} points passed`);
            }}>
              Complete Inspection
            </Btn>
            <Btn variant="default" icon={Printer} onClick={() => { window.print(); flash('Printing customer-facing report (internal notes hidden)'); }}>
              Print Report
            </Btn>
          </div>
        </div>
      </Card>

      {/* ── Card E: Title Application (placeholder) ──────────────── */}
      <Card className="overflow-hidden opacity-75">
        <div className="p-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-stone-50 border border-stone-200">
            <MapPin className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="font-display font-semibold text-stone-500">Title Application</div>
            <div className="text-[10px] text-stone-400">State-specific title forms — coming soon</div>
          </div>
          <div className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">COMING SOON</div>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-[10px] smallcaps font-semibold text-stone-400 mb-1">State</label>
            <select value={titleState} onChange={e => setTitleState(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-md text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
              disabled>
              {['Florida', 'Texas', 'California', 'Georgia', 'New York', 'Ohio'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="rounded-md p-4 border border-stone-200 bg-stone-50 text-sm text-stone-500">
            <div className="font-semibold text-stone-600 mb-1">Florida DHSMV Integration — Q1 2027</div>
            <div>Direct integration with the Florida Department of Highway Safety and Motor Vehicles for electronic title application submission is planned for Q1 2027. Other states to follow based on volume.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
