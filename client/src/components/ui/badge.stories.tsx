import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    children: 'Badge',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {}; 