'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CompareRadarChart } from '@/components/pokemon/CompareRadarChart';
import { CompareStatsTable } from '@/components/pokemon/CompareStatsTable';
import { useComparePokemonDetails } from '@/hooks/useComparePokemonDetails';
import { useCompareStore } from '@/stores/compare-store';

export function CompareTable() {
  const slots = useCompareStore((state) => state.slots);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);
  const { pokemon, isLoading } = useComparePokemonDetails();

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

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <CompareStatsTable pokemon={pokemon} onRemove={remove} />
      )}

      {isLoading ? (
        <Skeleton className="h-[300px] w-full rounded-xl" />
      ) : (
        <CompareRadarChart pokemon={pokemon} />
      )}
    </div>
  );
}
