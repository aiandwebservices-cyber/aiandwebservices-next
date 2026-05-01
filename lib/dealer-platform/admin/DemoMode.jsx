'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, RefreshCw, Eye, ExternalLink } from 'lucide-react';
import { GOLD, nhtsaDecodeVin, validVin, Btn, Field, Input } from './_internals';
import { useAdminConfig } from './AdminConfigContext';

/**
 * DemoMode — sales-pitch overlay. David enters a prospective dealer's name,
 * brand color, and 3 VINs from their lot, hits "Generate Preview", and the
 * customer site temporarily renders as if it were already that dealer's site
 * with their actual vehicles in inventory.
 *
 * Triggered by ?demo=true in the URL. Overrides nothing in storage; the
 * preview lives entirely in this component's state and is communicated to
 * the live preview tab via window.localStorage under a transient key
 * `lotpilot-demo-preview` that the customer site can opt-in to read.
 *
 * On "Exit Demo": clears the override and removes ?demo=true.
 */
const STORAGE_KEY = 'lotpilot-demo-preview';

export function DemoMode({ onExit }) {
  const config = useAdminConfig();
  const [name, setName] = useState(config.dealerName || '');
  const [color, setColor] = useState(config.colors?.primary || GOLD);
  const [vins, setVins] = useState(['', '', '']);
  const [decoded, setDecoded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const setVin = (i, v) => setVins(p => p.map((x, ix) => ix === i ? v.toUpperCase().replace(/\s/g, '') : x));

  const generate = useCallback(async () => {
    setError('');
    const valid = vins.filter(v => v && validVin(v));
    if (valid.length === 0) { setError('Enter at least one valid VIN (17 chars, no I/O/Q)'); return; }
    if (!name.trim()) { setError('Enter a dealer name'); return; }
    setLoading(true);
    try {
      const results = await Promise.all(valid.map(async (vin) => {
        const r = await nhtsaDecodeVin(vin).catch(() => null);
        if (!r) return null;
        return {
          id: `DEMO-${vin.slice(-6)}`,
          vin,
          y: Number(r.fields.year) || 2023,
          mk: r.fields.make || 'Unknown',
          md: r.fields.model || 'Unknown',
          trim: r.fields.trim || '',
          body: r.fields.bodyStyle || 'SUV',
          eng: r.fields.engine || '',
          tx: r.fields.transmission || 'Automatic',
          dr: r.fields.drivetrain || 'AWD',
          price: 35000 + Math.floor(Math.random() * 30000),
          mi:    8000  + Math.floor(Math.random() * 40000),
          ext: 'Black', int: 'Black',
          hp: 280, sec: '6.0', mpg: 25,
          img: `https://placehold.co/800x500/1A1A1A/D4AF37?text=${encodeURIComponent(`${r.fields.year || ''} ${r.fields.make || ''} ${r.fields.model || ''}`.trim())}`,
          imgs: [],
          flags: ['NO ACCIDENTS', 'ONE-OWNER'],
        };
      }));
      const fleet = results.filter(Boolean);
      if (fleet.length === 0) { setError('No VINs could be decoded — check spelling'); return; }
      setDecoded(fleet);

      const overrideConfig = {
        dealerName: name.trim(),
        colors: { ...(config.colors || {}), primary: color, accent: color },
        demoFleet: fleet,
        previewActive: true,
        previewedAt: Date.now(),
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(overrideConfig)); } catch {}
      setPreviewUrl(`/dealers/${config.dealerSlug || 'primo'}?demo-preview=1`);
    } catch (e) {
      setError(e.message || 'VIN decode failed');
    } finally {
      setLoading(false);
    }
  }, [vins, name, color, config]);

  const exit = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('demo');
      window.history.replaceState(null, '', url.toString());
    }
    onExit?.();
  };

  return (
    <>
      {/* TOP BANNER */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height: 44, background: GOLD, color: '#1A1A1A', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
        <div className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 🎭 DEMO MODE — showing preview for{' '}
          <span className="font-bold">{name || '[dealer]'}</span>
        </div>
        <button onClick={exit}
          className="text-sm font-semibold px-3 py-1 rounded transition hover:bg-black/10 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" /> Exit Demo
        </button>
      </div>

      {/* FLOATING PANEL */}
      <div className="fixed bottom-4 left-4 z-50 w-[340px] rounded-lg shadow-2xl"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-sm font-semibold">Sales Demo</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 ml-auto">60-second preview</span>
          </div>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            Enter dealer name, color, and 3 VINs from their lot. Show them their own
            inventory on a LotPilot site in under a minute.
          </p>

          <div className="space-y-3">
            <Field label="Dealer Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Auto" />
            </Field>

            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border" style={{ borderColor: '#E5E7EB' }} />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono text-xs flex-1" />
              </div>
            </Field>

            <Field label="Enter 3 VINs">
              <div className="space-y-2">
                {vins.map((v, i) => (
                  <Input key={i} value={v}
                    onChange={(e) => setVin(i, e.target.value)}
                    placeholder={`VIN ${i + 1} (17 chars)`}
                    maxLength={17}
                    className="font-mono text-xs" />
                ))}
              </div>
            </Field>

            {error && (
              <div className="text-[11px] text-red-600 bg-red-50 px-2 py-1.5 rounded">{error}</div>
            )}

            <Btn variant="gold" onClick={generate} disabled={loading}
              icon={loading ? RefreshCw : Sparkles}
              className={`w-full ${loading ? 'opacity-70' : ''}`}>
              {loading ? 'Decoding…' : 'Generate Preview'}
            </Btn>

            {decoded.length > 0 && (
              <div className="pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 font-semibold">
                  ✓ {decoded.length} vehicle{decoded.length === 1 ? '' : 's'} decoded
                </div>
                <ul className="space-y-1 mb-3">
                  {decoded.map(d => (
                    <li key={d.vin} className="text-xs text-stone-700">
                      • {d.y} {d.mk} {d.md} {d.trim}
                    </li>
                  ))}
                </ul>
                {previewUrl && (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md transition w-full justify-center"
                    style={{ background: '#1A1A1A', color: '#FFFFFF' }}>
                    <Eye className="w-3.5 h-3.5" /> Open preview site
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DemoMode;
