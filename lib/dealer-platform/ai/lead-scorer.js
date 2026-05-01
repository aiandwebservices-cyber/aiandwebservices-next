// Deterministic lead scoring for the dealer platform.
// scoreLead() folds in behavior signals from site analytics; scoreLeadSync()
// works only from the EspoCRM Lead record so it's safe to run on demand.

const TIERS = [
  { min: 80, tier: 'HOT',  emoji: '🔥', recommendation: 'Call within 5 minutes — high purchase intent' },
  { min: 60, tier: 'WARM', emoji: '🟡', recommendation: 'Call within 1 hour — strong engagement' },
  { min: 40, tier: 'COOL', emoji: '🟢', recommendation: 'Call today — qualified interest' },
  { min: 0,  tier: 'COLD', emoji: '⚪', recommendation: 'Add to nurture sequence — low engagement' },
];

function classify(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const t = TIERS.find((x) => clamped >= x.min) || TIERS[TIERS.length - 1];
  return { score: clamped, tier: t.tier, emoji: t.emoji, recommendation: t.recommendation };
}

function pickTopSignals(signals, n = 3) {
  return [...signals].sort((a, b) => b.value - a.value).slice(0, n).map((s) => s.label);
}

const SOURCE_POINTS = {
  BuildYourDeal: 25,
  PreApproval: 20,
  Reserve: 25,
  TestDrive: 20,
  TradeIn: 15,
  GetEPrice: 10,
  Chat: 5,
  Contact: 3,
};

const CREDIT_TIER_POINTS = {
  Excellent: 10,
  Good: 5,
  Fair: 0,
  Rebuilding: 0,
};

const DEAL_STATUS_POINTS = {
  Working: 20,
  Approved: 25,
};

function isToday(value) {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

function hasPhone(lead) {
  if (!lead) return false;
  if (lead.phoneNumber || lead.phone) return true;
  const data = lead.phoneNumberData;
  if (Array.isArray(data) && data.some((p) => p && p.phoneNumber)) return true;
  return false;
}

function hasEmail(lead) {
  if (!lead) return false;
  if (lead.emailAddress || lead.email) return true;
  const data = lead.emailAddressData;
  if (Array.isArray(data) && data.some((e) => e && e.emailAddress)) return true;
  return false;
}

function hasTradeIn(lead) {
  if (!lead) return false;
  return Boolean(
    lead.cTradeInVin ||
      lead.cTradeInYear ||
      lead.cTradeInMake ||
      lead.cTradeInModel ||
      lead.cHasTradeIn,
  );
}

function hasFinance(lead) {
  if (!lead) return false;
  return Boolean(
    lead.cFinanceApproved ||
      lead.cFinanceAmount ||
      lead.cDownPayment ||
      lead.cMonthlyPayment ||
      lead.cCreditTier,
  );
}

export function scoreLeadSync(lead) {
  const signals = [];
  let total = 0;

  const source = lead?.cLeadSource || lead?.source;
  if (source && SOURCE_POINTS[source] != null) {
    const pts = SOURCE_POINTS[source];
    total += pts;
    signals.push({ label: `Source: ${source}`, value: pts });
  }

  if (hasPhone(lead)) {
    total += 10;
    signals.push({ label: 'Phone provided', value: 10 });
  } else {
    total -= 10;
    signals.push({ label: 'No phone', value: -10 });
  }

  if (hasEmail(lead)) {
    total += 10;
    signals.push({ label: 'Email provided', value: 10 });
  } else {
    total -= 5;
    signals.push({ label: 'No email', value: -5 });
  }

  if (hasTradeIn(lead)) {
    total += 15;
    signals.push({ label: 'Trade-in info provided', value: 15 });
  }

  if (hasFinance(lead)) {
    total += 15;
    signals.push({ label: 'Finance info provided', value: 15 });
  }

  const credit = lead?.cCreditTier;
  if (credit && CREDIT_TIER_POINTS[credit]) {
    const pts = CREDIT_TIER_POINTS[credit];
    total += pts;
    signals.push({ label: `Credit tier: ${credit}`, value: pts });
  }

  const dealStatus = lead?.cDealStatus;
  if (dealStatus && DEAL_STATUS_POINTS[dealStatus]) {
    const pts = DEAL_STATUS_POINTS[dealStatus];
    total += pts;
    signals.push({ label: `Deal status: ${dealStatus}`, value: pts });
  }

  if (isToday(lead?.createdAt)) {
    total += 5;
    signals.push({ label: 'Created today', value: 5 });
  }

  const classified = classify(total);
  return {
    ...classified,
    topSignals: pickTopSignals(signals.filter((s) => s.value > 0)),
  };
}

const HIGH_INTENT = [
  ['completedBuildYourDeal', 25, 'Completed Build Your Deal'],
  ['submittedPreApproval', 20, 'Submitted finance pre-approval'],
  ['reservedVehicle', 25, 'Reserved a vehicle (deposit)'],
  ['scheduledTestDrive', 20, 'Scheduled a test drive'],
  ['usedPaymentCalculator', 15, 'Used payment calculator'],
  ['submittedTradeIn', 15, 'Submitted trade-in estimate'],
];

const MEDIUM_INTENT = [
  ['vehicleDetailViews', 10, 'Viewed 3+ vehicle detail pages', (v) => Number(v) >= 3],
  ['timeOnSiteSeconds', 10, 'Spent 5+ minutes on site', (v) => Number(v) >= 300],
  ['savedVehicle', 10, 'Saved/favorited a vehicle'],
  ['priceAlertSignup', 5, 'Signed up for price alerts'],
  ['usedComparison', 10, 'Used vehicle comparison tool'],
  ['returningVisitor', 10, 'Returned to site 2+ times', (v) => Number(v) >= 2],
];

const LOW_INTENT = [
  ['viewedInventoryPage', 3, 'Viewed inventory page'],
  ['clickedDirections', 5, 'Clicked Get Directions'],
  ['viewedFinancingPage', 5, 'Viewed financing page'],
];

function applyBehaviorRule(behaviorData, key, points, label, predicate, signals) {
  const v = behaviorData?.[key];
  const matched = predicate ? predicate(v) : Boolean(v);
  if (matched) {
    signals.push({ label, value: points });
    return points;
  }
  return 0;
}

export async function scoreLead(lead, behaviorData = {}) {
  const signals = [];
  let total = 0;

  for (const [key, pts, label, pred] of HIGH_INTENT) {
    total += applyBehaviorRule(behaviorData, key, pts, label, pred, signals);
  }
  for (const [key, pts, label, pred] of MEDIUM_INTENT) {
    total += applyBehaviorRule(behaviorData, key, pts, label, pred, signals);
  }
  for (const [key, pts, label, pred] of LOW_INTENT) {
    total += applyBehaviorRule(behaviorData, key, pts, label, pred, signals);
  }

  const credit = lead?.cCreditTier;
  if (credit && CREDIT_TIER_POINTS[credit]) {
    const pts = CREDIT_TIER_POINTS[credit];
    total += pts;
    signals.push({ label: `Credit tier: ${credit}`, value: pts });
  }

  if (!hasPhone(lead)) {
    total -= 10;
    signals.push({ label: 'No phone', value: -10 });
  }
  if (!hasEmail(lead)) {
    total -= 5;
    signals.push({ label: 'No email', value: -5 });
  }
  if (Number(behaviorData?.timeOnSiteSeconds) > 0 && Number(behaviorData?.timeOnSiteSeconds) < 30) {
    total -= 15;
    signals.push({ label: 'Bounced under 30s', value: -15 });
  }

  const classified = classify(total);
  return {
    ...classified,
    topSignals: pickTopSignals(signals.filter((s) => s.value > 0)),
  };
}

export function scoreToDealTier(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= 0) return 1;
  return Math.max(1, Math.min(10, Math.round(clamped / 10)));
}
