import { PokeApiNotFoundError } from '@/lib/pokeapi/client';
import { getPokemonByName } from '@/lib/pokeapi/pokemon';
import type { PokemonDetail } from '@/lib/pokeapi/types';

import { sanitizeCompareParam } from './url';

export type ComparePageData = {
  slots: string[];
  detailsByName: Record<string, PokemonDetail>;
};

export async function resolveComparePageData(
  rawPokemons: string | undefined
): Promise<ComparePageData> {
  const sanitized = sanitizeCompareParam(rawPokemons);

  if (sanitized.length === 0) return { slots: [], detailsByName: {} };

  const results = await Promise.all(
    sanitized.map(async (name) => {
      try {
        const detail = await getPokemonByName(name);
        return { name, detail, valid: true as const };
      } catch (error) {
        if (error instanceof PokeApiNotFoundError) {
          return { name, valid: false as const };
        }
        throw error;
      }
    })
  );

  const slots: string[] = [];
  const detailsByName: Record<string, PokemonDetail> = {};

  for (const result of results) {
    if (!result.valid) continue;
    slots.push(result.name);
    detailsByName[result.name] = result.detail;
  }

  return { slots, detailsByName };
}
