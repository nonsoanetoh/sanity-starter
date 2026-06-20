# Dataset migration

## Import seed content

```bash
pnpm sanity:dataset-import
```

Imports `seed/production.ndjson` into your configured dataset with `--replace`.

## Export backup

```bash
pnpm sanity:dataset-export
```

Writes a tarball to `./backups/`.

## Copy dataset (staging)

```bash
pnpm sanity:dataset-migrate
```

Copies one dataset to another (script prompts for confirmation).

**Warning:** `--replace` on import overwrites existing documents with matching `_id` values.
