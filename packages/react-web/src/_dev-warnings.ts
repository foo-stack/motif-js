import type { MotionStyleBag, TransitionValue } from '@motif-js/core';
import type { ElementType } from 'react';

/**
 * Element types that the platform makes tabbable by default.
 *
 * Anchors (`<a>`) require an `href` to be tabbable in practice, but
 * detecting that here would require sniffing `rest.href` — out of scope
 * for the v1 heuristic. The dev-only nature of this warning means a
 * false negative on the rare hrefless `<a>` is acceptable.
 */
const NATIVELY_TABBABLE: ReadonlySet<string> = new Set([
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
]);

/**
 * Dev-only warning: fires when `_focus` is set on an element that has no
 * implicit tab stop and no explicit `tabIndex`. Such an element will never
 * receive `:focus-visible`, so the styling never applies — almost always
 * a bug.
 *
 * Wrapped entirely in `process.env.NODE_ENV !== 'production'` at the call
 * site so production bundlers tree-shake the call. The body is also
 * guarded so direct callers (tests) get the production no-op behaviour
 * when `NODE_ENV === 'production'`.
 *
 * Each unique `(elementType, tabIndex-presence)` combination warns at
 * most once per process to avoid flooding the console on repeat renders.
 */
export function warnIfFocusOnNonTabbable(
  as: ElementType | undefined,
  rest: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === 'production') return;

  if (rest.tabIndex !== undefined) return;

  const elementType = typeof as === 'string' ? as : undefined;

  // Non-string `as` (a forwardRef component, a custom element factory)
  // could resolve to anything — skip the warning rather than emit false
  // positives. Authors of styled wrappers can add the warning in their
  // own code if they need it.
  if (elementType === undefined && as !== undefined) return;

  const resolved = elementType ?? 'div';
  if (NATIVELY_TABBABLE.has(resolved)) return;

  const cacheKey = resolved;
  if (warned.has(cacheKey)) return;
  warned.add(cacheKey);

  // eslint-disable-next-line no-console
  console.warn(
    `[motif] _focus is set on a <${resolved}>, which is not tabbable by default. ` +
      `Add \`tabIndex={0}\` or render an interactive element type ` +
      `(e.g. \`as="button"\`, \`as="a"\`) so the focus styling can apply.`,
  );
}

const warned = new Set<string>();

/** Test-only: reset the warning dedup cache. */
export function _resetDevWarningsForTesting(): void {
  warned.clear();
  motionWarned.clear();
}

/**
 * Dev-only warning: fires when `enterStyle` or `exitStyle` is set
 * without a `transition` prop. With no transition, the style change
 * is instantaneous — almost always a misuse.
 *
 * Wrapped in `process.env.NODE_ENV !== 'production'` so production
 * tree-shakes the call. Each unique combination of motion-prop keys
 * warns at most once per process to keep dev consoles quiet.
 */
export function warnIfMotionWithoutTransition(
  enterStyle: MotionStyleBag | undefined,
  exitStyle: MotionStyleBag | undefined,
  transition: TransitionValue | undefined,
): void {
  if (process.env.NODE_ENV === 'production') return;
  if (transition !== undefined) return;
  if (enterStyle === undefined && exitStyle === undefined) return;

  const enterKeys = enterStyle === undefined ? '' : Object.keys(enterStyle).sort().join(',');
  const exitKeys = exitStyle === undefined ? '' : Object.keys(exitStyle).sort().join(',');
  const cacheKey = `enter:${enterKeys}|exit:${exitKeys}`;
  if (motionWarned.has(cacheKey)) return;
  motionWarned.add(cacheKey);

  const present = [
    enterStyle !== undefined ? 'enterStyle' : null,
    exitStyle !== undefined ? 'exitStyle' : null,
  ]
    .filter(Boolean)
    .join(' / ');

  // eslint-disable-next-line no-console
  console.warn(
    `[motif] ${present} is set without a \`transition\` prop. The style ` +
      `change will be instantaneous. Add e.g. ` +
      `\`transition={{ property: 'opacity', duration: '$durations.3' }}\`.`,
  );
}

const motionWarned = new Set<string>();
