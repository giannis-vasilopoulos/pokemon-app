import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pokeapiFetch } from '@/lib/pokeapi/client';

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
    pokemon = await pokeapiFetch<PokemonDetail>(`/pokemon/${name}`);
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
          {pokemon.sprites.front_default ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-32 w-32 object-contain"
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map(({ type }) => (
              <Badge key={type.name} className="capitalize">
                {type.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
