'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [status, setStatus] = useState(null); // null | 'offline' | 'reconnected'
  const hideTimerRef = useRef(null);

  useEffect(() => {
    function handleOffline() {
      clearTimeout(hideTimerRef.current);
      setStatus('offline');
    }

    function handleOnline() {
      setStatus('reconnected');
      hideTimerRef.current = setTimeout(() => setStatus(null), 3000);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Reflect initial state in case page loaded while offline
    if (!navigator.onLine) setStatus('offline');

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!status) return null;

  const isOffline = status === 'offline';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${
        isOffline
          ? 'bg-yellow-500/20 border-b border-yellow-500/40 text-yellow-300'
          : 'bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300'
      }`}
    >
      {isOffline
        ? <WifiOff size={13} className="shrink-0" />
        : <Wifi size={13} className="shrink-0" />}
      {isOffline
        ? "You're offline — cached data shown. Changes will sync when you reconnect."
        : 'Back online — syncing...'}
    </div>
  );
}
