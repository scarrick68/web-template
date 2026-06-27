import { describe, expect, it } from "vitest";
import {
  breadcrumbListSchema,
  defaultSchemasForPath,
  faqPageSchema,
  jsonLdGraphToString,
  softwareApplicationSchema,
} from "./schema";

describe("seo schema helpers", () => {
  it("builds default schema graph for a route", () => {
    const nodes = defaultSchemasForPath("/about");

    expect(nodes.map((node) => node["@type"])).toEqual(["Organization", "WebSite", "WebPage"]);

    const webPage = nodes.find((node) => node["@type"] === "WebPage");
    expect(webPage?.url).toBe("https://example.com/about");
  });

  it("serializes schemas as a JSON-LD graph", () => {
    const json = jsonLdGraphToString(defaultSchemasForPath("/"));
    const parsed = JSON.parse(json) as { "@context": string; "@graph": Array<Record<string, unknown>> };

    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"].length).toBe(3);
  });

  it("provides reusable helper schemas", () => {
    const appSchema = softwareApplicationSchema({
      name: "Northline",
      url: "https://example.com",
    });
    const faqSchema = faqPageSchema([{ question: "What is this?", answer: "A template." }]);
    const breadcrumbSchema = breadcrumbListSchema([
      { name: "Home", item: "https://example.com/" },
      { name: "Docs", item: "https://example.com/docs" },
    ]);

    expect(appSchema["@type"]).toBe("SoftwareApplication");
    expect(faqSchema["@type"]).toBe("FAQPage");
    expect(breadcrumbSchema["@type"]).toBe("BreadcrumbList");
  });
});
