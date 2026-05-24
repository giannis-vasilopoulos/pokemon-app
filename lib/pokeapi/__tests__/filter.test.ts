import { describe, expect, it } from 'vitest';

import { filterPokemonByName } from '../filter';
import type { NamedResource } from '../types';

describe('filterPokemonByName', () => {
  const items: NamedResource[] = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
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
