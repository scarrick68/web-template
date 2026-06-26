import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./openapi/openapi.yml",
    output: {
      target: "./src/gen/api.ts",
      schemas: "./src/gen/model",
      client: "react-query",
      mode: "split",
      mock: true,
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/api/orval-fetch.ts",
          name: "orvalFetch",
        },
      },
    },
  },
});
