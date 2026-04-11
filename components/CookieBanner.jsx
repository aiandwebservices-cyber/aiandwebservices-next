'use client';
import { useEffect } from 'react';

export default function CookieBanner() {
  useEffect(() => {
    const consent = localStorage.getItem('cookieAccepted');
    if (consent === '1') { loadGA4(); return; }
    if (consent === 'declined') return;
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('hidden');
  }, []);

  function loadGA4() {
    if (window._ga4Loaded) return;
    window._ga4Loaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-BCV8FCSKMZ';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-BCV8FCSKMZ');
  }

  function accept() {
    localStorage.setItem('cookieAccepted', '1');
    document.getElementById('cookie-banner').classList.add('hidden');
    loadGA4();
  }

  function decline() {
    localStorage.setItem('cookieAccepted', 'declined');
    document.getElementById('cookie-banner').classList.add('hidden');
  }

  return (
    <div id="cookie-banner" className="hidden" role="dialog" aria-label="Cookie consent">
      <p>This site uses cookies and Google Analytics to improve your experience. By continuing you agree to our <button style={{background:'none',border:'none',color:'#60A5FA',textDecoration:'underline',cursor:'pointer',fontSize:'inherit',padding:0}} onClick={accept}>Privacy Policy</button>.</p>
      <button id="cookie-decline" onClick={decline}>Decline</button>
      <button id="cookie-accept" onClick={accept}>Accept</button>
    </div>
  );
}
