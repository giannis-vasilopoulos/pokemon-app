import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeFilterPattern: Story = {
  render: () => (
    <Select defaultValue="fire">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        <SelectItem value="fire">fire</SelectItem>
        <SelectItem value="water">water</SelectItem>
      </SelectContent>
    </Select>
  ),
};
