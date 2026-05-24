import { beforeEach, describe, expect, it } from 'vitest';

import { useCompareStore } from '../compare-store';

describe('useCompareStore', () => {
  beforeEach(() => {
    useCompareStore.setState({ slots: [] });
  });

  it('adds pokemon to slots', () => {
    useCompareStore.getState().add('pikachu');
    expect(useCompareStore.getState().slots).toEqual(['pikachu']);
  });

  it('does not add duplicates', () => {
    useCompareStore.getState().add('pikachu');
    useCompareStore.getState().add('pikachu');
    expect(useCompareStore.getState().slots).toEqual(['pikachu']);
  });

  it('caps at 3 slots', () => {
    ['a', 'b', 'c', 'd'].forEach((name) =>
      useCompareStore.getState().add(name)
    );
    expect(useCompareStore.getState().slots).toHaveLength(3);
    expect(useCompareStore.getState().slots).not.toContain('d');
  });

  it('setSlots replaces and caps slots', () => {
    useCompareStore.getState().setSlots(['a', 'b', 'c', 'd']);
    expect(useCompareStore.getState().slots).toEqual(['a', 'b', 'c']);
  });

  it('removes and clears slots', () => {
    useCompareStore.getState().add('pikachu');
    useCompareStore.getState().remove('pikachu');
    expect(useCompareStore.getState().slots).toEqual([]);

    useCompareStore.getState().add('charizard');
    useCompareStore.getState().clear();
    expect(useCompareStore.getState().slots).toEqual([]);
  });
});
