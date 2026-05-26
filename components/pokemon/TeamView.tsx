'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { TeamRadarChart } from '@/components/pokemon/TeamRadarChart';
import { TeamStatsTable } from '@/components/pokemon/TeamStatsTable';
import { useTeamPokemonDetails } from '@/hooks/useTeamPokemonDetails';
import type { PokemonDetail } from '@/lib/pokeapi/types';
import { useTeamStore } from '@/stores/team-store';
import { buildTeamHref } from '@/lib/team/url';
import { useHydrated } from '@/hooks/useHydrated';

type TeamViewProps = {
  initialSlots: string[];
  initialDetailsByName: Record<string, PokemonDetail>;
};

export function TeamView({
  initialSlots,
  initialDetailsByName,
}: TeamViewProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialSlots.length > 0) {
      useTeamStore.setState({ slots: initialSlots });
      initialized.current = true;
    }
  }, [initialSlots]);

  const storeSlots = useTeamStore((state) => state.slots);
  const remove = useTeamStore((state) => state.remove);
  const clear = useTeamStore((state) => state.clear);

  const slots = hydrated ? storeSlots : initialSlots;
  const { pokemon } = useTeamPokemonDetails(slots, initialDetailsByName);

  const handleRemove = (name: string) => {
    remove(name);
    const nextSlots = useTeamStore.getState().slots;
    router.replace(buildTeamHref(nextSlots), { scroll: false });
  };

  const handleClear = () => {
    clear();
    router.replace(buildTeamHref([]), { scroll: false });
  };

  if (slots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Add Pokémon from the list to build your team (up to 3).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">{slots.length} selected</p>
        <Button variant="outline" size="sm" onClick={handleClear}>
          Clear all
        </Button>
      </div>

      <TeamStatsTable pokemon={pokemon} onRemove={handleRemove} />
      <TeamRadarChart pokemon={pokemon} />
    </div>
  );
}
