import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function createAuthGraphQLClient(
  getToken: () => Promise<string | null>
) {
  const token = await getToken();

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { gql } from "graphql-request";
