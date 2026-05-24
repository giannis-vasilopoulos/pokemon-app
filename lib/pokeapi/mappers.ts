import type {
  GraphQLPokemonListResponse,
  GraphQLPokemonListRow,
} from './graphql/types';
import type {
  PokemonListItem,
  PokemonListPageData,
  PokemonStatEntry,
} from './types';

export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

export type PokemonStatName = (typeof STAT_ORDER)[number];

export type PokemonCompareStats = Record<PokemonStatName, number> & {
  total: number;
};

export const MAX_BASE_STAT = 255;

export function normalizeFlavorText(text: string): string {
  return text
    .replace(/[\f\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toPokemonListItem(row: GraphQLPokemonListRow): PokemonListItem {
  return {
    name: row.name,
    types: row.pokemontypes.map((entry) => entry.type.name),
    description: normalizeFlavorText(
      row.pokemonspecy?.pokemonspeciesflavortexts[0]?.flavor_text ?? ''
    ),
  };
}

export function toPokemonListPageData(
  raw: GraphQLPokemonListResponse,
  limit: number,
  offset: number
): PokemonListPageData {
  const total = raw.pokemon_aggregate.aggregate.count;

  return {
    items: raw.pokemon.map(toPokemonListItem),
    total,
    hasNext: offset + limit < total,
    hasPrev: offset > 0,
  };
}

export function formatStatLabel(name: PokemonStatName | 'total'): string {
  if (name === 'total') return 'Total';
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function toPokemonCompareStats(
  stats: PokemonStatEntry[]
): PokemonCompareStats {
  const byName = Object.fromEntries(
    stats.map((entry) => [entry.stat.name, entry.base_stat])
  ) as Partial<Record<PokemonStatName, number>>;

  const values = STAT_ORDER.map((key) => byName[key] ?? 0);

  return {
    hp: values[0],
    attack: values[1],
    defense: values[2],
    'special-attack': values[3],
    'special-defense': values[4],
    speed: values[5],
    total: values.reduce((sum, value) => sum + value, 0),
  };
}
