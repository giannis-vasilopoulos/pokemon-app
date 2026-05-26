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
    <div className="border-border bg-background fixed right-0 bottom-0 left-0 z-50 border-t shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 p-4">
        <span className="text-muted-foreground text-sm">
          Team ({slots.length}/{MAX_TEAM_SLOTS}):
        </span>

        <div className="flex flex-1 gap-3">
          {slots.map((name) => (
            <TraySlot key={name} name={name} onRemove={() => remove(name)} />
          ))}
          {Array.from({ length: MAX_TEAM_SLOTS - slots.length }).map((_, i) => (
            <EmptySlot key={i} />
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => useTeamStore.getState().clear()}
          >
            Clear
          </Button>
          <Button size="sm" asChild>
            <Link href={buildTeamHref(slots)}>View team →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function TraySlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1 capitalize">
      {name}
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
    <Badge variant="outline" className="text-muted-foreground font-normal">
      Empty
    </Badge>
  );
}
