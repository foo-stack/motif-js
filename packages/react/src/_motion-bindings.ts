import {
  isMotionValue,
  isStyleProp,
  isTokenRef,
  maybePx,
  styleProps,
  tokenRefToCssVar,
  type MotionValue,
  type StylePropName,
} from '@usemotif/core';

/**
 * One motion-value binding extracted from a Box's props bag. The
 * runtime subscribes to `mv` and writes its current value into
 * `element.style[cssProperty]` whenever the value changes.
 *
 * Only style props that resolve to a **single** CSS property are
 * eligible (no shorthand expansion in v1) — the
 * `MotionValueWidenedProp` union enforces this at the type level.
 */
export interface MotionBinding {
  /** Style-prop key as authored (`opacity`, `width`, `transform`, …). */
  readonly key: StylePropName;
  /** Resolved CSS property name; always a single string in v1. */
  readonly cssProperty: string;
  /** The motion value to subscribe to. */
  readonly mv: MotionValue;
  /** Token scale for the prop — used to resolve `$`-refs at write time. */
  readonly scale: string | undefined;
}

/** Sentinel shared array for the no-MV case — avoids per-render allocation. */
const EMPTY_BINDINGS: readonly MotionBinding[] = [];

/**
 * Pull motion-value-typed style props out of a Box's `rest` bag.
 * Returns the bindings (empty when no MVs are present) and a stripped
 * rest with the MV slots removed — the regular style-prop resolver
 * doesn't know how to handle a motion value, so the slots must be
 * extracted before resolution runs.
 *
 * The input bag is not mutated; the returned rest is either the
 * untouched input (when no MVs) or a fresh shallow copy minus the
 * MV-keyed slots.
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
    // Shorthand props (`px` → `[paddingLeft, paddingRight]`) are not
    // part of the v1 motion-value widening surface. If a consumer
    // somehow lands an MV on a shorthand slot, drop it silently here —
    // the broader runtime resolver would have dropped it too.
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

/**
 * Write a motion-value's current value to an element's inline style,
 * handling unit suffixing (numbers → `Npx` for length properties) and
 * token-ref resolution (`$colors.red` → `var(--colors-red)`).
 *
 * Used by both the initial seed (effect mount) and the per-change
 * subscriber.
 */
export function writeMotionValueToStyle(
  element: HTMLElement | SVGElement,
  cssProperty: string,
  scale: string | undefined,
  value: string | number,
): void {
  let serialised: string;
  if (typeof value === 'number') {
    // `maybePx` keeps unitless props (`opacity`, `zIndex`) bare and
    // appends `px` to length properties — same convention React's
    // inline-style resolution uses.
    serialised = maybePx(cssProperty, value);
  } else if (isTokenRef(value)) {
    // Token refs resolve to a `var(--…)` reference; the active
    // `[data-theme]` cascade picks the value. If the ref can't be
    // encoded (no scale, malformed), fall back to the raw string —
    // browsers will silently ignore it, matching the existing
    // resolver's behaviour.
    serialised = tokenRefToCssVar(value, scale) ?? value;
  } else {
    serialised = value;
  }
  // `element.style` accepts camelCase property names; assigning a
  // string is the canonical way to set an inline style imperatively.
  (element.style as unknown as Record<string, string>)[cssProperty] = serialised;
}
