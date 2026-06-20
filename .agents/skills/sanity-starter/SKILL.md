---
name: sanity-starter
description: Conventions for the Actta Studio Sanity Starter. Load AGENTS.md and follow factory-first schema patterns.
---

# Sanity Starter Skill

When working in this repository:

1. Read [AGENTS.md](../../AGENTS.md) first.
2. Read [docs/architecture/content-architecture.md](../../docs/architecture/content-architecture.md) for schema/design decisions.
3. Use schema factories in `sanity/schemas/fields/`.
4. Add page sections via `pnpm plop`, not by hand-editing three files.
5. Run `pnpm sanity:typegen` after schema changes.
6. Keep fetch logic in `features/sanity/client.ts` with cache tags.
7. Use `sanity/runtime-env.ts` in Studio — never import `env.ts` in client bundles.

## Docs

- [docs/README.md](../../docs/README.md) — feature and setup docs
- [docs/getting-started.md](../../docs/getting-started.md) — full setup from clone to deploy
- [docs/commands.md](../../docs/commands.md) — pnpm scripts and code generation
