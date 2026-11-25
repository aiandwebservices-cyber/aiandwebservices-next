import { AsyncLocalStorage } from 'node:async_hooks';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
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
  compiled.paths = NodeModule._nodeModulePaths(dirname(filename));
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
async function requestThroughProxy(pathname: string, accept: string): Promise<Response> {
  const url = `${ORIGIN}${pathname}`;
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

describe('Clerk-protected routes still go through Clerk', () => {
  for (const pathname of ['/colony/dashboard', '/dealers/lotcrm/admin', '/api/dealer/lotcrm/admin']) {
    it(`GET ${pathname} with Accept: text/html is redirected to the Clerk handshake`, async () => {
      const response = await requestThroughProxy(pathname, 'text/html');
      expect(response.status, pathname).toBe(307);
      expect(response.headers.get('x-clerk-auth-reason'), pathname).toBe('dev-browser-missing');
      expect(response.headers.get('location') ?? '', pathname).toMatch(/\/v1\/client\/handshake/);
    });
  }
});
