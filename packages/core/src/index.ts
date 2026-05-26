/**
 * @usemotif/core — engine.
 *
 * Tokens, themes, the style-prop schema, and the runtime resolvers.
 * Both renderers (web, native) and the compiler consume from here.
 */

export const PACKAGE_NAME = '@usemotif/core';

export type {
  AnimationToken,
  CSSValue,
  Direction,
  FontFace,
  FontSource,
  ReducedMotionMode,
  ResolvedStyle,
  ScaleName,
  SpringAnimationToken,
  StyleValue,
  Theme,
  ThemeRootStyles,
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
  PSEUDO_ELEMENT_PROP_NAMES,
  PSEUDO_ELEMENT_PROPS,
  PSEUDO_ELEMENT_SELECTOR,
  PSEUDO_SELECTOR,
  PSEUDO_STATE_PROP_NAMES,
  PSEUDO_STATE_PROPS,
  STYLE_PROP_NAMES,
  TRANSFORM_AXIS_NAMES,
  TRANSFORM_AXIS_SET,
  isKeyframe,
  isMotionProp,
  isPseudoElementProp,
  isPseudoStateProp,
  isStyleProp,
  keyframeBrand,
  serializeFontVariationSettings,
  styleProps,
} from './style-props.js';
export type {
  AnimationObject,
  AnimationValue,
  FontVariationAxisSettings,
  Keyframe,
  MotionPropName,
  MotionStyleBag,
  MotionStyleProps,
  PseudoElementPropName,
  PseudoElementStyleBag,
  PseudoElementStyleProps,
  PseudoStatePropName,
  StateStyleBag,
  StateStyleProps,
  StylePropDefinition,
  StylePropName,
  StyleProps,
  TransformAxis,
  TransitionObject,
  TransitionValue,
} from './style-props.js';

export { composeTransformAxesNative, composeTransformAxesWeb } from './transform-composer.js';
export type { NativeTransformEntry, TransformAxes } from './transform-composer.js';

export {
  buildAnimationCss,
  buildAnimationShorthand,
  extractKeyframeFromAnimation,
  resolveAnimationToken,
  resolveTransition,
  resolveTransitionToVars,
  springToCssTiming,
} from './motion.js';

export { createMotionValue, isMotionValue, motionValueBrand } from './motion-value.js';
export type {
  MotionValue,
  MotionValueWideningOf,
  MotionValueWidenedProp,
} from './motion-value.js';

export { classifyOutputRange, interpolateOutputs } from './output-interpolator.js';
export type { OutputRangeKind } from './output-interpolator.js';

export { keyframesToCss, makeKeyframe } from './keyframes.js';
export type { KeyframeDef } from './keyframes.js';

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
  fontFacesToCss,
  reducedMotionGuardCss,
  rootResetsToCss,
  themesRuntimeCss,
} from './runtime-css.js';

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
