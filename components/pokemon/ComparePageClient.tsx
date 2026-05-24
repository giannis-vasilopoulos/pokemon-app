'use client';

import { CompareTable } from '@/components/pokemon/CompareTable';
import { useCompareUrlSync } from '@/hooks/useCompareUrlSync';

export function ComparePageClient() {
  useCompareUrlSync();

  return <CompareTable />;
}
