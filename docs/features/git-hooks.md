# Git hooks

Pre-commit hooks run via [Lefthook](https://github.com/evilmartians/lefthook).

## Setup

```bash
pnpm add -D lefthook
pnpm exec lefthook install
```

## What runs on commit

| Hook | Command |
|------|---------|
| Biome | Lint + format check on staged files |
| Types | `pnpm run check:types` |

Config: [`lefthook.yml`](../../lefthook.yml)

## Skip hooks (emergency only)

```bash
LEFTHOOK=0 git commit -m "message"
```
