import { PokemonListPage } from '@/components/pokemon/PokemonListPage';
import { PAGE_SIZE } from '@/lib/pokeapi/constants';
import { getPokemonPage } from '@/lib/pokeapi/pokemon';
import { getAllTypes, getPokemonByType } from '@/lib/pokeapi/types-api';

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
    <PokemonListPage
      type={resolvedType}
      offset={resolvedOffset}
      initialTypes={types}
      initialListOrTypeData={listOrTypeData}
    />
  );
}
