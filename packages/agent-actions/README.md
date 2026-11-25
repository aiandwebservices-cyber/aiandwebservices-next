# @aiandweb/agent-actions

Shared agent-action core. This package holds the rules every surface (MCP, REST, no-JS forms) must use: PII guards, confirm tokens, rate-limit and idempotency adapters, the test-mode sink, audit lines with no personal data, and notify.

Each site keeps its own actions, facts, and host wiring. There is no shared runtime or database.

Depend on this folder with `"@aiandweb/agent-actions": "file:packages/agent-actions"`.

## Test mode

A request is test-flagged when:

- the phone is in the NANP fictional range `+1 NXX-555-01xx`, or
- the email domain is `example.com`, `example.org`, or `*.test`, or
- the `Agent-Test` header is a valid HMAC of the body (the secret is site env, never committed).

Test-flagged submits must not call `send`. The response includes `test: true`. Preview deployments must also refuse to notify.
