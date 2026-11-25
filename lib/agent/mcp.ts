import {
  getComparison,
  getContactChannels,
  getGuarantee,
  getMeetingLink,
  getOffers,
  getPricing,
  getProduct,
  getService,
  listServices,
  searchFaq,
  SITE,
} from './facts.ts';
import { previewInquiry, submitInquiry, type Deps, type Json } from './inquiry.ts';
import { SKILLS } from './skills.ts';

export const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, mcp-protocol-version, mcp-method, idempotency-key, idempotency-receipt, agent-test',
  'access-control-max-age': '86400',
};

const MODERN = ['2026-07-28'];
const LEGACY = ['2025-11-25', '2025-06-18', '2025-03-26'];
const SERVER_INFO = { name: 'aiandwebservices', title: 'AIandWEBservices', version: '2.0.0', websiteUrl: SITE.url };
const INSTRUCTIONS = `${SITE.summary} Answer from the published service, pricing, product, guarantee, and FAQ tools. Do not invent prices. Sample pages and case pages are not part of this server. Preview an inquiry and show it to the person before submitting.`;

type Tool = {
  name: string;
  title: string;
  description: string;
  input: Record<string, unknown>;
  readOnly: boolean;
};

const TOOLS: Tool[] = [
  { name: 'list_services', title: 'List services', description: 'The seven published services: AI Automation Starter, Presence, Growth, Revenue Engine, AI-First, consulting, and add-ons.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_service', title: 'Get a service', description: 'One service by slug, including the price published on its page.', input: { type: 'object', additionalProperties: false, properties: { slug: { type: 'string' } }, required: ['slug'] }, readOnly: true },
  { name: 'get_comparison', title: 'Compare plans', description: 'The feature comparison rendered on the compare page, with prices from the pricing module.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_pricing', title: 'Pricing', description: 'Setup and monthly fees for the plans, add-ons, and consulting starting price.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_offers', title: 'Offers', description: 'Checkout links and fees published for each plan and add-on.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_product', title: 'Colony product', description: 'The Colony product page: what it includes and the monthly fees that page prints.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_guarantee', title: 'Response guarantee', description: 'The 6-hour response guarantee published on the guarantee page.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'search_faq', title: 'Search FAQ', description: 'Search the FAQ entries the site publishes. Omit q to list them.', input: { type: 'object', additionalProperties: false, properties: { q: { type: 'string' } } }, readOnly: true },
  { name: 'get_contact_channels', title: 'Contact channels', description: 'Email, phone, and Telegram links published on the contact page and footer.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'get_meeting_link', title: 'Meeting link', description: 'The Cal.com link used by the site embeds.', input: { type: 'object', additionalProperties: false, properties: {} }, readOnly: true },
  { name: 'preview_inquiry', title: 'Preview an inquiry', description: 'Step 1 of 2. Checks an inquiry and returns a summary plus confirm_token. Nothing is sent.', input: { type: 'object', additionalProperties: false, properties: { first_name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, service: { type: 'string' }, message: { type: 'string' }, consent_to_contact: { type: 'boolean' } }, required: ['first_name', 'last_name', 'email', 'phone', 'service', 'message', 'consent_to_contact'] }, readOnly: true },
  { name: 'submit_inquiry', title: 'Send an inquiry', description: 'Step 2 of 2. Sends a confirmed inquiry through the same contact path as the website form. Requires the preview confirm_token and user_confirmed: true.', input: { type: 'object', additionalProperties: false, properties: { first_name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, service: { type: 'string' }, message: { type: 'string' }, consent_to_contact: { type: 'boolean' }, confirm_token: { type: 'string' }, user_confirmed: { type: 'boolean' } }, required: ['first_name', 'last_name', 'email', 'phone', 'service', 'message', 'consent_to_contact', 'confirm_token', 'user_confirmed'] }, readOnly: false },
];

export const toolList = () => TOOLS.map((tool) => ({
  name: tool.name,
  title: tool.title,
  description: tool.description,
  inputSchema: tool.input,
  annotations: {
    title: tool.title,
    readOnlyHint: tool.readOnly,
    destructiveHint: false as const,
    idempotentHint: true,
    openWorldHint: !tool.readOnly,
  },
}));

async function callTool(name: string, args: Json, req: Request, deps: Deps): Promise<{ data: Json; isError: boolean }> {
  switch (name) {
    case 'list_services': return { data: listServices(), isError: false };
    case 'get_service': return { data: getService(typeof args.slug === 'string' ? args.slug : ''), isError: 'error' in getService(typeof args.slug === 'string' ? args.slug : '') };
    case 'get_comparison': return { data: getComparison(), isError: false };
    case 'get_pricing': return { data: getPricing(), isError: false };
    case 'get_offers': return { data: getOffers(), isError: false };
    case 'get_product': return { data: getProduct(), isError: false };
    case 'get_guarantee': return { data: getGuarantee(), isError: false };
    case 'search_faq': return { data: searchFaq(args.q), isError: false };
    case 'get_contact_channels': return { data: getContactChannels(), isError: false };
    case 'get_meeting_link': return { data: getMeetingLink(), isError: false };
    case 'preview_inquiry': { const r = await previewInquiry(args, req, deps); return { data: r.body, isError: r.status !== 200 }; }
    case 'submit_inquiry': { const r = await submitInquiry(args, req, deps); return { data: r.body, isError: r.status !== 200 }; }
    default: return { data: { error: 'unknown_tool' }, isError: true };
  }
}

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Json };

const rpcOk = (id: Rpc['id'], result: Json) => Response.json({ jsonrpc: '2.0', id, result }, { headers: { ...CORS, 'cache-control': 'no-store' } });
const rpcErr = (id: Rpc['id'] | undefined, code: number, message: string, status = 200) =>
  Response.json({ jsonrpc: '2.0', ...(id !== undefined ? { id } : {}), error: { code, message } }, { status, headers: { ...CORS, 'cache-control': 'no-store' } });

export async function handleMcp(req: Request, deps: Deps): Promise<Response> {
  let msg: Rpc;
  try { msg = (await req.json()) as Rpc; } catch { return rpcErr(null, -32700, 'Parse error', 400); }
  if (!msg || typeof msg !== 'object' || Array.isArray(msg) || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return rpcErr(null, -32600, 'Invalid Request', 400);
  if (msg.id === undefined) return new Response(null, { status: 202, headers: CORS });
  const params = (msg.params && typeof msg.params === 'object' ? msg.params : {}) as Json;
  const meta = (params._meta ?? {}) as Json;
  const bodyVersion = typeof meta['io.modelcontextprotocol/protocolVersion'] === 'string' ? meta['io.modelcontextprotocol/protocolVersion'] as string : null;
  const headerVersion = req.headers.get('mcp-protocol-version');
  const modern = bodyVersion !== null || (headerVersion !== null && !LEGACY.includes(headerVersion) && msg.method !== 'initialize');
  if (msg.method === 'initialize' && !bodyVersion) {
    const asked = typeof params.protocolVersion === 'string' ? params.protocolVersion : '';
    const protocolVersion = LEGACY.includes(asked) ? asked : LEGACY[0];
    return rpcOk(msg.id, { protocolVersion, capabilities: { tools: { listChanged: false }, prompts: {}, resources: {} }, serverInfo: SERVER_INFO, instructions: INSTRUCTIONS });
  }
  if (modern && !MODERN.includes(bodyVersion ?? headerVersion ?? '')) return rpcErr(msg.id, -32022, 'Unsupported protocol version', 400);
  const done = (r: Json) => rpcOk(msg.id, modern ? { resultType: 'complete', ...r } : r);
  switch (msg.method) {
    case 'server/discover':
      return done({ supportedVersions: [...MODERN, ...LEGACY], capabilities: { tools: {}, prompts: {}, resources: {} }, instructions: INSTRUCTIONS, ttlMs: 3600000, cacheScope: 'public' });
    case 'ping': return done({});
    case 'tools/list': return done({ tools: toolList() });
    case 'skills/list': return done({ skills: SKILLS.map((s) => ({ name: s.name, title: s.title, description: s.description })) });
    case 'skills/get': {
      const skill = SKILLS.find((s) => s.name === params.name);
      if (!skill) return rpcErr(msg.id, -32602, `Unknown skill: ${String(params.name)}`);
      return done({ ...skill });
    }
    case 'prompts/list': return done({ prompts: SKILLS.map((s) => ({ name: s.name, title: s.title, description: s.description })) });
    case 'prompts/get': {
      const skill = SKILLS.find((s) => s.name === params.name);
      if (!skill) return rpcErr(msg.id, -32602, `Unknown prompt: ${String(params.name)}`);
      return done({ description: skill.description, messages: [{ role: 'user', content: { type: 'text', text: skill.text } }] });
    }
    case 'resources/list':
      return done({ resources: [{ uri: 'aiw://llms.txt', name: 'llms.txt', mimeType: 'text/plain' }] });
    case 'tools/call': {
      const name = typeof params.name === 'string' ? params.name : '';
      if (!TOOLS.some((t) => t.name === name)) return rpcErr(msg.id, -32602, `Unknown tool: ${name}`);
      const args = (params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments) ? params.arguments : {}) as Json;
      const result = await callTool(name, args, req, deps);
      return done({ content: [{ type: 'text', text: JSON.stringify(result.data) }], structuredContent: result.data, isError: result.isError });
    }
    default: return rpcErr(msg.id, -32601, 'Method not found', modern ? 404 : 200);
  }
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS });
}
