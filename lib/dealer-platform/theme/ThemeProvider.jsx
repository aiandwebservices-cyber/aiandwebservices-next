'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEMES } from './colors';

/**
 * Dealer-platform theme context.
 *
 * Provides:
 *   - mode: 'light' | 'dark'
 *   - toggle(): swap modes
 *   - setMode(mode): explicit set
 *   - vars: CSS variable map for the current mode (spread into a root style prop)
 *
 * Persists to window.storage under a per-dealer key so each dealer remembers
 * its own admin theme preference.
 */

const ThemeContext = createContext({
  mode: 'light',
  toggle: () => {},
  setMode: () => {},
  vars: THEMES.light,
});

export function ThemeProvider({ children, dealerSlug = 'default', initialMode = 'light' }) {
  const [mode, setModeState] = useState(initialMode);

  // Hydrate from storage on mount
  useEffect(() => {
    const key = `dp-theme-${dealerSlug}`;
    if (typeof window === 'undefined' || !window.storage) return;
    let cancel = false;
    window.storage.getItem(key).then((raw) => {
      if (cancel) return;
      if (raw === 'dark' || raw === 'light') setModeState(raw);
    }).catch(() => {});
    return () => { cancel = true; };
  }, [dealerSlug]);

  // Persist on change
  useEffect(() => {
    if (typeof window === 'undefined' || !window.storage) return;
    const key = `dp-theme-${dealerSlug}`;
    window.storage.setItem(key, mode).catch(() => {});
  }, [mode, dealerSlug]);

  const toggle  = useCallback(() => setModeState((m) => (m === 'light' ? 'dark' : 'light')), []);
  const setMode = useCallback((m) => setModeState(m), []);

  const vars = THEMES[mode] || THEMES.light;

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode, vars }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
