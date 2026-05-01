'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function usePricingAnalysis(dealerId) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    if (!dealerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dealer/${encodeURIComponent(dealerId)}/ai/pricing`,
        { headers: { Accept: 'application/json' } },
      );
      if (!res.ok) throw new Error(`Pricing ${res.status}`);
      const data = await res.json();
      if (!aliveRef.current) return;
      if (!data?.ok) throw new Error(data?.error || 'Pricing API returned ok:false');
      setReport(data.report || null);
      setError(null);
    } catch (e) {
      if (!aliveRef.current) return;
      setReport(null);
      setError(e.message || 'Failed to load pricing analysis');
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [dealerId]);

  useEffect(() => {
    aliveRef.current = true;
    load();
    return () => {
      aliveRef.current = false;
    };
  }, [load]);

  return { report, loading, error, refresh: load };
}

export default usePricingAnalysis;
