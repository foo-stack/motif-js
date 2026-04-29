---
'@motif-js/react-web': minor
---

**Chainable / composable sub-themes — `<Theme name="dark"><Theme name="red">` resolves to `dark_red` when registered.**

Nested `<Theme>` boundaries now compose their names with `_` and look
up a registered combination theme on the nearest `<ThemeProvider>`.
Pre-generate the combinations you care about, pass them all in via
`themes={[...]}`, and they activate automatically when the chain
matches at runtime — no N×M explosion, only what you ship.

```tsx
import { Theme, ThemeProvider } from '@motif-js/react-web';

<ThemeProvider themes={[light, dark, light_red, dark_red]} active="dark">
  <Box bg="$colors.surface.base">              {/* dark */}
    <Theme name="red">
      <Box bg="$colors.surface.base">          {/* dark_red */}
    </Theme>
  </Box>
</ThemeProvider>
```

- **Resolution priority** (most specific → least):
  1. **Full chain combo** — `<ThemeProvider active="dark"><Theme red><Theme blue>`
     → `dark_red_blue` if registered.
  2. **Inner name** — falls back to the user's explicit `<Theme>`
     intent (`blue` standalone) if registered.
  3. **Parent's resolved active** — final fallback. For 3-deep chains
     this naturally drops to e.g. `dark_red`, because the parent
     `<Theme red>` boundary already resolved to `dark_red`.

- **`useThemeName()`** now returns the resolved chained name
  (`'dark_red'` inside the inner boundary). Was previously the
  top-level provider's name regardless of nesting — the new behaviour
  reflects what the cascade is actually showing.

- **`useTheme()`** resolves to the deepest registered theme object
  (`dark_red` instead of `dark` if both are registered and the chain
  matches).

- **`useThemeChain()`** — new hook returning the full chain of
  boundary names from the root provider down to the current scope
  (e.g. `['dark', 'red', 'blue']`). Useful for build-time tooling
  or instrumentation that wants the unresolved boundary structure.

- **Compiler-side combination pre-generation deferred to T3.6**,
  consistent with the deferral pattern from T1.1 / T1.2 / T1.4. The
  runtime model ships now; the compiler walking the JSX tree to
  auto-discover observed `<Theme>` chains and pre-generate CSS for
  them lands when the broader compiler-extension pass picks up.

10 new tests cover provider-only chain init, 2-deep / 3-deep combo
resolution, fallback to inner / parent names, sibling-chain
independence, and `<Theme>` rendered without a provider. Bundle:
`@motif-js/react-web` 9.0 → 9.3 KB gz (still ≤13.7 KB budget).
