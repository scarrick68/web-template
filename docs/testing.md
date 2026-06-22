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

- Frontend tests read the backend OpenAPI spec from:
  - `../api-template/docs/openapi.yml`
- Helper used by signup tests:
  - [test/support/openapi.ts](../test/support/openapi.ts)

This is intentionally file-based today and can be automated/synchronized later.
