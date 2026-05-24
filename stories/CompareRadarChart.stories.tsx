import type { Meta, StoryObj } from '@storybook/react';

import { CompareRadarChart } from '../components/pokemon/CompareRadarChart';

const meta = {
  title: 'Pokemon/CompareRadarChart',
  component: CompareRadarChart,
  tags: ['autodocs'],
} satisfies Meta<typeof CompareRadarChart>;

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
