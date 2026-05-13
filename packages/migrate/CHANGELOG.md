# @motif-js/migrate

## 2.0.0

### Major Changes

- **Initial release.** New workspace package providing the `rename-v2` codemod for migrating v1 import specifiers to their v2 names. Both CLI (`npx @motif-js/migrate rename-v2`) and programmatic (`applyRenameV2`, `needsRenameV2`) surfaces. Single-pass alternation regex rewrites `@motif-js/react-web` → `@motif-js/react` and bare `@motif-js/react` → `motif-js` in one walk, sparing `@motif-js/react-native` and subpath imports like `@motif-js/react/server`. Joins the linked-version group at 2.0.0.
