import {
  isMotionValue,
  isStyleProp,
  styleProps,
  type MotionValue,
  type StylePropName,
} from '@usemotif/core';

/**
 * One motion-value binding extracted from a Box's props bag. Mirrors
 * the web counterpart in `@usemotif/react`'s `_motion-bindings.ts` —
 * same shape on both platforms so the cross-platform concept stays
 * uniform. On native, the runtime dispatches the bindings to the
 * active motion driver's `useMotionValueBacking` hook, which maps
 * each binding to its native animated primitive (`Animated.Value` for
 * the default driver, Reanimated shared value for the UI-thread
 * driver, literal pass-through for noop).
 */
export interface MotionBinding {
  /** Style-prop key as authored (`opacity`, `width`, `transform`, …). */
  readonly key: StylePropName;
  /** Resolved CSS / RN style property name; always a single string in v1. */
  readonly cssProperty: string;
  /** The motion value to subscribe to. */
  readonly mv: MotionValue;
  /** Token scale for the prop. Currently unused on native (v1 is
   *  numeric-only); retained for parity with the web shape. */
  readonly scale: string | undefined;
}

const EMPTY_BINDINGS: readonly MotionBinding[] = [];

/**
 * Pull motion-value-typed style props out of a Box's `rest` bag.
 * Returns the bindings (empty when no MVs) and a stripped rest with
 * the MV slots removed — the regular `resolveStyles` resolver below
 * has no concept of motion values and would silently drop them
 * otherwise.
 */
export function splitMotionValueProps(rest: Record<string, unknown>): {
  motionBindings: readonly MotionBinding[];
  restWithoutMv: Record<string, unknown>;
} {
  let bindings: MotionBinding[] | null = null;
  let stripped: Record<string, unknown> | null = null;

  for (const key in rest) {
    const value = rest[key];
    if (!isMotionValue(value)) continue;
    if (!isStyleProp(key)) continue;

    const def = styleProps[key];
    // Shorthand props aren't part of the v1 motion-value widening
    // surface. If an MV somehow lands on a shorthand slot, drop —
    // matches the web side's behaviour.
    if (typeof def.cssProperty !== 'string') continue;

    if (bindings === null) {
      bindings = [];
      stripped = { ...rest };
    }
    bindings.push({
      key: key as StylePropName,
      cssProperty: def.cssProperty,
      mv: value,
      scale: def.scale,
    });
    delete stripped![key];
  }

  return {
    motionBindings: bindings ?? EMPTY_BINDINGS,
    restWithoutMv: stripped ?? rest,
  };
}
