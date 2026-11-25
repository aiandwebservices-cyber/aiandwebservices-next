import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { expect } from './expect.ts';
import robots from '../app/robots.ts';

describe('robots has no client subpath sitemaps', () => {
  it('publishes only this site sitemap', () => {
    const result = robots();
    const maps = Array.isArray(result.sitemap) ? result.sitemap : [result.sitemap];
    expect(maps).toEqual(['https://www.aiandwebservices.com/sitemap.xml']);
    const src = readFileSync(new URL('../app/robots.ts', import.meta.url), 'utf8');
    const urls = src.match(/https?:\/\/[^'")\s]+/g) ?? [];
    expect(urls).toEqual(['https://www.aiandwebservices.com/sitemap.xml']);
    expect(src).not.toMatch(/sitemap:\s*\[[\s\S]*https?:\/\/(?!www\.aiandwebservices\.com)/);
  });
});
