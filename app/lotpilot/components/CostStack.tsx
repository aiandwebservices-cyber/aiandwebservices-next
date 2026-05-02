import AnimatedSection from './AnimatedSection';

type Item = { label: string; cost: string };

type Props = {
  badTitle: string;
  badItems: Item[];
  badTotal: string;
  goodTitle: string;
  goodPrice: string;
  goodMeta?: string;
  goodItems: string[];
};

export default function CostStack({
  badTitle,
  badItems,
  badTotal,
  goodTitle,
  goodPrice,
  goodMeta,
  goodItems,
}: Props) {
  return (
    <div className="lp-stack">
      <AnimatedSection animation="slide-l" className="lp-stack__col lp-stack__col--bad">
        <div className="lp-stack__title">{badTitle}</div>
        <ul>
          {badItems.map((it) => (
            <li key={it.label}>
              <span>{it.label}</span>
              <span className="cost">{it.cost}</span>
            </li>
          ))}
        </ul>
        <div className="lp-stack__total">
          <span>Total</span>
          <span className="lp-stack__total-num">{badTotal}</span>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-r" className="lp-stack__col lp-stack__col--good">
        <div className="lp-stack__title">{goodTitle}</div>
        <div className="lp-stack__price">
          {goodPrice} <small>/ mo</small>
        </div>
        {goodMeta && <div className="lp-stack__meta">{goodMeta}</div>}
        <ul>
          {goodItems.map((it) => (
            <li key={it}>
              <span className="lp-check">✓</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </AnimatedSection>
    </div>
  );
}
