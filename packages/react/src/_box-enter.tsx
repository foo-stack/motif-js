'use client';

import { resolveStylesToVars, type MotionStyleBag } from '@usemotif/core';
import {
  createElement,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { useStaggerDelay } from './_stagger-context.js';

export interface BoxWithEnterProps {
  readonly as: ElementType;
  readonly passThrough: Record<string, unknown>;
  readonly finalClassName: string | undefined;
  readonly baseStyle: Record<string, string | number>;
  readonly inlineStyle: CSSProperties | undefined;
  readonly enterStyle: MotionStyleBag;
  readonly children?: ReactNode;
}

/**
 * Internal sub-component that owns the per-instance "have we mounted
 * past the first paint yet?" state required for entry animations.
 *
 * Mechanics:
 *
 * 1. First render with `hasMounted === false` overlays `enterStyle` on
 *    top of `baseStyle`. The browser commits these values to the layer
 *    tree.
 * 2. `useLayoutEffect` schedules a `requestAnimationFrame` callback.
 *    On the next frame, `setHasMounted(true)` triggers a re-render
 *    with the enter overlay removed; the browser sees a style change
 *    and runs the CSS transition declared via `transition` against
 *    each animatable property.
 *
 * SSR policy: server renders DO NOT include `enterStyle` (the effect
 * never runs server-side, and we render the target style directly).
 * The first client paint after hydration is therefore identical to the
 * server output — no FOUC, no hydration mismatch, but also no entry
 * animation on hydrated content. Client-mounted elements (Dialog
 * opening, Toast appearing) get the full entry animation.
 *
 * Box only dispatches here when `enterStyle !== undefined`, so call
 * sites that don't use entry animations pay no hook cost.
 */
export function BoxWithEnter(props: BoxWithEnterProps) {
  const { as, passThrough, finalClassName, baseStyle, inlineStyle, enterStyle, children } = props;

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  // Parent `<Stack stagger={…}>` injects a per-child delay through
  // this context. When non-zero we append `transition-delay` to the
  // resolved inline style — without overwriting any `transition` the
  // consumer already set.
  const staggerDelaySec = useStaggerDelay();

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const enterResolved = hasMounted
    ? null
    : resolveStylesToVars(enterStyle as Record<string, unknown>).style;

  const staggerStyle: CSSProperties | undefined =
    staggerDelaySec > 0 ? { transitionDelay: `${staggerDelaySec}s` } : undefined;

  const style = (
    enterResolved === null
      ? { ...baseStyle, ...staggerStyle, ...inlineStyle }
      : { ...baseStyle, ...enterResolved, ...staggerStyle, ...inlineStyle }
  ) as CSSProperties;

  return createElement(
    as,
    {
      ...passThrough,
      className: finalClassName,
      style,
    },
    children,
  );
}
