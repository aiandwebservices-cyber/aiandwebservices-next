'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (window._crispInitialized) return;
    window._crispInitialized = true;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = 'e76e44c0-a38a-4d5e-ab6a-41a380e83c69';

    // Official Crisp SDK method — fires exactly once when fully ready & session established
    window.CRISP_READY_TRIGGER = function () {
      if (window._crispMessageShown) return;
      window._crispMessageShown = true;
      setTimeout(function () {
        window.$crisp.push(['do', 'message:show', ['text', '👋 Hi! I\'m David, the owner — have questions?\nI reply within minutes.']]);
      }, 5000);
    };

    const style = document.createElement('style');
    style.textContent = `
      .crisp-client .cc-tlfw ul li .cc-yvvc span[data-id],
      .crisp-client [data-id="operator-name"],
      .crisp-client .cc-1nvc,
      .crisp-client .cc-yvvc > span:last-child {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const s = document.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    document.head.appendChild(s);

    document.addEventListener('click', function (e) {
      if (!window.$crisp) return;
      const h = document.getElementById('hamburger');
      if (h && (h === e.target || h.contains(e.target))) {
        window.$crisp.push(['do', 'chat:close']);
        return;
      }
      if (e.target.tagName === 'IFRAME') return;
      if (e.target.closest('.calendly-inline-widget') || e.target.closest('.calendly-wrap')) return;
      if (e.target.closest('form')) return;
      const crispEl = document.getElementById('crisp-chatbox');
      if (crispEl && !crispEl.contains(e.target)) {
        window.$crisp.push(['do', 'chat:close']);
      }
    }, true);
  }, []);

  return null;
}
