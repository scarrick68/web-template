# AGENTS.md

## Project

React web application built with Vite and Vike.

This application consumes the Rails API and is intended to share authentication and business logic concepts with mobile clients while providing a web-specific user experience. It is intended to support SSG rendering mode for SEO relevant pages and SPA rendering mode for authenticated user app experiences.

## Architecture

- Routing is handled by Vike.
- UI is built with React.
- Styling uses Tailwind CSS.
- API requests are made to the Rails backend.
- Development requests may be proxied through Vite.
- Keep business logic separate from page components when practical.
- Update docs when extending or updating major features or application architecture.

## API Integration

- The Rails API is the source of truth for business data.
- Do not duplicate backend business rules in the frontend when avoidable.
- Prefer consuming API responses rather than reimplementing backend logic.
- Keep API interaction patterns consistent with existing code.

## Testing

- Use Vitest.
- Use React Testing Library.
- Use MSW for API mocking when appropriate.
- Do not introduce Jest.
- Prefer testing user-visible behavior over implementation details.
- Prefer queries based on accessible content rather than CSS selectors.
- Avoid excessive mocking of React internals.
- When adding or changing pages, add or update tests that exercise the user-facing behavior.
- Keep tests compatible with parallel execution.
- Follow existing patterns in the codebase before introducing new abstractions.
- Use Playwright for browser-level E2E tests.
- Prefer Vitest + React Testing Library + MSW for most UI behavior.
- Browser E2E tests may mock the Rails API from the shared OpenAPI schema.

Run targeted tests with:

```sh
npm test
```

Before completing substantial changes:

```sh
npm run lint
npm run test
npm run build
```

## Code Style

- Prefer functional React components.
- Prefer existing project patterns before introducing new libraries.
- Keep components focused and reasonably small.
- Avoid premature abstraction.
- Minimize new dependencies unless clearly justified.
