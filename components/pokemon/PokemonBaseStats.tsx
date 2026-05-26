'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  formatStatLabel,
  MAX_BASE_STAT,
  STAT_ORDER,
  type PokemonTeamStats,
} from '@/lib/pokeapi/mappers';

type PokemonBaseStatsProps = {
  name?: string;
  stats: PokemonTeamStats;
};

const CHART_COLOR = 'var(--chart-1)';

export function PokemonBaseStats({
  name = 'stats',
  stats,
}: PokemonBaseStatsProps) {
  const chartConfig = {
    [name]: {
      label: name,
      color: CHART_COLOR,
    },
  } satisfies ChartConfig;

  const data = STAT_ORDER.map((statKey) => ({
    stat: formatStatLabel(statKey),
    value: stats[statKey],
  }));

  return (
    <section aria-label="Base stats" className="space-y-4">
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
      </dl>

      <ChartContainer
        config={chartConfig}
        className="mx-auto min-h-[300px] w-full"
      >
        <RadarChart data={data} outerRadius="80%">
          <ChartTooltip content={<ChartTooltipContent />} />
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <Radar
            name={name}
            dataKey="value"
            stroke={CHART_COLOR}
            fill={CHART_COLOR}
            fillOpacity={0.2}
          />
        </RadarChart>
      </ChartContainer>
    </section>
  );
}
