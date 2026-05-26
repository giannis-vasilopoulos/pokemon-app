import type { Meta, StoryObj } from '@storybook/react';

import { TypeBadge } from '../components/pokemon/TypeBadge';
import { POKEMON_TYPE_COLORS } from '../lib/pokemon/type-colors';

const meta = {
  title: 'Pokemon/TypeBadge',
  component: TypeBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof TypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fire: Story = {
  args: { type: 'fire' },
};

export const Water: Story = {
  args: { type: 'water' },
};

export const AllTypes: Story = {
  args: { type: 'fire' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(POKEMON_TYPE_COLORS).map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </div>
  ),
};
