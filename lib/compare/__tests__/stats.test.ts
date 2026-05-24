import { describe, expect, it } from 'vitest';

import { getWinningIndices, shouldHighlightStat } from '../stats';

describe('getWinningIndices', () => {
  it('returns the single winner', () => {
    expect(getWinningIndices([35, 78, 40])).toEqual(new Set([1]));
  });

  it('returns all tied winners', () => {
    expect(getWinningIndices([90, 50, 90])).toEqual(new Set([0, 2]));
  });

  it('returns empty set for empty input', () => {
    expect(getWinningIndices([])).toEqual(new Set());
  });
});

describe('shouldHighlightStat', () => {
  it('highlights only when comparing two or more', () => {
    expect(shouldHighlightStat([35])).toBe(false);
    expect(shouldHighlightStat([35, 78])).toBe(true);
  });
});
