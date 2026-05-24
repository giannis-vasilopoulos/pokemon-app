import type { Meta, StoryObj } from '@storybook/react';

import { PokemonCard } from '../components/pokemon/PokemonCard';

const meta = {
  title: 'Pokemon/PokemonCard',
  component: PokemonCard,
  tags: ['autodocs'],
} satisfies Meta<typeof PokemonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pikachu: Story = {
  args: {
    pokemon: {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    },
    types: ['electric'],
    description:
      'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
  },
};
