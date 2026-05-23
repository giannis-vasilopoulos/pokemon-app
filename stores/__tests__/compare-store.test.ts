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

  it('caps at 4 slots', () => {
    ['a', 'b', 'c', 'd', 'e'].forEach((name) =>
      useCompareStore.getState().add(name)
    );
    expect(useCompareStore.getState().slots).toHaveLength(4);
    expect(useCompareStore.getState().slots).not.toContain('e');
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
