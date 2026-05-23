import { pokeapiFetch } from './client';
import { PAGE_SIZE } from './constants';
import type { NamedResource, PaginatedList } from './types';

export async function getPokemonPage(
  limit = PAGE_SIZE,
  offset = 0
): Promise<PaginatedList<NamedResource>> {
  return pokeapiFetch<PaginatedList<NamedResource>>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
}
