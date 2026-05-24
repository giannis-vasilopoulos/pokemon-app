export type GraphQLRequest<V = Record<string, unknown>> = {
  query: string;
  variables?: V;
  operationName?: string;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};
