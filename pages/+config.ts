import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import { definePageSeo } from "../src/seo/page-seo";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  ...definePageSeo(),

  extends: [vikeReact],
};

export default config;
