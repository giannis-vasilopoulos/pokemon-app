'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { COMPARE_QUERY_PARAM } from '@/lib/compare/constants';
import {
  buildCompareHref,
  getComparePath,
  sanitizeCompareParam,
} from '@/lib/compare/url';
import { useCompareStore } from '@/stores/compare-store';

export function useCompareUrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slots = useCompareStore((state) => state.slots);
  const setSlots = useCompareStore((state) => state.setSlots);
  const isSyncingFromUrl = useRef(false);

  useEffect(() => {
    const hasParam = searchParams.has(COMPARE_QUERY_PARAM);

    if (hasParam) {
      const sanitized = sanitizeCompareParam(
        searchParams.get(COMPARE_QUERY_PARAM) ?? ''
      );
      isSyncingFromUrl.current = true;
      setSlots(sanitized);

      const target = buildCompareHref(sanitized);
      if (target !== getComparePath(searchParams)) {
        router.replace(target);
      }
      return;
    }

    const currentSlots = useCompareStore.getState().slots;
    if (currentSlots.length > 0) {
      router.replace(buildCompareHref(currentSlots));
    }
  }, [router, searchParams, setSlots]);

  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const target = buildCompareHref(slots);
    if (target !== getComparePath(searchParams)) {
      router.replace(target);
    }
  }, [router, searchParams, slots]);
}
