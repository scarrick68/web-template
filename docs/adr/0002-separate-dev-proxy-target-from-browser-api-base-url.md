# ADR 0002: Use Explicit Browser API Base URL

## Status

Accepted

## Date

2026-06-22

## Context

The frontend should use one explicit API target model across environments.

Proxy-only development wiring can hide runtime behavior differences and increase configuration confusion.

## Decision

Use one explicit environment variable:

- `VITE_API_BASE_URL`
  - Read in [src/api/client.ts](../../src/api/client.ts)
  - Purpose: browser-visible absolute API base URL in all environments
  - Default: `http://localhost:5001`

## Consequences

Positive:

- One API-targeting strategy across local, CI, and production.
- CORS behavior exercised in development for split-origin deployments.
- Lower risk of hidden dev-only routing behavior.

Tradeoffs:

- Requires correct CORS setup for local browser requests.

## Related

- [configuration.md](../configuration.md)
- [README.md](../README.md)
