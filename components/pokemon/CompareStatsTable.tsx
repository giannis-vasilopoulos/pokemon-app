'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getWinningIndices, shouldHighlightStat } from '@/lib/compare/stats';
import {
  formatStatLabel,
  MAX_BASE_STAT,
  STAT_ORDER,
  type PokemonCompareStats,
} from '@/lib/pokeapi/mappers';
import { cn } from '@/lib/utils';

export type ComparePokemonEntry = {
  name: string;
  stats: PokemonCompareStats | null;
  isLoading: boolean;
  isError: boolean;
};

type CompareStatsTableProps = {
  pokemon: ComparePokemonEntry[];
  onRemove: (name: string) => void;
};

const HIGHLIGHT_CLASS = 'font-semibold text-green-600 dark:text-green-400';
const WINNER_BAR_CLASS = 'bg-green-600 dark:bg-green-400';

export function CompareStatsTable({
  pokemon,
  onRemove,
}: CompareStatsTableProps) {
  const statRows = [...STAT_ORDER, 'total'] as const;

  return (
    <div className="mx-0 overflow-x-auto rounded-xl border sm:px-0">
      <table className="w-max min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th
              scope="col"
              className="bg-background sticky left-0 z-10 p-3 text-left font-medium whitespace-nowrap"
            >
              Stat
            </th>
            {pokemon.map((entry) => (
              <th
                key={entry.name}
                scope="col"
                className="min-w-28 p-3 text-center font-medium"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="capitalize">{entry.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(entry.name)}
                  >
                    Remove
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statRows.map((statKey) => {
            const values = pokemon.map((entry) =>
              entry.stats ? entry.stats[statKey] : 0
            );
            const winners = getWinningIndices(values);
            const highlight = shouldHighlightStat(values);

            return (
              <tr
                key={statKey}
                className={cn(
                  'border-b last:border-0',
                  statKey === 'total' && 'bg-muted font-medium'
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    'text-muted-foreground bg-background sticky left-0 z-10 p-3 text-left whitespace-nowrap',
                    statKey === 'total' && 'bg-muted'
                  )}
                >
                  {formatStatLabel(statKey)}
                </th>
                {pokemon.map((entry, index) => {
                  const value = entry.stats?.[statKey];
                  const isWinner = highlight && winners.has(index);

                  if (value === undefined) {
                    return (
                      <td
                        key={entry.name}
                        className="text-destructive min-w-28 p-3 text-center"
                      >
                        Failed to load
                      </td>
                    );
                  }

                  return (
                    <td key={entry.name} className="min-w-28 p-3">
                      <div className="flex w-full min-w-24 flex-col items-center gap-2">
                        <span
                          className={cn(
                            'tabular-nums',
                            isWinner && HIGHLIGHT_CLASS
                          )}
                        >
                          {value}
                        </span>
                        {statKey !== 'total' ? (
                          <Progress
                            value={(value / MAX_BASE_STAT) * 100}
                            barClassName={
                              isWinner ? WINNER_BAR_CLASS : undefined
                            }
                            aria-label={`${formatStatLabel(statKey)} ${value}`}
                          />
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
