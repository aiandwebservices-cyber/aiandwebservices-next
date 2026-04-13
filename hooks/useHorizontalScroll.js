'use client';
import { useEffect, useRef } from 'react';

export function useHorizontalScroll() {
  const curRef = useRef(0);

  useEffect(() => {
    // Always start at top
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const TOTAL = 8;
    let cur = 0;
    let locked = false;
    let formFocused = false;
    const isMobile = () => window.innerWidth <= 768;

    // Track form focus globally so scroll/click handlers never interfere
    const onFormFocus = () => { formFocused = true; };
    const onFormBlur = () => { setTimeout(() => { formFocused = false; }, 200); };
    document.addEventListener('focusin', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') onFormFocus();
    });
    document.addEventListener('focusout', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') onFormBlur();
    });

    const track = document.getElementById('track');
    const dotsEl = document.querySelectorAll('.dot');
    const pills = document.querySelectorAll('.nav-pill');
    const mobLinks = document.querySelectorAll('.mob-link:not(.mob-cta)');
    const nav = document.getElementById('nav');
    const arrL = document.getElementById('arr-l');
    const arrR = document.getElementById('arr-r');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const scrollHint = document.getElementById('scroll-hint');
    const darkPanels = new Set([0, 2, 7]);

    if (isMobile() && track) track.style.transform = '';

    function updateUI() {
      window.dispatchEvent(new CustomEvent('panelchange', { detail: cur }));
      const panelMap = [0, 1, 2, 3, 4, 5, 6, 7];
      dotsEl.forEach((d, i) => {
        d.classList.toggle('on', i === cur);
        d.setAttribute('aria-selected', i === cur ? 'true' : 'false');
      });
      pills.forEach((p, i) => {
        const active = panelMap[i] === cur;
        p.classList.toggle('active', active);
        p.setAttribute('aria-current', active ? 'true' : 'false');
      });
      mobLinks.forEach((l, i) => l.classList.toggle('active', panelMap[i] === cur));
      nav.className = darkPanels.has(cur) ? 'dark' : 'light';
      if (arrL) arrL.classList.toggle('hide', cur === 0);
      if (arrR) arrR.classList.toggle('hide', cur === TOTAL - 1);
      if (scrollHint) scrollHint.classList.toggle('hidden', cur !== 0);
    }

    function go(n) {
      if (isMobile()) { scrollToPanel(n); return; }
      if (locked) return;
      n = Math.max(0, Math.min(TOTAL - 1, n));
      if (n === cur) return;
      cur = n;
      curRef.current = cur;
      locked = true;
      track.style.transform = `translateX(-${cur * 100}vw)`;
      setTimeout(() => { locked = false; }, 750);
      updateUI();
    }

    // Map nav index → panel IDs (order: Home, HowItWorks, Services, Pricing, About, Blog, FAQ, Contact)
    // Order: Home, HowItWorks, Services, Pricing, About, FAQ, Blog, Contact
    const panelIds = ['p0','p2','p1','p5','p3','p7','p6','p8'];

    function scrollToPanel(n) {
      n = Math.max(0, Math.min(TOTAL - 1, n));
      cur = n;
      curRef.current = cur;
      const panel = document.getElementById(panelIds[n]);
      if (panel) {
        const offset = panel.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      closeMenu();
      updateUI();
    }

    function toggleMenu() {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileMenu.setAttribute('aria-modal', isOpen ? 'true' : 'false');
      if (!isMobile()) document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
      mobileMenu.setAttribute('aria-modal', 'false');
      if (!isMobile()) document.body.style.overflow = '';
    }

    // Expose functions globally so onclick attributes work
    window.go = go;
    window.goNext = () => go(cur + 1);
    window.goPrev = () => go(cur - 1);
    window.mobileGo = scrollToPanel;
    window.toggleMenu = toggleMenu;

    // Click outside closes menu — but never interfere with form fields, links, or Calendly
    const handleOutsideClick = (e) => {
      if (formFocused) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'IFRAME' || tag === 'LABEL' || tag === 'A') return;
      if (e.target.closest('a')) return;
      if (e.target.closest('form')) return;
      if (e.target.closest('.calendly-inline-widget')) return;
      if (e.target.closest('.calendly-wrap')) return;
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    };
    document.addEventListener('click', handleOutsideClick);

    // Desktop wheel → horizontal (but allow vertical scroll within overflowing panels)
    let wheelBuf = 0, wheelTimer = null;
    const handleWheel = (e) => {
      if (isMobile()) return;

      // If current panel overflows vertically, let it scroll until the boundary
      const panelEl = document.getElementById(panelIds[cur]);
      if (panelEl) {
        const { scrollTop, scrollHeight, clientHeight } = panelEl;
        const overflows = scrollHeight > clientHeight + 5;
        if (overflows) {
          const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
          const atTop = scrollTop <= 5;
          if (e.deltaY > 0 && !atBottom) return; // not at bottom yet — let panel scroll
          if (e.deltaY < 0 && !atTop) return;    // not at top yet — let panel scroll
        }
      }

      e.preventDefault();
      wheelBuf += e.deltaY + e.deltaX;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (Math.abs(wheelBuf) > 30) go(wheelBuf > 0 ? cur + 1 : cur - 1);
        wheelBuf = 0;
      }, 40);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard nav
    const handleKeyDown = (e) => {
      if (isMobile()) return;
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Mobile scroll spy — debounced to avoid flicker during smooth scroll
    let scrollTimer = null;
    const handleScroll = () => {
      if (!isMobile()) return;
      if (window._faqToggling) return;
      if (formFocused) return;
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.activeElement && document.activeElement.closest('form')) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        let active = 0;
        panelIds.forEach((id, i) => {
          const p = document.getElementById(id);
          if (p && p.getBoundingClientRect().top <= 80) active = i;
        });
        if (active !== cur) { cur = active; curRef.current = cur; updateUI(); }
      }, 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scale panel inner containers to fit any monitor height
    const INNER_SELECTORS = [
      '.hero-inner','.svc-panel','.funnel-inner','.pricing-inner',
      '.about-inner','.testi-inner','.blog-inner','.faq-inner','.contact-inner'
    ].join(',');
    const BASE_HEIGHT = 960; // design height panels were built for
    const NAV_H = 64;

    function scalePanels() {
      if (isMobile()) {
        document.querySelectorAll(INNER_SELECTORS).forEach(el => {
          el.style.zoom = '';
          el.style.paddingTop = '';
        });
        return;
      }
      const avail = window.innerHeight - NAV_H;
      const scale = Math.min(1, avail / BASE_HEIGHT);
      // After zoom, padding-top is also scaled down — compensate so heading
      // always renders at least 88px below the top (clearing the 64px nav)
      const compensatedPadding = Math.ceil(88 / scale);
      document.querySelectorAll(INNER_SELECTORS).forEach(el => {
        el.style.zoom = scale;
        el.style.paddingTop = compensatedPadding + 'px';
      });
    }
    scalePanels();

    // Resize handler
    let _lastW = window.innerWidth;
    const handleResize = () => {
      const w = window.innerWidth;
      if (w === _lastW) return;
      _lastW = w;
      if (isMobile()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        track.style.transform = '';
      } else {
        track.style.transform = `translateX(-${cur * 100}vw)`;
      }
      scalePanels();
    };
    window.addEventListener('resize', handleResize);

    updateUI();

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      delete window.go;
      delete window.goNext;
      delete window.goPrev;
      delete window.mobileGo;
      delete window.toggleMenu;
    };
  }, []);

  return curRef;
}
