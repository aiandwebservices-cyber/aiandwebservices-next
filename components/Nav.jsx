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
  { label: 'Colony Dashboard',      href: '/product/colony'                 },
  { label: 'A La Carte',            href: '/services/consulting'            },
  { label: 'Add-On Services',       href: '/services/add-ons'               },
];

// 8 panels: Home(0), How It Works(1), Comparison(2), Samples(3),
// Services(4), About(5), FAQ(6), AI Readiness(7). Contact lives at /contact route.
const PANELS = [
  { idx: 0, label: 'Home',           nav: false }, // logo serves as Home
  { idx: 1, label: 'How It Works',   nav: true },
  { idx: 2, label: 'Comparison',     nav: true },
  { idx: 3, label: 'Samples',        nav: true },
  { idx: 4, label: 'Services',       nav: true },
  { idx: 5, label: 'About',          nav: true },
  { idx: 6, label: 'FAQ',            nav: true },
  { idx: 7, label: 'AI Readiness',   nav: true },
  { idx: 8, label: 'Contact',        nav: false }, // CTA button serves as Contact on desktop
];
const NAV_PANELS  = PANELS.filter(p => p.nav);
const HASH_NAMES = ['home', 'how-it-works', 'comparison', 'samples', 'services', 'about', 'faq', 'ai-readiness', 'contact'];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const isOnServicePage = pathname.startsWith('/services/');
  const isOnContactPage = pathname === '/contact';
  const isHomepage = pathname === '/';
  const go  = (n) => {
    if (!isHomepage) {
      const hash = HASH_NAMES[n] || 'home';
      router.push(`/#${hash}`);
    } else {
      window.go && window.go(n);
    }
  };
  const mGo = (n) => {
    if (!isHomepage) {
      const hash = HASH_NAMES[n] || 'home';
      router.push(`/#${hash}`);
    } else {
      window.mobileGo && window.mobileGo(n);
    }
  };
  const [currentPanel, setCurrentPanel] = useState(0);
  const [svcOpen,    setSvcOpen]    = useState(false);
  const [mobSvcOpen, setMobSvcOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const svcRef = useRef(null);

  const toggleMenu = () => setMenuOpen(o => !o);
  const closeMenu  = () => setMenuOpen(false);

  // Expose on window so useHorizontalScroll can call closeMenu on panel nav
  useEffect(() => {
    window.toggleMenu = toggleMenu;
    window.closeMenu  = closeMenu;
    return () => {
      delete window.toggleMenu;
      delete window.closeMenu;
    };
  }, []);

  // Desktop body scroll lock driven by menuOpen state; mobile unchanged
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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


  // Dark panels: Hero(0), HowItWorks(1), AIReadiness(7), Contact(8)
  // Matches hook's darkPanels set — single source of truth
  const isDarkSurface = !isOnServicePage && (
    isOnContactPage || currentPanel === 0 || currentPanel === 1 || currentPanel === 7 || currentPanel === 8
  );
  const logoSrc = isDarkSurface
    ? '/logo-white.svg'
    : '/logo-transparent.svg';

  const LogoInner = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="AIandWEBservices" width={340} height={56} style={{ display:'block' }} />
  );

  return (
    <>
      <nav id="nav" className={isDarkSurface ? 'dark' : 'light'} role="navigation" aria-label="Main navigation">
        <Link
          href="/"
          className="logo logo-link"
          onClick={() => { closeMenu(); if (isHomepage) window.go && window.go(0); }}
          aria-label="AIandWEBservices — go to home"
        >
          <LogoInner />
        </Link>

        <div className="nav-center" role="menubar" aria-label="Site sections">
          <button
            className={`nav-pill${currentPanel === 0 && !isOnContactPage && !isOnServicePage ? ' active' : ''}`}
            onClick={() => go(0)}
            role="menuitem"
            aria-current={currentPanel === 0 && !isOnContactPage ? 'true' : undefined}
          >
            Home
          </button>
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
                    className={`nav-pill nav-svc-btn${(currentPanel === idx || isOnServicePage) ? ' active' : ''}${svcOpen ? ' nav-svc-open' : ''}`}
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
                      <Link href="/services/compare" className="nav-svc-item nav-svc-item-compare" role="menuitem" onClick={() => setSvcOpen(false)}>
                        Compare All Plans
                      </Link>
                    </div>
                  )}
                </div>
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
          <button
            className={`nav-pill${isOnContactPage || currentPanel === 8 ? ' active' : ''}`}
            onClick={() => go(8)}
            role="menuitem"
            aria-current={isOnContactPage || currentPanel === 8 ? 'true' : undefined}
          >
            Contact
          </button>
        </div>

        <div className="nav-right">
          {pathname !== '/contact' && (
            <Link href="/contact" className="nav-cta" id="nav-cta-desktop" aria-label="Get a free AI audit">
              Get Your Free Audit
            </Link>
          )}
          <button
            id="hamburger"
            className={menuOpen ? 'open' : ''}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={toggleMenu}
          >
            <span className="hb-line" aria-hidden="true" />
            <span className="hb-line" aria-hidden="true" />
            <span className="hb-line" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={menuOpen ? 'open' : ''}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={menuOpen ? 'true' : 'false'}
      >
        <Link href="/" className={`mob-link${currentPanel === 0 && !isOnContactPage && !isOnServicePage ? ' active' : ''}`} onClick={(e) => { closeMenu(); if (isHomepage) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>Home</Link>
        <Link href="/#p2" className={`mob-link${currentPanel === 1 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(1); }}>How It Works</Link>
        <Link href="/#comparison" className={`mob-link${currentPanel === 2 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(2); }}>Comparison</Link>
        <Link href="/#samples" className={`mob-link${currentPanel === 3 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(3); }}>Samples</Link>
        <div>
          <div className="mob-svc-row">
            <Link
              href="/#services"
              className={`mob-link mob-svc-link${currentPanel === 4 || isOnServicePage ? ' active' : ''}`}
              onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(4); }}
            >
              Services
            </Link>
            <button
              className="mob-svc-caret-btn"
              onClick={() => setMobSvcOpen(o => !o)}
              aria-label={mobSvcOpen ? 'Collapse Services submenu' : 'Expand Services submenu'}
              aria-expanded={mobSvcOpen}
              aria-controls="mob-svc-sub"
            >
              {mobSvcOpen ? '▴' : '▾'}
            </button>
          </div>
          {mobSvcOpen && (
            <div className="mob-svc-sub" id="mob-svc-sub">
              {SERVICE_LINKS.map(({ label: sLabel, href }) => (
                <a
                  key={sLabel}
                  href={href}
                  className="mob-svc-item"
                  onClick={() => { setMobSvcOpen(false); closeMenu(); }}
                >
                  {sLabel}
                </a>
              ))}
              <Link
                href="/services/compare"
                className="mob-svc-item mob-svc-item-compare"
                onClick={() => { setMobSvcOpen(false); closeMenu(); }}
              >
                Compare All Plans
              </Link>
            </div>
          )}
        </div>
        <Link href="/#p3" className={`mob-link${currentPanel === 5 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(5); }}>About</Link>
        <Link href="/#p7" className={`mob-link${currentPanel === 6 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(6); }}>FAQ</Link>
        <Link href="/#checklist-teaser" className={`mob-link${currentPanel === 7 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(7); }}>AI Readiness</Link>
        <Link href="/#p8" className={`mob-link${currentPanel === 8 ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); closeMenu(); window.mobileGo?.(8); }}>Contact</Link>
        <Link href="/checklist" className="mob-cta" onClick={closeMenu}>Take the AI Readiness Check</Link>
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
