import { AsyncLocalStorage } from 'node:async_hooks';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import ts from 'typescript';
import { expect } from './expect.ts';
import { getContactConfirm, getContactForm, getContactThanks } from '../lib/agent/forms.ts';

// Next's server runtime looks up AsyncLocalStorage on globalThis. Node keeps it
// on node:async_hooks, so install it before the proxy (and Clerk) load.
Object.assign(globalThis, { AsyncLocalStorage });

// Fixture development instance only. These values are not real Clerk credentials
// and the test never follows the handshake redirect.
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = `pk_test_${Buffer.from('foo-bar-13.clerk.accounts.dev$').toString('base64')}`;
process.env.CLERK_SECRET_KEY = 'sk_test_forms_middleware_not_a_real_secret';

type ProxyExports = {
  default: (req: Request, event: { waitUntil(promise: Promise<unknown>): void }) => Promise<Response | undefined>;
  config: { matcher?: string[] };
};

type CompiledModule = {
  filename: string;
  paths: string[];
  exports: ProxyExports;
  _compile(code: string, filename: string): void;
};

type ModuleCtor = {
  new (id: string): CompiledModule;
  _nodeModulePaths(from: string): string[];
};

const require = createRequire(import.meta.url);

function loadProxy(): ProxyExports {
  const filename = fileURLToPath(new URL('../proxy.ts', import.meta.url));
  const source = readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const NodeModule = require('module') as ModuleCtor;
  const compiled = new NodeModule(filename);
  compiled.filename = filename;
  compiled.paths = NodeModule._nodeModulePaths(path.dirname(filename));
  compiled._compile(output, filename);
  return compiled.exports;
}

const proxyModule = loadProxy();
const { unstable_doesMiddlewareMatch } = require('next/experimental/testing/server') as {
  unstable_doesMiddlewareMatch(args: { config: { matcher?: string[] }; url: string; headers?: Record<string, string> }): boolean;
};
const { NextRequest } = require('next/server') as {
  NextRequest: new (url: string, init?: { headers?: Record<string, string> }) => Request;
};

const ORIGIN = 'https://www.aiandwebservices.com';

function routeWhenProxySkipped(pathname: string): Response {
  if (pathname === '/forms/contact') return getContactForm();
  if (pathname === '/forms/contact/confirm') return getContactConfirm();
  if (pathname === '/forms/contact/thanks') return getContactThanks('');
  return new Response(null, { status: 200 });
}

// Next invokes proxy.ts only when config.matcher matches. A matcher miss is the
// route handler, which is what a no-JS document request must reach.
async function requestThroughProxy(pathname: string, accept: string, origin = ORIGIN): Promise<Response> {
  const url = `${origin}${pathname}`;
  const headers = { accept };
  const matched = unstable_doesMiddlewareMatch({ config: proxyModule.config, url, headers });
  if (!matched) return routeWhenProxySkipped(pathname);
  const response = await proxyModule.default(new NextRequest(url, { headers }), { waitUntil() {} });
  if (!response) throw new Error(`proxy returned no response for ${pathname}`);
  return response;
}

function isClerkHandshake(response: Response): boolean {
  const location = response.headers.get('location') ?? '';
  return response.status === 307
    && response.headers.get('x-clerk-auth-reason') === 'dev-browser-missing'
    && /\/v1\/client\/handshake/.test(location);
}

describe('public no-JS form routes skip Clerk', () => {
  it('GET /forms/contact with Accept: text/html is not redirected to a Clerk handshake', async () => {
    const response = await requestThroughProxy('/forms/contact', 'text/html');
    expect(isClerkHandshake(response), '/forms/contact').toBe(false);
    expect(response.status, '/forms/contact').toBe(200);
    expect(response.headers.get('location') ?? '', '/forms/contact').not.toMatch(/\/v1\/client\/handshake/);
    expect(response.headers.get('x-clerk-auth-reason'), '/forms/contact').toBe(null);
    expect(await response.text(), '/forms/contact').toContain('<form method="post" action="/forms/contact">');
  });

  it('other /forms/* document requests are not redirected to a Clerk handshake', async () => {
    for (const pathname of ['/forms/contact/confirm', '/forms/contact/thanks']) {
      const response = await requestThroughProxy(pathname, 'text/html');
      expect(isClerkHandshake(response), pathname).toBe(false);
      expect(response.status, pathname).toBe(200);
      expect(response.headers.get('x-clerk-auth-reason'), pathname).toBe(null);
    }
  });
});

const APP_DIR = fileURLToPath(new URL('../app/', import.meta.url));

// Paths that read auth() or render Clerk. Everything else under app/ is public.
function routeNeedsClerk(pathname: string): boolean {
  return /^\/(colony|desktop|invite)(\/|$)/.test(pathname)
    || /^\/api\/colony(\/|$)/.test(pathname)
    || /^\/dealers\/[^/]+\/admin(\/|$)/.test(pathname)
    || /^\/api\/dealer\/[^/]+\/admin(\/|$)/.test(pathname);
}

function routeFromAppFile(file: string): string | null {
  const rel = path.relative(APP_DIR, file).split(path.sep).join('/');
  if (rel === 'robots.ts') return '/robots.txt';
  if (rel === 'sitemap.ts') return '/sitemap.xml';
  if (!/(^|\/)(page|route)\.(jsx|tsx|js|ts)$/.test(rel)) return null;
  let route = rel
    .replace(/(^|\/)page\.(jsx|tsx|js|ts)$/, '')
    .replace(/(^|\/)route\.(jsx|tsx|js|ts)$/, '');
  route = route.replace(/\/$/, '');
  route = `/${route}`.replace(/\/+/g, '/');
  route = route.replace(/\[\.\.\.[^\]]+\]/g, 'example').replace(/\[[^\]]+\]/g, 'example');
  return route === '//' ? '/' : route;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// /blog is a next.config permanent redirect, not an app page.
// /about, /pricing, and the legal copy are not app routes (pricing is on the
// service pages; privacy and terms are in-page modals). A document GET of any
// of them must still not enter Clerk.
const EXTRA_PUBLIC = ['/blog', '/about', '/pricing', '/privacy', '/terms'];

function publicRoutes(): string[] {
  const found = new Set<string>(EXTRA_PUBLIC);
  for (const file of walk(APP_DIR)) {
    const route = routeFromAppFile(file);
    if (route && !routeNeedsClerk(route)) found.add(route);
  }
  return [...found].sort();
}

describe('public marketing routes skip the Clerk handshake', () => {
  it('enumerates the public app routes, including the marketing paths', () => {
    const routes = publicRoutes();
    for (const pathname of ['/', '/contact', '/services', '/services/compare', '/services/ai-first', '/guarantee', '/llms.txt', '/robots.txt', '/sitemap.xml', '/forms/contact', '/blog']) {
      expect(routes.includes(pathname), pathname).toBe(true);
    }
  });

  it('cookie-less Accept: text/html GETs are 200 with no Clerk handshake', async () => {
    const handshakes: string[] = [];
    for (const pathname of publicRoutes()) {
      const response = await requestThroughProxy(pathname, 'text/html');
      const reason = response.headers.get('x-clerk-auth-reason');
      if (isClerkHandshake(response) || response.status !== 200 || reason) {
        handshakes.push(`${pathname} status=${response.status} reason=${reason ?? ''}`);
      }
    }
    expect(handshakes, 'public routes still entering Clerk').toEqual([]);
  });
});

describe('Clerk-protected routes still go through Clerk', () => {
  for (const pathname of [
    '/colony',
    '/colony/dashboard',
    '/colony/sign-in',
    '/desktop/auth-callback',
    '/invite/accept',
    '/api/colony/ping',
    '/dealers/lotcrm/admin',
    '/api/dealer/lotcrm/admin',
  ]) {
    it(`GET ${pathname} with Accept: text/html is redirected to the Clerk handshake`, async () => {
      const response = await requestThroughProxy(pathname, 'text/html');
      expect(response.status, pathname).toBe(307);
      expect(response.headers.get('x-clerk-auth-reason'), pathname).toBe('dev-browser-missing');
      expect(response.headers.get('location') ?? '', pathname).toMatch(/\/v1\/client\/handshake/);
    });
  }

  it('GET /colony/dashboard on colony.aiandwebservices.com still handshakes', async () => {
    const response = await requestThroughProxy('/colony/dashboard', 'text/html', 'https://colony.aiandwebservices.com');
    expect(response.status).toBe(307);
    expect(response.headers.get('x-clerk-auth-reason')).toBe('dev-browser-missing');
    const location = response.headers.get('location') ?? '';
    expect(location).toMatch(/\/v1\/client\/handshake/);
    expect(location).toMatch(/colony\.aiandwebservices\.com/);
  });
});
