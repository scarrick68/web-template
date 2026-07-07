import { describe, expect, it } from "vitest";
import { definePageSeo } from "./page-seo";
import { seoConfig } from "./seo.config";

describe("definePageSeo", () => {
  it("uses global defaults when no overrides are provided", () => {
    const config = definePageSeo();

    expect(config.title).toBe(seoConfig.defaultTitle);
    expect(config.description).toBe(seoConfig.defaultDescription);
  });

  it("derives title and description from route when provided", () => {
    const config = definePageSeo({ route: "about" });

    expect(config.title).toBe(`About | ${seoConfig.siteName}`);
    expect(config.description).toBe(`Learn more on the about page of ${seoConfig.siteName}.`);
  });

  it("applies title and description overrides", () => {
    const config = definePageSeo({
      route: "signin",
      title: "Sign in",
      description: "Sign in page",
    });

    expect(config.title).toBe(`Sign in | ${seoConfig.siteName}`);
    expect(config.description).toBe("Sign in page");
  });

  it("keeps metadata config limited to supported title/description fields", () => {
    const config = definePageSeo({
      title: "Dashboard",
      description: "Private area",
    });

    expect(config.title).toBe(`Dashboard | ${seoConfig.siteName}`);
    expect(config.description).toBe("Private area");
  });
});
