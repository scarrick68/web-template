import { describe, expect, it } from "vitest";
import { buildPageTitle, canonicalUrlForPath, seoConfig } from "./seo.config";

describe("seo config helpers", () => {
  it("uses default title when page title is not provided", () => {
    expect(buildPageTitle()).toBe(seoConfig.defaultTitle);
    expect(buildPageTitle("   ")).toBe(seoConfig.defaultTitle);
  });

  it("builds page title with site name suffix", () => {
    expect(buildPageTitle("About")).toBe("About | Northline Web Template");
  });

  it("builds canonical URL and normalizes trailing slash", () => {
    expect(canonicalUrlForPath("/")).toBe("https://example.com/");
    expect(canonicalUrlForPath("/about/")).toBe("https://example.com/about");
  });
});
