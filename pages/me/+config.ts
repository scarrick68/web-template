import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "My account",
  description: "Authenticated account page that validates current auth headers.",
});

export default config;
