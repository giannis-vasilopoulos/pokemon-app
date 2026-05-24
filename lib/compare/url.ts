import type { Route } from 'next';

import { COMPARE_QUERY_PARAM, MAX_COMPARE_SLOTS } from '@/lib/constants';

const POKEMON_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidPokemonSlug(name: string): boolean {
  return POKEMON_SLUG_PATTERN.test(name);
}

export function sanitizeCompareParam(
  raw: string | string[] | undefined
): string[] {
  const input = Array.isArray(raw) ? raw.join(',') : (raw ?? '');

  const seen = new Set<string>();
  const result: string[] = [];

  for (const segment of input.split(',')) {
    const normalized = segment.trim().toLowerCase();
    if (!normalized || !isValidPokemonSlug(normalized)) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= MAX_COMPARE_SLOTS) break;
  }

  return result;
}

export function serializeCompareSlots(slots: string[]): string {
  return slots.join(',');
}

export function buildCompareHref(slots: string[]): Route {
  if (slots.length === 0) return '/compare';
  return `/compare?${COMPARE_QUERY_PARAM}=${serializeCompareSlots(slots)}`;
}

export function areCompareSlotsInSync(
  searchParams: URLSearchParams,
  slots: string[]
): boolean {
  const hasParam = searchParams.has(COMPARE_QUERY_PARAM);
  if (slots.length === 0) return !hasParam;

  const urlSlots = sanitizeCompareParam(
    searchParams.get(COMPARE_QUERY_PARAM) ?? ''
  );
  const canonical = serializeCompareSlots(slots);
  if (serializeCompareSlots(urlSlots) !== canonical) return false;

  const rawParam = searchParams.get(COMPARE_QUERY_PARAM) ?? '';
  return rawParam === canonical;
}
