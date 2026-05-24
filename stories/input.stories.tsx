import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text…' },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search by name…',
    'aria-label': 'Search Pokémon by name',
    className: 'w-48',
  },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Invalid input',
    'aria-invalid': true,
  },
};

export const SearchFilterPattern: Story = {
  render: () => (
    <Input
      type="search"
      placeholder="Search by name…"
      aria-label="Search Pokémon by name"
      className="w-48"
    />
  ),
};
