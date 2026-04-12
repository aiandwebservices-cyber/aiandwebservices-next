'use client';

export default function Hero() {
  return (
    <section className="panel" id="p0" aria-label="AI automation and web services for small businesses">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-inner">
        <div className="hero-left">
          <h1 className="hero-h1">
            Stop losing leads to<br/>
            businesses with <span className="accent">better<br/>tech than you.</span>
          </h1>
          <p className="hero-sub">
            I build the systems that <strong>capture leads</strong>, <strong>convert visitors</strong>, and <strong>follow up automatically</strong> — all connected, all done for you.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => window.go(7)}>Get a Free AI Audit</button>
            <button className="btn-ghost-w" onClick={() => window.go(1)}>How It Works</button>
          </div>
          <div className="hero-bottom">
            <div className="trust-badge">
              <div className="tb-icon">✅</div>
              <div className="tb-text">
                <div className="tb-main">No Contracts</div>
                <div className="tb-sub">Cancel Anytime</div>
              </div>
            </div>
            <div className="trust-badge">
              <div className="tb-icon">🤝</div>
              <div className="tb-text">
                <div className="tb-main">Direct Access</div>
                <div className="tb-sub">to David</div>
              </div>
            </div>
            <div className="trust-badge">
              <div className="tb-icon">🎯</div>
              <div className="tb-text">
                <div className="tb-main">Free Audit</div>
                <div className="tb-sub">Included</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-eyebrow" style={{marginBottom:'16px'}}><span className="edot"></span> AI Automation &amp; Web Services for Small Businesses</div>
          <div className="funnel-card fc-ai">
            <div className="fc-icon">🤖</div>
            <div className="fc-body"><div className="fc-title">A chatbot that handles your inquiries &amp; books calls</div><div className="fc-desc">So you stop losing leads who don&apos;t want to wait for a reply</div></div>
          </div>
          <div className="funnel-arrow">↓</div>
          <div className="funnel-card fc-web">
            <div className="fc-icon">🌐</div>
            <div className="fc-body"><div className="fc-title">A fast website that converts visitors into customers</div><div className="fc-desc">Built to rank on Google and built to close — not just look good</div></div>
          </div>
          <div className="funnel-arrow">↓</div>
          <div className="funnel-card fc-seo">
            <div className="fc-icon">📈</div>
            <div className="fc-body"><div className="fc-title">SEO that brings the right people to your door</div><div className="fc-desc">Consistent organic traffic without paying for every click</div></div>
          </div>
          <div className="funnel-arrow">↓</div>
          <div className="funnel-card fc-mkt">
            <div className="fc-icon">🎯</div>
            <div className="fc-body"><div className="fc-title">Automated follow-up that nurtures leads while you work</div><div className="fc-desc">Email sequences and CRM workflows that close deals on autopilot</div></div>
          </div>
          <div className="funnel-arrow">↓</div>
          <div className="funnel-card fc-cs">
            <div className="fc-icon">🧠</div>
            <div className="fc-body"><div className="fc-title">A clear AI roadmap for your specific business</div><div className="fc-desc">No generic advice — a real plan for where AI saves you the most time &amp; money</div></div>
          </div>
        </div>
      </div>
      <div id="scroll-hint" aria-hidden="true">
        <div className="sh-arrow">→</div>
        <div className="sh-label">scroll to explore</div>
      </div>
    </section>
  );
}
