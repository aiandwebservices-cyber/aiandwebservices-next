'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * DealerBanner — full-width fixed top banner pitching the platform to
 * dealer-owners visiting the demo. Dismissible (session-scoped).
 *
 * Sets a `--banner-h` CSS variable on <html> while visible so other
 * top-anchored fixed elements (SideRail, Ticker) can shift down to
 * avoid overlap.
 */
export function DealerBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dismissed) {
      root.style.setProperty('--banner-h', '0px');
    } else {
      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      root.style.setProperty('--banner-h', isMobile ? '64px' : '44px');
    }
    return () => root.style.setProperty('--banner-h', '0px');
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <>
      <div className="dealer-banner" style={{
        position: 'fixed', top: 0, left: 96, right: 0,
        zIndex: 100, height: 44, background: '#D4AF37', color: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: '0 44px 0 16px',
        fontFamily: 'var(--font-inter), -apple-system, sans-serif',
        fontSize: 14, fontWeight: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}>
        <span className="dealer-banner-text" style={{ textAlign: 'center' }}>
          🚗 Car Dealer? See How AutoRival.ai Can Transform Your Dealership
        </span>
        <a href="/samples/primo-features" style={{
          color: '#0a0a0a', textDecoration: 'underline', fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          See All Features →
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#0a0a0a', padding: 4, display: 'flex', alignItems: 'center',
          }}>
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .dealer-banner {
            left: 64px !important;
            height: auto !important; min-height: 64px;
            padding: 8px 36px !important; flex-wrap: wrap; gap: 4px !important;
          }
          .dealer-banner-text { font-size: 12px; line-height: 1.3; }
          .dealer-banner a { font-size: 12px; }
        }
      `}</style>
    </>
  );
}

export default DealerBanner;
