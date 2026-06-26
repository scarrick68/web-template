# Configuration Reference

## Purpose

This page describes the current frontend runtime configuration and API plumbing in `web-template`.

## Environment Variables

- `VITE_RAILS_PROXY_TARGET`
  - Scope: Vite dev server only.
  - Used by: [vite.config.ts](../vite.config.ts)
  - Purpose: target backend for `/auth` and `/api` proxy routes in local development.
  - Default: `http://localhost:5001`.

- `VITE_API_BASE_URL`
  - Scope: browser-visible frontend runtime.
  - Used by: [src/api/client.ts](../src/api/client.ts)
  - Purpose: absolute API base URL for direct browser calls.
  - Typical local value: empty string (use same-origin paths + Vite proxy).

## SEO Foundation Defaults

The template includes centralized SEO defaults and a declarative page-level override helper.

- Site-wide SEO defaults source: [config/seo.defaults.yml](../config/seo.defaults.yml)
- Site-wide SEO runtime loader: [src/seo/seo.config.ts](../src/seo/seo.config.ts)
- Page-level helper: [src/seo/page-seo.ts](../src/seo/page-seo.ts)
- Global head tags (favicon + canonical): [pages/+Head.tsx](../pages/+Head.tsx)

### `config/seo.defaults.yml`

- Stable bootstrap/orchestration hook location for SEO site identity values.
- Holds `siteName`, `siteUrl`, `defaultTitle`, and `defaultDescription`.

### `src/seo/seo.config.ts`

- Loads and validates values from `config/seo.defaults.yml`.

- `seoConfig`
  - `siteName`: used by title formatting.
  - `siteUrl`: canonical URL base and sitemap domain.
  - `defaultTitle`, `defaultDescription`: fallback metadata for pages without overrides.

- `buildPageTitle(pageTitle)`
  - Formats route title as `<Page> | <Site Name>`.
  - Falls back to `defaultTitle` when page title is missing.

- `canonicalUrlForPath(pathname)`
  - Builds absolute canonical URLs from route paths.
  - Normalizes trailing slash for non-root routes.

### `src/seo/page-seo.ts`

- `definePageSeo(options)`
  - Declarative helper for `+config.ts` files.
  - Supports `title` and `description`.
  - Uses global defaults when fields are omitted.

Rendering strategy is configured directly in each page `+config.ts` (for example `prerender: true` for SSG pages) and is intentionally not part of the SEO helper.

### Foundation Artifacts

- Robots file: [public/robots.txt](../public/robots.txt)
- Sitemap file: [public/sitemap.xml](../public/sitemap.xml)

Important: replace `https://example.com` in SEO config and sitemap/robots with your real production domain before launch.

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
