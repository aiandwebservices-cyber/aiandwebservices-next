export type Service = {
  slug: string;
  tier: string;
  oneLiner: string;
  priceMonthly: number;
  setupFee: number;
  features: Array<{
    icon: string;
    label: string;
    desc: string;
  }>;
  fitBullets: string[];
  timeline: Array<{
    when: string;
    action: string;
  }>;
  setupIncludes: string[];
  monthlyIncludes: string[];
  prevSlug: string | null;
  nextSlug: string | null;
  heroDemoKey: 'ai-starter' | 'gbp' | 'lead-counter' | 'funnel' | 'terminal' | 'roadmap' | 'modules';
};

export const SERVICES: Record<string, Service> = {
  'presence': {
    slug: 'presence',
    tier: 'Presence',
    oneLiner: 'Professional website, local SEO, AI assistant',
    priceMonthly: 297,
    setupFee: 997,
    features: [
      { icon: '🌐', label: 'Website', desc: '5-page site, mobile-first, conversion-focused.' },
      { icon: '🔍', label: 'Local SEO', desc: 'Google Business Profile optimization, on-page fundamentals.' },
      { icon: '🤖', label: 'AI Assistant', desc: 'Chatbot answers FAQs, captures leads 24/7.' },
      { icon: '📊', label: 'Monthly Reports', desc: 'Traffic, leads, and performance insights.' },
    ],
    fitBullets: [
      'Brand-new businesses building online presence.',
      'Need local visibility without marketing overhead.',
      'Have 5–20 inquiries monthly, losing some.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Discovery call and strategy session.' },
      { when: 'Week 1', action: 'Design and build your site.' },
      { when: 'Week 2', action: 'Review, refine, launch with monitoring.' },
      { when: 'Ongoing', action: 'Monthly management and updates.' },
    ],
    setupIncludes: [
      'Discovery and strategy',
      'Website design and build (5 pages)',
      'Google Business Profile setup and optimization',
      'AI chatbot training and deployment',
      '30-day launch support and monitoring',
    ],
    monthlyIncludes: [
      'Hosting, maintenance, security',
      'Up to 2 content updates',
      'Monthly performance report',
      'Email support',
      'Chatbot knowledge base updates',
    ],
    prevSlug: null,
    nextSlug: 'growth',
    heroDemoKey: 'gbp',
  },

  'growth': {
    slug: 'growth',
    tier: 'Growth',
    oneLiner: 'Turn visitors into leads automatically',
    priceMonthly: 597,
    setupFee: 2497,
    features: [
      { icon: '⚙️', label: 'AI Automation', desc: 'CRM-integrated chatbot qualifies leads, books calls.' },
      { icon: '📧', label: 'Email Marketing', desc: '5–7 email welcome sequence builds relationships.' },
      { icon: '📝', label: 'SEO Content', desc: '2 articles monthly, 24+ posts yearly.' },
      { icon: '🎯', label: 'Landing Pages', desc: 'Conversion-optimized pages for your top services.' },
      { icon: '📊', label: 'Everything in Presence', desc: 'Website, local SEO, basic AI assistant.' },
    ],
    fitBullets: [
      'Established businesses getting 20+ inquiries monthly.',
      'Ready to automate lead qualification and nurturing.',
      'Want AI systems without hiring a team.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Strategy call, competitive audit.' },
      { when: 'Weeks 1–2', action: 'Build automation, email sequences, landing pages.' },
      { when: 'Week 3', action: 'Test copy and integrations.' },
      { when: 'Week 4+', action: 'Launch, monitor, optimize with monthly reviews.' },
    ],
    setupIncludes: [
      'Everything in Presence setup',
      'AI automation system design and build',
      'CRM integration (HubSpot, Salesforce, Pipedrive, etc.)',
      'Email marketing platform setup with sequences',
      'First 2 SEO content pieces',
      '2 conversion-optimized landing pages',
    ],
    monthlyIncludes: [
      'Everything in Presence monthly',
      '2 new SEO articles',
      'Chatbot and email updates',
      'CRM and workflow monitoring',
      'Monthly strategy call with David',
    ],
    prevSlug: 'presence',
    nextSlug: 'revenue-engine',
    heroDemoKey: 'lead-counter',
  },

  'revenue-engine': {
    slug: 'revenue-engine',
    tier: 'Revenue Engine',
    oneLiner: 'Automate your entire sales system',
    priceMonthly: 997,
    setupFee: 3997,
    features: [
      { icon: '🔀', label: 'Sales Funnel', desc: 'Custom funnel maps buyer journey, closes deals.' },
      { icon: '⚡', label: 'Workflow Automation', desc: 'Zapier/Make workflows eliminate repetitive manual tasks.' },
      { icon: '📢', label: 'Paid Ads', desc: 'Google or Meta ads setup, conversion tracking.' },
      { icon: '🤖', label: 'CRM Integration', desc: 'Unified customer data across all touchpoints.' },
      { icon: '💬', label: 'Everything in Growth', desc: 'Website, AI automation, email, SEO content.' },
    ],
    fitBullets: [
      'Service businesses generating $20K+ monthly revenue.',
      'Ready to outsource entire sales operation.',
      'Want revenue growth without hiring salespeople.',
    ],
    timeline: [
      { when: 'Week 1', action: 'Audit, funnel mapping, ad strategy.' },
      { when: 'Weeks 2–3', action: 'Build funnels, automation, ad campaigns.' },
      { when: 'Week 4', action: 'Test campaigns, optimize, go live.' },
      { when: 'Monthly', action: 'Strategy calls, performance review, scaling.' },
    ],
    setupIncludes: [
      'Everything in Growth setup',
      'Sales funnel design and build',
      'Workflow automation (Zapier/Make configuration)',
      'Paid ads account setup and first campaigns',
      'CRM integration and data mapping',
      'Daily launch monitoring (first month)',
    ],
    monthlyIncludes: [
      'Everything in Growth monthly',
      'Workflow automation management',
      'Paid ads optimization and scaling',
      '60-minute monthly strategy call',
      'CRM data hygiene and analysis',
    ],
    prevSlug: 'growth',
    nextSlug: 'ai-first',
    heroDemoKey: 'funnel',
  },

  'ai-first': {
    slug: 'ai-first',
    tier: 'AI-First',
    oneLiner: 'Replace manual work with AI at scale',
    priceMonthly: 1497,
    setupFee: 5497,
    features: [
      { icon: '📞', label: 'Voice AI', desc: 'AI answers calls, books appointments, handles inquiries.' },
      { icon: '🤖', label: 'Advanced Automation', desc: 'Custom AI workflows handle complex, multi-step tasks.' },
      { icon: '📱', label: 'Programmatic SEO', desc: 'Hundreds of templated SEO pages auto-generated.' },
      { icon: '📲', label: 'Social Automation', desc: 'AI generates and schedules posts daily.' },
      { icon: '📊', label: 'Custom Dashboard', desc: 'All business metrics in one unified view.' },
    ],
    fitBullets: [
      'Owners running $100K+ annual revenue.',
      'Want to scale without scaling headcount.',
      'Multiple locations or service offerings.',
    ],
    timeline: [
      { when: 'Week 1', action: '3-hour strategy and system audit.' },
      { when: 'Weeks 2–4', action: 'Deploy voice AI, automation, SEO engine.' },
      { when: 'Month 2', action: 'Full system go-live with close monitoring.' },
      { when: 'Ongoing', action: 'Weekly check-ins (3 months), then monthly.' },
    ],
    setupIncludes: [
      'Everything in Revenue Engine setup',
      'Voice AI system design and deployment',
      'Advanced AI workflow automation setup',
      'Programmatic SEO system architecture',
      'Social media automation configuration',
      'Custom analytics dashboard build',
      'Phone number provisioning and integration',
    ],
    monthlyIncludes: [
      'Everything in Revenue Engine monthly',
      'Voice AI call monitoring and optimization',
      'Advanced automation workflows management',
      'SEO page generation and monitoring',
      'Social content generation and scheduling',
      'Weekly check-ins (first 3 months), then monthly',
    ],
    prevSlug: 'revenue-engine',
    nextSlug: 'ai-automation-starter',
    heroDemoKey: 'terminal',
  },

  'ai-automation-starter': {
    slug: 'ai-automation-starter',
    tier: 'AI Automation Starter',
    oneLiner: 'Your first AI system—handle inquiries 24/7',
    priceMonthly: 97,
    setupFee: 997,
    features: [
      { icon: '🤖', label: 'Custom Chatbot', desc: 'AI trained on your business, answers FAQs instantly.' },
      { icon: '📅', label: 'Auto Booking', desc: 'Chatbot books calls to your calendar.' },
      { icon: '🎯', label: 'Lead Qualification', desc: 'AI asks qualifying questions about budget, timeline.' },
      { icon: '🔗', label: 'CRM Integration', desc: 'All conversations logged in HubSpot, Pipedrive, etc.' },
      { icon: '📊', label: 'Monthly Reports', desc: 'Inquiries handled, leads qualified, common questions.' },
    ],
    fitBullets: [
      'Service businesses getting 10+ inquiries weekly.',
      'Losing leads to voicemail and slow replies.',
      'Want 24/7 lead capture without hiring staff.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Discovery call, gather business knowledge.' },
      { when: 'Week 1', action: 'Build and train AI chatbot.' },
      { when: 'Week 2', action: 'Test, integrate with calendar and CRM.' },
      { when: 'Week 3+', action: 'Launch and monitor, monthly updates.' },
    ],
    setupIncludes: [
      'Discovery call (60 minutes)',
      'AI chatbot custom training',
      'Calendar integration (Google, Calendly, Acuity)',
      'CRM integration (HubSpot, Salesforce, Pipedrive, Zoho)',
      'Deployment and 30-day monitoring',
    ],
    monthlyIncludes: [
      'Hosting and platform fees',
      'Knowledge base updates and refinement',
      'Monthly performance report',
      'Email support and optimization',
      'Calendar and CRM monitoring',
    ],
    prevSlug: 'ai-first',
    nextSlug: 'consulting',
    heroDemoKey: 'ai-starter',
  },

  'consulting': {
    slug: 'consulting',
    tier: 'Consulting',
    oneLiner: 'Know exactly where to start with AI',
    priceMonthly: 1497, // for fractional advisory
    setupFee: 497,
    features: [
      { icon: '🔍', label: 'AI Readiness Audit', desc: 'Honest assessment: what saves money, what is hype.' },
      { icon: '🗺️', label: 'Roadmap', desc: 'Prioritized implementation plan tailored to your business.' },
      { icon: '🛠️', label: 'Tool Stack', desc: 'Vendor recommendations without affiliate bias.' },
      { icon: '📚', label: 'Staff Training', desc: 'Workshop for your team on AI tools.' },
      { icon: '💬', label: 'Fractional Advisor', desc: 'Ongoing monthly strategy and implementation oversight.' },
    ],
    fitBullets: [
      'Unsure if AI is right for your business.',
      'Want expert guidance before spending thousands.',
      'Need implementation roadmap and accountability.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Discovery call (60 minutes).' },
      { when: 'Days 1–5', action: 'Audit and research your business.' },
      { when: 'Day 5', action: 'Debrief call with roadmap and recommendations.' },
      { when: 'Optional', action: 'Staff training (extra $497), monthly advisory ($1,497/mo).' },
    ],
    setupIncludes: [
      'Discovery call (60 minutes)',
      'AI readiness audit (5 business days)',
      'Digital transformation roadmap',
      'Tool and vendor recommendations',
      '30-minute debrief call',
    ],
    monthlyIncludes: [
      'Monthly strategy calls',
      'Ongoing tool and vendor evaluation',
      'Slack/email access for ad hoc questions',
      'Implementation oversight and guidance',
    ],
    prevSlug: 'ai-automation-starter',
    nextSlug: 'add-ons',
    heroDemoKey: 'roadmap',
  },

  'add-ons': {
    slug: 'add-ons',
    tier: 'Add-Ons',
    oneLiner: 'Extend your AI system with specialized services',
    priceMonthly: 0,
    setupFee: 0,
    features: [
      { icon: '💳', label: 'Crypto Payments', desc: 'Accept Bitcoin and stablecoins on your site.' },
      { icon: '🛒', label: 'E-commerce Store', desc: 'Shopify or WooCommerce connected to your AI.' },
      { icon: '♿', label: 'WCAG Audit', desc: 'Full accessibility compliance audit and fixes.' },
    ],
    fitBullets: [
      'Already built with us, need to expand capabilities.',
      'Want compliance, payments, or online sales.',
      'Specialized needs beyond core AI tiers.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Requirements call.' },
      { when: 'Week 1', action: 'Build and integrate add-on.' },
      { when: 'Week 2', action: 'Testing and deployment.' },
      { when: 'Ongoing', action: 'Support and updates included.' },
    ],
    setupIncludes: [
      'Crypto: Payment gateway integration, wallet setup, analytics',
      'E-commerce: Store build, product catalog, inventory setup',
      'Accessibility: Audit, remediation guidance, post-fix verification',
    ],
    monthlyIncludes: [
      'Crypto: Payment reconciliation, monitoring',
      'E-commerce: Inventory and order management',
      'Accessibility: Monitoring, compliance updates',
    ],
    prevSlug: 'consulting',
    nextSlug: null,
    heroDemoKey: 'modules',
  },
};

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES[slug];
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(SERVICES);
}
