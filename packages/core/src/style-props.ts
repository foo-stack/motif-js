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
