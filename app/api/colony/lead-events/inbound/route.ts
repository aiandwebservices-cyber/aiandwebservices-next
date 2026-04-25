import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * EspoCRM webhook receiver — writes state transitions directly to Qdrant.
 *
 * Native TypeScript implementation (FIX #47) — no Python subprocess,
 * works on Vercel serverless.
 *
 * Accepts two payload shapes:
 *   1. EspoCRM native: { entityType, id, data: { previousAttributes, attributes }, modifiedAt, modifiedById }
 *      → decomposes into per-field transitions
 *   2. Flattened: { entity_type, entity_id, field_name, before_value, after_value, changed_at, ... }
 *      → recorded as-is
 *
 * Always returns 200 to prevent EspoCRM webhook retry storms.
 */

const QDRANT_URL = (process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333').replace(/\/$/, '');
const QDRANT_API_KEY = process.env.COLONY_QDRANT_API_KEY || process.env.QDRANT_API_KEY || '';
const LEAD_EVENTS_SECRET = process.env.LEAD_EVENTS_WEBHOOK_SECRET || '';
const COLLECTION = 'lead_state_transitions';
const DEFAULT_COHORT = 'aiandwebservices';

const TRACKED_FIELDS_BY_TYPE: Record<string, string[]> = {
  Lead: ['status', 'temperature'],
  Opportunity: ['stage', 'amount', 'probability'],
};

interface EspocrmPayload {
  entityType?: string;
  id?: string;
  data?: {
    entityType?: string;
    id?: string;
    event?: string;
    attributes?: Record<string, unknown>;
    previousAttributes?: Record<string, unknown>;
    modifiedAt?: string;
    modifiedById?: string;
  };
  modifiedAt?: string;
  modifiedById?: string;
}

interface FlatPayload {
  entity_type?: string;
  entity_id?: string;
  field_name?: string;
  before_value?: unknown;
  after_value?: unknown;
  changed_at?: string;
  changed_by?: string;
  source?: string;
  cohort_id?: string;
}

type InboundPayload = EspocrmPayload & FlatPayload;

interface Transition {
  entity_type: string;
  entity_id: string;
  field_name: string;
  before_value: string | null;
  after_value: string | null;
  changed_at: string;
  changed_by: string;
  source: string;
  cohort_id: string;
  extra?: Record<string, unknown>;
}

function extractTransitions(raw: InboundPayload): Transition[] {
  // Flat payload path — single pre-decomposed transition
  if (raw.entity_type && raw.entity_id && raw.field_name) {
    const before = raw.before_value;
    const after = raw.after_value;
    return [
      {
        entity_type: raw.entity_type,
        entity_id: raw.entity_id,
        field_name: raw.field_name,
        before_value: before === null || before === undefined ? null : String(before),
        after_value: after === null || after === undefined ? null : String(after),
        changed_at: raw.changed_at || new Date().toISOString(),
        changed_by: raw.changed_by || 'system',
        source: raw.source || 'espocrm_webhook',
        cohort_id: raw.cohort_id || DEFAULT_COHORT,
      },
    ];
  }

  // EspoCRM native path — decompose tracked field diffs
  const entityType = raw.entityType || raw.data?.entityType || '';
  const entityId = raw.id || raw.data?.id || '';
  if (!entityType || !entityId) return [];
  if (!TRACKED_FIELDS_BY_TYPE[entityType]) return [];

  const changedAt = raw.modifiedAt || raw.data?.modifiedAt || new Date().toISOString();
  const changedBy = raw.modifiedById || raw.data?.modifiedById || 'system';
  const previousAttrs = raw.data?.previousAttributes || {};
  const currentAttrs = raw.data?.attributes || {};
  const trackedFields = TRACKED_FIELDS_BY_TYPE[entityType];

  const transitions: Transition[] = [];
  for (const field of trackedFields) {
    const before = previousAttrs[field];
    const after = currentAttrs[field];
    if (before !== after && (before !== undefined || after !== undefined)) {
      transitions.push({
        entity_type: entityType,
        entity_id: entityId,
        field_name: field,
        before_value: before === null || before === undefined ? null : String(before),
        after_value: after === null || after === undefined ? null : String(after),
        changed_at: changedAt,
        changed_by: changedBy,
        source: 'espocrm_webhook',
        cohort_id: DEFAULT_COHORT,
        extra: raw.data?.event ? { webhook_event: raw.data.event } : undefined,
      });
    }
  }

  // Degraded mode — no previousAttributes, record current values with before=null
  if (transitions.length === 0) {
    for (const field of trackedFields) {
      const after = currentAttrs[field];
      if (after !== undefined && after !== null) {
        transitions.push({
          entity_type: entityType,
          entity_id: entityId,
          field_name: field,
          before_value: null,
          after_value: String(after),
          changed_at: changedAt,
          changed_by: changedBy,
          source: 'espocrm_webhook',
          cohort_id: DEFAULT_COHORT,
        });
      }
    }
  }

  return transitions;
}

function generatePointId(t: Transition): string {
  const key = `${t.entity_type}:${t.entity_id}:${t.field_name}:${t.changed_at}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

let _cachedDim: number | null = null;
async function getCollectionDim(): Promise<number> {
  if (_cachedDim !== null) return _cachedDim;
  try {
    const headers: Record<string, string> = {};
    if (QDRANT_API_KEY) headers['api-key'] = QDRANT_API_KEY;
    const resp = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (resp.ok) {
      const info = await resp.json();
      const dim = info?.result?.config?.params?.vectors?.size;
      if (typeof dim === 'number' && dim > 0) {
        _cachedDim = dim;
        return dim;
      }
    }
  } catch {}
  _cachedDim = 512;
  return 512;
}

async function qdrantUpsert(pointId: string, transition: Transition): Promise<{ ok: boolean; was_duplicate: boolean }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (QDRANT_API_KEY) headers['api-key'] = QDRANT_API_KEY;

  try {
    // Idempotency check
    const existingResp = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/${pointId}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (existingResp.ok) {
      const existing = await existingResp.json();
      if (existing?.result) {
        return { ok: true, was_duplicate: true };
      }
    }
  } catch {}

  const dim = await getCollectionDim();
  const payload: Record<string, unknown> = {
    entity_type: transition.entity_type,
    entity_id: transition.entity_id,
    field_name: transition.field_name,
    before_value: transition.before_value,
    after_value: transition.after_value,
    changed_at: transition.changed_at,
    changed_by: transition.changed_by,
    source: transition.source,
    cohort_id: transition.cohort_id,
  };
  if (transition.extra) payload.extra = transition.extra;

  try {
    const resp = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points?wait=true`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        points: [
          {
            id: pointId,
            vector: new Array(dim).fill(0),
            payload,
          },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });

    return { ok: resp.ok, was_duplicate: false };
  } catch (e) {
    console.error('[lead-events] qdrant upsert failed:', e);
    return { ok: false, was_duplicate: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (LEAD_EVENTS_SECRET && token !== LEAD_EVENTS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    if (!LEAD_EVENTS_SECRET) {
      console.warn('[lead-events/inbound] LEAD_EVENTS_WEBHOOK_SECRET not set — accepting unauthenticated (DEV ONLY)');
    }

    let raw: InboundPayload | InboundPayload[];
    try {
      raw = await req.json();
    } catch (e) {
      console.error('[lead-events/inbound] body parse failed:', e);
      return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 200 });
    }

    const items = Array.isArray(raw) ? raw : [raw];
    const allResults: Array<{ ok: boolean; point_id?: string; was_duplicate?: boolean; reason?: string }> = [];

    for (const item of items) {
      const transitions = extractTransitions(item);
      if (transitions.length === 0) {
        allResults.push({ ok: true, reason: 'no_tracked_transitions' });
        continue;
      }
      for (const t of transitions) {
        const pointId = generatePointId(t);
        const { ok, was_duplicate } = await qdrantUpsert(pointId, t);
        allResults.push({
          ok,
          point_id: pointId,
          was_duplicate,
          reason: ok ? undefined : 'qdrant_upsert_failed',
        });
      }
    }

    const successCount = allResults.filter((r) => r.ok && r.point_id).length;
    return NextResponse.json({
      ok: true,
      processed: successCount,
      total: allResults.length,
      results: allResults,
    });
  } catch (e) {
    console.error('[lead-events/inbound] handler error:', e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'lead_events_inbound',
    implementation: 'native_ts',
    tracked: TRACKED_FIELDS_BY_TYPE,
    accepts: [
      'EspoCRM native webhook: { entityType, id, data: { previousAttributes, attributes, modifiedAt } }',
      'Flattened: { entity_type, entity_id, field_name, before_value, after_value, changed_at }',
    ],
    note: 'POST events here. Auth via Bearer LEAD_EVENTS_WEBHOOK_SECRET.',
  });
}
