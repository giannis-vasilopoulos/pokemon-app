import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pokeapiFetch } from '@/lib/pokeapi/client';
import { POKEMON_CACHE_TAG, POKEMON_REVALIDATE_SECONDS } from '@/lib/constants';

type PokemonDetail = {
  name: string;
  sprites: { front_default: string | null };
  types: Array<{ type: { name: string } }>;
};

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  let pokemon: PokemonDetail;
  try {
    pokemon = await pokeapiFetch<PokemonDetail>(`/pokemon/${name}`, {
      next: {
        revalidate: POKEMON_REVALIDATE_SECONDS,
        tags: [POKEMON_CACHE_TAG],
      },
    });
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">← Back to list</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl capitalize">{pokemon.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!!pokemon.sprites.front_default && (
            <Image
              width={96}
              height={96}
              priority
              loading="eager"
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-24 w-24 object-contain"
              unoptimized
            />
          )}
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
