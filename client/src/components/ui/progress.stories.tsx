import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  args: {
    value: 0,
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {};
export const Filled: Story = {
  args: {
    value: 70,
  },
}; 