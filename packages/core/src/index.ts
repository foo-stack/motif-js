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

export {
  PSEUDO_SELECTOR,
  PSEUDO_STATE_PROP_NAMES,
  PSEUDO_STATE_PROPS,
  STYLE_PROP_NAMES,
  isPseudoStateProp,
  isStyleProp,
  styleProps,
} from './style-props.js';
export type {
  PseudoStatePropName,
  StateStyleBag,
  StateStyleProps,
  StylePropDefinition,
  StylePropName,
  StyleProps,
} from './style-props.js';

export { resolveResponsiveStylesToVars, resolveStyles, resolveStylesToVars } from './style.js';
export type { AtRule, ResolveResponsiveResult, ResolveStylesResult } from './style.js';

export {
  BASE_BREAKPOINT_KEY,
  RESPONSIVE_ARRAY_SLOTS,
  RESPONSIVE_KEYS,
  containerQueryForBreakpoint,
  defaultBreakpoints,
  isResponsiveObject,
  mediaQueryForBreakpoint,
  parseResponsiveDSL,
  parseResponsiveKey,
  responsiveArrayToObject,
} from './breakpoints.js';
export type { BreakpointName, ResponsiveKey } from './breakpoints.js';

export {
  themeToCssBlock,
  themeToCssVars,
  themesToCssBlock,
  tokenPathToCssVarName,
  tokenRefToCssVar,
} from './css-vars.js';

export {
  buildAtRulesCss,
  buildPseudoCss,
  camelToKebab,
  hashAtRules,
  hashPseudoRules,
  hashString,
  maybePx,
  stringifyDeclarations,
} from './css-emit.js';
export type { PseudoRule } from './css-emit.js';
