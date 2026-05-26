import { beforeEach, describe, expect, it } from 'vitest';

import { useTeamStore } from '../team-store';

describe('useTeamStore', () => {
  beforeEach(() => {
    useTeamStore.setState({ slots: [] });
  });

  it('adds pokemon to slots', () => {
    useTeamStore.getState().add('pikachu');
    expect(useTeamStore.getState().slots).toEqual(['pikachu']);
  });

  it('does not add duplicates', () => {
    useTeamStore.getState().add('pikachu');
    useTeamStore.getState().add('pikachu');
    expect(useTeamStore.getState().slots).toEqual(['pikachu']);
  });

  it('caps at 3 slots', () => {
    ['a', 'b', 'c', 'd'].forEach((name) => useTeamStore.getState().add(name));
    expect(useTeamStore.getState().slots).toHaveLength(3);
    expect(useTeamStore.getState().slots).not.toContain('d');
  });

  it('setSlots replaces and caps slots', () => {
    useTeamStore.getState().setSlots(['a', 'b', 'c', 'd']);
    expect(useTeamStore.getState().slots).toEqual(['a', 'b', 'c']);
  });

  it('removes and clears slots', () => {
    useTeamStore.getState().add('pikachu');
    useTeamStore.getState().remove('pikachu');
    expect(useTeamStore.getState().slots).toEqual([]);

    useTeamStore.getState().add('charizard');
    useTeamStore.getState().clear();
    expect(useTeamStore.getState().slots).toEqual([]);
  });
});
