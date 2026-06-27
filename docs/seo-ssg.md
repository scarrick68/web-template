# SSG for SEO

## Purpose

This guide documents how static site generation is used in this template for SEO-focused pages.

## Foundation Implemented

- Title support for all pages via global defaults and route-level overrides.
- Meta description support via the same global + page-level config path.
- Canonical URL support in [pages/+Head.tsx](../pages/+Head.tsx).
- Robots metadata support (`index,follow` and `noindex,nofollow`) in [pages/+Head.tsx](../pages/+Head.tsx).
- Open Graph and Twitter card metadata support in [pages/+Head.tsx](../pages/+Head.tsx), derived from the same SEO source.
- Default JSON-LD structured data graph support in [pages/+Head.tsx](../pages/+Head.tsx).
- Centralized defaults in [src/seo/seo.config.ts](../src/seo/seo.config.ts).
- Declarative per-page helper in [src/seo/page-seo.ts](../src/seo/page-seo.ts).
- JSON-LD helpers in [src/seo/schema.ts](../src/seo/schema.ts).
- Generated crawl artifacts in [public/robots.txt](../public/robots.txt) and [public/sitemap.xml](../public/sitemap.xml).

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
- `dist/client/robots.txt`
- `dist/client/sitemap.xml`

Expected build log signal:

- `pre-rendering HTML...`
- `dist/client/about/index.html`

## Runtime Verification

1. Serve the production build with `npm run preview`.
2. Open `/about`.
3. View page source and confirm:
   - server-rendered About content exists in HTML.
   - `<title>` and `<meta name="description">` match About page config.
   - `<link rel="canonical">` points to the expected absolute route URL.
   - `<meta name="robots" content="index,follow">` exists for public marketing pages.
   - `<meta property="og:*">` and `<meta name="twitter:*">` tags exist on indexable pages.
   - `<script type="application/ld+json">` exists with `Organization`, `WebSite`, and `WebPage` in `@graph`.
4. OR, curl http://localhost:3000/about and confirm the content type is `text/html` and the HTML contains the About page content.

## Production Domain Setup

Before launch, update the placeholder domain (`https://example.com`) in:

- [src/seo/seo.config.ts](../src/seo/seo.config.ts)
- [public/robots.txt](../public/robots.txt)
- [public/sitemap.xml](../public/sitemap.xml)

## Recommended SEO Pattern

For additional SEO-focused pages (for example `/pricing`, `/features`, `/docs`):

1. Create route page at `pages/<route>/+Page.tsx`.
2. Add `pages/<route>/+config.ts` with `prerender: true`.
3. Set route-specific `title` and `description`.
4. Run `npm run build` and verify generated `dist/client/<route>/index.html`.

## Robots Policy

Public marketing/discovery pages should generally be `index,follow`.

Private, authenticated, internal, and error pages should generally be `noindex,nofollow`.

For these noindex routes, this template suppresses Open Graph and Twitter tags by default.

Current default private route set in this template includes:

- `/signin`
- `/signup`
- `/signup/success`
- `/me`
- `/_error`

## Structured Data (JSON-LD)

This template emits a default site-level JSON-LD graph on every page:

- `Organization`
- `WebSite`
- `WebPage`

Implementation is in [src/seo/schema.ts](../src/seo/schema.ts), rendered by [pages/+Head.tsx](../pages/+Head.tsx).

Available helper builders for page-specific schema composition.

If a product page needs additional schema nodes, combine `defaultSchemasForPath(path)` with helper output and render a composed JSON-LD graph in the page/head integration.