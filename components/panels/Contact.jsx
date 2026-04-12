'use client';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xzdknjde', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="panel" id="p8">
      <div className="contact-bg"></div>
      <div className="contact-inner" style={{alignItems:'center'}}>

        {/* ── LEFT: pitch + steps ── */}
        <div className="contact-left" style={{order:1}}>
          <div className="panel-eyebrow" style={{color:'#60A5FA'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'24px',height:'2px',background:'#60A5FA',borderRadius:'2px',display:'inline-block'}}></span>
              Free AI Audit
            </span>
          </div>
          <h2 className="panel-h2" style={{fontSize:'clamp(22px,2.8vw,34px)',marginBottom:'12px'}}>Tell me about your business.<br/>I&apos;ll tell you exactly where AI can help.</h2>
          <p className="panel-sub" style={{marginBottom:'20px',lineHeight:'1.7'}}>Fill in your details and David will personally come back with a plain-English breakdown of your biggest opportunities — no pitch, no obligation, no agency fluff.</p>

          {/* 3-step process */}
          <div style={{display:'flex',flexDirection:'column',gap:'12px',margin:'0 0 20px'}}>
            {[
              { n:'1', title:'Fill out the form — takes 2 minutes', desc:"Tell David about your business, your biggest challenge, and what you're looking to achieve." },
              { n:'2', title:'Get your free audit — within 24 hours', desc:'David personally reviews your business and identifies where AI, SEO, or a better website would have the biggest revenue impact.' },
              { n:'3', title:'Decide with zero pressure', desc:"You get real, actionable advice — whether you work with David or not. No hard sell, ever." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
                <div style={{width:'28px',height:'28px',minWidth:'28px',borderRadius:'50%',background:'rgba(42,165,160,.2)',border:'1px solid rgba(42,165,160,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#2AA5A0',fontSize:'12px',flexShrink:0}}>{n}</div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#fff',marginBottom:'2px'}}>{title}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,.55)',lineHeight:'1.5'}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact info — tappable links */}
          <div style={{display:'flex',flexDirection:'column',gap:'6px',borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'16px'}}>
            <a href="mailto:david@aiandwebservices.com" className="ci-row" style={{textDecoration:'none'}}>
              <div className="ci-icon">📧</div>
              <span style={{color:'#60A5FA',fontWeight:500}}>david@aiandwebservices.com</span>
            </a>
            <a href="tel:+13155720710" className="ci-row" style={{textDecoration:'none'}}>
              <div className="ci-icon">📞</div>
              <span style={{color:'#60A5FA',fontWeight:500}}>(315) 572-0710 — tap to call</span>
            </a>
            <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" className="ci-row" style={{textDecoration:'none'}}>
              <div className="ci-icon">✈️</div>
              <span style={{color:'#60A5FA',fontWeight:500}}>@aiandwebservices on Telegram</span>
            </a>
            <div className="ci-row">
              <div className="ci-icon">⚡</div>
              <span>Response <strong style={{color:'#fff'}}>guaranteed within 24 hours</strong> — usually within the first hour</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div className="contact-right" style={{order:2}}>
          {status === 'success' ? (
            <div className="contact-form" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px',minHeight:'300px',textAlign:'center'}} role="alert" aria-live="polite">
              <div style={{fontSize:'48px'}}>✅</div>
              <div style={{fontSize:'18px',fontWeight:'700',color:'#fff'}}>You&apos;re all set!</div>
              <div style={{fontSize:'14px',color:'rgba(255,255,255,.6)',lineHeight:'1.7'}}>David will review your details and get back to you personally — guaranteed within 24 hours, usually much sooner.</div>
            </div>
          ) : (
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              <div style={{marginBottom:'20px'}}>
                <div style={{fontSize:'16px',fontWeight:'700',color:'#fff',marginBottom:'4px'}}>Claim your free audit</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,.45)'}}>Takes 2 minutes. No credit card. No obligation.</div>
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label htmlFor="first_name">First Name <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                  <input type="text" id="first_name" name="first_name" placeholder="Jane" required aria-required="true" autoComplete="given-name"/>
                </div>
                <div className="form-row">
                  <label htmlFor="last_name">Last Name <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                  <input type="text" id="last_name" name="last_name" placeholder="Smith" required aria-required="true" autoComplete="family-name"/>
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="email">Business Email <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                <input type="email" id="email" name="email" placeholder="jane@company.com" required aria-required="true" autoComplete="email"/>
              </div>
              <div className="form-row">
                <label htmlFor="phone">Phone <span style={{color:'rgba(255,255,255,.35)',fontWeight:400}}>(optional)</span></label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 000-0000" autoComplete="tel"/>
              </div>
              <div className="form-row">
                <label htmlFor="service">What are you most interested in?</label>
                <select id="service" name="service">
                  <option value="" disabled defaultValue="">Select a service...</option>
                  <option>AI Automation Starter</option>
                  <option>Presence Package</option>
                  <option>Growth Package</option>
                  <option>Revenue Engine Package</option>
                  <option>Consulting &amp; AI Strategy</option>
                  <option>Custom / Let&apos;s Talk</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="message">Tell us about your business</label>
                <textarea id="message" name="message" placeholder="What does your business do, and what's your biggest challenge right now?"></textarea>
              </div>
              <button type="submit" className="form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Error — email david@aiandwebservices.com' : 'Get My Free Audit →'}
              </button>
              <p className="form-note" role="note">🔒 Your info is never shared or sold. Response guaranteed within 24 hours.</p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
