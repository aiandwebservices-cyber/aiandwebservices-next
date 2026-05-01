'use client';
import { useState } from 'react';
import { MessageSquare, Check } from 'lucide-react';
import { C, FONT_MONO } from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

/**
 * TextMeVehicle — popover that captures a phone number and "sends" the
 * vehicle's listing link via SMS. In production wired to Twilio; in this
 * demo, just shows a success state.
 *
 * Props:
 *   vehicle: { id, y, mk, md }
 *   onClose: optional callback
 *   compact: render as a small inline form vs. a popover card
 */
export function TextMeVehicle({ vehicle, onClose, compact = false }) {
  const config = useCustomerConfig();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return;
    // In production: POST to /api/sms with vehicle.id + phone, server uses Twilio.
    setSent(true);
    setTimeout(() => onClose?.(), 1800);
  };

  if (sent) {
    return (
      <div style={{ background: C.panel, border: `1px solid ${C.gold}`, padding: 14 }}>
        <div className="flex items-center gap-2" style={{ color: C.cyan, fontFamily: FONT_MONO, fontSize: 11 }}>
          <Check className="w-3.5 h-3.5" />
          <span>Sent! Check your phone for {vehicle?.y} {vehicle?.mk} {vehicle?.md}.</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{
      background: '#08080A', border: `1px solid ${C.gold}`,
      padding: compact ? 10 : 14, width: compact ? 240 : 280,
    }}>
      <div className="flex items-center gap-1.5" style={{
        fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2, color: C.gold, marginBottom: 8,
      }}>
        <MessageSquare className="w-3 h-3" />
        TEXT ME THIS LINK
      </div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        style={{
          width: '100%', background: 'transparent', border: 'none',
          borderBottom: `1px solid ${C.rule2}`,
          color: C.ink, fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 1,
          padding: '6px 0', marginBottom: 10,
        }}
      />
      <button type="submit" style={{
        width: '100%', padding: '8px', background: C.gold, color: '#08080A',
        border: 'none', cursor: 'pointer',
        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
      }}>▸ TEXT ME LINK</button>
      <div style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.inkLow, marginTop: 6 }}>
        We'll send a single SMS — no spam. From {config.dealerName}.
      </div>
    </form>
  );
}

export default TextMeVehicle;
