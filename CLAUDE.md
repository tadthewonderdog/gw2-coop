# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Essential commands for building, testing, and development:

```bash
# Development
npm run dev                    # Start dev server with Cloudflare Worker emulation
npm run build                  # Build for production (TypeScript compilation + Vite)
npm run build:preview          # Build for preview environment
npm run preview               # Preview production build locally
npm run deploy                # Deploy to Cloudflare Workers

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Auto-fix ESLint issues
npm run format                # Format code with Prettier
npm run format:check          # Check code formatting
npm run type-check            # TypeScript type checking
npm run validate              # Run lint + format check + type-check
npm run validate:prepush      # Full validation before push (includes tests)

# Testing
npm run test                  # Run all tests
npm run test:unit             # Run unit tests only
npm run test:storybook        # Run Storybook tests only
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Run tests with coverage report

# GW2 Data Management
npm run fetch:gw2-achievement-data  # Refresh cached GW2 achievement data

# Analysis & Security
npm run analyze:bundle        # Analyze JavaScript bundle size
npm run analyze:css           # Analyze CSS bundle size
npm run security:audit        # Run npm audit for security issues
npm run security:fix          # Auto-fix security issues

# Storybook
npm run storybook             # Start Storybook dev server
npm run build-storybook       # Build Storybook static site
```

## Architecture Overview

This is a **React 19 + TypeScript SPA** with **Cloudflare Workers** backend integration for Guild Wars 2 cooperative gameplay.

### Core Technologies
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components, Radix UI primitives
- **State Management**: Zustand (client state) + TanStack Query (server state)
- **Validation**: Zod schemas for all data
- **Testing**: Vitest + React Testing Library
- **Backend**: Cloudflare Workers with Hono framework
- **Build**: Vite with Cloudflare Workers integration

### Key Architectural Patterns

1. **Functional, TypeScript-first design** - No classes, everything strictly typed
2. **Zustand stores** for client state management (see `src/stores/`)
3. **TanStack Query** for server state and API caching
4. **Zod schemas** for runtime validation (see `src/types/`)
5. **Colocation** - tests live in `__tests__/` folders next to components
6. **Component composition** - Shadcn UI + Radix UI for accessible components

### Project Structure Deep Dive

```
src/
├── components/           # UI components
│   ├── ui/              # Shadcn UI primitives (Button, Card, etc.)
│   ├── achievements/    # Achievement-specific components
│   └── api-key/         # API key management components
├── stores/              # Zustand state stores
│   ├── achievements.ts  # Achievement data cache & loading states
│   ├── api-keys.ts      # API key storage (local only, never sent to server)
│   └── groups.ts        # Group management state
├── services/            # External API clients
│   └── gw2-api.ts       # Guild Wars 2 API integration
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript types & Zod schemas
├── pages/               # Route components
└── providers/           # React context providers
```

### State Management Architecture

- **Zustand stores** persist to localStorage where appropriate
- **TanStack Query** handles all GW2 API requests with intelligent caching
- **Achievement data** can be cached locally (`VITE_USE_GW2_CACHE=true`) or fetched live
- **API keys** are stored locally only - never transmitted to any server

### Cloudflare Workers Integration

- **Worker entry**: `worker/index.ts` (Hono app)
- **Static assets**: Served from `dist/client/` via Wrangler
- **API routes**: `/api/*` handled by worker, everything else serves React SPA
- **Configuration**: `wrangler.jsonc` with preview/production environments

### Testing Strategy

- **Unit/Component tests**: In `__tests__/` folders alongside code
- **Integration tests**: In `src/test/` directory
- **Vitest projects**: Separate configs for unit tests (`vitest.unit.config.ts`) and Storybook tests (`vitest.storybook.config.ts`)
- **Coverage**: HTML reports generated in `coverage/` directory

## Development Workflow

1. **Always run `npm run validate` before committing**
2. **Test commands**: Use project-specific test commands (`test:unit`, `test:storybook`)
3. **GW2 data**: Refresh cached data with `fetch:gw2-achievement-data` if needed
4. **Cloudflare deployment**: Use `npm run deploy` (requires Wrangler authentication)

## Code Conventions

- **Functional components** with TypeScript
- **Zod schemas** for all external data validation
- **Descriptive naming** (e.g., `isLoading`, `hasError`, `fetchUserAchievements`)
- **JSDoc comments** for complex functions
- **Early returns** and guard clauses for error handling
- **Memoization** where appropriate (React.memo, useMemo, useCallback)
- **No inline styles** - use Tailwind classes or CSS modules

## Important Notes

- **Security**: Never commit API keys or sensitive data
- **Performance**: Uses dynamic imports and code splitting
- **Accessibility**: Radix UI ensures WCAG compliance
- **Mobile-first**: Responsive design with Tailwind breakpoints
- **Error boundaries**: Implemented for robust error handling
- **Bundle analysis**: Use `analyze:bundle` and `analyze:css` for optimization