import { describe, expect, it } from 'vitest';

import { PokeApiError, PokeApiNotFoundError } from '../../client';
import { PokeApiGraphQLError, pokeapiGraphql } from '../client';

const TEST_QUERY = `
  query TestPokemonPage($limit: Int!, $offset: Int!) {
    pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      name
    }
    pokemon_aggregate {
      aggregate { count }
    }
  }
`;

type TestPokemonPageData = {
  pokemon: Array<{ name: string }>;
  pokemon_aggregate: { aggregate: { count: number } };
};

describe('pokeapiGraphql', () => {
  it('returns parsed data on success', async () => {
    const data = await pokeapiGraphql<
      TestPokemonPageData,
      { limit: number; offset: number }
    >({
      query: TEST_QUERY,
      variables: { limit: 2, offset: 0 },
      operationName: 'TestPokemonPage',
    });

    expect(data.pokemon).toHaveLength(2);
    expect(data.pokemon[0].name).toBe('bulbasaur');
    expect(data.pokemon_aggregate.aggregate.count).toBe(1302);
  });

  it('throws PokeApiGraphQLError when response has errors', async () => {
    await expect(
      pokeapiGraphql({
        query: TEST_QUERY,
        operationName: 'TestGraphQLError',
      })
    ).rejects.toBeInstanceOf(PokeApiGraphQLError);
  });

  it('throws PokeApiGraphQLError when response is missing data', async () => {
    await expect(
      pokeapiGraphql({
        query: TEST_QUERY,
        operationName: 'TestMissingData',
      })
    ).rejects.toBeInstanceOf(PokeApiGraphQLError);
  });

  it('throws PokeApiNotFoundError on 404', async () => {
    await expect(
      pokeapiGraphql({
        query: TEST_QUERY,
        operationName: 'TestNotFound',
      })
    ).rejects.toBeInstanceOf(PokeApiNotFoundError);
  });

  it('throws PokeApiError on 5xx', async () => {
    await expect(
      pokeapiGraphql({
        query: TEST_QUERY,
        operationName: 'TestBroken',
      })
    ).rejects.toBeInstanceOf(PokeApiError);
  });
});
