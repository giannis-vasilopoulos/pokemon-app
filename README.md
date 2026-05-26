# Pokémon App

Tech assessment app for browsing, filtering, and building Pokémon teams via [PokeAPI](https://pokeapi.co/).

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- [pnpm](https://pnpm.io/)

## Setup

```bash
pnpm install
cp .env.example .env.local   # optional
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional env overrides (see [`.env.example`](.env.example)):

- `NEXT_PUBLIC_POKEAPI_BASE_URL` — REST API base
- `NEXT_PUBLIC_POKEAPI_GRAPHQL_URL` — GraphQL endpoint (defaults in [`lib/constants.ts`](lib/constants.ts))

## Scripts

| Script                 | Description                    |
| ---------------------- | ------------------------------ |
| `pnpm dev`             | Start Next.js dev server       |
| `pnpm build`           | Production build               |
| `pnpm start`           | Run production build           |
| `pnpm lint`            | ESLint                         |
| `pnpm lint:fix`        | ESLint with auto-fix           |
| `pnpm typecheck`       | TypeScript check               |
| `pnpm test`            | Vitest (watch)                 |
| `pnpm test:coverage`   | Vitest Coverage                |
| `pnpm test:run`        | Vitest (CI)                    |
| `pnpm test:e2e`        | Playwright E2E                 |
| `pnpm test:e2e:ui`     | Playwright interactive UI      |
| `pnpm storybook`       | Component library on port 6006 |
| `pnpm build-storybook` | Static Storybook export        |
| `pnpm format`          | Prettier write                 |
| `pnpm format:check`    | Prettier check (no write)      |

## Routes and features

| Route     | What it does                                                                            |
| --------- | --------------------------------------------------------------------------------------- |
| `/`       | Paginated list (40 per page), type filter, search; **Team tray** to add up to 3 Pokémon |
| `/[name]` | Detail page (sprites, types, stats, abilities); Gen 1 pre-rendered at build time        |
| `/team`   | Team stats table + overlaid radar chart; shareable via `?pokemons=slug1,slug2`          |

Architecture decisions (caching, GraphQL vs REST, team URL rules, charts, deferred AI) live in [`docs/DECISIONS.md`](docs/DECISIONS.md).

## Architecture

```
app/                      # Next.js App Router (/, /[name], /team)
components/
  ui/                     # shadcn/ui primitives (Radix + Tailwind)
  pokemon/                # Domain UI (list, cards, team charts)
  layout/                 # App nav
  providers/              # TanStack Query provider
docs/                     # ADRs (DECISIONS.md)
e2e/                      # Playwright specs
hooks/                    # TanStack Query + team detail hooks
lib/
  pokeapi/                # REST + GraphQL clients, types, mappers, MSW mocks
    graphql/              # Thin GraphQL client (PokeAPI v1beta2)
  team/                   # Team URL, resolve, validate, stat highlights
  list/                   # List page URL helpers
  pokemon/                # Type colors and shared Pokémon UI helpers
stores/                   # Zustand (team slots)
```

### List pagination (assessment)

The list page needs more than names — cards show types and other summary fields. With the REST API, `GET /pokemon?limit=40&offset=N` returns only `{ name, url }` per row, so loading a full page of cards would require **1 + N requests** (classic N+1).

**GraphQL** ([PokeAPI v1beta2](https://graphql.pokeapi.co/v1beta2)) resolves this in a single round trip: paginated `pokemon` rows plus nested fields (e.g. types) and total count via `pokemon_aggregate` in one query.

- **No type filter:** GraphQL `pokemon(limit, offset)` + `pokemon_aggregate` (one request per page)
- **Type filter:** GraphQL `pokemon(where: { pokemontypes: … })` with the same limit/offset (one request per page; replaces REST `GET /type/{name}` + client-side slice)
- URL state: `/?type=fire&offset=40`
- **Types dropdown:** server-fetched on `/` (REST `/type`, ISR); list rows load on the **client** via TanStack Query so filter/page changes stay fast
- Client: thin `fetch` wrapper in `lib/pokeapi/graphql/` (no Apollo/graphql-request)

REST (`lib/pokeapi/client.ts`) remains for detail and team routes where single-resource fetches are sufficient.

### State ownership

| Concern                          | Tool                                                      |
| -------------------------------- | --------------------------------------------------------- |
| Type filter options on `/`       | Server fetch (`getAllTypes`), passed into list UI         |
| List rows (paginated / filtered) | TanStack Query (client GraphQL)                           |
| Team slots (in-session)          | Zustand                                                   |
| List filter and page             | URL `searchParams` (`?type=`, `?offset=`)                 |
| Shareable team roster            | URL `?pokemons=` on `/team` (+ Zustand sync on team page) |
| Team page Pokémon details        | Server resolve on load; client hook for slot edits        |

## Testing

- **Vitest + MSW** — unit tests for API client, GraphQL list, team URL/resolve, stores
- **Playwright** — E2E in `e2e/` (smoke, search, type filter, detail); run locally via `pnpm test:e2e` (not in GitHub Actions CI)
- **Storybook** — isolated `ui/` and `pokemon/` components

CI (`.github/workflows/ci.yml`): `lint`, `typecheck`, `test:run`, `build`.

## AI workflow

Cursor rules live in `.cursor/rules/`. AI assists with boilerplate; all diffs are human-reviewed.

## TODO (time-boxed for assessment)

The following would normally be implemented; deferred for time. Design and rationale are documented in [`docs/DECISIONS.md`](docs/DECISIONS.md#ai-team-suggestion-deferred).

- **AI 3rd-member suggestion** — On `/team`, when 2 of 3 slots are filled (e.g. Charizard + Blastoise), a **Suggest 3rd Pokémon** action would call `POST /api/ai/suggest` with `{ "slots": ["charizard", "blastoise"] }` and return a PokeAPI-valid slug plus short **type-coverage reasoning** (not open-ended chat). User confirms before adding via existing Zustand + `?pokemons=` URL sync. Planned stack: deterministic coverage from PokeAPI `damage_relations` in `lib/team/`, GraphQL candidate pool, LLM pick + prose via Vercel AI SDK (`OPENAI_API_KEY` server-only). See ADR for request/response shape and validation rules.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [PokeAPI REST](https://pokeapi.co/docs/v2)
- [PokeAPI GraphQL](https://pokeapi.co/docs/graphql)
