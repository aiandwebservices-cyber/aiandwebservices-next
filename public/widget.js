/*! LotPilot embeddable chat widget — vanilla, no deps */
(function () {
  'use strict';

  // currentScript can be null in some embed contexts — fall back to last script.
  var script = document.currentScript || (function () {
    var ss = document.getElementsByTagName('script');
    return ss[ss.length - 1];
  })();
  if (!script) return;

  function attr(name, fallback) {
    var v = script.getAttribute(name);
    return v == null || v === '' ? (fallback == null ? '' : fallback) : v;
  }

  var config = {
    dealer:   attr('data-dealer'),
    color:    attr('data-color', '#D4AF37'),
    position: attr('data-position', 'right') === 'left' ? 'left' : 'right',
    greeting: attr('data-greeting'),
    name:     attr('data-name'),
    host:     (script.src || '').replace(/\/widget\.js(?:\?.*)?$/, '')
  };
  if (!config.dealer) {
    if (window.console && console.warn) console.warn('LotPilot: data-dealer attribute is required');
    return;
  }
  if (window.__lotpilotWidgetMounted) return;
  window.__lotpilotWidgetMounted = true;

  var CHAT_ICON =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var CLOSE_ICON =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var side = config.position; // 'left' | 'right'
  var isMobile = function () { return window.innerWidth < 640; };

  // Bubble button
  var bubble = document.createElement('button');
  bubble.id = 'lotpilot-bubble';
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.innerHTML = CHAT_ICON;
  bubble.style.cssText =
    'position:fixed;bottom:24px;' + side + ':24px;width:56px;height:56px;border-radius:50%;' +
    'background:' + config.color + ';cursor:pointer;z-index:2147483647;display:flex;' +
    'align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.18);' +
    'border:none;outline:none;transition:transform 200ms ease;padding:0;';
  bubble.onmouseenter = function () { bubble.style.transform = 'scale(1.08)'; };
  bubble.onmouseleave = function () { bubble.style.transform = 'scale(1)'; };

  // Container + iframe
  var container = document.createElement('div');
  container.id = 'lotpilot-chat';
  function applyContainerStyles() {
    if (isMobile()) {
      container.style.cssText =
        'position:fixed;inset:0;width:100%;height:100%;z-index:2147483646;' +
        'display:none;background:transparent;';
    } else {
      container.style.cssText =
        'position:fixed;bottom:96px;' + side + ':24px;width:380px;height:520px;' +
        'max-height:calc(100vh - 120px);z-index:2147483646;display:none;' +
        'border-radius:14px;overflow:hidden;box-shadow:0 18px 48px rgba(0,0,0,0.22);' +
        'background:#ffffff;';
    }
  }
  applyContainerStyles();

  var iframe = document.createElement('iframe');
  iframe.title = 'LotPilot chat';
  iframe.setAttribute('allow', 'microphone');
  iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#ffffff;';

  var qs = [
    'color=' + encodeURIComponent(config.color),
    'name=' + encodeURIComponent(config.name || ''),
    'greeting=' + encodeURIComponent(config.greeting || ''),
    'origin=' + encodeURIComponent(window.location.origin),
  ].join('&');
  iframe.src = config.host + '/embed/chat/' + encodeURIComponent(config.dealer) + '?' + qs;
  container.appendChild(iframe);

  // Toggle
  var open = false;
  function setOpen(next) {
    open = !!next;
    container.style.display = open ? 'block' : 'none';
    bubble.innerHTML = open ? CLOSE_ICON : CHAT_ICON;
    bubble.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
  }
  bubble.onclick = function () { setOpen(!open); };

  // Re-apply layout on resize (mobile <-> desktop)
  var lastMobile = isMobile();
  window.addEventListener('resize', function () {
    var nowMobile = isMobile();
    if (nowMobile !== lastMobile) {
      lastMobile = nowMobile;
      applyContainerStyles();
      container.style.display = open ? 'block' : 'none';
    }
  });

  // postMessage protocol
  window.addEventListener('message', function (e) {
    if (!e || !e.data) return;
    var d = e.data;
    if (d === 'lotpilot:close' || (d && d.type === 'lotpilot:close')) {
      setOpen(false);
      return;
    }
    if (d && d.type === 'lotpilot:lead') {
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'lotpilot_lead_captured', {
            dealer: config.dealer,
            email: d.email,
            phone: d.phone,
          });
        }
        if (typeof window.dataLayer !== 'undefined' && window.dataLayer.push) {
          window.dataLayer.push({ event: 'lotpilot_lead_captured', dealer: config.dealer });
        }
      } catch (_err) {}
    }
  });

  // Mount when body is ready
  function mount() {
    document.body.appendChild(container);
    document.body.appendChild(bubble);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
})();
