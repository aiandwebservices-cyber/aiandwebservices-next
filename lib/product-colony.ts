/** Facts rendered on /product/colony. Monthly figures here are the ones that page prints. */
export const COLONY_INCLUDED = [
  { plan: 'Revenue Engine', slug: 'revenue-engine', monthlyFee: 249 },
  { plan: 'AI-First', slug: 'ai-first', monthlyFee: 349 },
] as const;

export const COLONY_HERO = {
  eyebrow: 'Included with Revenue Engine + AI-First',
  title: 'Your AI workforce, finally visible.',
  summary: 'Colony is the live operations dashboard we built for ourselves — now available to Revenue Engine and AI-First customers. Watch your agents work, track every lead, see revenue move in real time.',
  url: 'https://www.aiandwebservices.com/product/colony',
};

export const COLONY_VIEWS = [
  {
    title: 'Meet your crew',
    description: 'Your AI agents are not invisible code anymore. Each one has a name, a role, and a transparent track record. Click any agent to see exactly what they have done for your business this week.',
  },
  {
    title: 'Every lead in one place',
    description: 'Your prospects show up the moment they arrive. Filter by temperature, niche, source. Drill into any lead and see the drafted outreach email before you send it.',
  },
  {
    title: 'The story behind every lead',
    description: 'Signals, drafts, activity history, and a single-click Mark Contacted action. No more jumping between EspoCRM, Google Sheets, and sticky notes.',
  },
];

export const COLONY_WHO = 'Colony is designed for small businesses with 1 to 20 employees — dental offices, insurance agencies, restaurants, law firms, any service business where every lead matters and every minute counts.';

export const COLONY_STEPS = [
  'We install your agent system and connect it to your business.',
  'Your agents run on a schedule, finding leads and drafting outreach 24 hours a day, seven days a week.',
  'You log into Colony each morning to see what they did and what needs your attention today.',
];

export const COLONY_FAQS = [
  {
    question: 'What data does Colony have access to?',
    answer: 'Colony connects to the systems we already set up for your business during onboarding: your lead pipeline, your CRM records, and your AI agent activity logs. It reads and displays that data. It does not access your email inbox, financial accounts, or any data outside your AIandWEBservices setup.',
  },
  {
    question: 'How is this different from a CRM like HubSpot?',
    answer: 'A traditional CRM is a place you manually log activity. Colony is a live feed of what your AI agents are doing right now. It surfaces leads the moment they arrive, shows you drafted outreach before it goes out, and tracks which agents ran and what they found. You are watching your workforce, not entering data.',
  },
  {
    question: 'Can I use my existing CRM alongside Colony?',
    answer: 'Yes. Colony integrates with EspoCRM and can sit alongside whatever CRM you already use for human-driven activity. Your AI agents feed into Colony, and your team continues using the tools they already know.',
  },
  {
    question: 'What happens if I cancel?',
    answer: 'If you cancel your Revenue Engine or AI-First plan, your Colony access ends. All your lead and activity data remains in your EspoCRM instance, which you can export at any time.',
  },
  {
    question: 'Is my data isolated from other customers?',
    answer: 'Completely. Every Colony instance is scoped to a single cohort. Your agents, your leads, your reports. Nothing is shared, nothing is blended.',
  },
];
