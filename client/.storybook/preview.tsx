import type { Preview } from "@storybook/react-vite";
import React from "react";
import { ErrorBoundary } from "../src/stories/ErrorBoundary";
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <ErrorBoundary>
        <React.StrictMode>
          <Story />
        </React.StrictMode>
      </ErrorBoundary>
    ),
  ],
};

export default preview; 