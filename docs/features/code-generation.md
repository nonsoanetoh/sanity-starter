# Code generation (Plop)

Scaffold page-builder sections without hand-editing three files.

```bash
pnpm plop
# Choose: page-builder-section
```

Creates:

- `sanity/schemas/page-sections/{name}-section.ts` — Studio schema
- `features/page-builder/sections/{name}-section.tsx` — React component
- Registry updates in `page-sections/index.ts`, `schemas/index.ts`, `page-sections.tsx`, and `queries.ts`

After generating, run:

```bash
pnpm sanity:typegen
```
