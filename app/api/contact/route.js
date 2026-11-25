import { notifyContactLead } from '@/lib/contact-submit';

export async function POST(req) {
  try {
    const data = await req.json();
    await notifyContactLead(data);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
