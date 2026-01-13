import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export function createAuthGraphQLClient() {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    credentials: "include",
  });
}

export { gql } from "graphql-request";
