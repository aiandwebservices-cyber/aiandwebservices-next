import type { SiteConfig } from "@/lib/site-config";

// TODO(David) — replace these placeholders with confirmed values before launch.
// Until they're set, badges render with visible "TODO" labels so it's obvious
// what still needs filling in.
const TRUST_TODO = {
  // Google Business Profile review count + URL
  googleReviewCount: null as number | null,           // e.g. 47
  googleBusinessProfileUrl: null as string | null,    // e.g. https://g.page/r/...
  // BBB accreditation status — null = unconfirmed, true = accredited, false = not accredited
  bbbAccredited: null as boolean | null,
  // NY-specific license number — FL has FL Mold Lic. #MRSR5155 already
  nyLicenseNumber: null as string | null,             // e.g. "NY Lic. #..."
};

const FL_LICENSE_LABEL = "FL Mold Lic. #MRSR5155";

type Badge = { icon: string; text: string; href?: string | null };

export default function TrustBar({ config }: { config: SiteConfig }) {
  const isFL = config.location === "florida";

  const reviewText = TRUST_TODO.googleReviewCount != null
    ? `4.9 from ${TRUST_TODO.googleReviewCount} Google Reviews`
    : "4.9 from TODO Google Reviews";

  const bbbText = TRUST_TODO.bbbAccredited === true
    ? "BBB Accredited"
    : "BBB Accredited — TODO confirm";

  const licenseText = isFL
    ? FL_LICENSE_LABEL
    : (TRUST_TODO.nyLicenseNumber ?? "NY License — TODO add");

  const badges: Badge[] = [
    { icon: "★", text: reviewText, href: TRUST_TODO.googleBusinessProfileUrl },
    { icon: "✓", text: bbbText },
    { icon: "🛡", text: licenseText },
    { icon: "🏆", text: "10+ Years Experience" },
  ];

  return (
    <section className="trust-bar-section" aria-label="Trust signals">
      <div className="trust-bar-inner">
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
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
        }
        .trust-badge-link:hover { background: #f0f4f9; }
        .trust-icon { color: var(--red); font-size: 16px; flex-shrink: 0; }
        .trust-text { flex: 1 1 auto; }
        @media (min-width: 768px) {
          .trust-bar-section { padding: 32px 16px; }
          .trust-bar-inner {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }
          .trust-badge { font-size: 15px; padding: 12px 16px; min-height: 52px; }
          .trust-icon { font-size: 18px; }
        }
      `}</style>
    </section>
  );
}
