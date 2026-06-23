import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

type OpenApiSchema = {
  openapi: string;
  paths?: Record<string, unknown>;
  components?: {
    schemas?: Record<string, unknown>;
  };
};

type RequestSchema = {
  required?: string[];
  properties?: Record<string, unknown>;
};

let cachedSpec: OpenApiSchema | null = null;

function loadApiTemplateOpenApi(): OpenApiSchema {
  if (cachedSpec) return cachedSpec;

  const openApiPath = path.resolve(process.cwd(), "../../contracts/openapi/openapi.yml");
  const raw = fs.readFileSync(openApiPath, "utf8");
  cachedSpec = parse(raw) as OpenApiSchema;
  return cachedSpec;
}

export function getCreateUserRequestSchema(): RequestSchema {
  const spec = loadApiTemplateOpenApi();
  const createUserPath = spec.paths?.["/api/v1/users"] as {
    post?: {
      requestBody?: {
        content?: {
          "application/json"?: {
            schema?: RequestSchema;
          };
        };
      };
    };
  };

  const schema = createUserPath?.post?.requestBody?.content?.["application/json"]?.schema;
  if (!schema) {
    throw new Error("Unable to read /api/v1/users POST request schema from workspace OpenAPI spec.");
  }

  return schema;
}
