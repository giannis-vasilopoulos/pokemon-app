import { pokeapiFetch } from './client';
import type { NamedResource, PaginatedList } from './types';

export async function getAllTypes(): Promise<PaginatedList<NamedResource>> {
  return pokeapiFetch<PaginatedList<NamedResource>>('/type', {
    next: {
      revalidate: 3600,
      tags: ['types'],
    },
  });
}
