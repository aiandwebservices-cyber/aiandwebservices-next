import type { SiteConfig } from "@/lib/site-config";

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ENABLE A TRUST BADGE
//
// To turn a badge ON, set its value in TRUST_TODO below.
//   • Empty string, null, or false       = badge stays hidden.
//   • Confirmed value (number / true / string) = badge renders.
//
// Examples:
//   googleReviewCount: 47,
//   googleBusinessProfileUrl: 'https://g.page/r/...',
//   bbbAccredited: true,
//   nyLicenseNumber: 'NY Lic. #12345',
//
// The "10+ Years Experience" badge is always on (no TODO).
// The FL License badge is hardcoded and shows on FL pages only.
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_TODO = {
  googleReviewCount: null as number | null,
  googleBusinessProfileUrl: null as string | null,
  bbbAccredited: false as boolean,
  nyLicenseNumber: null as string | null,
};

const FL_LICENSE_LABEL = "FL Lic. #MRSR5155";

type Badge = { icon: string; text: string; href?: string | null };

export default function TrustBar({ config }: { config: SiteConfig }) {
  const isFL = config.location === "florida";

  const badges: Badge[] = [];

  // Google reviews — show only when count is confirmed
  if (TRUST_TODO.googleReviewCount && TRUST_TODO.googleReviewCount > 0) {
    badges.push({
      icon: "★",
      text: `4.9 from ${TRUST_TODO.googleReviewCount} Google Reviews`,
      href: TRUST_TODO.googleBusinessProfileUrl || null,
    });
  }

  // BBB — show only when explicitly accredited
  if (TRUST_TODO.bbbAccredited === true) {
    badges.push({ icon: "✓", text: "BBB Accredited" });
  }

  // License — FL always shows; NY only when license number is provided
  if (isFL) {
    badges.push({ icon: "🛡", text: FL_LICENSE_LABEL });
  } else if (TRUST_TODO.nyLicenseNumber && TRUST_TODO.nyLicenseNumber.trim()) {
    badges.push({ icon: "🛡", text: TRUST_TODO.nyLicenseNumber });
  }

  // Experience — always on
  badges.push({ icon: "🏆", text: "10+ Years Experience" });

  if (badges.length === 0) return null;

  return (
    <section className="trust-bar-section" aria-label="Trust signals">
      <div className="trust-bar-inner" data-count={badges.length}>
        {badges.map((b, i) => {
          const inner = (
            <>
              <span className="trust-icon" aria-hidden="true">{b.icon}</span>
              <span className="trust-text">{b.text}</span>
            </>
          );
          return b.href ? (
            <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className="trust-badge trust-badge-link">{inner}</a>
          ) : (
            <div key={i} className="trust-badge">{inner}</div>
          );
        })}
      </div>
      <style>{`
        .trust-bar-section {
          background: #fff;
          padding: 20px 16px;
          border-top: 1px solid var(--gray-light);
          border-bottom: 1px solid var(--gray-light);
        }
        .trust-bar-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          gap: 12px;
        }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid var(--gray-light);
          background: #fafbfc;
          border-radius: 8px;
          font-family: Montserrat, sans-serif;
          font-weight: 600;
          color: var(--navy);
          font-size: 13px;
          text-decoration: none;
          line-height: 1.3;
          min-height: 44px;
          flex: 0 1 auto;
          max-width: 280px;
        }
        .trust-badge-link:hover { background: #f0f4f9; }
        .trust-icon { color: var(--red); font-size: 16px; flex-shrink: 0; }
        .trust-text { flex: 1 1 auto; }

        /* Mobile: 3-4 badges → 2x2 grid; 1-2 badges → centered single row */
        @media (max-width: 767px) {
          .trust-bar-inner[data-count="3"],
          .trust-bar-inner[data-count="4"] {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .trust-bar-inner[data-count="3"] .trust-badge,
          .trust-bar-inner[data-count="4"] .trust-badge {
            max-width: none;
          }
        }

        /* Desktop: always horizontal row, centered, evenly spaced */
        @media (min-width: 768px) {
          .trust-bar-section { padding: 32px 16px; }
          .trust-bar-inner { gap: 32px; }
          .trust-badge { font-size: 15px; padding: 12px 16px; min-height: 52px; max-width: none; }
          .trust-icon { font-size: 18px; }
        }
      `}</style>
    </section>
  );
}
