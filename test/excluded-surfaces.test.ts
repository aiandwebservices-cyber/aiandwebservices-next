import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { expect } from './expect.ts';
import { discoveryDocs } from '../lib/agent/discovery.ts';
import { getComparison, getContactChannels, getGuarantee, getMeetingLink, getOffers, getPricing, getProduct, listServices, searchFaq } from '../lib/agent/facts.ts';
import { llmsText } from '../lib/agent/llms.ts';
import { toolList } from '../lib/agent/mcp.ts';
import { openapiDocument } from '../lib/agent/openapi.ts';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

describe('samples and case pages are excluded from agent output', () => {
  it('generated documents do not contain sample paths or case-page filenames', () => {
    const blob = JSON.stringify({
      services: listServices(),
      pricing: getPricing(),
      offers: getOffers(),
      comparison: getComparison(),
      product: getProduct(),
      guarantee: getGuarantee(),
      faq: searchFaq(''),
      contact: getContactChannels(),
      meeting: getMeetingLink(),
      llms: llmsText(),
      openapi: openapiDocument(),
      discovery: discoveryDocs(),
      tools: toolList(),
    });
    expect(blob).not.toMatch(/\/samples\b|\/preview\b|case-study/i);

    const sampleHrefs = new Set<string>();
    for (const file of walk(path.resolve('app/samples'))) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/['"](\/samples\/[^'"]+)['"]/g)) sampleHrefs.add(match[1]);
    }
    expect(sampleHrefs.size).toBeGreaterThan(0);
    for (const href of sampleHrefs) expect(blob.includes(href)).toBe(false);

    const caseNames = walk(path.resolve('sales-assets'))
      .filter((file) => path.basename(file).toLowerCase().includes('case'))
      .map((file) => path.basename(file, path.extname(file)).toLowerCase());
    expect(caseNames.length).toBeGreaterThan(0);
    for (const name of caseNames) expect(blob.toLowerCase().includes(name)).toBe(false);
  });
});
