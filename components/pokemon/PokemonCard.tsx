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
  description?: string;
};

export function PokemonCard({
  pokemon,
  types = [],
  description,
}: PokemonCardProps) {
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);
  const slots = useCompareStore((state) => state.slots);
  const isSelected = slots.includes(pokemon.name);
  const isFull = slots.length >= MAX_COMPARE_SLOTS && !isSelected;

  const onToggleCompare = () => {
    if (isSelected) return remove(pokemon.name);
    return add(pokemon.name);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="capitalize">
          <Link href={`/${pokemon.name}`} className="hover:underline">
            {pokemon.name}
          </Link>
        </CardTitle>
        <CardDescription>{description || 'Pokémon'}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mt-auto flex flex-wrap gap-2">
          {types.map((type) => (
            <Badge key={type} variant="secondary" className="capitalize">
              {type}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-4">
          <Button
            size="sm"
            variant={isSelected ? 'secondary' : 'outline'}
            onClick={onToggleCompare}
            disabled={isFull}
          >
            {isSelected
              ? `In Compare (${slots.length} of ${MAX_COMPARE_SLOTS})`
              : 'Compare'}
          </Button>
          {isSelected && (
            <Button variant="link" size="sm" asChild className="h-auto p-0">
              <Link href={buildCompareHref(slots)}>Go to compare</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
