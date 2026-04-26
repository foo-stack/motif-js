/**
 * Default breakpoint set. Mobile-first: each name maps to the **min-width**
 * (in CSS pixels) at which the breakpoint becomes active. Tailwind-aligned.
 *
 * Users can override via the `<ThemeProvider breakpoints={...}>` prop in the
 * future; for v0 these are global.
 */
export const defaultBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointName = keyof typeof defaultBreakpoints;

/**
 * The base (unprefixed) key in a responsive prop object.
 *
 * @example
 *   <Box p={{ base: '$2', md: '$4' }} />
 */
export const BASE_BREAKPOINT_KEY = 'base';

/**
 * All keys recognised inside a responsive prop object.
 */
export const RESPONSIVE_KEYS: ReadonlySet<string> = new Set([
  BASE_BREAKPOINT_KEY,
  ...Object.keys(defaultBreakpoints),
]);

/**
 * Type-guard: does this value look like a responsive prop object (a plain
 * object with at least one recognised breakpoint key)?
 */
export function isResponsiveObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  for (const key in value as Record<string, unknown>) {
    if (RESPONSIVE_KEYS.has(key)) return true;
  }
  return false;
}

/**
 * Build a CSS `@media (min-width: ...)` query for a named breakpoint.
 */
export function mediaQueryForBreakpoint(name: BreakpointName): string {
  return `@media (min-width: ${defaultBreakpoints[name]}px)`;
}
