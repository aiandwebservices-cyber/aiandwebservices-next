'use client';
import { useEffect, useState } from 'react';

/**
 * Module-level storage error handler — components can register their own
 * (typically a toast) so quota/permission failures surface to the user.
 */
let _storageErrorHandler = null;
export const setStorageErrorHandler = (fn) => { _storageErrorHandler = fn; };

/**
 * window.storage wrapper with safe JSON serialization and error reporting.
 * Returns the raw fallback if window.storage is unavailable (SSR or Safari private mode).
 */
export const storage = {
  async get(key, fallback) {
    try {
      if (typeof window === 'undefined' || !window.storage) return fallback;
      const raw = await window.storage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  async set(key, value) {
    try {
      if (typeof window === 'undefined' || !window.storage) return;
      await window.storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (_storageErrorHandler) _storageErrorHandler(err, key);
      else if (typeof console !== 'undefined') console.error('storage.set failed', key, err);
    }
  },
};

/**
 * useStorage(key, seed)
 *
 * React state hook backed by window.storage. Hydrates from storage on mount
 * (falling back to `seed` when missing), then auto-saves any changes.
 *
 * Returns [value, setValue, { loaded }].
 *
 * Usage:
 *   const [vehicles, setVehicles, { loaded }] = useStorage('primo-inventory', SEED_INVENTORY);
 */
export function useStorage(key, seed) {
  const [value, setValue] = useState(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    storage.get(key, null).then((v) => {
      if (cancel) return;
      if (v == null) {
        // Seed missing — write the default so subsequent loads are idempotent
        storage.set(key, seed);
      } else {
        setValue(v);
      }
      setLoaded(true);
    });
    return () => { cancel = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (loaded) storage.set(key, value);
  }, [key, value, loaded]);

  return [value, setValue, { loaded }];
}
