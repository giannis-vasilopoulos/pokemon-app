import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'electric' },
};

export const Secondary: Story = {
  args: { children: 'fire', variant: 'secondary' },
};

export const Outline: Story = {
  args: { children: 'water', variant: 'outline' },
};
