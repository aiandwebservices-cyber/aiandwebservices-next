'use client';

import { useState, useEffect } from 'react';

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
          {['Home','How It Works','Services','Pricing','About','FAQ','Blog','Contact'].map((label, i) => (
            <button key={i} className={`nav-pill${currentPanel === i ? ' active' : ''}`} onClick={() => go(i)} role="menuitem" aria-current={currentPanel === i ? 'true' : undefined}>{label}</button>
          ))}
        </div>
        <div className="nav-right">
          {currentPanel !== 7 && <><button className="nav-book" onClick={() => go(7)} aria-label="Book a call with David">Book a Call</button>
          <button className="nav-cta" id="nav-cta-desktop" onClick={() => go(7)} aria-label="Get a free AI audit">Get Your Free Audit</button></>}
          <button id="hamburger" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"
            onClick={() => window.toggleMenu && window.toggleMenu()}>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
            <span className="hb-line" aria-hidden="true"></span>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="false">
        {['Home','How It Works','Services','Pricing','About','FAQ','Blog','Contact'].map((label, i) => (
          <button key={i} className={`mob-link${currentPanel === i ? ' active' : ''}`} onClick={() => mGo(i)}>{label}</button>
        ))}
        <button className="mob-book" onClick={() => mGo(7)}>Book a Call</button>
        <button className="mob-cta" onClick={() => mGo(7)}>Get Your Free Audit</button>
      </div>

      <button className="arr hide" id="arr-l" onClick={() => window.goPrev && window.goPrev()} aria-label="Previous section">&#8592;</button>
      <button className="arr" id="arr-r" onClick={() => window.goNext && window.goNext()} aria-label="Next section">&#8594;</button>

      <div id="dots" role="tablist" aria-label="Navigate to section">
        {['Home','How It Works','Services','Pricing','About','FAQ','Blog','Contact'].map((label, i) => (
          <button key={i} className={`dot${i === currentPanel ? ' on' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to ${label}`} aria-selected={i === currentPanel ? 'true' : 'false'} role="tab">
          </button>
        ))}
      </div>
    </>
  );
}
