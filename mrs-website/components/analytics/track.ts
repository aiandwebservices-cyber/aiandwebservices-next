// Thin gtag wrapper. Safe in SSR (returns early when window/gtag are missing).
// Every event includes page_path so FL vs NY can be segmented in GA4.

type GtagFn = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, {
    page_path: window.location.pathname,
    ...params,
  });
}
