# ADR 0003: Use Workspace OpenAPI Spec for Frontend Contract Tests

## Status

Accepted

## Date

2026-06-22

## Context

Frontend auth tests validate request payload shape and behavior. Hardcoding backend field requirements in tests risks drift from backend contract over time.

Current setup includes a workspace contract OpenAPI source at `contracts/openapi/openapi.yml`.

## Decision

Read workspace OpenAPI definitions directly in frontend tests via:

- [test/support/openapi.ts](../../test/support/openapi.ts)

Use these definitions in flow tests (currently sign-up) to assert required request fields from the contract rather than relying on duplicated constants.

Keep the workspace contract file current by running `bin/sync-openapi` from the workspace root. This utility copies the latest spec from `repos/api-template/docs/openapi.yml` to the consumer-facing contract path `contracts/openapi/openapi.yml` (and mirrors to `repos/web-template/openapi/openapi.yml`).

## Consequences

Positive:

- Reduces contract drift between frontend and backend tests.
- Surfaces backend contract changes quickly in frontend CI.
- Keeps consumer tests aligned with the workspace contract location.

Tradeoffs:

- Requires the parent workspace contract directory to be present for local test execution.

## Follow-up

Automate/synchronize OpenAPI usage so frontend test contract consumption does not rely on manual path assumptions.

This coordination will likely come from the control surface repo to be implemented in the future. At that point, we can define a consistent directory structure and test for cross project dependencies at that level to prevent drift and breakage.

## Related

- [testing.md](../testing.md)
- [pages/signup/+Page.test.tsx](../../pages/signup/+Page.test.tsx)
