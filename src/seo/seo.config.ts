import { parse } from "yaml";
import seoDefaultsRaw from "../../config/seo.defaults.yml?raw";

type SeoConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
};

function loadSeoConfig(): SeoConfig {
  const parsed = parse(seoDefaultsRaw) as Partial<SeoConfig> | null;

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
