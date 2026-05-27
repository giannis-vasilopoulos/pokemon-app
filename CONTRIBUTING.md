# Contributing

Thanks for your interest in contributing to Pokémon App. This project started as a tech assessment and is open for feedback, bug reports, and pull requests.

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies:

   ```bash
   pnpm install
   cp .env.example .env.local   # optional
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

See [README.md](README.md) for architecture notes and available scripts.

## Before opening a PR

Run the same checks as CI:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

For UI changes, consider adding or updating Vitest tests. E2E tests (`pnpm test:e2e`) run locally with Playwright and are not required in CI.

## Pull request guidelines

- Open an issue first for large changes so we can align on approach.
- Keep PRs focused — one concern per PR when possible.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, etc.).
- Update README or `docs/DECISIONS.md` if behavior or architecture changes.

## Code conventions

- TypeScript strict — avoid `any` unless documented.
- Use **pnpm** only (not npm or yarn).
- Match existing patterns in `.cursor/rules/` for Next.js, React, TanStack Query, and testing.
- Never commit secrets; use `.env.local` for local overrides.

## Questions

Open a [GitHub Issue](https://github.com/giannis-vasilopoulos/pokemon-app/issues) for bugs or feature ideas. For security concerns, see [SECURITY.md](.github/SECURITY.md).
