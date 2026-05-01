'use client';
import { useEffect, useState } from 'react';

/**
 * NHTSA recalls hook (free, no API key).
 * Endpoint: https://api.nhtsa.gov/recalls/recallsByVehicle?make=&model=&modelYear=
 *
 * Returns { recalls, loading, checked }.
 *  - recalls: array of { Component, Summary, NHTSACampaignNumber, ... }
 *  - checked: true after first successful (or empty) fetch — distinguishes
 *    "haven't asked yet" from "asked and got zero"
 */

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

export function useRecalls({ year, make, model }) {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!year || !make || !model) {
      setRecalls([]); setChecked(false); return;
    }
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        const json = await fetchWithTimeout(url);
        if (cancel) return;
        setRecalls(Array.isArray(json?.results) ? json.results : []);
        setChecked(true);
      } catch {
        if (!cancel) { setRecalls([]); setChecked(true); }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [year, make, model]);

  return { recalls, loading, checked };
}
