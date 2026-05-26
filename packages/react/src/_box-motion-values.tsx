'use client';

import { resolveStylesToVars, type MotionStyleBag } from '@usemotif/core';
import {
  createElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from 'react';
import { writeMotionValueToStyle, type MotionBinding } from './_motion-bindings.js';

export interface BoxWithMotionValuesProps {
  readonly as: ElementType;
  readonly passThrough: Record<string, unknown>;
  readonly finalClassName: string | undefined;
  readonly baseStyle: Record<string, string | number>;
  readonly inlineStyle: CSSProperties | undefined;
  readonly motionBindings: readonly MotionBinding[];
  /** Set when the Box also has an entry animation. */
  readonly enterStyle: MotionStyleBag | undefined;
  readonly children?: ReactNode;
}

/**
 * Wrapper sub-component for any `<Box>` whose props include a motion
 * value. Owns the element ref + the subscription effect that writes
 * each motion value's current value straight to `element.style` on
 * change — bypassing React's render cycle so per-frame updates do not
 * incur reconciliation cost.
 *
 * When `enterStyle` is also set, the entry animation runs first
 * (`hasMounted` state mirrors `BoxWithEnter`'s mechanic). Motion-value
 * subscriptions activate **after** the entry animation has settled,
 * so the enter overlay and the per-frame MV writes don't race for the
 * same `style` slot.
 *
 * User-passed `ref` is composed with the internal element ref so
 * consumers retain the usual ref semantics on `<Box ref={…}>` even
 * when MVs are in play.
 *
 * Box dispatches here only when at least one motion-value-typed style
 * prop is set; the common no-MV path stays on the existing inline /
 * `BoxWithEnter` codepaths and pays no hook cost from this file.
 */
export function BoxWithMotionValues(props: BoxWithMotionValuesProps) {
  const {
    as,
    passThrough,
    finalClassName,
    baseStyle,
    inlineStyle,
    motionBindings,
    enterStyle,
    children,
  } = props;

  // Compose a user-passed `ref` (React 19 surfaces it as a regular
  // prop) with our internal element ref. Strip from passThrough to
  // avoid double-attaching when we spread.
  const userRef = (passThrough as { ref?: Ref<HTMLElement> }).ref;
  const passThroughWithoutRef: Record<string, unknown> = { ...passThrough };
  if ('ref' in passThroughWithoutRef) delete passThroughWithoutRef.ref;

  const internalRef = useRef<HTMLElement | null>(null);
  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      internalRef.current = node;
      if (typeof userRef === 'function') {
        userRef(node);
      } else if (userRef !== null && userRef !== undefined) {
        (userRef as { current: HTMLElement | null }).current = node;
      }
    },
    [userRef],
  );

  // Entry animation. When no enterStyle, `hasMounted` starts true and
  // the entry overlay is skipped entirely.
  const hasEnter = enterStyle !== undefined;
  const [hasMounted, setHasMounted] = useState<boolean>(!hasEnter);

  useLayoutEffect(() => {
    if (!hasEnter || hasMounted) return;
    const id = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, [hasEnter, hasMounted]);

  // Motion-value subscriptions. Re-run every render (no deps) — MV
  // on/off is O(1), the binding list is typically tiny, and this
  // sidesteps the variable-length-deps problem cleanly. The seed call
  // makes the very first paint reflect the MV's current value (so a
  // pre-animated MV doesn't briefly show the literal baseStyle).
  useLayoutEffect(() => {
    if (!hasMounted) return;
    const element = internalRef.current;
    if (element === null) return;

    for (const b of motionBindings) {
      writeMotionValueToStyle(element, b.cssProperty, b.scale, b.mv.get());
    }
    const unsubs: Array<() => void> = motionBindings.map((b) =>
      b.mv.on('change', (value) => {
        writeMotionValueToStyle(element, b.cssProperty, b.scale, value);
      }),
    );

    return () => {
      for (const u of unsubs) u();
    };
  });

  const enterResolved =
    hasEnter && !hasMounted
      ? resolveStylesToVars(enterStyle as unknown as Record<string, unknown>).style
      : null;

  const style = (
    enterResolved === null
      ? { ...baseStyle, ...inlineStyle }
      : { ...baseStyle, ...enterResolved, ...inlineStyle }
  ) as CSSProperties;

  return createElement(
    as,
    {
      ...passThroughWithoutRef,
      ref: refCallback,
      className: finalClassName,
      style,
    },
    children,
  );
}
