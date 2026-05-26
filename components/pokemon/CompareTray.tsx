'use client';

import Link from 'next/link';
import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildCompareHref } from '@/lib/compare/url';
import { MAX_COMPARE_SLOTS } from '@/lib/constants';
import { useCompareStore } from '@/stores/compare-store';

export function CompareTray() {
  const { slots, remove } = useCompareStore();

  if (slots.length === 0) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 p-4">
        <span className="text-muted-foreground text-sm">
          Compare ({slots.length}/{MAX_COMPARE_SLOTS}):
        </span>

        <div className="flex flex-1 gap-3">
          {slots.map((name) => (
            <TraySlot key={name} name={name} onRemove={() => remove(name)} />
          ))}
          {Array.from({ length: MAX_COMPARE_SLOTS - slots.length }).map(
            (_, i) => (
              <EmptySlot key={i} />
            )
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => useCompareStore.getState().clear()}
          >
            Clear
          </Button>
          <Button size="sm" asChild disabled={slots.length < 2}>
            <Link href={buildCompareHref(slots)}>Compare →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function TraySlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="bg-muted relative flex items-center gap-2 rounded-md border px-3 py-1">
      <span className="text-sm capitalize">{name}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove ${name} from compare`}
        title={`Remove ${name} from compare`}
        className="text-muted-foreground hover:text-foreground"
      >
        <XIcon />
      </button>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex items-center rounded-md border border-dashed px-3 py-1">
      <span className="text-muted-foreground text-sm">Empty</span>
    </div>
  );
}
