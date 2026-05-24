import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from '../components/ui/progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Progress value={45} className="w-80" />,
};

export const Winner: Story = {
  render: () => (
    <Progress
      value={78}
      className="w-80"
      barClassName="bg-green-600 dark:bg-green-400"
    />
  ),
};
