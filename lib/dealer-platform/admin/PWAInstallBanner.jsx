'use client';

import { useState, useEffect, useRef } from 'react';
import { Smartphone, X, Share } from 'lucide-react';

const DISMISS_KEY = 'lotpilot-pwa-dismiss';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function isDismissed() {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    return ts && Date.now() - Number(ts) < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function setDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {}
}

export default function PWAInstallBanner({ flash }) {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Already installed in standalone mode — don't show
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (isDismissed()) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // iOS never fires beforeinstallprompt — show manual instructions
      setVisible(true);
      return;
    }

    const handler = e => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setDismissed();
    setVisible(false);
  }

  async function install() {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    deferredPromptRef.current = null;
    setVisible(false);
    if (outcome === 'accepted') {
      flash?.('LotPilot installed! Find it on your home screen.', 'success');
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-stone-900 border-t border-stone-700 shadow-2xl">
      <Smartphone size={18} className="text-[#2AA5A0] shrink-0" />

      {isIOS ? (
        <p className="flex-1 text-xs text-stone-300">
          Install LotPilot: tap{' '}
          <Share size={12} className="inline mx-0.5 text-stone-400" />
          {' '}then <strong className="text-white">Add to Home Screen</strong>
        </p>
      ) : (
        <p className="flex-1 text-xs text-stone-300">
          Install LotPilot for quick access and offline support
        </p>
      )}

      {!isIOS && (
        <button
          onClick={install}
          className="shrink-0 px-3 py-1 text-xs font-semibold rounded bg-[#2AA5A0] text-stone-950 hover:bg-[#238f8a] transition-colors"
        >
          Install
        </button>
      )}

      <button
        onClick={dismiss}
        className="shrink-0 p-1 text-stone-500 hover:text-stone-300 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
