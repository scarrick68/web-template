import { parse } from "yaml";
import siteDefaultsRaw from "../../config/site.yml?raw";

type SeoConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
};

export type OpenGraphType = "website" | "article";

export type OpenGraphData = {
  title: string;
  description: string;
  type: OpenGraphType;
  url: string;
  image: string;
  imageAlt: string;
};

export type TwitterCardData = {
  card: "summary" | "summary_large_image";
  title: string;
  description: string;
  image: string;
};

export type SeoHeadData = {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  openGraph: OpenGraphData | null;
  twitter: TwitterCardData | null;
};

function loadSeoConfig(): SeoConfig {
  const parsed = parse(siteDefaultsRaw) as Partial<SeoConfig> | null;

  return {
    siteName: parsed?.siteName || "Northline Web Template",
    siteUrl: parsed?.siteUrl || "https://example.com",
    defaultTitle: parsed?.defaultTitle || parsed?.siteName || "Northline Web Template",
    defaultDescription: parsed?.defaultDescription || "Web starter with Rails auth flows and SEO-ready static pages.",
  };
}

export const seoConfig = loadSeoConfig();

export function buildPageTitle(pageTitle?: string) {
  if (!pageTitle) {
    return seoConfig.defaultTitle;
  }

  const trimmed = pageTitle.trim();
  if (!trimmed) {
    return seoConfig.defaultTitle;
  }

  if (trimmed === seoConfig.defaultTitle) {
    return seoConfig.defaultTitle;
  }

  return `${trimmed} | ${seoConfig.siteName}`;
}

export function canonicalUrlForPath(pathname: string) {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
  return new URL(normalizedPath, seoConfig.siteUrl).toString();
}

function isPrivateOrInternalPath(pathname: string) {
  const normalizedPath = pathname.trim().replace(/\/+$/, "") || "/";
  return ["/me", "/signin", "/signup", "/_error"].some((route) =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );
}

export function defaultRobotsForPath(pathname: string) {
  return isPrivateOrInternalPath(pathname) ? "noindex,nofollow" : "index,follow";
}

export function buildRobotsContent(options: { noindex?: boolean; nofollow?: boolean; pathname?: string } = {}) {
  const { noindex, nofollow, pathname } = options;
  const fallback = pathname ? defaultRobotsForPath(pathname) : "index,follow";

  if (noindex === undefined && nofollow === undefined) {
    return fallback;
  }

  const shouldNoindex = noindex ?? fallback.startsWith("noindex");
  const shouldNofollow = nofollow ?? fallback.endsWith("nofollow");

  return `${shouldNoindex ? "noindex" : "index"},${shouldNofollow ? "nofollow" : "follow"}`;
}

export function defaultOpenGraphTypeForPath(pathname: string): OpenGraphType {
  const normalizedPath = pathname.trim().replace(/\/+$/, "") || "/";

  if (/^\/(blog|changelog|docs)\/[^/]+$/.test(normalizedPath)) {
    return "article";
  }

  return "website";
}

export function defaultOpenGraphImageUrl() {
  return new URL("/og/default.png", seoConfig.siteUrl).toString();
}

export function buildSeoHeadData(options: {
  pathname: string;
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: OpenGraphType;
    image?: string;
    imageAlt?: string;
  };
}): SeoHeadData {
  const pathname = options.pathname || "/";
  const title = options.title?.trim() || seoConfig.defaultTitle;
  const description = options.description?.trim() || seoConfig.defaultDescription;
  const canonicalUrl = canonicalUrlForPath(pathname);
  const robots = defaultRobotsForPath(pathname);

  if (robots.startsWith("noindex")) {
    return {
      title,
      description,
      canonicalUrl,
      robots,
      openGraph: null,
      twitter: null,
    };
  }

  const ogImage = options.openGraph?.image || defaultOpenGraphImageUrl();
  const openGraph: OpenGraphData = {
    title: options.openGraph?.title?.trim() || title,
    description: options.openGraph?.description?.trim() || description,
    type: options.openGraph?.type || defaultOpenGraphTypeForPath(pathname),
    url: canonicalUrl,
    image: ogImage,
    imageAlt: options.openGraph?.imageAlt?.trim() || `Preview image for ${title}`,
  };

  const twitter: TwitterCardData = {
    card: "summary_large_image",
    title: openGraph.title,
    description: openGraph.description,
    image: ogImage,
  };

  return {
    title,
    description,
    canonicalUrl,
    robots,
    openGraph,
    twitter,
  };
}
