import {
  appendMessage,
  ensureSession,
  getSession,
  updateCustomerInfo,
} from '../../../../../../lib/dealer-platform/ai/session-store.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) return bad('sessionId is required');

  const session = getSession('chat', sessionId);
  if (!session) {
    return Response.json({
      ok: true,
      session: { messages: [], customerInfo: { name: null, phone: null, email: null } },
    });
  }
  return Response.json({ ok: true, session });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }
  const { sessionId, role, content, customerInfo } = body || {};
  if (!sessionId) return bad('sessionId is required');

  if (role && content !== undefined) {
    if (role !== 'user' && role !== 'assistant') return bad('role must be user or assistant');
    if (typeof content !== 'string') return bad('content must be a string');
    appendMessage('chat', sessionId, role, content);
  } else {
    ensureSession('chat', sessionId);
  }

  if (customerInfo && typeof customerInfo === 'object') {
    updateCustomerInfo('chat', sessionId, customerInfo);
  }

  const session = getSession('chat', sessionId);
  return Response.json({ ok: true, session });
}
