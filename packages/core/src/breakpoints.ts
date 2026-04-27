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
 * Fixed media-query keys recognised inside a responsive prop object.
 * Container-query keys (`@<bp>`, `@<name>.<bp>`) are recognised separately
 * by {@link parseResponsiveKey} since the name slot is open-ended.
 */
export const RESPONSIVE_KEYS: ReadonlySet<string> = new Set([
  BASE_BREAKPOINT_KEY,
  ...Object.keys(defaultBreakpoints),
]);

/**
 * Type-guard: does this value look like a responsive prop object (a plain
 * object with at least one recognised breakpoint or container-query key)?
 */
export function isResponsiveObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  for (const key in value as Record<string, unknown>) {
    if (RESPONSIVE_KEYS.has(key)) return true;
    if (key.startsWith('@')) {
      const inner = key.slice(1);
      const dotIdx = inner.indexOf('.');
      const bp = dotIdx === -1 ? inner : inner.slice(dotIdx + 1);
      if (bp in defaultBreakpoints) return true;
    }
  }
  return false;
}

/**
 * Build a CSS `@media (min-width: ...)` query for a named breakpoint.
 */
export function mediaQueryForBreakpoint(name: BreakpointName): string {
  return `@media (min-width: ${defaultBreakpoints[name]}px)`;
}

/**
 * Build a CSS `@container` query for a named breakpoint, optionally scoped
 * to a named container. Without a name, the rule binds to the nearest
 * container ancestor.
 */
export function containerQueryForBreakpoint(name: BreakpointName, containerName?: string): string {
  const px = defaultBreakpoints[name];
  return containerName === undefined
    ? `@container (min-width: ${px}px)`
    : `@container ${containerName} (min-width: ${px}px)`;
}

/**
 * Discriminated parse result for a responsive-object key.
 * - `base` — the unconditional slot (applied as inline style).
 * - `media` — `@media (min-width: bp)`.
 * - `container` — `@container [name] (min-width: bp)`.
 *
 * `null` means the key is not a recognised responsive key (silently dropped
 * by the resolver to keep the door open for future shorthands).
 */
export type ResponsiveKey =
  | { readonly kind: 'base' }
  | { readonly kind: 'media'; readonly bp: BreakpointName }
  | { readonly kind: 'container'; readonly bp: BreakpointName; readonly name?: string };

/**
 * Parse a responsive-object key into its at-rule kind.
 *
 * Recognises:
 * - `base` → unconditional.
 * - `<bp>` (e.g. `md`) → media query.
 * - `@<bp>` (e.g. `@md`) → container query against nearest container.
 * - `@<name>.<bp>` (e.g. `@card.md`) → container query against named container.
 *
 * Container names must be non-empty; the breakpoint must exist in
 * {@link defaultBreakpoints}. Anything else returns `null`.
 */
export function parseResponsiveKey(key: string): ResponsiveKey | null {
  if (key === BASE_BREAKPOINT_KEY) return { kind: 'base' };
  if (key in defaultBreakpoints) return { kind: 'media', bp: key as BreakpointName };
  if (!key.startsWith('@')) return null;

  const inner = key.slice(1);
  const dotIdx = inner.indexOf('.');
  if (dotIdx === -1) {
    if (inner in defaultBreakpoints) {
      return { kind: 'container', bp: inner as BreakpointName };
    }
    return null;
  }

  const name = inner.slice(0, dotIdx);
  const bp = inner.slice(dotIdx + 1);
  if (name.length > 0 && bp in defaultBreakpoints) {
    return { kind: 'container', bp: bp as BreakpointName, name };
  }
  return null;
}
