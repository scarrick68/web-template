import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "Northline Web Template",
  description: "Web starter with Rails auth signup flow",

  extends: [vikeReact],
};

export default config;
