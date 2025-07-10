# GW2 Co-op Client

![CI](https://github.com/tadthewonderdog/gw2-coop/actions/workflows/ci.yml/badge.svg)

A modern, robust, and type-safe React application for Guild Wars 2 cooperative gameplay. Built with TypeScript, Vite, Tailwind CSS, Shadcn UI, Radix UI, Zustand, TanStack React Query, and Zod. Designed for performance, maintainability, and developer experience.

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
$ git clone https://github.com/tadthewonderdog/gw2-coop.git
$ cd gw2-coop/client

# 2. Install dependencies
$ npm install

# 3. Set up environment variables
$ cp .env.example .env
# Edit .env as needed (see below)

# 4. Start the dev server
$ npm run dev
# App: http://localhost:3000
```

---

## 🏗️ Architecture & Patterns

- **TypeScript-first**: All code is strictly typed, with runtime validation via [Zod](https://zod.dev/).
- **Functional, Modular Design**: Components, hooks, and stores are small, composable, and colocated with tests.
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/) for client state, [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview) for server state.
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/docs), [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction) for accessible, modern, and customizable UI.
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **Validation**: [Zod](https://zod.dev/) for all user input and API data.
- **Performance**: Dynamic imports, memoization, code splitting, and image optimization (WebP, lazy loading).
- **Error Handling**: Custom error types, error boundaries, and early returns for robust UX.
- **CI/CD**: Automated lint, type-check, test, and build on PRs and pushes.

---

## 🧩 Project Structure

```
src/
├── api/           # API utilities and integrations
├── assets/        # Static assets (images, SVGs, etc.)
├── components/    # Reusable UI components (Shadcn, Radix, custom)
│   └── ui/        # UI primitives and patterns
├── examples/      # Example components and usage
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Page components
├── services/      # API clients and service logic
├── stores/        # Zustand stores for state management
├── styles/        # Global styles and Tailwind config
│   └── themes/    # Theme definitions (dark, light, tokens)
├── test/          # Test utilities and setup
└── index.css      # Global CSS entry
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/docs), [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction), [Lucide React](https://lucide.dev/)
- **State**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting/Formatting**: ESLint, Prettier

---

## 🧪 Testing & Quality Gates

- **Unit/Component Tests**: In `__tests__` folders next to code (enforced by lint rules).
- **Integration/Utility Tests**: In `src/test/`.
- **Validation**: Run all checks with `npm run validate` (lint, format, type-check, test).
- **CI/CD**: All PRs and pushes run full validation and build (see `.github/workflows/ci.yml`).
- **Coverage**: Run `npm run test:coverage` for coverage report.
- **Quality Gates**: PRs must pass all checks before merge.

---

## 🌐 Environment Variables

- Copy `.env.example` to `.env` and edit as needed.
- Example:
  ```env
  VITE_USE_GW2_CACHE=true  # Enable/disable achievement data caching
  ```
- **Never commit secrets or sensitive keys.**

---

## 🏆 Features

### Achievement Data Caching

- Toggle with `VITE_USE_GW2_CACHE`.
- Cached data in `public/data/*.json`.
- Falls back to live API if cache fails.
- Refresh cache: `npm run fetch-achievement-data`.

### API Key Management

- Multiple keys (up to 50), real-time validation, character display, filtering, selection, import/export, duplicate handling, and robust error handling.
- All data stored locally (no server transmission).

### UI/UX & Accessibility

- Mobile-first, responsive design.
- Accessible components (Radix, Shadcn).
- Consistent theming (dark/light).
- Optimized images (WebP, lazy loading).

### Error Handling & Validation

- Early returns, guard clauses, and custom error types.
- Zod for all schema validation.
- Error boundaries for robust UX.

### Performance

- Dynamic imports, code splitting, memoization.
- Responsive, fast, and optimized for bundle size.

---

## 🧑‍💻 Contributing

1. Create a feature branch.
2. Follow code style and best practices (see below).
3. Run all validation: `npm run validate`.
4. Submit a pull request (use templates).
5. All PRs are tracked on the [Project Board](https://github.com/users/tadthewonderdog/projects/2/).

### Code Style & Best Practices

- Functional, modular TypeScript (no classes).
- Descriptive variable names (e.g., `isLoading`, `hasError`).
- Avoid files >200-300 lines; refactor as needed.
- No code mocking/stubbing in dev/prod.
- Use JSDoc for functions/components.
- Add comments for complex logic.
- Prefer iteration and modularization over duplication.
- Responsive, accessible, and consistent UI.

---

## 📚 Resources

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 📦 Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Coverage report
- `npm run lint` - Lint
- `npm run lint:fix` - Auto-fix lint
- `npm run format` - Format code
- `npm run format:check` - Check formatting
- `npm run type-check` - TypeScript check
- `npm run validate` - All checks
- `npm run fetch-achievement-data` - Refresh GW2 achievement cache

---

## 📄 License

MIT

---

## 🏁 Maintainers & Project Management

- [Project Board](https://github.com/users/tadthewonderdog/projects/2/)
- Issues and PRs are tracked and managed via GitHub Projects.

---

## 🏅 Quality Gates & CI/CD

- All PRs and pushes to `main`/`github-integration` run:
  - Lint (ESLint)
  - Format (Prettier)
  - Type-check (TypeScript)
  - Unit/integration tests (Vitest)
  - Build verification
- See `.github/workflows/ci.yml` for details.

---

## 📝 Documentation & Developer Experience

- All major functions/components use JSDoc for IDE intellisense.
- See `src/components/`, `src/hooks/`, and `src/stores/` for code-level docs.
- For architecture, patterns, and advanced usage, see this README and in-code comments.

---

## 🦾 Acknowledgements

- [Guild Wars 2 API](https://wiki.guildwars2.com/wiki/API:Main)
- [Shadcn UI](https://ui.shadcn.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Zod](https://zod.dev/)
- [Vite](https://vite.dev/)

---
