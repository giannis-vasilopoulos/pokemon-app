import { POKEMON_LIST_REVALIDATE_SECONDS } from '../constants';

import { pokeapiFetch } from './client';
import type { NamedResource, PaginatedList } from './types';

export async function getAllTypes(): Promise<PaginatedList<NamedResource>> {
  return pokeapiFetch<PaginatedList<NamedResource>>('/type', {
    next: { revalidate: POKEMON_LIST_REVALIDATE_SECONDS },
  });
}
