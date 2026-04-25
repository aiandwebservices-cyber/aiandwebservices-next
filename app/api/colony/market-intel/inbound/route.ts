import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const MARKET_INTEL_SECRET = process.env.MARKET_INTEL_SECRET || ''
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python'
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents'

interface IntelPayload {
  competitor_name: string
  signal_type: string
  headline: string
  details?: string
  source_url?: string
  captured_at?: string
  cohort_id?: string
}

async function saveOne(item: IntelPayload): Promise<Record<string, unknown>> {
  const script = `
import sys, json, os
sys.path.insert(0, '${AGENTS_ROOT}')
args = json.loads(os.environ['COLONY_INTEL_DATA'])
from shared.qdrant_memory import save_market_intel
result = save_market_intel(**args)
print(json.dumps(result))
`
  try {
    const { stdout } = await execAsync(
      `${PYTHON_BIN} -c ${JSON.stringify(script)}`,
      { timeout: 20000, env: { ...process.env, COLONY_INTEL_DATA: JSON.stringify(item) } }
    )
    const out = typeof stdout === 'string' ? stdout : (stdout as Buffer).toString()
    return JSON.parse(out.trim().split('\n').pop() || '{}')
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    if (MARKET_INTEL_SECRET && token !== MARKET_INTEL_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body: IntelPayload | IntelPayload[] = await req.json()
    const items = Array.isArray(body) ? body : [body]

    const results: Array<Record<string, unknown>> = []
    for (const item of items) {
      if (!item.competitor_name || !item.signal_type || !item.headline) {
        results.push({ ok: false, error: 'missing required fields', competitor_name: item.competitor_name })
        continue
      }
      const r = await saveOne(item)
      results.push({ ...r, competitor_name: item.competitor_name })
    }

    return NextResponse.json({ ok: true, count: results.length, results })
  } catch (e) {
    console.error('[market-intel/inbound]', e)
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'market_intel_inbound',
    expected_payload: {
      competitor_name: 'string',
      signal_type: 'pricing_change | product_launch | blog_post | social_post | public_change',
      headline: 'string',
      details: 'string (optional)',
      source_url: 'string (optional)',
    },
  })
}
