import { Progress } from '@/components/ui/progress';
import {
  formatStatLabel,
  MAX_BASE_STAT,
  STAT_ORDER,
  type PokemonTeamStats,
} from '@/lib/pokeapi/mappers';

type PokemonBaseStatsProps = {
  stats: PokemonTeamStats;
};

export function PokemonBaseStats({ stats }: PokemonBaseStatsProps) {
  return (
    <section aria-label="Base stats" className="space-y-3">
      <h3 className="text-sm font-medium">Base stats</h3>
      <dl className="space-y-3">
        {STAT_ORDER.map((statKey) => {
          const value = stats[statKey];
          const label = formatStatLabel(statKey);

          return (
            <div
              key={statKey}
              className="grid grid-cols-[7rem_2.5rem_1fr] items-center gap-3"
            >
              <dt className="text-muted-foreground text-sm">{label}</dt>
              <dd className="text-right text-sm tabular-nums">{value}</dd>
              <dd>
                <Progress
                  value={(value / MAX_BASE_STAT) * 100}
                  aria-label={`${label} ${value}`}
                />
              </dd>
            </div>
          );
        })}
        <div className="bg-muted grid grid-cols-[7rem_2.5rem_1fr] items-center gap-3 rounded-md px-2 py-2 font-medium">
          <dt className="text-sm">{formatStatLabel('total')}</dt>
          <dd className="text-right text-sm tabular-nums">{stats.total}</dd>
          <dd aria-hidden="true" />
        </div>
      </dl>
    </section>
  );
}
