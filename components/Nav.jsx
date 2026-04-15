'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SERVICE_LINKS = [
  { label: 'AI Automation Starter', href: '/services/ai-automation-starter' },
  { label: 'Presence',              href: '/services/presence' },
  { label: 'Growth',                href: '/services/growth' },
  { label: 'Revenue Engine',        href: '/services/revenue-engine' },
  { label: 'AI-First',              href: '/services/ai-first' },
  { label: 'Consulting & Strategy', href: '/services/consulting' },
  { label: 'Add-On Services',       href: '/services/add-ons' },
];

// PANELS: each entry has a panel index (0-8), a label, and whether it appears in the nav.
// Comparison (index 5) is a section but not a nav destination.
const PANELS = [
  { idx: 0, label: 'Home',         nav: true },
  { idx: 1, label: 'How It Works', nav: true },
  { idx: 2, label: 'Services',     nav: true },
  { idx: 3, label: 'Pricing',      nav: true },
  { idx: 4, label: 'About',        nav: true },
  { idx: 5, label: 'FAQ',          nav: true },
  { idx: 6, label: 'Blog',         nav: true },
  { idx: 7, label: 'Contact',      nav: true },
  { idx: 8, label: 'Comparison',   nav: false },
];
const NAV_PANELS = PANELS.filter(p => p.nav);
const CONTACT_IDX = 7;

export default function Nav() {
  const go = (n) => window.go && window.go(n);
  const mGo = (n) => window.mobileGo && window.mobileGo(n);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [svcOpen, setSvcOpen] = useState(false);
  const [mobSvcOpen, setMobSvcOpen] = useState(false);
  const svcRef = useRef(null);

  useEffect(() => {
    const handler = (e) => setCurrentPanel(e.detail ?? 0);
    window.addEventListener('panelchange', handler);
    return () => window.removeEventListener('panelchange', handler);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (svcRef.current && !svcRef.current.contains(e.target)) setSvcOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Panels 0, 2, 7, 8 have dark (navy) backgrounds — use white text logo
  const darkPanels = new Set([0, 2, 7, 8]);
  const logoSrc = darkPanels.has(currentPanel)
    ? '/logo-gradient-test.svg'
    : '/logo-gradient-light.svg';

  const LogoInner = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="AIandWEBservices" width={260} height={52} style={{display:'block'}} />
  );

  return (
    <>
      <nav id="nav" className="dark" role="navigation" aria-label="Main navigation">
        {currentPanel === 0 ? (
          <div className="logo" role="img" aria-label="AIandWEBservices logo">
            <LogoInner />
          </div>
        ) : (
          <button className="logo logo-link" onClick={() => go(0)} aria-label="AIandWEBservices — go to home">
            <LogoInner />
          </button>
        )}
        <div className="nav-center" role="menubar" aria-label="Site sections">
          {NAV_PANELS.map(({ idx, label }) => {
            if (label === 'Services') {
              return (
                <div key={idx} className="nav-svc-wrap" ref={svcRef}>
                  <button
                    className={`nav-pill nav-svc-btn${currentPanel === idx ? ' active' : ''}${svcOpen ? ' nav-svc-open' : ''}`}
                    onClick={() => { setSvcOpen(o => !o); go(idx); }}
                    onMouseEnter={() => setSvcOpen(true)}
                    aria-haspopup="true"
                    aria-expanded={svcOpen}
                    role="menuitem"
                  >
                    Services <span className="nav-svc-caret" aria-hidden="true">▾</span>
                  </button>
                  {svcOpen && (
                    <div className="nav-svc-dropdown" role="menu" onMouseLeave={() => setSvcOpen(false)}>
                      {SERVICE_LINKS.map(({ label: sLabel, href }) => (
                        <Link key={sLabel} href={href} className="nav-svc-item" role="menuitem" onClick={() => setSvcOpen(false)}>
                          {sLabel}
                        </Link>
                      ))}
                      <div className="nav-svc-divider" aria-hidden="true" />
                      <Link href="/#pricing" className="nav-svc-item nav-svc-item-compare" role="menuitem" onClick={() => setSvcOpen(false)}>
                        Compare All Plans
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button key={idx} className={`nav-pill${currentPanel === idx ? ' active' : ''}`} onClick={() => go(idx)} role="menuitem" aria-current={currentPanel === idx ? 'true' : undefined}>{label}</button>
            );
          })}
        </div>
        <div className="nav-right">
          {currentPanel !== CONTACT_IDX && <><button className="nav-book" onClick={() => go(CONTACT_IDX)} aria-label="Book a call with David">Book a Call</button>
          <button className="nav-cta" id="nav-cta-desktop" onClick={() => go(CONTACT_IDX)} aria-label="Get a free AI audit">Get Your Free Audit</button></>}
          <button id="hamburger" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"
            onClick={() => window.toggleMenu && window.toggleMenu()}>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="false">
        {NAV_PANELS.map(({ idx, label }) => {
          if (label === 'Services') {
            return (
              <div key={idx}>
                <button
                  className={`mob-link mob-svc-toggle${currentPanel === idx ? ' active' : ''}`}
                  onClick={() => setMobSvcOpen(o => !o)}
                  aria-expanded={mobSvcOpen}
                >
                  Services <span className="mob-svc-caret" aria-hidden="true">{mobSvcOpen ? '▴' : '▾'}</span>
                </button>
                {mobSvcOpen && (
                  <div className="mob-svc-sub">
                    {SERVICE_LINKS.map(({ label: sLabel, href }) => (
                      <a
                        key={sLabel}
                        href={href}
                        className="mob-svc-item"
                        onClick={() => { setMobSvcOpen(false); window.toggleMenu && window.toggleMenu(); }}
                      >
                        {sLabel}
                      </a>
                    ))}
                    <a
                      href="/#pricing"
                      className="mob-svc-item mob-svc-item-compare"
                      onClick={() => { setMobSvcOpen(false); window.toggleMenu && window.toggleMenu(); }}
                    >
                      Compare All Plans
                    </a>
                  </div>
                )}
              </div>
            );
          }
          return (
            <button key={idx} className={`mob-link${currentPanel === idx ? ' active' : ''}`} onClick={() => mGo(idx)}>{label}</button>
          );
        })}
        <button className="mob-book" onClick={() => mGo(CONTACT_IDX)}>Book a Call</button>
        <button className="mob-cta" onClick={() => mGo(CONTACT_IDX)}>Get Your Free Audit</button>
      </div>

      <button className="arr hide" id="arr-l" onClick={() => window.goPrev && window.goPrev()} aria-label="Previous section">&#8592;</button>
      <button className="arr" id="arr-r" onClick={() => window.goNext && window.goNext()} aria-label="Next section">&#8594;</button>

      <div id="dots" role="tablist" aria-label="Navigate to section">
        {PANELS.map(({ idx, label, nav }) => (
          <button key={idx} className={`dot${idx === currentPanel ? ' on' : ''}${!nav ? ' dot-minor' : ''}`}
            onClick={() => go(idx)}
            aria-label={`Go to ${label}`} aria-selected={idx === currentPanel ? 'true' : 'false'} role="tab">
          </button>
        ))}
      </div>
    </>
  );
}
