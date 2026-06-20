# Commands

All `pnpm` scripts and common workflows for this starter.

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server with Turbopack. Site at `/`, Studio at `/studio`. |
| `pnpm build` | Production build. |
| `pnpm start` | Run the production build locally. |

## Code quality

| Command | Description |
|---------|-------------|
| `pnpm check` | Run Biome lint and format check on the whole project. |
| `pnpm check:types` | TypeScript type check (`tsc --noEmit`). |
| `pnpm format` | Auto-fix lint and format issues with Biome. |

Pre-commit hooks (via Lefthook) run `biome check` on staged files and `check:types` automatically. See [features/git-hooks.md](features/git-hooks.md).

## Project setup

| Command | Description |
|---------|-------------|
| `pnpm sanity:project-setup` | Create `.env.local` from `.env.example`, validate required env vars, print next steps. |
| `pnpm sanity:project-setup --import-seed` | Same as above, then import `seed/production.ndjson`. |

## Sanity CLI

| Command | Description |
|---------|-------------|
| `pnpm sanity:cli <args>` | Run the Sanity CLI (alias for `sanity`). |

Common Sanity CLI usage:

```bash
pnpm sanity:cli login
pnpm sanity:cli deploy          # deploy standalone Studio (not needed for embedded /studio)
pnpm sanity:cli dataset list
pnpm sanity:cli documents query '*[_type == "page"][0..5]'
```

## Schema & types

| Command | Description |
|---------|-------------|
| `pnpm sanity:typegen` | Extract schema to `sanity-schema.json`, then generate TypeScript types. |

Run after any schema change:

```bash
pnpm sanity:typegen
```

Output updates `features/sanity/sanity.types.ts` (via Sanity TypeGen config).

## Dataset management

| Command | Description |
|---------|-------------|
| `pnpm sanity:dataset-import` | Import `seed/production.ndjson` into your configured dataset (`--replace`). |
| `pnpm sanity:dataset-export` | Export dataset backup to `./backups/`. |
| `pnpm sanity:dataset-migrate` | Copy one dataset to another (interactive confirmation). |

See [sanity/dataset-migration.md](sanity/dataset-migration.md).

**Warning:** `--replace` on import overwrites existing documents with matching `_id` values.

---

## Code generation (Plop)

Scaffold new page-builder sections without hand-editing multiple registry files.

```bash
pnpm plop
```

Choose **page-builder-section** and answer the prompts:

| Prompt | Example |
|--------|---------|
| Section name (kebab-case) | `text-banner` |
| Studio title | `Text Banner Section` |
| Sanity icon | `BlockElementIcon` |

### What gets created

- `sanity/schemas/page-sections/{name}-section.ts` — Studio schema
- `features/page-builder/sections/{name}-section.tsx` — React component
- Registry updates in:
  - `sanity/schemas/page-sections/index.ts`
  - `sanity/schemas/index.ts`
  - `features/page-builder/page-sections.tsx`
  - `features/sanity/queries.ts`

### After generating

```bash
pnpm sanity:typegen
pnpm dev
```

Add the new section type in Studio → Page → Sections, then verify it renders on the frontend.

See [features/code-generation.md](features/code-generation.md).

---

## Common workflows

### First-time setup

```bash
pnpm install
pnpm sanity:project-setup
# edit .env.local
pnpm sanity:project-setup --import-seed
pnpm dev
```

### After changing a schema field

```bash
pnpm sanity:typegen
pnpm dev
```

### After adding a new page-builder section

```bash
pnpm plop
pnpm sanity:typegen
pnpm dev
```

### Before committing

Hooks run automatically. To run manually:

```bash
pnpm check
pnpm check:types
```

### Backup production content

```bash
pnpm sanity:dataset-export
```

### Production build locally

```bash
pnpm build
pnpm start
```

---

## Script source files

| Script | Implementation |
|--------|----------------|
| `sanity:project-setup` | `scripts/sanity-project-setup/setup.ts` |
| `sanity:dataset-import` | `scripts/sanity-dataset/import.ts` |
| `sanity:dataset-export` | `scripts/sanity-dataset/export.ts` |
| `sanity:dataset-migrate` | `scripts/sanity-dataset/migrate.ts` |
| `plop` | `plopfile.mjs` + `templates/page-builder-section/` |
