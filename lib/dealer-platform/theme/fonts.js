/**
 * Font configuration for dealer-platform components.
 *
 * Two strategies in play across the platform:
 *  1) Customer-facing site (CustomerSite.jsx): uses next/font loaded in the
 *     dealer's layout.jsx — exposes CSS vars --font-oswald, --font-inter, --font-mono.
 *  2) Admin panel (AdminPanel.jsx): currently uses Google Fonts CDN via FontStyles
 *     <style> block (Fraunces / Manrope / JetBrains Mono). Future work: migrate
 *     to next/font for zero-CLS.
 *
 * The string constants here are the CSS font-family stacks used in style props.
 */

export const FONT_STACKS = {
  // Customer site — racing/dossier aesthetic
  display: 'var(--font-oswald), "Oswald", "Bebas Neue", Impact, sans-serif',
  body:    'var(--font-inter), -apple-system, sans-serif',
  mono:    'var(--font-mono), "JetBrains Mono", "IBM Plex Mono", monospace',

  // Admin panel — Fraunces / Manrope (loaded via FontStyles block)
  adminDisplay: '"Fraunces", "Iowan Old Style", Georgia, serif',
  adminUI:      '"Manrope", system-ui, -apple-system, sans-serif',
  adminMono:    '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace',
};

/**
 * Google Fonts import URL for the admin panel.
 * Loaded via a <style>@import</style> block in AdminPanel's FontStyles atom.
 */
export const ADMIN_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap';
