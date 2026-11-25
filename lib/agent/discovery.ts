import { SITE } from './facts.ts';

export function discoveryDocs() {
  return {
    'mcp.json': {
      name: SITE.name,
      description: SITE.summary,
      url: `${SITE.url}/mcp`,
      version: '2.0.0',
      transport: { type: 'streamable-http' },
    },
    'ai-catalog.json': {
      version: '1.0',
      name: SITE.name,
      description: `${SITE.summary} Sample pages and case pages are excluded.`,
      servers: [{
        id: 'aiandwebservices',
        name: SITE.name,
        url: `${SITE.url}/mcp`,
        documentation: `${SITE.url}/llms.txt`,
        openapi: `${SITE.url}/openapi.json`,
      }],
    },
  };
}
