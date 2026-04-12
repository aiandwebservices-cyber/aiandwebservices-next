export default function HowItWorks() {
  const steps = [
    {
      n:'01', color:'#60A5FA',
      title:'SEO brings people who are already looking for you',
      desc:'We optimise your site and publish AI-assisted content so you rank for searches your customers actually make.',
    },
    {
      n:'02', color:'#34D399',
      title:'Your website turns visitors into leads — not bounces',
      desc:'Fast load times, clear messaging, and tested page layouts that make it easy to say yes.',
    },
    {
      n:'03', color:'#A78BFA',
      title:'Your AI chatbot handles inquiries before you even wake up',
      desc:'Answers questions, qualifies leads, and books calls — so you talk to people who are already interested.',
    },
    {
      n:'04', color:'#F59E0B',
      title:'Automated follow-up closes deals while you focus on the work',
      desc:'Email sequences and CRM workflows that keep leads warm without you lifting a finger.',
    },
  ];

  const nodes = [
    { cls:'fn1', title:'SEO & Content',       sub:'Rank for searches your buyers make',    metric:'More visitors' },
    { cls:'fn2', title:'Web & CRO',            sub:'Visitors become leads, not bounces',    metric:'More leads'    },
    { cls:'fn3', title:'AI Chatbot / Voice',   sub:'Answers, qualifies, books — at 3am',   metric:'Less admin'    },
    { cls:'fn4', title:'Automation & CRM',     sub:'Follow-up happens without you',         metric:'More revenue'  },
  ];

  return (
    <section className="panel" id="p2" style={{background:'var(--navy2)'}}>
      <div className="funnel-inner">

        {/* ── HEADER spans full width ── */}
        <div className="funnel-header">
          <div className="panel-eyebrow" style={{color:'#60A5FA'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'24px',height:'2px',background:'#60A5FA',borderRadius:'2px',display:'inline-block'}}></span>
              The&nbsp;
              <span style={{color:'#fff',fontWeight:800}}>AI</span>
              <span style={{color:'#2AA5A0',fontWeight:800}}>and</span>
              <span style={{color:'#fff',fontWeight:800}}>WEB</span>
              <span style={{color:'#2AA5A0',fontWeight:800}}>services</span>
              &nbsp;Difference
            </span>
          </div>
          <h2 className="panel-h2" style={{color:'#fff'}}>Why hire three agencies when one does it all?</h2>
          <p className="panel-sub" style={{color:'rgba(255,255,255,.55)',maxWidth:'100%'}}>Most businesses pay separately for a web designer, an SEO agency, and a marketing tool — and none of them talk to each other. I build one connected system where every piece feeds the next.</p>
        </div>

        {/* ── ALIGNED GRID ── */}
        <div className="funnel-grid">
          {steps.map((s, i) => (
            <div key={s.n} className={`fstep fstep-${i+1}`} style={{borderColor:'rgba(255,255,255,.06)'}}>
              <div className="fstep-n" style={{color:s.color}}>{s.n}</div>
              <div className="fstep-body">
                <h4 style={{color:s.color}}>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
          {nodes.map((node, i) => (
            <div key={node.cls} className={`fnode ${node.cls}`}>
              <div className="fnode-dot">{i+1}</div>
              <div className="fnode-card"><h4>{node.title}</h4><p>{node.sub}</p></div>
              <div className="fnode-metric">{node.metric.split(' ')[0]}<br/>{node.metric.split(' ')[1]}</div>
              {i < nodes.length - 1 && <div className="fnode-line"></div>}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
