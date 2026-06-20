# Git hooks

Pre-commit hooks run via [Lefthook](https://github.com/evilmartians/lefthook).

## Setup

Hooks install automatically when you run:

```bash
pnpm install
```

The root `package.json` `"prepare"` script runs `lefthook install`. If hooks aren't running after cloning, install manually:

```bash
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
