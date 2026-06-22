# Configuration Reference

## Purpose

This page describes the current frontend runtime configuration and API plumbing in `web-template`.

## Environment Variables

- `VITE_RAILS_PROXY_TARGET`
  - Scope: Vite dev server only.
  - Used by: [vite.config.ts](../vite.config.ts)
  - Purpose: target backend for `/auth` and `/api` proxy routes in local development.
  - Default: `http://127.0.0.1:5000`.

- `VITE_API_BASE_URL`
  - Scope: browser-visible frontend runtime.
  - Used by: [src/api/client.ts](../src/api/client.ts)
  - Purpose: absolute API base URL for direct browser calls.
  - Typical local value: empty string (use same-origin paths + Vite proxy).

## Shared API Helpers

The frontend API entrypoint is [src/api/client.ts](../src/api/client.ts), with DTA header utilities in [src/api/auth.ts](../src/api/auth.ts).

### `src/api/client.ts`

- `apiUrl(path)`
  - Builds relative or absolute endpoint URL depending on `VITE_API_BASE_URL`.

- `apiFetch(path, options)`
  - Wraps `fetch` with defaults:
    - `Accept: application/json`
    - `Content-Type: application/json` when `json` payload is provided for non-GET/HEAD methods
  - Supports `json` request payload serialization.
  - Injects Devise Token Auth headers when `authHeaders` is provided.
  - Sends `Ahoy-Visitor` header from explicit override or `ahoy_visitor` cookie.

- `parseJsonResponse(response)`
  - Parses response JSON and falls back to `{}` when JSON parsing fails.

### `src/api/auth.ts`

- `extractDtaAuthHeaders(response)`
  - Reads DTA auth headers from a response after sign-in/sign-up.
  - Returns `null` if required headers are missing.

- `applyDtaAuthHeaders(headers, authHeaders)`
  - Writes DTA auth headers to outgoing requests for authenticated endpoints.

## Current Usage

- Signup form in [pages/signup/+Page.tsx](../pages/signup/+Page.tsx) uses `apiFetch` and `parseJsonResponse`.
- This keeps page-level auth UI thin while API concerns stay in shared modules.
