export default function HowItWorks() {
  return (
    <section className="panel" id="p2" style={{background:'var(--navy2)'}}>
      <div className="funnel-inner">
        <div className="funnel-left">
          <div className="panel-eyebrow" style={{color:'#60A5FA'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'24px',height:'2px',background:'#60A5FA',borderRadius:'2px',display:'inline-block'}}></span>
              The AIandWEBservices Difference
            </span>
          </div>
          <h2 className="panel-h2" style={{color:'#fff'}}>Why hire three agencies<br/>when one does it all?</h2>
          <p className="panel-sub" style={{color:'rgba(255,255,255,.45)'}}>Most businesses pay separately for a web designer, an SEO agency, and a marketing tool — and none of them talk to each other. I build one connected system where every piece feeds the next.</p>
          <div className="funnel-steps">
            <div className="fstep">
              <div className="fstep-n">01</div>
              <div className="fstep-body">
                <h4>SEO brings people who are already looking for you</h4>
                <p>We optimize your site and publish AI-assisted content so you rank for searches your customers actually make.</p>
              </div>
            </div>
            <div className="fstep">
              <div className="fstep-n">02</div>
              <div className="fstep-body">
                <h4>Your website turns visitors into leads — not bounces</h4>
                <p>Fast load times, clear messaging, and tested page layouts that make it easy to say yes.</p>
              </div>
            </div>
            <div className="fstep">
              <div className="fstep-n">03</div>
              <div className="fstep-body">
                <h4>Your AI chatbot handles inquiries before you even wake up</h4>
                <p>Answers questions, qualifies leads, and books calls — so you talk to people who are already interested.</p>
              </div>
            </div>
            <div className="fstep">
              <div className="fstep-n">04</div>
              <div className="fstep-body">
                <h4>Automated follow-up closes deals while you focus on the work</h4>
                <p>Email sequences and CRM workflows that keep leads warm without you lifting a finger.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="funnel-right">
          <div className="fnode fn1">
            <div className="fnode-dot">1</div>
            <div className="fnode-card"><h4>SEO &amp; Content</h4><p>Rank for searches your buyers make</p></div>
            <div className="fnode-metric">More<br/>visitors</div>
            <div className="fnode-line"></div>
          </div>
          <div className="fnode fn2">
            <div className="fnode-dot">2</div>
            <div className="fnode-card"><h4>Web &amp; CRO</h4><p>Visitors become leads, not bounces</p></div>
            <div className="fnode-metric">More<br/>leads</div>
            <div className="fnode-line"></div>
          </div>
          <div className="fnode fn3">
            <div className="fnode-dot">3</div>
            <div className="fnode-card"><h4>AI Chatbot / Voice</h4><p>Answers, qualifies, books — at 3am</p></div>
            <div className="fnode-metric">Less<br/>admin</div>
            <div className="fnode-line"></div>
          </div>
          <div className="fnode fn4">
            <div className="fnode-dot">4</div>
            <div className="fnode-card"><h4>Automation &amp; CRM</h4><p>Follow-up happens without you</p></div>
            <div className="fnode-metric">More<br/>revenue</div>
          </div>
        </div>
      </div>
    </section>
  );
}
