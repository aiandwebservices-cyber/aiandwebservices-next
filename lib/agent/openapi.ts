import { SITE } from './facts.ts';

export function openapiDocument() {
  const json = { 'application/json': { schema: { type: 'object' } } };
  const get = (summary: string) => ({ get: { summary, responses: { '200': { description: 'Published site facts', content: json } } } });
  return {
    openapi: '3.1.0',
    info: {
      title: 'AIandWEBservices agent API',
      version: '2.0.0',
      description: `${SITE.summary} Prices come from the pages. Sample pages and case pages are excluded. Inquiries use a confirm token from the preview step. There is no durable store: idempotency receipts and confirm tokens are signed, and the daily cap (AIW_AGENT_DAILY_CAP, default 30) is enforced on the current instance only.`,
    },
    servers: [{ url: SITE.url }],
    paths: {
      '/api/agent/v1/services': get('List services'),
      '/api/agent/v1/services/{slug}': { get: { summary: 'Get one service', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Service' }, '404': { description: 'Unknown slug' } } } },
      '/api/agent/v1/comparison': get('Plan comparison'),
      '/api/agent/v1/pricing': get('Pricing'),
      '/api/agent/v1/offers': get('Offers and checkout links'),
      '/api/agent/v1/product': get('Colony product'),
      '/api/agent/v1/guarantee': get('Response guarantee'),
      '/api/agent/v1/faq': get('Search FAQ'),
      '/api/agent/v1/contact': get('Contact channels'),
      '/api/agent/v1/meeting-link': get('Cal.com meeting link'),
      '/api/agent/v1/inquiry-preview': { post: { summary: 'Preview an inquiry', responses: { '200': { description: 'Preview and confirm token' }, '422': { description: 'Validation error' } } } },
      '/api/agent/v1/inquiries': { post: { summary: 'Submit a confirmed inquiry', parameters: [{ name: 'Idempotency-Key', in: 'header', required: false, schema: { type: 'string' } }, { name: 'Idempotency-Receipt', in: 'header', required: false, schema: { type: 'string' } }], responses: { '200': { description: 'Accepted' }, '409': { description: 'Confirm token mismatch' }, '422': { description: 'Validation error' }, '429': { description: 'Rate limited' } } } },
      '/mcp': { post: { summary: 'MCP endpoint', responses: { '200': { description: 'JSON-RPC' } } } },
      '/forms/contact': { get: { summary: 'No-JS contact form', responses: { '200': { description: 'HTML form' } } }, post: { summary: 'Start the no-JS inquiry', responses: { '303': { description: 'Redirect to confirm' }, '422': { description: 'Validation error' } } } },
    },
  };
}
