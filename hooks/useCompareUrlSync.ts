'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { COMPARE_QUERY_PARAM } from '@/lib/constants';
import {
  areCompareSlotsInSync,
  buildCompareHref,
  sanitizeCompareParam,
  serializeCompareSlots,
} from '@/lib/compare/url';
import { validateCompareSlots } from '@/lib/compare/validate';
import { useCompareStore } from '@/stores/compare-store';

type UseCompareUrlSyncOptions = {
  initialSlots?: string[];
};

export function useCompareUrlSync({
  initialSlots,
}: UseCompareUrlSyncOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slots = useCompareStore((state) => state.slots);
  const setSlots = useCompareStore((state) => state.setSlots);
  const isSyncingFromUrl = useRef(false);
  const serverResolved =
    initialSlots !== undefined && searchParams.has(COMPARE_QUERY_PARAM);

  useLayoutEffect(() => {
    if (!serverResolved) return;

    const currentSlots = useCompareStore.getState().slots;
    if (
      serializeCompareSlots(currentSlots) !==
      serializeCompareSlots(initialSlots)
    ) {
      isSyncingFromUrl.current = true;
      setSlots(initialSlots);
    }
  }, [serverResolved, initialSlots, setSlots]);

  useEffect(() => {
    const hasParam = searchParams.has(COMPARE_QUERY_PARAM);

    if (hasParam) {
      if (serverResolved) return;

      const slugSanitized = sanitizeCompareParam(
        searchParams.get(COMPARE_QUERY_PARAM) ?? ''
      );

      let cancelled = false;

      void (async () => {
        const validated = await validateCompareSlots(slugSanitized);
        if (cancelled) return;

        const currentSlots = useCompareStore.getState().slots;
        const slotsChanged =
          serializeCompareSlots(currentSlots) !==
          serializeCompareSlots(validated);

        if (slotsChanged) {
          isSyncingFromUrl.current = true;
          setSlots(validated);
        }

        if (!areCompareSlotsInSync(searchParams, validated)) {
          router.replace(buildCompareHref(validated));
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    const currentSlots = useCompareStore.getState().slots;
    if (currentSlots.length > 0) {
      router.replace(buildCompareHref(currentSlots));
    }
  }, [router, searchParams, setSlots, serverResolved]);

  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    if (!areCompareSlotsInSync(searchParams, slots)) {
      router.replace(buildCompareHref(slots));
    }
  }, [router, searchParams, slots]);
}
