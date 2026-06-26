import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = {
  ...definePageSeo({
    route: "about",
  }),
  prerender: true,
};

export default config;