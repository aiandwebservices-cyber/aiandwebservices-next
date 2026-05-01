'use client';

import { useEffect, useRef } from 'react';

export function useServiceWorker(flash) {
  const registrationRef = useRef(null);
  const flashRef = useRef(flash);
  useEffect(() => { flashRef.current = flash; }, [flash]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const searchParams = new URLSearchParams(window.location.search);
    const pwaTestMode = searchParams.get('pwa') === 'true';
    const shouldRegister = process.env.NODE_ENV === 'production' || pwaTestMode;

    if (!shouldRegister) return;

    navigator.serviceWorker
      .register('/lotpilot-sw.js', { scope: '/dealers/' })
      .then(registration => {
        registrationRef.current = registration;

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              flashRef.current?.('Update available — refresh to get the latest version', 'info');
            }
          });
        });
      })
      .catch(err => {
        console.warn('[lotpilot-sw] Registration failed:', err);
      });
  }, []);

  return registrationRef;
}
