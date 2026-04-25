import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

export async function POST(req: NextRequest) {
  try {
    const { proposal_path, reason } = await req.json();
    if (!proposal_path) {
      return NextResponse.json({ error: 'proposal_path required' }, { status: 400 });
    }
    const escProposal = String(proposal_path).replace(/'/g, "'\\''");
    const escReason = String(reason || '').replace(/'/g, "'\\''");
    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.coach_apply reject --proposal '${escProposal}' --reason '${escReason}'`;
    const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
    const result = JSON.parse(stdout.trim());
    return NextResponse.json(result);
  } catch (e) {
    console.error('[coach/reject] error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
