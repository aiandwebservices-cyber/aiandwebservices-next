/**
 * content/tiers/ai-automation-starter.ts
 * Unique copy for the AI Automation Starter service page.
 * Pricing lives in lib/pricing.ts — never duplicate it here.
 * All copy extracted from existing app/services/ai-automation-starter/page.jsx.
 */

export const starterContent = {
  metaTitle: 'AI Automation Starter — Custom AI Automation System for Your Business | AIandWEBservices',
  metaDescription:
    'Deploy a custom AI automation system trained on your business in 7–14 days. Handles inquiries, qualifies leads, books calls 24/7. No contracts.',
  ogImage:
    'https://www.aiandwebservices.com/api/og?title=AI%20Automation%20Starter&description=Custom%20AI%20Automation%20System%20for%20Your%20Business',

  /** Populated at runtime from lib/pricing.ts via getTier('ai-automation-starter') */
  deliveryTime: '7–14 days',
  yearlyTotal: null,
  pricingCta: 'Get Started — AI Automation Starter',

  hero: {
    eyebrow: 'AI Automation Starter',
    headline: 'AI Chatbot for Small Business —',
    headlineAccent: 'Handle Inquiries 24/7',
    subheadline:
      'A custom AI chatbot for small business owners — trained on your business, handles inquiries, qualifies leads, and books calls while you sleep. Done-for-you in 7–14 days.',
    scrollCta: 'See pricing',
  },

  problem: {
    heading: 'The Cost of Lost Leads (And Slow Replies)',
    subheading: '...and it compounds every day you wait.',
    body: 'Businesses getting 10+ inquiries weekly are losing money silently. Phone rings and goes to voicemail → lead moves to competitor. Email inquiry sits for 24 hours → prospect buys elsewhere. Weekend inquiry never answered → $5K–$50K deal lost.',
    cards: [
      {
        title: "You're Losing Leads to Speed",
        // Stat is illustrative — soften if challenged.
        body: "The fastest responder usually wins the deal. You're sleeping, in a meeting, or handling other clients when inquiries come in. Lose even a handful of leads per month to slow response and you're leaving serious money on the table.",
      },
      {
        title: 'Qualifying Takes Forever',
        body: "Each inquiry needs 3–5 emails to figure out if they're a real fit. 'How much?' 'What areas?' 'Are you available?' Meanwhile, 30% of leads give up waiting and hire someone else.",
      },
      {
        title: "You Can't Scale Without Hiring",
        body: "One person can handle ~30–40 inquiries/month manually. After that, you either hire ($2K–$4K/month) or lose leads. Hiring means payroll, training, turnover—and they can't work 24/7.",
      },
    ],
    closingLine: 'AI Automation Starter solves all three — without adding headcount.',
  },

  features: [
    {
      iconName: 'Bot',
      name: 'AI Automation System',
      description: 'AI trained on your business answers FAQs instantly, 24/7.',
    },
    {
      iconName: 'Calendar',
      name: 'Auto Booking',
      description: 'Smart assistant books calls directly to your calendar.',
    },
    {
      iconName: 'Target',
      name: 'Lead Qualification',
      description: 'AI asks qualifying questions about budget, timeline, and fit.',
    },
    {
      iconName: 'Network',
      name: 'CRM Integration',
      description: 'All conversations logged in HubSpot, Pipedrive, Zoho, and more.',
    },
    {
      iconName: 'BarChart3',
      name: 'Monthly Reports',
      description: 'Inquiries handled, leads qualified, common questions surfaced.',
    },
  ],

  timeline: [
    {
      label: 'Days 1–3',
      heading: 'Discovery & Training',
      description:
        '60-min discovery call. I learn your business, services, pricing, booking process. Build AI knowledge base from your website, FAQs, and email templates. You review and approve.',
    },
    {
      label: 'Days 4–6',
      heading: 'Calendar & CRM Integration',
      description:
        'Connect your calendar (Google, Calendly, Acuity) and CRM. Set availability rules. AI logs every conversation automatically. You see every interaction in real time.',
    },
    {
      label: 'Days 7–10',
      heading: 'Testing & Refinement',
      description:
        'I test with realistic inquiries to find weak spots. You test and ask what your actual customers would ask. Weak answers get retrained before launch.',
    },
    {
      label: 'Days 11–14',
      heading: 'Launch & 30-Day Monitoring',
      description:
        'AI goes live on your website, handling inquiries 24/7. I monitor the first 30 days. Weekly summaries: How many inquiries? What patterns? Any improvements needed?',
    },
  ],

  setupIncludes: [
    'Discovery call (60 minutes)',
    'Custom AI training on your business',
    'Calendar integration (Google, Calendly, Acuity)',
    'CRM integration (HubSpot, Salesforce, Pipedrive, Zoho)',
    '30-day launch monitoring',
  ],

  monthlyIncludes: [
    'Hosting and platform fees',
    'Knowledge base updates and refinement',
    'Monthly performance report',
    'AI retraining (new services, pricing, objections)',
    'Email support — 6-hour response',
  ],

  builtForYouIf: [
    'Service business getting 10+ inquiries weekly and missing them.',
    'Losing leads to slow response times and voicemail.',
    'Want 24/7 lead capture without hiring staff.',
  ],

  faq: [
    {
      q: "Won't prospects be annoyed talking to a bot?",
      a: "Not if it's polite and actually answers their questions. The AI is trained to be helpful, not robotic. Most prospects don't mind — they get an instant answer instead of waiting 6 hours. The AI's job is to answer FAQs and qualify. For real conversations, it hands off to you.",
    },
    {
      q: 'What if the AI gives a wrong answer?',
      a: "That's why I monitor it for 30 days after launch and continue monthly optimization. If an answer is wrong, I retrain the AI. Plus, every conversation is logged, so you can see what the AI said and correct it. I also set up an escalation button so prospects can request you directly.",
    },
    {
      q: 'Can the AI handle complex questions?',
      a: "It handles 60–80% of inquiries (FAQs, basic qualifying). For complex questions, the AI detects it doesn't know and offers to connect the prospect with you. No fake answers. No friction. My goal is to speed up 80% of conversations and hand off the complex 20% to you.",
    },
    {
      q: 'How is this different from hiring a part-time admin?',
      // TODO: confirm exact admin salary range with local market data before launch
      a: "A part-time admin costs $1.5K–$2.5K/month and works 9–5. This costs a fraction of that and works 24/7. An admin will get sick or leave. The AI doesn't. An admin handles ~30 inquiries/month; the AI handles unlimited. Start with the AI; hire people later when you need strategy, not inquiry handling.",
    },
    {
      q: 'What if I need to change how the AI answers?',
      // TODO: confirm turnaround time claim matches actual SLA
      a: "Tell me what needs updating in your monthly check-in. I retrain the AI in 1–2 days. New service? New pricing? New availability? All included in the monthly fee.",
    },
    {
      q: 'Can the AI work with my specific CRM/calendar?',
      a: "Probably. I integrate with 50+ CRMs and calendars (HubSpot, Salesforce, Pipedrive, Zoho, Google Calendar, Calendly, Acuity, etc.). During discovery, tell me what you use and I'll set it up. If something isn't supported, I'll find a workaround.",
    },
    {
      q: 'What happens if I want to upgrade to a bigger system?',
      a: "You move to Presence, Growth, or Revenue Engine. All your training, integrations, and conversation data move with you. You're not starting over — you're adding capabilities. The AI stays and gets smarter.",
    },
  ],

  comparisons: {
    vsLabel: 'DIY ChatGPT / Bot',
    rows: [
      { feature: 'Custom training on YOUR business', us: true, them: false, themCost: '20+ hrs @ $100/hr' },
      { feature: 'Calendar integration (instant booking)', us: true, them: false, themCost: '$600–$1.8K/yr' },
      { feature: 'CRM logging (no data loss)', us: true, them: false, themCost: '$1.8K–$2.4K/yr' },
      { feature: 'Ongoing updates & optimization', us: true, them: false, themCost: '$1.2K–$2.4K/yr' },
      { feature: 'Real human handoff (no lost customers)', us: true, them: false, themCost: '$5K–$50K lost' },
      // us: computed at runtime via computeYearlyTotal(tier) from lib/pricing.ts
      { feature: '1-Year Total', us: null, them: '$2.2K–$4.4K', themCost: '1.7–3.4× less with us' },
    ],
  },
};
