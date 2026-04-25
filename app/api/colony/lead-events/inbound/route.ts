import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

const LEAD_EVENTS_WEBHOOK_SECRET = process.env.LEAD_EVENTS_WEBHOOK_SECRET || '';
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

interface EspocrmWebhookPayload {
  entityType?: string;
  id?: string;
  data?: Record<string, unknown>;
  modifiedAt?: string;
  modifiedById?: string;
}

const TRACKED_FIELDS_BY_TYPE: Record<string, string[]> = {
  Lead: ['status', 'temperature'],
  Opportunity: ['stage', 'amount', 'probability'],
};

interface SaveTransitionArgs {
  entity_type: string;
  entity_id: string;
  field_name: string;
  before_value: string | null;
  after_value: string | null;
  changed_at: string;
  changed_by: string;
  source: string;
  extra?: Record<string, unknown>;
}

function saveTransition(args: SaveTransitionArgs): Promise<unknown> {
  return new Promise((resolve) => {
    const script =
      'import sys, json\n' +
      'from shared.qdrant_memory import save_state_transition\n' +
      'a = json.loads(sys.stdin.read())\n' +
      'print(json.dumps(save_state_transition(**a)))\n';

    const proc = spawn(PYTHON_BIN, ['-c', script], {
      cwd: AGENTS_ROOT,
      env: { ...process.env, PYTHONPATH: AGENTS_ROOT },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve({ ok: false, error: 'python subprocess timed out (15s)' });
    }, 15000);

    proc.stdout.on('data', (d) => (stdout += d.toString()));
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        console.error('[lead-events/inbound] python failed:', code, stderr);
        resolve({ ok: false, error: stderr.trim() || `python exit ${code}` });
        return;
      }
      try {
        resolve(JSON.parse(stdout.trim().split('\n').pop() || '{}'));
      } catch (e) {
        resolve({ ok: false, error: `JSON parse failed: ${(e as Error).message}` });
      }
    });

    proc.stdin.write(JSON.stringify(args));
    proc.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (LEAD_EVENTS_WEBHOOK_SECRET && token !== LEAD_EVENTS_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    if (!LEAD_EVENTS_WEBHOOK_SECRET) {
      console.warn('[lead-events/inbound] LEAD_EVENTS_WEBHOOK_SECRET not set — accepting unauthenticated (DEV ONLY)');
    }

    const payload: EspocrmWebhookPayload = await req.json();

    const entityType = payload.entityType || (payload.data?.entityType as string) || '';
    const entityId = payload.id || (payload.data?.id as string) || '';
    const changedAt = payload.modifiedAt || (payload.data?.modifiedAt as string) || new Date().toISOString();
    const changedBy = payload.modifiedById || (payload.data?.modifiedById as string) || 'system';

    if (!entityType || !entityId) {
      return NextResponse.json({ ok: true, skipped: 'missing entityType/id', received: payload });
    }

    if (!TRACKED_FIELDS_BY_TYPE[entityType]) {
      return NextResponse.json({ ok: true, skipped: `not tracking ${entityType}` });
    }

    const trackedFields = TRACKED_FIELDS_BY_TYPE[entityType];

    const previousAttrs = (payload.data?.previousAttributes as Record<string, unknown>) || {};
    const currentAttrs = (payload.data?.attributes || payload.data || {}) as Record<string, unknown>;

    const transitions: Array<{ field: string; before: unknown; after: unknown }> = [];

    for (const field of trackedFields) {
      const before = previousAttrs[field];
      const after = currentAttrs[field];
      if (before !== after && (before !== undefined || after !== undefined)) {
        transitions.push({ field, before, after });
      }
    }

    // Degraded mode: no previousAttributes — record current values with before=null
    if (transitions.length === 0) {
      for (const field of trackedFields) {
        const after = currentAttrs[field];
        if (after !== undefined && after !== null) {
          transitions.push({ field, before: null, after });
        }
      }
    }

    const results: unknown[] = [];
    for (const t of transitions) {
      const result = await saveTransition({
        entity_type: entityType,
        entity_id: entityId,
        field_name: t.field,
        before_value: t.before === null || t.before === undefined ? null : String(t.before),
        after_value: t.after === null || t.after === undefined ? null : String(t.after),
        changed_at: changedAt,
        changed_by: changedBy,
        source: 'espocrm_webhook',
        extra: {
          webhook_event: payload.data?.event,
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      ok: true,
      entity_type: entityType,
      entity_id: entityId,
      transitions_recorded: results.length,
      results,
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
    tracked: TRACKED_FIELDS_BY_TYPE,
    note: 'POST EspoCRM webhook events here. Auth via Bearer LEAD_EVENTS_WEBHOOK_SECRET.',
  });
}
