'use client';

import { useQueries } from '@tanstack/react-query';

import { toPokemonCompareStats } from '@/lib/pokeapi/mappers';
import { getPokemonByName } from '@/lib/pokeapi/pokemon';
import type { PokemonDetail } from '@/lib/pokeapi/types';

export function useComparePokemonDetails(
  slots: string[],
  initialDetailsByName: Record<string, PokemonDetail> = {}
) {
  const needsFetch = slots.filter((name) => !initialDetailsByName[name]);

  const queries = useQueries({
    queries: needsFetch.map((name) => ({
      queryKey: ['pokemon', name],
      queryFn: () => getPokemonByName(name),
    })),
  });

  const queryByName = new Map(
    needsFetch.map((name, index) => [name, queries[index]])
  );

  const pokemon = slots.map((name) => {
    const fromProps = initialDetailsByName[name];
    if (fromProps) {
      return {
        name,
        stats: toPokemonCompareStats(fromProps.stats),
        isLoading: false,
        isError: false,
      };
    }

    const query = queryByName.get(name);
    return {
      name,
      stats: query?.data ? toPokemonCompareStats(query.data.stats) : null,
      isLoading: query?.isLoading ?? true,
      isError: query?.isError ?? false,
    };
  });

  return {
    pokemon,
    isLoading: pokemon.some((entry) => entry.isLoading),
  };
}
