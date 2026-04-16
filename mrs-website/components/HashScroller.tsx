"use client";

import { useEffect } from "react";

export default function HashScroller() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    // Small delay lets the page fully render before scrolling
    const id = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(id);
  }, []);

  return null;
}
