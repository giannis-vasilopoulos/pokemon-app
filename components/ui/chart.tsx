'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartContainer');
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video w-full justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.color
  );

  if (colorConfig.length === 0) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([, prefix]) => `
                ${prefix} [data-chart=${id}] {
                ${colorConfig
                  .map(([key, itemConfig]) => {
                    const color = itemConfig.color;
                    return color ? `  --color-${key}: ${color};` : null;
                  })
                  .join('\n')}
                }`
          )
          .join('\n'),
      }}
    />
  );
}

function ChartTooltip({
  content,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) {
  if (!content) {
    return (
      <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} {...props} />
    );
  }

  return <RechartsPrimitive.Tooltip content={content} {...props} />;
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string | number;
    name?: string;
    value?: number;
    color?: string;
  }>;
  label?: string;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background border-border grid min-w-32 gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      {label ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? '');
          const itemConfig = config[key];
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color ?? `var(--color-${key})`,
                  }}
                />
                <span className="text-muted-foreground capitalize">
                  {itemConfig?.label ?? key}
                </span>
              </div>
              <span className="text-foreground font-mono font-medium tabular-nums">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({
  content,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Legend>) {
  if (!content) {
    return (
      <RechartsPrimitive.Legend content={<ChartLegendContent />} {...props} />
    );
  }

  return <RechartsPrimitive.Legend content={content} {...props} />;
}

function ChartLegendContent({
  payload,
}: {
  payload?: Array<{
    value?: string;
    dataKey?: string | number;
    color?: string;
  }>;
}) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value ?? '');
        const itemConfig = config[key];
        return (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="size-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color ?? `var(--color-${key})`,
              }}
            />
            <span className="capitalize">{itemConfig?.label ?? key}</span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
