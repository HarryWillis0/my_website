# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a personal learning project — each directory is a self-contained implementation of the same website in a different language or framework. New implementations are added as new directories; old ones are preserved for reference.

## Repository structure

```
my_website/
├── frontends/
│   ├── react/          # older React implementation
│   └── svelte/         # active SvelteKit implementation
└── backends/
    ├── servers/
    │   └── node/       # Express + TypeScript server
    └── apis/
        └── go/         # Go standard-library HTTP API
```

The active frontend is **`frontends/svelte`**. CI deploys whichever frontend is set in the `DIST_FRONTEND` GitHub Actions variable.

## Commands

### Svelte frontend (`frontends/svelte/`)

```bash
npm run dev       # local dev server
npm run build     # production build
npm test          # run Vitest tests
npm run check     # type-check with svelte-check
npm run lint      # Prettier + ESLint
npm run format    # auto-format
```

Run a single test file:
```bash
npx vitest run src/tests/unit/FileArticleService.test.ts
```

### Go API (`backends/apis/go/`)

```bash
go run ./cmd/api/main.go    # start API on :8080
go test ./...               # run all tests
```

### Node server (`backends/servers/node/`)

```bash
npm run dev     # dev server with nodemon
npm run build   # compile TypeScript
npm start       # run compiled output
```

## Architecture — Svelte frontend

Data flows through a service interface (`IArticleService`) so the data source can be swapped without touching components. Currently `FileArticleService` reads from `src/lib/data/articles.json` at build time (no runtime API call). The Go API in `backends/apis/go/` serves the same article data and is the intended future backend.

- **Routes** use SvelteKit file-based routing; server-side data loading happens in `+page.server.ts` files.
- **Components** live in `src/lib/components/`, scoped by feature (e.g. `article/`).
- **Types** are in `src/lib/types/`; `IArticle` is the core domain type, `api.ts` holds DTO shapes.
- **Tailwind v4** is used for styling (configured via `@tailwindcss/vite`, no `tailwind.config` file).

## Deployment

Push to `main` triggers the GitHub Actions workflow which builds the chosen frontend, packages it as a Docker container, pushes to Google Artifact Registry, and deploys to Google Cloud Run.
