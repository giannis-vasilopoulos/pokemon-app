'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PaginationControls } from '@/components/pokemon/PaginationControls';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { SearchFilter } from '@/components/pokemon/SearchFilter';
import { TypeFilter } from '@/components/pokemon/TypeFilter';
import { PAGE_SIZE } from '@/lib/constants';
import { filterPokemonByName } from '@/lib/pokeapi/filter';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { items, total, hasNext, hasPrev, isLoading, isError } =
    usePokemonListPage(type, offset, initialListOrTypeData);
  const filteredItems = useMemo(
    () => filterPokemonByName(items, searchQuery),
    [items, searchQuery]
  );

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
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <TypeFilter
            value={type}
            onChange={(nextType) => {
              setSearchQuery('');
              updateParams(nextType, 0);
            }}
            initialTypes={initialTypes}
          />
          <SearchFilter value={searchQuery} onChange={setSearchQuery} />
        </div>
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
        <PokemonList
          items={filteredItems}
          isLoading={isLoading}
          isFiltered={searchQuery.trim().length > 0}
        />
      )}
    </>
  );
}
