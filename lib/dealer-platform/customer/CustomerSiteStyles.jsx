'use client';
import { C } from './_internals';

/**
 * CustomerSiteStyles — page-level CSS for the customer site shell.
 *
 * Holds animation keyframes, accessibility-mode overrides (large font,
 * high contrast, reduced motion), input chrome, and responsive breakpoints
 * (1080px tablet, 760px phone). Uses C.* template-literal refs so theme
 * switches via THEMES still apply correctly.
 *
 * Pulled out of CustomerSite.jsx to keep the orchestration shell focused
 * on state + JSX composition.
 */
export function CustomerSiteStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; background: ${C.bg}; -webkit-font-smoothing: antialiased; }
      body { margin: 0; background: ${C.bg}; color: ${C.ink}; font-size: 15px; line-height: 1.55; font-family: "Plus Jakarta Sans", -apple-system, sans-serif; }

      h1, h2 { font-weight: 800 !important; }

      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideRise { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pinPulse { 0%, 100% { box-shadow: 0 0 0 8px rgba(255,31,45,0.2); } 50% { box-shadow: 0 0 0 16px rgba(255,31,45,0); } }
      @keyframes chatPulse { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.8); } }
      @keyframes chatSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 30px ${C.gold}30; } 50% { box-shadow: 0 0 60px ${C.gold}60; } }
      @keyframes scrollBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
      @keyframes heroBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

      [data-fontscale="lg"] { zoom: 1.2; -moz-transform: scale(1.2); -moz-transform-origin: 0 0; }
      [data-hc="true"] {
        --c-bg: #000000 !important; --c-bg2: #000000 !important; --c-panel: #000000 !important;
        --c-rule: #FFFFFF !important; --c-rule2: #FFFFFF !important;
        --c-ink: #FFFFFF !important; --c-inkDim: #FFFFFF !important; --c-inkLow: #DDDDDD !important;
        --c-cyan: #FFFFFF !important; --c-glass: #000000 !important;
      }
      [data-hc="true"] *:not(input):not(select):not(textarea) {
        background-image: none !important; backdrop-filter: none !important; box-shadow: none !important;
      }
      [data-hc="true"] svg path { stroke: #FFFFFF !important; }
      [data-noanim="true"] *,
      [data-noanim="true"] *::before,
      [data-noanim="true"] *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }

      input::placeholder, textarea::placeholder {
        color: ${C.inkLow}; letter-spacing: 1.5px; font-size: 13px !important; text-transform: uppercase;
      }
      input:focus, select:focus, textarea:focus {
        outline: 2px solid #2AA5A0 !important; outline-offset: 2px;
        border-bottom-color: #2AA5A0 !important; color: ${C.ink};
      }
      input[style]:focus, textarea[style]:focus {
        outline: none !important; border-bottom-color: #2AA5A0 !important;
      }

      .fleet-card { border-radius: 12px !important; overflow: hidden !important; transition: transform 200ms ease-out, box-shadow 200ms ease-out !important; }
      .fleet-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(42,165,160,0.15) !important; }

      a, button { transition: all 200ms ease-out; }

      .hero-search-input:focus { outline: none !important; border-color: #2AA5A0 !important; }
      .scroll-down-indicator { animation: heroBounce 1.8s ease-in-out infinite; }

      .mobile-filter-btn { display: none; }
      .mobile-call-btn  { display: none; }

      @media (max-width: 1080px) {
        .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; padding: 28px 32px 28px 96px !important; gap: 20px !important; }
        .hero-img { min-height: 200px !important; }
        .bodytype-section { padding: 16px 24px 16px 96px !important; }
        .search-row { display: none !important; }
        .search-row.open { display: grid !important; grid-template-columns: repeat(2, 1fr) auto !important; }
        .search-row.open > div { border-bottom: 1px solid ${C.rule}; }
        .mobile-filter-btn { display: inline-block !important; }
        .fleet-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        .trade-grid, .finance-split, .alerts-grid, .contact-split, .voices-grid { grid-template-columns: 1fr !important; }
        .finance-split > div:first-child, .contact-split > div:first-child { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
        .voices-grid > article { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
        .notebook-grid { grid-template-columns: 1fr !important; }
        .notebook-grid > article { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
        .process-grid { grid-template-columns: 1fr 1fr !important; }
        .process-line { display: none !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
        .preowned-grid { grid-template-columns: 1fr !important; }
        .preowned-grid > div { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
        .preowned-grid > div:last-child { border-bottom: none !important; }
        .counters-grid { grid-template-columns: 1fr !important; }
        .service-grid { grid-template-columns: 1fr !important; }
        .service-grid > div:first-child { border-right: none !important; border-bottom: 1px solid ${C.rule} !important; }
        .warranty-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
        .warranty-grid > div { margin: 0 !important; border-left: 1px solid ${C.rule} !important; }
        .team-grid { grid-template-columns: 1fr 1fr !important; }
        .srv-row3 { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 760px) {
        .side-rail { width: 64px !important; }
        .marquee-bar { left: 64px !important; }
        .page-main { margin-left: 64px !important; padding-bottom: 64px !important; }
        .textus-btn { left: 64px !important; padding: 10px 8px !important; font-size: 11px !important; }
        .beat-badge { bottom: 170px !important; max-width: 180px !important; padding: 10px 12px !important; }
        .beat-badge > div:last-child { font-size: 12px !important; }
        .chat-bubble { right: 16px !important; bottom: 76px !important; width: 52px !important; height: 52px !important; }
        .chat-panel { right: 12px !important; bottom: 140px !important; width: calc(100vw - 24px) !important; }
        .a11y-btn { left: 80px !important; bottom: 76px !important; width: 42px !important; height: 42px !important; }
        .a11y-panel { left: 80px !important; bottom: 130px !important; width: calc(100vw - 96px) !important; max-width: 280px; }
        .mobile-call-btn { display: block !important; }
        .fleet-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
        .fleet-pad { padding-left: 64px !important; padding-right: 16px !important; }
        .bodytype-section { padding: 14px 16px 14px 64px !important; }
        .fleet-controls { gap: 8px !important; }
        .team-grid { grid-template-columns: 1fr !important; }
        .srv-row3 { grid-template-columns: 1fr !important; }
        .hero-grid { padding: 24px 16px 24px 64px !important; }
        .charter-row { grid-template-columns: 60px 1fr !important; gap: 16px !important; }
        .charter-row > div:nth-child(3), .charter-row > div:nth-child(4) {
          grid-column: 1 / -1; padding-left: 76px;
        }
        .process-grid { grid-template-columns: 1fr !important; }
        .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        .voices-grid { grid-template-columns: 1fr !important; }
      }

      @keyframes dealerPulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(212,175,55,0.35); }
        50%      { box-shadow: 0 4px 36px rgba(212,175,55,0.72); }
      }
      .dealer-btn {
        position: fixed; top: 38px; left: calc(50% + 48px); transform: translateX(-50%);
        z-index: 90; background: #D4AF37; color: #0a0a0a;
        font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; letter-spacing: 0.3px;
        padding: 13px 24px; border-radius: 50px; text-decoration: none; white-space: nowrap;
        box-shadow: 0 4px 20px rgba(212,175,55,0.35);
        animation: dealerPulse 2.5s ease-in-out infinite;
        transition: filter 0.15s;
      }
      .dealer-btn:hover { transform: translateX(-50%) scale(1.04); filter: brightness(1.08); }
      @media (max-width: 760px) {
        .dealer-btn { top: 38px; left: calc(50% + 32px); font-size: 11px; padding: 8px 12px; animation: none; box-shadow: 0 2px 10px rgba(212,175,55,0.25); }
      }
    `}</style>
  );
}

export default CustomerSiteStyles;
