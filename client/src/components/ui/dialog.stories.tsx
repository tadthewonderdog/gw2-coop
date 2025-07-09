import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dialog } from "./dialog";

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  args: {
    open: true,
    children: "Dialog content goes here",
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};
