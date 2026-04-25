import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposal_path, hint_id, apply } = body;

    if (apply !== true) {
      return NextResponse.json({ error: 'apply must be explicitly true' }, { status: 400 });
    }
    if (!proposal_path || !hint_id) {
      return NextResponse.json({ error: 'proposal_path and hint_id required' }, { status: 400 });
    }

    const escProposal = String(proposal_path).replace(/'/g, "'\\''");
    const escHint = String(hint_id).replace(/'/g, "'\\''");
    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.coach_apply apply --proposal '${escProposal}' --hint '${escHint}'`;

    const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
    const result = JSON.parse(stdout.trim());

    return NextResponse.json(result);
  } catch (e) {
    console.error('[coach/apply] error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
