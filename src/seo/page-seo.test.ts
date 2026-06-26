import { describe, expect, it } from "vitest";
import { definePageSeo } from "./page-seo";

describe("definePageSeo", () => {
  it("uses global defaults when no overrides are provided", () => {
    const config = definePageSeo();

    expect(config.title).toBe("Northline Web Template");
    expect(config.description).toBe("Web starter with Rails auth flows and SEO-ready static pages.");
  });

  it("derives title and description from route when provided", () => {
    const config = definePageSeo({ route: "about" });

    expect(config.title).toBe("About | Northline Web Template");
    expect(config.description).toBe("Learn more on the about page of Northline Web Template.");
  });

  it("applies title and description overrides", () => {
    const config = definePageSeo({
      route: "signin",
      title: "Sign in",
      description: "Sign in page",
    });

    expect(config.title).toBe("Sign in | Northline Web Template");
    expect(config.description).toBe("Sign in page");
  });
});
