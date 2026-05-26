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
- REST client kept for detail (`/[name]`) and team — single-resource fetches do not suffer N+1

**Client-side GraphQL (list / type filter):**

Interactive list and type-filter changes call `pokeapiGraphql` from the browser via TanStack Query (`usePokemonListPage` → `lib/pokeapi/graphql/pokemon-list.ts`). The endpoint URL (`graphql.pokeapi.co`) is visible in DevTools — that is expected, not a leaked secret:

- PokeAPI GraphQL is a **public read API** with no API keys; CORS allows browser `fetch`
- This is not the same as exposing a private backend: there is no auth, admin surface, or credentials in the bundle
- Rate limits apply **per client IP** (~100 req/h), not to a shared server quota; TanStack Query `staleTime` reduces repeat calls

**Why client, not only server:** Server `searchParams` on the home page forced a ~1s RSC refetch on every type change. Client Query + URL sync (`router.replace`) keeps shareable `?type=` / `?offset=` without blocking navigation on server GraphQL.

**Production follow-up (out of scope here):** A Route Handler / BFF proxy would centralize traffic, add server-side caching, and protect a shared rate-limit budget — useful at scale, not required when the upstream API is public and read-only.

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

`/` (list), `/[name]` (detail), `/team` — no `/pokemon` prefix.

## Page caching strategy

Production build output (`pnpm build`):

| Route     | Rendering   | Revalidate | Notes                                           |
| --------- | ----------- | ---------- | ----------------------------------------------- |
| `/`       | Static (○)  | 1h         | Shell pre-rendered; list data is client-fetched |
| `/[name]` | SSG (●)     | —          | 151 Gen 1 paths via `generateStaticParams`      |
| `/team`   | Dynamic (ƒ) | —          | SSR on every request                            |

**Legend:** ○ prerendered static content · ● SSG (`generateStaticParams`) · ƒ server-rendered on demand.

### `/` — static shell + client list

[`app/page.tsx`](../app/page.tsx) does **not** declare `searchParams`, so changing `?type=` / `?offset=` does not invalidate or block the page shell.

- **Server (ISR):** `getAllTypes()` → REST `GET /type` with `next.revalidate: 3600` (`POKEMON_LIST_REVALIDATE_SECONDS`) — build shows **Revalidate 1h / Expire 1y**
- **Client:** Pokémon rows load via TanStack Query (`usePokemonListPage` → GraphQL); `staleTime: 60_000` in [`QueryProvider`](../components/providers/QueryProvider.tsx) dedupes repeat navigations
- **Why split:** Server only caches the type filter list; paginated/filtered rows stay off the RSC path so in-app navigation stays fast (see "TanStack Query for list + type filter" above)

### `/[name]` — SSG for Gen 1

[`app/[name]/page.tsx`](../app/[name]/page.tsx) uses `generateStaticParams` to pre-render the first **151** Pokémon (names from GraphQL `getPokemonListPage(151, 0)` at build time).

- **Build-time fetch:** `getPokemonByName(name)` → REST `GET /pokemon/{name}` with default fetch cache (no `revalidate` option) — HTML is fully static until the next deploy
- **Beyond Gen 1:** `dynamicParams` defaults to `true`; valid slugs not in the 151 pre-built paths still render on first request (on-demand SSR), then follow default Next.js caching for that path — **404 is PokeAPI-not-found only**, not missing from `generateStaticParams`
- **Why SSG:** Detail pages are read-heavy and shareable; pre-rendering Gen 1 covers the primary browse path with zero server work per hit

### `/team` — dynamic SSR

[`app/team/page.tsx`](../app/team/page.tsx) reads `searchParams.pokemons`, so Next.js marks the route **dynamic (ƒ)**.

- **Server:** `resolveTeamPageData` fetches up to 3 Pokémon via REST on each request — no `next.revalidate` / tags (user-specific, URL-driven)
- **Client:** Zustand holds in-session edits; URL sync for sharing (see "Team slots: Zustand + URL" below)
- **Why dynamic:** Team composition is query-param state; caching a shared HTML response would serve the wrong roster

### Shared constants

Defined in [`lib/constants.ts`](../lib/constants.ts):

- `POKEMON_LIST_REVALIDATE_SECONDS = 3600` — REST `/type` (home shell) and GraphQL list queries used at build time (`POKEMON_LIST_CACHE_TAG = 'pokemon-list'`)
- Detail routes (`getPokemonByName`) use default fetch cache — Gen 1 HTML is static at build; Gen 2+ on-demand paths rely on Next.js defaults, not app-level revalidate constants

## Hybrid component layout

- `components/ui/` — shadcn/Radix primitives (design system)
- `components/pokemon/` — domain components

Not full atomic design — unnecessary for this scope.

## shadcn/ui over raw Radix

Owned, styled, accessible components in-repo; Storybook documents the library.

## Team slots: Zustand + URL

- **Zustand** — in-session UI state (add/remove from list cards, team page edits)
- **URL** — shareable team via optional `?pokemons=` on `/team` (same pattern as list `type`/`offset`)
- On team page load: URL param wins when present; otherwise store hydrates URL
- Max **3** slots; comma-separated PokeAPI slugs; plain `/team` valid (empty team)
- Invalid URL segments dropped individually (malformed slugs sync; unknown names async via PokeAPI 404); cap at 3 after sanitize; URL rewritten to match

## Team stats visualization: shadcn Progress + Recharts

- **Progress bars** — shadcn/ui `Progress` (Radix primitive) in `components/ui/progress.tsx`; stat fill = `base_stat / 255`, styled with existing design tokens
- **Radar chart** — Recharts `RadarChart` via shadcn `Chart` wrapper (`components/ui/chart.tsx`); overlaid series for up to 3 team Pokémon
- **Not D3.js** — imperative SVG manipulation is unnecessary for 6-axis radar and linear stat bars; Recharts is declarative and matches our shadcn stack
- **Not WebGL** — team workload is O(slots × stats) with max 18 points; SVG rendering is sufficient and keeps SSR/a11y/testing simple
- Chart colors use CSS variables (`--chart-1` … `--chart-3`) in `globals.css`, consistent with shadcn Chart theming
- Domain components live in `components/pokemon/` (`TeamRadarChart`, stat rows with `Progress`); no fetch/Query inside `ui/`

## AI team suggestion (deferred)

**Problem:** With 2 of 3 team slots filled, users may not know which Pokémon improves **type coverage** (e.g. Charizard + Blastoise still weak to Electric or Rock). A bounded AI assist is more useful than a generic chat.

**Decision (intended, not shipped):** Add `POST /api/ai/suggest` and a Team page CTA — deferred for assessment time. Document here and in [README TODO](../README.md#todo-time-boxed-for-assessment).

**Request (when built):**

```json
{ "slots": ["charizard", "blastoise"] }
```

- `slots.length` must be **2** for v1 (suggest 3rd only); slugs normalized like [`lib/team/url.ts`](../lib/team/url.ts); unknown names → `400`

**Response (when built):**

```json
{
  "suggestion": { "name": "rotom-wash", "types": ["electric", "water"] },
  "reasoning": "…type matchup only, ~3 sentences…",
  "coverage": {
    "teamWeakTo": ["rock", "electric"],
    "suggestionResists": ["water", "electric"]
  }
}
```

**Why hybrid (code + LLM), not LLM-only:**

- **Ground truth in `lib/team/type-coverage.ts`** — aggregate defensive weaknesses from PokeAPI REST `GET /type/{name}` `damage_relations` (same data layer as detail/team; MSW-testable)
- **Candidate pool** — GraphQL filter by types that resist team weaknesses; exclude names already in `slots`; cap ~25 names so the model cannot invent Pokémon
- **LLM** — Vercel AI SDK `generateObject` + Zod: pick `name` from enum(candidateSlugs), write `reasoning`; final slug checked with `pokemonExists`
- **UI** — [`TeamView`](../components/pokemon/TeamView.tsx): button when `slots.length === 2`; show reasoning; **Add to team** uses existing store + `buildTeamHref` (no silent auto-add)

**Env / ops:**

- `OPENAI_API_KEY` server-only (document in `.env.example` when implemented); `503` if missing
- CI tests mock LLM; no API key in GitHub Actions

**Out of scope for v1:** open chat, MCP, auto-fill without confirm, suggest-2nd when 1 slot filled

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
