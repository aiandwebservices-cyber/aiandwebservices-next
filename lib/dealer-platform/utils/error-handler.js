export function logError(error, context = {}) {
  const timestamp = new Date().toISOString();
  console.error('[lotpilot:error]', timestamp, JSON.stringify(context), error?.stack || String(error));

  if (process.env.NODE_ENV === 'production' && process.env.LOTPILOT_ERROR_WEBHOOK) {
    fetch(process.env.LOTPILOT_ERROR_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp,
        message: error?.message || String(error),
        stack: error?.stack || null,
        context,
      }),
    }).catch(() => {});
  }
}

export function withErrorHandling(handler) {
  return async function (...args) {
    try {
      return await handler(...args);
    } catch (error) {
      const req = args[0];
      logError(error, { url: req?.url, method: req?.method });
      return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 });
    }
  };
}
