'use client';

import Link from 'next/link';
import { XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildTeamHref } from '@/lib/team/url';
import { MAX_TEAM_SLOTS } from '@/lib/constants';
import { useTeamStore } from '@/stores/team-store';

export function TeamTray() {
  const { slots, remove } = useTeamStore();

  if (slots.length === 0) return null;

  return (
    <div className="border-border bg-background fixed right-0 bottom-0 left-0 z-50 border-t pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <span className="text-muted-foreground shrink-0 text-sm">
          Team ({slots.length}/{MAX_TEAM_SLOTS}):
        </span>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          {slots.map((name) => (
            <TraySlot key={name} name={name} onRemove={() => remove(name)} />
          ))}
          {Array.from({ length: MAX_TEAM_SLOTS - slots.length }).map((_, i) => (
            <EmptySlot key={i} />
          ))}
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => useTeamStore.getState().clear()}
          >
            Clear
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" asChild>
            <Link href={buildTeamHref(slots)}>View team →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function TraySlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="max-w-full gap-1 pr-1 capitalize">
      <span className="truncate">{name}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onRemove}
        aria-label={`Remove ${name} from team`}
        title={`Remove ${name} from team`}
      >
        <XIcon />
      </Button>
    </Badge>
  );
}

function EmptySlot() {
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground shrink-0 font-normal"
    >
      Empty
    </Badge>
  );
}
