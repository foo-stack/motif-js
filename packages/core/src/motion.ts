import { isTokenRef, resolveToken } from './token.js';
import { tokenRefToCssVar } from './css-vars.js';
import {
  isKeyframe,
  type AnimationObject,
  type Keyframe,
  type TransitionObject,
  type TransitionValue,
} from './style-props.js';
import type { AnimationToken, SpringAnimationToken, Theme } from './types.js';

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

/**
 * Look up a named animation preset on the active theme. Returns the
 * raw {@link AnimationToken} (timing or spring) so the caller can
 * decide whether to expand it to a CSS transition string (web) or a
 * driver timing pair (native).
 *
 * Returns `undefined` if the name doesn't resolve — callers should
 * fall back to their default timing (200ms ease).
 */
export function resolveAnimationToken(
  name: string | undefined,
  theme: Theme | undefined,
): AnimationToken | undefined {
  if (name === undefined) return undefined;
  if (theme === undefined) return undefined;
  const animations = theme.tokens.animations;
  if (animations === undefined) return undefined;
  return animations[name];
}

/**
 * Build a CSS `transition` string for the web renderer from an
 * `animation="quick"` reference and an optional `animateOnly` list.
 * The result uses `var(--motif-anim-<name>-{duration,easing})`
 * references so theme switches flip the timing through the cascade
 * without re-rendering. Pre-condition: the animation name is
 * registered on the active theme — this helper doesn't validate.
 *
 * - `animateOnly` undefined → `all var(--…) var(--…)` (every changed
 *   property animates).
 * - `animateOnly: ['transform']` → single-property transition.
 * - `animateOnly: ['transform', 'opacity']` → comma-joined list.
 *
 * Returns `undefined` when `name` is undefined.
 */
export function buildAnimationCss(
  name: string | undefined,
  animateOnly?: readonly string[],
): string | undefined {
  if (name === undefined) return undefined;
  const dur = `var(--motif-anim-${name}-duration)`;
  const ease = `var(--motif-anim-${name}-easing)`;
  const props = animateOnly === undefined || animateOnly.length === 0 ? ['all'] : [...animateOnly];
  return props.map((p) => `${p} ${dur} ${ease}`).join(', ');
}

/**
 * Build a CSS `animation` shorthand for the web renderer from an
 * {@link AnimationObject}. Token references in `duration` / `easing` /
 * `delay` resolve to `var(--…)` so theme switches flip the timing
 * through the cascade. When `name` is a {@link Keyframe}, returns its
 * stable hash-based name; the caller is responsible for ensuring the
 * `@keyframes` rule is registered (see `keyframes()` in
 * `@usemotif/react`).
 *
 * Field order in the output mirrors the CSS spec:
 *
 *   `<name> <duration> <easing> <delay> <iteration-count> <direction> <fill-mode> <play-state>`
 *
 * Empty / unset slots are omitted, so a minimal `{ name: 'spin' }`
 * produces just `spin 200ms ease`.
 */
export function buildAnimationShorthand(obj: AnimationObject): string {
  const name = isKeyframe(obj.name) ? obj.name.name : obj.name;
  const duration = resolvePart(obj.duration, undefined, true, 'durations') ?? '200ms';
  const easing = resolvePart(obj.easing, undefined, true, 'easings') ?? 'ease';
  const delay = resolvePart(obj.delay, undefined, true, 'durations');

  const slots: string[] = [name, duration, easing];
  if (delay !== undefined) slots.push(delay);
  if (obj.iterationCount !== undefined) slots.push(String(obj.iterationCount));
  if (obj.direction !== undefined) slots.push(obj.direction);
  if (obj.fillMode !== undefined) slots.push(obj.fillMode);
  if (obj.playState !== undefined) slots.push(obj.playState);
  return slots.join(' ');
}

/**
 * Pull the {@link Keyframe} out of an `animation` prop value, if any.
 * Used by the web renderer to inject the `@keyframes` rule once before
 * applying the `animation` style.
 *
 * Returns `undefined` for string / undefined / object-without-Keyframe.
 */
export function extractKeyframeFromAnimation(
  value: string | AnimationObject | undefined,
): Keyframe | undefined {
  if (value === undefined || typeof value === 'string') return undefined;
  if (isKeyframe(value.name)) return value.name;
  return undefined;
}

/**
 * Approximate a spring config as a `{ duration, easing }` pair for web
 * (which can't natively run a spring). Uses fitted heuristics over the
 * spring parameters; the result is a CSS transition that *feels*
 * close to the requested spring without the overhead of a JS-driven
 * physics loop on the main thread.
 *
 * Native renderers should use the spring directly via Reanimated's
 * `withSpring` instead of going through this helper.
 */
export function springToCssTiming(spring: SpringAnimationToken): {
  duration: string;
  easing: string;
} {
  // Prefer explicit overrides if the user supplied them.
  if (spring.duration !== undefined && spring.easing !== undefined) {
    return { duration: spring.duration, easing: spring.easing };
  }

  // Heuristic duration: lighter mass + stiffer spring = faster.
  // Real spring half-lives depend on damping but for the CSS
  // approximation a coarse mapping suffices.
  const mass = spring.mass ?? 1;
  const stiffness = spring.stiffness ?? 100;
  const damping = spring.damping ?? 10;
  const ms = Math.round(220 * Math.sqrt(mass / Math.max(1, stiffness / 100)));

  // Damping ratio < 1 → overshoot bezier; ≥ 1 → critically/over-damped → smooth.
  // Critical damping for a unit spring: ζ = damping / (2 * sqrt(mass * stiffness)).
  const zeta = damping / (2 * Math.sqrt(Math.max(1, mass * stiffness)));
  const easing =
    zeta < 0.7
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // overshoot — bouncy feel
      : zeta < 1
        ? 'cubic-bezier(0.22, 1, 0.36, 1)' // gentle ease-out, slight settle
        : 'cubic-bezier(0.4, 0, 0.2, 1)'; // critically damped — Material standard

  return { duration: spring.duration ?? `${ms}ms`, easing: spring.easing ?? easing };
}
