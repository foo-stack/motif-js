'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'paper' | 'ink';

const STORAGE_KEY = 'motif:docs:theme';
const DEFAULT_MODE: ThemeMode = 'paper';

function readStored(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === 'ink' ? 'ink' : 'paper';
}

export interface UseThemeModeResult {
  readonly mode: ThemeMode;
  readonly setMode: (next: ThemeMode) => void;
  readonly toggle: () => void;
}

export function useThemeMode(): UseThemeModeResult {
  // First render is deterministic for SSG hydration. The effect below
  // syncs to the user's stored preference once the client takes over.
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);

  useEffect(() => {
    const stored = readStored();
    if (stored !== mode) setModeState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = mode;
    }
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'paper' ? 'ink' : 'paper';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  return { mode, setMode, toggle };
}
