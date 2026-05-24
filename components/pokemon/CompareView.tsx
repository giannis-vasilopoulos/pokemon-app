'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { CompareRadarChart } from '@/components/pokemon/CompareRadarChart';
import { CompareStatsTable } from '@/components/pokemon/CompareStatsTable';
import { useComparePokemonDetails } from '@/hooks/useComparePokemonDetails';
import type { PokemonDetail } from '@/lib/pokeapi/types';
import { useCompareStore } from '@/stores/compare-store';
import { buildCompareHref } from '@/lib/compare/url';
import { useHydrated } from '@/hooks/useHydrated';

type CompareTableProps = {
  initialSlots: string[];
  initialDetailsByName: Record<string, PokemonDetail>;
};

export function CompareView({
  initialSlots,
  initialDetailsByName,
}: CompareTableProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialSlots.length > 0) {
      useCompareStore.setState({ slots: initialSlots });
      initialized.current = true;
    }
  }, [initialSlots]);

  const storeSlots = useCompareStore((state) => state.slots);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const slots = hydrated ? storeSlots : initialSlots;
  const { pokemon } = useComparePokemonDetails(slots, initialDetailsByName);

  const handleRemove = (name: string) => {
    remove(name);
    const nextSlots = useCompareStore.getState().slots;
    router.replace(buildCompareHref(nextSlots), { scroll: false });
  };

  const handleClear = () => {
    clear();
    router.replace(buildCompareHref([]), { scroll: false });
  };

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
        <Button variant="outline" size="sm" onClick={handleClear}>
          Clear all
        </Button>
      </div>

      <CompareStatsTable pokemon={pokemon} onRemove={handleRemove} />
      <CompareRadarChart pokemon={pokemon} />
    </div>
  );
}
