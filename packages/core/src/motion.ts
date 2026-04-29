import { isTokenRef, resolveToken } from './token.js';
import { tokenRefToCssVar } from './css-vars.js';
import type { TransitionObject, TransitionValue } from './style-props.js';
import type { Theme } from './types.js';

const DEFAULT_PROPERTY = 'all';
const DEFAULT_DURATION = '200ms';
const DEFAULT_EASING = 'ease';

/**
 * Resolve a `transition` prop value to a CSS `transition` string with
 * literal values. Token references resolve against `theme`. Used by the
 * native renderer / tests where `var(--…)` cannot be emitted.
 *
 * Returns `undefined` if `value` is `undefined` so callers can chain.
 */
export function resolveTransition(
  value: TransitionValue | undefined,
  theme: Theme | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((entry) => stringifyObject(entry, theme, false)).join(', ');
  }
  return stringifyObject(value as TransitionObject, theme, false);
}

/**
 * Resolve a `transition` prop value to a CSS string with `var(--…)`
 * substitutions for token references. Used by the web renderer where
 * the active theme drives the cascade and literal resolution would
 * defeat theme switching.
 */
export function resolveTransitionToVars(value: TransitionValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((entry) => stringifyObject(entry, undefined, true)).join(', ');
  }
  return stringifyObject(value as TransitionObject, undefined, true);
}

function stringifyObject(
  obj: TransitionObject,
  theme: Theme | undefined,
  emitVars: boolean,
): string {
  const property = obj.property ?? DEFAULT_PROPERTY;
  const duration = resolvePart(obj.duration, theme, emitVars, 'durations') ?? DEFAULT_DURATION;
  const easing = resolvePart(obj.easing, theme, emitVars, 'easings') ?? DEFAULT_EASING;
  const delay = resolvePart(obj.delay, theme, emitVars, 'durations');
  return delay === undefined
    ? `${property} ${duration} ${easing}`
    : `${property} ${duration} ${easing} ${delay}`;
}

function resolvePart(
  value: string | undefined,
  theme: Theme | undefined,
  emitVars: boolean,
  defaultScale: 'durations' | 'easings',
): string | undefined {
  if (value === undefined) return undefined;
  if (!isTokenRef(value)) return value;
  if (emitVars) return tokenRefToCssVar(value, defaultScale);
  if (theme === undefined) return undefined;
  const resolved = resolveToken(value, theme, { defaultScale });
  return typeof resolved === 'string' ? resolved : undefined;
}
