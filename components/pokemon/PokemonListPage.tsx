'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PaginationControls } from '@/components/pokemon/PaginationControls';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { SearchFilter } from '@/components/pokemon/SearchFilter';
import { TypeFilter } from '@/components/pokemon/TypeFilter';
import { usePokemonListPage } from '@/hooks/usePokemonListPage';
import { PAGE_SIZE } from '@/lib/constants';
import { buildListHref, parseListSearchParams } from '@/lib/list/url';
import { filterPokemonByName } from '@/lib/pokeapi/filter';
import type { NamedResource, PaginatedList } from '@/lib/pokeapi/types';

export function PokemonListPage({
  initialTypes,
}: {
  initialTypes: PaginatedList<NamedResource>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { type, offset } = parseListSearchParams(searchParams);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, total, hasNext, hasPrev, isLoading, isError } =
    usePokemonListPage(type, offset);
  const filteredItems = useMemo(
    () => filterPokemonByName(items, searchQuery),
    [items, searchQuery]
  );

  const updateParams = useCallback(
    (nextType: string | null, nextOffset: number) => {
      router.replace(buildListHref(nextType, nextOffset), { scroll: false });
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
