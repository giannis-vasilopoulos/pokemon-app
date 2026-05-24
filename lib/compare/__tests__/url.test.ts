import { describe, expect, it } from 'vitest';

import {
  areCompareSlotsInSync,
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

describe('areCompareSlotsInSync', () => {
  it('is in sync when slots are empty and param is absent', () => {
    const params = new URLSearchParams();
    expect(areCompareSlotsInSync(params, [])).toBe(true);
  });

  it('is out of sync when slots are empty but param is present', () => {
    const params = new URLSearchParams('pokemons=pikachu');
    expect(areCompareSlotsInSync(params, [])).toBe(false);
  });

  it('is in sync for matching multi-slot list with encoded commas', () => {
    const params = new URLSearchParams(
      'pokemons=bulbasaur%2Civysaur%2Cvenusaur'
    );
    expect(
      areCompareSlotsInSync(params, ['bulbasaur', 'ivysaur', 'venusaur'])
    ).toBe(true);
  });

  it('is out of sync when url has invalid segments that sanitize away', () => {
    const params = new URLSearchParams('pokemons=pikachu,!!!,charizard');
    expect(areCompareSlotsInSync(params, ['pikachu', 'charizard'])).toBe(false);
  });

  it('is out of sync when slot order differs', () => {
    const params = new URLSearchParams('pokemons=pikachu,charizard');
    expect(areCompareSlotsInSync(params, ['charizard', 'pikachu'])).toBe(false);
  });
});
