import {
  defaultBreakpoints,
  isResponsiveObject,
  parseResponsiveDSL,
  responsiveArrayToObject,
  type BreakpointName,
} from '@motif-js/core';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

/**
 * Subscribe to RN's `Dimensions` and return the current window width.
 * Re-renders the consumer whenever the device rotates / window resizes
 * (relevant on tablets, foldables, and split-screen on iPadOS /
 * Android).
 *
 * The hook reads the **window** dimension (excludes the status bar /
 * notch on most platforms) which is the right unit for breakpoint
 * matching.
 */
export function useViewportWidth(): number {
  const [width, setWidth] = useState<number>(() => Dimensions.get('window').width);
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub.remove();
  }, []);
  return width;
}

/**
 * Sorted breakpoint list (ascending). Used by the resolver to walk
 * slots in mobile-first order so the *largest* breakpoint <= viewport
 * width wins.
 */
const BREAKPOINTS_ASC: ReadonlyArray<{ name: BreakpointName; px: number }> = (
  Object.keys(defaultBreakpoints) as BreakpointName[]
)
  .map((name) => ({ name, px: defaultBreakpoints[name] }))
  .sort((a, b) => a.px - b.px);

/**
 * Pick the right slot of a responsive value for the given viewport
 * width. Native equivalent of the web's `@media (min-width: …)`
 * cascade — the slot whose breakpoint is the *largest* one ≤ `width`
 * wins, with `base` as the fallback.
 *
 * Container-query keys (`@<bp>` / `@<name>.<bp>`) are **ignored**
 * here; those are handled by the container-query polyfill via the
 * Container's `onLayout`. If a value carries only container keys
 * (no `base` and no plain breakpoint slots), the result is
 * `undefined` (consumer's caller drops the prop).
 *
 * @param value The responsive shape — object, array, or DSL string.
 *   Non-responsive values pass through unchanged.
 * @param width Current viewport width in CSS pixels.
 */
export function resolveResponsiveAtWidth(value: unknown, width: number): unknown {
  // Arrays: positional `[base, sm, md, …]`. Convert to object form
  // and walk through the same logic.
  if (Array.isArray(value)) {
    return pickFromObject(responsiveArrayToObject(value as readonly unknown[]), width);
  }
  // Strings: DSL ("base:$2 md:$4") or literal CSS value ("#fff",
  // "rgb(0,0,0)", etc.). The parser returns null for non-DSL strings.
  if (typeof value === 'string') {
    const parsed = parseResponsiveDSL(value);
    if (parsed === null) return value;
    return pickFromObject(parsed, width);
  }
  // Objects: walk keys, pick the right one.
  if (isResponsiveObject(value)) {
    return pickFromObject(value as Record<string, unknown>, width);
  }
  return value;
}

/**
 * Apply the breakpoint cascade across a responsive object. Returns
 * the value at the largest media-query breakpoint <= `width`, or
 * `base` if none qualify, or `undefined` if the object is
 * container-only.
 */
function pickFromObject(obj: Record<string, unknown>, width: number): unknown {
  let chosen: unknown = obj['base'];
  for (const { name, px } of BREAKPOINTS_ASC) {
    if (width < px) break;
    const slot = obj[name];
    if (slot !== undefined) chosen = slot;
  }
  return chosen;
}

/**
 * Walk a props bag, replacing every responsive shape with its
 * appropriate slot for the current viewport. Non-responsive values
 * pass through. Container-query keys are dropped — those resolve via
 * the container-query polyfill, not the viewport.
 */
export function resolveResponsivePropsAtWidth(
  props: Record<string, unknown>,
  width: number,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in props) {
    out[key] = resolveResponsiveAtWidth(props[key], width);
  }
  return out;
}

/**
 * Stop-gap from the foundation commit — picks the `base` slot of any
 * responsive shape, ignoring breakpoints. Kept around for places that
 * deliberately don't want viewport awareness (e.g. style bags inside
 * pseudo-state props on Pressable, where breakpoints would compose
 * with state in a way that requires nested at-rules).
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
