'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ACCENT_NAMES, type AccentName } from '../theme/motif';

export type ContentWidth = 'narrow' | 'standard' | 'wide';
export type BodyFont = 'sans' | 'serif';

export interface TweaksState {
  contentWidth: ContentWidth;
  bodyFont: BodyFont;
  accent: AccentName;
}

const STORAGE_KEY = 'motif:docs:tweaks';
const DEFAULT_TWEAKS: TweaksState = {
  contentWidth: 'standard',
  bodyFont: 'sans',
  accent: 'terracotta',
};

function readStored(): TweaksState {
  if (typeof window === 'undefined') return DEFAULT_TWEAKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_TWEAKS;
    const parsed = JSON.parse(raw) as Partial<TweaksState>;
    const widths = ['narrow', 'standard', 'wide'] as const;
    const fonts = ['sans', 'serif'] as const;
    return {
      contentWidth: widths.includes(parsed.contentWidth as ContentWidth)
        ? (parsed.contentWidth as ContentWidth)
        : DEFAULT_TWEAKS.contentWidth,
      bodyFont: fonts.includes(parsed.bodyFont as BodyFont)
        ? (parsed.bodyFont as BodyFont)
        : DEFAULT_TWEAKS.bodyFont,
      accent: ACCENT_NAMES.includes(parsed.accent as AccentName)
        ? (parsed.accent as AccentName)
        : DEFAULT_TWEAKS.accent,
    };
  } catch {
    return DEFAULT_TWEAKS;
  }
}

export interface UseTweaksResult {
  readonly state: TweaksState;
  readonly setContentWidth: (next: ContentWidth) => void;
  readonly setBodyFont: (next: BodyFont) => void;
  readonly setAccent: (next: AccentName) => void;
  readonly reset: () => void;
}

/**
 * Tweaks panel state. Mirrors the shape of `useThemeMode` — initial
 * render is deterministic for SSG hydration; the effect below syncs
 * to localStorage once the client takes over.
 */
export function useTweaks(): UseTweaksResult {
  const [state, setState] = useState<TweaksState>(DEFAULT_TWEAKS);

  useEffect(() => {
    const stored = readStored();
    setState(stored);
  }, []);

  const persist = useCallback((next: TweaksState) => {
    setState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const setContentWidth = useCallback(
    (next: ContentWidth) => {
      persist({ ...state, contentWidth: next });
    },
    [state, persist],
  );

  const setBodyFont = useCallback(
    (next: BodyFont) => {
      persist({ ...state, bodyFont: next });
    },
    [state, persist],
  );

  const setAccent = useCallback(
    (next: AccentName) => {
      persist({ ...state, accent: next });
    },
    [state, persist],
  );

  const reset = useCallback(() => {
    persist(DEFAULT_TWEAKS);
  }, [persist]);

  return { state, setContentWidth, setBodyFont, setAccent, reset };
}

/**
 * Context wrapper for the resolved tweaks state. `ChromeShell` mounts
 * the provider at the root; `DocsLayout` (inside the `<Outlet>` tree)
 * pulls the values out without prop-drilling through every route.
 *
 * Defaults match `DEFAULT_TWEAKS` so unprovided trees behave like the
 * server-rendered initial state.
 */
export const TweaksContext = createContext<TweaksState>(DEFAULT_TWEAKS);

export function useTweaksContext(): TweaksState {
  return useContext(TweaksContext);
}

/** Resolve a `ContentWidth` to a maxWidth value (px or '100%'). */
export function contentWidthToMaxWidth(width: ContentWidth): number | string {
  switch (width) {
    case 'narrow':
      return 640;
    case 'standard':
      return 760;
    case 'wide':
      return 920;
  }
}

/** Resolve a `BodyFont` to a `$fonts.<scale>` reference. */
export function bodyFontToToken(font: BodyFont): string {
  return font === 'serif' ? '$fonts.display' : '$fonts.sans';
}
