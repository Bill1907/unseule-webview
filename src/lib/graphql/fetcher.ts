import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { createAuthGraphQLClient } from "./client";

export async function fetchWithAuth<TData, TVariables extends Record<string, unknown>>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  _requestHeaders?: HeadersInit
): Promise<TData> {
  const client = await createAuthGraphQLClient();
  return client.request<TData>(document, variables);
}
