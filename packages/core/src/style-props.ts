import type { ScaleName } from './types.js';

/**
 * Schema entry for one style prop. Maps the prop name to one or more CSS
 * properties, optionally records which token scale token references in this
 * prop should be looked up against.
 */
export interface StylePropDefinition {
  /** Single CSS property, or several (for shorthand like `px` → L+R). */
  readonly cssProperty: string | readonly string[];
  /** Token scale to use when the value is a `$`-prefixed bare reference. */
  readonly scale?: ScaleName;
}

/**
 * The single source of truth for style props. Both the runtime resolver and
 * the compiler consume this schema; both renderers (web and native) use the
 * same prop names.
 *
 * Naming follows two conventions:
 *
 * - Tamagui / styled-system shorthand for spacing and sizing (`p`, `m`,
 *   `w`, `h`, `bg`) — these are by far the most-used in real apps.
 * - Long CSS-property names for everything else, so users coming from CSS
 *   feel at home (`flexDirection`, `alignItems`, `borderRadius`).
 */
const stylePropsLiteral = {
  // Padding
  p: { cssProperty: 'padding', scale: 'space' },
  px: { cssProperty: ['paddingLeft', 'paddingRight'], scale: 'space' },
  py: { cssProperty: ['paddingTop', 'paddingBottom'], scale: 'space' },
  pt: { cssProperty: 'paddingTop', scale: 'space' },
  pr: { cssProperty: 'paddingRight', scale: 'space' },
  pb: { cssProperty: 'paddingBottom', scale: 'space' },
  pl: { cssProperty: 'paddingLeft', scale: 'space' },
  padding: { cssProperty: 'padding', scale: 'space' },

  // Margin
  m: { cssProperty: 'margin', scale: 'space' },
  mx: { cssProperty: ['marginLeft', 'marginRight'], scale: 'space' },
  my: { cssProperty: ['marginTop', 'marginBottom'], scale: 'space' },
  mt: { cssProperty: 'marginTop', scale: 'space' },
  mr: { cssProperty: 'marginRight', scale: 'space' },
  mb: { cssProperty: 'marginBottom', scale: 'space' },
  ml: { cssProperty: 'marginLeft', scale: 'space' },
  margin: { cssProperty: 'margin', scale: 'space' },

  // Gap
  gap: { cssProperty: 'gap', scale: 'space' },
  rowGap: { cssProperty: 'rowGap', scale: 'space' },
  columnGap: { cssProperty: 'columnGap', scale: 'space' },

  // Color
  bg: { cssProperty: 'backgroundColor', scale: 'colors' },
  backgroundColor: { cssProperty: 'backgroundColor', scale: 'colors' },
  color: { cssProperty: 'color', scale: 'colors' },
  borderColor: { cssProperty: 'borderColor', scale: 'colors' },

  // Sizing
  w: { cssProperty: 'width', scale: 'sizes' },
  h: { cssProperty: 'height', scale: 'sizes' },
  width: { cssProperty: 'width', scale: 'sizes' },
  height: { cssProperty: 'height', scale: 'sizes' },
  minW: { cssProperty: 'minWidth', scale: 'sizes' },
  minH: { cssProperty: 'minHeight', scale: 'sizes' },
  minWidth: { cssProperty: 'minWidth', scale: 'sizes' },
  minHeight: { cssProperty: 'minHeight', scale: 'sizes' },
  maxW: { cssProperty: 'maxWidth', scale: 'sizes' },
  maxH: { cssProperty: 'maxHeight', scale: 'sizes' },
  maxWidth: { cssProperty: 'maxWidth', scale: 'sizes' },
  maxHeight: { cssProperty: 'maxHeight', scale: 'sizes' },

  // Border
  borderRadius: { cssProperty: 'borderRadius', scale: 'radii' },
  borderWidth: { cssProperty: 'borderWidth', scale: 'borderWidths' },
  borderStyle: { cssProperty: 'borderStyle' },
  borderTopWidth: { cssProperty: 'borderTopWidth', scale: 'borderWidths' },
  borderRightWidth: { cssProperty: 'borderRightWidth', scale: 'borderWidths' },
  borderBottomWidth: { cssProperty: 'borderBottomWidth', scale: 'borderWidths' },
  borderLeftWidth: { cssProperty: 'borderLeftWidth', scale: 'borderWidths' },
  borderTopStyle: { cssProperty: 'borderTopStyle' },
  borderRightStyle: { cssProperty: 'borderRightStyle' },
  borderBottomStyle: { cssProperty: 'borderBottomStyle' },
  borderLeftStyle: { cssProperty: 'borderLeftStyle' },
  borderTopColor: { cssProperty: 'borderTopColor', scale: 'colors' },
  borderRightColor: { cssProperty: 'borderRightColor', scale: 'colors' },
  borderBottomColor: { cssProperty: 'borderBottomColor', scale: 'colors' },
  borderLeftColor: { cssProperty: 'borderLeftColor', scale: 'colors' },

  // Typography
  fontSize: { cssProperty: 'fontSize', scale: 'fontSizes' },
  fontWeight: { cssProperty: 'fontWeight', scale: 'fontWeights' },
  fontFamily: { cssProperty: 'fontFamily', scale: 'fontFamilies' },
  lineHeight: { cssProperty: 'lineHeight', scale: 'lineHeights' },
  letterSpacing: { cssProperty: 'letterSpacing', scale: 'letterSpacings' },
  textAlign: { cssProperty: 'textAlign' },
  textDecoration: { cssProperty: 'textDecoration' },
  textTransform: { cssProperty: 'textTransform' },

  // Flex / Layout
  display: { cssProperty: 'display' },
  flexDirection: { cssProperty: 'flexDirection' },
  alignItems: { cssProperty: 'alignItems' },
  alignContent: { cssProperty: 'alignContent' },
  alignSelf: { cssProperty: 'alignSelf' },
  justifyContent: { cssProperty: 'justifyContent' },
  justifyItems: { cssProperty: 'justifyItems' },
  justifySelf: { cssProperty: 'justifySelf' },
  flexWrap: { cssProperty: 'flexWrap' },
  flex: { cssProperty: 'flex' },
  flexGrow: { cssProperty: 'flexGrow' },
  flexShrink: { cssProperty: 'flexShrink' },
  flexBasis: { cssProperty: 'flexBasis', scale: 'sizes' },
  order: { cssProperty: 'order' },

  // Position
  position: { cssProperty: 'position' },
  top: { cssProperty: 'top', scale: 'space' },
  right: { cssProperty: 'right', scale: 'space' },
  bottom: { cssProperty: 'bottom', scale: 'space' },
  left: { cssProperty: 'left', scale: 'space' },

  // Outline (focus rings, etc.)
  outline: { cssProperty: 'outline' },
  outlineStyle: { cssProperty: 'outlineStyle' },
  outlineWidth: { cssProperty: 'outlineWidth', scale: 'borderWidths' },
  outlineColor: { cssProperty: 'outlineColor', scale: 'colors' },
  outlineOffset: { cssProperty: 'outlineOffset', scale: 'space' },

  // Effects
  opacity: { cssProperty: 'opacity', scale: 'opacities' },
  shadow: { cssProperty: 'boxShadow', scale: 'shadows' },
  boxShadow: { cssProperty: 'boxShadow', scale: 'shadows' },
  zIndex: { cssProperty: 'zIndex', scale: 'zIndices' },

  // Overflow
  overflow: { cssProperty: 'overflow' },
  overflowX: { cssProperty: 'overflowX' },
  overflowY: { cssProperty: 'overflowY' },

  // Cursor
  cursor: { cssProperty: 'cursor' },

  // Object (image / video sizing)
  objectFit: { cssProperty: 'objectFit' },
  objectPosition: { cssProperty: 'objectPosition' },
  aspectRatio: { cssProperty: 'aspectRatio' },
} as const satisfies Record<string, StylePropDefinition>;

/** All known style-prop names (used for prop filtering at runtime). */
export type StylePropName = keyof typeof stylePropsLiteral;

/**
 * The schema, exposed with the loose `StylePropDefinition` type so the
 * resolver can read `.scale` uniformly across entries (some have it, some
 * don't). Key autocomplete is preserved via `StylePropName`.
 */
export const styleProps: Readonly<Record<StylePropName, StylePropDefinition>> = stylePropsLiteral;

/** A set version for fast membership checks during prop filtering. */
export const STYLE_PROP_NAMES: ReadonlySet<string> = new Set(Object.keys(styleProps));

/** True iff the given key is a recognized style prop. */
export function isStyleProp(key: string): key is StylePropName {
  return STYLE_PROP_NAMES.has(key);
}

/**
 * Strongly-typed style props object. Each accepts a literal CSS value or a
 * `$`-prefixed token reference. Values are passed through React's normal
 * `style` prop, so React's pixel-auto-completion applies for length
 * properties (numeric width / height / etc. become `Npx`).
 */
export type StyleProps = {
  -readonly [K in StylePropName]?: string | number;
};

/**
 * Pseudo-state prop names. The runtime resolver and the compiler both
 * consume this list — keep it in core so there is one source of truth
 * across renderers and build-time tooling.
 *
 * `_focus` deliberately maps to `:focus-visible` (mouse-click focus does
 * not show the focus ring). See {@link PSEUDO_SELECTOR}.
 */
export const PSEUDO_STATE_PROP_NAMES = ['_hover', '_focus', '_active', '_disabled'] as const;

export type PseudoStatePropName = (typeof PSEUDO_STATE_PROP_NAMES)[number];

/** Set form for fast membership checks during prop filtering. */
export const PSEUDO_STATE_PROPS: ReadonlySet<string> = new Set(PSEUDO_STATE_PROP_NAMES);

/** True iff the given key is a recognized pseudo-state prop. */
export function isPseudoStateProp(key: string): key is PseudoStatePropName {
  return PSEUDO_STATE_PROPS.has(key);
}

/**
 * Pseudo-state prop → CSS selector suffix. The `_disabled` selector lists
 * `:disabled` first (covers native form controls) followed by
 * `&[aria-disabled="true"]` (covers non-form surfaces with `aria-disabled`).
 */
export const PSEUDO_SELECTOR: Readonly<Record<PseudoStatePropName, string>> = {
  _hover: ':hover',
  _focus: ':focus-visible',
  _active: ':active',
  _disabled: ':disabled, &[aria-disabled="true"]',
};

/**
 * Style bag for a pseudo-state. Same prop shape as {@link StyleProps} but
 * **flat** — no responsive object/array/DSL nesting in v1. (Responsive +
 * pseudo composition would require nesting at-rules under the pseudo
 * selector; planned for a later release.)
 */
export type StateStyleBag = {
  -readonly [K in keyof StyleProps]?: NonNullable<StyleProps[K]>;
};

/**
 * Pseudo-state props as React props — accepted by every styled primitive.
 * Each prop is an optional bag of flat style props applied when the
 * matching CSS pseudo-class is active.
 */
export type StateStyleProps = {
  -readonly [K in PseudoStatePropName]?: StateStyleBag;
};

/**
 * Motion-prop names. Mount/unmount transitions and prop-change transitions
 * — the schema lives here so the compiler (T3.6 / future) can recognise
 * the names statically.
 */
export const MOTION_PROP_NAMES = [
  'enterStyle',
  'exitStyle',
  'transition',
  'animation',
  'animateOnly',
] as const;

export type MotionPropName = (typeof MOTION_PROP_NAMES)[number];

/** Set form for fast membership checks during prop filtering. */
export const MOTION_PROPS: ReadonlySet<string> = new Set(MOTION_PROP_NAMES);

/** True iff the given key is a recognised motion prop. */
export function isMotionProp(key: string): key is MotionPropName {
  return MOTION_PROPS.has(key);
}

/**
 * Style bag applied during a motion phase (`enterStyle` on first mount,
 * `exitStyle` while the element is unmounting). Same shape as
 * {@link StateStyleBag}: flat style props, no responsive nesting.
 */
export type MotionStyleBag = StateStyleBag;

/**
 * Declarative shape for a single transition. Maps to CSS `transition-*`
 * properties. `duration` and `easing` accept either a literal CSS value
 * or a `$durations.<n>` / `$easings.<name>` token reference resolved
 * against the active theme.
 */
export interface TransitionObject {
  /** CSS property to transition (`'opacity'`, `'transform'`, `'all'`, …). Defaults to `'all'` when omitted. */
  readonly property?: string;
  /** Duration — CSS time string or a `$durations.<n>` token reference. Defaults to `'200ms'`. */
  readonly duration?: string;
  /** Easing curve — CSS keyword / cubic-bezier or a `$easings.<name>` token reference. Defaults to `'ease'`. */
  readonly easing?: string;
  /** Delay before the transition starts. Same value forms as `duration`. */
  readonly delay?: string;
}

/**
 * Permitted shapes for the `transition` prop:
 *
 * - Raw CSS string (`"opacity 200ms ease"`) — passed through verbatim.
 * - `TransitionObject` — declarative single property.
 * - `readonly TransitionObject[]` — multiple properties, joined with `,`.
 */
export type TransitionValue = string | TransitionObject | readonly TransitionObject[];

/**
 * Motion props as React props — accepted on every styled primitive on web.
 * On native they are accepted at the type level for cross-platform parity
 * but currently no-op (T1.2 will bring native motion via Reanimated).
 */
export type MotionStyleProps = {
  /** Initial style on first mount. The element transitions from these
   * values to the resolved target style during entry. SSR omits this
   * overlay — entry animations run on client-mounted elements only. */
  readonly enterStyle?: MotionStyleBag;
  /** Exit-state style overlay. Applied while the element is unmounting
   * via an exit-aware boundary (e.g. `Dialog.Content`); emitted as a
   * CSS rule keyed on `[data-motif-state="exiting"]`. */
  readonly exitStyle?: MotionStyleBag;
  /** Transition shorthand. Lands as the inline `transition` CSS value
   * on the rendered element so the browser can interpolate between
   * style changes. */
  readonly transition?: TransitionValue;
  /**
   * Named animation preset reference. Resolves against the active
   * theme's `animations` token scale (e.g. `"bouncy"`, `"snappy"`).
   * On web, expands to a CSS `transition` value; on native, supplies
   * the duration / easing for the entry driver. When both
   * `animation` and `transition` are set, `transition` takes
   * precedence (it's the more specific instruction).
   */
  readonly animation?: string;
  /**
   * Restrict the animation to a specific list of CSS properties (or
   * style-prop names). When omitted, the animation applies to all
   * changed properties (`transition: all <dur> <ease>` on web). Pass
   * `['transform']` for transform-only animation, or
   * `['opacity', 'transform']` for both.
   */
  readonly animateOnly?: readonly string[];
};
