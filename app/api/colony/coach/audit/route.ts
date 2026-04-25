import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

export async function GET(req: NextRequest) {
  try {
    const limitParam = req.nextUrl.searchParams.get('limit') || '50';
    const limit = parseInt(limitParam, 10) || 50;
    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.coach_apply audit --limit ${limit}`;
    const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
    const result = JSON.parse(stdout.trim());
    return NextResponse.json(result);
  } catch (e) {
    console.error('[coach/audit] error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
