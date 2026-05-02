'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const LINKS = [
  { href: '/lotpilot', label: 'Home' },
  { href: '/lotpilot/features', label: 'Features' },
  { href: '/lotpilot/pricing', label: 'Pricing' },
  { href: '/lotpilot/about', label: 'About' },
  { href: '/lotpilot/contact', label: 'Contact' },
];

const DEMO_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === '/lotpilot';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''} ${transparent ? 'lp-nav--transparent' : ''}`}
      >
        <div className="lp-container lp-nav__inner">
          <Link href="/lotpilot" aria-label="LotPilot.ai home">
            <Logo />
          </Link>

          <nav className="lp-nav__links" aria-label="Primary">
            {LINKS.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <a
            className="lp-btn lp-btn--filled lp-nav__cta"
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a demo
          </a>

          <button
            className={`lp-burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`lp-mobile-menu ${open ? 'is-open' : ''}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <a className="lp-btn lp-btn--filled" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
          Book a demo
        </a>
      </div>
    </>
  );
}
