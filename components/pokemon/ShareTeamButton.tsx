'use client';

import { useCallback, useState } from 'react';
import { Share2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/stores/compare-store';

export function ShareTeamButton() {
  const slots = useCompareStore((state) => state.slots);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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
