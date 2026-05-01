'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, Car, Users, Calculator, Calendar } from 'lucide-react';
import { storage } from './_internals';

/**
 * Command palette (Cmd+K) — global search across vehicles, leads, deals,
 * appointments. Click result jumps to the relevant tab.
 *
 * Recent searches persisted to `${slug}-recent-searches` so each dealer has
 * its own search history.
 */
export function CommandPalette({
  onClose, slug,
  inventory, leads, deals, appointments,
  onJump,
}) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);
  const KEY = (k) => `${slug}-${k}`;

  useEffect(() => {
    storage.get(KEY('recent-searches'), []).then(r => setRecent(Array.isArray(r) ? r : []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      vehicles: inventory.filter(v => [v.year, v.make, v.model, v.trim, v.vin, v.stockNumber].join(' ').toLowerCase().includes(q)).slice(0, 5),
      leads:    leads.filter(l => [l.name, l.email, l.phone].join(' ').toLowerCase().includes(q)).slice(0, 5),
      deals:    deals.filter(d => (d.customerName || '').toLowerCase().includes(q)).slice(0, 5),
      appts:    appointments.filter(a => (a.customerName || '').toLowerCase().includes(q)).slice(0, 5)
    };
  }, [query, inventory, leads, deals, appointments]);

  const recordSearch = (q) => {
    if (!q || !q.trim()) return;
    const next = [q, ...recent.filter(r => r !== q)].slice(0, 5);
    setRecent(next);
    storage.set(KEY('recent-searches'), next);
  };

  const Section = ({ icon: Icon, label, items, render }) => items && items.length > 0 ? (
    <div className="py-1">
      <div className="px-4 py-1.5 text-[10px] font-semibold smallcaps flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
        <Icon className="w-3 h-3" /> {label}
      </div>
      {items.map(render)}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 px-4 anim-fade no-print" onClick={onClose}>
      <div className="rounded-lg shadow-2xl max-w-xl w-full max-h-[70vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles, leads, deals, appointments…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Esc</kbd>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!query.trim() && recent.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>Recent</div>
              {recent.map(r => (
                <button key={r} onClick={() => setQuery(r)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 transition">{r}</button>
              ))}
            </div>
          )}
          {!query.trim() && recent.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Start typing to search across the admin
            </div>
          )}
          {results && (
            <>
              <Section icon={Car} label="Vehicles" items={results.vehicles} render={v => (
                <button key={'v' + v.id} onClick={() => { recordSearch(query); onJump('inventory'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{v.year} {v.make} {v.model}</div>
                  <div className="text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>· {v.stockNumber}</div>
                </button>
              )} />
              <Section icon={Users} label="Leads" items={results.leads} render={l => (
                <button key={'l' + l.id} onClick={() => { recordSearch(query); onJump('leads'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {l.email}</div>
                </button>
              )} />
              <Section icon={Calculator} label="Deals" items={results.deals} render={d => (
                <button key={'d' + d.id} onClick={() => { recordSearch(query); onJump('deals'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{d.customerName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {d.status}</div>
                </button>
              )} />
              <Section icon={Calendar} label="Appointments" items={results.appts} render={a => (
                <button key={'a' + a.id} onClick={() => { recordSearch(query); onJump('appointments'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{a.customerName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {a.serviceType}</div>
                </button>
              )} />
              {results.vehicles.length + results.leads.length + results.deals.length + results.appts.length === 0 && (
                <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No results for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
