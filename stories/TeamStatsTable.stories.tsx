import type { Meta, StoryObj } from '@storybook/react';

import { TeamStatsTable } from '../components/pokemon/TeamStatsTable';

const meta = {
  title: 'Pokemon/TeamStatsTable',
  component: TeamStatsTable,
  tags: ['autodocs'],
} satisfies Meta<typeof TeamStatsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoPokemon: Story = {
  args: {
    onRemove: () => undefined,
    pokemon: [
      {
        name: 'pikachu',
        isLoading: false,
        isError: false,
        stats: {
          hp: 35,
          attack: 55,
          defense: 40,
          'special-attack': 50,
          'special-defense': 50,
          speed: 90,
          total: 320,
        },
      },
      {
        name: 'charizard',
        isLoading: false,
        isError: false,
        stats: {
          hp: 78,
          attack: 84,
          defense: 78,
          'special-attack': 109,
          'special-defense': 85,
          speed: 100,
          total: 534,
        },
      },
    ],
  },
};
