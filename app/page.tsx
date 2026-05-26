import { PokemonListPage } from '@/components/pokemon/PokemonListPage';
import { getAllTypes } from '@/lib/pokeapi/types-api';

export const metadata = {
  title: 'Pokémon Browser',
  description: 'Browse, filter by type, and compare Pokémon.',
};

export default async function HomePage() {
  const types = await getAllTypes();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Pokémon</h1>
        <p className="text-muted-foreground text-sm">
          Browse, filter by type, and compare Pokémon.
        </p>
      </header>
      <PokemonListPage initialTypes={types} />
    </div>
  );
}
