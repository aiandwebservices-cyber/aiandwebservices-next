import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

export async function POST(req: NextRequest) {
  try {
    const { audit_id, confirm } = await req.json();

    if (confirm !== true) {
      return NextResponse.json({ error: 'confirm must be explicitly true' }, { status: 400 });
    }
    if (!audit_id || typeof audit_id !== 'number') {
      return NextResponse.json({ error: 'audit_id (number) required' }, { status: 400 });
    }

    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.coach_apply rollback --audit-id ${audit_id}`;
    const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
    const result = JSON.parse(stdout.trim());

    return NextResponse.json(result);
  } catch (e) {
    console.error('[coach/rollback] error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
