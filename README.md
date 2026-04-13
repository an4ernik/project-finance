# Monity — Personal Finance App

A personal finance tracker built with React, Vite, and TypeScript.

## Tech stack

| Layer        | Tools                                  |
| ------------ | -------------------------------------- |
| UI           | React 19, Tailwind CSS v4, shadcn/ui   |
| Routing      | React Router v7                        |
| Server state | TanStack Query v5                      |
| Client state | Zustand                                |
| Forms        | React Hook Form + Zod                  |
| HTTP         | Axios (with refresh-token interceptor) |
| i18n         | i18next (en / ua)                      |
| Build        | Vite 7                                 |

## Getting started

### Prerequisites

- Node.js `24` (use [nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- npm `>=10`

### Setup

```bash
# 1. Clone
git clone https://github.com/an4ernik/project-finance.git
cd project-finance

# 2. Install dependencies (also sets up git hooks via husky)
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env if you need to point at a different backend

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment variables

| Variable            | Description                          | Default                |
| ------------------- | ------------------------------------ | ---------------------- |
| `VITE_API_BASE_URL` | Backend base URL (no trailing slash) | AWS AppRunner instance |

Copy `.env.example` to `.env` and override values as needed. Never commit `.env`.

## Available scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start Vite dev server with API proxy    |
| `npm run build`      | Type-check + production build           |
| `npm run type-check` | Run `tsc --noEmit` without building     |
| `npm run lint`       | Run ESLint                              |
| `npm run lint:fix`   | Run ESLint with auto-fix                |
| `npm run format`     | Run Prettier on all files               |
| `npm test`           | Run tests once (CI mode)                |
| `npm run test:watch` | Run tests in watch mode                 |
| `npm run generate`   | Regenerate API client from OpenAPI spec |
| `npm run preview`    | Preview the production build locally    |

## Project structure

```
src/
├── assets/           # Static assets and bundled API spec
├── components/
│   ├── ui/           # Primitive UI components (shadcn-based)
│   └── landing/      # Landing page components
├── layouts/          # Page layout wrappers
├── lib/              # Utility functions
├── locales/          # i18n translation files (en, ua)
├── pages/            # Route-level page components
├── shared/
│   ├── api/
│   │   ├── axios.ts        # Axios instance + refresh interceptor
│   │   ├── generated/      # Auto-generated API hooks (do not edit)
│   │   └── models/         # Auto-generated DTOs (do not edit)
│   ├── providers/    # Context providers (theme, etc.)
│   └── store/        # Zustand stores
└── test/             # Test setup
```

## API client generation

The API client under `src/shared/api/generated/` and `src/shared/api/models/` is auto-generated from the OpenAPI spec using [Orval](https://orval.dev). Do not edit these files manually.

To regenerate after a backend change:

```bash
npm run generate
```

## Contributing

1. Branch off `main` with a descriptive name: `feat/add-budget-page`, `fix/login-redirect`
2. Keep PRs focused — one concern per PR
3. Fill in the PR template (auto-populated on GitHub)
4. CI must pass before merging (type-check, lint, tests, build)

Pre-commit hooks (via husky + lint-staged) will auto-fix formatting and run ESLint on staged files.
