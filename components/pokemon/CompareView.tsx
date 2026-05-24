'use client';

import { Button } from '@/components/ui/button';
import { CompareRadarChart } from '@/components/pokemon/CompareRadarChart';
import { CompareStatsTable } from '@/components/pokemon/CompareStatsTable';
import { useComparePokemonDetails } from '@/hooks/useComparePokemonDetails';
import { useHydrated } from '@/hooks/useHydrated';
import type { PokemonDetail } from '@/lib/pokeapi/types';
import { useCompareStore } from '@/stores/compare-store';
import { useCompareUrlSync } from '@/hooks/useCompareUrlSync';

type CompareTableProps = {
  initialSlots: string[];
  initialDetailsByName: Record<string, PokemonDetail>;
};

export function CompareView({
  initialSlots,
  initialDetailsByName,
}: CompareTableProps) {
  useCompareUrlSync({ initialSlots });
  const hydrated = useHydrated();

  const storeSlots = useCompareStore((state) => state.slots);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const slots = hydrated ? storeSlots : initialSlots;
  const { pokemon } = useComparePokemonDetails(slots, initialDetailsByName);

  if (slots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Add Pokémon from the list to compare up to 3.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">{slots.length} selected</p>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>

      <CompareStatsTable pokemon={pokemon} onRemove={remove} />
      <CompareRadarChart pokemon={pokemon} />
    </div>
  );
}
