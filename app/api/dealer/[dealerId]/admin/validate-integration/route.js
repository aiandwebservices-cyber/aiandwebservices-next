import { NextResponse } from 'next/server';

function ok(details) {
  return NextResponse.json({ valid: true, details });
}
function fail(error) {
  return NextResponse.json({ valid: false, error });
}

async function validateEspoCRM({ url, apiKey }) {
  if (!url || !apiKey) return fail('URL and API key are required');
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/v1/App/user`, {
      headers: { 'X-Api-Key': apiKey },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return fail('Invalid API key or unreachable URL');
    return ok('Connected');
  } catch {
    return fail('Invalid API key or unreachable URL');
  }
}

async function validateTwilio({ accountSid, authToken }) {
  if (!accountSid || !authToken) return fail('Account SID and Auth Token are required');
  try {
    const encoded = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      headers: { Authorization: `Basic ${encoded}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return fail('Invalid credentials');
    const data = await res.json();
    return ok(data.friendly_name || 'Connected');
  } catch {
    return fail('Invalid credentials');
  }
}

async function validateResend({ apiKey }) {
  if (!apiKey) return fail('API key is required');
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return fail('Invalid API key');
    return ok('Connected');
  } catch {
    return fail('Invalid API key');
  }
}

async function validateStripe({ secretKey }) {
  if (!secretKey) return fail('Secret key is required');
  try {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: `Bearer ${secretKey}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return fail('Invalid secret key');
    const data = await res.json();
    const avail = data.available?.[0];
    const details = avail
      ? `Balance: ${(avail.amount / 100).toFixed(2)} ${avail.currency.toUpperCase()}`
      : 'Connected';
    return ok(details);
  } catch {
    return fail('Invalid secret key');
  }
}

async function validateGooglePlaces({ placeId, apiKey }) {
  if (!placeId || !apiKey) return fail('Place ID and API key are required');
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${encodeURIComponent(apiKey)}&fields=name`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    if (data.status !== 'OK') return fail('Invalid API key or Place ID');
    return ok(data.result?.name || 'Connected');
  } catch {
    return fail('Invalid API key or Place ID');
  }
}

function validateR2({ endpoint, accessKey, secretKey, bucketName }) {
  if (!endpoint || !accessKey || !secretKey || !bucketName)
    return fail('All four R2 fields are required');
  return ok('Credentials saved — will be verified on first upload');
}

function validateFieldsPresent(credentials) {
  const missing = Object.values(credentials).some((v) => !String(v || '').trim());
  return missing ? fail('All fields are required') : ok('Credentials saved');
}

export async function POST(request, { params }) {
  const { dealerId } = await params;
  if (!dealerId) return NextResponse.json({ valid: false, error: 'Missing dealerId' }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { integration, credentials = {} } = body;
  if (!integration) return NextResponse.json({ valid: false, error: 'Missing integration' }, { status: 400 });

  try {
    switch (integration) {
      case 'espocrm':      return await validateEspoCRM(credentials);
      case 'twilio':       return await validateTwilio(credentials);
      case 'resend':       return await validateResend(credentials);
      case 'stripe':       return await validateStripe(credentials);
      case 'googleplaces': return await validateGooglePlaces(credentials);
      case 'r2':           return validateR2(credentials);
      default:             return validateFieldsPresent(credentials);
    }
  } catch (err) {
    return NextResponse.json({ valid: false, error: err.message || 'Unexpected server error' }, { status: 500 });
  }
}
