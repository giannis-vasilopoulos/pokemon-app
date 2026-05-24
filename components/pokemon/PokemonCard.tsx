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
import { buildCompareHref } from '@/lib/compare/url';
import { useCompareStore } from '@/stores/compare-store';
import type { PokemonSummary } from '@/lib/pokeapi/types';
import { MAX_COMPARE_SLOTS } from '@/lib/constants';

type PokemonCardProps = {
  pokemon: PokemonSummary;
  types?: string[];
};

export function PokemonCard({ pokemon, types = [] }: PokemonCardProps) {
  const add = useCompareStore((state) => state.add);
  const slots = useCompareStore((state) => state.slots);
  const isSelected = slots.includes(pokemon.name);
  const isFull = slots.length >= MAX_COMPARE_SLOTS && !isSelected;

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
          disabled={isSelected || isFull}
        >
          {isSelected ? 'In compare' : 'Compare'}
        </Button>
        {isSelected && slots.length === 1 && (
          <p className="text-muted-foreground w-full text-sm">
            Choose one more to compare.
          </p>
        )}
        {isSelected && slots.length >= 2 && (
          <Button variant="link" size="sm" asChild className="h-auto p-0">
            <Link href={buildCompareHref(slots)}>Go to compare</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
