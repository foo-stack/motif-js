/**
 * @motif-js/core — engine.
 *
 * Tokens, themes, the style-prop schema, and the runtime resolvers.
 * Both renderers (web, native) and the compiler consume from here.
 */

export const PACKAGE_NAME = '@motif-js/core';

export type {
  AnimationToken,
  CSSValue,
  ResolvedStyle,
  ScaleName,
  SpringAnimationToken,
  StyleValue,
  Theme,
  TimingAnimationToken,
  TokenMap,
  TokenNode,
  TokenRef,
  TokenScale,
  TokenValue,
} from './types.js';

export { isTokenRef, resolveToken, resolveValue } from './token.js';
export type { ResolveTokenOptions } from './token.js';

export { createTheme } from './createTheme.js';

export {
  MOTION_PROP_NAMES,
  MOTION_PROPS,
  PSEUDO_SELECTOR,
  PSEUDO_STATE_PROP_NAMES,
  PSEUDO_STATE_PROPS,
  STYLE_PROP_NAMES,
  isMotionProp,
  isPseudoStateProp,
  isStyleProp,
  styleProps,
} from './style-props.js';
export type {
  MotionPropName,
  MotionStyleBag,
  MotionStyleProps,
  PseudoStatePropName,
  StateStyleBag,
  StateStyleProps,
  StylePropDefinition,
  StylePropName,
  StyleProps,
  TransitionObject,
  TransitionValue,
} from './style-props.js';

export {
  buildAnimationCss,
  resolveAnimationToken,
  resolveTransition,
  resolveTransitionToVars,
  springToCssTiming,
} from './motion.js';

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
