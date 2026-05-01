'use client';
import { useEffect, useState } from 'react';
import { storage } from './useStorage';

/**
 * fueleconomy.gov hook (free, no API key).
 *
 * Two-step flow:
 *   1. /vehicle/menu/options?year=&make=&model= → list of vehicle IDs (trim variants)
 *   2. /ympg/shared/ympgVehicle/{id}            → MPG city/highway for that ID
 *
 * Returns { mpgCity, mpgHwy, loading, unavailable }.
 *  - When the API returns no results (EVs, very old cars), `unavailable` is true.
 */

const TIMEOUT = 8000;

const fetchWithTimeout = async (url, ms = TIMEOUT, asJson = true) => {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: asJson ? { Accept: 'application/json' } : {},
    });
    return asJson ? await res.json() : await res.text();
  } finally {
    clearTimeout(id);
  }
};

export function useFuelEconomy({ year, make, model }) {
  const [mpgCity, setMpgCity] = useState(null);
  const [mpgHwy,  setMpgHwy]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!year || !make || !model) {
      setMpgCity(null); setMpgHwy(null); setUnavailable(false);
      return;
    }
    let cancel = false;
    (async () => {
      const cacheKey = `mpg-${year}-${make}-${model}`.toLowerCase();
      const cached = await storage.get(cacheKey, null);
      if (cached) {
        if (cancel) return;
        setMpgCity(cached.city);
        setMpgHwy(cached.hwy);
        setUnavailable(cached.unavailable || false);
        return;
      }
      setLoading(true);
      try {
        const opts = await fetchWithTimeout(
          `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
        );
        if (cancel) return;
        const list = Array.isArray(opts?.menuItem) ? opts.menuItem : (opts?.menuItem ? [opts.menuItem] : []);
        if (list.length === 0) {
          setUnavailable(true);
          await storage.set(cacheKey, { city: null, hwy: null, unavailable: true });
          return;
        }
        const id = list[0]?.value;
        if (!id) { setUnavailable(true); return; }
        const veh = await fetchWithTimeout(`https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${encodeURIComponent(id)}`);
        if (cancel) return;
        const city = veh?.city ? Number(veh.city) : null;
        const hwy  = veh?.hwy  ? Number(veh.hwy)  : null;
        setMpgCity(city);
        setMpgHwy(hwy);
        if (city == null && hwy == null) setUnavailable(true);
        await storage.set(cacheKey, { city, hwy, unavailable: city == null && hwy == null });
      } catch {
        if (!cancel) setUnavailable(true);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [year, make, model]);

  return { mpgCity, mpgHwy, loading, unavailable };
}
