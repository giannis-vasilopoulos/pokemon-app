'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { buildCompareHref } from '@/lib/compare/url';
import { useCompareStore } from '@/stores/compare-store';

export function CompareNavLink() {
  const slots = useCompareStore((state) => state.slots);

  return (
    <Button variant="ghost" asChild>
      <Link href={buildCompareHref(slots)}>Compare</Link>
    </Button>
  );
}
