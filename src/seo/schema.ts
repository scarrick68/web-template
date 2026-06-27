import { canonicalUrlForPath, seoConfig } from "./seo.config";

export type JsonLdNode = Record<string, unknown>;

function organizationId() {
  return `${seoConfig.siteUrl.replace(/\/+$/, "")}/#organization`;
}

function websiteId() {
  return `${seoConfig.siteUrl.replace(/\/+$/, "")}/#website`;
}

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    publisher: {
      "@id": organizationId(),
    },
  };
}

export function webPageSchema(pathname: string): JsonLdNode {
  const pageUrl = canonicalUrlForPath(pathname || "/");

  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": organizationId(),
    },
  };
}

export function defaultSchemasForPath(pathname: string): JsonLdNode[] {
  return [
    organizationSchema(),
    websiteSchema(),
    webPageSchema(pathname),
  ];
}

export function softwareApplicationSchema(options: {
  name: string;
  url: string;
  description?: string;
  applicationCategory?: string;
}): JsonLdNode {
  return {
    "@type": "SoftwareApplication",
    name: options.name,
    url: options.url,
    description: options.description,
    applicationCategory: options.applicationCategory || "BusinessApplication",
  };
}

export function articleSchema(options: {
  headline: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
}): JsonLdNode {
  return {
    "@type": "Article",
    headline: options.headline,
    url: options.url,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    description: options.description,
    publisher: {
      "@id": organizationId(),
    },
  };
}

export function techArticleSchema(options: {
  headline: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
}): JsonLdNode {
  return {
    ...articleSchema(options),
    "@type": "TechArticle",
  };
}

export function faqPageSchema(mainEntity: Array<{ question: string; answer: string }>): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: mainEntity.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function breadcrumbListSchema(items: Array<{ name: string; item: string }>): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function jsonLdGraphToString(nodes: JsonLdNode[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  });
}
