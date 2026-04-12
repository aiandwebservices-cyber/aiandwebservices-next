'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (window.$crisp) return; // already loaded

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = 'e76e44c0-a38a-4d5e-ab6a-41a380e83c69';

    const s = document.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    // Inject CSS to hide operator name label in Crisp widget
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

    s.onload = function () {
      window.$crisp.push(['on', 'session:loaded', function () {
        if (window._crispMessageShown) return;
        window._crispMessageShown = true;
        setTimeout(function () {
          window.$crisp.push(['do', 'message:show', ['text', '👋 Hi! I\'m David, the owner — got questions?\nI reply within minutes.']]);
        }, 5000);
      }]);
    };
    document.head.appendChild(s);

    // Close chat when clicking outside the widget or hamburger
    document.addEventListener('click', function (e) {
      if (!window.$crisp) return;

      // Only act if chat is actually open
      const isChatOpen = () => {
        const box = document.getElementById('crisp-chatbox');
        return box && box.querySelector('[data-visible="true"], .cc-nsge, iframe') !== null;
      };

      // Close on hamburger click
      const h = document.getElementById('hamburger');
      if (h && (h === e.target || h.contains(e.target))) {
        window.$crisp.push(['do', 'chat:close']);
        return;
      }

      // Close when clicking the main page (outside Crisp iframe/widget)
      // But never interfere with Calendly, forms, or iframes
      if (e.target.tagName === 'IFRAME') return;
      if (e.target.closest('.calendly-inline-widget') || e.target.closest('.calendly-wrap')) return;
      if (e.target.closest('form')) return;

      const crispEl = document.getElementById('crisp-chatbox');
      if (crispEl && !crispEl.contains(e.target)) {
        window.$crisp.push(['do', 'chat:close']);
      }
    }, true); // use capture so it fires before other handlers
  }, []);

  return null;
}
