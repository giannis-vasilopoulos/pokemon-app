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

## Compare slots: Zustand + URL

- **Zustand** — in-session UI state (add/remove from list cards, compare page edits)
- **URL** — shareable team via optional `?pokemons=` on `/compare` (same pattern as list `type`/`offset`)
- On compare page load: URL param wins when present; otherwise store hydrates URL
- Max **3** slots; comma-separated PokeAPI slugs; plain `/compare` valid (empty team)
- Invalid URL segments dropped individually (malformed slugs sync; unknown names async via PokeAPI 404); cap at 3 after sanitize; URL rewritten to match

## Compare stats visualization: shadcn Progress + Recharts

- **Progress bars** — shadcn/ui `Progress` (Radix primitive) in `components/ui/progress.tsx`; stat fill = `base_stat / 255`, styled with existing design tokens
- **Radar chart** — Recharts `RadarChart` via shadcn `Chart` wrapper (`components/ui/chart.tsx`); overlaid series for up to 3 compared Pokémon
- **Not D3.js** — imperative SVG manipulation is unnecessary for 6-axis radar and linear stat bars; Recharts is declarative and matches our shadcn stack
- **Not WebGL** — compare workload is O(slots × stats) with max 18 points; SVG rendering is sufficient and keeps SSR/a11y/testing simple
- Chart colors use CSS variables (`--chart-1` … `--chart-3`) in `globals.css`, consistent with shadcn Chart theming
- Domain components live in `components/pokemon/` (`CompareRadarChart`, stat rows with `Progress`); no fetch/Query inside `ui/`

## Storybook

Documents `ui/` and `pokemon/` components in isolation.

## Husky pre-commit

lint-staged runs ESLint + Prettier on staged files only. Tests run in CI.
