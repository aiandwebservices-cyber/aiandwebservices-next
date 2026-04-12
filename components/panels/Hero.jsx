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
            <div className="hd-stat">
              <div className="hd-n">66<em>%</em></div>
              <div className="hd-l">of SMBs using AI save $500–$2,000/month</div>
              <div className="hd-src">Source: <a href="https://uplyftcapital.com/small-business-blog/small-businesses-using-ai-scale-2026" target="_blank" rel="noopener noreferrer" aria-label="Uplyft Capital (opens in new tab)">Uplyft Capital</a></div>
            </div>
            <div className="hd-stat">
              <div className="hd-n">91<em>%</em></div>
              <div className="hd-l">of small businesses say AI boosts their revenue</div>
              <div className="hd-src">Source: <a href="https://neuwark.com/blog/ai-for-small-business-2026-complete-guide" target="_blank" rel="noopener noreferrer" aria-label="Neuwark (opens in new tab)">Neuwark</a></div>
            </div>
            <div className="hd-stat">
              <div className="hd-n">$20<em>B</em></div>
              <div className="hd-l">global AI market for small businesses in 2026</div>
              <div className="hd-src">Source: <a href="https://allgreatthings.io/blog/ai-tools-marketing-automation/ai-agents-smb-2026-guide" target="_blank" rel="noopener noreferrer" aria-label="AllGreatThings (opens in new tab)">AllGreatThings</a></div>
            </div>
            <div className="hd-stat">
              <div className="hd-n">35<em>%</em></div>
              <div className="hd-l">reduction in operational costs in year one of AI</div>
              <div className="hd-src">Source: <a href="https://adai.news/resources/statistics/ai-automation-statistics-2026/" target="_blank" rel="noopener noreferrer" aria-label="McKinsey 2025 via ADAI (opens in new tab)">McKinsey, 2025</a></div>
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
