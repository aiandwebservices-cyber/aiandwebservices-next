"use client";
import { useEffect } from "react";

export default function TallyForm() {
  useEffect(() => {
    const w = "https://tally.so/widgets/embed.js";
    if (typeof (window as any).Tally !== "undefined") {
      (window as any).Tally.loadEmbeds();
    } else if (!document.querySelector(`script[src="${w}"]`)) {
      const s = document.createElement("script");
      s.src = w;
      s.onload = () => (window as any).Tally?.loadEmbeds();
      s.onerror = () => (window as any).Tally?.loadEmbeds();
      document.body.appendChild(s);
    }
  }, []);

  return (
    <iframe
      data-tally-src="https://tally.so/embed/9qEV1Q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="821"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="AIandWEBservices.com"
    />
  );
}
