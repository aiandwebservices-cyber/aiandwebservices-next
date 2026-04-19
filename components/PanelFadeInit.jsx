'use client';
import { useEffect } from 'react';

const PANEL_IDS = ['p0', 'p2', 'comparison', 'services', 'p3', 'samples', 'p7', 'p8'];

export default function PanelFadeInit() {
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    PANEL_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('panel-fade');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    PANEL_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
