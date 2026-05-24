'use client';

import { useQueries } from '@tanstack/react-query';

import { toPokemonCompareStats } from '@/lib/pokeapi/mappers';
import { getPokemonByName } from '@/lib/pokeapi/pokemon';
import { useCompareStore } from '@/stores/compare-store';

export function useComparePokemonDetails() {
  const slots = useCompareStore((state) => state.slots);

  const queries = useQueries({
    queries: slots.map((name) => ({
      queryKey: ['pokemon', name],
      queryFn: () => getPokemonByName(name),
    })),
  });

  const pokemon = queries.map((query, index) => ({
    name: slots[index],
    stats: query.data ? toPokemonCompareStats(query.data.stats) : null,
    isLoading: query.isLoading,
    isError: query.isError,
  }));

  return {
    pokemon,
    isLoading: queries.some((query) => query.isLoading),
  };
}
