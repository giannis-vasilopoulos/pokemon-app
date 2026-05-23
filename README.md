# Pokémon App

Tech assessment app for browsing, filtering, and comparing Pokémon via [PokeAPI](https://pokeapi.co/).

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
app/                  # Next.js App Router (/, /[name], /compare)
components/
  ui/                 # shadcn/ui design system (Radix + Tailwind)
  pokemon/            # Domain components
lib/pokeapi/          # API client, types, mappers, MSW mocks
hooks/                # TanStack Query hooks
stores/               # Zustand (compare slots)
```

### List pagination (assessment)

- **No type filter:** `GET /pokemon?limit=40&offset=N` (API pagination)
- **Type filter:** `GET /type/{name}` once, frontend slice of 40 (TanStack Query cache)
- URL state: `/?type=fire&offset=40`

### State ownership

| Concern                   | Tool             |
| ------------------------- | ---------------- |
| Server data (list, types) | TanStack Query   |
| Compare slots             | Zustand          |
| List filter/page          | URL searchParams |

## Testing

- **Vitest + MSW** — unit tests for API client, pagination, stores
- **Playwright** — smoke E2E for list and compare routes
- **Storybook** — isolated component development

## AI workflow

Cursor rules live in `.cursor/rules/`. AI assists with boilerplate; all diffs are human-reviewed. See `docs/DECISIONS.md` for ADRs.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [PokeAPI](https://pokeapi.co/docs/v2)
