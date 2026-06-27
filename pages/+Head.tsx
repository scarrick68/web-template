// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";
import { usePageContext } from "vike-react/usePageContext";
import { buildSeoHeadData } from "../src/seo/seo.config";
import { defaultSchemasForPath, jsonLdGraphToString } from "../src/seo/schema";

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export function Head() {
  const pageContext = usePageContext();
  const pathname = pageContext.urlPathname || "/";
  const pageConfig = (pageContext as { config?: Record<string, unknown> }).config;
  const seo = buildSeoHeadData({
    pathname,
    title: readString(pageConfig?.title),
    description: readString(pageConfig?.description),
  });
  const jsonLd = jsonLdGraphToString(defaultSchemasForPath(pathname));

  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta name="robots" content={seo.robots} />
      {seo.openGraph && (
        <>
          <meta property="og:title" content={seo.openGraph.title} />
          <meta property="og:description" content={seo.openGraph.description} />
          <meta property="og:type" content={seo.openGraph.type} />
          <meta property="og:url" content={seo.openGraph.url} />
          <meta property="og:image" content={seo.openGraph.image} />
          <meta property="og:image:alt" content={seo.openGraph.imageAlt} />
        </>
      )}
      {seo.twitter && (
        <>
          <meta name="twitter:card" content={seo.twitter.card} />
          <meta name="twitter:title" content={seo.twitter.title} />
          <meta name="twitter:description" content={seo.twitter.description} />
          <meta name="twitter:image" content={seo.twitter.image} />
        </>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
