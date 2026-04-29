'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * The user's preferred theme mode.
 *
 * - `'system'` (the default) — follow the OS's `prefers-color-scheme`.
 * - `'light'` / `'dark'` — explicit override that persists across reloads.
 */
export type ThemeMode = 'system' | 'light' | 'dark';

/** Concrete theme name after `'system'` is resolved against the OS. */
export type ResolvedTheme = 'light' | 'dark';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const DEFAULT_STORAGE_KEY = 'motif:theme';

export interface UseThemeSettingOptions {
  /**
   * `localStorage` key used to persist the user override. Set to `null`
   * to disable persistence (useful when the host app already owns
   * theme state and only needs the system-preference subscription).
   * Defaults to `'motif:theme'`.
   */
  readonly storageKey?: string | null;
  /**
   * Theme to assume during SSR / before the first client effect runs.
   * Browsers can't know the user's system preference until JS runs, so
   * the very first paint of a server-rendered page falls back to this.
   * Defaults to `'light'`.
   */
  readonly defaultResolved?: ResolvedTheme;
}

export interface UseThemeSettingResult {
  /** The user's selected mode. `'system'` until they explicitly choose. */
  readonly mode: ThemeMode;
  /** The concrete theme to render. Equal to `mode` unless `mode === 'system'`. */
  readonly resolved: ResolvedTheme;
  /** Update the mode; persists to `localStorage` if `storageKey` is set. */
  readonly set: (next: ThemeMode) => void;
}

/**
 * Auto dark/light mode hook for web. Reads the user's persisted
 * override from `localStorage` (if any), falls back to
 * `prefers-color-scheme`, and subscribes to OS-level changes via
 * `matchMedia`.
 *
 * Pair with `<ThemeProvider>`:
 *
 * ```tsx
 * function App() {
 *   const { resolved } = useThemeSetting();
 *   return (
 *     <ThemeProvider themes={[lightTheme, darkTheme]} active={resolved}>
 *       {…}
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * **SSR**: the first server-rendered HTML uses `defaultResolved`
 * (default `'light'`) since the OS preference is unreachable from
 * Node. Hydration runs the client effect and updates to the real
 * value; React's hydration model treats this as a normal post-mount
 * state change (no warning). If you want to avoid the brief flash on
 * dark-preferring users, write the resolved value to a cookie at SSR
 * time and pass it back in via `defaultResolved`.
 */
export function useThemeSetting(options: UseThemeSettingOptions = {}): UseThemeSettingResult {
  const { storageKey = DEFAULT_STORAGE_KEY, defaultResolved = 'light' } = options;

  // First-render values — deliberately deterministic for hydration.
  // The effect below replaces them with the real client values.
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(defaultResolved);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore the user override.
    if (storageKey !== null) {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setMode(stored);
        }
      } catch {
        // Storage may be blocked (private mode, sandboxed iframe). Fall
        // through to the system default.
      }
    }

    // Subscribe to OS changes.
    const mq = window.matchMedia(MEDIA_QUERY);
    setSystemResolved(mq.matches ? 'dark' : 'light');
    const onChange = (event: MediaQueryListEvent): void => {
      setSystemResolved(event.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, [storageKey]);

  const set = useCallback(
    (next: ThemeMode) => {
      setMode(next);
      if (storageKey === null) return;
      if (typeof window === 'undefined') return;
      try {
        if (next === 'system') {
          window.localStorage.removeItem(storageKey);
        } else {
          window.localStorage.setItem(storageKey, next);
        }
      } catch {
        // Storage write failed (quota, private mode). The in-memory
        // state still updates so the current session works; the next
        // reload reverts to the system default.
      }
    },
    [storageKey],
  );

  const resolved: ResolvedTheme = mode === 'system' ? systemResolved : mode;

  return useMemo(() => ({ mode, resolved, set }), [mode, resolved, set]);
}
