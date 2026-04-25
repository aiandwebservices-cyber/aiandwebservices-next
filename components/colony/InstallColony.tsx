'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallColony() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => setIsInstalled(true);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  if (isInstalled) return null;

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSInstructions(true)}
          className="px-3 py-1.5 text-sm font-medium rounded-md border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
        >
          Install Colony
        </button>
        {showIOSInstructions && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-lg max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-3">Install Colony on iPhone</h3>
              <ol className="text-sm text-slate-300 space-y-3">
                <li>1. Tap the <strong>Share</strong> button at the bottom of Safari</li>
                <li>2. Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>3. Tap <strong>Add</strong> in the top right</li>
                <li>4. Colony will appear as an app icon on your home screen</li>
              </ol>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-6 w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
      return;
    }
    setShowIOSInstructions(true);
  };

  return (
    <>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 text-sm font-medium rounded-md border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
      >
        Install Colony
      </button>
      {showIOSInstructions && !installPrompt && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-3">Install Colony</h3>
            <p className="text-sm text-slate-300 mb-3">
              To install Colony as an app, open this site in <strong>Chrome</strong> or <strong>Edge</strong> on desktop or Android, then click the install icon in the address bar (or use the browser menu → &quot;Install Colony&quot;).
            </p>
            <p className="text-sm text-slate-400">
              The install option may take a few visits to appear depending on your browser.
            </p>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
