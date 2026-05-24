import type { NamedResource } from './types';

export function filterPokemonByName(
  items: NamedResource[],
  query: string
): NamedResource[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => item.name.toLowerCase().includes(normalized));
}
