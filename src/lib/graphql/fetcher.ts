import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { graphqlClient, getAuthHeaders } from "./client";

export async function fetchWithAuth<TData, TVariables extends Record<string, unknown>>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  _requestHeaders?: HeadersInit
): Promise<TData> {
  const authHeaders = await getAuthHeaders();
  return graphqlClient.request<TData>(document, variables, authHeaders);
}
