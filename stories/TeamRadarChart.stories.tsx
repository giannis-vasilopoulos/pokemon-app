import type { Meta, StoryObj } from '@storybook/react';

import { TeamRadarChart } from '../components/pokemon/TeamRadarChart';

const meta = {
  title: 'Pokemon/TeamRadarChart',
  component: TeamRadarChart,
  tags: ['autodocs'],
} satisfies Meta<typeof TeamRadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoPokemon: Story = {
  args: {
    pokemon: [
      {
        name: 'pikachu',
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
