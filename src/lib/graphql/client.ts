import { GraphQLClient } from "graphql-request";
import { authClient } from "@/lib/auth";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_URL || "https://api.uneseule.me/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function createAuthGraphQLClient() {
  const session = await authClient.getSession();
  // better-auth 세션 구조: session.data.session.token
  const token = (session.data?.session as { token?: string })?.token;

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { gql } from "graphql-request";
