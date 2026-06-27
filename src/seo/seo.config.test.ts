import { describe, expect, it } from "vitest";
import { buildPageTitle, buildRobotsContent, canonicalUrlForPath, defaultRobotsForPath, seoConfig } from "./seo.config";

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

  it("uses index/follow defaults for public pages", () => {
    expect(defaultRobotsForPath("/")).toBe("index,follow");
    expect(defaultRobotsForPath("/about")).toBe("index,follow");
  });

  it("uses noindex/nofollow defaults for private routes", () => {
    expect(defaultRobotsForPath("/signin")).toBe("noindex,nofollow");
    expect(defaultRobotsForPath("/signup/success")).toBe("noindex,nofollow");
    expect(defaultRobotsForPath("/me")).toBe("noindex,nofollow");
  });

  it("builds robots content from explicit overrides", () => {
    expect(buildRobotsContent({ noindex: true, nofollow: true })).toBe("noindex,nofollow");
    expect(buildRobotsContent({ noindex: true, nofollow: false })).toBe("noindex,follow");
  });
});
