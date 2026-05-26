import type { CSSProperties } from 'react';

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const FALLBACK_TYPE_COLOR = '#777777';

export function getPokemonTypeColor(type: string): string {
  return POKEMON_TYPE_COLORS[type.toLowerCase().trim()] ?? FALLBACK_TYPE_COLOR;
}

export function getContrastTextColor(hex: string): '#000000' | '#FFFFFF' {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function getPokemonTypeBadgeStyles(type: string): CSSProperties {
  const backgroundColor = getPokemonTypeColor(type);

  return {
    backgroundColor,
    color: getContrastTextColor(backgroundColor),
    borderColor: 'transparent',
  };
}
