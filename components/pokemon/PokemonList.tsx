'use client';

import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toPokemonSummary } from '@/lib/pokeapi/mappers';
import type { NamedResource } from '@/lib/pokeapi/types';

type PokemonListProps = {
  items: NamedResource[];
  isLoading: boolean;
  isFiltered?: boolean;
};

export function PokemonList({
  items,
  isLoading,
  isFiltered = false,
}: PokemonListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {isFiltered ? 'No Pokémon match your search.' : 'No Pokémon found.'}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.name}>
          <PokemonCard pokemon={toPokemonSummary(item)} />
        </li>
      ))}
    </ul>
  );
}
