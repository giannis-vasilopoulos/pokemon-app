import { describe, expect, it } from 'vitest';

import {
  formatAbilityName,
  formatPokemonHeight,
  formatPokemonWeight,
  normalizeFlavorText,
  toPokemonDetailView,
  toPokemonTeamStats,
  toPokemonListItem,
  toPokemonListPageData,
} from '../mappers';
import type { GraphQLPokemonListResponse } from '../graphql/types';
import type { PokemonDetail, PokemonStatEntry } from '../types';

const fullStats: PokemonStatEntry[] = [
  { base_stat: 35, stat: { name: 'hp' } },
  { base_stat: 55, stat: { name: 'attack' } },
  { base_stat: 40, stat: { name: 'defense' } },
  { base_stat: 50, stat: { name: 'special-attack' } },
  { base_stat: 50, stat: { name: 'special-defense' } },
  { base_stat: 90, stat: { name: 'speed' } },
];

describe('toPokemonTeamStats', () => {
  it('maps all six stats and total', () => {
    expect(toPokemonTeamStats(fullStats)).toEqual({
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
      toPokemonTeamStats([{ base_stat: 35, stat: { name: 'hp' } }])
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

describe('normalizeFlavorText', () => {
  it('replaces form feeds and newlines with spaces', () => {
    expect(normalizeFlavorText('hello\fworld\nthere')).toBe(
      'hello world there'
    );
  });
});

describe('toPokemonListItem', () => {
  it('maps types and normalized description', () => {
    expect(
      toPokemonListItem({
        name: 'bulbasaur',
        pokemontypes: [
          { type: { name: 'grass' } },
          { type: { name: 'poison' } },
        ],
        pokemonspecy: {
          pokemonspeciesflavortexts: [
            { flavor_text: 'A strange seed\fwas planted.' },
          ],
        },
      })
    ).toEqual({
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      description: 'A strange seed was planted.',
    });
  });

  it('defaults missing flavor text to empty string', () => {
    expect(
      toPokemonListItem({
        name: 'missingno',
        pokemontypes: [],
        pokemonspecy: null,
      })
    ).toEqual({
      name: 'missingno',
      types: [],
      description: '',
    });
  });
});

describe('toPokemonListPageData', () => {
  const raw: GraphQLPokemonListResponse = {
    pokemon: [
      {
        name: 'bulbasaur',
        pokemontypes: [{ type: { name: 'grass' } }],
        pokemonspecy: {
          pokemonspeciesflavortexts: [{ flavor_text: 'Seed Pokémon.' }],
        },
      },
    ],
    pokemon_aggregate: { aggregate: { count: 1302 } },
  };

  it('maps items and pagination flags', () => {
    expect(toPokemonListPageData(raw, 40, 0)).toEqual({
      items: [
        {
          name: 'bulbasaur',
          types: ['grass'],
          description: 'Seed Pokémon.',
        },
      ],
      total: 1302,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('sets hasPrev when offset is greater than zero', () => {
    expect(toPokemonListPageData(raw, 40, 40).hasPrev).toBe(true);
  });

  it('sets hasNext false on last page', () => {
    expect(toPokemonListPageData(raw, 40, 1280).hasNext).toBe(false);
  });
});

describe('formatPokemonHeight', () => {
  it('converts decimeters to meters', () => {
    expect(formatPokemonHeight(4)).toBe('0.4 m');
    expect(formatPokemonHeight(17)).toBe('1.7 m');
  });
});

describe('formatPokemonWeight', () => {
  it('converts hectograms to kilograms', () => {
    expect(formatPokemonWeight(60)).toBe('6.0 kg');
    expect(formatPokemonWeight(905)).toBe('90.5 kg');
  });
});

describe('formatAbilityName', () => {
  it('formats slug to title case', () => {
    expect(formatAbilityName('lightning-rod')).toBe('Lightning Rod');
    expect(formatAbilityName('static')).toBe('Static');
  });
});

describe('toPokemonDetailView', () => {
  const raw: PokemonDetail = {
    name: 'pikachu',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
    types: [{ type: { name: 'electric' } }],
    height: 4,
    weight: 60,
    abilities: [
      { ability: { name: 'static' }, is_hidden: false },
      { ability: { name: 'lightning-rod' }, is_hidden: true },
    ],
    stats: fullStats,
  };

  it('maps detail fields to view model', () => {
    expect(toPokemonDetailView(raw)).toEqual({
      name: 'pikachu',
      sprite:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      types: ['electric'],
      height: '0.4 m',
      weight: '6.0 kg',
      abilities: [
        { name: 'Static', isHidden: false },
        { name: 'Lightning Rod', isHidden: true },
      ],
      stats: {
        hp: 35,
        attack: 55,
        defense: 40,
        'special-attack': 50,
        'special-defense': 50,
        speed: 90,
        total: 320,
      },
    });
  });
});
