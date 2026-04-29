import { useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

/**
 * The user's preferred theme mode.
 *
 * - `'system'` (the default) — follow the OS color scheme.
 * - `'light'` / `'dark'` — explicit override.
 */
export type ThemeMode = 'system' | 'light' | 'dark';

/** Concrete theme name after `'system'` is resolved against the OS. */
export type ResolvedTheme = 'light' | 'dark';

export interface UseThemeSettingOptions {
  /**
   * Theme to assume before the first effect runs and as a fallback if
   * the OS reports `null` (older iOS, simulator quirks). Defaults to
   * `'light'`.
   */
  readonly defaultResolved?: ResolvedTheme;
  /**
   * Optional persistence shim for the user's mode override. Pass an
   * object with synchronous `getItem` / `setItem` / `removeItem`
   * methods (e.g. an MMKV-backed wrapper). React Native's standard
   * `AsyncStorage` is async and not supported here in v1 — wire it up
   * outside this hook with your own persistence layer if you need it.
   * If `null` or omitted, the override is in-memory for the current
   * session only.
   */
  readonly storage?: SyncStorage | null;
  /** Storage key used when `storage` is provided. Defaults to `'motif:theme'`. */
  readonly storageKey?: string;
}

export interface SyncStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface UseThemeSettingResult {
  /** The user's selected mode. `'system'` until they explicitly choose. */
  readonly mode: ThemeMode;
  /** The concrete theme to render. Equal to `mode` unless `mode === 'system'`. */
  readonly resolved: ResolvedTheme;
  /** Update the mode; persists to `storage` if one was provided. */
  readonly set: (next: ThemeMode) => void;
}

const DEFAULT_STORAGE_KEY = 'motif:theme';

/**
 * Auto dark/light mode hook for React Native. Reads
 * `Appearance.getColorScheme()` and subscribes to changes via
 * `Appearance.addChangeListener`.
 *
 * Pair with `<ThemeProvider>`:
 *
 * ```tsx
 * function App() {
 *   const { resolved } = useThemeSetting();
 *   return (
 *     <ThemeProvider themes={[lightTheme, darkTheme]} active={resolved}>
 *       …
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * Persistence: pass `storage` (a synchronous wrapper around MMKV /
 * SecureStore / etc.) to remember the user's override across launches.
 * Async-only stores (RN's `AsyncStorage`) aren't supported directly in
 * v1 — wire them in your app code with your own persistence layer.
 */
export function useThemeSetting(options: UseThemeSettingOptions = {}): UseThemeSettingResult {
  const { defaultResolved = 'light', storage = null, storageKey = DEFAULT_STORAGE_KEY } = options;

  const initialMode: ThemeMode = useMemo(() => {
    if (storage === null) return 'system';
    try {
      const stored = storage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
      // Storage failure — fall through to system.
    }
    return 'system';
  }, [storage, storageKey]);

  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(() => {
    const initial = Appearance.getColorScheme();
    return initial === 'dark' ? 'dark' : initial === 'light' ? 'light' : defaultResolved;
  });

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemResolved(
        colorScheme === 'dark' ? 'dark' : colorScheme === 'light' ? 'light' : defaultResolved,
      );
    });
    return () => sub.remove();
  }, [defaultResolved]);

  const set = useCallback(
    (next: ThemeMode) => {
      setMode(next);
      if (storage === null) return;
      try {
        if (next === 'system') {
          storage.removeItem(storageKey);
        } else {
          storage.setItem(storageKey, next);
        }
      } catch {
        // Storage write failed; in-memory state still updates.
      }
    },
    [storage, storageKey],
  );

  const resolved: ResolvedTheme = mode === 'system' ? systemResolved : mode;

  return useMemo(() => ({ mode, resolved, set }), [mode, resolved, set]);
}
