import type { Config } from "vike/types";
import { buildPageTitle, seoConfig } from "./seo.config";

type PageSeoOptions = {
  route?: string;
  title?: string;
  description?: string;
};

function routeToLabel(route?: string) {
  if (!route) {
    return null;
  }

  const normalized = route
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[\/_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (!normalized) {
    return null;
  }

  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function definePageSeo(options: PageSeoOptions = {}): Config {
  const routeLabel = routeToLabel(options.route);
  const resolvedTitle = options.title || routeLabel || seoConfig.defaultTitle;
  const resolvedDescription = options.description ||
    (routeLabel
      ? `Learn more on the ${routeLabel.toLowerCase()} page of ${seoConfig.siteName}.`
      : seoConfig.defaultDescription);

  return {
    title: buildPageTitle(resolvedTitle),
    description: resolvedDescription,
  };
}
