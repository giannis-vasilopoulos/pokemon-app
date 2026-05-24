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

export type TypeEntry = {
  pokemon: NamedResource;
};

export type TypeDetail = {
  id: number;
  name: string;
  pokemon: TypeEntry[];
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
};
