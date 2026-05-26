# Architecture Decisions

## pnpm over npm

Faster installs, strict dependency resolution, lockfile committed.

## Vitest + Playwright over Jest/Cypress

Vitest integrates with Vite/ESM; Playwright is the modern default for Next.js E2E.

## MSW for PokeAPI mocking

Unit tests intercept `fetch` at the network layer via MSW handlers — same code path as production.

## GraphQL for Pokémon list

**Problem:** REST list endpoint (`GET /pokemon?limit=40&offset=N`) returns only `{ name, url }` per Pokémon. Rendering list cards with types (and other summary fields) would require one additional request per row — **41 HTTP calls per page** (1 list + 40 details), a classic N+1.

**Decision:** Use [PokeAPI GraphQL v1beta2](https://graphql.pokeapi.co/v1beta2) for list and type-filtered list fetching.

**Why it helps:**

- One query returns paginated rows **and** nested relations (e.g. `pokemontypes { type { name } }`) plus total count via `pokemon_aggregate` — no per-card follow-up requests
- Type filter uses the same pattern: `pokemon(where: { pokemontypes: { type: { name: { _eq: "fire" } } } }, limit, offset)` instead of fetching the entire type roster via REST and slicing client-side

**Client choice:** Thin `fetch` wrapper (`lib/pokeapi/graphql/client.ts`), not Apollo or graphql-request — zero extra bundle cost, mirrors existing `pokeapiFetch`, works in RSC and Vitest/MSW.

**Trade-offs:**

- GraphQL endpoint is rate-limited (100 req/h/IP) and beta; TanStack Query + Next.js fetch cache mitigate repeat traffic
- REST client kept for detail (`/[name]`) and compare — single-resource fetches do not suffer N+1

## TanStack Query for list + type filter

Dual pagination modes (both backed by GraphQL):

- Default list: `pokemon(limit, offset)` + `pokemon_aggregate` in one GraphQL request
- Type filter: filtered `pokemon` query with same pagination args (cached by Query key `['type-pokemon', typeName, offset]`)

**Navigation (type / offset):**

- Server [`app/page.tsx`](../app/page.tsx) fetches **types only** (REST `/type`, cached via `revalidate`) — it does **not** declare `searchParams`, so changing `?type=` / `?offset=` does not block on a server RSC refetch + GraphQL round-trip
- List rows load in the **client** via TanStack Query (`usePokemonListPage`); URL stays shareable via `useSearchParams` + `router.replace` in [`PokemonListPage`](../components/pokemon/PokemonListPage.tsx) (`lib/list/url.ts` helpers)
- `placeholderData: keepPreviousData` avoids a blank list while the next query loads; skeleton only on first load (`isPending` without placeholder)
- Trade-off: cold load of `/?type=fire` shows a brief list skeleton until the client query completes (faster than ~1s frozen in-app navigation)

## No TanStack Virtual

Only 40 DOM nodes per page. Frontend pagination slices data, not the render tree.

## React Compiler

**Decision:** Enable React Compiler via `reactCompiler: true` in `next.config.ts` and `babel-plugin-react-compiler` (Next.js 16 + React 19).

**Why:**

- Aligns with React's direction: automatic memoization at compile time instead of sprinkling `useMemo`, `useCallback`, and `memo` across client components
- Low-risk opt-in for a greenfield app — no runtime API changes, compiler output is validated by existing Vitest and CI build gates

**Not a performance play for this app:**

- List page renders at most 40 cards; re-render cost is not a bottleneck (see "No TanStack Virtual" above)
- Real wins remain in data fetching (GraphQL batching, TanStack Query caching), not component memoization

**Rules of React linting:**

- Already covered — no separate `eslint-plugin-react-compiler` needed
- `eslint-config-next` (via `core-web-vitals`) enables `eslint-plugin-react-hooks@7` `recommended` config, which includes compiler-backed rules (`react-hooks/purity`, `react-hooks/immutability`, `react-hooks/refs`, etc.) alongside `rules-of-hooks` and `exhaustive-deps`
- Enforced in CI via `pnpm lint`

**Trade-offs:**

- Slightly longer production builds (compile-time analysis)
- Rules of React violations surface in ESLint (edit/CI) and may cause the compiler to skip optimizing affected components at build time
- Existing manual memo hooks (e.g. in `PokemonListPage`) are redundant but harmless; can be removed incrementally as confidence grows

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

## GitHub Actions CI

Workflow: `.github/workflows/ci.yml` — single `quality` job on `ubuntu-latest`.

**Triggers:** push and pull requests targeting `main`.

**Steps (in order):**

1. `pnpm install --frozen-lockfile` — pnpm 9, Node from `.nvmrc`, pnpm cache via `actions/setup-node`
2. `pnpm lint` — ESLint, zero warnings allowed
3. `pnpm typecheck` — `tsc --noEmit`
4. `pnpm test:run` — Vitest unit/integration (MSW-mocked PokeAPI)
5. `pnpm build` — Next.js production build gate

**Not in CI:**

- **Playwright E2E** — browser install and runtime cost; run locally via `pnpm test:e2e`
- **Prettier check** — enforced on staged files via Husky/lint-staged before commit
