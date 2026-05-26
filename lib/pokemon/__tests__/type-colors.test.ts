import { describe, expect, it } from 'vitest';

import {
  getContrastTextColor,
  getPokemonTypeBadgeStyles,
  getPokemonTypeColor,
} from '../type-colors';

describe('getPokemonTypeColor', () => {
  it('returns the canonical hex for a known type', () => {
    expect(getPokemonTypeColor('fire')).toBe('#EE8130');
  });

  it('is case-insensitive', () => {
    expect(getPokemonTypeColor('Fire')).toBe('#EE8130');
    expect(getPokemonTypeColor('  WATER  ')).toBe('#6390F0');
  });

  it('falls back to neutral gray for unknown types', () => {
    expect(getPokemonTypeColor('stellar')).toBe('#777777');
  });
});

describe('getContrastTextColor', () => {
  it('returns black text on light backgrounds', () => {
    expect(getContrastTextColor('#F7D02C')).toBe('#000000');
    expect(getContrastTextColor('#96D9D6')).toBe('#000000');
  });

  it('returns white text on dark backgrounds', () => {
    expect(getContrastTextColor('#6F35FC')).toBe('#FFFFFF');
    expect(getContrastTextColor('#C22E28')).toBe('#FFFFFF');
  });
});

describe('getPokemonTypeBadgeStyles', () => {
  it('returns background, contrast text, and transparent border', () => {
    expect(getPokemonTypeBadgeStyles('grass')).toEqual({
      backgroundColor: '#7AC74C',
      color: '#000000',
      borderColor: 'transparent',
    });
  });
});
