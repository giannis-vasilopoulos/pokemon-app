export type GraphQLRequest<V = Record<string, unknown>> = {
  query: string;
  variables?: V;
  operationName?: string;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};

export type GraphQLPokemonListRow = {
  name: string;
  pokemontypes: Array<{ type: { name: string } }>;
  pokemonspecy: {
    pokemonspeciesflavortexts: Array<{ flavor_text: string }>;
  } | null;
};

export type GraphQLPokemonListResponse = {
  pokemon: GraphQLPokemonListRow[];
  pokemon_aggregate: { aggregate: { count: number } };
};
