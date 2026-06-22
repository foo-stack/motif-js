'use client';

import {
  type BreakpointName,
  type MediaState,
  SSR_DEFAULT_VIEWPORT_WIDTH,
  activeBreakpoint,
  breakpointMatches,
  sameMatches,
} from '@usemotif/core';
import { useSyncExternalStore } from 'react';

/**
 * Shared viewport store. A single `resize` listener feeds every `useMedia` /
 * `useBreakpoint` consumer; the cached `matches` / `active` references only
 * change when a breakpoint boundary is actually crossed. `useSyncExternalStore`
 * then re-renders a consumer only when the snapshot reference it reads
 * changes — so a resize that stays within a band re-renders nothing.
 */
const SSR_MATCHES: MediaState = breakpointMatches(SSR_DEFAULT_VIEWPORT_WIDTH);
const SSR_ACTIVE: BreakpointName | 'base' = activeBreakpoint(SSR_DEFAULT_VIEWPORT_WIDTH);

let width = SSR_DEFAULT_VIEWPORT_WIDTH;
let matches: MediaState = SSR_MATCHES;
let active: BreakpointName | 'base' = SSR_ACTIVE;
const listeners = new Set<() => void>();

function recompute(): void {
  if (typeof window === 'undefined') return;
  const w = window.innerWidth;
  if (w === width) return;
  width = w;
  const next = breakpointMatches(w);
  if (sameMatches(next, matches)) return; // in-band resize → no new reference, no notify
  matches = next;
  active = activeBreakpoint(w);
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  if (listeners.size === 1) window.addEventListener('resize', recompute);
  // First client subscription measures the real width and reconciles away the
  // SSR default; subsequent mounts are cheap no-ops if nothing changed.
  recompute();
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) window.removeEventListener('resize', recompute);
  };
}

/**
 * Subscribe to the viewport width and return a breakpoint-match map:
 * `{ sm, md, lg, xl, '2xl' }`, each `true` once the viewport is at least that
 * wide (mobile-first min-width — the same semantics responsive props compile
 * to). Use it for imperative responsive logic the declarative prop syntax
 * can't express:
 *
 * ```tsx
 * const media = useMedia();
 * return <Box flexDirection={media.md ? 'row' : 'column'} />;
 * ```
 *
 * Re-renders **only when a breakpoint boundary is crossed** — a resize that
 * stays within the same band changes nothing. SSR-safe: server and the first
 * client render share the same default-width snapshot, and the store
 * reconciles to the real width on mount.
 *
 * For purely declarative responsiveness prefer the responsive prop syntax
 * (`p={{ base: 2, md: 4 }}`), which compiles to CSS. Reach for `useMedia` when
 * the branch is on something other than a single style value.
 */
export function useMedia(): MediaState {
  return useSyncExternalStore(
    subscribe,
    () => matches,
    () => SSR_MATCHES,
  );
}

/**
 * The single active breakpoint — the largest whose min-width the viewport
 * meets, or `'base'` below the smallest. Scalar counterpart to {@link useMedia}
 * for the common "which band am I in" case; updates only when the band changes.
 */
export function useBreakpoint(): BreakpointName | 'base' {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => SSR_ACTIVE,
  );
}
