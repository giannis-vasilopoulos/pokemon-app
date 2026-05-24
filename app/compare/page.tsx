import { Suspense } from 'react';

import { ComparePageClient } from '@/components/pokemon/ComparePageClient';
import { ShareTeamButton } from '@/components/pokemon/ShareTeamButton';

export default function ComparePage() {
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
      <Suspense fallback={null}>
        <ComparePageClient />
      </Suspense>
    </div>
  );
}
