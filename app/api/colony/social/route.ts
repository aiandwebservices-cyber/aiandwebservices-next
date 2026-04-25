import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python';
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents';
const SOCIAL_DRAFTS_DIR = `${AGENTS_ROOT}/social_drafts`;

export async function GET(req: NextRequest) {
  try {
    const platform = req.nextUrl.searchParams.get('platform');

    const results: Array<Record<string, unknown>> = [];

    const platformDirs = platform ? [platform] : ['linkedin', 'facebook'];

    for (const p of platformDirs) {
      const dir = path.join(SOCIAL_DRAFTS_DIR, p);
      try {
        const files = await fs.readdir(dir);
        for (const f of files) {
          if (!f.endsWith('.md')) continue;
          const filePath = path.join(dir, f);
          const content = await fs.readFile(filePath, 'utf-8');

          const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (!fmMatch) continue;

          const fmLines = fmMatch[1].split('\n');
          const fm: Record<string, unknown> = {};
          for (const line of fmLines) {
            const colonIdx = line.indexOf(':');
            if (colonIdx === -1) continue;
            const key = line.substring(0, colonIdx).trim();
            const val = line.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
            fm[key] = val;
          }

          results.push({
            path: filePath,
            filename: f,
            ...fm,
            body_preview: fmMatch[2].trim().substring(0, 400),
            body_full: fmMatch[2].trim(),
          });
        }
      } catch {
        // Dir doesn't exist yet — fine
      }
    }

    results.sort((a, b) => String(b.generated_at || '').localeCompare(String(a.generated_at || '')));

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { draft_path, new_status, note } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(new_status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    if (!draft_path) {
      return NextResponse.json({ error: 'draft_path required' }, { status: 400 });
    }

    const safePath = draft_path.replace(/'/g, "\\'");
    const safeNote = (note || '').replace(/'/g, "\\'");
    const cmd = `cd ${AGENTS_ROOT} && PYTHONPATH=${AGENTS_ROOT} ${PYTHON_BIN} -c "
import sys
sys.path.insert(0, '${AGENTS_ROOT}')
from shared.nudge_queue import update_status
import json
result = update_status('${safePath}', '${new_status}', note='${safeNote}')
print(json.dumps(result))
"`;

    const { stdout } = await execAsync(cmd, { timeout: 10000 });
    const result = JSON.parse(stdout.trim().split('\n').pop() || '{}');
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
