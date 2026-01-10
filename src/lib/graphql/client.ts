import { GraphQLClient } from "graphql-request";
import { authClient } from "@/lib/auth";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await authClient.getSession();
  const token = session.data?.session?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createAuthGraphQLClient() {
  const headers = await getAuthHeaders();
  return new GraphQLClient(GRAPHQL_ENDPOINT, { headers });
}

export { gql } from "graphql-request";
