import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Home",
  description: "Launch-ready frontend shell for Rails-backed products with SEO-ready defaults.",
});

export default config;
