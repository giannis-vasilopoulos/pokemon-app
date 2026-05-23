# Architecture Decisions

## pnpm over npm

Faster installs, strict dependency resolution, lockfile committed.

## Vitest + Playwright over Jest/Cypress

Vitest integrates with Vite/ESM; Playwright is the modern default for Next.js E2E.

## MSW for PokeAPI mocking

Unit tests intercept `fetch` at the network layer via MSW handlers — same code path as production.

## TanStack Query for list + type filter

Dual pagination modes:

- Default list: API `limit=40&offset=N`
- Type filter: fetch `/type/{name}` once, slice pages in client (cached by Query)

## No TanStack Virtual

Only 40 DOM nodes per page. Frontend pagination slices data, not the render tree.

## Flat routes

`/` (list), `/[name]` (detail), `/compare` — no `/pokemon` prefix.

## Hybrid component layout

- `components/ui/` — shadcn/Radix primitives (design system)
- `components/pokemon/` — domain components

Not full atomic design — unnecessary for this scope.

## shadcn/ui over raw Radix

Owned, styled, accessible components in-repo; Storybook documents the library.

## Zustand for compare slots only

Server data stays in TanStack Query. List pagination/type in URL + Query.

## Storybook

Documents `ui/` and `pokemon/` components in isolation.

## Husky pre-commit

lint-staged runs ESLint + Prettier on staged files only. Tests run in CI.
