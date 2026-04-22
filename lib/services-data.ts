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
    oneLiner: 'Get Found Online — The Foundation Every Business Needs',
    priceMonthly: 99,
    setupFee: 39,
    features: [
      { icon: '🌐', label: 'Website', desc: 'Fast, mobile-friendly site built to convert visitors into inquiries.' },
      { icon: '🔍', label: 'Local SEO', desc: 'Show up in local Google searches. Fully optimized GBP listing.' },
      { icon: '🤖', label: 'AI Assistant', desc: 'Basic AI automation answers FAQs, captures leads, sends you alerts.' },
      { icon: '📊', label: 'Monthly Reports', desc: 'See how many visitors, where they came from, how many inquiries.' },
    ],
    fitBullets: [
      'Just getting started online or have an outdated website.',
      'Not showing up in local Google searches.',
      'Need credibility and visibility without spending $5,000+ on an agency.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Discovery call: 60 minutes to learn your business.' },
      { when: 'Week 1', action: 'Design, build site, and configure AI assistant.' },
      { when: 'Week 2', action: 'Review your feedback and make refinements.' },
      { when: 'Week 2–3', action: 'Go live and monitor for 30 days.' },
    ],
    setupIncludes: [
      'Discovery call and strategy',
      'Website design and build (5 pages)',
      'Google Business Profile setup and optimization',
      'Basic AI automation and assistant configuration',
      '30-day launch support and monitoring',
    ],
    monthlyIncludes: [
      'Hosting, maintenance, security',
      'Up to 2 content updates',
      'Monthly performance report',
      'Email support (6-hour response)',
      'AI assistant and GBP monitoring',
    ],
    prevSlug: null,
    nextSlug: 'growth',
    heroDemoKey: 'gbp',
  },

  'ai-automation-starter': {
    slug: 'ai-automation-starter',
    tier: 'AI Automation Starter',
    oneLiner: 'Your First AI System — Handle Inquiries 24/7',
    priceMonthly: 99,
    setupFee: 99,
    features: [
      { icon: '🤖', label: 'AI Automation System', desc: 'AI trained on your business, answers FAQs instantly.' },
      { icon: '📅', label: 'Auto Booking', desc: 'Smart assistant books calls to your calendar.' },
      { icon: '🎯', label: 'Lead Qualification', desc: 'AI asks qualifying questions about budget, timeline.' },
      { icon: '🔗', label: 'CRM Integration', desc: 'All conversations logged in HubSpot, Pipedrive, etc.' },
      { icon: '📊', label: 'Monthly Reports', desc: 'Inquiries handled, leads qualified, common questions.' },
    ],
    fitBullets: [
      'Service business getting 10+ inquiries weekly.',
      'Losing leads to voicemail and slow replies.',
      'Want 24/7 lead capture without hiring staff.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Discovery call, gather business knowledge.' },
      { when: 'Week 1', action: 'Build and train AI automation and assistant system.' },
      { when: 'Week 2', action: 'Test, integrate with calendar and CRM.' },
      { when: 'Week 3+', action: 'Launch and monitor, monthly updates.' },
    ],
    setupIncludes: [
      'Discovery call (60 minutes)',
      'AI automation and assistant custom training',
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
    prevSlug: null,
    nextSlug: 'presence',
    heroDemoKey: 'ai-starter',
  },

  'growth': {
    slug: 'growth',
    tier: 'Growth',
    oneLiner: 'Turn Visitors Into Leads Automatically',
    priceMonthly: 149,
    setupFee: 59,
    features: [
      { icon: '⚙️', label: 'AI Automation', desc: 'CRM-integrated AI automation qualifies leads and books calls.' },
      { icon: '📧', label: 'Email Marketing', desc: '5–7 email welcome sequence that builds relationships.' },
      { icon: '📝', label: 'SEO Content', desc: '2 articles monthly. 24+ posts yearly ranked on Google.' },
      { icon: '🎯', label: 'Landing Pages', desc: 'Conversion-optimized pages for your top services.' },
      { icon: '📊', label: 'Everything in Presence', desc: 'Website, local SEO, and AI assistant included.' },
    ],
    fitBullets: [
      'Established business getting 20+ inquiries monthly.',
      'Losing leads because your follow-up is slow or disorganized.',
      'Want automation without hiring a sales or marketing team.',
    ],
    timeline: [
      { when: 'Day 1', action: 'Strategy call and competitive audit.' },
      { when: 'Weeks 1–2', action: 'Build automation, email sequences, landing pages.' },
      { when: 'Week 3', action: 'Test copy, integrations, and conversions.' },
      { when: 'Week 4+', action: 'Launch, monitor, optimize with monthly reviews.' },
    ],
    setupIncludes: [
      'Everything in Presence setup',
      'AI automation system design and build',
      'CRM integration (HubSpot, Salesforce, Pipedrive, etc.)',
      'Email marketing platform setup with sequences',
      'First 2 SEO content pieces',
    ],
    monthlyIncludes: [
      'Everything in Presence monthly',
      '2 new SEO articles',
      'AI automation and email optimization',
      'CRM and workflow monitoring',
      'Advanced AI assistant (knowledge base trained)',
    ],
    prevSlug: 'presence',
    nextSlug: 'revenue-engine',
    heroDemoKey: 'lead-counter',
  },

  'revenue-engine': {
    slug: 'revenue-engine',
    tier: 'Revenue Engine',
    oneLiner: 'Automate Your Entire Sales System',
    priceMonthly: 249,
    setupFee: 99,
    features: [
      { icon: '🔀', label: 'Sales Funnel', desc: 'Custom funnel maps buyer journey and closes deals.' },
      { icon: '⚡', label: 'Workflow Automation', desc: 'Custom workflows eliminate repetitive manual tasks.' },
      { icon: '📢', label: 'Paid Ads', desc: 'Google or Meta ads setup, tracking, and optimization.' },
      { icon: '🤖', label: 'CRM Integration', desc: 'Unified customer data across all touchpoints.' },
      { icon: '💬', label: 'Everything in Growth', desc: 'Website, AI automation, email, SEO content.' },
    ],
    fitBullets: [
      'Service business generating $20K+ monthly revenue.',
      'Ready to outsource entire sales operation.',
      'Want revenue growth without hiring more salespeople.',
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
      'Workflow automation setup and configuration',
      'Paid ads account setup and first campaigns',
      'CRM integration and data mapping',
      'Daily launch monitoring (first month)',
    ],
    monthlyIncludes: [
      'Everything in Growth monthly',
      'Workflow automation management',
      'Paid ads optimization and scaling',
      'Advanced AI assistant (knowledge base trained)',
      'CRM data hygiene and analysis',
    ],
    prevSlug: 'growth',
    nextSlug: 'ai-first',
    heroDemoKey: 'funnel',
  },

  'ai-first': {
    slug: 'ai-first',
    tier: 'AI-First',
    oneLiner: 'Replace Manual Work with AI at Scale',
    priceMonthly: 349,
    setupFee: 199,
    features: [
      { icon: '📞', label: 'Voice AI', desc: 'AI answers calls, books appointments, handles inquiries.' },
      { icon: '🤖', label: 'Advanced Automation', desc: 'Custom AI workflows handle complex, multi-step tasks.' },
      { icon: '🧠', label: 'Advanced AI Assistant', desc: 'AI trained on your knowledge base — handles complex queries across channels.' },
      { icon: '📲', label: 'Social Automation', desc: 'AI generates and schedules posts daily.' },
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
      'Advanced AI assistant setup and knowledge base training',
      'Social media automation configuration',
      'Phone number provisioning and integration',
    ],
    monthlyIncludes: [
      'Everything in Revenue Engine monthly',
      'Voice AI call monitoring and optimization',
      'Advanced automation workflows management',
      'Social content generation and scheduling',
      'Weekly check-ins (first 3 months), then monthly',
    ],
    prevSlug: 'revenue-engine',
    nextSlug: null,
    heroDemoKey: 'terminal',
  },


  'consulting': {
    slug: 'consulting',
    tier: 'À La Carte',
    oneLiner: 'Pick individual services — no monthly plan required',
    priceMonthly: 99,
    setupFee: 99,
    features: [
      { icon: '🌐', label: 'Professional Website',  desc: '15-page site built to convert.' },
      { icon: '🤖', label: 'Advanced AI Assistant', desc: 'Knowledge-base chatbot trained on your business.' },
      { icon: '📍', label: 'Local SEO',             desc: 'Local SEO and Google Business Profile setup.' },
      { icon: '📞', label: 'Voice AI',              desc: 'AI that answers calls and books appointments.' },
      { icon: '⚡', label: 'AI Automation System',  desc: 'Lead qualification and pipeline automation.' },
    ],
    fitBullets: [
      'Want one capability without committing to a full monthly plan.',
      'Testing a single service before expanding.',
      'Need a one-time build — website, AI assistant, SEO, or automation.',
    ],
    timeline: [
      { when: 'Step 1', action: 'Tell me what you need — contact form or quick call.' },
      { when: 'Step 2', action: 'Receive a clear itemised quote within 24 hours.' },
      { when: 'Step 3', action: 'Approve the quote and I build it.' },
      { when: 'Step 4', action: 'Expand with more services whenever you\'re ready.' },
    ],
    setupIncludes: [
      'One-time build for the service(s) you select',
      'Clear itemised quote before any work begins',
      'No minimum commitment beyond the selected service',
      'Handover documentation and walkthrough',
    ],
    monthlyIncludes: [
      'Optional ongoing support (quoted separately)',
      'Upgrade to a monthly plan at any time',
    ],
    prevSlug: null,
    nextSlug: null,
    heroDemoKey: 'roadmap',
  },

  'add-ons': {
    slug: 'add-ons',
    tier: 'Add-Ons',
    oneLiner: 'Extend Your AI System with Specialized Services',
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
    prevSlug: null,
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
