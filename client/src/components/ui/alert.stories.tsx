import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  args: {
    children: "This is an alert!",
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};
