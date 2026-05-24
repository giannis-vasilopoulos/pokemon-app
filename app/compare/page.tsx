import { redirect } from 'next/navigation';

import { ShareTeamButton } from '@/components/pokemon/ShareTeamButton';
import { resolveComparePageData } from '@/lib/compare/resolve';
import { areCompareSlotsInSync, buildCompareHref } from '@/lib/compare/url';
import { CompareView } from '@/components/pokemon/CompareView';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ pokemons?: string }>;
}) {
  const { pokemons } = await searchParams;
  const { slots, detailsByName } = await resolveComparePageData(pokemons);

  if (pokemons !== undefined) {
    const params = new URLSearchParams({ pokemons });
    if (!areCompareSlotsInSync(params, slots)) {
      redirect(buildCompareHref(slots));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Compare</h1>
          <p className="text-muted-foreground text-sm">
            Side-by-side comparison of selected Pokémon.
          </p>
        </header>
        <ShareTeamButton />
      </div>
      <CompareView initialSlots={slots} initialDetailsByName={detailsByName} />
    </div>
  );
}
