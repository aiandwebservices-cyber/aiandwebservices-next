import AnimatedSection from './AnimatedSection';

type Row = { label: string; cost: string };

type Props = {
  badRows?: Row[];
  badTotal?: string;
  goodTotal?: string;
  saveLabel?: string;
};

const DEFAULT_BAD: Row[] = [
  { label: 'DealerOn Website', cost: '$1,499/mo' },
  { label: 'DealerAI Chatbot', cost: '$500/mo' },
  { label: 'vAuto Pricing', cost: '$500/mo' },
  { label: 'VinSolutions CRM', cost: '$300/mo' },
];

export default function ComparisonTable({
  badRows = DEFAULT_BAD,
  badTotal = '$2,799/mo',
  goodTotal = '$999/mo',
  saveLabel = 'Save $21,600/yr',
}: Props) {
  return (
    <div className="lp-compare">
      <AnimatedSection animation="slide-l" className="lp-compare__col lp-compare__col--bad">
        <div className="lp-compare__title">What you pay now</div>
        {badRows.map((r) => (
          <div className="lp-compare__row" key={r.label}>
            <span>{r.label}</span>
            <span>{r.cost}</span>
          </div>
        ))}
        <div className="lp-compare__row lp-compare__row--total">
          <span>Total</span>
          <span className="price">{badTotal}</span>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-r" className="lp-compare__col lp-compare__col--good">
        <div className="lp-compare__title">LotPilot Professional</div>
        <div className="lp-compare__row"><span>Everything above</span><span className="lp-check">✓</span></div>
        <div className="lp-compare__row"><span>+ 6 AI agents</span><span className="lp-check">✓</span></div>
        <div className="lp-compare__row"><span>+ F&amp;I tools</span><span className="lp-check">✓</span></div>
        <div className="lp-compare__row"><span>+ Full automation</span><span className="lp-check">✓</span></div>
        <div className="lp-compare__row lp-compare__row--total">
          <span>Total</span>
          <span className="price">{goodTotal}</span>
        </div>
        <span className="lp-save-badge">⚡ {saveLabel}</span>
      </AnimatedSection>
    </div>
  );
}
