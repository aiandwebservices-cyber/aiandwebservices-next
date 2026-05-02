import Button from './Button';

export type PricingTier = {
  name: string;
  price: string;
  setup: string;
  meta: string;
  includes: string[];
  excludes?: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: 'filled' | 'outline';
  featured?: boolean;
  badge?: string;
};

export default function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <article className={`lp-price-card ${tier.featured ? 'lp-price-card--featured' : ''}`}>
      {tier.badge && <span className="lp-price-card__badge">{tier.badge}</span>}
      <div className="lp-price-card__tier">{tier.name}</div>
      <div className="lp-price-card__price">
        {tier.price} <small>/ mo</small>
      </div>
      <div className="lp-price-card__meta">
        + {tier.setup} setup · {tier.meta}
      </div>
      <ul className="lp-price-card__list">
        {tier.includes.map((f) => (
          <li className="in" key={f}>{f}</li>
        ))}
        {tier.excludes?.map((f) => (
          <li className="out" key={f}>{f}</li>
        ))}
      </ul>
      <Button
        href={tier.ctaHref}
        variant={tier.ctaVariant}
        external={tier.ctaHref.startsWith('http')}
      >
        {tier.ctaLabel}
      </Button>
    </article>
  );
}
