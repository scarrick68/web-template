# ADR 0002: Separate Dev Proxy Target from Browser API Base URL

## Status

Accepted

## Date

2026-06-22

## Context

The frontend has two different API-targeting concerns:

1. Vite dev-server proxy target (`/auth`, `/api`) for local development.
2. Browser runtime API base URL when frontend should call an absolute API origin directly.

Using one variable for both concerns causes confusion and misconfiguration.

## Decision

Use two explicit environment variables with non-overlapping scope:

- `VITE_RAILS_PROXY_TARGET`
  - Read in [vite.config.ts](../../vite.config.ts)
  - Purpose: local dev proxy target
  - Default: `http://localhost:5001`

- `VITE_API_BASE_URL`
  - Read in [src/api/client.ts](../../src/api/client.ts)
  - Purpose: browser-visible absolute API base URL
  - Typical local value: empty string so frontend uses same-origin relative paths

## Consequences

Positive:

- Lower risk of proxy/runtime target confusion.
- Cleaner local development behavior without CORS complexity.
- Explicit deploy-time control for direct browser API targeting.

Tradeoffs:

- Slightly more configuration surface area.
- Requires documentation to keep meaning clear.

## Related

- [configuration.md](../configuration.md)
- [README.md](../README.md)
