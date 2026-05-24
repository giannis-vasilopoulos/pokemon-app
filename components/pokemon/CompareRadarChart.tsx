'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  formatStatLabel,
  STAT_ORDER,
  type PokemonCompareStats,
} from '@/lib/pokeapi/mappers';

export type CompareRadarEntry = {
  name: string;
  stats: PokemonCompareStats | null;
};

type CompareRadarChartProps = {
  pokemon: CompareRadarEntry[];
};

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
] as const;

export function CompareRadarChart({ pokemon }: CompareRadarChartProps) {
  const ready = pokemon.filter((entry) => entry.stats !== null);

  if (ready.length < 2) return null;

  const chartConfig = ready.reduce<ChartConfig>((config, entry, index) => {
    config[entry.name] = {
      label: entry.name,
      color: CHART_COLORS[index] ?? CHART_COLORS[0],
    };
    return config;
  }, {});

  const data = STAT_ORDER.map((statKey) => {
    const row: Record<string, string | number> = {
      stat: formatStatLabel(statKey),
    };

    for (const entry of ready) {
      row[entry.name] = entry.stats?.[statKey] ?? 0;
    }

    return row;
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto min-h-[300px] w-full"
    >
      <RadarChart data={data} outerRadius="80%">
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" />
        {ready.map((entry, index) => (
          <Radar
            key={entry.name}
            name={entry.name}
            dataKey={entry.name}
            stroke={CHART_COLORS[index] ?? CHART_COLORS[0]}
            fill={CHART_COLORS[index] ?? CHART_COLORS[0]}
            fillOpacity={0.2}
          />
        ))}
        <ChartLegend />
      </RadarChart>
    </ChartContainer>
  );
}
