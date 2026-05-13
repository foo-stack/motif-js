import {
  PSEUDO_ELEMENT_SELECTOR,
  PSEUDO_SELECTOR,
  STYLE_PROP_NAMES,
  buildAnimationCss,
  buildAnimationShorthand,
  extractKeyframeFromAnimation,
  resolveResponsiveStylesToVars,
  resolveStylesToVars,
  resolveTransitionToVars,
  type AnimationValue,
  type BreakpointName,
  type MotionStyleBag,
  type MotionStyleProps,
  type PseudoElementStyleBag,
  type PseudoElementStyleProps,
  type StateStyleBag,
  type StateStyleProps,
  type StyleProps,
  type TransitionValue,
} from '@usemotif/core';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { warnIfFocusOnNonTabbable, warnIfMotionWithoutTransition } from './_dev-warnings.js';
import { BoxWithEnter } from './_box-enter.js';
import {
  injectAtRules,
  injectKeyframes,
  injectPseudoRules,
  type PseudoRule,
} from './style-cache.js';
import { useActiveCollector } from './collector-context.js';

/** Selector suffix used to opt into `exitStyle` from a parent boundary. */
const EXIT_SELECTOR = '[data-motif-state="exiting"]';

/**
 * A responsive style-prop value. One of:
 *
 * - Literal value (string / number) — applied unconditionally.
 * - Responsive object — keyed by:
 *   - `base` — unconditional (applied as inline style).
 *   - `<bp>` (e.g. `md`) — applied at `@media (min-width: ...)`.
 *   - `@<bp>` — applied at `@container (min-width: ...)` against the
 *     nearest container ancestor.
 *   - `@<name>.<bp>` — applied at `@container <name> (min-width: ...)`.
 * - Responsive array `[base, sm, md, lg, xl, '2xl']` — positional shorthand
 *   for the object form (media-query keys only). Trailing slots optional.
 */
type Responsive<V> =
  | V
  | ({ base?: V } & { [K in BreakpointName]?: V } & { [K in `@${string}`]?: V })
  | readonly (V | undefined)[];

/**
 * Style props at the React level — every prop also accepts a responsive
 * object containing per-breakpoint overrides.
 */
type ResponsiveStyleProps = {
  -readonly [K in keyof StyleProps]?: Responsive<NonNullable<StyleProps[K]>>;
};

/**
 * Props for the Box primitive.
 *
 * Style props ({@link StyleProps}) accept literal CSS values, `$`-prefixed
 * token references, or responsive objects (`{ base, sm, md, lg, xl }`).
 * Pseudo-state props ({@link StateStyleProps}) — `_hover`, `_focus`,
 * `_active`, `_disabled` — accept flat style bags applied via the matching
 * CSS pseudo-class. Motion props ({@link MotionStyleProps}) — `enterStyle`,
 * `exitStyle`, `transition` — drive mount/unmount transitions and
 * prop-change interpolation. Standard HTML attributes (id, data-*,
 * aria-*, event handlers) flow through to the rendered element.
 */
export type BoxProps = ResponsiveStyleProps &
  StateStyleProps &
  PseudoElementStyleProps &
  MotionStyleProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StyleProps | 'style' | 'children' | 'className'> & {
    /** Render as a different HTML element (defaults to `div`). */
    as?: ElementType;
    /** Extra class name(s) — concatenated with any responsive class motif emits. */
    className?: string;
    /** Inline style overrides — merged on top of the resolved style. */
    style?: CSSProperties;
    /** Content. */
    children?: ReactNode;
  };

/**
 * The atom of motif-js: a styled, theme-aware, responsive container.
 *
 * Token references (`bg="$colors.surface.base"`) emit `var(--…)` strings
 * resolved by the `[data-theme]` cascade.
 * Responsive objects (`p={{ base: '$2', md: '$4' }}`) emit per-breakpoint
 * media queries injected once into a stylesheet and applied via a generated
 * class name.
 * Pseudo-state props (`_hover={{ bg: '...' }}`) emit selector-suffixed
 * rules (`:hover`, `:focus-visible`, `:active`,
 * `:disabled, &[aria-disabled="true"]`) hashed into a deduped class.
 * Motion props (`transition`, `enterStyle`, `exitStyle`) drive mount /
 * unmount and prop-change interpolation. `transition` lands on inline
 * `style.transition`; `enterStyle` is paid as one runtime state per
 * instance (only when set); `exitStyle` is emitted as a CSS rule keyed on
 * `[data-motif-state="exiting"]` and consumed by exit-aware boundaries
 * (e.g. `Dialog.Content`).
 */
export function Box(props: BoxProps) {
  const {
    as = 'div',
    className: userClassName,
    style: inlineStyle,
    children,
    _hover,
    _focus,
    _active,
    _disabled,
    _before,
    _after,
    enterStyle,
    exitStyle,
    transition,
    animation,
    animateOnly,
    ...rest
  } = props;

  // Hot-path predicate: most call sites set zero pseudo bags, so a
  // single short-circuited boolean is faster than building a state
  // object eagerly. Pseudo-states (`_hover`, `_focus`, …) and pseudo-
  // elements (`_before`, `_after`) share the rule-injection path
  // because they hash + emit identically.
  const hasPseudo =
    _hover !== undefined ||
    _focus !== undefined ||
    _active !== undefined ||
    _disabled !== undefined ||
    _before !== undefined ||
    _after !== undefined;
  const hasMotion =
    transition !== undefined ||
    enterStyle !== undefined ||
    exitStyle !== undefined ||
    animation !== undefined;

  if (process.env.NODE_ENV !== 'production') {
    if (_focus !== undefined) warnIfFocusOnNonTabbable(as, rest);
    if (hasMotion) warnIfMotionWithoutTransition(enterStyle, exitStyle, transition);
  }

  // Compiled-output fast path: when the build tool's motif plugin has
  // already extracted every style prop, `rest` carries no style props and
  // no pseudo-state / motion bags are present. The resolver / class-
  // injection round-trip is pure overhead in that case. Cheap
  // O(rest.keys) early return keeps the wrapper's runtime cost close to
  // a plain `createElement`.
  if (!hasPseudo && !hasMotion && !hasAnyStyleProp(rest)) {
    return createElement(
      as,
      {
        ...rest,
        ...(userClassName !== undefined && userClassName !== ''
          ? { className: userClassName }
          : {}),
        ...(inlineStyle !== undefined ? { style: inlineStyle } : {}),
      },
      children,
    );
  }

  const {
    baseStyle,
    atRules,
    rest: passThrough,
  } = resolveResponsiveStylesToVars(rest as Record<string, unknown>);

  const activeCollector = useActiveCollector();
  const responsiveClass = injectAtRules(atRules, activeCollector);
  // Skip pseudo-rule collection + injection entirely when no pseudo bags
  // and no exitStyle are present — the common case for render-heavy
  // lists.
  const pseudoClass =
    hasPseudo || exitStyle !== undefined
      ? injectPseudoRules(
          buildSelectorRules(_hover, _focus, _active, _disabled, _before, _after, exitStyle),
          activeCollector,
        )
      : undefined;
  const finalClassName =
    [responsiveClass, pseudoClass, userClassName].filter(Boolean).join(' ') || undefined;

  // `transition` wins over `animation` when both are set — `transition`
  // is the more specific, lower-level instruction. Without `transition`,
  // `animation` dispatches on form: a string is the M-1 surface (theme
  // `animations` token reference, expands to a CSS `transition`); an
  // `AnimationObject` assembles a CSS `animation` shorthand and may
  // carry a `Keyframe` whose `@keyframes` rule gets injected here once
  // (deduped by name). `animateOnly` only applies to the string form.
  const animationKeyframe = extractKeyframeFromAnimation(animation);
  if (animationKeyframe !== undefined) {
    injectKeyframes(animationKeyframe.name, animationKeyframe.css, activeCollector);
  }
  const baseStyleWithMotion = applyMotion(baseStyle, transition, animation, animateOnly);

  if (enterStyle !== undefined) {
    return createElement(
      BoxWithEnter,
      {
        as,
        passThrough,
        finalClassName,
        baseStyle: baseStyleWithMotion,
        inlineStyle,
        enterStyle,
      },
      children,
    );
  }

  return createElement(
    as,
    {
      ...passThrough,
      className: finalClassName,
      style: { ...baseStyleWithMotion, ...inlineStyle } as CSSProperties,
    },
    children,
  );
}

function buildSelectorRules(
  hover: StateStyleBag | undefined,
  focus: StateStyleBag | undefined,
  active: StateStyleBag | undefined,
  disabled: StateStyleBag | undefined,
  before: PseudoElementStyleBag | undefined,
  after: PseudoElementStyleBag | undefined,
  exit: MotionStyleBag | undefined,
): PseudoRule[] {
  const rules: PseudoRule[] = [];
  if (hover !== undefined) {
    rules.push({
      pseudo: PSEUDO_SELECTOR._hover,
      style: resolveStylesToVars(hover as Record<string, unknown>).style,
    });
  }
  if (focus !== undefined) {
    rules.push({
      pseudo: PSEUDO_SELECTOR._focus,
      style: resolveStylesToVars(focus as Record<string, unknown>).style,
    });
  }
  if (active !== undefined) {
    rules.push({
      pseudo: PSEUDO_SELECTOR._active,
      style: resolveStylesToVars(active as Record<string, unknown>).style,
    });
  }
  if (disabled !== undefined) {
    rules.push({
      pseudo: PSEUDO_SELECTOR._disabled,
      style: resolveStylesToVars(disabled as Record<string, unknown>).style,
    });
  }
  if (before !== undefined) {
    rules.push({
      pseudo: PSEUDO_ELEMENT_SELECTOR._before,
      style: resolvePseudoElementBag(before),
    });
  }
  if (after !== undefined) {
    rules.push({
      pseudo: PSEUDO_ELEMENT_SELECTOR._after,
      style: resolvePseudoElementBag(after),
    });
  }
  if (exit !== undefined) {
    rules.push({
      pseudo: EXIT_SELECTOR,
      style: resolveStylesToVars(exit as Record<string, unknown>).style,
    });
  }
  return rules;
}

/**
 * Resolve a pseudo-element bag to a CSS-shaped style. Handles `content`
 * specially (not a registered style prop, so `resolveStylesToVars`
 * drops it) and defaults `content: '""'` when omitted — without it,
 * browsers don't render `::before` / `::after`.
 */
function resolvePseudoElementBag(bag: PseudoElementStyleBag): Record<string, string | number> {
  const { content, ...rest } = bag;
  const { style } = resolveStylesToVars(rest as Record<string, unknown>);
  return { content: content ?? '""', ...style };
}

/**
 * Apply `transition` / `animation` to the base style. `transition`
 * wins when both are set. The string form of `animation` continues to
 * emit as CSS `transition` (M-1 surface, theme token reference); the
 * object form emits as CSS `animation` shorthand (M-2 surface).
 */
function applyMotion(
  baseStyle: Record<string, string | number>,
  transition: TransitionValue | undefined,
  animation: AnimationValue | undefined,
  animateOnly: readonly string[] | undefined,
): Record<string, string | number> {
  if (transition !== undefined) {
    const v = resolveTransitionToVars(transition);
    return v === undefined ? baseStyle : { ...baseStyle, transition: v };
  }
  if (animation === undefined) return baseStyle;
  if (typeof animation === 'string') {
    const v = buildAnimationCss(animation, animateOnly);
    return v === undefined ? baseStyle : { ...baseStyle, transition: v };
  }
  return { ...baseStyle, animation: buildAnimationShorthand(animation) };
}

function hasAnyStyleProp(rest: Record<string, unknown>): boolean {
  for (const key in rest) {
    if (STYLE_PROP_NAMES.has(key)) return true;
  }
  return false;
}

// Re-export for the conformance harness — useful in tests that pre-
// resolve a transition value without rendering Box.
export { resolveTransitionToVars };
export type { TransitionValue };
