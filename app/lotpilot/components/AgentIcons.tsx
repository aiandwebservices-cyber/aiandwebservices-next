/* Custom SVG icon set for the 6 LotPilot agents — distinctive, weighted, navy/red friendly */

const stroke = { strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const SalesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M4 14a10 10 0 1 1 4 8L4 23l1-4.5A9.96 9.96 0 0 1 4 14z" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="18" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const DescriptionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M5 6h18M5 11h18M5 16h12M5 21h8" />
    <path d="M21 18l3 3-2 2-3-3 2-2z" fill="currentColor" />
  </svg>
);

export const ScorerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M4 22V8m6 14V4m6 18v-8m6 8V12" />
    <circle cx="10" cy="4" r="1.6" fill="currentColor" />
    <circle cx="22" cy="12" r="1.6" fill="currentColor" />
  </svg>
);

export const PriceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M14 4l9 9-9 11-9-11 9-9z" />
    <text x="14" y="17" textAnchor="middle" fontSize="9" fontWeight="800" fill="currentColor" stroke="none">$</text>
  </svg>
);

export const FollowUpIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M3 8a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H10l-5 4v-4H6a3 3 0 0 1-3-3V8z" />
    <path d="M9 11l5 4 5-4" />
  </svg>
);

export const ReviewIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" {...stroke}>
    <path d="M14 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
  </svg>
);

/* Platform feature icons */
export const CrmIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <circle cx="9" cy="9" r="3.5" />
    <path d="M3 21c0-3.5 3-6 6-6s6 2.5 6 6M16 5h5M16 9h5M16 13h3" />
  </svg>
);
export const FniIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 11h18M7 16h4" />
  </svg>
);
export const InventoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <path d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4 9-4M12 11v10" />
  </svg>
);
export const SiteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M7 13h6M7 16h4" />
  </svg>
);
export const DashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <path d="M12 4a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8zM12 12l5-3" />
  </svg>
);
export const AutomationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H16M6 8.5V16M16 18H8.5M18 16V8.5" />
  </svg>
);
export const SyndicationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);
export const AnalyticsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <path d="M4 20V10m6 10V4m6 16v-8m6 8V14" />
  </svg>
);

/* Contact icons */
export const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
export const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
export const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke}>
    <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
