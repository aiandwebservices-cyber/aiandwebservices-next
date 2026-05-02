import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  dealership?: unknown;
  message?: unknown;
};

function asString(v: unknown, max = 2000): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = asString(body.name, 200);
  const email = asString(body.email, 320);
  const phone = asString(body.phone, 40);
  const dealership = asString(body.dealership, 200);
  const message = asString(body.message, 4000);

  if (!name || !email || !dealership || !message) {
    return NextResponse.json(
      { error: 'Missing required fields: name, email, dealership, message' },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // TODO: wire to Resend / mail provider when keys land in env
  console.log('[lotpilot/contact]', {
    receivedAt: new Date().toISOString(),
    name,
    email,
    phone,
    dealership,
    message,
  });

  return NextResponse.json({ ok: true });
}
