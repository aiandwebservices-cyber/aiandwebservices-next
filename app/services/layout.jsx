'use client';
import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const LIGHT_PAGES = ['/services/presence', '/services/revenue-engine', '/services/consulting'];

const SERVICE_LINKS = [
  { label: 'AI Automation Starter', href: '/services/ai-automation-starter' },
  { label: 'Presence',              href: '/services/presence' },
  { label: 'Growth',                href: '/services/growth' },
  { label: 'Revenue Engine',        href: '/services/revenue-engine' },
  { label: 'AI-First',              href: '/services/ai-first' },
  { label: 'Consulting & Strategy', href: '/services/consulting' },
  { label: 'Add-On Services',       href: '/services/add-ons' },
];

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Services',     href: '/#services', dropdown: true },
  { label: 'Pricing',      href: '/#pricing' },
  { label: 'About',        href: '/#about' },
  { label: 'FAQ',          href: '/#faq' },
  { label: 'Blog',         href: '/#blog' },
  { label: 'Contact',      href: '/#contact' },
];

export default function ServicesLayout({ children }) {
  const pathname = usePathname();
  const isLight = LIGHT_PAGES.includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="svc-page-nav">
        <Link href="/" className="svc-page-logo" aria-label="AIandWEBservices — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gradient-test.svg" alt="AIandWEBservices" width={200} height={40} />
        </Link>

        {/* Desktop nav */}
        <nav className="svc-page-links" aria-label="Site navigation">
          {NAV_LINKS.map(({ label, href, dropdown }) =>
            dropdown ? (
              <div key={label} className="svc-nav-svc-wrap">
                <Link href={href} className="svc-nav-svc-btn">
                  Services <span aria-hidden="true">▾</span>
                </Link>
                <div className="svc-nav-dropdown">
                  <div className="svc-nav-dropdown-inner">
                    {SERVICE_LINKS.map(({ label: sl, href: sh }) => (
                      <Link key={sl} href={sh} className="svc-nav-dropdown-item">{sl}</Link>
                    ))}
                    <div className="svc-nav-divider" />
                    <Link href="/#pricing" className="svc-nav-dropdown-item svc-nav-compare">Compare All Plans</Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={label} href={href}>{label}</Link>
            )
          )}
        </nav>

        <div className="svc-nav-right">
          <Link href="/#contact" className="svc-page-cta">Get Your Free Audit</Link>
          <button
            className={`svc-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="svc-mobile-menu" role="dialog" aria-label="Navigation menu">
          {NAV_LINKS.map(({ label, href, dropdown }) =>
            dropdown ? (
              <div key={label}>
                <button className="svc-mob-link svc-mob-svc-toggle" onClick={() => setSvcOpen(o => !o)}>
                  Services <span aria-hidden="true">{svcOpen ? '▴' : '▾'}</span>
                </button>
                {svcOpen && (
                  <div className="svc-mob-sub">
                    {SERVICE_LINKS.map(({ label: sl, href: sh }) => (
                      <Link key={sl} href={sh} className="svc-mob-sub-item" onClick={() => { setSvcOpen(false); setMenuOpen(false); }}>{sl}</Link>
                    ))}
                    <Link href="/#pricing" className="svc-mob-sub-item svc-mob-compare" onClick={() => { setSvcOpen(false); setMenuOpen(false); }}>Compare All Plans</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={label} href={href} className="svc-mob-link" onClick={() => setMenuOpen(false)}>{label}</Link>
            )
          )}
          <Link href="/#contact" className="svc-mob-cta" onClick={() => setMenuOpen(false)}>Get Your Free Audit</Link>
        </div>
      )}

      <main className={`svc-page-main${isLight ? ' svc-page-main--light' : ''}`}>{children}</main>

      <footer className="svc-page-footer">
        <p>© 2026 <Link href="/">AIandWEBservices</Link>. Built personally by David Pulis.</p>
      </footer>

      <Script
        id="calendly"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
