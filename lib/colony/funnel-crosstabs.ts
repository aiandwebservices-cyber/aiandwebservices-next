/**
 * Funnel cross-tabs: group Leads by TWO dimensions, compute conversion to Audit+/Active.
 * Surface outliers (segments 2x above/below baseline).
 */

export type CrossTabDimension = 'niche' | 'source' | 'city' | 'assignedUser';
export type TimeWindow = '30d' | '90d' | 'all';

export interface CrossTabCell {
  dim_a_value: string;
  dim_b_value: string;
  total_leads: number;
  reached_audit: number;   // status in {Audit Scheduled, Audit Complete, Proposal Sent, Proposal Signed, Active}
  reached_proposal: number; // status in {Proposal Sent, Proposal Signed, Active}
  reached_signed: number;   // status in {Proposal Signed, Active}
  audit_rate_pct: number | null;
  proposal_rate_pct: number | null;
  signed_rate_pct: number | null;
  is_outlier_high: boolean;
  is_outlier_low: boolean;
}

export interface CrossTabResult {
  window: TimeWindow;
  dim_a: CrossTabDimension;
  dim_b: CrossTabDimension;
  baseline_audit_rate_pct: number | null;
  baseline_proposal_rate_pct: number | null;
  baseline_signed_rate_pct: number | null;
  total_leads: number;
  cells: CrossTabCell[];
  has_data: boolean;
  notes: string[];
}

const ESPOCRM_URL = process.env.ESPOCRM_URL || 'http://localhost:8080';
const ESPOCRM_API_KEY = process.env.ESPOCRM_API_KEY || '';

// Field name mapping — confirmed against live EspoCRM schema (2026-04-24)
// EspoCRM uses 'source' (not 'leadSource'), 'industry' (sparse), 'addressCity', 'assignedUserName'
const DIMENSION_FIELD_MAP: Record<CrossTabDimension, string> = {
  niche: 'industry',
  source: 'source',
  city: 'addressCity',
  assignedUser: 'assignedUserName',
};

// Stage tiers per David's memory
const AUDIT_STAGES = ['Audit Scheduled', 'Audit Complete', 'Proposal Sent', 'Proposal Signed', 'Active'];
const PROPOSAL_STAGES = ['Proposal Sent', 'Proposal Signed', 'Active'];
const SIGNED_STAGES = ['Proposal Signed', 'Active'];

function windowToISO(window: TimeWindow): string {
  const now = Date.now();
  switch (window) {
    case '30d': return new Date(now - 30 * 86400000).toISOString();
    case '90d': return new Date(now - 90 * 86400000).toISOString();
    case 'all': return new Date('2026-01-01').toISOString();
  }
}

export async function fetchFunnelCrossTabs(
  dimA: CrossTabDimension,
  dimB: CrossTabDimension,
  window: TimeWindow = '30d'
): Promise<CrossTabResult> {
  const notes: string[] = [];
  const windowStart = windowToISO(window);

  const empty: CrossTabResult = {
    window,
    dim_a: dimA,
    dim_b: dimB,
    baseline_audit_rate_pct: null,
    baseline_proposal_rate_pct: null,
    baseline_signed_rate_pct: null,
    total_leads: 0,
    cells: [],
    has_data: false,
    notes,
  };

  if (dimA === dimB) {
    notes.push('dim_a and dim_b must differ');
    return { ...empty, notes };
  }

  if (!ESPOCRM_API_KEY) {
    notes.push('ESPOCRM_API_KEY not set');
    return { ...empty, notes };
  }

  try {
    const fieldA = DIMENSION_FIELD_MAP[dimA];
    const fieldB = DIMENSION_FIELD_MAP[dimB];

    // Pull all leads in window with the two dimensions + status
    const url = new URL(`${ESPOCRM_URL}/api/v1/Lead`);
    url.searchParams.set('where[0][type]', 'greaterThanOrEquals');
    url.searchParams.set('where[0][attribute]', 'createdAt');
    url.searchParams.set('where[0][value]', windowStart);
    url.searchParams.set('select', `id,status,${fieldA},${fieldB}`);
    url.searchParams.set('maxSize', '500');

    const resp = await fetch(url.toString(), {
      headers: { 'X-Api-Key': ESPOCRM_API_KEY },
    });
    if (!resp.ok) {
      notes.push(`EspoCRM returned ${resp.status}`);
      return { ...empty, notes };
    }

    const data = await resp.json();
    const leads: Array<Record<string, unknown>> = data.list || [];

    if (leads.length === 0) {
      notes.push('No leads in this window');
      return { ...empty, notes };
    }

    // Aggregate by (dimA, dimB) cell
    type CellAcc = { total: number; audit: number; proposal: number; signed: number };
    const cellMap: Record<string, CellAcc> = {};
    let totalAll = 0;
    let totalAudit = 0;
    let totalProposal = 0;
    let totalSigned = 0;

    for (const lead of leads) {
      const aVal = String(lead[fieldA] || '(unknown)');
      const bVal = String(lead[fieldB] || '(unknown)');
      const status = String(lead.status || '');
      const key = `${aVal}||${bVal}`;

      if (!cellMap[key]) cellMap[key] = { total: 0, audit: 0, proposal: 0, signed: 0 };
      cellMap[key].total += 1;
      totalAll += 1;

      if (AUDIT_STAGES.includes(status)) { cellMap[key].audit += 1; totalAudit += 1; }
      if (PROPOSAL_STAGES.includes(status)) { cellMap[key].proposal += 1; totalProposal += 1; }
      if (SIGNED_STAGES.includes(status)) { cellMap[key].signed += 1; totalSigned += 1; }
    }

    const baselineAudit = totalAll === 0 ? null : (totalAudit / totalAll) * 100;
    const baselineProposal = totalAll === 0 ? null : (totalProposal / totalAll) * 100;
    const baselineSigned = totalAll === 0 ? null : (totalSigned / totalAll) * 100;

    const cells: CrossTabCell[] = [];
    for (const [key, acc] of Object.entries(cellMap)) {
      // Skip tiny cells (< 3 leads) — statistical noise
      if (acc.total < 3) continue;

      const [aVal, bVal] = key.split('||');
      const auditRate = (acc.audit / acc.total) * 100;
      const proposalRate = (acc.proposal / acc.total) * 100;
      const signedRate = (acc.signed / acc.total) * 100;

      let isHigh = false;
      let isLow = false;
      if (baselineAudit !== null && baselineAudit > 0) {
        if (auditRate > baselineAudit * 2) isHigh = true;
        if (auditRate < baselineAudit * 0.5) isLow = true;
      }

      cells.push({
        dim_a_value: aVal,
        dim_b_value: bVal,
        total_leads: acc.total,
        reached_audit: acc.audit,
        reached_proposal: acc.proposal,
        reached_signed: acc.signed,
        audit_rate_pct: Math.round(auditRate * 10) / 10,
        proposal_rate_pct: Math.round(proposalRate * 10) / 10,
        signed_rate_pct: Math.round(signedRate * 10) / 10,
        is_outlier_high: isHigh,
        is_outlier_low: isLow,
      });
    }

    // Sort: outliers first (high first, then low), then by total_leads desc
    cells.sort((a, b) => {
      if (a.is_outlier_high !== b.is_outlier_high) return a.is_outlier_high ? -1 : 1;
      if (a.is_outlier_low !== b.is_outlier_low) return a.is_outlier_low ? -1 : 1;
      return b.total_leads - a.total_leads;
    });

    if (cells.length === 0) {
      notes.push('All cells were too small (<3 leads) to analyze. Try a wider time window.');
    }

    return {
      window,
      dim_a: dimA,
      dim_b: dimB,
      baseline_audit_rate_pct: baselineAudit === null ? null : Math.round(baselineAudit * 10) / 10,
      baseline_proposal_rate_pct: baselineProposal === null ? null : Math.round(baselineProposal * 10) / 10,
      baseline_signed_rate_pct: baselineSigned === null ? null : Math.round(baselineSigned * 10) / 10,
      total_leads: totalAll,
      cells,
      has_data: cells.length > 0,
      notes,
    };
  } catch (e) {
    notes.push((e as Error).message);
    return { ...empty, notes };
  }
}
