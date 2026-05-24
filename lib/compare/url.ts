import type { Route } from 'next';

import { COMPARE_QUERY_PARAM, MAX_COMPARE_SLOTS } from './constants';

const POKEMON_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidPokemonSlug(name: string): boolean {
  return POKEMON_SLUG_PATTERN.test(name);
}

export function sanitizeCompareParam(
  raw: string | string[] | undefined
): string[] {
  // TODO: validate slugs against PokeAPI — drop unknown names, keep valid siblings
  const input =
    raw === undefined || raw === null
      ? ''
      : Array.isArray(raw)
        ? raw.join(',')
        : raw;

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
  return `/compare?${COMPARE_QUERY_PARAM}=${serializeCompareSlots(slots)}` as Route;
}

export function getComparePath(searchParams: URLSearchParams): string {
  const query = searchParams.toString();
  return query ? `/compare?${query}` : '/compare';
}
