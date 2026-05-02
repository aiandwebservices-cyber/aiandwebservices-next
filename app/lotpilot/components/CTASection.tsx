import Button from './Button';
import AnimatedSection from './AnimatedSection';

const DEMO_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';

type Props = {
  heading?: string;
  sub?: string;
};

export default function CTASection({
  heading = 'Ready to put your lot on autopilot?',
  sub = 'Book a 15-minute call. Live in 5 business days or less.',
}: Props) {
  return (
    <section className="lp-section lp-final-cta">
      <div className="lp-container">
        <AnimatedSection animation="fade">
          <h2>{heading}</h2>
          <p className="lp-final-cta__sub">{sub}</p>
          <Button href={DEMO_URL} variant="filled" size="lg" external>
            Book a demo →
          </Button>
          <div className="lp-final-cta__contact">
            <a href="mailto:demo@lotpilot.ai">demo@lotpilot.ai</a>
            {' · '}
            <a href="tel:+13155720710">315-572-0710</a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
