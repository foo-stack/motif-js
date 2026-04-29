import {
  PSEUDO_SELECTOR,
  STYLE_PROP_NAMES,
  resolveResponsiveStylesToVars,
  resolveStylesToVars,
  type BreakpointName,
  type StateStyleBag,
  type StateStyleProps,
  type StyleProps,
} from '@motif-js/core';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { warnIfFocusOnNonTabbable } from './_dev-warnings.js';
import { injectAtRules, injectPseudoRules, type PseudoRule } from './style-cache.js';
import { useActiveCollector } from './collector-context.js';

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
 * CSS pseudo-class. Standard HTML attributes (id, data-*, aria-*, event
 * handlers) flow through to the rendered element.
 */
export type BoxProps = ResponsiveStyleProps &
  StateStyleProps &
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
    ...rest
  } = props;

  // Hot-path predicate: most call sites set zero pseudo-state bags, so
  // a single short-circuited boolean is faster than building a state
  // object eagerly.
  const hasPseudo =
    _hover !== undefined ||
    _focus !== undefined ||
    _active !== undefined ||
    _disabled !== undefined;

  if (process.env.NODE_ENV !== 'production' && _focus !== undefined) {
    warnIfFocusOnNonTabbable(as, rest);
  }

  // Compiled-output fast path: when the build tool's motif plugin has
  // already extracted every style prop, `rest` carries no style props and
  // no pseudo-state bags are present. The resolver / class-injection
  // round-trip is pure overhead in that case. Cheap O(rest.keys) early
  // return keeps the wrapper's runtime cost close to a plain
  // `createElement`.
  if (!hasPseudo && !hasAnyStyleProp(rest)) {
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
  // are present — the common case for render-heavy lists.
  const pseudoClass = hasPseudo
    ? injectPseudoRules(
        buildPseudoRules(_hover, _focus, _active, _disabled),
        activeCollector,
      )
    : undefined;
  const finalClassName =
    [responsiveClass, pseudoClass, userClassName].filter(Boolean).join(' ') || undefined;

  return createElement(
    as,
    {
      ...passThrough,
      className: finalClassName,
      style: { ...baseStyle, ...inlineStyle } as CSSProperties,
    },
    children,
  );
}

function buildPseudoRules(
  hover: StateStyleBag | undefined,
  focus: StateStyleBag | undefined,
  active: StateStyleBag | undefined,
  disabled: StateStyleBag | undefined,
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
  return rules;
}

function hasAnyStyleProp(rest: Record<string, unknown>): boolean {
  for (const key in rest) {
    if (STYLE_PROP_NAMES.has(key)) return true;
  }
  return false;
}
