import { describe, expect, it } from 'vitest';

import {
  buildCompareHref,
  isValidPokemonSlug,
  sanitizeCompareParam,
  serializeCompareSlots,
} from '../url';

describe('isValidPokemonSlug', () => {
  it('accepts valid pokeapi slugs', () => {
    expect(isValidPokemonSlug('pikachu')).toBe(true);
    expect(isValidPokemonSlug('mr-mime')).toBe(true);
    expect(isValidPokemonSlug('ho-oh')).toBe(true);
    expect(isValidPokemonSlug('nidoran-f')).toBe(true);
  });

  it('rejects malformed slugs', () => {
    expect(isValidPokemonSlug('')).toBe(false);
    expect(isValidPokemonSlug('!!!')).toBe(false);
    expect(isValidPokemonSlug('foo bar')).toBe(false);
    expect(isValidPokemonSlug('-leading')).toBe(false);
    expect(isValidPokemonSlug('trailing-')).toBe(false);
  });
});

describe('sanitizeCompareParam', () => {
  it('returns empty for missing input', () => {
    expect(sanitizeCompareParam(undefined)).toEqual([]);
    expect(sanitizeCompareParam('')).toEqual([]);
  });

  it('dedupes and normalizes', () => {
    expect(sanitizeCompareParam('pikachu,Pikachu,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
  });

  it('caps at 3 valid names', () => {
    expect(
      sanitizeCompareParam('pikachu,charizard,bulbasaur,squirtle')
    ).toEqual(['pikachu', 'charizard', 'bulbasaur']);
  });

  it('drops malformed segments and keeps valid siblings', () => {
    expect(sanitizeCompareParam('pikachu,!!!,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
    expect(sanitizeCompareParam('pikachu,,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
  });

  it('returns empty when all segments are invalid', () => {
    expect(sanitizeCompareParam('!!!,@@@')).toEqual([]);
  });

  it('handles array input', () => {
    expect(sanitizeCompareParam(['pikachu', 'charizard'])).toEqual([
      'pikachu',
      'charizard',
    ]);
  });
});

describe('serializeCompareSlots and buildCompareHref', () => {
  it('serializes slots', () => {
    expect(serializeCompareSlots(['pikachu', 'charizard'])).toBe(
      'pikachu,charizard'
    );
  });

  it('builds plain compare path when empty', () => {
    expect(buildCompareHref([])).toBe('/compare');
  });

  it('builds compare path with pokemons param', () => {
    expect(buildCompareHref(['pikachu', 'charizard'])).toBe(
      '/compare?pokemons=pikachu,charizard'
    );
  });
});
