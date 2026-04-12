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
    const isMobile = () => window.innerWidth <= 768;

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

    const visiblePanels = () =>
      Array.from(document.querySelectorAll('.panel')).filter(p => getComputedStyle(p).display !== 'none');

    function scrollToPanel(n) {
      n = Math.max(0, Math.min(TOTAL - 1, n));
      cur = n;
      curRef.current = cur;
      const panels = visiblePanels();
      if (panels[n]) {
        const offset = panels[n].getBoundingClientRect().top + window.scrollY - 60;
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
      if (!isMobile()) document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
      if (!isMobile()) document.body.style.overflow = '';
    }

    // Expose functions globally so onclick attributes work
    window.go = go;
    window.goNext = () => go(cur + 1);
    window.goPrev = () => go(cur - 1);
    window.mobileGo = scrollToPanel;
    window.toggleMenu = toggleMenu;

    // Click outside closes menu
    const handleOutsideClick = (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    };
    document.addEventListener('click', handleOutsideClick);

    // Desktop wheel → horizontal
    let wheelBuf = 0, wheelTimer = null;
    const handleWheel = (e) => {
      if (isMobile()) return;
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

    // Mobile scroll spy
    const handleScroll = () => {
      if (!isMobile()) return;
      const panels = visiblePanels();
      let active = 0;
      panels.forEach((p, i) => {
        if (p.getBoundingClientRect().top <= 80) active = i;
      });
      if (active !== cur) { cur = active; curRef.current = cur; updateUI(); }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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
