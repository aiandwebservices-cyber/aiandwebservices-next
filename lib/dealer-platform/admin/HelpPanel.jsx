'use client';
import { useState } from 'react';
import { HelpCircle, X, Mail, Phone, ChevronDown } from 'lucide-react';
import { GOLD, HELP_FAQ } from './_internals';
import { useAdminConfig } from './AdminConfigContext';

/**
 * Help slide-out — opens from the topbar Help button.
 * Shows dealer-platform vendor contact info + an FAQ accordion.
 * "Powered by AIand​WEBservices" footer reads from config.poweredBy.
 */
export function HelpPanel({ onClose }) {
  const [openIdx, setOpenIdx] = useState(null);
  const config = useAdminConfig();
  const poweredBy = config.poweredBy || { name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 anim-fade no-print" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 shadow-2xl anim-slide overflow-y-auto no-print"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <div className="px-5 py-4 flex items-center justify-between sticky top-0"
          style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-stone-600" />
            <h2 className="font-display text-xl font-semibold">Need Help?</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-stone-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="space-y-2 text-sm">
            <a href="mailto:david@aiandwebservices.com" className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-stone-100 transition" style={{ color: 'var(--text-secondary)' }}>
              <Mail className="w-4 h-4" /><span>david@aiandwebservices.com</span>
            </a>
            <a href="tel:3155720710" className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-stone-100 transition" style={{ color: 'var(--text-secondary)' }}>
              <Phone className="w-4 h-4" /><span>Call/Text: 315-572-0710</span>
            </a>
          </div>
          <div>
            <div className="text-[11px] font-semibold smallcaps mb-2" style={{ color: 'var(--text-muted)' }}>Quick Tips</div>
            <div className="space-y-1.5">
              {HELP_FAQ.map((item, i) => (
                <div key={i} className="rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-stone-50 transition">
                    <span className="text-sm font-medium">{item.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openIdx === i && (
                    <div className="px-3 py-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 text-center text-[11px] sticky bottom-0"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
          Powered by <a href={poweredBy.url} target="_blank" rel="noreferrer">
            <span className="font-semibold" style={{ color: GOLD }}>{poweredBy.name.slice(0, poweredBy.name.indexOf('and') > 0 ? poweredBy.name.indexOf('and') : poweredBy.name.length)}</span>
            <span className="font-semibold">{poweredBy.name.slice(poweredBy.name.indexOf('and'))}</span>
          </a>
        </div>
      </aside>
    </>
  );
}

export default HelpPanel;
