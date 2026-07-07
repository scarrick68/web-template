import type { Config } from "vike/types";
import { definePageSeo } from "../../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Email confirmed",
  description: "Account email confirmation completed.",
});

export default config;
