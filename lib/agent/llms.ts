import { getContactChannels, getMeetingLink, getPricing, listServices, SITE } from './facts.ts';

/** Plain-text guide for agents. Prices are copied from getPricing(), which reads the page modules. */
export function llmsText(): string {
  const pricing = getPricing();
  const services = listServices();
  const contact = getContactChannels();
  const meeting = getMeetingLink();
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.summary}`,
    '',
    `Site: ${SITE.url}`,
    '',
    '## Services',
    ...services.services.map((service) => `- ${service.name} (${service.slug}): ${service.summary} ${service.url}`),
    '',
    '## Pricing',
    ...pricing.tiers.map((tier) => `- ${tier.name}: $${tier.setup_fee} setup, $${tier.monthly_fee}/month. ${tier.url}`),
    ...pricing.add_ons.map((addon) => `- Add-on ${addon.name}: $${addon.setup_fee} setup, $${addon.monthly_fee}/month.`),
    `- Consulting starting price: $${pricing.consulting.starting_price}. ${pricing.consulting.url}`,
    '',
    '## Contact',
    `- Email: ${contact.email}`,
    `- Phone: ${contact.phone_display}`,
    `- Telegram on the contact page: ${contact.telegram_contact_page}`,
    `- Telegram in the footer: ${contact.telegram_footer}`,
    `- Meeting: ${meeting.url} (${meeting.cal_link})`,
    `- ${contact.response}`,
    '',
    '## Agent API',
    `- MCP: ${SITE.url}/mcp and ${SITE.url}/api/mcp`,
    `- REST: ${SITE.url}/api/agent/v1/`,
    `- OpenAPI: ${SITE.url}/openapi.json`,
    `- Discovery: ${SITE.url}/.well-known/mcp.json`,
    `- No-JS form: ${SITE.url}/forms/contact`,
    '',
    'Sample pages and case pages are excluded from this document.',
    'Inquiries require a preview confirm token. Idempotency receipts are signed because there is no durable store. The daily cap (AIW_AGENT_DAILY_CAP, default 30) is enforced on the current instance only.',
    '',
  ];
  return lines.join('\n');
}
