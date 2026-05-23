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
