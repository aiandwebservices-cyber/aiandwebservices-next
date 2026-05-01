'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STAGES = ['4h', '24h', 'day3', 'day7'];

function emptySequence() {
  const out = {};
  for (const s of STAGES) out[s] = null;
  return out;
}

export function useFollowUpPreview(dealerId, leadId, options = {}) {
  const { autoFetch = true } = options;

  const [sequence, setSequence] = useState(emptySequence());
  const [lead, setLead] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    if (!dealerId || !leadId) return;
    setLoading(true);
    setError(null);
    try {
      const url = `/api/dealer/${encodeURIComponent(dealerId)}/ai/followup?leadId=${encodeURIComponent(leadId)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Follow-up preview ${res.status}`);
      const data = await res.json();
      if (!aliveRef.current) return;
      if (!data?.ok) throw new Error(data?.error || 'Preview API returned ok:false');
      setSequence(data.sequence || emptySequence());
      setLead(data.lead || null);
      setVehicle(data.vehicle || null);
      setSimilar(Array.isArray(data.similar) ? data.similar : []);
    } catch (e) {
      if (!aliveRef.current) return;
      setError(e.message || 'Failed to load follow-up preview');
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [dealerId, leadId]);

  const send = useCallback(
    async ({ stage, channel, message, subject }) => {
      if (!dealerId || !leadId) {
        throw new Error('dealerId and leadId are required');
      }
      const res = await fetch(
        `/api/dealer/${encodeURIComponent(dealerId)}/ai/followup/send`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, stage, channel, message, subject }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Send failed (${res.status})`);
      }
      return data;
    },
    [dealerId, leadId]
  );

  const updateStage = useCallback((stage, patch) => {
    setSequence((prev) => ({
      ...prev,
      [stage]: { ...(prev[stage] || {}), ...patch },
    }));
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (autoFetch) load();
    return () => {
      aliveRef.current = false;
    };
  }, [load, autoFetch]);

  return {
    sequence,
    lead,
    vehicle,
    similar,
    loading,
    error,
    refresh: load,
    send,
    updateStage,
  };
}

export default useFollowUpPreview;
