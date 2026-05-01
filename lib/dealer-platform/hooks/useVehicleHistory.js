'use client';
import { useEffect, useState } from 'react';

/**
 * useVehicleHistory — fetches NHTSA complaints + recalls aggregated by the
 * /api/dealer/{dealerId}/vehicle-history route. Returns null fields until
 * year/make/model are all set.
 */
export function useVehicleHistory(dealerId, make, model, year) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dealerId || !make || !model || !year) {
      setData(null); setLoading(false); setError(null);
      return;
    }
    let cancel = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const url = `/api/dealer/${encodeURIComponent(dealerId)}/vehicle-history`
          + `?make=${encodeURIComponent(make)}`
          + `&model=${encodeURIComponent(model)}`
          + `&year=${encodeURIComponent(year)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (cancel) return;
        if (!json.ok) {
          setError(json.error || 'history lookup failed');
          setData(null);
        } else {
          setData(json);
        }
      } catch (e) {
        if (!cancel) { setError(e.message || 'network error'); setData(null); }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [dealerId, make, model, year]);

  return {
    complaints: data?.complaints || null,
    recalls:    data?.recalls    || null,
    riskLevel:  data?.riskLevel  || null,
    loading,
    error,
  };
}

export default useVehicleHistory;
