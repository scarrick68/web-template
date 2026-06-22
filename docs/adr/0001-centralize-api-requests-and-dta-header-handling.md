# ADR 0001: Centralize API Requests and DTA (Devise Token Auth) Header Handling

## Status

Accepted

## Date

2026-06-22

## Context

Frontend pages need to call Rails token-auth and API endpoints consistently. Direct `fetch` usage in each page would duplicate:

- Base URL handling
- JSON request/response behavior
- Devise Token Auth (DTA) header flow
- Ahoy visitor forwarding

As sign-up, sign-in, and authenticated endpoints expand, scattered request logic would increase drift and maintenance cost.

## Decision

Create shared API helper modules:

- [src/api/client.ts](../../src/api/client.ts)
- [src/api/auth.ts](../../src/api/auth.ts)

Key responsibilities:

- `apiFetch()` wraps `fetch` with JSON defaults and optional DTA/Ahoy header handling.
- `apiUrl()` resolves relative vs absolute URL behavior from environment configuration.
- `parseJsonResponse()` provides safe JSON parsing fallback.
- `extractDtaAuthHeaders()` and `applyDtaAuthHeaders()` normalize DTA header mapping.

## Consequences

Positive:

- Auth/API behavior is centralized and testable.
- Page components stay thinner and easier to replace.
- Future sign-in/me flows can reuse existing primitives.

Tradeoffs:

- Helper layer adds a small abstraction over raw `fetch`.
- Behavior changes in helpers affect all pages that use them.

## Related

- [configuration.md](../configuration.md)
- [testing.md](../testing.md)
