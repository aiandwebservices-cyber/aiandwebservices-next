export default function HowItWorks() {
  const rows = [
    {
      color:'#2AA5A0', metricColor:'#2AA5A0', dotBg:'#2AA5A0',
      stepTitle:'SEO brings people who are already looking for you',
      stepDesc:'We optimise your site and publish AI-assisted content so you rank for searches your customers actually make.',
      nodeTitle:'SEO & Content', nodeSub:'Rank for searches your buyers make', metric:'More\nvisitors',
      nodeCls:'fn1',
    },
    {
      color:'var(--am-lt)', metricColor:'#F59E0B', dotBg:'var(--am-lt)',
      stepTitle:'Your website turns visitors into leads — not bounces',
      stepDesc:'Fast load times, clear messaging, and tested page layouts that make it easy to say yes.',
      nodeTitle:'Web & CRO', nodeSub:'Visitors become leads, not bounces', metric:'More\nleads',
      nodeCls:'fn2',
    },
    {
      color:'#2AA5A0', metricColor:'#2AA5A0', dotBg:'#2AA5A0',
      stepTitle:'Your AI automation handles inquiries before you even wake up',
      stepDesc:'Answers questions, qualifies leads, and books calls — so you talk to people who are already interested.',
      nodeTitle:'AI Automation / Chatbot', nodeSub:'Answers, qualifies, books — at 3am', metric:'Less\nadmin',
      nodeCls:'fn3',
    },
    {
      color:'var(--violet)', metricColor:'#A78BFA', dotBg:'var(--violet)',
      stepTitle:'Automated follow-up closes deals while you focus on the work',
      stepDesc:'Email sequences and CRM workflows that keep leads warm without you lifting a finger.',
      nodeTitle:'Automation & CRM', nodeSub:'Follow-up happens without you', metric:'More\nrevenue',
      nodeCls:'fn4',
    },
  ];

  return (
    <section className="panel" id="p2" style={{background:'#fff'}}>
      <div className="funnel-inner">

        {/* ── HEADER ── */}
        <div className="funnel-header">
          <div className="panel-eyebrow">
            The&nbsp;<span style={{color:'#111827',fontWeight:800}}>AI</span><span style={{color:'#2AA5A0',fontWeight:800}}>and</span><span style={{color:'#111827',fontWeight:800}}>WEB</span><span style={{color:'#2AA5A0',fontWeight:800}}>services</span>&nbsp;Difference
          </div>
          <h2 className="panel-h2" style={{color:'#111827'}}>Why hire three agencies when one does it all?</h2>
          <p className="panel-sub" style={{color:'#6b7280',maxWidth:'100%'}}>Most businesses pay separately for a web designer, an SEO agency, and a marketing tool — and none of them talk to each other. I build one connected system where every piece feeds the next.</p>
        </div>

        {/* ── INTERLEAVED GRID: step | node, step | node ... ── */}
        <div className="funnel-grid">
          {rows.map((r, i) => (
            <>
              {/* LEFT: step */}
              <div key={`step-${i}`} className="fstep">
                <div className="fstep-dot" style={{background:r.dotBg}}>{i+1}</div>
                <div className="fstep-body">
                  <h4 style={{color:r.metricColor}}>{r.stepTitle}</h4>
                  <p>{r.stepDesc}</p>
                </div>
              </div>
              {/* RIGHT: node */}
              <div key={`node-${i}`} className={`fnode ${r.nodeCls}`}>
                <div className="fnode-dot">{i+1}</div>
                <div className="fnode-card"><h4>{r.nodeTitle}</h4><p>{r.nodeSub}</p></div>
                <div className="fnode-metric" style={{color:r.metricColor}}>{r.metric.split('\n')[0]}<br/>{r.metric.split('\n')[1]}</div>
                {i < rows.length - 1 && <div className="fnode-line"></div>}
              </div>
            </>
          ))}
        </div>

        {/* ── STILL HAVE QUESTIONS — desktop only ── */}
        <div className="faq-cta-strip hiw-cta-strip">
          <div className="faq-cta-inner">
            <p><strong>Still have questions?</strong> The free audit is the easiest way to get real answers for your specific situation.</p>
            <button className="blog-btn" onClick={() => window.go(7)}>Get a Free Audit</button>
          </div>
        </div>

      </div>
    </section>
  );
}
