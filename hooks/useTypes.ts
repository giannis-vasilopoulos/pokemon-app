'use client';

import { useQuery } from '@tanstack/react-query';

import { getAllTypes } from '@/lib/pokeapi/types-api';
import type { PaginatedList, NamedResource } from '@/lib/pokeapi/types';

export function useTypes(initialData: PaginatedList<NamedResource>) {
  return useQuery({
    queryKey: ['types'],
    queryFn: getAllTypes,
    initialData,
  });
}
