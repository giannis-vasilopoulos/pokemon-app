import { describe, expect, it } from 'vitest';

import { filterPokemonByName } from '../filter';
import type { PokemonListItem } from '../types';

describe('filterPokemonByName', () => {
  const items: PokemonListItem[] = [
    {
      name: 'bulbasaur',
      description: 'A seed Pokémon.',
      types: ['grass', 'poison'],
    },
    {
      name: 'charmander',
      description: 'A lizard Pokémon.',
      types: ['fire'],
    },
    {
      name: 'charizard',
      description: 'A flame Pokémon.',
      types: ['fire', 'flying'],
    },
  ];

  it('returns all items when query is empty', () => {
    expect(filterPokemonByName(items, '')).toEqual(items);
    expect(filterPokemonByName(items, '   ')).toEqual(items);
  });

  it('filters by case-insensitive substring', () => {
    expect(filterPokemonByName(items, 'char')).toEqual([items[1], items[2]]);
    expect(filterPokemonByName(items, 'CHAR')).toEqual([items[1], items[2]]);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterPokemonByName(items, 'pikachu')).toEqual([]);
  });
});
