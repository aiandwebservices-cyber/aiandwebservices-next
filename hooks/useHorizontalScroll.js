'use client';
import { useEffect, useRef } from 'react';

export function useHorizontalScroll() {
  const curRef = useRef(0);

  useEffect(() => {
    if (window.location.pathname !== '/') return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const TOTAL = 9;
    const hashNames = ['home', 'how-it-works', 'comparison', 'services', 'about', 'samples', 'faq', 'ai-readiness', 'contact'];
    const hashToPanel = Object.fromEntries(hashNames.map((h, i) => [h, i]));
    const stored = sessionStorage.getItem('panelTarget');
    let cur;
    if (stored !== null) {
      sessionStorage.removeItem('panelTarget');
      cur = Math.max(0, Math.min(TOTAL - 1, parseInt(stored, 10)));
    } else {
      const startHash = window.location.hash.replace('#', '');
      cur = hashToPanel[startHash] ?? 0;
    }
    let locked = false;
    let formFocused = false;
    const isMobile = () => window.innerWidth <= 768;

    // Track form focus globally so scroll/click handlers never interfere
    document.addEventListener('focusin', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { formFocused = true; }
    });
    document.addEventListener('focusout', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { setTimeout(() => { formFocused = false; }, 200); }
    });

    const track    = document.getElementById('track');
    const dotsEl   = document.querySelectorAll('.dot');
    const pills    = document.querySelectorAll('.nav-pill');
    const mobLinks = document.querySelectorAll('.mob-link:not(.mob-cta)');
    const nav      = document.getElementById('nav');
    const arrL     = document.getElementById('arr-l');
    const arrR     = document.getElementById('arr-r');
    const hamburger    = document.getElementById('hamburger');
    const mobileMenu   = document.getElementById('mobile-menu');
    const scrollHint   = document.getElementById('scroll-hint');

    // Panels 0 (Hero), 2 (Comparison), 4 (About), 7 (Contact) have dark backgrounds
    // Dark-bg panels: Hero(0), About(4), FinalCTA(8). ChecklistTeaser(7) is light.
    const darkPanels = new Set([0, 4, 8]);

    // Maps nav index → panel DOM id (in physical #track order)
    // 0:Hero(p0) 1:HowItWorks(p2) 2:Comparison 3:Services 4:About(p3) 5:Work 6:FAQ(p7) 7:ChecklistTeaser 8:FinalCTA(p8)
    const panelIds = ['p0', 'p2', 'comparison', 'services', 'p3', 'samples', 'p7', 'checklist-teaser', 'p8'];

    if (isMobile() && track) {
      track.style.transform = '';
      if (cur > 0) {
        requestAnimationFrame(() => scrollToPanel(cur, false));
      }
    } else if (track && cur > 0) {
      track.style.transform = `translateX(-${cur * 100}vw)`;
    }

    function updateUIVisuals() {
      const panelMap = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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

    function updateUI(push = false) {
      const hash = hashNames[cur] ?? 'home';
      const url  = cur === 0 ? '/' : `#${hash}`;
      if (push) {
        history.pushState({ panel: cur }, '', url);
      } else {
        history.replaceState({ panel: cur }, '', url);
      }
      window.dispatchEvent(new CustomEvent('panelchange', { detail: cur }));
      const panelMap = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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

    function go(n, pushHistory = true) {
      if (isMobile()) { scrollToPanel(n); return; }
      if (locked) return;
      n = Math.max(0, Math.min(TOTAL - 1, n));
      if (n === cur) return;
      cur = n;
      curRef.current = cur;
      locked = true;
      track.style.transform = `translateX(-${cur * 100}vw)`;
      setTimeout(() => { locked = false; }, 750);
      updateUI(pushHistory);
    }

    function scrollToPanel(n, pushHistory = true) {
      n = Math.max(0, Math.min(TOTAL - 1, n));
      cur = n;
      curRef.current = cur;
      const panel = document.getElementById(panelIds[n]);
      if (panel) {
        const offset = Math.round(panel.getBoundingClientRect().top + window.scrollY) + 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      window.closeMenu && window.closeMenu();
      updateUI(pushHistory);
    }

    const handlePopState = (e) => {
      const panel = e.state?.panel ?? 0;
      go(panel, false);
    };
    window.addEventListener('popstate', handlePopState);

    window.go         = go;
    window.goNext     = () => go(cur + 1);
    window.goPrev     = () => go(cur - 1);
    window.mobileGo   = scrollToPanel;

    const handleOutsideClick = (e) => {
      if (formFocused) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'IFRAME' || tag === 'LABEL' || tag === 'A') return;
      if (e.target.closest('a')) return;
      if (e.target.closest('form')) return;
      if (e.target.closest('.calendly-inline-widget')) return;
      if (e.target.closest('.calendly-wrap')) return;
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) window.closeMenu && window.closeMenu();
    };
    document.addEventListener('click', handleOutsideClick);

    let wheelBuf = 0, wheelTimer = null;
    const handleWheel = (e) => {
      if (isMobile()) return;
      if (window.$crisp && window.$crisp.is && window.$crisp.is('chat:opened')) return;
      const crispBox = document.getElementById('crisp-chatbox');
      if (crispBox && crispBox.contains(e.target)) return;

      const panelEl = document.getElementById(panelIds[cur]);
      if (panelEl) {
        // Find the actual scrollable child — only honour overflow guard if it can scroll
        let scrollEl = null;
        const computed = window.getComputedStyle(panelEl);
        if (computed.overflowY === 'auto' || computed.overflowY === 'scroll') {
          scrollEl = panelEl;
        } else {
          const inner = panelEl.querySelector('[class$="-inner"]');
          if (inner) {
            const innerStyle = window.getComputedStyle(inner);
            if (innerStyle.overflowY === 'auto' || innerStyle.overflowY === 'scroll') {
              scrollEl = inner;
            }
          }
        }
        if (scrollEl) {
          const { scrollTop, scrollHeight, clientHeight } = scrollEl;
          const overflows = scrollHeight > clientHeight + 5;
          if (overflows) {
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
            const atTop    = scrollTop <= 5;
            if (e.deltaY > 0 && !atBottom) return;
            if (e.deltaY < 0 && !atTop)    return;
          }
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

    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (isMobile()) {
        if (e.key === 'Escape') window.closeMenu && window.closeMenu();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); go(cur - 1); }
      if (e.key === 'Escape') window.closeMenu && window.closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);

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
        if (active !== cur) {
          cur = active;
          curRef.current = cur;
          // skip replaceState on mobile — hash URL changes can trigger iOS scroll-to-anchor
          updateUIVisuals();
        }
      }, 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scale panel inner containers to fit any monitor height
    const INNER_SELECTORS = [
      '.hero-inner', '.hiw-inner', '.comparison-inner', '.pricing-inner',
      '.about-inner', '.work-inner', '.faq-inner', '.contact-inner',
    ].join(',');
    const BASE_HEIGHT = 1100;
    const NAV_H       = 64;

    function scalePanels() {
      if (isMobile()) {
        document.querySelectorAll(INNER_SELECTORS).forEach(el => {
          el.style.zoom       = '';
          el.style.paddingTop = '';
        });
        return;
      }
      const avail  = window.innerHeight - NAV_H;
      const scale  = Math.min(1, avail / BASE_HEIGHT);
      const compensatedPadding = Math.ceil(88 / scale);
      document.querySelectorAll(INNER_SELECTORS).forEach(el => {
        el.style.zoom       = scale;
        el.style.paddingTop = compensatedPadding + 'px';
      });
    }
    scalePanels();

    let _lastW = window.innerWidth;
    const handleResize = () => {
      const w = window.innerWidth;
      if (w === _lastW) return;
      _lastW = w;
      if (isMobile()) {
        document.body.style.overflow  = '';
        document.body.style.position  = '';
        document.body.style.height    = '';
        track.style.transform         = '';
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
      window.removeEventListener('popstate', handlePopState);
      delete window.go;
      delete window.goNext;
      delete window.goPrev;
      delete window.mobileGo;
    };
  }, []);

  return curRef;
}
