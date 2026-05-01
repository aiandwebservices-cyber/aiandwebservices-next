const PLANS = {
  growth: {
    name: 'Growth',
    monthlyPrice: 699,
    setupFee: 499,
    tagline: 'Everything you need to get started',
    vehicleLimit: 25,
    aiAgents: ['chat', 'descriptions', 'reviewResponder'],
    features: {
      website: true,
      adminPanel: true,
      crmSync: true,
      aiChat: true,
      aiDescriptions: true,
      aiReviewResponder: true,
      aiLeadScorer: false,
      aiPriceOptimizer: false,
      aiFollowUp: false,
      smsAgent: false,
      stripePayments: false,
      syndication: false,
      automation: false,
      multiLocation: false,
      dedicatedCrm: false,
      customIntegrations: false,
      prioritySupport: false,
    },
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 1199,
    setupFee: 999,
    tagline: 'Full power for serious dealers',
    vehicleLimit: 100,
    aiAgents: ['chat', 'descriptions', 'reviewResponder', 'leadScorer', 'priceOptimizer', 'followUp'],
    features: {
      website: true,
      adminPanel: true,
      crmSync: true,
      aiChat: true,
      aiDescriptions: true,
      aiReviewResponder: true,
      aiLeadScorer: true,
      aiPriceOptimizer: true,
      aiFollowUp: true,
      smsAgent: true,
      stripePayments: true,
      syndication: true,
      automation: true,
      multiLocation: false,
      dedicatedCrm: false,
      customIntegrations: false,
      prioritySupport: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 1799,
    setupFee: 1999,
    tagline: 'Multi-location dealers with custom needs',
    vehicleLimit: -1,
    aiAgents: ['chat', 'descriptions', 'reviewResponder', 'leadScorer', 'priceOptimizer', 'followUp'],
    features: {
      website: true,
      adminPanel: true,
      crmSync: true,
      aiChat: true,
      aiDescriptions: true,
      aiReviewResponder: true,
      aiLeadScorer: true,
      aiPriceOptimizer: true,
      aiFollowUp: true,
      smsAgent: true,
      stripePayments: true,
      syndication: true,
      automation: true,
      multiLocation: true,
      dedicatedCrm: true,
      customIntegrations: true,
      prioritySupport: true,
    },
  },
};

const OVERLAY_DISCOUNT = 200;

const FEATURE_LABELS = {
  website: 'Dealer Website',
  adminPanel: 'Admin Panel & CRM',
  crmSync: 'EspoCRM Sync',
  aiChat: 'AI Sales Agent (Chat)',
  aiDescriptions: 'AI Description Writer',
  aiReviewResponder: 'AI Review Responder',
  aiLeadScorer: 'AI Lead Scorer',
  aiPriceOptimizer: 'AI Price Optimizer',
  aiFollowUp: 'AI Follow-Up Writer',
  smsAgent: 'SMS AI Agent',
  stripePayments: 'Stripe Payments',
  syndication: 'Listing Syndication',
  automation: 'n8n Automation',
  multiLocation: 'Multi-Location',
  dedicatedCrm: 'Dedicated CRM Instance',
  customIntegrations: 'Custom Integrations',
  prioritySupport: 'Priority Support',
};

export function getPlan(planId) {
  return PLANS[planId] || null;
}

export function getPlanPrice(planId, isOverlay = false) {
  const plan = PLANS[planId];
  if (!plan) return null;
  return isOverlay ? plan.monthlyPrice - OVERLAY_DISCOUNT : plan.monthlyPrice;
}

export function isFeatureAvailable(planId, featureKey) {
  return !!(PLANS[planId]?.features?.[featureKey]);
}

export function getAvailableAiAgents(planId) {
  return PLANS[planId]?.aiAgents ?? [];
}

export { PLANS, OVERLAY_DISCOUNT, FEATURE_LABELS };
