export function getWinningIndices(values: number[]): Set<number> {
  if (values.length === 0) return new Set();

  const max = Math.max(...values);
  return new Set(
    values
      .map((value, index) => (value === max ? index : -1))
      .filter((index) => index >= 0)
  );
}

export function shouldHighlightStat(values: number[]): boolean {
  return values.length >= 2;
}
