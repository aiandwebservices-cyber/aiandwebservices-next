// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(req, { params }) {
  const { dealerId, leadId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  if (!leadId) return bad('leadId is required');

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }
  const note = body?.note;
  if (!note || typeof note !== 'string' || !note.trim()) {
    return bad('note text is required');
  }

  const result = await espoFetch(
    'POST',
    '/api/v1/Note',
    { parentType: 'Lead', parentId: leadId, post: note },
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, noteId: result.data?.id });
}
