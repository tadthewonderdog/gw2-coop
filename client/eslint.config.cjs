// @ts-check
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");
const tsParser = require("@typescript-eslint/parser");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      "dist",
      "coverage",
      ".eslintrc.cjs",
      "eslint.config.cjs",
      "vite.config.ts",
      "src/scripts/**",
      "storybook-static/**",
      "vitest.*.config.ts",
      "vitest.shims.d.ts",
      "node_modules/",
      "build/",
      "*.js",
      "*.jsx",
      "*.d.ts",
      ".env*",
      ".storybook/*",
    ],
  },
  js.configs.recommended,
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended"
  ),
  {
    plugins: {
      "react-refresh": require("eslint-plugin-react-refresh"),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          path.resolve(__dirname, "./tsconfig.app.json"),
          path.resolve(__dirname, "./tsconfig.node.json"),
        ],
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // React Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // React Core
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      // React Performance & Security
      "react/jsx-no-constructed-context-values": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
      // Import/Export
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      // Accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      // Code Quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
    },
  },
]; 