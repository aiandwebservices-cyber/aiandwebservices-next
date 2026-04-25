import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

export async function GET(req: NextRequest) {
  try {
    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id');
    const nudgeType = req.nextUrl.searchParams.get('type');

    let args = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.nudge_queue list`;
    if (cohortFromQuery) args += ` --cohort '${cohortFromQuery.replace(/'/g, "'\\''")}'`;
    if (nudgeType) args += ` --type '${nudgeType.replace(/'/g, "'\\''")}'`;

    const { stdout } = await execAsync(args, { timeout: 15000 });
    const data = JSON.parse(stdout.trim().split('\n').pop() || '[]');
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { draft_path, new_status, note } = await req.json();

    const validStatuses = ['APPROVED', 'REJECTED'];
    if (!validStatuses.includes(new_status)) {
      return NextResponse.json({ error: `invalid status (must be ${validStatuses.join(', ')})` }, { status: 400 });
    }
    if (!draft_path) {
      return NextResponse.json({ error: 'draft_path required' }, { status: 400 });
    }

    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.nudge_queue status --path '${draft_path.replace(/'/g, "'\\''")}' --new-status '${new_status}' --note '${(note || '').replace(/'/g, "'\\''")}'`;

    const { stdout } = await execAsync(cmd, { timeout: 15000 });
    const result = JSON.parse(stdout.trim().split('\n').pop() || '{}');
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
