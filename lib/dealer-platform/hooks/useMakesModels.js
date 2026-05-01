'use client';
import { useEffect, useState } from 'react';
import { storage } from './useStorage';

/**
 * NHTSA makes/models hook (free, no API key).
 *
 * useAllMakes()      → { makes, loading, error }
 * useModelsForMake() → returns a function fetcher to load models on demand
 *
 * Caches each list in window.storage with a 30-day TTL.
 */

const TTL_MS = 30 * 24 * 3600 * 1000;
const TIMEOUT = 8000;

const fetchWithTimeout = async (url, ms = TIMEOUT) => {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    return await res.json();
  } finally {
    clearTimeout(id);
  }
};

export const POPULAR_MAKES = [
  'Toyota','Honda','Ford','Chevrolet','BMW','Mercedes-Benz','Audi','Lexus','Nissan','Hyundai',
  'Kia','Jeep','Subaru','Volkswagen','Porsche','Tesla','Ram','GMC','Cadillac','Land Rover',
];

export function useAllMakes() {
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const cached = await storage.get('nhtsa-makes', null);
      if (cached && cached.ts && Date.now() - cached.ts < TTL_MS) {
        if (!cancel) setMakes(cached.data || []);
        return;
      }
      setLoading(true);
      try {
        const json = await fetchWithTimeout('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
        if (cancel) return;
        const list = (json.Results || []).map(r => r.Make_Name).filter(Boolean).sort();
        setMakes(list);
        await storage.set('nhtsa-makes', { ts: Date.now(), data: list });
      } catch (e) {
        if (!cancel) setError('NHTSA list unavailable — using free text');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return { makes, loading, error };
}

export function useModelsForMake(make) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!make) { setModels([]); return; }
    let cancel = false;
    (async () => {
      const cacheKey = `nhtsa-models-${make}`;
      const cached = await storage.get(cacheKey, null);
      if (cached && cached.ts && Date.now() - cached.ts < TTL_MS) {
        if (!cancel) setModels(cached.data || []);
        return;
      }
      setLoading(true);
      try {
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
        const json = await fetchWithTimeout(url);
        if (cancel) return;
        const list = Array.from(new Set((json.Results || []).map(r => r.Model_Name).filter(Boolean))).sort();
        setModels(list);
        await storage.set(cacheKey, { ts: Date.now(), data: list });
      } catch (e) {
        if (!cancel) setError('Models unavailable — using free text');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [make]);

  return { models, loading, error };
}
