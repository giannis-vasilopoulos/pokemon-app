import type { PokemonListItem } from './types';

export function filterPokemonByName(
  items: PokemonListItem[],
  query: string
): PokemonListItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => item.name.toLowerCase().includes(normalized));
}
