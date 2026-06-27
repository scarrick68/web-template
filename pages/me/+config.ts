import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "My account",
  description: "User account settings and preferences.",
});

export default config;
