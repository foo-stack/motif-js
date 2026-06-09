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
 * 1. The initial render — server AND the first client (hydration) render —
 *    has `entering === false`, i.e. the **resting** style with no enter
 *    overlay. So the SSR HTML never contains the hidden overlay
 *    (`opacity: 0`) — no FOUC, no invisible-until-hydrated content — and the
 *    first client render is byte-identical to the server output (no
 *    hydration mismatch).
 * 2. `useLayoutEffect` (client only — layout effects never run on the server)
 *    flips `entering` to `true` synchronously, *before* the browser paints
 *    the first client frame, so the very first painted frame shows the enter
 *    overlay. A `requestAnimationFrame` then flips it back to the resting
 *    style on the next frame; the browser sees the style change and runs the
 *    CSS transition declared via `transition` against each animatable
 *    property.
 *
 * The net effect: SSR content stays invisible-overlay-free in the HTML and
 * the entry animation plays purely client-side after the first commit.
 *
 * Box only dispatches here when `enterStyle !== undefined`, so call
 * sites that don't use entry animations pay no hook cost.
 */
export function BoxWithEnter(props: BoxWithEnterProps) {
  const { as, passThrough, finalClassName, baseStyle, inlineStyle, enterStyle, children } = props;

  const [entering, setEntering] = useState<boolean>(false);
  // Parent `<Stack stagger={…}>` injects a per-child delay through
  // this context. When non-zero we append `transition-delay` to the
  // resolved inline style — without overwriting any `transition` the
  // consumer already set.
  const staggerDelaySec = useStaggerDelay();

  useLayoutEffect(() => {
    // Apply the overlay before the first client paint, then remove it next
    // frame so the transition runs. Both updates are client-only, so the
    // server render and the first client render show the resting style.
    setEntering(true);
    const id = requestAnimationFrame(() => {
      setEntering(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const enterResolved = entering
    ? resolveStylesToVars(enterStyle as Record<string, unknown>).style
    : null;

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
