import { PokeApiNotFoundError, pokeapiFetch } from './client';
import type { PokemonDetail } from './types';

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
