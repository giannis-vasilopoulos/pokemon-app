import type { Route } from 'next';

export function parseListSearchParams(searchParams: URLSearchParams): {
  type: string | null;
  offset: number;
} {
  const type = searchParams.get('type');
  const rawOffset = searchParams.get('offset');
  const offset = rawOffset ? Number(rawOffset) : 0;

  return {
    type: type ?? null,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
  };
}

export function buildListHref(type: string | null, offset: number): Route {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (offset > 0) params.set('offset', String(offset));
  const query = params.toString();
  if (!query) return '/';
  return `/?${query}`;
}
