'use client';
import { useEffect } from 'react';

export default function CalContactEmbed() {
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://cal.com/embed/embed.js', 'init');

    Cal('init', '30min', { origin: 'https://cal.com' });
    Cal.ns['30min']('inline', {
      elementOrSelector: '#cal-contact-embed',
      config: { layout: 'column_view' },
      calLink: 'aiandwebservices/30min',
    });
    Cal.ns['30min']('ui', {
      theme: 'dark',
      cssVarsPerTheme: {
        light: { 'cal-brand': '#2aa5a0' },
        dark:  { 'cal-brand': '#2aa5a0' },
      },
      hideEventTypeDetails: true,
      layout: 'column_view',
    });
  }, []);

  return (
    <div style={{ width:'100%', overflow:'hidden', borderRadius:'12px', marginTop:15 }}>
      <div
        id="cal-contact-embed"
        style={{ width:'100%', height:'clamp(465px, 44.5vh, 585px)', marginTop:-38, borderRadius:'12px', overflow:'hidden' }}
      />
    </div>
  );
}
