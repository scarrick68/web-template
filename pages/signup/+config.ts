import type { Config } from "vike/types";
import { definePageSeo } from "../../src/seo/page-seo";

const config: Config = definePageSeo({
  title: "Sign up",
  description: "Create your account with the token-auth registration flow.",
});

export default config;
