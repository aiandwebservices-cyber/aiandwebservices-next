import type { Metadata } from 'next';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import ContactForm from './ContactForm';
import { MailIcon, PhoneIcon, PinIcon } from '../components/AgentIcons';

export const metadata: Metadata = {
  title: 'Contact — LotPilot.ai',
  description:
    'Talk to a human. Book a 15-minute demo or send us a message. demo@lotpilot.ai · 315-572-0710',
};

const DEMO_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';

export default function ContactPage() {
  return (
    <main>
      <section className="lp-section" style={{ paddingTop: 'clamp(120px, 14vw, 180px)' }}>
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Contact</span>
            <h1>Talk to a human.</h1>
            <p className="lp-lead" style={{ marginTop: 20 }}>
              Send a message, call, or just put 15 minutes on the calendar. Whatever works.
              Real people. Same day response.
            </p>
          </AnimatedSection>

          <div className="lp-contact-grid">
            <AnimatedSection animation="fade">
              <ContactForm />
            </AnimatedSection>

            <AnimatedSection animation="slide-r" className="lp-contact-side">
              <h3>Or just book a call</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15 }}>
                15 minutes. Live demo on your inventory. No slides. No pressure.
              </p>
              <Button href={DEMO_URL} variant="filled" external>
                Book a 15-min demo →
              </Button>

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="item">
                  <div className="icon"><MailIcon /></div>
                  <div>
                    <div className="label">Email</div>
                    <a className="val" href="mailto:demo@lotpilot.ai">demo@lotpilot.ai</a>
                  </div>
                </div>
                <div className="item">
                  <div className="icon"><PhoneIcon /></div>
                  <div>
                    <div className="label">Phone</div>
                    <a className="val" href="tel:+13155720710">315-572-0710</a>
                  </div>
                </div>
                <div className="item">
                  <div className="icon"><PinIcon /></div>
                  <div>
                    <div className="label">Office</div>
                    <span className="val">Miami, FL</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="lp-section lp-section--off" style={{ paddingTop: 0 }}>
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <div
              style={{
                height: 320,
                borderRadius: 'var(--lp-r-xl)',
                border: '1px solid var(--lp-border)',
                background:
                  'linear-gradient(135deg, var(--lp-blue-light) 0%, #fff 60%), radial-gradient(circle at 70% 30%, rgba(196,43,43,0.18), transparent 50%)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--lp-navy)',
                fontFamily: 'var(--lp-display)',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.01em',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                <div
                  style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--lp-red)', color: '#fff',
                    display: 'grid', placeItems: 'center',
                    margin: '0 auto 16px',
                    boxShadow: 'var(--lp-shadow-red)',
                  }}
                >
                  <PinIcon />
                </div>
                Miami, FL
                <div style={{ fontFamily: 'var(--lp-body)', fontWeight: 500, fontSize: 14, color: 'var(--lp-muted)', marginTop: 6 }}>
                  Serving dealers nationwide
                </div>
              </div>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage:
                    'linear-gradient(to right, rgba(27,58,107,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,58,107,0.06) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
