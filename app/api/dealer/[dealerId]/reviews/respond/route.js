import {
  espoFetch,
  getDealerConfig,
  nowEspoDateTime,
} from '../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { reviewId, response } = body || {};
  if (!reviewId || typeof reviewId !== 'string') {
    return bad('reviewId is required');
  }
  if (!response || typeof response !== 'string' || !response.trim()) {
    return bad('response text is required');
  }

  const post = `[Google Review Response — draft]

Review ID: ${reviewId}
Drafted at: ${nowEspoDateTime()}

${response.trim()}

— Saved from the dealer admin panel. Posting to Google requires the Google Business Profile API (OAuth + verified business). Use your Google Business Profile dashboard to publish this response, or wire up GBP OAuth as a future integration.`;

  const note = await espoFetch(
    'POST',
    '/api/v1/Note',
    {
      type: 'Post',
      post,
    },
    dealerConfig
  );

  if (!note.ok) {
    return Response.json(
      { ok: false, error: note.error },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    noteId: note.data?.id,
    note: 'Response saved. To post on Google, use your Google Business Profile dashboard.',
  });
}
