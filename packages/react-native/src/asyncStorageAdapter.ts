import type { SyncStorage } from './useThemeSetting.js';

/**
 * The subset of `@react-native-async-storage/async-storage` (and
 * compatible stores) motif relies on. Kept loose so any
 * Promise-based key-value store works without a hard dep:
 * MMKV's async wrappers, IndexedDB shims, etc.
 */
export interface AsyncStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Sync-facade adapter returned by {@link createAsyncStorageAdapter}.
 * Extends {@link SyncStorage} with two extras for callers that want
 * to gate render-blocking UI on the priming pass:
 *
 * - `ready` — `true` once the initial async read has resolved.
 * - `whenReady` — promise that resolves at the same instant. Awaitable
 *   from app bootstrap so the first render sees the cached values.
 */
export interface AsyncStorageAdapter extends SyncStorage {
  /** True once the initial primed read has resolved. */
  readonly ready: boolean;
  /** Resolves when the initial primed read has resolved. */
  readonly whenReady: Promise<void>;
}

export interface CreateAsyncStorageAdapterOptions {
  /**
   * Keys to prime into the in-memory cache at construction. Without
   * priming the first synchronous `getItem` would always return
   * `null` because the underlying store is async — the priming pass
   * does the async read once at app bootstrap, then the sync facade
   * serves out of memory.
   */
  readonly keys: ReadonlyArray<string>;
  /**
   * Called when an async write rejects (network error, quota
   * exceeded, etc.). Defaults to a one-time `console.warn`. The
   * in-memory cache always reflects the last `setItem` regardless
   * of the underlying store's success — apps that need stricter
   * write-success semantics should use the underlying async API
   * directly.
   */
  readonly onWriteError?: (error: unknown, key: string) => void;
}

const DEFAULT_KEY_PREFIX_FOR_WARNING = '@motif-js/react-native asyncStorageAdapter';
let warned = false;
function defaultOnWriteError(error: unknown, key: string): void {
  if (warned) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    `${DEFAULT_KEY_PREFIX_FOR_WARNING}: write to "${key}" failed; in-memory state still reflects the change. Subsequent failures suppressed.`,
    error,
  );
}

/**
 * Wrap an async key-value store (RN's `AsyncStorage`, MMKV's async
 * API, etc.) into the synchronous {@link SyncStorage} interface
 * `useThemeSetting` accepts.
 *
 * **How it works:**
 *
 * 1. At construction the adapter starts a single async pass that
 *    reads every entry in `keys` from the underlying store and
 *    populates an in-memory cache.
 * 2. Synchronous `getItem` reads from that cache. Until the priming
 *    pass resolves the cache is empty and `getItem` returns `null` —
 *    `useThemeSetting` falls through to its `'system'` default in
 *    that window, then re-renders once `whenReady` resolves and the
 *    consumer reads from a primed cache on the next render.
 * 3. `setItem` / `removeItem` update the cache *immediately* and
 *    fire-and-forget the async write to the underlying store. UI
 *    feels instant; the durable write happens on the microtask
 *    queue.
 *
 * **Use it like this:**
 *
 * ```tsx
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import { createAsyncStorageAdapter, useThemeSetting } from '@motif-js/react-native';
 *
 * const themeStorage = createAsyncStorageAdapter(AsyncStorage, {
 *   keys: ['motif:theme'],
 * });
 *
 * function App() {
 *   const { resolved } = useThemeSetting({ storage: themeStorage });
 *   …
 * }
 * ```
 *
 * Apps that want to delay the first render until the cache is
 * primed (avoiding a one-frame `'system'` flicker) can `await
 * themeStorage.whenReady` from their bootstrap before mounting the
 * tree.
 */
export function createAsyncStorageAdapter(
  asyncStorage: AsyncStorageLike,
  options: CreateAsyncStorageAdapterOptions,
): AsyncStorageAdapter {
  const { keys, onWriteError = defaultOnWriteError } = options;
  const cache = new Map<string, string>();
  let ready = false;

  const whenReady = (async () => {
    await Promise.all(
      keys.map(async (key) => {
        try {
          const value = await asyncStorage.getItem(key);
          if (value !== null) cache.set(key, value);
        } catch {
          // Read failure during priming — leave the cache empty for
          // this key. `getItem` will return null and the consumer's
          // default kicks in. We don't surface the error here
          // because it's typically recoverable next launch.
        }
      }),
    );
    ready = true;
  })();

  return {
    get ready() {
      return ready;
    },
    whenReady,
    getItem(key: string): string | null {
      return cache.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      cache.set(key, value);
      void asyncStorage.setItem(key, value).catch((error) => onWriteError(error, key));
    },
    removeItem(key: string): void {
      cache.delete(key);
      void asyncStorage.removeItem(key).catch((error) => onWriteError(error, key));
    },
  };
}
