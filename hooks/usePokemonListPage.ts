'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/lib/pokeapi/constants';
import { paginateList } from '@/lib/pokeapi/pagination';
import { getPokemonPage } from '@/lib/pokeapi/pokemon';
import { getPokemonByType } from '@/lib/pokeapi/types-api';
import type {
  NamedResource,
  TypeDetail,
  PaginatedList,
} from '@/lib/pokeapi/types';

export function usePokemonListPage(
  type: string | null,
  offset: number,
  initialListOrTypeData: PaginatedList<NamedResource> | TypeDetail
) {
  const listQuery = useQuery({
    queryKey: ['pokemon-list', offset],
    queryFn: () => getPokemonPage(PAGE_SIZE, offset),
    enabled: !type,
    initialData: !type
      ? (initialListOrTypeData as PaginatedList<NamedResource>)
      : undefined,
  });

  const typeQuery = useQuery({
    queryKey: ['type-pokemon', type],
    queryFn: () => getPokemonByType(type!),
    enabled: !!type,
    initialData: type ? (initialListOrTypeData as TypeDetail) : undefined,
  });

  const typePage = useMemo(() => {
    if (!type || !typeQuery.data) return null;

    const names: NamedResource[] = typeQuery.data.pokemon.map((entry) => ({
      name: entry.pokemon.name,
      url: entry.pokemon.url,
    }));

    return paginateList(names, offset, PAGE_SIZE);
  }, [type, typeQuery.data, offset]);

  if (type) {
    return {
      items: typePage?.items ?? [],
      total: typePage?.total ?? 0,
      hasNext: typePage?.hasNext ?? false,
      hasPrev: typePage?.hasPrev ?? false,
      isLoading: typeQuery.isLoading,
      isError: typeQuery.isError,
      error: typeQuery.error,
    };
  }

  return {
    items: listQuery.data?.results ?? [],
    total: listQuery.data?.count ?? 0,
    hasNext: Boolean(listQuery.data?.next),
    hasPrev: Boolean(listQuery.data?.previous),
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
  };
}
