import { PAGE_SIZE } from '../constants';

import { PokeApiNotFoundError, pokeapiFetch } from './client';
import type { NamedResource, PaginatedList, PokemonDetail } from './types';

export async function getPokemonPage(
  limit = PAGE_SIZE,
  offset = 0
): Promise<PaginatedList<NamedResource>> {
  return pokeapiFetch<PaginatedList<NamedResource>>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
}

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  return pokeapiFetch<PokemonDetail>(`/pokemon/${name}`);
}

export async function pokemonExists(name: string): Promise<boolean> {
  try {
    await getPokemonByName(name);
    return true;
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) return false;
    throw error;
  }
}
