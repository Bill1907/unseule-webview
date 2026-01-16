import { GraphQLClient } from "graphql-request";
import type { GetToken } from "@clerk/types";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql";

const JWT_TEMPLATE = "uneseule-backend";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function createAuthGraphQLClient(getToken: GetToken) {
  const token = await getToken({ template: JWT_TEMPLATE });

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { gql } from "graphql-request";
