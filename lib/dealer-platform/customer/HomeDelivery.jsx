'use client';
import { Truck } from 'lucide-react';
import { C, FONT_DISPLAY, FONT_MONO } from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

/**
 * HomeDelivery — section advertising at-home test drives + delivery service.
 *
 * The richer in-vehicle scheduling flow (date picker, ZIP-based fee
 * estimate) currently lives inline inside VehicleDetailDrawer.jsx. This
 * standalone section is a homepage-level value-prop card that links into
 * that flow.
 *
 * Gated by config.features.homeDelivery — render nothing when off.
 */
export function HomeDelivery() {
  const config = useCustomerConfig();
  if (!config.features?.homeDelivery) return null;

  return (
    <section style={{
      padding: '60px 48px 60px 96px',
      background: C.bg, borderTop: `1px solid ${C.rule}`,
    }}>
      <div className="max-w-3xl">
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan, marginBottom: 12 }}>
          AT-HOME SERVICE
        </div>
        <div className="flex items-start gap-5">
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: C.gold,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Truck className="w-7 h-7" style={{ color: C.bg }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700, color: C.ink, lineHeight: 1, marginBottom: 12,
            }}>Home delivery, on us.</h2>
            <p style={{ fontFamily: 'var(--font-inter)', color: C.inkDim, fontSize: 16, lineHeight: 1.55, maxWidth: 520 }}>
              We bring your test drive to your door — anywhere within 50 miles.
              Buy with confidence: 7-day return, no restocking fee. Schedule directly
              from any vehicle's detail page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeDelivery;
