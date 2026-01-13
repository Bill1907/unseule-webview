import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql",
  documents: ["src/graphql/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        enumsAsConst: true,
        scalars: {
          Date: "string",
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
