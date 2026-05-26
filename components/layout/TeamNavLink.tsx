'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { buildTeamHref } from '@/lib/team/url';
import { useTeamStore } from '@/stores/team-store';

export function TeamNavLink() {
  const slots = useTeamStore((state) => state.slots);

  return (
    <Button variant="ghost" asChild>
      <Link href={buildTeamHref(slots)}>Team</Link>
    </Button>
  );
}
