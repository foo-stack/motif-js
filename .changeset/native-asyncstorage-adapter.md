---
'@motif-js/react-native': minor
---

**`createAsyncStorageAdapter` — async-store → sync-facade for `useThemeSetting`.**

Closes the T2.3 deferred-work entry. `useThemeSetting` accepts a synchronous `SyncStorage` shim for persistence; React Native's `AsyncStorage` (and most production stores like MMKV's async API) only expose Promise-based APIs. This adapter primes an in-memory cache once at app bootstrap and serves a sync facade out of it.

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStorageAdapter, useThemeSetting } from '@motif-js/react-native';

const themeStorage = createAsyncStorageAdapter(AsyncStorage, {
  keys: ['motif:theme'],
});

function App() {
  const { resolved } = useThemeSetting({ storage: themeStorage });
  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active={resolved}>
      …
    </ThemeProvider>
  );
}
```

**Behaviour:**

- **Priming pass.** At construction, the adapter reads every entry in `keys` from the underlying async store in parallel and populates the in-memory cache. Until that pass completes, sync `getItem` returns `null` and `useThemeSetting` falls through to its `'system'` default. After it completes, sync `getItem` returns the cached value and the next render reflects the persisted choice.
- **Sync writes, async durability.** `setItem` / `removeItem` update the cache _synchronously_ (UI feels instant) and fire-and-forget the async write to the underlying store. Failed writes route through `onWriteError` (defaults to a one-time `console.warn` so noisy stores don't spam logs); the in-memory state always reflects the latest call regardless of durability.
- **`ready` + `whenReady`.** Apps that want to gate the first render on the cache being primed (avoiding the one-frame `'system'` flicker) can `await adapter.whenReady` from their bootstrap before mounting, or check `adapter.ready` from inside a render and show a splash until it flips `true`.
- **Read failures during priming are non-fatal.** A rejected `getItem` for one key leaves that key as a cache miss; other keys prime as normal. The error isn't surfaced because it's typically transient and recoverable next launch.

**API surface added (all from `@motif-js/react-native`):**

- `createAsyncStorageAdapter(asyncStorage, { keys, onWriteError? })`
- `AsyncStorageLike` (interface — `getItem` / `setItem` / `removeItem` returning Promises)
- `AsyncStorageAdapter` (extends `SyncStorage` with `ready` + `whenReady`)
- `CreateAsyncStorageAdapterOptions`

10 tests cover priming (cache empty before resolve, populated after; per-key error tolerance; missing-key tolerance), sync writes (cache updates immediately, async store updates one microtask later), removeItem semantics, and write-error routing through both the default and custom `onWriteError` paths.

Bundle: `@motif-js/react-native` unchanged at the main entry — the adapter adds ~0.4 KB but apps that don't import `createAsyncStorageAdapter` tree-shake it out entirely.
