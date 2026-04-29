---
'@motif-js/react-web': minor
'@motif-js/react-native': minor
---

**`useThemeSetting()` — auto dark/light mode hook.**

Reads the OS color-scheme preference, subscribes to changes, persists
the user's explicit override, and returns a `{ mode, resolved, set }`
triple that pairs cleanly with `<ThemeProvider>`.

```tsx
import { useThemeSetting, ThemeProvider } from '@motif-js/react-web';
import { lightTheme, darkTheme } from '@motif-js/tokens';

function App() {
  const { resolved } = useThemeSetting();
  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active={resolved}>
      {/* … */}
    </ThemeProvider>
  );
}
```

- `mode` is `'system'` until the user explicitly picks `'light'` or
  `'dark'`. `resolved` is the concrete `'light'` | `'dark'` after
  system-preference resolution.
- **Web**: backed by `matchMedia('(prefers-color-scheme: dark)')` and
  `localStorage`. Persistence uses the `'motif:theme'` key by default;
  pass `storageKey: null` to disable persistence, or a custom string.
  SSR-safe: the first server render uses `defaultResolved` (default
  `'light'`); the client effect installs the real subscription at
  hydration. Pair with a SSR cookie if you need flash-free dark mode
  on first paint.
- **Native**: backed by `Appearance.getColorScheme()` and
  `Appearance.addChangeListener`. Persistence is opt-in via a
  synchronous `storage: { getItem, setItem, removeItem }` shim
  (typically MMKV-backed); RN's async `AsyncStorage` is intentionally
  not supported in this hook — wire it up with your own persistence
  layer if you need it.

22 new unit tests (11 web, 11 native) cover defaults, system-change
events, override persistence, custom storage keys, and storage
failure modes.
