import {
  type BreakpointName,
  type MediaState,
  activeBreakpoint,
  breakpointMatches,
  sameMatches,
} from '@usemotif/core';
import { useSyncExternalStore } from 'react';
import { Dimensions, type EmitterSubscription } from 'react-native';

/**
 * Shared window-dimension store. One `Dimensions` listener feeds every
 * `useMedia` / `useBreakpoint` consumer; the cached `matches` / `active`
 * references change only when a breakpoint boundary is crossed, so
 * `useSyncExternalStore` re-renders a consumer only on an actual band change
 * (rotation, split view, foldable resize) — never on an in-band change.
 */
let matches: MediaState = breakpointMatches(Dimensions.get('window').width);
let active: BreakpointName | 'base' = activeBreakpoint(Dimensions.get('window').width);
const listeners = new Set<() => void>();
let subscription: EmitterSubscription | null = null;

function recompute(nextWidth: number): void {
  const next = breakpointMatches(nextWidth);
  if (sameMatches(next, matches)) return;
  matches = next;
  active = activeBreakpoint(nextWidth);
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  if (listeners.size === 1) {
    subscription = Dimensions.addEventListener('change', ({ window }) => recompute(window.width));
  }
  // Reconcile in case the width changed between module load and this mount.
  recompute(Dimensions.get('window').width);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && subscription !== null) {
      subscription.remove();
      subscription = null;
    }
  };
}

/**
 * Subscribe to the window width via React Native's `Dimensions` and return a
 * breakpoint-match map: `{ sm, md, lg, xl, '2xl' }`, each `true` once the
 * window is at least that wide (mobile-first min-width — the same cascade the
 * native responsive resolver uses). Use it for imperative responsive logic:
 *
 * ```tsx
 * const media = useMedia();
 * return <Box flexDirection={media.md ? 'row' : 'column'} />;
 * ```
 *
 * Re-renders **only when a breakpoint boundary is crossed** — an in-band
 * change re-renders nothing. There is no SSR on native, so the initial value
 * is the real width immediately.
 */
export function useMedia(): MediaState {
  return useSyncExternalStore(
    subscribe,
    () => matches,
    () => matches,
  );
}

/**
 * The single active breakpoint — the largest whose min-width the window meets,
 * or `'base'` below the smallest. Scalar counterpart to {@link useMedia};
 * updates only when the band changes.
 */
export function useBreakpoint(): BreakpointName | 'base' {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => active,
  );
}
