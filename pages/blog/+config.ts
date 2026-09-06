import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Blog",
  description: "Demo blog index for the web template.",
});

export default config;
