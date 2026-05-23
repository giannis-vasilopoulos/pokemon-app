import { describe, expect, it } from 'vitest';
import { paginateList } from '../pagination';

describe('paginateList', () => {
  const items = Array.from({ length: 100 }, (_, i) => i);

  it('returns 40 items for page 0', () => {
    const page = paginateList(items, 0, 40);
    expect(page.items).toHaveLength(40);
    expect(page.items[0]).toBe(0);
    expect(page.items[39]).toBe(39);
  });

  it('returns fewer items on last page', () => {
    const page = paginateList(items, 80, 40);
    expect(page.items).toHaveLength(20);
    expect(page.hasNext).toBe(false);
    expect(page.hasPrev).toBe(true);
  });

  it('reports total count', () => {
    const page = paginateList(items, 0, 40);
    expect(page.total).toBe(100);
    expect(page.hasNext).toBe(true);
    expect(page.hasPrev).toBe(false);
  });
});
