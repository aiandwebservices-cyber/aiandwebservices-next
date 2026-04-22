'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (window._crispInitialized) return;
    window._crispInitialized = true;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = 'e76e44c0-a38a-4d5e-ab6a-41a380e83c69';

    // Official Crisp SDK method — fires exactly once when fully ready & session established
    window.CRISP_READY_TRIGGER = function () {};

    const style = document.createElement('style');
    style.textContent = `
      /* Hide operator name label below messages — targets all known Crisp class patterns */
      .crisp-client .cc-tlfw ul li .cc-yvvc span[data-id],
      .crisp-client [data-id="operator-name"],
      .crisp-client .cc-1nvc,
      .crisp-client .cc-yvvc > span:last-child,
      .crisp-client span[class*="nickname"],
      .crisp-client span[class*="operator"],
      .crisp-client span[class*="author"],
      .crisp-client [class*="message-author"],
      .crisp-client [class*="message__author"],
      .crisp-client [class*="operator-name"],
      .crisp-client li[class*="message"] > span:last-of-type,
      .crisp-client .cc-yvvc span:not([class]) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Also clear via SDK once ready
    window.$crisp.push(['set', 'user:nickname', ['']]);

    const loadCrisp = () => {
      const s = document.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      document.head.appendChild(s);
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadCrisp, { timeout: 4000 });
    } else {
      setTimeout(loadCrisp, 2000);
    }

    document.addEventListener('click', function (e) {
      if (!window.$crisp) return;
      const h = document.getElementById('hamburger');
      if (h && (h === e.target || h.contains(e.target))) {
        window.$crisp.push(['do', 'chat:close']);
        return;
      }
      if (e.target.tagName === 'IFRAME') return;
      if (e.target.closest('.cal-embed-wrap')) return;
      if (e.target.closest('form')) return;
      const crispEl = document.getElementById('crisp-chatbox');
      if (crispEl && !crispEl.contains(e.target)) {
        window.$crisp.push(['do', 'chat:close']);
      }
    }, true);
  }, []);

  return null;
}
