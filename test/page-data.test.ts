import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { expect } from './expect.ts';
import { TIERS, getTier } from '../lib/pricing.ts';
import { addOnsContent } from '../content/tiers/add-ons.ts';
import { consultingContent } from '../content/tiers/consulting.ts';
import { FEATURE_ROWS, COMPARE_TIER_ORDER } from '../lib/comparison.ts';
import { HOMEPAGE_FAQS } from '../lib/homepage-faq.ts';
import { GUARANTEE } from '../lib/guarantee-content.ts';
import { COLONY_INCLUDED, COLONY_FAQS } from '../lib/product-colony.ts';
import { getComparison, getGuarantee, getPricing, getProduct, getService, searchFaq } from '../lib/agent/facts.ts';
import { llmsText } from '../lib/agent/llms.ts';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

describe('prices and facts come from the page data', () => {
  it('pricing and offers match the tier and add-on modules the pages render', () => {
    const pricing = getPricing();
    for (const tier of TIERS) {
      const row = pricing.tiers.find((t) => t.slug === tier.slug);
      expect(row?.setup_fee).toBe(tier.setupFee);
      expect(row?.monthly_fee).toBe(tier.monthlyFee);
      expect(row?.setup_url).toBe(tier.setupLinkLong);
      expect(row?.monthly_url).toBe(tier.monthlyLinkLong);
    }
    for (const addon of addOnsContent.addOns) {
      const row = pricing.add_ons.find((a) => a.slug === addon.slug);
      expect(row?.setup_fee).toBe(addon.setupFee);
      expect(row?.monthly_fee).toBe(addon.monthlyFee);
    }
    expect(pricing.consulting.starting_price).toBe(consultingContent.startingPrice);
    const presence = getService('presence');
    expect(presence.setup_fee).toBe(getTier('presence')?.setupFee);
    expect(presence.monthly_fee).toBe(getTier('presence')?.monthlyFee);
    const comparison = getComparison();
    expect(comparison.rows).toEqual(FEATURE_ROWS);
    expect(comparison.tiers.map((t) => t.monthly_fee)).toEqual(
      COMPARE_TIER_ORDER.map((slug) => TIERS.find((t) => t.slug === slug)?.monthlyFee),
    );
    const text = llmsText();
    for (const tier of TIERS) {
      expect(text).toContain(String(tier.monthlyFee));
      expect(text).toContain(String(tier.setupFee));
    }
  });

  it('guarantee, product, and FAQ text are the modules the pages import', () => {
    expect(getGuarantee().title).toBe(GUARANTEE.title);
    expect(GUARANTEE.title).toBe('6-Hour Response Guarantee');
    expect(read('app/guarantee/page.jsx')).toContain("from '@/lib/guarantee-content'");
    expect(read('app/guarantee/page.jsx')).not.toContain('6-Hour Response Guarantee');

    expect(read('app/services/compare/page.jsx')).toContain("from '@/lib/comparison'");
    expect(read('app/services/compare/page.jsx')).not.toContain('Professional website (5 pages)');

    expect(read('components/panels/FAQ.jsx')).toContain('HOMEPAGE_FAQS');
    expect(read('components/panels/FAQ.jsx')).not.toContain('How long does it take to go live?');
    const questions = searchFaq('').results.map((r) => r.question);
    for (const faq of HOMEPAGE_FAQS) expect(questions).toContain(faq.q);
    for (const faq of COLONY_FAQS) expect(questions).toContain(faq.question);

    const product = getProduct();
    expect(product.included_with.map((row) => row.monthly_fee_on_this_page)).toEqual(COLONY_INCLUDED.map((row) => row.monthlyFee));
    expect(read('app/product/colony/page.tsx')).toContain("from '@/lib/product-colony'");
    expect(read('app/product/colony/page.tsx')).not.toContain('$249/month');
    expect(read('app/product/colony/page.tsx')).not.toContain('$349/month');
    expect(read('components/CalContactEmbed.jsx')).not.toMatch(/calLink:\s*'aiandwebservices\/30min'/);
  });
});
