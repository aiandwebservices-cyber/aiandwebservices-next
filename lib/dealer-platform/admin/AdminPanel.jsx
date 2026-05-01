'use client';
/**
 * AdminPanel — thin shell that wires together all extracted tab components.
 *
 * Responsibilities:
 *   1. Provide AdminConfigContext to all descendants
 *   2. Manage the shared admin state (inventory, leads, deals, sold, ...)
 *      hydrated from window.storage with per-dealer namespaced keys
 *   3. Provide cross-cutting helpers (flash, addActivity, mutations) and
 *      pass them as props to tab components
 *   4. Render the chrome (PWA banner, TopBar, Sidebar, Toast)
 *   5. Switch between active tab components
 *
 * Per-dealer parametrization: every storage key is namespaced by
 * `config.dealerSlug` so two dealers running on the same origin keep
 * isolated state.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Smartphone, X } from 'lucide-react';
import { defaultConfig } from '@/lib/dealer-platform/config/default-config';
import { THEMES } from '@/lib/dealer-platform/theme/colors';

import { AdminConfigContext } from './AdminConfigContext';
import {
  storage, setStorageErrorHandler, buildSeedSettings,
  TODAY, isoAt, newId, GOLD,
  FontStyles, Skeleton, TEAM_MEMBERS,
} from './_internals';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { HelpPanel } from './HelpPanel';
import { CommandPalette } from './CommandPalette';

import { DashboardTab } from './DashboardTab';
import { InventoryTab } from './InventoryTab';
import { VehicleFormTab } from './VehicleForm';
import { LeadsTab } from './LeadsTab';
import { DealsTab } from './DealBuilderTab';
import { SoldTab } from './SoldTab';
import { MarketingTab } from './MarketingTab';
import { SettingsTab } from './SettingsTab';
import { AppointmentsTab } from './ServiceTab';
import { PerformanceTab } from './PerformanceTab';
import { TasksTab } from './TasksTab';
import { CustomersTab } from './CustomersTab';
import { ReportingTab } from './ReportingTab';

import { SEED_VEHICLES as SEED_INVENTORY } from '@/lib/dealer-platform/data/seed-vehicles';
import { SEED_LEADS } from '@/lib/dealer-platform/data/seed-leads';
import { SEED_DEALS } from '@/lib/dealer-platform/data/seed-deals';
import { SEED_SOLD } from '@/lib/dealer-platform/data/seed-sold';
import { SEED_APPOINTMENTS } from '@/lib/dealer-platform/data/seed-appointments';
import { SEED_TASKS, SEED_RESERVATIONS, SEED_MESSAGES } from '@/lib/dealer-platform/data/seed-tasks';
import { SEED_REVIEWS } from '@/lib/dealer-platform/data/seed-reviews';
import { SEED_ACTIVITY } from '@/lib/dealer-platform/data/seed-activity';

export function AdminPanel({ config: dealerConfig = {} }) {
  const config = { ...defaultConfig, ...dealerConfig };
  const slug = config.dealerSlug || 'demo';
  return (
    <AdminConfigContext.Provider value={config}>
      <AdminPanelBody config={config} slug={slug} />
    </AdminConfigContext.Provider>
  );
}

export default AdminPanel;

function AdminPanelBody({ config, slug }) {
  // Per-dealer storage key namespacing
  const KEY = (k) => `${slug}-${k}`;

  /* ---------- chrome state ---------- */
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState('light');
  const [pwaDismissed, setPwaDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  /* ---------- domain state (hydrated from storage on mount) ---------- */
  const [inventory, setInventory]       = useState(SEED_INVENTORY);
  const [leads, setLeads]               = useState(SEED_LEADS);
  const [deals, setDeals]               = useState(SEED_DEALS);
  const [sold, setSold]                 = useState(SEED_SOLD);
  const [settings, setSettings]         = useState(() => buildSeedSettings(config));
  const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);
  const [reservations, setReservations] = useState(SEED_RESERVATIONS);
  const [reviews, setReviews]           = useState(SEED_REVIEWS);
  const [activity, setActivity]         = useState(SEED_ACTIVITY);
  const [tasks, setTasks]               = useState(SEED_TASKS);
  const [messages, setMessages]         = useState(SEED_MESSAGES);

  /* ---------- load on mount ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [inv, lds, dls, sld, st, apts, rsvs, rvws, act, tks, msgs] = await Promise.all([
        storage.get(KEY('inventory'), null),
        storage.get(KEY('leads'), null),
        storage.get(KEY('deals'), null),
        storage.get(KEY('sold'), null),
        storage.get(KEY('settings'), null),
        storage.get(KEY('appointments'), null),
        storage.get(KEY('reservations'), null),
        storage.get(KEY('reviews'), null),
        storage.get(KEY('activity'), null),
        storage.get(KEY('tasks'), null),
        storage.get(KEY('messages'), null),
      ]);
      if (!mounted) return;
      if (inv) setInventory(inv); else await storage.set(KEY('inventory'), SEED_INVENTORY);
      if (lds) setLeads(lds); else await storage.set(KEY('leads'), SEED_LEADS);
      if (dls) setDeals(dls); else await storage.set(KEY('deals'), SEED_DEALS);
      if (sld) setSold(sld); else await storage.set(KEY('sold'), SEED_SOLD);
      if (st) { setSettings(st); if (st.adminTheme === 'dark' || st.adminTheme === 'light') setAdminTheme(st.adminTheme); }
      else { const seed = buildSeedSettings(config); setSettings(seed); await storage.set(KEY('settings'), seed); }
      if (apts) setAppointments(apts); else await storage.set(KEY('appointments'), SEED_APPOINTMENTS);
      if (rsvs) setReservations(rsvs); else await storage.set(KEY('reservations'), SEED_RESERVATIONS);
      if (rvws) setReviews(rvws); else await storage.set(KEY('reviews'), SEED_REVIEWS);
      if (act) setActivity(act); else await storage.set(KEY('activity'), SEED_ACTIVITY);
      if (tks) setTasks(tks); else await storage.set(KEY('tasks'), SEED_TASKS);
      if (msgs) setMessages(msgs); else await storage.set(KEY('messages'), SEED_MESSAGES);
      setLoaded(true);
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- save effects ---------- */
  useEffect(() => { if (loaded) storage.set(KEY('inventory'), inventory); }, [inventory, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('leads'), leads); }, [leads, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('deals'), deals); }, [deals, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('sold'), sold); }, [sold, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('settings'), settings); }, [settings, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('appointments'), appointments); }, [appointments, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('reservations'), reservations); }, [reservations, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('reviews'), reviews); }, [reviews, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('activity'), activity); }, [activity, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('tasks'), tasks); }, [tasks, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(KEY('messages'), messages); }, [messages, loaded]); // eslint-disable-line

  /* ---------- toast / activity / theme ---------- */
  const flash = useCallback((msg, opts = {}) => {
    const cfg = typeof opts === 'string' ? { tone: opts } : opts;
    const { tone = 'default', duration, undo } = cfg;
    const ms = duration ?? (tone === 'destructive' ? 5000 : 2400);
    const id = Date.now() + Math.random();
    setToast({ msg, tone, undo, id });
    setTimeout(() => setToast(t => (t?.id === id ? null : t)), ms);
  }, []);

  const addActivity = useCallback((entry) => {
    setActivity(arr => [{
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      when: new Date().toISOString(),
      ...entry,
    }, ...arr].slice(0, 200));
  }, []);

  useEffect(() => {
    setStorageErrorHandler((err, key) => {
      flash(`Failed to save (${key}) — changes may not persist`, { tone: 'error', duration: 5000 });
    });
    return () => setStorageErrorHandler(null);
  }, [flash]);

  const toggleTheme = useCallback(() => {
    setAdminTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      setSettings(s => ({ ...s, adminTheme: next }));
      return next;
    });
  }, []);

  // Cmd/Ctrl+K opens the global search palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- mutations ---------- */
  const updateVehicle = (id, patch) => setInventory(arr => arr.map(v => v.id === id ? { ...v, ...patch } : v));
  const removeVehicle = (id) => setInventory(arr => arr.filter(v => v.id !== id));
  const addVehicle = (v) => setInventory(arr => [{ ...v, id: newId('v') }, ...arr]);

  const markSoldVehicle = (id, buyerName, finalSalePrice) => {
    const v = inventory.find(x => x.id === id);
    if (!v) return;
    const sale = {
      id: newId('s'),
      year: v.year, make: v.make, model: v.model, trim: v.trim,
      saleDate: new Date(TODAY).toISOString().slice(0, 10),
      listedPrice: v.listPrice,
      salePrice: finalSalePrice ?? (v.salePrice ?? v.listPrice),
      cost: v.cost,
      daysOnLotAtSale: v.daysOnLot,
      buyerName: buyerName || 'Walk-in Buyer',
      buyerEmail: '', buyerPhone: '',
      review: { status: 'not-sent', stars: null, method: 'email', sentAt: null }
    };
    setSold(arr => [sale, ...arr]);
    removeVehicle(id);
    addActivity({
      type: 'sold',
      title: `${v.year} ${v.make} ${v.model} marked Sold to ${sale.buyerName}`,
      sub: `Sale price: $${(sale.salePrice || 0).toLocaleString()}`,
      refTab: 'sold',
    });
    flash('Vehicle marked as sold');
  };

  const restoreSold = (id) => {
    const s = sold.find(x => x.id === id);
    if (!s) return;
    const v = {
      id: newId('v'),
      year: s.year, make: s.make, model: s.model, trim: s.trim, bodyStyle: 'SUV',
      cost: s.cost, listPrice: s.listedPrice, salePrice: null, mileage: 0,
      exteriorColor: 'Gray', interiorColor: 'Black', engine: '', transmission: 'Automatic',
      drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 0, mpgHwy: 0, vin: '',
      stockNumber: 'R-' + Math.floor(Math.random() * 9999), status: 'Available',
      daysOnLot: 0, views: 0,
      history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false, noOpenRecalls: true },
      description: '', photos: [], dateAdded: new Date(TODAY).toISOString(),
    };
    setInventory(arr => [v, ...arr]);
    setSold(arr => arr.filter(x => x.id !== id));
    flash('Sold vehicle restored to inventory');
  };

  /* ---------- reservation helpers ---------- */
  const releaseReservation = (id) => {
    const released = reservations.find(r => r.id === id);
    setReservations(arr => arr.filter(r => r.id !== id));
    flash('Reservation released', {
      tone: 'destructive',
      undo: () => released && setReservations(arr => [released, ...arr]),
    });
  };
  const extendReservation = (id) => {
    setReservations(arr => arr.map(r => r.id === id
      ? { ...r, expiresAt: new Date(new Date(r.expiresAt).getTime() + 24 * 3600 * 1000).toISOString() }
      : r));
    flash('Hold extended by 24 hours');
  };
  const confirmReservation = (id) => {
    const r = reservations.find(x => x.id === id);
    if (!r) return;
    setLeads(arr => arr.map(l => l.id === r.leadId ? { ...l, status: 'Appointment Set' } : l));
    setReservations(arr => arr.filter(x => x.id !== id));
    flash(`${r.customerName} confirmed — moved to Appointments Set`);
  };

  /* ---------- reservation auto-expire (every 30s) ---------- */
  useEffect(() => {
    if (!loaded) return;
    const tick = () => {
      const now = Date.now();
      const expired = reservations.filter(r => new Date(r.expiresAt).getTime() < now);
      if (expired.length > 0) {
        setReservations(arr => arr.filter(r => new Date(r.expiresAt).getTime() >= now));
        flash(`${expired.length} reservation${expired.length === 1 ? '' : 's'} expired — vehicles released`);
      }
    };
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [reservations, loaded, flash]);

  /* ---------- derived ---------- */
  const unreadLeads     = useMemo(() => leads.filter(l => !l.read).length, [leads]);
  const featuredCount   = useMemo(() => inventory.filter(v => v.status === 'Featured').length, [inventory]);
  const onSaleCount     = useMemo(() => inventory.filter(v => v.status === 'On Sale' || v.status === 'Price Drop').length, [inventory]);
  const soldThisMonth   = useMemo(() => {
    const m = TODAY.getMonth(), y = TODAY.getFullYear();
    return sold.filter(s => { const d = new Date(s.saleDate); return d.getMonth() === m && d.getFullYear() === y; }).length;
  }, [sold]);
  const pendingAppts    = useMemo(() => appointments.filter(a => a.status === 'Pending').length, [appointments]);
  const reservationCount = reservations.length;
  const taskStats       = useMemo(() => {
    const today0 = new Date(TODAY); today0.setUTCHours(0, 0, 0, 0);
    const today1 = new Date(today0); today1.setUTCDate(today1.getUTCDate() + 1);
    const open    = tasks.filter(t => t.status !== 'Completed');
    const overdue = open.filter(t => new Date(t.dueAt) < today0);
    const dueToday = open.filter(t => { const d = new Date(t.dueAt); return d >= today0 && d < today1; });
    return { overdue: overdue.length, dueToday: dueToday.length, open: open.length };
  }, [tasks]);

  const navBadges = {
    leads: unreadLeads,
    tasks: taskStats.overdue,
    appointments: pendingAppts,
  };

  /* ---------- render ---------- */
  return (
    <div className="font-ui min-h-screen transition-colors duration-200"
      style={{ ...THEMES[adminTheme], backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <FontStyles />

      {!pwaDismissed && (
        <div className="md:hidden no-print" style={{ background: `linear-gradient(to right, ${GOLD}22, ${GOLD}11)`, borderBottom: `1px solid ${GOLD}55` }}>
          <div className="px-4 py-2.5 flex items-center gap-3">
            <Smartphone className="w-5 h-5 shrink-0" style={{ color: '#7A5A0F' }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold leading-tight">Install {config.dealerName} Dashboard</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Add to home screen — works offline, manage your lot from anywhere</div>
            </div>
            <button onClick={() => { flash('Add to Home Screen — use your browser menu'); setPwaDismissed(true); }}
              className="text-[11px] font-bold px-3 py-1.5 rounded shrink-0"
              style={{ backgroundColor: GOLD, color: '#1A1612' }}>Install</button>
            <button onClick={() => setPwaDismissed(true)} aria-label="Dismiss"
              className="p-1 text-stone-500 hover:text-stone-900 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <TopBar
        config={config} settings={settings}
        setSidebarOpen={setSidebarOpen}
        searchOpen={searchOpen} setSearchOpen={setSearchOpen}
        adminTheme={adminTheme} toggleTheme={toggleTheme}
        helpOpen={helpOpen} setHelpOpen={setHelpOpen}
        notifOpen={notifOpen} setNotifOpen={setNotifOpen}
        unreadLeads={unreadLeads} reservationCount={reservationCount}
        leads={leads} setLeads={setLeads}
        reservations={reservations} appointments={appointments}
        setActiveTab={setActiveTab} flash={flash}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          navBadges={navBadges}
        />

        <main className="flex-1 min-w-0">
          {!loaded ? (
            <div className="p-6 lg:p-8"><Skeleton rows={6} /></div>
          ) : (
            <div key={activeTab} className="anim-fade">
              {activeTab === 'dashboard' && <DashboardTab
                inventory={inventory} leads={leads} sold={sold} settings={settings}
                setSettings={setSettings} updateVehicle={updateVehicle}
                reservations={reservations}
                onConfirmReservation={confirmReservation}
                onExtendReservation={extendReservation}
                onReleaseReservation={releaseReservation}
                onAdd={() => { setEditingVehicleId(null); setActiveTab('addVehicle'); }}
                onEdit={(id) => { setEditingVehicleId(id); setActiveTab('addVehicle'); }}
                soldThisMonth={soldThisMonth} featuredCount={featuredCount}
                onSaleCount={onSaleCount} unreadLeads={unreadLeads}
                reservationCount={reservationCount}
                flash={flash}
                onOpenLeads={() => setActiveTab('leads')}
                activity={activity}
                onJump={(tab) => setActiveTab(tab)}
                taskStats={taskStats}
              />}
              {activeTab === 'inventory' && <InventoryTab
                inventory={inventory} setInventory={setInventory} updateVehicle={updateVehicle}
                removeVehicle={removeVehicle} markSold={markSoldVehicle}
                reservations={reservations} onReleaseReservation={releaseReservation}
                onEdit={(id) => { setEditingVehicleId(id); setActiveTab('addVehicle'); }}
                onAdd={() => { setEditingVehicleId(null); setActiveTab('addVehicle'); }}
                flash={flash}
                settings={settings} setSettings={setSettings}
              />}
              {activeTab === 'addVehicle' && <VehicleFormTab
                vehicle={editingVehicleId ? inventory.find(v => v.id === editingVehicleId) : null}
                flash={flash}
                onSave={(v, addAnother) => {
                  if (editingVehicleId) {
                    updateVehicle(editingVehicleId, v);
                    flash('Vehicle updated');
                    if (!addAnother) { setEditingVehicleId(null); setActiveTab('inventory'); }
                  } else {
                    addVehicle(v);
                    flash('Vehicle added');
                    if (!addAnother) setActiveTab('inventory');
                  }
                  if (addAnother) setEditingVehicleId(null);
                }}
                onCancel={() => { setEditingVehicleId(null); setActiveTab('inventory'); }}
              />}
              {activeTab === 'leads' && <LeadsTab
                leads={leads} setLeads={setLeads} inventory={inventory}
                settings={settings} setSettings={setSettings}
                onConvertToDeal={(lead) => {
                  const veh = inventory.find(v => v.id === lead.vehicleId);
                  const deal = {
                    id: newId('d'), leadId: lead.id, customerName: lead.name,
                    email: lead.email, phone: lead.phone,
                    vehicleId: lead.vehicleId, vehicleLabel: lead.vehicleLabel,
                    listPrice: veh?.listPrice || 0, salePrice: veh?.salePrice || veh?.listPrice || 0,
                    trade: lead.tradeInfo
                      ? { ...lead.tradeInfo, value: 0 }
                      : { year: '', make: '', model: '', mileage: 0, value: 0 },
                    downPayment: 0, termMonths: 60, apr: 6.9,
                    fees: { docFee: 599, tagTitle: 350, dealerPrep: 299 },
                    status: 'New Deal', notes: '',
                    createdAt: new Date(TODAY).toISOString(),
                  };
                  setDeals(arr => [deal, ...arr]);
                  setActiveTab('deals');
                  flash('Lead converted to deal');
                }}
                flash={flash}
                messages={messages} setMessages={setMessages}
                onCreateTask={(lead) => {
                  setTasks(arr => [{
                    id: 'tk-' + Date.now(),
                    title: `Follow up with ${lead.name}`,
                    dueAt: isoAt(1, 10),
                    assignedTo: TEAM_MEMBERS[0].name,
                    relatedTo: lead.name,
                    priority: 'Medium', status: 'Open',
                    notes: `Lead from ${lead.source} on ${lead.vehicleLabel}`,
                  }, ...arr]);
                  flash('Follow-up task created for tomorrow');
                }}
              />}
              {activeTab === 'deals' && <DealsTab
                deals={deals} setDeals={setDeals} inventory={inventory}
                onMarkSold={(deal) => {
                  if (deal.vehicleId) markSoldVehicle(deal.vehicleId, deal.customerName, deal.salePrice);
                  setDeals(arr => arr.map(d => d.id === deal.id ? { ...d, status: 'Delivered' } : d));
                }}
                flash={flash}
              />}
              {activeTab === 'appointments' && <AppointmentsTab
                appointments={appointments} setAppointments={setAppointments}
                flash={flash}
              />}
              {activeTab === 'sold' && <SoldTab
                sold={sold} setSold={setSold}
                onRestore={restoreSold}
                flash={flash}
              />}
              {activeTab === 'marketing' && <MarketingTab
                inventory={inventory} setInventory={setInventory}
                settings={settings} setSettings={setSettings}
                sold={sold}
                reviews={reviews} setReviews={setReviews}
                flash={flash}
              />}
              {activeTab === 'performance' && <PerformanceTab inventory={inventory} />}
              {activeTab === 'tasks' && <TasksTab
                tasks={tasks} setTasks={setTasks} leads={leads} sold={sold} flash={flash}
              />}
              {activeTab === 'customers' && <CustomersTab
                leads={leads} sold={sold} appointments={appointments} deals={deals} flash={flash}
              />}
              {activeTab === 'reporting' && <ReportingTab
                inventory={inventory} sold={sold} leads={leads}
              />}
              {activeTab === 'settings' && <SettingsTab
                settings={settings} setSettings={setSettings} flash={flash}
              />}
            </div>
          )}
        </main>
      </div>

      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}

      {searchOpen && <CommandPalette
        slug={slug}
        onClose={() => setSearchOpen(false)}
        inventory={inventory} leads={leads} deals={deals} appointments={appointments}
        onJump={(tab) => { setActiveTab(tab); setSearchOpen(false); }}
      />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 anim-slide no-print">
          <div className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-3 text-sm text-white ${
            toast.tone === 'error' ? 'bg-red-700' : toast.tone === 'destructive' ? 'bg-stone-800' : 'bg-stone-900'
          }`}>
            <div className="w-1.5 h-1.5 rounded-full" style={{
              backgroundColor: toast.tone === 'error' ? '#FBBF24' : toast.tone === 'destructive' ? '#F87171' : GOLD,
            }} />
            <span>{toast.msg}</span>
            {toast.undo && (
              <button onClick={() => { toast.undo(); setToast(null); }}
                className="ml-2 px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-amber-200 font-bold text-xs uppercase tracking-wider transition">
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
