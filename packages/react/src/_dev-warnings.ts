import type { ExitStyleBag, MotionStyleBag, TransitionValue } from '@usemotif/core';
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
  flexDisplayWarned.clear();
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
  exitStyle: ExitStyleBag | undefined,
  transition: TransitionValue | undefined,
): void {
  if (process.env.NODE_ENV === 'production') return;
  if (transition !== undefined) return;
  // A phase bag that carries its own `transition` sets its own timing and
  // doesn't need the base prop. Honored for `exitStyle` (the exit rule emits
  // it); `enterStyle` still animates on the base `transition`, so it isn't
  // exempted here.
  const exitHasOwnTransition = exitStyle !== undefined && exitStyle.transition !== undefined;
  const enterNeeds = enterStyle !== undefined;
  const exitNeeds = exitStyle !== undefined && !exitHasOwnTransition;
  if (!enterNeeds && !exitNeeds) return;

  const enterKeys = enterStyle === undefined ? '' : Object.keys(enterStyle).sort().join(',');
  const exitKeys = exitStyle === undefined ? '' : Object.keys(exitStyle).sort().join(',');
  const cacheKey = `enter:${enterKeys}|exit:${exitKeys}`;
  if (motionWarned.has(cacheKey)) return;
  motionWarned.add(cacheKey);

  const present = [enterNeeds ? 'enterStyle' : null, exitNeeds ? 'exitStyle' : null]
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

/**
 * Style props whose effect requires a flex- or grid-display context.
 * `gap` / `rowGap` / `columnGap` strictly also apply to block layout in
 * modern browsers, but in practice nobody authoring `flexDirection`
 * means block-flow gap — including them here catches the intent.
 */
const FLEX_OR_GRID_ONLY_PROPS: ReadonlySet<string> = new Set([
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'alignItems',
  'alignContent',
  'justifyContent',
  'justifyItems',
  'placeItems',
  'placeContent',
  'gap',
  'rowGap',
  'columnGap',
]);

/** Display values that activate the flex / grid layout model. */
const FLEX_OR_GRID_DISPLAYS: ReadonlySet<string> = new Set([
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
]);

/**
 * Dev-only warning: fires when a Box has flex- or grid-only style
 * props (`flexDirection`, `alignItems`, `gap`, …) but no `display`
 * resolving to a flex / grid value at any breakpoint. `<Box>` defaults
 * to `display: block`; in that mode the flex / grid props land on the
 * element but have no effect, and the only signal today is the visual.
 *
 * Tolerates responsive `display` objects and arrays — if any
 * breakpoint slot resolves to flex / inline-flex / grid / inline-grid,
 * the warning skips (the props will apply at that breakpoint).
 *
 * Wrapped in `process.env.NODE_ENV !== 'production'` at the call site
 * so production tree-shakes the call. Each unique (resolved element
 * tag + sorted triggering-prop list) combination warns at most once
 * per process to keep dev consoles quiet on repeat renders.
 *
 * The bug this warning catches is web-only — RN `View` defaults to
 * `display: flex` under Yoga, so flex props always apply there.
 */
export function warnIfFlexPropsWithoutFlexDisplay(
  as: ElementType | undefined,
  rest: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === 'production') return;

  const triggering: string[] = [];
  for (const key in rest) {
    if (FLEX_OR_GRID_ONLY_PROPS.has(key)) triggering.push(key);
  }
  if (triggering.length === 0) return;

  if (displayResolvesToFlexOrGrid(rest.display)) return;

  // Non-string `as` (a forwardRef component, a custom element factory)
  // could resolve to anything — skip the warning rather than emit false
  // positives. Authors of styled wrappers can add the warning themselves
  // if they need it.
  const elementType = typeof as === 'string' ? as : undefined;
  if (elementType === undefined && as !== undefined) return;
  const resolved = elementType ?? 'div';

  triggering.sort();
  const cacheKey = `${resolved}|${triggering.join(',')}`;
  if (flexDisplayWarned.has(cacheKey)) return;
  flexDisplayWarned.add(cacheKey);

  const leadProp = triggering[0]!;
  const others = triggering.length - 1;
  const propPhrase =
    others === 0
      ? `\`${leadProp}\``
      : others === 1
        ? `\`${leadProp}\` (and one other flex/grid-only prop)`
        : `\`${leadProp}\` (and ${others} other flex/grid-only props)`;

  // eslint-disable-next-line no-console
  console.warn(
    `[motif] ${propPhrase} is set on a <${resolved}> without an explicit \`display\`. ` +
      `<Box> defaults to \`display: block\`, in which flex- and grid-only props have no effect. ` +
      `Add \`display="flex"\` — or use <Stack> / <HStack> / <VStack> / <Center>.`,
  );
}

const flexDisplayWarned = new Set<string>();

/**
 * True iff the given `display` value (literal string, responsive
 * object, or responsive array) resolves to flex / inline-flex / grid /
 * inline-grid at any breakpoint. Unknown shapes return false so the
 * warning can still fire when consumers pass something unusual.
 */
function displayResolvesToFlexOrGrid(display: unknown): boolean {
  if (display === undefined || display === null) return false;
  if (typeof display === 'string') return FLEX_OR_GRID_DISPLAYS.has(display);
  if (Array.isArray(display)) {
    for (const v of display) {
      if (typeof v === 'string' && FLEX_OR_GRID_DISPLAYS.has(v)) return true;
    }
    return false;
  }
  if (typeof display === 'object') {
    for (const v of Object.values(display as Record<string, unknown>)) {
      if (typeof v === 'string' && FLEX_OR_GRID_DISPLAYS.has(v)) return true;
    }
    return false;
  }
  return false;
}
