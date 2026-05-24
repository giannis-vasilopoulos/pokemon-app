import { POKEAPI_GRAPHQL_URL } from '../../constants';
import { PokeApiError, PokeApiNotFoundError } from '../client';

import type { GraphQLRequest, GraphQLResponse } from './types';

export class PokeApiGraphQLError extends PokeApiError {
  constructor(
    message: string,
    public graphqlErrors: Array<{
      message: string;
      extensions?: Record<string, unknown>;
    }>
  ) {
    super(message, 200);
    this.name = 'PokeApiGraphQLError';
  }
}

export type PokeapiGraphqlOptions = {
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function pokeapiGraphql<
  TData,
  TVariables = Record<string, unknown>,
>(
  request: GraphQLRequest<TVariables>,
  options?: PokeapiGraphqlOptions
): Promise<TData> {
  const response = await fetch(POKEAPI_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: request.query,
      variables: request.variables ?? null,
      operationName: request.operationName ?? null,
    }),
    signal: options?.signal,
    cache: options?.cache,
    next: options?.next,
  });

  if (response.status === 404) {
    throw new PokeApiNotFoundError('GraphQL endpoint not found');
  }

  if (!response.ok) {
    throw new PokeApiError(
      `PokeAPI GraphQL request failed: ${response.status}`,
      response.status
    );
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors && payload.errors.length > 0) {
    const message = payload.errors.map((error) => error.message).join('; ');
    throw new PokeApiGraphQLError(message, payload.errors);
  }

  if (payload.data === undefined || payload.data === null) {
    throw new PokeApiGraphQLError('GraphQL response missing data', []);
  }

  return payload.data;
}
