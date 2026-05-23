'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { PaginationControls } from '@/components/pokemon/PaginationControls';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { TypeFilter } from '@/components/pokemon/TypeFilter';
import { PAGE_SIZE } from '@/lib/pokeapi/constants';
import { usePokemonListPage } from '@/hooks/usePokemonListPage';
import type {
  NamedResource,
  PaginatedList,
  TypeDetail,
} from '@/lib/pokeapi/types';

export function PokemonListPage({
  type,
  offset,
  initialTypes,
  initialListOrTypeData,
}: {
  type: string | null;
  offset: number;
  initialTypes: PaginatedList<NamedResource>;
  initialListOrTypeData: PaginatedList<NamedResource> | TypeDetail;
}) {
  const router = useRouter();
  const { items, total, hasNext, hasPrev, isLoading, isError } =
    usePokemonListPage(type, offset, initialListOrTypeData);

  const updateParams = useCallback(
    (nextType: string | null, nextOffset: number) => {
      const params = new URLSearchParams();
      if (nextType) params.set('type', nextType);
      if (nextOffset > 0) params.set('offset', String(nextOffset));
      const query = params.toString();
      router.push(query ? `/?${query}` : '/');
    },
    [router]
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Pokémon</h1>
        <p className="text-muted-foreground text-sm">
          Browse, filter by type, and compare Pokémon.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <TypeFilter
          value={type}
          onChange={(nextType) => updateParams(nextType, 0)}
          initialTypes={initialTypes}
        />
        <PaginationControls
          offset={offset}
          pageSize={PAGE_SIZE}
          total={total}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageChange={(nextOffset) => updateParams(type, nextOffset)}
        />
      </div>

      {isError ? (
        <p className="text-destructive text-sm">Failed to load Pokémon.</p>
      ) : (
        <PokemonList items={items} isLoading={isLoading} />
      )}
    </div>
  );
}
