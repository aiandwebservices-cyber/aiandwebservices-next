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

export function MarketingTab({ inventory, setInventory, settings, setSettings, sold, reviews = [], setReviews = () => {}, flash }) {
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState(null);

  const exportAllCSV = () => {
    const headers = ['year','make','model','trim','listPrice','salePrice','mileage','exteriorColor','interiorColor','transmission','drivetrain','vin','stockNumber','status'];
    downloadFile(`${slug}-inventory-all.csv`, buildCSV(headers, inventory));
    flash('Exported full inventory to CSV');
  };

  const exportFB = () => {
    const headers = ['title','price','description','condition','availability','category','image_url','vehicle_year','vehicle_make','vehicle_model','vehicle_trim','vehicle_mileage','vehicle_vin','address'];
    const rows = inventory.filter(v => v.status !== 'Sold').map(v => ({
      title: `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim(),
      price: v.salePrice || v.listPrice,
      description: v.description,
      condition: 'used', availability: 'in stock', category: 'vehicles',
      image_url: v.photos?.[0] || '',
      vehicle_year: v.year, vehicle_make: v.make, vehicle_model: v.model,
      vehicle_trim: v.trim, vehicle_mileage: v.mileage, vehicle_vin: v.vin,
      address: `${settings.dealership.city}, ${settings.dealership.state}`
    }));
    downloadFile(`${slug}-facebook-marketplace.csv`, buildCSV(headers, rows));
    flash(`${rows.length} vehicles exported to Facebook format`);
  };

  const exportCraigslist = () => {
    const lines = inventory.filter(v => v.status !== 'Sold').map(v => {
      const price = v.salePrice || v.listPrice;
      return [
        `${v.year} ${v.make} ${v.model} ${v.trim || ''} — ${fmtMoney(price)}`,
        '='.repeat(60),
        `Mileage: ${Number(v.mileage).toLocaleString()} miles`,
        `Color: ${v.exteriorColor} exterior, ${v.interiorColor} interior`,
        `Drivetrain: ${v.drivetrain}, Transmission: ${v.transmission}`,
        `VIN: ${v.vin}`, `Stock #: ${v.stockNumber}`,
        '',
        v.description,
        '',
        `Call ${settings.dealership.phone} or visit ${settings.dealership.website}`,
        `Located at ${settings.dealership.address}, ${settings.dealership.city}, ${settings.dealership.state} ${settings.dealership.zip}`,
        '\n\n'
      ].join('\n');
    }).join('\n\n');
    downloadFile(`${slug}-craigslist-listings.txt`, lines, 'text/plain');
    flash('Craigslist listings generated');
  };

  const previewImport = () => {
    if (!importText.trim()) return;
    const { headers, rows } = parseCSV(importText);
    setImportPreview({ headers, rows: rows.slice(0, 10), totalRows: rows.length });
  };

  const confirmImport = () => {
    if (!importPreview) return;
    const { rows } = parseCSV(importText);
    const mapped = rows.map(r => ({
      ...BLANK_VEHICLE,
      id: newId('v'),
      year: Number(r.year || r.Year) || new Date(TODAY).getFullYear(),
      make: r.make || r.Make || 'Toyota',
      model: r.model || r.Model || '',
      trim: r.trim || r.Trim || '',
      bodyStyle: r.bodyStyle || r.BodyStyle || 'Sedan',
      cost: Number(r.cost) || 0,
      listPrice: Number(r.listPrice || r.price || r.Price) || 0,
      salePrice: r.salePrice ? Number(r.salePrice) : null,
      mileage: Number(r.mileage || r.Mileage) || 0,
      exteriorColor: r.exteriorColor || r.color || 'Black',
      interiorColor: r.interiorColor || 'Black',
      vin: r.vin || r.VIN || '',
      stockNumber: r.stockNumber || r.stock || newId('S').slice(-6).toUpperCase(),
      status: r.status || 'Just Arrived',
      description: r.description || ''
    }));
    setInventory(arr => [...mapped, ...arr]);
    flash(`Imported ${mapped.length} vehicles`);
    setImportText('');
    setImportPreview(null);
  };

  const reviewsCount = sold.filter(s => s.review?.status === 'received').length;
  const pendingReviews = sold.filter(s => s.review?.status === 'sent').length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Marketing</h1>
        <p className="text-sm text-stone-500 mt-1">Distribute your inventory everywhere — and reel customers back.</p>
      </div>

      {/* Inventory Export */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Inventory Export</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Push your lot to every channel customers shop on.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={exportAllCSV}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group">
            <FileSpreadsheet className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">Export All to CSV</div>
            <div className="text-[11px] text-stone-500 mt-1">Standard CSV with all vehicle fields</div>
          </button>
          <button onClick={exportFB}
            className="text-left p-4 border-2 rounded-md hover:bg-amber-50 transition group" style={{ borderColor: GOLD }}>
            <Facebook className="w-5 h-5 mb-2" style={{ color: '#1877F2' }} />
            <div className="font-semibold text-sm">Facebook Marketplace</div>
            <div className="text-[11px] text-stone-500 mt-1">FB-formatted CSV ready to upload</div>
          </button>
          <button onClick={exportCraigslist}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group">
            <FileText className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">Craigslist Listings</div>
            <div className="text-[11px] text-stone-500 mt-1">Pre-formatted text per vehicle</div>
          </button>
          <button disabled
            className="text-left p-4 border border-stone-200 rounded-md bg-stone-50/50 opacity-60 cursor-not-allowed">
            <ExternalLink className="w-5 h-5 mb-2 text-stone-400" />
            <div className="font-semibold text-sm text-stone-500">AutoTrader Sync</div>
            <div className="text-[11px] text-stone-400 mt-1">Coming soon — Q3 2026</div>
          </button>
        </div>
      </Card>

      {/* Inventory Import */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Upload className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Inventory Import</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Onboard your entire lot in 5 minutes — paste CSV from any DMS.</p>

        <Field label="CSV content" hint="Header row required. Recognized columns: year, make, model, trim, listPrice, salePrice, mileage, vin, stockNumber, status, description">
          <Textarea rows={5} value={importText} onChange={(e) => setImportText(e.target.value)} className="font-mono text-xs"
            placeholder="year,make,model,trim,listPrice,mileage,vin&#10;2023,Honda,Accord,Sport,28500,15400,1HGCV1F30PA123456" />
        </Field>

        <div className="flex gap-2 mt-3">
          <Btn variant="default" onClick={previewImport} icon={Eye}>Preview</Btn>
          {importPreview && (
            <Btn variant="gold" icon={Check} onClick={confirmImport}>
              Import {importPreview.totalRows} Vehicle{importPreview.totalRows === 1 ? '' : 's'}
            </Btn>
          )}
        </div>

        {importPreview && (
          <div className="mt-4 border border-stone-200 rounded-md overflow-hidden">
            <div className="px-4 py-2 bg-stone-50 text-[10px] smallcaps font-semibold text-stone-500 border-b border-stone-200">
              Preview — first 10 of {importPreview.totalRows} rows
            </div>
            <div className="overflow-x-auto max-h-64 scrollbar-thin">
              <table className="text-xs w-full">
                <thead className="bg-stone-50">
                  <tr>{importPreview.headers.map(h => <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {importPreview.rows.map((r, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      {importPreview.headers.map(h => <td key={h} className="px-3 py-1.5 text-stone-700">{r[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Reputation Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ThumbsUp className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Reputation Management</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Reviews drive 89% of luxury car shoppers. Automate the ask, then respond fast.</p>

        {/* Google Reviews Connection */}
        <div className="mb-6 p-4 rounded-md border border-stone-200 bg-stone-50">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="text-[11px] smallcaps font-semibold text-stone-600 mb-0.5">Google Reviews Connection</div>
              <div className="text-[12px] text-stone-500">Pull live reviews from your Google Business Profile.</div>
            </div>
            {settings.marketing?.googlePlaceId && settings.marketing?.googleApiKey ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <Check className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-600">
                Not Connected
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Google Place ID"
              hint={<>Find at <a className="underline hover:text-stone-900" target="_blank" rel="noopener noreferrer"
                href="https://developers.google.com/maps/documentation/places/web-service/place-id">developers.google.com/maps/documentation/places/web-service/place-id</a></>}>
              <Input value={settings.marketing?.googlePlaceId || ''}
                onChange={(e) => setSettings(s => ({ ...s, marketing: { ...s.marketing, googlePlaceId: e.target.value } }))}
                placeholder="ChIJ…" className="font-mono text-xs" />
            </Field>
            <Field label="Google Places API Key" hint="Stored locally — used server-side in production">
              <Input type="password" value={settings.marketing?.googleApiKey || ''}
                onChange={(e) => setSettings(s => ({ ...s, marketing: { ...s.marketing, googleApiKey: e.target.value } }))}
                placeholder="AIza…" className="font-mono text-xs" />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="text-[11px] text-stone-500">
              <AlertCircle className="w-3 h-3 inline -mt-0.5 mr-1" />
              Google Places blocks browser CORS — in production, reviews are fetched server-side via API route.
            </div>
            <Btn size="sm" variant="outlineGold"
              disabled={!settings.marketing?.googlePlaceId || !settings.marketing?.googleApiKey}
              onClick={() => flash('Google Reviews configured — server-side integration included in setup', 'success')}>
              Connect Google Reviews
            </Btn>
          </div>
        </div>

        {/* Hero rating */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 100%)', border: `1px solid ${GOLD}40` }}>
            <div className="flex items-baseline gap-3">
              <div className="font-display tabular text-5xl font-medium" style={{ color: '#7A5A0F' }}>4.9</div>
              <div className="flex-1">
                <div className="flex items-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4" fill={GOLD} stroke={GOLD} />)}
                </div>
                <div className="text-[11px] smallcaps text-stone-600">847 Google reviews</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
              <TrendingUp className="w-3 h-3" />
              Above market average (4.2)
            </div>
          </div>

          <div className="p-5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Review Request Pipeline</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none">3</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Pending requests</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none">12</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Sent this month</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: '#256B40' }}>8</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Reviews received</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: GOLD }}>67%</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Conversion rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent reviews feed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] smallcaps font-semibold text-stone-500">Recent Reviews</div>
            <a href="#" className="text-[11px] smallcaps font-semibold text-stone-500 hover:text-stone-900">
              View all on Google <ArrowUpRight className="w-3 h-3 inline" />
            </a>
          </div>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="border border-stone-200 rounded-md p-4 bg-white">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold"
                      style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                      {r.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.author}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(n => (
                            <Star key={n} className="w-3 h-3"
                              fill={n <= r.rating ? GOLD : 'transparent'}
                              stroke={n <= r.rating ? GOLD : '#d6d2c8'} strokeWidth={1.5} />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400 tabular">· {r.platform} · {relTime(r.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconBtn icon={Reply} title="Respond" tone="gold"
                      onClick={() => { setRespondingTo(r.id); setResponseText(r.response || ''); }} />
                    <IconBtn icon={Flag} title="Flag inappropriate" tone="danger"
                      onClick={() => flash('Review flagged for moderation')} />
                    <IconBtn icon={Share2} title="Share"
                      onClick={() => flash('Review link copied')} />
                  </div>
                </div>
                <p className="text-[13px] text-stone-700 leading-relaxed mb-2">{r.text}</p>

                {r.response && respondingTo !== r.id && (
                  <div className="mt-3 border-t border-stone-100 pt-3 pl-4 border-l-2 rounded-l-sm bg-stone-50 p-3 text-[12px] text-stone-700"
                    style={{ borderColor: GOLD }}>
                    <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: '#7A5A0F' }}>Owner response</div>
                    {r.response}
                  </div>
                )}

                {respondingTo === r.id && (
                  <div className="mt-3 border-t border-stone-100 pt-3 anim-slide">
                    <Textarea rows={3} value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Thanks for the kind words…" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Btn size="sm" variant="ghost" onClick={() => { setRespondingTo(null); setResponseText(''); }}>Cancel</Btn>
                      <Btn size="sm" variant="gold" icon={Send}
                        onClick={() => {
                          setReviews(arr => arr.map(x => x.id === r.id ? { ...x, response: responseText, responded: true } : x));
                          setRespondingTo(null);
                          setResponseText('');
                          flash('Response posted to Google');
                        }}>Post Response</Btn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auto-toggles */}
        <div className="pt-5 border-t border-stone-100 space-y-3">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Automation</div>
          <Toggle checked={settings.marketing.autoReviewRequest}
            onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoReviewRequest: v } }))}
            label="Auto-send review request 3 days after sale"
            description="Buyer receives a friendly email with a one-tap review link" />
          <Toggle checked={settings.marketing.reviewReminderText}
            onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, reviewReminderText: v } }))}
            label="Send reminder text 5 days after sale if no review"
            description="Soft nudge — proven to lift response rate by 38%" />
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Social Media Automation</h2>
          <span className="text-[10px] smallcaps font-semibold ml-2 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Coming Soon</span>
        </div>
        <p className="text-sm text-stone-500 mb-5">Post every new arrival to your social channels — automatically.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <Facebook className="w-5 h-5 mt-0.5" style={{ color: '#1877F2' }} />
            <div className="flex-1">
              <Toggle checked={settings.marketing.autoPostFacebook}
                onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoPostFacebook: v } }))}
                label="Auto-post new inventory to Facebook"
                description="Hero image + price + key specs, posted to your business page" />
            </div>
          </div>
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <Instagram className="w-5 h-5 mt-0.5" style={{ color: '#E1306C' }} />
            <div className="flex-1">
              <Toggle checked={settings.marketing.autoPostInstagram}
                onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoPostInstagram: v } }))}
                label="Auto-post new inventory to Instagram"
                description="Carousel post with all photos + first-comment specs" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ====================== SETTINGS TAB ============================= */

