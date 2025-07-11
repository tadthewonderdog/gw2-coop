import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'unit',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Add exclude patterns to prevent discovering tests from unwanted directories
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/*.config.{js,jsx,ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.storybook/**',
        '**/stories/**',
        '**/*.stories.{js,jsx,ts,tsx}',
        '**/*.config.{js,jsx,ts,tsx}',
        '**/*.d.ts',
        '**/types.ts',
        '**/index.ts',
        'src/test/setup.ts',
        'src/test/mocks.ts',
        'src/scripts/**',
        'src/styles/**',
        'src/stories/**',
        'src/examples/**',
        '**/vitest.setup.ts',
        '**/vitest.config.ts',
        '**/vitest.unit.config.ts',
        '**/vitest.storybook.config.ts',
        '**/vite.config.ts',
        '**/tailwind.config.js',
        '**/postcss.config.js',
        '**/.eslintrc.cjs',
        '**/tsconfig*.json',
        '**/package.json',
        '**/package-lock.json',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: false, // Only include files that are actually tested
      thresholds: {
        statements: 30,
        branches: 30,
        functions: 30,
        lines: 30,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    reporters: ['default'],
    sequence: {
      shuffle: true,
    },
    server: {
      deps: {
        inline: [/@testing-library\/dom/],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}); 