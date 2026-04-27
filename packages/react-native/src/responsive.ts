import { isResponsiveObject, parseResponsiveDSL } from '@motif-js/core';

/**
 * Walk a props bag and replace every responsive shape (object / array
 * / DSL string) with its `base`-slot value. Non-responsive values
 * pass through untouched.
 *
 * Stop-gap until the native viewport-driven resolver lands;
 * `useViewportWidth` will replace this with breakpoint-aware
 * selection in a follow-up commit. The same primitives (Box, Text,
 * Stack, …) currently call this on every render.
 */
export function pickBaseSlots(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in props) {
    out[key] = pickBase(props[key]);
  }
  return out;
}

function pickBase(value: unknown): unknown {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') {
    const parsed = parseResponsiveDSL(value);
    if (parsed === null) return value;
    return parsed['base'];
  }
  if (isResponsiveObject(value)) {
    return (value as Record<string, unknown>)['base'];
  }
  return value;
}
