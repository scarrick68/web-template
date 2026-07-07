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
- `/signup/confirmed`
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

Common helper builders in [src/seo/schema.ts](../src/seo/schema.ts):

- `softwareApplicationSchema(...)`
- `articleSchema(...)`
- `techArticleSchema(...)`
- `faqPageSchema(...)`
- `breadcrumbListSchema(...)`

## Open Graph and Twitter

Open Graph and Twitter metadata are rendered from the same SEO source as title/description/canonical data.

Implementation path:

- [src/seo/seo.config.ts](../src/seo/seo.config.ts): builds normalized SEO head data.
- [pages/+Head.tsx](../pages/+Head.tsx): renders canonical, robots, Open Graph, Twitter, and JSON-LD tags.

Default behavior:

- Public routes: emits Open Graph and Twitter tags.
- Private/noindex routes: suppresses Open Graph and Twitter tags.
- Route type defaults:
  - `/blog/:slug`, `/changelog/:slug`, `/docs/:slug` => `og:type=article`
  - other public routes => `og:type=website`
- Fallback Open Graph image => `https://<site>/og/default.png`

## What To Add During Development

This template gives you safe defaults, but each product should add project-specific SEO assets and metadata.

1. Add a real fallback OG image.
   - Create [public/og/default.png](../public/og/default.png) in your brand style.
   - Recommended size: 1200x630.

2. Configure production identity values.
   - Update [config/site.yml](../config/site.yml) with your real site name and domain.

3. Add route-level SEO metadata for public pages.
   - In each public route `+config.ts`, define specific `title` and `description` via [src/seo/page-seo.ts](../src/seo/page-seo.ts).

4. Ensure public dynamic content is SSR or prerendered.
   - Social crawlers often do not execute client-only JavaScript.
   - If route content comes from CMS/API, return metadata with the content payload and render tags server-side.

5. Extend JSON-LD for content-rich pages.
   - Use schema helpers for docs/blog/faq/breadcrumb pages.
   - Validate structured data with Rich Results Test before launch.

6. Validate share previews before production rollout.
   - Use Facebook Sharing Debugger and Twitter Card Validator with preview/staging URLs.