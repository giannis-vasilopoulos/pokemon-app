'use client';

import { useQuery } from '@tanstack/react-query';

import { getAllTypes } from '@/lib/pokeapi/types-api';

export function useTypes() {
  return useQuery({
    queryKey: ['types'],
    queryFn: getAllTypes,
  });
}
