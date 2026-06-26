# Testing Strategy

## Purpose

This page documents the current frontend test strategy and how it validates auth/API behavior.

## Test Runner

- Tooling:
  - Vitest
  - Testing Library (`@testing-library/react`, `@testing-library/user-event`)
  - jsdom environment
- Config file: [vitest.config.ts](../vitest.config.ts)

## Commands

- Generate OpenAPI client/hooks/mocks:
  - `npm run gen:api`
- Run once:
  - `npm test`
- Watch mode:
  - `npm run test:watch`
- Lint:
  - `npm run lint`

## Current Test Coverage

### Shared API helper tests

- [src/api/auth.test.ts](../src/api/auth.test.ts)
  - DTA header extraction and request header application.

- [src/api/client.test.ts](../src/api/client.test.ts)
  - URL/base-label behavior.
  - JSON request defaults.
  - DTA header injection.
  - Ahoy visitor extraction and forwarding.
  - Safe JSON parsing fallback.

### Signup flow tests

- [pages/signup/+Page.test.tsx](../pages/signup/+Page.test.tsx)
  - Local validation behavior.
  - API request payload behavior.
  - Error handling behavior.
  - OpenAPI contract alignment for create-user required fields.

## OpenAPI Contract Source

- Frontend tests read the workspace OpenAPI spec from:
  - `contracts/openapi/openapi.yml`
- Helper used by signup tests:
  - [test/support/openapi.ts](../test/support/openapi.ts)

The helper resolves this from `web-template` using `../../contracts/openapi/openapi.yml`.

Before running contract-sensitive frontend tests, refresh the workspace contract file with `bin/sync-openapi` from workspace root.

This is intentionally file-based today and can be automated/synchronized later.

## Orval + MSW + React Query

- Generated client and hooks:
  - `src/gen/api.ts`
  - `src/gen/model/*`
- Generated MSW mock helpers:
  - `src/gen/api.msw.ts`
- Runtime mutator bridge used by generated client:
  - `src/api/orval-fetch.ts`

Page and API tests use MSW server handlers (instead of ad-hoc `fetch` stubs) plus a test `QueryClientProvider` wrapper for React Query hooks.
