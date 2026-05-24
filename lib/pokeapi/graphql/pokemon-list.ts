import { toPokemonListPageData } from '../mappers';
import {
  POKEMON_LIST_CACHE_TAG,
  POKEMON_LIST_REVALIDATE_SECONDS,
} from '../../constants';
import type { PokemonListPageData } from '../types';

import { pokeapiGraphql } from './client';
import type { GraphQLPokemonListResponse } from './types';

const pokemonListFetchOptions = {
  next: {
    revalidate: POKEMON_LIST_REVALIDATE_SECONDS,
    tags: [POKEMON_LIST_CACHE_TAG],
  },
};

const POKEMON_LIST_FIELDS = `
  fragment PokemonListFields on pokemon {
    name
    pokemontypes {
      type {
        name
      }
    }
    pokemonspecy {
      pokemonspeciesflavortexts(
        limit: 1
        where: { language: { name: { _eq: "en" } } }
      ) {
        flavor_text
      }
    }
  }
`;

const POKEMON_LIST_PAGE_QUERY = `
  ${POKEMON_LIST_FIELDS}
  query PokemonListPage($limit: Int!, $offset: Int!) {
    pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      ...PokemonListFields
    }
    pokemon_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const POKEMON_LIST_BY_TYPE_QUERY = `
  ${POKEMON_LIST_FIELDS}
  query PokemonListByType($type: String!, $limit: Int!, $offset: Int!) {
    pokemon(
      where: { pokemontypes: { type: { name: { _eq: $type } } } }
      limit: $limit
      offset: $offset
      order_by: { id: asc }
    ) {
      ...PokemonListFields
    }
    pokemon_aggregate(
      where: { pokemontypes: { type: { name: { _eq: $type } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export async function getPokemonListPage(
  limit: number,
  offset: number
): Promise<PokemonListPageData> {
  const data = await pokeapiGraphql<
    GraphQLPokemonListResponse,
    { limit: number; offset: number }
  >(
    {
      query: POKEMON_LIST_PAGE_QUERY,
      variables: { limit, offset },
      operationName: 'PokemonListPage',
    },
    pokemonListFetchOptions
  );

  return toPokemonListPageData(data, limit, offset);
}

export async function getPokemonListByType(
  typeName: string,
  limit: number,
  offset: number
): Promise<PokemonListPageData> {
  const data = await pokeapiGraphql<
    GraphQLPokemonListResponse,
    { type: string; limit: number; offset: number }
  >(
    {
      query: POKEMON_LIST_BY_TYPE_QUERY,
      variables: { type: typeName, limit, offset },
      operationName: 'PokemonListByType',
    },
    pokemonListFetchOptions
  );

  return toPokemonListPageData(data, limit, offset);
}
