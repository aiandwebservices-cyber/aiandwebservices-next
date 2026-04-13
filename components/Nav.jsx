'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Nav() {
  const go = (n) => window.go && window.go(n);
  const mGo = (n) => window.mobileGo && window.mobileGo(n);
  const [currentPanel, setCurrentPanel] = useState(0);

  useEffect(() => {
    const handler = (e) => setCurrentPanel(e.detail ?? 0);
    window.addEventListener('panelchange', handler);
    return () => window.removeEventListener('panelchange', handler);
  }, []);

  // Panels 0, 2, 7 have dark (navy) backgrounds — use white text logo
  const darkPanels = new Set([0, 2, 7]);
  const logoSrc = darkPanels.has(currentPanel)
    ? '/logo-gradient-test.svg'
    : '/logo-gradient-light.svg';

  const LogoInner = () => (
    <Image src={logoSrc} alt="AIandWEBservices" width={260} height={52} priority />
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
          <button className="nav-pill active" onClick={() => go(0)} role="menuitem" aria-current="true">Home</button>
          <button className="nav-pill" onClick={() => go(1)} role="menuitem">How It Works</button>
          <button className="nav-pill" onClick={() => go(2)} role="menuitem">Services</button>
          <button className="nav-pill" onClick={() => go(3)} role="menuitem">Pricing</button>
          <button className="nav-pill" onClick={() => go(4)} role="menuitem">About</button>
          <button className="nav-pill" onClick={() => go(5)} role="menuitem">FAQ</button>
          <button className="nav-pill" onClick={() => go(6)} role="menuitem">Blog</button>
          <button className="nav-pill" onClick={() => go(7)} role="menuitem">Contact</button>
        </div>
        <div className="nav-right">
          <button className="nav-book" onClick={() => go(7)} aria-label="Book a call with David">Book a Call</button>
          <button className="nav-cta" id="nav-cta-desktop" onClick={() => go(7)} aria-label="Get a free AI audit">Get Your Free Audit</button>
          <button id="hamburger" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"
            onClick={() => window.toggleMenu && window.toggleMenu()}>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="false">
        <button className="mob-link active" onClick={() => mGo(0)}>Home</button>
        <button className="mob-link" onClick={() => mGo(1)}>How It Works</button>
        <button className="mob-link" onClick={() => mGo(2)}>Services</button>
        <button className="mob-link" onClick={() => mGo(3)}>Pricing</button>
        <button className="mob-link" onClick={() => mGo(4)}>About</button>
        <button className="mob-link" onClick={() => mGo(5)}>FAQ</button>
        <button className="mob-link" onClick={() => mGo(6)}>Blog</button>
        <button className="mob-link" onClick={() => mGo(7)}>Contact</button>
        <button className="mob-book" onClick={() => mGo(7)}>Book a Call</button>
        <button className="mob-cta" onClick={() => mGo(7)}>Get Your Free Audit</button>
      </div>

      <button className="arr hide" id="arr-l" onClick={() => window.goPrev && window.goPrev()} aria-label="Previous section">&#8592;</button>
      <button className="arr" id="arr-r" onClick={() => window.goNext && window.goNext()} aria-label="Next section">&#8594;</button>

      <div id="dots" role="tablist" aria-label="Navigate to section">
        {['Home','How It Works','Services','Pricing','About','FAQ','Blog','Contact'].map((label, i) => (
          <button key={i} className={`dot${i === 0 ? ' on' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to ${label}`} aria-selected={i === 0 ? 'true' : 'false'} role="tab">
          </button>
        ))}
      </div>
    </>
  );
}
