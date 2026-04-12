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
    s.onload = function () {
      window.$crisp.push(['on', 'session:loaded', function () {
        setTimeout(function () {
          window.$crisp.push(['set', 'session:data', [[['operator_name', ' ']]]]);
          window.$crisp.push(['do', 'message:show', ['text', '👋 Hi! I\'m David, the owner — got questions?\nI reply within minutes.']]);
        }, 5000);
      }]);
    };
    document.head.appendChild(s);

    // Close chat when clicking outside the widget or hamburger
    document.addEventListener('click', function (e) {
      if (!window.$crisp) return;

      // Close on hamburger click
      const h = document.getElementById('hamburger');
      if (h && (h === e.target || h.contains(e.target))) {
        window.$crisp.push(['do', 'chat:close']);
        return;
      }

      // Close when clicking the main page (outside Crisp iframe/widget)
      const crispEl = document.getElementById('crisp-chatbox');
      if (crispEl && !crispEl.contains(e.target)) {
        window.$crisp.push(['do', 'chat:close']);
      }
    });
  }, []);

  return null;
}
