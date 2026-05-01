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
  TrendingDown, BadgeCheck, Smartphone, Monitor, Sun, Moon, HelpCircle, Bookmark, Camera, Copy,
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
  const cfg = useAdminConfig();
  const slug = cfg?.dealerSlug || 'demo';
  const [respondingTo, setRespondingTo] = useState(null);
  const [feedTestResults, setFeedTestResults] = useState({}); // platform -> { loading, count, error }
  const [responseText, setResponseText] = useState('');
  const [draftRegen, setDraftRegen] = useState({});
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [reviewRequest, setReviewRequest] = useState({
    name: '', phone: '', email: '', vehicle: '', channel: 'sms',
  });
  const [feedDownloadLoading, setFeedDownloadLoading] = useState({});
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewStatsLoading, setReviewStatsLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(null);

  // ---- AI review-response drafting (client-side templates for now) ----
  const dealerDisplayName = settings.dealership?.name || cfg.dealerName || 'our team';
  const dealerResponsePhone = settings.dealership?.phone || cfg.phone || '';
  const placeId = settings.googlePlaceId || settings.marketing?.googlePlaceId || '';
  const googleReviewLink = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : '';

  const detectVehicleMention = (text) => {
    if (!text) return '';
    const t = String(text).toLowerCase();
    for (const m of MAKES) if (t.includes(m.toLowerCase())) return m;
    return '';
  };

  const draftReviewResponse = (review, regen = 0) => {
    const reviewer = (review.author || 'there').split(' ')[0];
    const vehicle = detectVehicleMention(review.text);
    const phone = dealerResponsePhone || '(305) 555-0100';
    const teamMember = TEAM_MEMBERS[0]?.name || 'our manager';
    const dn = dealerDisplayName;
    let variants;
    if (review.rating >= 5) {
      variants = [
        `Thanks ${reviewer}! We're thrilled you had a great experience with ${dn}. ${vehicle ? `Enjoy the ${vehicle}` : 'Enjoy the new ride'} and we're here for anything you need!`,
        `${reviewer}, this made our day — thank you! Your support means the world to the ${dn} team. ${vehicle ? `Drive the ${vehicle} in confidence` : 'Drive in confidence'} and reach out any time.`,
        `Thank you, ${reviewer}! We work hard to make every visit count and your kind words confirm we're on track. Welcome to the ${dn} family.`,
      ];
    } else if (review.rating === 4) {
      variants = [
        `Thanks ${reviewer}! We appreciate the feedback. If there's anything we can do to earn that fifth star next time, give us a call at ${phone}.`,
        `Glad you had a good visit, ${reviewer}. We're always looking to improve — feel free to reach us at ${phone} with any thoughts on what would have made it perfect.`,
      ];
    } else if (review.rating === 3) {
      variants = [
        `Thank you for the feedback, ${reviewer}. We're sorry the experience wasn't perfect. We'd love to make it right — please reach out to us at ${phone} and ask for ${teamMember}.`,
        `${reviewer}, we appreciate the honest feedback. We want the chance to do better — give us a call at ${phone} and ${teamMember} will personally take care of you.`,
      ];
    } else {
      variants = [
        `We sincerely apologize, ${reviewer}. This isn't the standard we hold ourselves to. Please call us at ${phone} so we can address this personally.`,
        `${reviewer}, this falls well short of what ${dn} stands for. Please reach out at ${phone} — we want the opportunity to make this right.`,
      ];
    }
    return variants[regen % variants.length];
  };

  const startAiDraft = (review) => {
    setDraftLoading(review.id);
    setTimeout(() => {
      const seed = draftRegen[review.id] || 0;
      setRespondingTo(review.id);
      setResponseText(review.response || draftReviewResponse(review, seed));
      setDraftLoading(null);
    }, 350);
  };
  const regenerateAiDraft = (review) => {
    const next = (draftRegen[review.id] || 0) + 1;
    setDraftRegen((d) => ({ ...d, [review.id]: next }));
    setResponseText(draftReviewResponse(review, next));
  };
  const copyResponse = () => {
    navigator.clipboard?.writeText(responseText).then(
      () => flash('Response copied to clipboard'),
      () => flash('Copy failed — select text manually', 'error'),
    );
  };

  const approveAiDraft = (review) => {
    navigator.clipboard?.writeText(responseText).catch(() => {});
    setReviews((arr) =>
      arr.map((x) => (x.id === review.id ? { ...x, response: responseText, responded: true } : x)),
    );
    setRespondingTo(null);
    setResponseText('');
    flash('Response copied — paste it in Google Business');
    fetch(`/api/dealer/${slug}/reviews/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId: review.id, response: responseText }),
    }).catch((e) => console.warn('[reviews/respond]', e.message));
  };

  const sendReviewRequest = async () => {
    if (!reviewRequest.name.trim()) { flash('Customer name required', 'error'); return; }
    if (!reviewRequest.vehicle.trim()) { flash('Vehicle purchased is required', 'error'); return; }
    const method = reviewRequest.channel;
    if ((method === 'sms' || method === 'both') && !reviewRequest.phone.trim()) {
      flash('Phone number required for SMS', 'error'); return;
    }
    if ((method === 'email' || method === 'both') && !reviewRequest.email.trim()) {
      flash('Email required for email send', 'error'); return;
    }
    setReviewSending(true);
    try {
      const res = await fetch(`/api/dealer/${slug}/reviews/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewRequest.name,
          vehiclePurchased: reviewRequest.vehicle,
          customerPhone: reviewRequest.phone || undefined,
          customerEmail: reviewRequest.email || undefined,
          method,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      flash(`Review request sent to ${reviewRequest.name}`);
      setReviewRequest({ name: '', phone: '', email: '', vehicle: '', channel: 'sms' });
    } catch (e) {
      flash(`Review request failed: ${e.message}`, 'error');
    } finally {
      setReviewSending(false);
    }
  };

  const testFeed = async (platform, feedPath) => {
    setFeedTestResults(r => ({ ...r, [platform]: { loading: true, count: null, error: null } }));
    try {
      const res = await fetch(feedPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const count = res.headers.get('X-Vehicle-Count')
        ?? (platform === 'cargurus' || platform === 'facebook'
          ? Math.max(0, text.split('\n').filter(Boolean).length - 1)
          : (text.match(/<vehicle>|<listing>/g) || []).length);
      setFeedTestResults(r => ({ ...r, [platform]: { loading: false, count: Number(count), error: null } }));
    } catch (e) {
      setFeedTestResults(r => ({ ...r, [platform]: { loading: false, count: null, error: e.message } }));
    }
  };

  const copyFeedUrl = (url) => {
    navigator.clipboard?.writeText(url).then(
      () => flash('Feed URL copied to clipboard'),
      () => flash('Copy failed — select URL manually', 'error'),
    );
  };

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

  const downloadFeed = async (platform, feedPath, filename) => {
    setFeedDownloadLoading((r) => ({ ...r, [platform]: true }));
    try {
      const res = await fetch(feedPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') || '';
      const match = cd.match(/filename="?([^";\n]+)"?/);
      const name = match?.[1] || filename;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
      flash(`${platform} feed downloaded`);
    } catch (e) {
      flash(`${platform} export failed: ${e.message}`, 'error');
    } finally {
      setFeedDownloadLoading((r) => ({ ...r, [platform]: false }));
    }
  };

  const downloadCraigslistFeed = async () => {
    setFeedDownloadLoading((r) => ({ ...r, craigslist: true }));
    try {
      const res = await fetch(`/api/dealer/${slug}/admin/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'craigslist' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${slug}-craigslist.txt`; a.click();
      URL.revokeObjectURL(url);
      flash('Craigslist listings downloaded');
    } catch (e) {
      flash(`Craigslist export failed: ${e.message}`, 'error');
    } finally {
      setFeedDownloadLoading((r) => ({ ...r, craigslist: false }));
    }
  };

  useEffect(() => {
    let cancelled = false;
    setReviewStatsLoading(true);
    fetch(`/api/dealer/${slug}/reviews`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled && data.ok) setReviewStats(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setReviewStatsLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
        <div className="grid md:grid-cols-3 gap-3">
          <button onClick={exportAllCSV}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group">
            <FileSpreadsheet className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">Export All to CSV</div>
            <div className="text-[11px] text-stone-500 mt-1">Standard CSV — all vehicle fields</div>
          </button>
          <button
            onClick={() => downloadFeed('carscom', `/api/dealer/${slug}/feeds/carscom`, `${slug}-carscom.xml`)}
            disabled={feedDownloadLoading.carscom}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group disabled:opacity-60 disabled:cursor-wait">
            <Globe className="w-5 h-5 mb-2" style={{ color: '#0066A1' }} />
            <div className="font-semibold text-sm">
              {feedDownloadLoading.carscom ? 'Downloading…' : 'Cars.com XML Feed'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Standard XML inventory feed</div>
          </button>
          <button
            onClick={() => downloadFeed('autotrader', `/api/dealer/${slug}/feeds/autotrader`, `${slug}-autotrader.xml`)}
            disabled={feedDownloadLoading.autotrader}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group disabled:opacity-60 disabled:cursor-wait">
            <ExternalLink className="w-5 h-5 mb-2" style={{ color: '#E25319' }} />
            <div className="font-semibold text-sm">
              {feedDownloadLoading.autotrader ? 'Downloading…' : 'AutoTrader XML Feed'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">AutoTrader-formatted XML</div>
          </button>
          <button
            onClick={() => downloadFeed('cargurus', `/api/dealer/${slug}/feeds/cargurus`, `${slug}-cargurus.csv`)}
            disabled={feedDownloadLoading.cargurus}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group disabled:opacity-60 disabled:cursor-wait">
            <FileSpreadsheet className="w-5 h-5 mb-2" style={{ color: '#0E8A5F' }} />
            <div className="font-semibold text-sm">
              {feedDownloadLoading.cargurus ? 'Downloading…' : 'CarGurus CSV Feed'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">CarGurus inventory CSV</div>
          </button>
          <button
            onClick={() => downloadFeed('facebook', `/api/dealer/${slug}/feeds/facebook`, `${slug}-facebook.csv`)}
            disabled={feedDownloadLoading.facebook}
            className="text-left p-4 border-2 rounded-md hover:bg-amber-50 transition group disabled:opacity-60 disabled:cursor-wait" style={{ borderColor: GOLD }}>
            <Facebook className="w-5 h-5 mb-2" style={{ color: '#1877F2' }} />
            <div className="font-semibold text-sm">
              {feedDownloadLoading.facebook ? 'Downloading…' : 'Facebook Marketplace'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">FB-formatted catalog CSV</div>
          </button>
          <button
            onClick={downloadCraigslistFeed}
            disabled={feedDownloadLoading.craigslist}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group disabled:opacity-60 disabled:cursor-wait">
            <FileText className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">
              {feedDownloadLoading.craigslist ? 'Downloading…' : 'Craigslist Listings'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Pre-formatted text per vehicle</div>
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
              <div className="font-display tabular text-5xl font-medium" style={{ color: '#7A5A0F' }}>
                {reviewStats ? Number(reviewStats.rating).toFixed(1) : (reviewStatsLoading ? '…' : '—')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4" fill={GOLD} stroke={GOLD} />)}
                </div>
                <div className="text-[11px] smallcaps text-stone-600">
                  {reviewStats ? reviewStats.totalReviews.toLocaleString() : '…'} total reviews
                  {reviewStats?.source === 'seed' && (
                    <span className="ml-2 normal-case font-normal text-[9px] text-stone-400">
                      demo data — connect Google Places in Settings to see real reviews
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <TrendingUp className="w-3 h-3" />
                Above market average (4.2)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <Reply className="w-3 h-3" />
                Response rate: 92%
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <Clock className="w-3 h-3" />
                Avg response: 2 hours
              </span>
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
                    <div className="text-[10px] smallcaps font-semibold mb-1 flex items-center gap-1.5" style={{ color: '#7A5A0F' }}>
                      Owner response
                      {r.responded && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px]"
                          style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                          <Check className="w-2.5 h-2.5" /> Saved
                        </span>
                      )}
                    </div>
                    {r.response}
                  </div>
                )}

                {respondingTo !== r.id && (
                  <div className="mt-3 flex items-center gap-2">
                    <Btn size="sm" variant="outlineGold"
                      icon={draftLoading === r.id ? RefreshCw : Sparkles}
                      disabled={draftLoading === r.id}
                      onClick={() => startAiDraft(r)}>
                      {draftLoading === r.id ? 'Drafting…' : (r.response ? 'Edit AI Draft' : '✨ Draft AI Response')}
                    </Btn>
                  </div>
                )}

                {respondingTo === r.id && (
                  <div className="mt-3 border-t border-stone-100 pt-3 anim-slide">
                    <div className="text-[10px] smallcaps font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#7A5A0F' }}>
                      <Sparkles className="w-3 h-3" /> AI-drafted response
                      <span className="text-stone-400 normal-case font-normal" style={{ letterSpacing: 0 }}>
                        (templated locally — review before saving)
                      </span>
                    </div>
                    <Textarea rows={4} value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Drafting…" />
                    <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
                      <button type="button" onClick={() => regenerateAiDraft(r)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900">
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                      <div className="flex gap-2">
                        <Btn size="sm" variant="ghost"
                          onClick={() => { setRespondingTo(null); setResponseText(''); }}>Cancel</Btn>
                        <Btn size="sm" variant="default" icon={Copy} onClick={copyResponse}>Copy</Btn>
                        <Btn size="sm" variant="gold" icon={Check} onClick={() => approveAiDraft(r)}>
                          Approve
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Request Review form */}
        <div className="mb-6 p-4 rounded-md border-2 bg-amber-50/40" style={{ borderColor: `${GOLD}66` }}>
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4" style={{ color: '#7A5A0F' }} />
            <div className="font-display text-base font-semibold" style={{ color: '#7A5A0F' }}>Request a Review</div>
          </div>
          <p className="text-[12px] text-stone-600 mb-3">
            Send a customer a one-tap link to leave you a Google review.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Customer name">
              <Input value={reviewRequest.name}
                onChange={(e) => setReviewRequest((r) => ({ ...r, name: e.target.value }))}
                placeholder="Jane Doe" />
            </Field>
            <Field label="Vehicle purchased">
              <Input value={reviewRequest.vehicle}
                onChange={(e) => setReviewRequest((r) => ({ ...r, vehicle: e.target.value }))}
                placeholder="2023 Lexus RX 350" />
            </Field>
            <Field label="Phone">
              <Input value={reviewRequest.phone}
                onChange={(e) => setReviewRequest((r) => ({ ...r, phone: e.target.value }))}
                placeholder="(305) 555-0123" />
            </Field>
            <Field label="Email">
              <Input type="email" value={reviewRequest.email}
                onChange={(e) => setReviewRequest((r) => ({ ...r, email: e.target.value }))}
                placeholder="customer@example.com" />
            </Field>
            <Field label="Channel" className="sm:col-span-2">
              <div className="flex bg-white rounded-md p-0.5 border border-stone-200 max-w-xs">
                {[
                  ['sms', 'SMS', Smartphone],
                  ['email', 'Email', Mail],
                  ['both', 'Both', Send],
                ].map(([key, label, Ico]) => (
                  <button key={key} type="button" onClick={() => setReviewRequest((r) => ({ ...r, channel: key }))}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded inline-flex items-center justify-center gap-1.5 ${
                      reviewRequest.channel === key ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'
                    }`}>
                    <Ico className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[11px] text-stone-500 break-all">
              {googleReviewLink ? (
                <>Review link: <span className="font-mono">{googleReviewLink}</span></>
              ) : (
                <span className="text-amber-700">Configure Google Place ID in Settings → Integrations to generate the review link.</span>
              )}
            </div>
            <Btn variant="gold" icon={reviewSending ? RefreshCw : Send}
              disabled={reviewSending} onClick={sendReviewRequest}>
              {reviewSending ? 'Sending…' : 'Send Review Request'}
            </Btn>
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
          <Toggle checked={settings.marketing?.autoDraftResponses ?? true}
            onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoDraftResponses: v } }))}
            label={<span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} /> Automatically draft AI responses for new reviews</span>}
            description="Every new review gets an auto-drafted response in pending state for one-tap approval" />
        </div>
      </Card>

      {/* Listing Syndication */}
      {(() => {
        const synd = settings.syndication || {};
        const platformDefaults = {
          carscom:     { listings: 45, lastSynced: '2 hours ago', cost: '$299/mo', label: 'Cars.com',     color: '#0066A1', feedPath: `/api/dealer/${slug}/feeds/carscom` },
          autotrader:  { listings: 45, lastSynced: '4 hours ago', cost: '$249/mo', label: 'AutoTrader',   color: '#E25319', feedPath: `/api/dealer/${slug}/feeds/autotrader` },
          cargurus:    { listings: 45, lastSynced: '1 hour ago',  cost: '$199/mo', label: 'CarGurus',     color: '#0E8A5F', extra: 'CarGurus IMV: Great Deal on 5 vehicles', feedPath: `/api/dealer/${slug}/feeds/cargurus` },
          facebook:    { listings: 40, lastSynced: '6 hours ago', cost: 'Free',    label: 'Facebook Marketplace', color: '#1877F2', extra: 'Export format: ready', feedPath: `/api/dealer/${slug}/feeds/facebook` },
          craigslist:  { listings: 20, lastSynced: 'Manual',      cost: 'Free',    label: 'Craigslist',   color: '#5C2D91', extra: 'Manual post — formatted listing copied to clipboard' },
        };
        const setSynd = (key, patch) =>
          setSettings((s) => ({
            ...s,
            syndication: { ...(s.syndication || {}), [key]: { ...(s.syndication?.[key] || {}), ...patch } },
          }));
        const setSyndRoot = (patch) =>
          setSettings((s) => ({ ...s, syndication: { ...(s.syndication || {}), ...patch } }));
        const platformOn = (key) => synd[key]?.autoSync === true;
        const platformConnected = (key) => !!settings.integrations?.[key]?.connected || platformOn(key);

        const stats = [
          ['Cars.com',   45, 12400, 23, '$299/mo'],
          ['AutoTrader', 45,  8900, 18, '$249/mo'],
          ['CarGurus',   45, 15200, 31, '$199/mo'],
          ['Facebook',   40,  4300,  8, 'Free'],
          ['Craigslist', 20,  1800,  4, 'Free'],
        ];
        const totalViews = stats.reduce((a, r) => a + r[2], 0);
        const totalLeads = stats.reduce((a, r) => a + r[3], 0);

        return (
          <>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-xl font-medium">Listing Syndication</h2>
              </div>
              <p className="text-sm text-stone-500 mb-5">
                Automatically publish your inventory to third-party marketplaces.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                {Object.entries(platformDefaults).map(([key, def]) => {
                  const connected = platformConnected(key);
                  const tr = feedTestResults[key];
                  return (
                    <div key={key} className="p-4 border border-stone-200 rounded-md flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-display font-semibold text-sm" style={{ color: def.color }}>
                          {def.label}
                        </div>
                        <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                          connected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {connected ? `🟢 Active — ${def.listings} listings synced` : '🔴 Not connected — configure in Settings'}
                        </span>
                      </div>
                      <Toggle
                        checked={platformOn(key)}
                        onChange={(v) => setSynd(key, { autoSync: v })}
                        label="Auto-sync inventory"
                      />
                      {def.extra && (
                        <div className="text-[11px] text-stone-500 italic">{def.extra}</div>
                      )}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="text-[10px] text-stone-400">Last synced: {def.lastSynced}</div>
                        <Btn size="sm" variant="ghost" icon={RefreshCw}
                          onClick={() => {
                            setSynd(key, { lastSyncedAt: new Date(TODAY).toISOString() });
                            flash(`Sync triggered: ${def.label}`);
                          }}>
                          Sync Now
                        </Btn>
                      </div>

                      {def.feedPath && (
                        <div className="mt-1 pt-3 border-t border-stone-100 flex flex-col gap-2">
                          <div className="text-[10px] text-stone-500 font-medium">
                            Feed URL — paste into your {def.label} account settings for auto-sync:
                          </div>
                          <div className="flex items-center gap-1">
                            <code className="flex-1 text-[10px] font-mono truncate bg-stone-50 border border-stone-200 rounded px-2 py-1">
                              {typeof window !== 'undefined' ? `${window.location.origin}${def.feedPath}` : def.feedPath}
                            </code>
                            <button
                              onClick={() => copyFeedUrl(typeof window !== 'undefined' ? `${window.location.origin}${def.feedPath}` : def.feedPath)}
                              title="Copy feed URL"
                              className="p-1.5 rounded hover:bg-stone-100 transition shrink-0">
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Btn size="sm" variant="ghost" icon={tr?.loading ? RefreshCw : Check}
                              onClick={() => testFeed(key, def.feedPath)}
                              disabled={tr?.loading}>
                              {tr?.loading ? 'Testing…' : 'Test Feed'}
                            </Btn>
                            <Btn size="sm" variant="default"
                              icon={feedDownloadLoading[key] ? RefreshCw : Download}
                              disabled={feedDownloadLoading[key]}
                              onClick={() => {
                                const ext = (def.feedPath.includes('carscom') || def.feedPath.includes('autotrader')) ? 'xml' : 'csv';
                                downloadFeed(key, def.feedPath, `${slug}-${key}.${ext}`);
                              }}>
                              {feedDownloadLoading[key] ? 'Downloading…' : 'Download'}
                            </Btn>
                            <a href={def.feedPath} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-100 transition">
                              <ExternalLink className="w-3 h-3" /> Preview
                            </a>
                          </div>
                          {tr && !tr.loading && (
                            <div className={`text-[11px] font-medium ${tr.error ? 'text-red-600' : 'text-emerald-700'}`}>
                              {tr.error
                                ? `✗ Feed error — ${tr.error}`
                                : `✓ Feed working — ${tr.count} vehicle${tr.count === 1 ? '' : 's'} in feed`}
                            </div>
                          )}
                        </div>
                      )}
                      {key === 'craigslist' && (
                        <div className="mt-1 pt-3 border-t border-stone-100">
                          <Btn size="sm" variant="default"
                            icon={feedDownloadLoading.craigslist ? RefreshCw : Download}
                            disabled={feedDownloadLoading.craigslist}
                            onClick={downloadCraigslistFeed}>
                            {feedDownloadLoading.craigslist ? 'Downloading…' : 'Download Listings'}
                          </Btn>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-100 grid sm:grid-cols-2 gap-4">
                <Field label="Sync Schedule">
                  <Select value={synd.schedule || 'daily-3am'}
                    onChange={(e) => setSyndRoot({ schedule: e.target.value })}>
                    <option value="hourly">Hourly</option>
                    <option value="daily-3am">Daily at 3:00 AM</option>
                    <option value="daily-6am">Daily at 6:00 AM</option>
                    <option value="twice-daily">Twice daily (3 AM / 3 PM)</option>
                    <option value="manual">Manual only</option>
                  </Select>
                </Field>
                <Field label="Exclude vehicles under N days old"
                  hint="Lets brand-new arrivals get website-only attention before going public.">
                  <Input type="number" min={0} value={synd.minDaysOnLot ?? 0}
                    onChange={(e) => setSyndRoot({ minDaysOnLot: Number(e.target.value) || 0 })} />
                </Field>
                <Toggle
                  checked={synd.includePricing ?? true}
                  onChange={(v) => setSyndRoot({ includePricing: v })}
                  label="Include pricing"
                  description="If off, listings show 'Call for price' on third-party sites." />
                <Toggle
                  checked={synd.includePhotos ?? true}
                  onChange={(v) => setSyndRoot({ includePhotos: v })}
                  label="Include photos"
                  description="Most marketplaces require photos to rank well." />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-xl font-medium">This Month&apos;s Reach</h2>
              </div>
              <p className="text-sm text-stone-500 mb-5">
                Performance across every channel where your inventory appears.
              </p>
              <div className="overflow-x-auto rounded-md border border-stone-200">
                <table className="text-sm w-full">
                  <thead className="bg-stone-50">
                    <tr className="text-[10px] smallcaps font-semibold text-stone-500">
                      <th className="px-4 py-2 text-left">Platform</th>
                      <th className="px-4 py-2 text-right">Listings</th>
                      <th className="px-4 py-2 text-right">Views</th>
                      <th className="px-4 py-2 text-right">Leads</th>
                      <th className="px-4 py-2 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 tabular">
                    {stats.map(([name, listings, views, leads, cost]) => (
                      <tr key={name}>
                        <td className="px-4 py-2 text-stone-700">{name}</td>
                        <td className="px-4 py-2 text-right">{listings}</td>
                        <td className="px-4 py-2 text-right">{views.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{leads}</td>
                        <td className="px-4 py-2 text-right">{cost}</td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50 font-semibold">
                      <td className="px-4 py-2">TOTAL</td>
                      <td className="px-4 py-2 text-right">—</td>
                      <td className="px-4 py-2 text-right">{totalViews.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{totalLeads}</td>
                      <td className="px-4 py-2 text-right">$747/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 rounded-md flex items-center justify-between gap-3"
                style={{ backgroundColor: '#FFFCF2', border: `1px solid ${GOLD}33` }}>
                <div className="text-sm">
                  <span className="font-semibold" style={{ color: '#7A5A0F' }}>Your website (LotPilot):</span>
                  <span className="ml-2 tabular">6,200 views, 12 leads — Free</span>
                </div>
                <span className="text-[11px] smallcaps font-semibold" style={{ color: GOLD }}>Owned channel</span>
              </div>
              <div className="mt-2 text-[11px] text-stone-500 italic">
                LotPilot.ai manages your listings across all platforms from one dashboard.
              </div>
            </Card>
          </>
        );
      })()}

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

