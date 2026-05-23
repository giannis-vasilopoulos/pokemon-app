import { Suspense } from 'react';
import { PokemonListPage } from '@/components/pokemon/PokemonListPage';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <PokemonListPage />
    </Suspense>
  );
}
