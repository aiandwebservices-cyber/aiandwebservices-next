import type { Metadata } from 'next';
import AnimatedSection from '../components/AnimatedSection';
import CTASection from '../components/CTASection';

export const metadata: Metadata = {
  title: 'About — LotPilot.ai',
  description:
    'Built by AIandWEBservices in Miami, FL. We make enterprise-grade dealer technology accessible to independent dealers.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="lp-section" style={{ paddingTop: 'clamp(120px, 14vw, 180px)' }}>
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">About</span>
            <h1>Built for the dealers the big guys forgot.</h1>
            <p className="lp-lead" style={{ marginTop: 24 }}>
              Independent dealers are the backbone of the used-car market. They&apos;re also priced
              out of every modern tool the big franchise stores take for granted. We built LotPilot
              to fix that — one agent at a time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Our Story</span>
            <h2>From a Miami garage to your lot.</h2>
          </AnimatedSection>

          <div className="lp-story">
            <AnimatedSection animation="slide-l" className="lp-story-card">
              <div className="num">01 — The Problem</div>
              <h3>Independent dealers were stuck.</h3>
              <p>
                We watched dealer after dealer juggle 5 separate vendors — a $1,500/mo website,
                a $500/mo chatbot, a $500/mo pricing tool, a $300/mo CRM, plus the F&amp;I tools
                they had to bolt on. Tools that didn&apos;t talk to each other. Tools built in 2008.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slide-r" className="lp-story-card">
              <div className="num">02 — The Insight</div>
              <h3>The math changed.</h3>
              <p>
                AI doesn&apos;t cost what it used to. A conversation that would have required a $40k/yr
                BDR now costs two cents. A description that took an hour now takes a tenth of a second.
                The technology to replace $30k/yr of dealer software now fits in a $999/mo subscription.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slide-l" className="lp-story-card">
              <div className="num">03 — The Approach</div>
              <h3>AI-first, not AI-bolted-on.</h3>
              <p>
                Most "AI" you see in dealer software is a chatbot duct-taped to a 15-year-old CRM.
                We built LotPilot the other way around — six purpose-built agents at the core, with
                the platform engineered to give them the data they need to actually be useful.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slide-r" className="lp-story-card">
              <div className="num">04 — The Mission</div>
              <h3>Make enterprise tech accessible.</h3>
              <p>
                Every independent dealer should have the same toolset as a 50-store franchise group.
                That&apos;s the whole job. We measure success by one number: how many dealers we can
                keep independent, profitable, and growing.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Team</span>
            <h2>One person you can actually call.</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              No reseller layer. No outsourced support. When you sign up, you get the founder&apos;s
              direct line.
            </p>
          </AnimatedSection>

          <AnimatedSection
            animation="fade"
            className="lp-story-card"
            style={{ marginTop: 40, maxWidth: 640 }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--lp-navy) 0%, var(--lp-red) 100%)',
                marginBottom: 24,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontFamily: 'var(--lp-display)',
                fontWeight: 800,
                fontSize: 32,
                letterSpacing: '-0.04em',
              }}
            >
              DP
            </div>
            <h3>David Pulis · Founder</h3>
            <p style={{ marginTop: 10 }}>
              Built AIandWEBservices in Miami in 2023. Spent the last two years embedded with
              independent dealers — building, breaking, rebuilding. LotPilot is what came out the
              other side.
            </p>
            <p style={{ marginTop: 14, fontSize: 14, color: 'var(--lp-muted)' }}>
              <a href="mailto:demo@lotpilot.ai" style={{ color: 'var(--lp-red)', fontWeight: 700 }}>
                demo@lotpilot.ai
              </a>{' '}
              ·{' '}
              <a href="tel:+13155720710" style={{ color: 'var(--lp-red)', fontWeight: 700 }}>
                315-572-0710
              </a>
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade" delay={150}>
            <p
              style={{
                marginTop: 56,
                fontSize: 14,
                color: 'var(--lp-muted)',
                letterSpacing: '0.05em',
              }}
            >
              A product by{' '}
              <a
                href="https://aiandwebservices.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--lp-red)', fontWeight: 700 }}
              >
                AIandWEBservices
              </a>{' '}
              · Miami, FL
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        heading={"Want to see what we’re building?"}
        sub="15 minutes. Live demo on your inventory. Zero pressure."
      />
    </main>
  );
}
