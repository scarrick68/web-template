# ADR 0003: Use API Template OpenAPI Spec for Frontend Contract Tests

## Status

Accepted

## Date

2026-06-22

## Context

Frontend auth tests validate request payload shape and behavior. Hardcoding backend field requirements in tests risks drift from backend contract over time.

Current setup includes a backend OpenAPI source at `../api-template/docs/openapi.yml`.

## Decision

Read backend OpenAPI definitions directly in frontend tests via:

- [test/support/openapi.ts](../../test/support/openapi.ts)

Use these definitions in flow tests (currently sign-up) to assert required request fields from the contract rather than relying on duplicated constants.

## Consequences

Positive:

- Reduces contract drift between frontend and backend tests.
- Surfaces backend contract changes quickly in frontend CI.
- Keeps contract source-of-truth in backend API docs.

Tradeoffs:

- Introduces cross-workspace file dependency in tests.
- Requires both workspace folders to be present for local test execution.

## Follow-up

Automate/synchronize OpenAPI usage so frontend test contract consumption does not rely on manual path assumptions.

This coordination will likely come from the control surface repo to be implmented in the future. At that point, we can define a consistent directory structure and test for cross project dependencies at that level to prevent drift and breakage.

## Related

- [testing.md](../testing.md)
- [pages/signup/+Page.test.tsx](../../pages/signup/+Page.test.tsx)
