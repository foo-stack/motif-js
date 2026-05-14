/**
 * Helpers for headless components that don't yet have a real native
 * implementation. On native they render `null` and log a one-time
 * console warning so the host app stays alive (better than throwing
 * inside a Modal or render path); on the web side these helpers are
 * never used.
 *
 * As native ports land, the corresponding `.native.tsx` swaps the
 * stub for a real implementation.
 */
import type { ReactElement } from 'react';

const warned = new Set<string>();

export function nativeStubWarn(component: string): void {
  if (warned.has(component)) return;
  warned.add(component);
  // eslint-disable-next-line no-console
  console.warn(
    `${component} is not yet implemented on React Native; it renders nothing on this platform. ` +
      `Track in @usemotif/headless v1.x. Use a platform branch for now.`,
  );
}

export function nativeStub(component: string): () => ReactElement | null {
  return function NativeStub() {
    nativeStubWarn(component);
    return null;
  };
}

/**
 * Imperative-style throw helper for hooks / fns that can't return null.
 * Used by `useToast` and friends.
 */
export function nativeStubThrow(component: string): never {
  throw new Error(
    `${component} is not yet implemented on React Native. Track in @usemotif/headless v1.x.`,
  );
}
