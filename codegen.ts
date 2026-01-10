import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/generated/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: {
          func: "@/lib/graphql/client#graphqlClient.request",
          isReactHook: false,
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQuery: true,
      },
    },
  },
};

export default config;
