'use client';

import { useCallback, useState } from 'react';
import { Share2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTeamStore } from '@/stores/team-store';

export function ShareTeamButton() {
  const slots = useTeamStore((state) => state.slots);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    await navigator.clipboard.writeText(globalThis.location.href);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={slots.length === 0}
    >
      <Share2Icon />
      {copied ? 'Copied!' : 'Share team'}
    </Button>
  );
}
