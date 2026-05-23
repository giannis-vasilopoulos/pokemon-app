'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCompareStore } from '@/stores/compare-store';
import type { PokemonSummary } from '@/lib/pokeapi/types';

type PokemonCardProps = {
  pokemon: PokemonSummary;
  types?: string[];
};

export function PokemonCard({ pokemon, types = [] }: PokemonCardProps) {
  const add = useCompareStore((state) => state.add);
  const slots = useCompareStore((state) => state.slots);
  const isSelected = slots.includes(pokemon.name);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">
          <Link href={`/${pokemon.name}`} className="hover:underline">
            {pokemon.name}
          </Link>
        </CardTitle>
        <CardDescription>Pokémon</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        {types.map((type) => (
          <Badge key={type} variant="secondary" className="capitalize">
            {type}
          </Badge>
        ))}
        <Button
          size="sm"
          variant={isSelected ? 'secondary' : 'outline'}
          onClick={() => add(pokemon.name)}
          disabled={isSelected}
        >
          {isSelected ? 'In compare' : 'Compare'}
        </Button>
      </CardContent>
    </Card>
  );
}
