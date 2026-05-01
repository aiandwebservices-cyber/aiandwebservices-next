'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// Client-side per-vehicleId cache (lives for the page session)
const cache = new Map();

export function useMarketPricing(dealerId, vehicle) {
  const [pricing, setPricing] = useState(() => {
    if (!vehicle?.id) return null;
    return cache.get(vehicle.id) ?? null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!dealerId || !vehicle?.id) return;

    // Return cached value immediately
    const hit = cache.get(vehicle.id);
    if (hit) { setPricing(hit); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams({
        vin:          vehicle.vin        || '',
        year:         String(vehicle.year  || ''),
        make:         vehicle.make       || '',
        model:        vehicle.model      || '',
        mileage:      String(vehicle.mileage   || 0),
        listPrice:    String(vehicle.listPrice  || 0),
        zip:          vehicle.zip        || '',
        oneOwner:     String(!!vehicle.history?.oneOwner),
        cleanTitle:   String(!!vehicle.history?.cleanTitle),
        noAccidents:  String(!!vehicle.history?.noAccidents),
      });

      const res = await fetch(`/api/dealer/${dealerId}/market-pricing?${sp}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && data.pricing) {
        cache.set(vehicle.id, data.pricing);
        setPricing(data.pricing);
      }
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dealerId, vehicle?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  return { pricing, loading, error, refresh };
}
