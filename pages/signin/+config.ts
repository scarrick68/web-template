import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Sign in",
  description: "Sign in to your account.",
});

export default config;
