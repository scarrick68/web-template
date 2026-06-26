# SSG for SEO

## Purpose

This guide documents how static site generation is used in this template for SEO-focused pages.

## Why SSG Here

- Search bots receive complete HTML without relying on client-side rendering.
- Static pages can be cached aggressively at the CDN edge.
- You can keep a hybrid architecture: SSG for marketing/discovery pages and SPA/authenticated routes for interactive and product flows.

## Current Example

- Route: `/about`
- Page component: [pages/about/+Page.tsx](../pages/about/+Page.tsx)
- SSG config: [pages/about/+config.ts](../pages/about/+config.ts)

The About page enables prerendering with page-level config:

- `prerender: true`
- route-specific title and description metadata

## Build-Time Verification

From [repos/web-template](../README.md), run:

```sh
npm run build
```

Expected prerendered artifacts:

- `dist/client/about/index.html`
- `dist/client/about/index.pageContext.json`

Expected build log signal:

- `pre-rendering HTML...`
- `dist/client/about/index.html`

## Runtime Verification

1. Serve the production build with `npm run preview`.
2. Open `/about`.
3. View page source and confirm:
   - server-rendered About content exists in HTML.
   - `<title>` and `<meta name="description">` match About page config.
4. OR, curl http://localhost:3000/about and confirm the content type is `text/html` and the HTML contains the About page content.

## Recommended SEO Pattern

For additional SEO-focused pages (for example `/pricing`, `/features`, `/docs`):

1. Create route page at `pages/<route>/+Page.tsx`.
2. Add `pages/<route>/+config.ts` with `prerender: true`.
3. Set route-specific `title` and `description`.
4. Run `npm run build` and verify generated `dist/client/<route>/index.html`.