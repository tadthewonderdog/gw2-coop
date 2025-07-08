module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
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
  ],
  ignorePatterns: ["dist", "coverage", ".eslintrc.cjs", "vite.config.ts", "src/scripts/**"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.app.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-refresh", "react", "@typescript-eslint", "import", "jsx-a11y"],
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

    // TypeScript
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",

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
};
