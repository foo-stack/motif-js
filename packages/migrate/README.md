# @motif-js/migrate

> Codemod toolkit for motif-js.

Rewrites v1 motif-js import specifiers to their v2 names in every file under a given path.

## Use

```sh
# In your project root, with v1 imports:
npx @motif-js/migrate rename-v2

# Or point at a subtree:
npx @motif-js/migrate rename-v2 src/

# Preview without writing:
npx @motif-js/migrate rename-v2 --dry-run
```

## What it does

| Before                             | After               |
| ---------------------------------- | ------------------- |
| `@motif-js/react-web`              | `@motif-js/react`   |
| `@motif-js/react` (aggregator)     | `motif-js`          |
| `@motif-js/react-native`           | (unchanged)         |
| `@motif-js/react/server`           | (unchanged subpath) |
| `@motif-js/react/tanstack-virtual` | (unchanged subpath) |

Covers every form an import specifier appears in:

- `import { X } from '…'` (named, default, namespace, type-only)
- `import('…')` (dynamic)
- `require('…')` (CommonJS)
- `dependencies` / `peerDependencies` / etc. keys in `package.json`
- Code fences in `.md` / `.mdx`

## Files scanned by default

```
**/*.{ts,tsx,js,jsx,mjs,cjs,md,mdx,json}
```

Skips: `node_modules`, `dist`, `.next`, `.vorge`, `.turbo`, `.cache`, `build`, `out`, `coverage`, `__visual__`.

## Programmatic API

```ts
import { applyRenameV2, needsRenameV2 } from '@motif-js/migrate';

const src = `import { Box } from '@motif-js/react-web';`;
if (needsRenameV2(src)) {
  const out = applyRenameV2(src);
  // → `import { Box } from '@motif-js/react';`
}
```

`applyRenameV2` is a string-in, string-out function. Pass any kind of file content — TypeScript, JavaScript, MDX, JSON — it matches import specifier strings, not parsed AST nodes.

## Docs

<https://usemotif.dev/migrating/v1-to-v2>

## License

[MIT](../../LICENSE)
