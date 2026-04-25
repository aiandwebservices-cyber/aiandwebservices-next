/**
 * Stage analytics — aggregates time-in-stage across all Opportunities
 * using lead_state_transitions data.
 */

export type TimeWindow = '30d' | '90d' | 'all';

interface Transition {
  entity_id: string;
  field_name: string;
  before_value: string | null;
  after_value: string | null;
  changed_at: string;
}

export interface StageAnalytics {
  window: TimeWindow;
  total_opportunities_tracked: number;
  avg_days_by_stage: Record<string, number | null>;
  median_days_by_stage: Record<string, number | null>;
  sample_size_by_stage: Record<string, number>;
  velocity_insights: string[];
  has_data: boolean;
}

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';

const KNOWN_STAGES = [
  'Lead',
  'Audit Scheduled',
  'Audit Complete',
  'Proposal Sent',
  'Proposal Signed',
  'Active',
  'Churned',
];

function windowToISO(window: TimeWindow): string {
  const now = Date.now();
  switch (window) {
    case '30d': return new Date(now - 30 * 86400000).toISOString();
    case '90d': return new Date(now - 90 * 86400000).toISOString();
    case 'all': return new Date('2026-01-01').toISOString();
  }
}

async function scrollAllTransitions(windowStart: string): Promise<Transition[]> {
  const all: Transition[] = [];
  let nextOffset: string | number | null = null;
  let safety = 0;

  while (safety < 100) {
    const body: Record<string, unknown> = {
      limit: 500,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [
          { key: 'entity_type', match: { value: 'Opportunity' } },
          { key: 'field_name', match: { value: 'stage' } },
          { key: 'changed_at', range: { gte: windowStart } },
        ],
      },
    };
    if (nextOffset !== null) body.offset = nextOffset;

    let resp;
    try {
      resp = await fetch(`${QDRANT_URL}/collections/lead_state_transitions/points/scroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      break;
    }
    if (!resp.ok) break;
    const data = await resp.json();
    const points = data.result?.points || [];
    for (const p of points) {
      const pl = p.payload || {};
      all.push({
        entity_id: pl.entity_id,
        field_name: pl.field_name,
        before_value: pl.before_value,
        after_value: pl.after_value,
        changed_at: pl.changed_at,
      });
    }
    nextOffset = data.result?.next_page_offset ?? null;
    if (nextOffset === null) break;
    safety += 1;
  }

  return all;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export async function fetchStageAnalytics(window: TimeWindow = '90d'): Promise<StageAnalytics> {
  const windowStart = windowToISO(window);
  const transitions = await scrollAllTransitions(windowStart);

  if (transitions.length === 0) {
    return {
      window,
      total_opportunities_tracked: 0,
      avg_days_by_stage: {},
      median_days_by_stage: {},
      sample_size_by_stage: {},
      velocity_insights: [],
      has_data: false,
    };
  }

  // Group by entity_id, sort each entity's transitions by changed_at
  const byEntity: Record<string, Transition[]> = {};
  for (const t of transitions) {
    if (!byEntity[t.entity_id]) byEntity[t.entity_id] = [];
    byEntity[t.entity_id].push(t);
  }
  for (const eid of Object.keys(byEntity)) {
    byEntity[eid].sort((a, b) => a.changed_at.localeCompare(b.changed_at));
  }

  // Compute time-in-stage: for each consecutive transition pair, the duration between them
  // represents time spent in the PRE-transition stage (before_value).
  const stageDurations: Record<string, number[]> = {};

  for (const entity_transitions of Object.values(byEntity)) {
    for (let i = 0; i < entity_transitions.length - 1; i += 1) {
      const from = entity_transitions[i];
      const to = entity_transitions[i + 1];
      const stage = from.after_value;  // landed in this stage at `from.changed_at`, left at `to.changed_at`
      if (!stage) continue;

      const fromMs = new Date(from.changed_at).getTime();
      const toMs = new Date(to.changed_at).getTime();
      const days = (toMs - fromMs) / 86400000;
      if (days < 0) continue;

      if (!stageDurations[stage]) stageDurations[stage] = [];
      stageDurations[stage].push(days);
    }
  }

  const avg: Record<string, number | null> = {};
  const med: Record<string, number | null> = {};
  const samples: Record<string, number> = {};

  for (const stage of KNOWN_STAGES) {
    const values = stageDurations[stage] || [];
    samples[stage] = values.length;
    avg[stage] = values.length > 0 ? Math.round((mean(values) || 0) * 10) / 10 : null;
    med[stage] = values.length > 0 ? Math.round((median(values) || 0) * 10) / 10 : null;
  }

  // Generate velocity insights
  const insights: string[] = [];
  for (const stage of KNOWN_STAGES) {
    const m = med[stage];
    const s = samples[stage] || 0;
    if (m === null || s < 3) continue;

    if (stage === 'Audit Scheduled' && m > 7) {
      insights.push(`Leads sit in Audit Scheduled for ${m}d median — consider faster scheduling tools`);
    }
    if (stage === 'Audit Complete' && m > 14) {
      insights.push(`${m}d median between audit completion and proposal — large gap may lose momentum`);
    }
    if (stage === 'Proposal Sent' && m > 21) {
      insights.push(`Proposals sit ${m}d median without response — follow-up cadence may need tightening`);
    }
  }

  return {
    window,
    total_opportunities_tracked: Object.keys(byEntity).length,
    avg_days_by_stage: avg,
    median_days_by_stage: med,
    sample_size_by_stage: samples,
    velocity_insights: insights,
    has_data: true,
  };
}


export async function fetchOpportunityTimeline(opportunityId: string): Promise<Transition[]> {
  try {
    const resp = await fetch(`${QDRANT_URL}/collections/lead_state_transitions/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 50,
        with_payload: true,
        with_vector: false,
        filter: {
          must: [
            { key: 'entity_type', match: { value: 'Opportunity' } },
            { key: 'entity_id', match: { value: opportunityId } },
          ],
        },
      }),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    const points = data.result?.points || [];
    const transitions: Transition[] = points.map((p: { payload: Transition }) => p.payload);
    return transitions.sort((a, b) => a.changed_at.localeCompare(b.changed_at));
  } catch {
    return [];
  }
}
