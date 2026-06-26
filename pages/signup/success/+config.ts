import type { Config } from "vike/types";
import { definePageSeo } from "../../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Sign up successful",
  description: "Account created successfully. Confirm your email to continue.",
});

export default config;
