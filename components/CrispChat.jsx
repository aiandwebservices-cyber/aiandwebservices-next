'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (window.$crisp) return; // already loaded

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = 'e76e44c0-a38a-4d5e-ab6a-41a380e83c69';

    window.CRISP_READY_TRIGGER = function () {
      setTimeout(function () {
        window.$crisp.push(['do', 'message:show', ['text', '👋 Hi! I\'m David, the owner — got questions?\nI reply within minutes.']]);
      }, 5000);
    };

    const s = document.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    document.head.appendChild(s);

    // Close chat when hamburger opens
    document.addEventListener('click', function (e) {
      const h = document.getElementById('hamburger');
      if (h && (h === e.target || h.contains(e.target))) {
        if (window.$crisp) window.$crisp.push(['do', 'chat:close']);
      }
    });
  }, []);

  return null;
}
