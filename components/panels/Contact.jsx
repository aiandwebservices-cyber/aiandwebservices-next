'use client';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

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
        <div className="contact-right" style={{order:2}}>
          {status === 'success' ? (
            <div id="form-success" style={{display:'block'}} role="alert" aria-live="polite">
              ✅ &nbsp;Message sent! David will be in touch within 24 hours.
            </div>
          ) : (
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
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
                <select id="service" name="service" aria-label="Select a service">
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
                <textarea id="message" name="message" placeholder="Brief description of your business and what you're looking to achieve..."></textarea>
              </div>
              <button type="submit" className="form-submit" disabled={status === 'sending'} aria-label="Submit contact form">
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Error — please email us directly' : 'Get My Free Audit →'}
              </button>
              <p className="form-note" role="note">Your information is never shared or sold. We&apos;ll respond within 24 hours.</p>
            </form>
          )}
        </div>
        <div className="contact-left" style={{order:1}}>
          <div className="panel-eyebrow" style={{color:'#60A5FA'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'24px',height:'2px',background:'#60A5FA',borderRadius:'2px',display:'inline-block'}}></span>
              Free AI Audit
            </span>
          </div>
          <h2 className="panel-h2">Tell me about your business.<br/>I&apos;ll tell you exactly where AI can help.</h2>
          <p className="panel-sub">Fill in your details on the right and David will personally review your business and come back with a plain-English breakdown of your biggest opportunities — no pitch, no obligation, no agency fluff.</p>

          <div style={{display:'flex',flexDirection:'column',gap:'16px',margin:'24px 0'}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
              <div style={{width:'32px',height:'32px',minWidth:'32px',borderRadius:'50%',background:'rgba(42,165,160,.2)',border:'1px solid rgba(42,165,160,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#2AA5A0',fontSize:'13px'}}>1</div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#fff',marginBottom:'3px'}}>Fill out the form — takes 2 minutes</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,.55)',lineHeight:'1.6'}}>Tell David about your business, your biggest challenge, and what you&apos;re looking to achieve.</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
              <div style={{width:'32px',height:'32px',minWidth:'32px',borderRadius:'50%',background:'rgba(42,165,160,.2)',border:'1px solid rgba(42,165,160,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#2AA5A0',fontSize:'13px'}}>2</div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#fff',marginBottom:'3px'}}>Get your free audit within 24 hours</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,.55)',lineHeight:'1.6'}}>David personally reviews your business and identifies where AI automation, SEO, or a better website would have the biggest revenue impact.</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
              <div style={{width:'32px',height:'32px',minWidth:'32px',borderRadius:'50%',background:'rgba(42,165,160,.2)',border:'1px solid rgba(42,165,160,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#2AA5A0',fontSize:'13px'}}>3</div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#fff',marginBottom:'3px'}}>Decide with zero pressure</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,.55)',lineHeight:'1.6'}}>You get real, actionable advice — whether you work with David or not. No hard sell, ever.</div>
              </div>
            </div>
          </div>

          <div className="contact-info">
            <div className="ci-row"><div className="ci-icon">📧</div><span><a href="mailto:AIandWEBservices@gmail.com">AIandWEBservices@gmail.com</a></span></div>
            <div className="ci-row"><div className="ci-icon">📞</div><span><a href="tel:3155720710">(315) 572-0710</a></span></div>
            <div className="ci-row"><div className="ci-icon">✈️</div><span><a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer">@aiandwebservices on Telegram</a></span></div>
            <div className="ci-row"><div className="ci-icon">⚡</div><span>Response within 24 hours — usually same day</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
