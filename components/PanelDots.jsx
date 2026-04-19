'use client';
import { useEffect, useState } from 'react';

const PANELS = [
  { id: 'p0',         label: 'Home' },
  { id: 'p2',         label: 'How It Works' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'services',   label: 'Services' },
  { id: 'p3',         label: 'About' },
  { id: 'samples',    label: 'Work' },
  { id: 'p7',         label: 'FAQ' },
];

export default function PanelDots() {
  const [activeId, setActiveId] = useState('p0');

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: [0.5] }
    );

    PANELS.forEach(p => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTap = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="panel-dots" aria-label="Page sections">
      {PANELS.map(p => (
        <button
          key={p.id}
          className={`panel-dot${activeId === p.id ? ' active' : ''}`}
          onClick={() => handleTap(p.id)}
          aria-label={`Jump to ${p.label}`}
          aria-current={activeId === p.id ? 'true' : 'false'}
        >
          <span className="panel-dot-visual" />
        </button>
      ))}
    </div>
  );
}
