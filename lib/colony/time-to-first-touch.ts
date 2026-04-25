/**
 * Time-to-first-touch: lead.createdAt → first note.createdAt
 *
 * For each Lead created in the window, find the earliest Note attached to it
 * and compute minutes elapsed. Aggregates into median + buckets.
 */

export type TimeWindow = '7d' | '30d' | '90d' | 'all';

export interface TimeToFirstTouchStats {
  window: TimeWindow;
  window_start: string;
  leads_analyzed: number;
  leads_with_touch: number;
  leads_no_touch: number;
  median_minutes: number | null;
  p25_minutes: number | null;
  p75_minutes: number | null;
  min_minutes: number | null;
  max_minutes: number | null;
  // Bucketed distribution
  buckets: {
    under_5min: number;
    min_5_to_60: number;
    min_60_to_1440: number;   // 1-24h
    hr_24_to_72: number;      // 1-3 days
    over_72hr: number;
  };
  // Percentage in the "great" zone (<5min)
  pct_under_5min: number | null;
  pct_under_1hr: number | null;
  has_data: boolean;
}

const ESPOCRM_URL = process.env.ESPOCRM_URL || 'http://localhost:8080';
const ESPOCRM_API_KEY = process.env.ESPOCRM_API_KEY || '';

function windowToISO(window: TimeWindow): string {
  const now = Date.now();
  switch (window) {
    case '7d':  return new Date(now - 7  * 86400000).toISOString();
    case '30d': return new Date(now - 30 * 86400000).toISOString();
    case '90d': return new Date(now - 90 * 86400000).toISOString();
    case 'all': return new Date('2026-01-01').toISOString();
  }
}

function percentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.min(idx, sorted.length - 1)];
}

export async function fetchTimeToFirstTouch(window: TimeWindow = '30d'): Promise<TimeToFirstTouchStats> {
  const windowStart = windowToISO(window);

  const empty: TimeToFirstTouchStats = {
    window,
    window_start: windowStart,
    leads_analyzed: 0,
    leads_with_touch: 0,
    leads_no_touch: 0,
    median_minutes: null,
    p25_minutes: null,
    p75_minutes: null,
    min_minutes: null,
    max_minutes: null,
    buckets: { under_5min: 0, min_5_to_60: 0, min_60_to_1440: 0, hr_24_to_72: 0, over_72hr: 0 },
    pct_under_5min: null,
    pct_under_1hr: null,
    has_data: false,
  };

  if (!ESPOCRM_API_KEY) return empty;

  try {
    // Pull leads in window
    const leadsUrl = new URL(`${ESPOCRM_URL}/api/v1/Lead`);
    leadsUrl.searchParams.set('where[0][type]', 'greaterThanOrEquals');
    leadsUrl.searchParams.set('where[0][attribute]', 'createdAt');
    leadsUrl.searchParams.set('where[0][value]', windowStart);
    leadsUrl.searchParams.set('select', 'id,createdAt');
    leadsUrl.searchParams.set('maxSize', '500');

    const leadsResp = await fetch(leadsUrl.toString(), {
      headers: { 'X-Api-Key': ESPOCRM_API_KEY },
    });
    if (!leadsResp.ok) return empty;
    const leadsData = await leadsResp.json();
    const leads: Array<{ id: string; createdAt: string }> = leadsData.list || [];

    if (leads.length === 0) return empty;

    // For each lead, find earliest Note
    const elapsedMinutes: number[] = [];
    let noTouchCount = 0;

    // Batch lookups — EspoCRM can be slow if we do 500 sequentially
    // Process in chunks of 20 in parallel
    const CHUNK_SIZE = 20;
    for (let i = 0; i < leads.length; i += CHUNK_SIZE) {
      const chunk = leads.slice(i, i + CHUNK_SIZE);
      const results = await Promise.all(
        chunk.map(async (lead) => {
          try {
            const noteUrl = new URL(`${ESPOCRM_URL}/api/v1/Note`);
            noteUrl.searchParams.set('where[0][type]', 'equals');
            noteUrl.searchParams.set('where[0][attribute]', 'parentId');
            noteUrl.searchParams.set('where[0][value]', lead.id);
            noteUrl.searchParams.set('where[1][type]', 'equals');
            noteUrl.searchParams.set('where[1][attribute]', 'parentType');
            noteUrl.searchParams.set('where[1][value]', 'Lead');
            noteUrl.searchParams.set('select', 'createdAt');
            noteUrl.searchParams.set('orderBy', 'createdAt');
            noteUrl.searchParams.set('order', 'asc');
            noteUrl.searchParams.set('maxSize', '1');

            const noteResp = await fetch(noteUrl.toString(), {
              headers: { 'X-Api-Key': ESPOCRM_API_KEY },
            });
            if (!noteResp.ok) return null;
            const noteData = await noteResp.json();
            const firstNote = noteData.list?.[0];
            if (!firstNote?.createdAt) return null;

            const leadCreated = new Date(lead.createdAt).getTime();
            const noteCreated = new Date(firstNote.createdAt).getTime();
            const elapsedMs = noteCreated - leadCreated;
            if (elapsedMs < 0) return null;  // note before lead? data anomaly, skip
            return elapsedMs / 60000;  // to minutes
          } catch {
            return null;
          }
        })
      );

      for (const r of results) {
        if (r === null) {
          noTouchCount += 1;
        } else {
          elapsedMinutes.push(r);
        }
      }
    }

    if (elapsedMinutes.length === 0) {
      return {
        ...empty,
        leads_analyzed: leads.length,
        leads_no_touch: noTouchCount,
        has_data: leads.length > 0,
      };
    }

    const sorted = [...elapsedMinutes].sort((a, b) => a - b);

    const buckets = {
      under_5min: 0,
      min_5_to_60: 0,
      min_60_to_1440: 0,
      hr_24_to_72: 0,
      over_72hr: 0,
    };

    for (const m of elapsedMinutes) {
      if (m < 5) buckets.under_5min += 1;
      else if (m < 60) buckets.min_5_to_60 += 1;
      else if (m < 1440) buckets.min_60_to_1440 += 1;
      else if (m < 4320) buckets.hr_24_to_72 += 1;
      else buckets.over_72hr += 1;
    }

    return {
      window,
      window_start: windowStart,
      leads_analyzed: leads.length,
      leads_with_touch: elapsedMinutes.length,
      leads_no_touch: noTouchCount,
      median_minutes: Math.round((percentile(sorted, 0.5) || 0) * 10) / 10,
      p25_minutes: Math.round((percentile(sorted, 0.25) || 0) * 10) / 10,
      p75_minutes: Math.round((percentile(sorted, 0.75) || 0) * 10) / 10,
      min_minutes: Math.round(sorted[0] * 10) / 10,
      max_minutes: Math.round(sorted[sorted.length - 1] * 10) / 10,
      buckets,
      pct_under_5min: Math.round((buckets.under_5min / elapsedMinutes.length) * 1000) / 10,
      pct_under_1hr: Math.round(((buckets.under_5min + buckets.min_5_to_60) / elapsedMinutes.length) * 1000) / 10,
      has_data: true,
    };
  } catch (e) {
    console.error('[time-to-first-touch]', e);
    return empty;
  }
}
