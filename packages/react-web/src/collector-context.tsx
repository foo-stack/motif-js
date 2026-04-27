'use client';

import { createContext, useContext } from 'react';
import type { SSRStyleCollector } from './style-cache.js';

/**
 * React context carrying the currently-active SSR collector. `null`
 * means "no active collector via context" — the inject helpers fall
 * back to the module-level storage backend (sync or AsyncLocalStorage).
 *
 * App Router users wrap their layout in a registry that creates a
 * collector via `useState(() => new SSRStyleCollector())` and provides
 * it through this context. Components read the collector via
 * {@link useActiveCollector} and forward it as the `override` argument
 * to `injectAtRules` / `injectPseudoRules`.
 *
 * The 15-line registry pattern lives in user code rather than this
 * library so motif doesn't take a hard dependency on Next.js — see the
 * README for the canonical implementation.
 */
export const CollectorContext = createContext<SSRStyleCollector | null>(null);

/**
 * Read the active collector from React context. Returns `null` when no
 * collector provider is in scope.
 */
export function useActiveCollector(): SSRStyleCollector | null {
  return useContext(CollectorContext);
}
