import type { Meta, StoryObj } from '@storybook/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="capitalize">pikachu</CardTitle>
        <CardDescription>Pokémon</CardDescription>
      </CardHeader>
      <CardContent>Card body content.</CardContent>
    </Card>
  ),
};
