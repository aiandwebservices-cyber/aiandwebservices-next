/** Feature matrix rendered by /services/compare. */
export const COMPARE_TIER_ORDER = ['ai-automation-starter', 'presence', 'growth', 'revenue-engine', 'ai-first'] as const;

export const FEATURE_ROWS: { label: string; group: string; tiers: string[] }[] = [
  { label: 'Professional website (5 pages)',              group: 'Website & SEO',        tiers: ['presence', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Local SEO + Google Business Profile',         group: 'Website & SEO',        tiers: ['presence', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Basic AI assistant',                          group: 'AI & Automation',       tiers: ['ai-automation-starter', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'AI automation system (lead qualify)',         group: 'AI & Automation',       tiers: ['ai-automation-starter', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Calendar + CRM integration',                  group: 'AI & Automation',       tiers: ['ai-automation-starter', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Monthly performance report',                  group: 'AI & Automation',       tiers: ['ai-automation-starter', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Monthly SEO + site health report',            group: 'Website & SEO',        tiers: ['presence', 'growth', 'revenue-engine', 'ai-first'] },
  { label: 'Email marketing + welcome sequence',          group: 'Marketing & Growth',    tiers: ['growth', 'revenue-engine', 'ai-first'] },
  { label: 'SEO content (2 articles/month)',              group: 'Website & SEO',        tiers: ['growth', 'revenue-engine', 'ai-first'] },
  { label: 'Sales funnel design + build',                 group: 'Marketing & Growth',    tiers: ['revenue-engine', 'ai-first'] },
  { label: 'Workflow automation',                         group: 'AI & Automation',       tiers: ['revenue-engine', 'ai-first'] },
  { label: 'Paid ads management (client funds spend)',    group: 'Marketing & Growth',    tiers: ['revenue-engine', 'ai-first'] },
  { label: 'Advanced AI assistant (knowledge base)',      group: 'AI & Automation',       tiers: ['revenue-engine', 'ai-first'] },
  { label: 'Voice AI (answers calls)',                    group: 'AI & Automation',       tiers: ['ai-first'] },
  { label: 'Social media AI scheduling',                  group: 'AI & Automation',       tiers: ['ai-first'] },
];

export const GROUP_ORDER = ['Website & SEO', 'AI & Automation', 'Marketing & Growth', 'Strategy & Analytics'];
