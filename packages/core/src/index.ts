/**
 * @motif-js/core — engine.
 *
 * Tokens, themes, the style-prop schema, and the runtime resolvers.
 * Both renderers (web, native) and the compiler consume from here.
 */

export const PACKAGE_NAME = '@motif-js/core';

export type {
  CSSValue,
  ResolvedStyle,
  ScaleName,
  StyleValue,
  Theme,
  TokenMap,
  TokenNode,
  TokenRef,
  TokenScale,
  TokenValue,
} from './types.js';

export { isTokenRef, resolveToken, resolveValue } from './token.js';
export type { ResolveTokenOptions } from './token.js';

export { STYLE_PROP_NAMES, isStyleProp, styleProps } from './style-props.js';
export type { StylePropDefinition, StylePropName, StyleProps } from './style-props.js';

export { resolveStyles } from './style.js';
export type { ResolveStylesResult } from './style.js';
