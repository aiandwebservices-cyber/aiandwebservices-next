'use client';
import { useEffect } from 'react';

export default function CalInlineEmbed() {
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
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', 'aiandwebservices', { origin: 'https://app.cal.com' });
    Cal.ns['aiandwebservices']('inline', {
      elementOrSelector: '#cal-inline-embed',
      config: { layout: 'month_view' },
      calLink: 'aiandwebservices',
    });
    Cal.ns['aiandwebservices']('ui', {
      theme: 'light',
      cssVarsPerTheme: {
        light: { 'cal-brand': '#2aa5a0' },
        dark:  { 'cal-brand': '#2aa5a0' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, []);

  return (
    <div
      id="cal-inline-embed"
      style={{ width: '100%', height: '730px', overflow: 'scroll' }}
    />
  );
}
