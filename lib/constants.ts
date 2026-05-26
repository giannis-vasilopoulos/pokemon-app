export const POKEAPI_BASE_URL =
  process.env.NEXT_PUBLIC_POKEAPI_BASE_URL ?? 'https://pokeapi.co/api/v2';

export const POKEAPI_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_POKEAPI_GRAPHQL_URL ??
  'https://graphql.pokeapi.co/v1beta2';

export const PAGE_SIZE = 40;
export const MAX_TEAM_SLOTS = 3;
export const TEAM_QUERY_PARAM = 'pokemons';

export const POKEMON_LIST_CACHE_TAG = 'pokemon-list';
export const POKEMON_LIST_REVALIDATE_SECONDS = 3600;
