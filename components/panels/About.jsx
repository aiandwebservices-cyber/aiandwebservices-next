import Image from 'next/image';

export default function About() {
  return (
    <section className="panel" id="p3" aria-label="About David Pulis, founder of AIandWEBservices">
      <div className="about-inner">
        <div className="about-heading">
          <div className="panel-eyebrow">Who This Is For</div>
          <h2 className="panel-h2">You might be in the right place if...</h2>
        </div>
        <div className="about-right">
          <div className="value-grid">
            <div className="val-card">
              <div className="val-icon">🔍</div>
              <div className="val-title">Your competitors rank higher on Google</div>
              <div className="val-desc">If customers can&apos;t find you, they&apos;re finding someone else. I fix the technical issues and build content that moves you up.</div>
            </div>
            <div className="val-card">
              <div className="val-icon">🐌</div>
              <div className="val-title">Your website is slow or not converting</div>
              <div className="val-desc">A slow, outdated site kills your SEO and drives buyers to competitors. I rebuild it to load fast, look sharp, and close.</div>
            </div>
            <div className="val-card">
              <div className="val-icon">📞</div>
              <div className="val-title">You&apos;re losing leads outside business hours</div>
              <div className="val-desc">An AI assistant answers questions, qualifies leads, and books calls at 3am — so you wake up to opportunities, not missed messages.</div>
            </div>
            <div className="val-card">
              <div className="val-icon">🔁</div>
              <div className="val-title">You&apos;re doing the same tasks manually every week</div>
              <div className="val-desc">If it&apos;s repetitive — follow-ups, scheduling, reporting — it can be automated. I map it and build it so it runs without you.</div>
            </div>
            <div className="val-card">
              <div className="val-icon">💸</div>
              <div className="val-title">You&apos;re paying for ads but can&apos;t track what&apos;s working</div>
              <div className="val-desc">I connect your ads, analytics, and CRM so every dollar is tracked and every lead is attributed.</div>
            </div>
            <div className="val-card">
              <div className="val-icon">🧠</div>
              <div className="val-title">You know AI could help but don&apos;t know where to start</div>
              <div className="val-desc">No jargon, no guesswork. I give you a clear roadmap for where AI saves you the most time and money.</div>
            </div>
          </div>
        </div>
        <div className="about-left">
          <div className="about-card">
            <div className="founder-photo">
              <Image
                src="/david-pulis.jpg"
                alt="David Pulis, founder of AIandWEBservices — AI automation and web development specialist for small businesses"
                width={400}
                height={200}
                style={{width:'100%',height:'auto',display:'block',borderRadius:'16px'}}
                priority
              />
            </div>
            <div className="about-name">David Pulis</div>
            <div className="about-title">
              Founder,&nbsp;
              <span style={{color:'#111827',fontWeight:800}}>AI</span><span style={{color:'#2AA5A0',fontWeight:800}}>and</span><span style={{color:'#111827',fontWeight:800}}>WEB</span><span style={{color:'#2AA5A0',fontWeight:800}}>services</span>
            </div>
            <p className="about-bio">
              Most small businesses are invisible online, slow to respond, and leaving money on the table every day. I built AIandWEBservices to fix that — working directly with business owners to deploy AI systems that never miss a lead, websites that convert, and automated pipelines that grow revenue on autopilot.
            </p>
            <div className="about-contact">
              <a href="mailto:david@aiandwebservices.com" className="ac-row" style={{textDecoration:'none'}}>
                <div className="ac-icon">📧</div>
                <span style={{color:'var(--blue)',fontWeight:500}}>david@aiandwebservices.com</span>
              </a>
              <a href="tel:+13155720710" className="ac-row" style={{textDecoration:'none'}}>
                <div className="ac-icon">📞</div>
                <span style={{color:'var(--blue)',fontWeight:500}}>(315) 572-0710 — tap to call</span>
              </a>
              <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" className="ac-row" style={{textDecoration:'none'}}>
                <div className="ac-icon">✈️</div>
                <span style={{color:'var(--blue)',fontWeight:500}}>@aiandwebservices on Telegram</span>
              </a>
              <div className="ac-row">
                <div className="ac-icon">⚡</div>
                <span>Guaranteed response <strong>within 6 hours</strong> — usually within minutes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="cv-strip">
          <div className="cv-eyebrow">How I Work</div>
          <div className="cv-grid">
            <div className="cv-card"><div className="cv-icon">🎯</div><div className="cv-title">Radical Ownership</div><div className="cv-desc">No team to hide behind. Full accountability on every project, every time.</div></div>
            <div className="cv-card"><div className="cv-icon">🤝</div><div className="cv-title">Honest Expertise</div><div className="cv-desc">I tell you what you need to hear, not what sells. If something won&apos;t work for you, I&apos;ll say so.</div></div>
            <div className="cv-card"><div className="cv-icon">📊</div><div className="cv-title">Results Over Hype</div><div className="cv-desc">Measurable outcomes only. No AI buzzwords, no vague promises — just numbers that move.</div></div>
            <div className="cv-card"><div className="cv-icon">⚡</div><div className="cv-title">Accessible Intelligence</div><div className="cv-desc">Enterprise-grade technology at startup-friendly pricing. Big-company tools for real-world budgets.</div></div>
            <div className="cv-card"><div className="cv-icon">📚</div><div className="cv-title">Continuous Learning</div><div className="cv-desc">AI moves fast. I stay sharp so your business always gets what&apos;s current, not what was relevant two years ago.</div></div>
            <div className="cv-card"><div className="cv-icon">🌱</div><div className="cv-title">Partnership, Not Transactions</div><div className="cv-desc">Long-term relationships over one-off gigs. Your growth is what keeps me here.</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
