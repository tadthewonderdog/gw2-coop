/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path - use environment variable or default to /gw2-coop/ for production
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === "production" ? "/gw2-coop/" : "/"),
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/setup.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
          ],
          "utils-vendor": ["zod", "zustand", "@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
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
