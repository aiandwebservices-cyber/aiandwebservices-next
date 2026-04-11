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
      <div className="contact-inner">
        <div className="contact-right">
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
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Error — please email us directly' : 'Send Message — It\'s Free →'}
              </button>
              <p className="form-note" role="note">Your information is never shared or sold. We&apos;ll respond within 24 hours.</p>
            </form>
          )}
        </div>
        <div className="contact-left">
          <div className="panel-eyebrow" style={{color:'#60A5FA'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'24px',height:'2px',background:'#60A5FA',borderRadius:'2px',display:'inline-block'}}></span>
              Contact
            </span>
          </div>
          <h2 className="panel-h2">Not sure where to start?<br/>That&apos;s what the audit is for.</h2>
          <p className="panel-sub">Tell me about your business and I&apos;ll come back with a plain-English breakdown of where AI automation, SEO, or a better website would have the biggest impact on your revenue. No pitch, no obligation — just a real answer from David.</p>
          <div className="contact-info">
            <div className="ci-row"><div className="ci-icon">📧</div><span><a href="mailto:AIandWEBservices@gmail.com">AIandWEBservices@gmail.com</a></span></div>
            <div className="ci-row"><div className="ci-icon">📞</div><span><a href="tel:3155720710">(315) 572-0710</a></span></div>
            <div className="ci-row"><div className="ci-icon">💼</div><span><a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noopener noreferrer">linkedin.com/in/YOUR_LINKEDIN</a></span></div>
            <div className="ci-row"><div className="ci-icon">✈️</div><span><a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer">@aiandwebservices on Telegram</a></span></div>
            <div className="ci-row"><div className="ci-icon">⚡</div><span>Typical response within 24 hours</span></div>
            <div className="ci-row"><div className="ci-icon">🌎</div><span>Serving businesses nationwide</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
