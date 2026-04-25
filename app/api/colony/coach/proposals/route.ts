import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';

async function callCoachApply(args: string[]): Promise<unknown> {
  const argString = args.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' ');
  const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -m shared.coach_apply ${argString}`;
  const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(stdout.trim());
}

export async function GET() {
  try {
    const proposals = await callCoachApply(['list']);
    return NextResponse.json(proposals);
  } catch (e) {
    console.error('[coach/proposals] error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
