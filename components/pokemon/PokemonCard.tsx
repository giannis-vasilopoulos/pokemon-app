'use client';

import Link from 'next/link';

import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTeamStore } from '@/stores/team-store';
import type { PokemonSummary } from '@/lib/pokeapi/types';
import { MAX_TEAM_SLOTS } from '@/lib/constants';

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
  const add = useTeamStore((state) => state.add);
  const remove = useTeamStore((state) => state.remove);
  const slots = useTeamStore((state) => state.slots);
  const isSelected = slots.includes(pokemon.name);
  const isFull = slots.length >= MAX_TEAM_SLOTS && !isSelected;

  const onToggleTeam = () => {
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
            <TypeBadge key={type} type={type} />
          ))}
        </div>
        <div className="flex items-center gap-2 pt-4">
          <Button
            size="sm"
            variant={isSelected ? 'secondary' : 'outline'}
            aria-label={`${isSelected ? 'Remove' : 'Add'} ${pokemon.name} ${isSelected ? 'from' : 'to'} team`}
            title={`${isSelected ? 'Remove' : 'Add'} ${pokemon.name} ${isSelected ? 'from' : 'to'} team`}
            onClick={onToggleTeam}
            disabled={isFull}
          >
            {isSelected
              ? `In Team (${slots.length} of ${MAX_TEAM_SLOTS})`
              : 'Add to Team'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
