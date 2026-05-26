import { POKEMON_CACHE_TAG, POKEMON_REVALIDATE_SECONDS } from '../constants';

import { PokeApiNotFoundError, pokeapiFetch } from './client';
import type { PokemonDetail } from './types';

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  return pokeapiFetch<PokemonDetail>(`/pokemon/${name}`, {
    next: {
      revalidate: POKEMON_REVALIDATE_SECONDS,
      tags: [POKEMON_CACHE_TAG],
    },
  });
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
