'use client';

import { useState } from 'react';

export type FAQItem = { q: string; a: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="lp-faq">
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div className={`lp-faq__item ${isOpen ? 'is-open' : ''}`} key={item.q}>
            <button
              className="lp-faq__btn"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="lp-faq__icon" aria-hidden="true">+</span>
            </button>
            <div className="lp-faq__panel" role="region">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
