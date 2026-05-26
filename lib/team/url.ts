import type { Route } from 'next';

import { MAX_TEAM_SLOTS, TEAM_QUERY_PARAM } from '@/lib/constants';

const POKEMON_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidPokemonSlug(name: string): boolean {
  return POKEMON_SLUG_PATTERN.test(name);
}

export function sanitizeTeamParam(
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
    if (result.length >= MAX_TEAM_SLOTS) break;
  }

  return result;
}

export function serializeTeamSlots(slots: string[]): string {
  return slots.join(',');
}

export function buildTeamHref(slots: string[]): Route {
  if (slots.length === 0) return '/team';
  return `/team?${TEAM_QUERY_PARAM}=${serializeTeamSlots(slots)}`;
}

export function areTeamSlotsInSync(
  searchParams: URLSearchParams,
  slots: string[]
): boolean {
  const hasParam = searchParams.has(TEAM_QUERY_PARAM);
  if (slots.length === 0) return !hasParam;

  const urlSlots = sanitizeTeamParam(searchParams.get(TEAM_QUERY_PARAM) ?? '');
  const canonical = serializeTeamSlots(slots);
  if (serializeTeamSlots(urlSlots) !== canonical) return false;

  const rawParam = searchParams.get(TEAM_QUERY_PARAM) ?? '';
  return rawParam === canonical;
}
