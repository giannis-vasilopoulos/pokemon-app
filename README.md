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

## Scripts

| Script                 | Description                    |
| ---------------------- | ------------------------------ |
| `pnpm dev`             | Start Next.js dev server       |
| `pnpm build`           | Production build               |
| `pnpm lint`            | ESLint                         |
| `pnpm typecheck`       | TypeScript check               |
| `pnpm test`            | Vitest (watch)                 |
| `pnpm test:run`        | Vitest (CI)                    |
| `pnpm test:e2e`        | Playwright E2E                 |
| `pnpm storybook`       | Component library on port 6006 |
| `pnpm build-storybook` | Static Storybook export        |
| `pnpm format`          | Prettier write                 |

## Architecture

```
app/                  # Next.js App Router (/, /[name], /team)
components/
  ui/                 # shadcn/ui design system (Radix + Tailwind)
  pokemon/            # Domain components
lib/pokeapi/          # REST + GraphQL clients, types, mappers, MSW mocks
  graphql/            # Thin GraphQL client (PokeAPI v1beta2)
hooks/                # TanStack Query hooks
stores/               # Zustand (team slots)
```

### List pagination (assessment)

The list page needs more than names — cards show types and other summary fields. With the REST API, `GET /pokemon?limit=40&offset=N` returns only `{ name, url }` per row, so loading a full page of cards would require **1 + N requests** (classic N+1).

**GraphQL** ([PokeAPI v1beta2](https://graphql.pokeapi.co/v1beta2)) resolves this in a single round trip: paginated `pokemon` rows plus nested fields (e.g. types) and total count via `pokemon_aggregate` in one query.

- **No type filter:** GraphQL `pokemon(limit, offset)` + `pokemon_aggregate` (one request per page)
- **Type filter:** GraphQL `pokemon(where: { pokemontypes: … })` with the same limit/offset (one request per page; replaces REST `GET /type/{name}` + client-side slice)
- URL state: `/?type=fire&offset=40`
- Client: thin `fetch` wrapper in `lib/pokeapi/graphql/` (no Apollo/graphql-request); TanStack Query handles caching

REST (`lib/pokeapi/client.ts`) remains for detail and team routes where single-resource fetches are sufficient.

### State ownership

| Concern                   | Tool             |
| ------------------------- | ---------------- |
| Server data (list, types) | TanStack Query   |
| Team slots                | Zustand          |
| List filter/page          | URL searchParams |

## Testing

- **Vitest + MSW** — unit tests for API client, pagination, stores
- **Playwright** — smoke E2E for list and team routes
- **Storybook** — isolated component development

## AI workflow

Cursor rules live in `.cursor/rules/`. AI assists with boilerplate; all diffs are human-reviewed. See `docs/DECISIONS.md` for ADRs.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [PokeAPI REST](https://pokeapi.co/docs/v2)
- [PokeAPI GraphQL](https://pokeapi.co/docs/graphql)
