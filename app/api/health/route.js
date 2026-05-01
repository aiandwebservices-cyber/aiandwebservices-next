const LOTCRM_URL = 'https://lotcrm.lotpilot.ai';
const ESPOCRM_PROBE_TIMEOUT = 5000;

async function checkEspoCRM() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ESPOCRM_PROBE_TIMEOUT);
  try {
    const res = await fetch(`${LOTCRM_URL}/api/v1/App/user`, {
      method: 'GET',
      signal: controller.signal,
    });
    // 401 means EspoCRM is up (auth required = reachable).
    return res.status === 401 || res.ok ? 'ok' : 'degraded';
  } catch {
    return 'unreachable';
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const espocrmStatus = await checkEspoCRM();

  if (espocrmStatus === 'unreachable') {
    return Response.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        espocrm: 'unreachable',
      },
      { status: 200 },
    );
  }

  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    espocrm: espocrmStatus,
  });
}
