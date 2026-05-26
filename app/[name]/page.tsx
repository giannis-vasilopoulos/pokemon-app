import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

import { PokemonAttributes } from '@/components/pokemon/PokemonAttributes';
import { PokemonBaseStats } from '@/components/pokemon/PokemonBaseStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toPokemonDetailView } from '@/lib/pokeapi/mappers';
import { getPokemonByName } from '@/lib/pokeapi/pokemon';
import { PokeApiNotFoundError } from '@/lib/pokeapi/client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `${name} - Pokemon`,
    description: `Information about the Pokemon ${name}`,
  };
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  let pokemon;
  try {
    const raw = await getPokemonByName(name);
    pokemon = toPokemonDetailView(raw);
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) notFound();
    throw error;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Thing',
            name: pokemon.name,
            image: pokemon.sprite,
          }),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">← Back to list</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl capitalize">
              {pokemon.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!!pokemon.sprite && (
              <Image
                width={96}
                height={96}
                priority
                loading="eager"
                src={pokemon.sprite}
                alt={pokemon.name}
                className="h-24 w-24 object-contain"
                unoptimized
              />
            )}
            <PokemonAttributes
              types={pokemon.types}
              height={pokemon.height}
              weight={pokemon.weight}
              abilities={pokemon.abilities}
            />
            <PokemonBaseStats stats={pokemon.stats} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
