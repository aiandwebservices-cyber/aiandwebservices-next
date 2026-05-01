'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const cache = new Map();

const EMPTY = {
  score: null,
  tier: null,
  emoji: null,
  signals: [],
  recommendation: null,
  loading: false,
  error: null,
};

function cacheKey(dealerId, leadId) {
  return `${dealerId}::${leadId}`;
}

export function clearLeadScoreCache(dealerId, leadId) {
  if (dealerId && leadId) {
    cache.delete(cacheKey(dealerId, leadId));
  } else {
    cache.clear();
  }
}

export function useLeadScore(dealerId, leadId, options = {}) {
  const { autoFetch = true } = options;
  const aliveRef = useRef(true);

  const [state, setState] = useState(() => {
    if (!dealerId || !leadId) return EMPTY;
    return cache.get(cacheKey(dealerId, leadId)) || EMPTY;
  });

  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const runFetch = useCallback(async () => {
    if (!dealerId || !leadId) return;
    const key = cacheKey(dealerId, leadId);
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/dealer/${encodeURIComponent(dealerId)}/ai/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Score request failed');
      const next = {
        score: data.score,
        tier: data.tier,
        emoji: data.emoji,
        signals: data.topSignals || [],
        recommendation: data.recommendation,
        loading: false,
        error: null,
      };
      cache.set(key, next);
      if (aliveRef.current) setState(next);
    } catch (err) {
      if (aliveRef.current) {
        setState((s) => ({ ...s, loading: false, error: err.message || String(err) }));
      }
    }
  }, [dealerId, leadId]);

  useEffect(() => {
    if (!autoFetch || !dealerId || !leadId) return;
    const key = cacheKey(dealerId, leadId);
    if (cache.has(key)) {
      setState(cache.get(key));
      return;
    }
    runFetch();
  }, [autoFetch, dealerId, leadId, runFetch]);

  return { ...state, refresh: runFetch };
}
