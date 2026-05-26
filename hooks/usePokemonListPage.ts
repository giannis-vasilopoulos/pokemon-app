'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/lib/constants';
import {
  getPokemonListByType,
  getPokemonListPage,
} from '@/lib/pokeapi/graphql/pokemon-list';

export function usePokemonListPage(type: string | null, offset: number) {
  const listQuery = useQuery({
    queryKey: ['pokemon-list', offset],
    queryFn: () => getPokemonListPage(PAGE_SIZE, offset),
    enabled: !type,
    placeholderData: keepPreviousData,
  });

  const typeQuery = useQuery({
    queryKey: ['type-pokemon', type, offset],
    queryFn: () => getPokemonListByType(type!, PAGE_SIZE, offset),
    enabled: !!type,
    placeholderData: keepPreviousData,
  });

  const data = type ? typeQuery.data : listQuery.data;
  const query = type ? typeQuery : listQuery;
  const isLoading = query.isPending && !query.isPlaceholderData;

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrev: data?.hasPrev ?? false,
    isLoading,
    isError: query.isError,
    error: query.error,
  };
}
