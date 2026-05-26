import { describe, expect, it } from 'vitest';

import {
  areTeamSlotsInSync,
  buildTeamHref,
  isValidPokemonSlug,
  sanitizeTeamParam,
  serializeTeamSlots,
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

describe('sanitizeTeamParam', () => {
  it('returns empty for missing input', () => {
    expect(sanitizeTeamParam(undefined)).toEqual([]);
    expect(sanitizeTeamParam('')).toEqual([]);
  });

  it('dedupes and normalizes', () => {
    expect(sanitizeTeamParam('pikachu,Pikachu,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
  });

  it('caps at 3 valid names', () => {
    expect(sanitizeTeamParam('pikachu,charizard,bulbasaur,squirtle')).toEqual([
      'pikachu',
      'charizard',
      'bulbasaur',
    ]);
  });

  it('drops malformed segments and keeps valid siblings', () => {
    expect(sanitizeTeamParam('pikachu,!!!,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
    expect(sanitizeTeamParam('pikachu,,charizard')).toEqual([
      'pikachu',
      'charizard',
    ]);
  });

  it('returns empty when all segments are invalid', () => {
    expect(sanitizeTeamParam('!!!,@@@')).toEqual([]);
  });

  it('handles array input', () => {
    expect(sanitizeTeamParam(['pikachu', 'charizard'])).toEqual([
      'pikachu',
      'charizard',
    ]);
  });
});

describe('serializeTeamSlots and buildTeamHref', () => {
  it('serializes slots', () => {
    expect(serializeTeamSlots(['pikachu', 'charizard'])).toBe(
      'pikachu,charizard'
    );
  });

  it('builds plain team path when empty', () => {
    expect(buildTeamHref([])).toBe('/team');
  });

  it('builds team path with pokemons param', () => {
    expect(buildTeamHref(['pikachu', 'charizard'])).toBe(
      '/team?pokemons=pikachu,charizard'
    );
  });
});

describe('areTeamSlotsInSync', () => {
  it('is in sync when slots are empty and param is absent', () => {
    const params = new URLSearchParams();
    expect(areTeamSlotsInSync(params, [])).toBe(true);
  });

  it('is out of sync when slots are empty but param is present', () => {
    const params = new URLSearchParams('pokemons=pikachu');
    expect(areTeamSlotsInSync(params, [])).toBe(false);
  });

  it('is in sync for matching multi-slot list with encoded commas', () => {
    const params = new URLSearchParams(
      'pokemons=bulbasaur%2Civysaur%2Cvenusaur'
    );
    expect(
      areTeamSlotsInSync(params, ['bulbasaur', 'ivysaur', 'venusaur'])
    ).toBe(true);
  });

  it('is out of sync when url has invalid segments that sanitize away', () => {
    const params = new URLSearchParams('pokemons=pikachu,!!!,charizard');
    expect(areTeamSlotsInSync(params, ['pikachu', 'charizard'])).toBe(false);
  });

  it('is out of sync when slot order differs', () => {
    const params = new URLSearchParams('pokemons=pikachu,charizard');
    expect(areTeamSlotsInSync(params, ['charizard', 'pikachu'])).toBe(false);
  });
});
