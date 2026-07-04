import { describe, expect, it } from "vitest";
import {
  buildPageTitle,
  buildRobotsContent,
  buildSeoHeadData,
  canonicalUrlForPath,
  defaultOpenGraphTypeForPath,
  defaultRobotsForPath,
  seoConfig,
} from "./seo.config";

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
    expect(defaultRobotsForPath("/signup/confirmed")).toBe("noindex,nofollow");
    expect(defaultRobotsForPath("/me")).toBe("noindex,nofollow");
  });

  it("builds robots content from explicit overrides", () => {
    expect(buildRobotsContent({ noindex: true, nofollow: true })).toBe("noindex,nofollow");
    expect(buildRobotsContent({ noindex: true, nofollow: false })).toBe("noindex,follow");
  });

  it("uses article open graph type for slug detail routes", () => {
    expect(defaultOpenGraphTypeForPath("/blog/my-post")).toBe("article");
    expect(defaultOpenGraphTypeForPath("/docs/install-guide")).toBe("article");
    expect(defaultOpenGraphTypeForPath("/blog")).toBe("website");
  });

  it("builds public page OG and Twitter metadata", () => {
    const seo = buildSeoHeadData({
      pathname: "/about",
      title: "About | Northline Web Template",
      description: "About page",
    });

    expect(seo.canonicalUrl).toBe("https://example.com/about");
    expect(seo.robots).toBe("index,follow");
    expect(seo.openGraph?.title).toBe("About | Northline Web Template");
    expect(seo.openGraph?.type).toBe("website");
    expect(seo.openGraph?.url).toBe("https://example.com/about");
    expect(seo.openGraph?.image).toBe("https://example.com/og/default.png");
    expect(seo.twitter?.card).toBe("summary_large_image");
  });

  it("does not build OG and Twitter metadata for noindex routes", () => {
    const seo = buildSeoHeadData({
      pathname: "/signin",
      title: "Sign in | Northline Web Template",
      description: "Sign in",
    });

    expect(seo.robots).toBe("noindex,nofollow");
    expect(seo.openGraph).toBeNull();
    expect(seo.twitter).toBeNull();
  });
});
