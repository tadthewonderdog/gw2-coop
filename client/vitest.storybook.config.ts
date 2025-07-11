import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
    }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
    // Add exclude patterns to prevent discovering tests from unwanted directories
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.config.{js,jsx,ts,tsx}',
    ],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/setup.ts"],
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "@storybook/react",
      "@storybook/addon-a11y",
      "@storybook/addon-docs",
      "@storybook/addon-vitest",
      "markdown-to-jsx"
    ]
  }

}); 