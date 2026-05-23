import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function PokemonNotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <h2 className="text-xl font-semibold">Pokémon not found</h2>
      <Button asChild>
        <Link href="/">Back to list</Link>
      </Button>
    </div>
  );
}
