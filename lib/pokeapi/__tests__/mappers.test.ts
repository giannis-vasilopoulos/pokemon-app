import { describe, expect, it } from 'vitest';

import { toPokemonCompareStats } from '../mappers';
import type { PokemonStatEntry } from '../types';

const fullStats: PokemonStatEntry[] = [
  { base_stat: 35, stat: { name: 'hp' } },
  { base_stat: 55, stat: { name: 'attack' } },
  { base_stat: 40, stat: { name: 'defense' } },
  { base_stat: 50, stat: { name: 'special-attack' } },
  { base_stat: 50, stat: { name: 'special-defense' } },
  { base_stat: 90, stat: { name: 'speed' } },
];

describe('toPokemonCompareStats', () => {
  it('maps all six stats and total', () => {
    expect(toPokemonCompareStats(fullStats)).toEqual({
      hp: 35,
      attack: 55,
      defense: 40,
      'special-attack': 50,
      'special-defense': 50,
      speed: 90,
      total: 320,
    });
  });

  it('defaults missing stats to zero', () => {
    expect(
      toPokemonCompareStats([{ base_stat: 35, stat: { name: 'hp' } }])
    ).toEqual({
      hp: 35,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0,
      total: 35,
    });
  });
});
