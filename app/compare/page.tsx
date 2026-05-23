import { ComparePageClient } from '@/components/pokemon/ComparePageClient';

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Compare</h1>
        <p className="text-muted-foreground text-sm">
          Side-by-side comparison of selected Pokémon.
        </p>
      </header>
      <ComparePageClient />
    </div>
  );
}
