import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Page } from "./Page";

const meta = {
  title: "Example/Page",
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Look for login button with more flexible matching
    const loginButton = canvas.getByRole("button", { name: /log in/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Look for logout button
    const logoutButton = canvas.getByRole("button", { name: /log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};
