import type { StylePropName } from './style-props.js';

/**
 * Brand symbol carried on every motion value. Use {@link isMotionValue}
 * to check — direct property access shouldn't be needed by consumers.
 *
 * Symbol-keyed brand (rather than a string discriminator) so consumer
 * objects can't accidentally collide with the shape via a stray
 * `__motifMotionValue: true` field.
 */
export const motionValueBrand: unique symbol = Symbol.for('motif.motionValue');

/**
 * A reactive animatable value that lives outside React's render cycle.
 * `.set(v)` synchronously notifies every subscriber registered via
 * `.on('change', cb)` — no render is scheduled. Consumers (the web
 * `Box` and the native motion driver) subscribe to the value and write
 * to the DOM / native node directly, achieving 60fps updates without
 * the React reconciliation cost a `setState`-per-frame pattern incurs.
 *
 * The value carries a brand so the runtime resolvers can distinguish
 * a motion value from a literal CSS value at any style-prop slot.
 *
 * @example
 *   const x = createMotionValue(0);
 *   const unsubscribe = x.on('change', (v) => console.log(v));
 *   x.set(100);   // logs 100
 *   x.set(100);   // no-op (Object.is equal to previous value)
 *   unsubscribe();
 *
 * @remarks
 * Writes are immediate — `transition` on the consuming primitive does
 * **not** ease motion-value-driven prop changes. (This matches
 * framer-motion's model.) For eased writes on `.set()`, a future
 * `useSpring(initial, config)` returns a motion value that interpolates
 * toward its target; that is not part of this v1 surface.
 */
export interface MotionValue<T extends string | number = string | number> {
  /** Read the current value. Safe to call any time. */
  get(): T;
  /**
   * Write a new value. If `Object.is(currentValue, value)` is true,
   * subscribers are not notified — this is the same equality check
   * React uses for `useState` bail-outs.
   */
  set(value: T): void;
  /**
   * Subscribe to value changes. The returned function unsubscribes.
   *
   * Only the `'change'` event is supported in v1. Pass any other event
   * name to receive a dev-mode warning; the subscription is registered
   * regardless so consumer code path stays simple.
   */
  on(event: 'change', cb: (value: T) => void): () => void;
  /** Brand. Use {@link isMotionValue} to check. */
  readonly [motionValueBrand]: true;
}

/**
 * Create a motion value initialised to `initial`. The returned object
 * is a stable reference for its lifetime — callers (notably the
 * `useMotionValue` hook in `@usemotif/react` and
 * `@usemotif/react-native`) memoize on it.
 *
 * The overloads widen literal types at the call site so that
 * `createMotionValue(0)` is typed as `MotionValue<number>` (not
 * `MotionValue<0>`) and consumers can `.set()` arbitrary numbers
 * without an explicit type argument. Pass an explicit type argument
 * to opt back into a narrower union (`createMotionValue<'a' | 'b'>(...)`).
 */
export function createMotionValue(initial: number): MotionValue<number>;
export function createMotionValue(initial: string): MotionValue<string>;
export function createMotionValue<T extends string | number>(initial: T): MotionValue<T>;
export function createMotionValue<T extends string | number>(initial: T): MotionValue<T> {
  let current = initial;
  const subscribers = new Set<(value: T) => void>();
  return {
    [motionValueBrand]: true,
    get: () => current,
    set: (value: T) => {
      if (Object.is(current, value)) return;
      current = value;
      for (const cb of subscribers) cb(value);
    },
    on: (_event: 'change', cb: (value: T) => void) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
  };
}

/**
 * True iff the value is a motion value created via
 * {@link createMotionValue}. Brand-checked.
 */
export function isMotionValue(value: unknown): value is MotionValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [motionValueBrand]?: unknown })[motionValueBrand] === true
  );
}

/**
 * Style props whose value slot accepts `T | MotionValue<T>` in addition
 * to the literal form. The widening is deliberately narrow in v1 —
 * scoped to props that consumers reach for in animation. Adding more
 * props later is a purely additive type change.
 */
export type MotionValueWidenedProp =
  | 'opacity'
  | 'width'
  | 'height'
  | 'w'
  | 'h'
  | 'minW'
  | 'minH'
  | 'maxW'
  | 'maxH'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'start'
  | 'end'
  | 'borderRadius'
  | 'fontSize'
  | 'zIndex'
  | 'transform'
  // Transform shorthand axes. Each accepts a MotionValue and is
  // re-composed into the canonical `transform` string on every change.
  // The web/native motion-bindings runtimes treat these specially —
  // multiple axis-MVs on one element share a single `transform` slot
  // and a coalesced write per frame.
  | 'x'
  | 'y'
  | 'z'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'skew'
  | 'skewX'
  | 'skewY';

/**
 * Returns `MotionValue<string | number>` for props in
 * {@link MotionValueWidenedProp}, and `never` for all others.
 *
 * Renderer packages build their per-platform `BoxProps` by unioning
 * this with their normal responsive-value type:
 *
 * ```ts
 * type ResponsiveStyleProps = {
 *   -readonly [K in keyof StyleProps]?:
 *     Responsive<NonNullable<StyleProps[K]>> | MotionValueWideningOf<K>;
 * };
 * ```
 *
 * The union shape keeps motion-value acceptance scoped to the top-level
 * prop slot. Embedding an MV inside a responsive object
 * (`<Box opacity={{ base: mv, md: 1 }}>`) is rejected — v1 does not
 * resolve MV-at-breakpoint; consumers wanting per-breakpoint MV use
 * {@link useTransform} to build a derived value.
 */
export type MotionValueWideningOf<K extends StylePropName> = K extends MotionValueWidenedProp
  ? MotionValue<string | number>
  : never;
