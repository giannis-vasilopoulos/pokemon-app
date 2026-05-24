'use client';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/lib/constants';
import {
  getPokemonListByType,
  getPokemonListPage,
} from '@/lib/pokeapi/graphql/pokemon-list';
import type { PokemonListPageData } from '@/lib/pokeapi/types';

export function usePokemonListPage(
  type: string | null,
  offset: number,
  initialListData: PokemonListPageData
) {
  const listQuery = useQuery({
    queryKey: ['pokemon-list', offset],
    queryFn: () => getPokemonListPage(PAGE_SIZE, offset),
    enabled: !type,
    initialData: !type ? initialListData : undefined,
  });

  const typeQuery = useQuery({
    queryKey: ['type-pokemon', type, offset],
    queryFn: () => getPokemonListByType(type!, PAGE_SIZE, offset),
    enabled: !!type,
    initialData: type ? initialListData : undefined,
  });

  const data = type ? typeQuery.data : listQuery.data;
  const query = type ? typeQuery : listQuery;

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrev: data?.hasPrev ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
