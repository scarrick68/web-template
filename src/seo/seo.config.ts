import { parse } from "yaml";
import siteDefaultsRaw from "../../config/site.yml?raw";

type SeoConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
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
