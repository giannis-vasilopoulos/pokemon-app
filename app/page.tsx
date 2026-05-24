import { PokemonListPage } from '@/components/pokemon/PokemonListPage';
import { PAGE_SIZE } from '@/lib/constants';
import { getPokemonPage } from '@/lib/pokeapi/pokemon';
import { getAllTypes, getPokemonByType } from '@/lib/pokeapi/types-api';

export const metadata = {
  title: 'Pokémon Browser',
  description: 'Browse, filter by type, and compare Pokémon.',
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type: string; offset: string }>;
}) {
  const { type, offset } = await searchParams;
  const resolvedType = type ?? null;
  const resolvedOffset = Number(offset ?? '0');

  const [types, listOrTypeData] = await Promise.all([
    getAllTypes(),
    resolvedType
      ? getPokemonByType(resolvedType)
      : getPokemonPage(PAGE_SIZE, resolvedOffset),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Pokémon</h1>
        <p className="text-muted-foreground text-sm">
          Browse, filter by type, and compare Pokémon.
        </p>
      </header>
      <PokemonListPage
        type={resolvedType}
        offset={resolvedOffset}
        initialTypes={types}
        initialListOrTypeData={listOrTypeData}
      />
    </div>
  );
}
