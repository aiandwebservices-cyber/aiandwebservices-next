'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const SERVICE_LINKS = [
  { label: 'AI Automation Starter', href: '/services/ai-automation-starter' },
  { label: 'Presence',              href: '/services/presence'              },
  { label: 'Growth',                href: '/services/growth'                },
  { label: 'Revenue Engine',        href: '/services/revenue-engine'        },
  { label: 'AI-First',              href: '/services/ai-first'              },
  { label: 'Consulting & Strategy', href: '/services/consulting'            },
  { label: 'Add-On Services',       href: '/services/add-ons'               },
];

// 8 panels: Home(0), How It Works(1), Comparison(2), Services(3), About(4), Samples(5), FAQ(6), Contact(7)
const PANELS = [
  { idx: 0, label: 'Home',         nav: true },
  { idx: 1, label: 'How It Works', nav: true },
  { idx: 2, label: 'Comparison',   nav: true },
  { idx: 3, label: 'Services',     nav: true },
  { idx: 4, label: 'About',        nav: true },
  { idx: 5, label: 'Samples',      nav: true },
  { idx: 6, label: 'FAQ',          nav: true },
  { idx: 7, label: 'Contact',      nav: true },
];
const NAV_PANELS  = PANELS.filter(p => p.nav);
const CONTACT_IDX = 7;
const HASH_NAMES = ['home', 'how-it-works', 'comparison', 'services', 'about', 'samples', 'faq'];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const isOnServicePage = pathname.startsWith('/services/');
  const isOnContactPage = pathname === '/contact2';
  const go  = (n) => {
    if (isOnContactPage) {
      const hash = HASH_NAMES[n] || 'home';
      router.push(`/#${hash}`);
    } else {
      window.go && window.go(n);
    }
  };
  const mGo = (n) => {
    if (isOnContactPage) {
      const hash = HASH_NAMES[n] || 'home';
      router.push(`/#${hash}`);
    } else {
      window.mobileGo && window.mobileGo(n);
    }
  };
  const [currentPanel, setCurrentPanel] = useState(0);
  const [svcOpen,    setSvcOpen]    = useState(false);
  const [mobSvcOpen, setMobSvcOpen] = useState(false);
  const svcRef = useRef(null);

  useEffect(() => {
    const handler = (e) => setCurrentPanel(e.detail ?? 0);
    window.addEventListener('panelchange', handler);
    return () => window.removeEventListener('panelchange', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (svcRef.current && !svcRef.current.contains(e.target)) setSvcOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Panels 0 (Hero), 2 (Comparison), 7 (Contact) have dark backgrounds
  const darkPanels = new Set([0, 2, 7]);
  const logoSrc    = darkPanels.has(currentPanel) ? '/logo-gradient-test.svg' : '/logo-gradient-light.svg';

  const LogoInner = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="AIandWEBservices" width={260} height={52} style={{ display:'block' }} />
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
              const handleServicesClick = () => {
                if (isOnServicePage) {
                  window.location.href = '/services';
                } else {
                  go(idx);
                }
                setSvcOpen(o => !o);
              };
              return (
                <div key={idx} className="nav-svc-wrap" ref={svcRef}>
                  <button
                    className={`nav-pill nav-svc-btn${currentPanel === idx ? ' active' : ''}${svcOpen ? ' nav-svc-open' : ''}`}
                    onClick={handleServicesClick}
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
            if (label === 'Contact') {
              return (
                <Link
                  key={idx}
                  href="/contact2"
                  className={`nav-pill${pathname === '/contact2' ? ' active' : ''}`}
                  role="menuitem"
                  aria-current={pathname === '/contact2' ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            }
            return (
              <button
                key={idx}
                className={`nav-pill${currentPanel === idx ? ' active' : ''}`}
                onClick={() => go(idx)}
                role="menuitem"
                aria-current={currentPanel === idx ? 'true' : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="nav-right">
          {pathname !== '/contact2' && (
            <Link href="/contact2" className="nav-cta" id="nav-cta-desktop" aria-label="Get a free AI audit">
              Get Your Free Audit
            </Link>
          )}
          <button
            id="hamburger"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
            onClick={() => window.toggleMenu && window.toggleMenu()}
          >
            <span className="hb-line" aria-hidden="true" />
            <span className="hb-line" aria-hidden="true" />
            <span className="hb-line" aria-hidden="true" />
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
          if (label === 'Contact') {
            return (
              <Link
                key={idx}
                href="/contact2"
                className={`mob-link${pathname === '/contact2' ? ' active' : ''}`}
                onClick={() => window.toggleMenu && window.toggleMenu()}
              >
                {label}
              </Link>
            );
          }
          return (
            <button
              key={idx}
              className={`mob-link${currentPanel === idx ? ' active' : ''}`}
              onClick={() => mGo(idx)}
            >
              {label}
            </button>
          );
        })}
        <Link href="/contact2" className="mob-cta" onClick={() => window.toggleMenu && window.toggleMenu()}>Get Your Free Audit</Link>
      </div>

      <button className="arr hide" id="arr-l" onClick={() => window.goPrev && window.goPrev()} aria-label="Previous section">&#8592;</button>
      <button className="arr"      id="arr-r" onClick={() => window.goNext && window.goNext()} aria-label="Next section">&#8594;</button>

      <div id="dots" role="tablist" aria-label="Navigate to section">
        {PANELS.map(({ idx, label, nav }) => (
          <button
            key={idx}
            className={`dot${idx === currentPanel ? ' on' : ''}${!nav ? ' dot-minor' : ''}`}
            onClick={() => go(idx)}
            aria-label={`Go to ${label}`}
            aria-selected={idx === currentPanel ? 'true' : 'false'}
            role="tab"
          />
        ))}
      </div>
    </>
  );
}
