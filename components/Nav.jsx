'use client';

const safe = (fn) => () => fn && fn();

export default function Nav() {
  const go = (n) => window.go && window.go(n);
  const mGo = (n) => window.mobileGo && window.mobileGo(n);

  return (
    <>
      <nav id="nav" className="dark" role="navigation" aria-label="Main navigation">
        <div className="logo" role="img" aria-label="AIandWEBservices logo">
          <span className="logo-ai" aria-hidden="true">AI</span>
          <span className="logo-and" aria-hidden="true">and</span>
          <span className="logo-web" aria-hidden="true">WEB</span>
          <span className="logo-svc" aria-hidden="true">services</span>
        </div>
        <div className="nav-center" role="menubar" aria-label="Site sections">
          <button className="nav-pill active" onClick={() => go(0)} role="menuitem" aria-current="true">Home</button>
          <button className="nav-pill" onClick={() => go(1)} role="menuitem">Services</button>
          <button className="nav-pill" onClick={() => go(2)} role="menuitem">How It Works</button>
          <button className="nav-pill" onClick={() => go(3)} role="menuitem">About</button>
          <button className="nav-pill" onClick={() => go(4)} role="menuitem">Pricing</button>
          <button className="nav-pill" onClick={() => go(5)} role="menuitem">Blog</button>
          <button className="nav-pill" onClick={() => go(6)} role="menuitem">FAQ</button>
          <button className="nav-pill" onClick={() => go(7)} role="menuitem">Contact</button>
        </div>
        <button className="nav-cta" id="nav-cta-desktop" onClick={() => go(7)} aria-label="Get a free AI audit">Get a Free Audit →</button>
        <button id="hamburger" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"
          onClick={() => window.toggleMenu && window.toggleMenu()}>
          <span className="hb-line" aria-hidden="true"></span>
          <span className="hb-line" aria-hidden="true"></span>
          <span className="hb-line" aria-hidden="true"></span>
        </button>
      </nav>

      <div id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal="false">
        <button className="mob-link active" onClick={() => mGo(0)}>Home</button>
        <button className="mob-link" onClick={() => mGo(1)}>Services</button>
        <button className="mob-link" onClick={() => mGo(2)}>How It Works</button>
        <button className="mob-link" onClick={() => mGo(3)}>About</button>
        <button className="mob-link" onClick={() => mGo(4)}>Pricing</button>
        <button className="mob-link" onClick={() => mGo(5)}>Blog</button>
        <button className="mob-link" onClick={() => mGo(6)}>FAQ</button>
        <button className="mob-link" onClick={() => mGo(7)}>Contact</button>
        <button className="mob-cta" onClick={() => mGo(7)}>Get a Free Audit — It&apos;s Free →</button>
      </div>

      <button className="arr hide" id="arr-l" onClick={() => window.goPrev && window.goPrev()} aria-label="Previous section">&#8592;</button>
      <button className="arr" id="arr-r" onClick={() => window.goNext && window.goNext()} aria-label="Next section">&#8594;</button>

      <div id="dots" role="tablist" aria-label="Navigate to section">
        {['Home','Services','How It Works','About','Pricing','Blog','FAQ','Contact'].map((label, i) => (
          <button key={i} className={`dot${i === 0 ? ' on' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to ${label}`} aria-selected={i === 0 ? 'true' : 'false'} role="tab">
          </button>
        ))}
      </div>
    </>
  );
}
