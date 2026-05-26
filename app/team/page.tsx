import { redirect } from 'next/navigation';

import { ShareTeamButton } from '@/components/pokemon/ShareTeamButton';
import { resolveTeamPageData } from '@/lib/team/resolve';
import { areTeamSlotsInSync, buildTeamHref } from '@/lib/team/url';
import { TeamView } from '@/components/pokemon/TeamView';

export const metadata = {
  title: 'Team',
  description: 'View your selected Pokémon team.',
};

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ pokemons?: string }>;
}) {
  const { pokemons } = await searchParams;
  const { slots, detailsByName } = await resolveTeamPageData(pokemons);

  if (pokemons !== undefined) {
    const params = new URLSearchParams({ pokemons });
    if (!areTeamSlotsInSync(params, slots)) {
      redirect(buildTeamHref(slots));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm">
            View stats for your selected Pokémon team.
          </p>
        </header>
        <ShareTeamButton />
      </div>
      <TeamView initialSlots={slots} initialDetailsByName={detailsByName} />
    </div>
  );
}
