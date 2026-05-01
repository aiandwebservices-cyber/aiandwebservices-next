'use client';
import { useState, useCallback } from 'react';
import { storage } from './useStorage';

/**
 * NHTSA vPIC VIN decoder hook (free, no API key).
 *
 * Endpoint: https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{VIN}?format=json
 *
 * Returns { decode, decoding, error, summary }.
 *  - decode(vin)    → kicks off the fetch, returns the parsed result on success
 *  - decoding       → boolean while fetch is in flight
 *  - error          → string if last attempt failed
 *  - summary        → list of fields populated on the most recent successful decode
 *
 * Result shape (on success):
 *   { vin, year, make, model, trim, bodyStyle, engine, transmission, drivetrain, fuelType }
 *
 * Cached per-VIN in window.storage with a 30-day TTL.
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

export const validVin = (v) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(String(v || '').trim());

const mapBody = (s) => {
  const x = String(s || '').toLowerCase();
  if (/sedan|saloon/.test(x)) return 'Sedan';
  if (/suv|sport utility|crossover/.test(x)) return 'SUV';
  if (/pickup|truck/.test(x)) return 'Truck';
  if (/coupe/.test(x)) return 'Coupe';
  if (/van|minivan/.test(x)) return 'Van';
  if (/convertible|roadster/.test(x)) return 'Convertible';
  if (/hatchback/.test(x)) return 'Hatchback';
  if (/wagon/.test(x)) return 'Wagon';
  return null;
};
const mapTrans = (s) => {
  const x = String(s || '').toLowerCase();
  if (/cvt|continuously variable/.test(x)) return 'CVT';
  if (/manual/.test(x)) return 'Manual';
  if (/auto/.test(x)) return 'Automatic';
  return null;
};
const mapDrive = (s) => {
  const x = String(s || '').toUpperCase();
  if (/4WD|4X4/.test(x)) return '4WD';
  if (/AWD/.test(x)) return 'AWD';
  if (/FWD|FRONT/.test(x)) return 'FWD';
  if (/RWD|REAR/.test(x)) return 'RWD';
  return null;
};
const mapFuel = (s) => {
  const x = String(s || '').toLowerCase();
  if (/electric/.test(x) && !/hybrid/.test(x)) return 'Electric';
  if (/plug-in|phev/.test(x)) return 'PHEV';
  if (/hybrid/.test(x)) return 'Hybrid';
  if (/diesel/.test(x)) return 'Diesel';
  if (/gas|gasoline|petrol/.test(x)) return 'Gas';
  return null;
};

export function useVinDecoder() {
  const [decoding, setDecoding] = useState(false);
  const [error, setError]       = useState(null);
  const [summary, setSummary]   = useState(null);

  const decode = useCallback(async (vinInput) => {
    const vin = String(vinInput || '').trim().toUpperCase();
    setError(null);
    setSummary(null);
    if (!validVin(vin)) {
      setError('VIN must be 17 alphanumeric chars (no I, O, Q)');
      return null;
    }
    const cacheKey = `nhtsa-vin-${vin}`;
    const cached = await storage.get(cacheKey, null);
    if (cached && cached.ts && Date.now() - cached.ts < TTL_MS) {
      setSummary({ count: cached.fieldList?.length || 0, fields: cached.fieldList || [] });
      return cached.data;
    }
    setDecoding(true);
    try {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
      const json = await fetchWithTimeout(url);
      const r = (json.Results || [])[0] || {};
      const out = {
        vin,
        year:        r.ModelYear ? Number(r.ModelYear) : null,
        make:        r.Make || null,
        model:       r.Model || null,
        trim:        r.Trim || r.Series || null,
        bodyStyle:   mapBody(r.BodyClass),
        engine:      [r.DisplacementL && `${r.DisplacementL}L`, r.FuelTypePrimary, r.EngineConfiguration, r.EngineCylinders && `${r.EngineCylinders}cyl`]
                       .filter(Boolean).join(' ') || null,
        transmission: mapTrans(r.TransmissionStyle),
        drivetrain:  mapDrive(r.DriveType),
        fuelType:    mapFuel(r.FuelTypePrimary),
      };
      const fieldList = Object.entries(out).filter(([k, v]) => k !== 'vin' && v != null && v !== '').map(([k]) => k);
      if (!out.make) {
        setError('VIN not found — enter details manually');
        return null;
      }
      await storage.set(cacheKey, { ts: Date.now(), data: out, fieldList });
      setSummary({ count: fieldList.length, fields: fieldList });
      return out;
    } catch (e) {
      setError('VIN decoder unavailable — enter details manually');
      return null;
    } finally {
      setDecoding(false);
    }
  }, []);

  return { decode, decoding, error, summary };
}
