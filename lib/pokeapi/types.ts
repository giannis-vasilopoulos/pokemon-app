export type NamedResource = {
  name: string;
  url: string;
};

export type PaginatedList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PokemonListItem = {
  name: string;
  description: string;
  types: string[];
};

export type PokemonListPageData = {
  items: PokemonListItem[];
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PokemonSummary = {
  name: string;
  url: string;
};

export type PokemonStatEntry = {
  base_stat: number;
  stat: { name: string };
};

export type PokemonDetail = {
  name: string;
  sprites: { front_default: string | null };
  types: Array<{ type: { name: string } }>;
  stats: PokemonStatEntry[];
  height: number;
  weight: number;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
};
